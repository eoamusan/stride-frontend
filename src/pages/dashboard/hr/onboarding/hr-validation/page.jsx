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
import { useDataTable } from '@/hooks/use-data-table';
import { hrValidationDummyData } from './dummyData';

// ─── Status colours ───────────────────────────────────────────────────────────
const STATUS_COLORS = {
  Pending: { bg: '#FFF7E6', text: '#FF9500' },
  'Needs Correction': { bg: '#FFEBEE', text: '#FF3B30' },
  Validated: { bg: '#E8F5E9', text: '#34C759' },
};

// ─── Dropdown filter items for DataTable ──────────────────────────────────────
const dropdownItems = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Needs Correction', value: 'Needs Correction' },
  { label: 'Validated', value: 'Validated' },
];

// ─── Metric helpers ───────────────────────────────────────────────────────────
const sampleChartData = [
  { month: 'Jan', month1: 600 },
  { month: 'Feb', month2: 800 },
  { month: 'Mar', month3: 1000 },
  { month: 'Apr', month4: 1200 },
];

const countByStatus = (status) =>
  hrValidationDummyData.filter((i) => i.status === status).length;

const metricCardsData = [
  {
    title: 'Validation Queue',
    value: hrValidationDummyData.length,
    percentage: 12,
    isPositive: true,
    chartData: sampleChartData,
  },
  {
    title: 'Pending Validation',
    value: countByStatus('Pending'),
    percentage: 5,
    isPositive: true,
    chartData: sampleChartData,
  },
  {
    title: 'Needs Correction',
    value: countByStatus('Needs Correction'),
    percentage: -2,
    isPositive: false,
    chartData: sampleChartData,
  },
  {
    title: 'Validated Records',
    value: countByStatus('Validated'),
    percentage: 8,
    isPositive: true,
    chartData: sampleChartData,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HrValidation() {
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
    data: hrValidationDummyData,
    pageSize: 8,
    filterKeys: ['employeeName', 'role', 'department', 'status'],
    statusKey: 'status',
  });

  // ─── Table columns ──────────────────────────────────────────────────────────
  const columns = [
    { header: 'Employee Name', accessorKey: 'employeeName' },
    { header: 'Role', accessorKey: 'role' },
    { header: 'Department', accessorKey: 'department' },
    { header: 'Start Date', accessorKey: 'startDate' },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => {
        const style = STATUS_COLORS[row.status] ?? {
          bg: '#F5F5F5',
          text: '#757575',
        };
        return (
          <span
            className="flex max-w-36 items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap"
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
                onClick={() =>
                  navigate(
                    `/dashboard/hr/onboarding/hr-validation/detail/${row.id}`
                  )
                }
              >
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

  return (
    <div className="my-5">
      <hgroup>
        <h1 className="text-2xl font-bold">HR Validation</h1>
        <p className="text-sm text-[#7D7D7D]">
          Review and validate new employee records
        </p>
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
          title="HR Validation Queue"
          isLoading={false}
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
    </div>
  );
}
