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
  CheckIcon,
} from 'lucide-react';
import { useState } from 'react';
import { onboardingDummyData } from './dummyData';

export default function HROnboarding() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const itemsPerPage = 5;

  // Filter logic
  const filteredData = onboardingDummyData.filter((item) => {
    const matchesSearch = item.employeeName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' || item.onboardingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentTableData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const isLoading = false;

  // Calculate Metrics
  const totalOnboardings = onboardingDummyData.length;
  const offerAcceptedCount = onboardingDummyData.filter(
    (i) => i.onboardingStatus === 'Offer Accepted'
  ).length;
  const dataSubmittedCount = onboardingDummyData.filter(
    (i) => i.onboardingStatus === 'Data Submitted'
  ).length;
  const hrValidationCount = onboardingDummyData.filter(
    (i) => i.onboardingStatus === 'HR Validation'
  ).length;
  const assetAssignedCount = onboardingDummyData.filter(
    (i) => i.onboardingStatus === 'Asset Assigned'
  ).length;

  const sampleChartData = [
    { month: 'Jan', month1: 600 },
    { month: 'Feb', month2: 800 },
    { month: 'Mar', month3: 1000 },
    { month: 'Apr', month4: 1200 },
  ];

  const metricCardsData = [
    {
      title: 'Validation Queue',
      value: totalOnboardings,
      percentage: 0,
      isPositive: true,
      chartData: sampleChartData,
    },
    {
      title: 'Offer Accepted',
      value: offerAcceptedCount,
      percentage: 0,
      isPositive: false,
      chartData: sampleChartData,
    },
    {
      title: 'HR Validation',
      value: hrValidationCount,
      percentage: 0,
      isPositive: false,
      chartData: sampleChartData,
    },
    {
      title: 'Asset Assigned',
      value: assetAssignedCount,
      percentage: 0,
      isPositive: true,
      chartData: sampleChartData,
    },
  ];

  const columns = [
    { header: 'Employee Name', accessorKey: 'employeeName' },
    { header: 'Role', accessorKey: 'role' },
    { header: 'Start Date', accessorKey: 'startDate' },
    {
      header: 'Onboarding Status',
      accessorKey: 'onboardingStatus',
      cell: (row) => {
        const status = row.onboardingStatus;
        const steps = [
          'Offer Accepted',
          'Data Submitted',
          'HR Validation',
          'Asset Assigned',
        ];
        const currentIdx = steps.indexOf(status);

        return (
          <div className="flex w-full min-w-[300px] items-center justify-between px-2">
            {steps.map((step, i) => {
              const isLast = i === steps.length - 1;
              const isCompleted = i <= currentIdx;
              const isCurrent = i === currentIdx;

              return (
                <div key={step} className="flex flex-1 items-center">
                  <div className="relative flex flex-col items-center">
                    {/* Circle */}
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-medium transition-colors ${
                        isCompleted
                          ? 'bg-[#10B981] text-white'
                          : 'bg-white text-gray-400 ring-1 ring-gray-200'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckIcon className="h-3.5 w-3.5" />
                      ) : (
                        i + 1
                      )}
                    </div>
                    {/* Label */}
                    <span
                      className={`absolute -bottom-4 w-max text-[9px] font-medium ${
                        isCurrent ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                  {/* Line */}
                  {!isLast && (
                    <div
                      className={`mx-2 h-px flex-1 border-t border-dashed ${
                        i < currentIdx ? 'border-[#10B981]' : 'border-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
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
              <DropdownMenuItem onClick={() => console.log('Validate', row.id)}>
                <CheckCheck className="mr-2 h-4 w-4" />
                Validate
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
          placeholder="Search employee..."
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
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Filter by Stage</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {[
            'All',
            'Offer Accepted',
            'Data Submitted',
            'HR Validation',
            'Asset Assigned',
          ].map((status) => (
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
        <h1 className="text-2xl font-bold">Onboarding</h1>
        <p className="text-sm text-[#7D7D7D]">Manage Employee Onboarding</p>
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
          title="Employees Onboarding"
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
