import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import AddEmployeeModal from '@/components/dashboard/hr/employee-directory/add-employee';
import SuccessModal from '@/components/dashboard/hr/success-modal';
import { Button } from '@/components/ui/button';
import { AddIcon, EyeIcon, EditIcon, DeleteIcon } from '@/components/ui/svgs';
import MetricCard from '@/components/dashboard/hr/metric-card';
import EmployeeService from '@/api/employee';
import { useUserStore } from '@/stores/user-store';
import Header from '@/components/customs/header';
import { DataTable } from '@/components/ui/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontalIcon } from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getInitials = (name) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

const getAvatarColor = (name) => {
  const colors = [
    'bg-blue-600',
    'bg-red-600',
    'bg-green-600',
    'bg-purple-600',
    'bg-amber-600',
  ];
  const i =
    name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
  return colors[i];
};

// ─── Status colours ───────────────────────────────────────────────────────────
const STATUS_COLORS = {
  Active: { bg: '#24A9591A', text: '#24A959' },
  Onboarding: { bg: '#4B55631A', text: '#4B5563' },
  'On Leave': { bg: '#F39C121A', text: '#F39C12' },
  Exited: { bg: '#EF44441A', text: '#EF4444' },
  Inactive: { bg: '#F3F4F6', text: '#6B7280' },
};

// ─── Dropdown filter items for DataTable ──────────────────────────────────────
const dropdownItems = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'Active' },
  { label: 'Onboarding', value: 'Onboarding' },
  { label: 'On Leave', value: 'On Leave' },
  { label: 'Exited', value: 'Exited' },
];

// Set to true to test list, detail, and "Test success modal" without API
const USE_MOCK_FOR_TESTING = true;

const mockEmployees = [
  {
    id: '1',
    firstName: 'Nathaniel',
    lastName: 'Desire',
    positionTitle: 'Senior Software Engineer',
    department: 'Engineering',
    employeeId: '345321231',
    status: 'ONBOARDING',
  },
  {
    id: '2',
    firstName: 'Femi',
    lastName: 'Johnson',
    positionTitle: 'Senior Software Engineer',
    department: 'Engineering',
    employeeId: '345321232',
    status: 'ON_LEAVE',
  },
  {
    id: '3',
    firstName: 'Sarah',
    lastName: 'Adeyemi',
    positionTitle: 'Senior Software Engineer',
    department: 'Engineering',
    employeeId: '345321233',
    status: 'TERMINATED',
  },
  {
    id: '4',
    firstName: 'Kemi',
    lastName: 'Jakada',
    positionTitle: 'Senior Software Engineer',
    department: 'Engineering',
    employeeId: '345321234',
    status: 'ACTIVE',
  },
];

const mockAnalytics = {
  totalEmployees: 150,
  activeEmployees: 20,
  onLeave: 70,
  exitedEmployees: 50,
};

// ─── Transform raw API / mock data to table format ────────────────────────────
const transformEmployeeData = (employeesData) => {
  return employeesData.map((employee) => {
    const fullName =
      `${employee.firstName || ''} ${employee.lastName || ''}`.trim();
    return {
      id: employee.id || employee._id,
      name: fullName || '-',
      avatarInitials: getInitials(fullName || 'NA'),
      avatarColor: getAvatarColor(fullName || ''),
      role: employee.positionTitle || employee.position || '-',
      department: employee.departmentName || employee.department || '-',
      employeeId: employee.employeeId || '-',
      status:
        employee.status === 'ACTIVE'
          ? 'Active'
          : employee.status === 'ON_LEAVE'
            ? 'On Leave'
            : employee.status === 'TERMINATED' || employee.status === 'EXITED'
              ? 'Exited'
              : employee.status === 'ONBOARDING'
                ? 'Onboarding'
                : 'Inactive',
    };
  });
};

// ─── Metric chart placeholder ─────────────────────────────────────────────────
const sampleChartData = [
  { month: 'Jan', month1: 600 },
  { month: 'Feb', month2: 800 },
  { month: 'Mar', month3: 1000 },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EmployeeDirectory() {
  const [isCreateEmployeeOpen, setIsCreateEmployeeOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { activeBusiness } = useUserStore();
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    onLeave: 0,
    exitedEmployees: 0,
  });
  const navigate = useNavigate();

  // Transform raw employees into table-ready rows
  const employeeData = transformEmployeeData(employees);

  // ─── useDataTable for search, filter, pagination ────────────────────────────
  const {
    currentTableData,
    pagination,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    setCurrentPage,
  } = useDataTable({
    data: employeeData,
    pageSize: 8,
    filterKeys: ['name', 'role', 'department', 'employeeId', 'status'],
    statusKey: 'status',
  });

  // ─── Metric cards ───────────────────────────────────────────────────────────
  const metricsData = [
    {
      title: 'Total Employees',
      value: analytics.totalEmployees,
      percentage: 5,
      isPositive: true,
      chartData: sampleChartData,
    },
    {
      title: 'Active Employees',
      value: analytics.activeEmployees,
      percentage: 2,
      isPositive: false,
      chartData: sampleChartData,
    },
    {
      title: 'On Leave',
      value: analytics.onLeave,
      percentage: 5,
      isPositive: true,
      chartData: sampleChartData,
    },
    {
      title: 'Exited Employees',
      value: analytics.exitedEmployees,
      percentage: 2,
      isPositive: true,
      chartData: sampleChartData,
    },
  ];

  // ─── Row action handler ─────────────────────────────────────────────────────
  const handleEmployeeAction = (action, employee) => {
    switch (action) {
      case 'view':
        navigate(`/dashboard/hr/employee-directory/employees/${employee.id}`);
        break;
      case 'edit':
        console.log('Edit employee:', employee.id);
        break;
      case 'delete':
        console.log('Delete employee:', employee.id);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  // ─── Table columns ──────────────────────────────────────────────────────────
  const columns = [
    {
      header: 'Employee Name',
      accessorKey: 'name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-9 shrink-0">
            <AvatarImage src={row.avatarUrl} alt={row.name} />
            <AvatarFallback
              className={`${row.avatarColor || 'bg-blue-600'} text-xs font-medium text-white`}
            >
              {row.avatarInitials}
            </AvatarFallback>
          </Avatar>
          <span className="truncate text-sm font-medium">{row.name}</span>
        </div>
      ),
    },
    { header: 'Role', accessorKey: 'role' },
    { header: 'Department', accessorKey: 'department' },
    { header: 'Employee ID', accessorKey: 'employeeId' },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => {
        const style = STATUS_COLORS[row.status] ?? {
          bg: '#F3F4F6',
          text: '#6B7280',
        };
        return (
          <span
            className="flex max-w-28 items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap"
            style={{ backgroundColor: style.bg, color: style.text }}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      className: 'text-right',
      cell: (row) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontalIcon className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleEmployeeAction('view', row)}
              >
                <EyeIcon className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleEmployeeAction('edit', row)}
              >
                <EditIcon className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleEmployeeAction('delete', row)}
                className="text-red-600"
              >
                <DeleteIcon className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  // ─── Fetch employee data ────────────────────────────────────────────────────
  useEffect(() => {
    if (activeBusiness) {
      const fetchEmployeeData = async () => {
        try {
          setIsLoading(true);

          if (USE_MOCK_FOR_TESTING) {
            setEmployees(mockEmployees);
            setAnalytics(mockAnalytics);
            setIsLoading(false);
            return;
          }

          const response = await EmployeeService.fetch({
            page: 1,
            perPage: 100,
          });

          const responseData = response.data?.data || {};
          const employeesData = responseData.employees || [];
          setEmployees(employeesData);

          // Fetch analytics data
          const analyticsRes = await EmployeeService.analytics();
          setAnalytics(
            analyticsRes.data?.data || {
              totalEmployees: 0,
              activeEmployees: 0,
              onLeave: 0,
              exitedEmployees: 0,
            }
          );
        } catch (error) {
          console.error('Error fetching employee data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchEmployeeData();
    }
  }, [activeBusiness, isCreateEmployeeOpen]);

  return (
    <div className="my-4 min-h-screen">
      <Header
        title="Employee Directory"
        description="View and manage all employees records in one centralized directory"
        hasYoutubeButton={true}
      >
        <Button
          onClick={() => setIsCreateEmployeeOpen(true)}
          className="rounded-xl md:py-6"
        >
          <AddIcon />
          Add New Employee
        </Button>
      </Header>

      {/* Metric Cards */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metricsData.map((metric) => (
          <MetricCard
            key={metric.title}
            {...metric}
            emptyState={true}
            emojis={metric.emojis}
          />
        ))}
      </div>

      {/* Table */}
      <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
        <DataTable
          columns={columns}
          data={currentTableData}
          title="All Employees"
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={setCurrentPage}
          placeholder="Search employee..."
          inputValue={searchTerm}
          handleInputChange={(e) => setSearchTerm(e.target.value)}
          dropdownItems={dropdownItems}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          setSearchTerm={setSearchTerm}
        />
      </div>

      <AddEmployeeModal
        open={isCreateEmployeeOpen}
        onOpenChange={setIsCreateEmployeeOpen}
        onSuccess={() => setIsSuccessModalOpen(true)}
      />

      <SuccessModal
        open={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
        title="Employee Added"
        subtitle="You've successfully Added an Employee"
      />
    </div>
  );
}
