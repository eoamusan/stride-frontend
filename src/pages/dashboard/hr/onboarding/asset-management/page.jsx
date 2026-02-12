import MetricCard from '@/components/dashboard/hr/metric-card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontalIcon,
  EyeIcon,
  CheckCheck,
  SearchIcon,
  FilterIcon,
} from 'lucide-react';
import { useState } from 'react';
import { assetManagementDummyData } from './dummyData';

export default function AssetManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const itemsPerPage = 5;

  // Filter logic
  const filteredData = assetManagementDummyData.filter((item) => {
    const matchesSearch = item.employeeName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentTableData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const isLoading = false;

  // Calculate Metrics
  const employeesOnboardingCount = 150; // Mocked as per image
  const pendingAssignmentCount = 20; // Mocked as per image
  const assetsAssignedCount = 70; // Mocked as per image
  const completedAssignmentCount = 50; // Mocked as per image

  const sampleChartData = [
    { month: 'Jan', month1: 600 },
    { month: 'Feb', month2: 800 },
    { month: 'Mar', month3: 1000 },
    { month: 'Apr', month4: 1200 },
  ];

  const metricCardsData = [
    {
      title: 'Employees Onboarding',
      value: employeesOnboardingCount,
      percentage: 5,
      isPositive: true,
      chartData: sampleChartData,
    },
    {
      title: 'Pending Assignment',
      value: pendingAssignmentCount,
      percentage: -2,
      isPositive: false,
      chartData: sampleChartData,
    },
    {
      title: 'Assets Assigned',
      value: assetsAssignedCount,
      percentage: 5,
      isPositive: true,
      chartData: sampleChartData,
    },
    {
      title: 'Completed Assignment',
      value: completedAssignmentCount,
      percentage: 2,
      isPositive: true,
      chartData: sampleChartData,
    },
  ];

  const columns = [
    { header: 'Employee Name', accessorKey: 'employeeName' },
    { header: 'Role', accessorKey: 'role' },
    { header: 'Department', accessorKey: 'department' },
    { header: 'Start Date', accessorKey: 'startDate' },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => {
        const status = row.status;
        const statusColors = {
          'In Progress': { bg: '#FFF7E6', text: '#FF9500' }, // Orange/Yellow
          'Not Started': { bg: '#F5F5F5', text: '#757575' }, // Grey
          Completed: { bg: '#E8F5E9', text: '#34C759' }, // Green
        };
        const style = statusColors[status] || {
          bg: '#F5F5F5',
          text: '#757575',
        };

        return (
          <span
            className="flex max-w-32 items-center justify-center rounded-full px-3 py-2 text-xs font-medium whitespace-nowrap"
            style={{
              backgroundColor: style.bg,
              color: style.text,
            }}
          >
            {status}
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
              <DropdownMenuItem onClick={() => console.log('View', row.id)}>
                <EyeIcon className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Assign', row.id)}>
                <CheckCheck className="mr-2 h-4 w-4" />
                Assign Asset
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const dummyActionElement = (
    <div className="flex items-center gap-2">
      <div className="relative">
        <SearchIcon className="absolute top-2.5 left-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Search job..."
          className="w-64 rounded-xl bg-gray-50 pl-9"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl border-gray-200"
          >
            <FilterIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {['All', 'In Progress', 'Not Started', 'Completed'].map((status) => (
            <DropdownMenuCheckboxItem
              key={status}
              checked={statusFilter === status}
              onCheckedChange={() => {
                setStatusFilter(status);
                setCurrentPage(1);
              }}
            >
              {status}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <div className="my-5">
      <hgroup>
        <h1 className="text-2xl font-bold">Asset Management</h1>
        <p className="text-sm text-[#7D7D7D]">Manage Employee Assets</p>
      </hgroup>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metricCardsData.map((metric) => (
          <MetricCard
            key={metric.title}
            {...metric}
            emptyState={false}
            emojis={metric.emojis}
          />
        ))}
      </div>

      <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
        <DataTable
          columns={columns}
          data={currentTableData}
          title="Asset Assignment Queue"
          actionElement={dummyActionElement}
          isLoading={isLoading}
          pagination={{
            page: currentPage,
            totalPages: totalPages,
          }}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
