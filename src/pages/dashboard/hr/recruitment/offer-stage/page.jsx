import MetricCard from '@/components/dashboard/hr/metric-card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontalIcon, EyeIcon, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router';
import { offerStageDummyData } from './dummyData';
import Header from '@/components/customs/header';
import { useDataTable } from '@/hooks/use-data-table';

export default function OfferStage() {
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
    data: offerStageDummyData,
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
      title: 'Total Offers',
      value: '12,345',
      chartData: sampleChartData,
    },
    {
      title: 'Accepted Offers',
      value: '5,678',
      chartData: sampleChartData,
    },
    {
      title: 'Rejected Offers',
      value: '2,345',
      chartData: sampleChartData,
    },
    {
      title: 'Pending Offers',
      value: '1,234',
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
          'Offer Sent': { bg: '#3498DB1A', text: '#3498DB' }, // Blue
          Pending: { bg: '#F39C121A', text: '#F39C12' }, // Orange
          Accepted: { bg: '#24A9591A', text: '#24A959' }, // Green
          Rejected: { bg: '#E74C3C1A', text: '#E74C3C' }, // Red
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
                onClick={() => console.log('View Offer', row.id)}
              >
                Download Offer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const dropdownItems = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Accepted', value: 'Accepted' },
    { label: 'Rejected', value: 'Rejected' },
    { label: 'Offer Sent', value: 'Offer Sent' },
    { label: 'Pending', value: 'Pending' },
  ];

  return (
    <div className="my-5">
      <Header title="Offer Stage" description="Manage Offer Stage" />

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
          title="Offers"
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={setCurrentPage}
          placeholder="Search Offers..."
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
