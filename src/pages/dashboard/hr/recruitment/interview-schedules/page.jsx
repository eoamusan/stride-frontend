import { useState } from 'react';
import { useNavigate } from 'react-router';
import MetricCard from '@/components/dashboard/hr/metric-card';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CheckCheck,
  MoreHorizontalIcon,
  EyeIcon,
  SearchIcon,
  FilterIcon,
} from 'lucide-react';
import { interviewSchedulesDummyData } from './dummyData';
import { Input } from '@/components/ui/input';
import Header from '@/components/customs/header';

export default function InterviewAndSchedules() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const itemsPerPage = 5;

  const filteredData = interviewSchedulesDummyData.filter((item) => {
    const matchesSearch = item.applicantName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'All Statuses' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentTableData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const isLoading = false;

  const actionElement = (
    <div className="flex w-full items-center gap-3 md:w-auto">
      <div className="relative w-full">
        <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
        <Input
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          placeholder="Search Interviews..."
          className="w-full pl-10 md:max-w-80"
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <FilterIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {['All Statuses', 'Upcoming', 'Pending', 'Completed'].map(
            (status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1); // Reset to first page on filter change
                }}
              >
                {status}
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const sampleChartData = [
    { month: 'Jan', month1: 600 },
    { month: 'Feb', month2: 800 },
    { month: 'Mar', month3: 1000 },
    { month: 'Apr', month4: 1200 },
  ];

  const metricsData = [
    {
      title: 'Total Interviews',
      value: 150,
      percentage: 5,
      chartData: sampleChartData,
    },
    {
      title: 'Upcoming Interviews',
      value: 50,
      percentage: 2,
      chartData: sampleChartData,
    },
    {
      title: 'Pending Interviews',
      value: 20,
      percentage: -2,
      chartData: sampleChartData,
      isPositive: false,
    },
    {
      title: 'Completed Interviews',
      value: 70,
      percentage: 5,
      chartData: sampleChartData,
    },
  ];

  const columns = [
    { header: 'Applicant Name', accessorKey: 'applicantName' },
    { header: 'Interview Type', accessorKey: 'interviewType' },
    { header: 'Interview Date', accessorKey: 'interviewDate' },
    { header: 'Interview Time', accessorKey: 'interviewTime' },
    { header: 'Role Applied', accessorKey: 'roleApplied' },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => {
        let status = row.status;

        const statusColors = {
          Upcoming: { bg: '#3498DB1A', text: '#3498DB' },
          Pending: { bg: '#F39C121A', text: '#F39C12' },
          Completed: { bg: '#24A9591A', text: '#24A959' },
        };
        const style = statusColors[status] || {
          bg: '#CE8D001A',
          text: '#CE8D00',
        };

        return (
          <span
            className="inline-block w-24 overflow-hidden rounded-full py-2 text-center text-xs font-medium"
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
              <DropdownMenuItem
                onClick={() =>
                  navigate(
                    `/dashboard/hr/recruitment/interview-schedules/detail/${row.id}`
                  )
                }
              >
                <EyeIcon className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Edit', row.id)}>
                <CheckCheck className="mr-2 h-4 w-4" />
                Completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div className="my-5">
      <Header
        title="Interview and Schedules"
        description="Manage Interview and Schedules"
      />
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metricsData.map((metric) => (
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
          title="Interviews"
          actionElement={actionElement}
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
