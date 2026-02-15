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
import { CheckCheck, MoreHorizontalIcon, EyeIcon } from 'lucide-react';
import { interviewSchedulesDummyData } from './dummyData';
import Header from '@/components/customs/header';
import { useDataTable } from '@/hooks/use-data-table';

export default function InterviewAndSchedules() {
  const navigate = useNavigate();

  const {
    currentTableData,
    pagination,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    setCurrentPage,
  } = useDataTable({
    data: interviewSchedulesDummyData,
    pageSize: 5,
    filterKeys: ['applicantName', 'status', 'interviewType'],
  });

  const isLoading = false;

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

  const dropdownItems = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Upcoming', value: 'Upcoming' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Completed', value: 'Completed' },
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
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={setCurrentPage}
          placeholder="Search Interviews..."
          inputValue={searchTerm}
          handleInputChange={(e) => setSearchTerm(e.target.value)}
          dropdownItems={dropdownItems}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          setSearchTerm={setSearchTerm}
        />
      </div>
    </div>
  );
}
