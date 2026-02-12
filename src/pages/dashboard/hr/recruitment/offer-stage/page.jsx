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
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { offerStageDummyData } from './dummyData';

export default function OfferStage() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const itemsPerPage = 5;

  // Filter logic
  const filteredData = offerStageDummyData.filter((item) => {
    const matchesSearch = item.applicantName
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
                Accepted
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
          placeholder="Search by name..."
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
            className="gap-2 rounded-xl border-gray-200"
          >
            <FilterIcon className="h-4 w-4" />
            Filter by Status
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {['All', 'Accepted', 'Rejected', 'Offer Sent', 'Pending'].map(
            (status) => (
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
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <div className="my-5">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Offer Stage</h1>
          <p className="text-sm text-[#7D7D7D]">Manage Offer Stage</p>
        </hgroup>
      </div>

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
