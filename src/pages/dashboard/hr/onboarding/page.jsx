import MetricCard from '@/components/dashboard/hr/metric-card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontalIcon,
  EyeIcon,
  CheckCheck,
  CheckIcon,
  FilterIcon,
} from 'lucide-react';
import { useDataTable } from '@/hooks/use-data-table';
import { onboardingDummyData } from './dummyData';

// ─── Onboarding stages ────────────────────────────────────────────────────────
const STAGES = [
  'Offer Accepted',
  'Data Submitted',
  'HR Validation',
  'Asset Assigned',
];

const FILTER_ITEMS = ['All', ...STAGES];

// ─── Status pipeline cell ─────────────────────────────────────────────────────
function OnboardingPipeline({ status }) {
  const currentIdx = STAGES.indexOf(status);

  return (
    <div className="flex w-full min-w-[300px] items-center justify-between px-2">
      {STAGES.map((step, i) => {
        const isLast = i === STAGES.length - 1;
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
                {isCompleted ? <CheckIcon className="h-3.5 w-3.5" /> : i + 1}
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
            {/* Connector line */}
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
}

// ─── Table columns ────────────────────────────────────────────────────────────
const columns = [
  { header: 'Employee Name', accessorKey: 'employeeName' },
  { header: 'Role', accessorKey: 'role' },
  { header: 'Start Date', accessorKey: 'startDate' },
  {
    header: 'Onboarding Status',
    accessorKey: 'onboardingStatus',
    cell: (row) => <OnboardingPipeline status={row.onboardingStatus} />,
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
            <button
              className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-gray-100"
              onClick={() => console.log('View', row.id)}
            >
              <EyeIcon className="h-4 w-4" /> View Details
            </button>
            <button
              className="flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-gray-100"
              onClick={() => console.log('Validate', row.id)}
            >
              <CheckCheck className="h-4 w-4" /> Validate
            </button>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];

// ─── Dropdown filter items for DataTable ──────────────────────────────────────
const dropdownItems = [
  { label: 'All', value: 'all' },
  ...STAGES.map((stage) => ({ label: stage, value: stage })),
];

// ─── Metric helpers ───────────────────────────────────────────────────────────
const sampleChartData = [
  { month: 'Jan', month1: 600 },
  { month: 'Feb', month2: 800 },
  { month: 'Mar', month3: 1000 },
  { month: 'Apr', month4: 1200 },
];

const countByStatus = (status) =>
  onboardingDummyData.filter((i) => i.onboardingStatus === status).length;

const metricCardsData = [
  {
    title: 'Validation Queue',
    value: onboardingDummyData.length,
    percentage: 0,
    isPositive: true,
    chartData: sampleChartData,
  },
  {
    title: 'Offer Accepted',
    value: countByStatus('Offer Accepted'),
    percentage: 0,
    isPositive: false,
    chartData: sampleChartData,
  },
  {
    title: 'HR Validation',
    value: countByStatus('HR Validation'),
    percentage: 0,
    isPositive: false,
    chartData: sampleChartData,
  },
  {
    title: 'Asset Assigned',
    value: countByStatus('Asset Assigned'),
    percentage: 0,
    isPositive: true,
    chartData: sampleChartData,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HROnboarding() {
  const {
    currentTableData,
    pagination,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    setCurrentPage,
  } = useDataTable({
    data: onboardingDummyData,
    pageSize: 8,
    filterKeys: ['employeeName', 'role', 'onboardingStatus'],
    statusKey: 'onboardingStatus',
  });

  return (
    <div className="my-5">
      <hgroup>
        <h1 className="text-2xl font-bold">Onboarding</h1>
        <p className="text-sm text-[#7D7D7D]">Manage Employee Onboarding</p>
      </hgroup>

      {/* Metric Cards */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metricCardsData.map((metric) => (
          <MetricCard key={metric.title} {...metric} emptyState={false} />
        ))}
      </div>

      {/* Table */}
      <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
        <DataTable
          columns={columns}
          data={currentTableData}
          title="Employees Onboarding"
          isLoading={false}
          pagination={pagination}
          onPageChange={setCurrentPage}
          placeholder="Search employees..."
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
