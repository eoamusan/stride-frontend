import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import AddEmployeeModal from '@/components/dashboard/hr/employee-directory/add-employee';
import EmployeeTable from '@/components/dashboard/hr/employee-directory/employee-table';
import SuccessModal from '@/components/dashboard/hr/success-modal';
import { Button } from '@/components/ui/button';
import { AddIcon, EyeIcon, EditIcon, DeleteIcon } from '@/components/ui/svgs';
import MetricCard from '@/components/dashboard/hr/metric-card';
import EmployeeService from '@/api/employee';
import { useUserStore } from '@/stores/user-store';
import youtubeIcon from '@/assets/icons/youtube-red.png';

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

const employeeDropdownActions = [
  { key: 'view', label: 'View', icon: EyeIcon },
  { key: 'edit', label: 'Edit', icon: EditIcon },
  { key: 'delete', label: 'Delete', icon: DeleteIcon },
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

export default function EmployeeDirectory() {
  const [isCreateEmployeeOpen, setIsCreateEmployeeOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { activeBusiness } = useUserStore();
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [paginationData, setPaginationData] = useState({
    page: 1,
    totalPages: 1,
    pageSize: 20,
    totalCount: 0,
  });
  const [analytics, setAnalytics] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    onLeave: 0,
    exitedEmployees: 0,
  });
  const navigate = useNavigate();

  // Transform employee data to match table format
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

  const employeeData = transformEmployeeData(employees);

  // Metric data and card pattern from HR Overview
  const metricsData = [
    {
      title: 'Total Employees',
      value: analytics.totalEmployees,
      percentage: 5,
      isPositive: true,
      chartData: [
        { month: 'Jan', month1: 600 },
        { month: 'Feb', month2: 800 },
        { month: 'Mar', month3: 1000 },
      ],
    },
    {
      title: 'Active Employees',
      value: analytics.activeEmployees,
      percentage: 2,
      isPositive: false,
      chartData: [
        { month: 'Jan', month1: 1000 },
        { month: 'Feb', month2: 800 },
        { month: 'Mar', month3: 600 },
      ],
    },
    {
      title: 'On Leave',
      value: analytics.onLeave,
      percentage: 5,
      isPositive: true,
      chartData: [
        { month: 'Jan', month1: 600 },
        { month: 'Feb', month2: 800 },
        { month: 'Mar', month3: 1000 },
      ],
    },
    {
      title: 'Exited Employees',
      value: analytics.exitedEmployees,
      percentage: 2,
      isPositive: true,
      chartData: [
        { month: 'Jan', month1: 600 },
        { month: 'Feb', month2: 800 },
        { month: 'Mar', month3: 1000 },
      ],
    },
  ];

  const handleEmployeeTableAction = (action, employee) => {
    switch (action) {
      case 'view':
        navigate(`/dashboard/hr/employee-directory/employees/${employee.id}`);
        break;
      case 'edit':
        // TODO: Open edit modal
        console.log('Edit employee:', employee.id);
        break;
      case 'delete':
        // TODO: Confirm and call delete API
        console.log('Delete employee:', employee.id);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    if (activeBusiness) {
      // Fetch employee data based on businessId
      const fetchEmployeeData = async () => {
        try {
          setIsLoading(true);

          if (USE_MOCK_FOR_TESTING) {
            setEmployees(mockEmployees);
            setAnalytics(mockAnalytics);
            setPaginationData({
              page: 1,
              totalPages: 1,
              pageSize: 20,
              totalCount: mockEmployees.length,
            });
            setIsLoading(false);
            return;
          }

          const response = await EmployeeService.fetch({
            page: currentPage,
            perPage: paginationData.pageSize,
          });

          // Extract employee data from response
          const responseData = response.data?.data || {};
          const employeesData = responseData.employees || [];

          setEmployees(employeesData);

          // Update pagination data from API response
          setPaginationData({
            page: responseData.page || 1,
            totalPages: responseData.totalPages || 1,
            pageSize: responseData.limit || 20,
            totalCount: responseData.totalDocs || employeesData.length,
          });

          // Fetch analytics data
          const analyticsRes = await EmployeeService.analytics();
          console.log('Employee analytics data:', analyticsRes.data);
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
  }, [
    activeBusiness,
    isCreateEmployeeOpen,
    currentPage,
    paginationData.pageSize,
  ]);

  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Employee Directory</h1>
          <p className="text-sm text-[#7D7D7D]">
            View and manage all employees records in one centralized directory
          </p>
        </hgroup>

        <div className="flex items-center gap-4">
          <Button variant={'outline'} className={'h-10 rounded-lg text-sm'}>
            <img src={youtubeIcon} alt="YouTube Icon" className="mr-1 h-4" />
            See video guide
          </Button>
          <Button
            onClick={() => setIsCreateEmployeeOpen(true)}
            className="h-10 gap-2 rounded-lg bg-[#6C2BD9] px-5 text-sm font-medium text-white hover:bg-[#5A23B8]"
          >
            <AddIcon />
            Add New Employee
          </Button>
          {USE_MOCK_FOR_TESTING && (
            <Button
              variant="outline"
              onClick={() => setIsSuccessModalOpen(true)}
              className="h-10 text-sm"
            >
              Test success modal
            </Button>
          )}
        </div>
      </div>

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

      <div className="mt-10">
        <EmployeeTable
          data={employeeData}
          isLoading={isLoading}
          paginationData={paginationData}
          onPageChange={handlePageChange}
          onRowAction={handleEmployeeTableAction}
          dropdownActions={employeeDropdownActions}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={setSelectedDepartment}
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
