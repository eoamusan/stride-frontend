import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import emptyTableImg from '@/assets/icons/empty-table.svg';
import {
  SearchIcon,
  DepartmentIcon,
  FilterIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  HorizontalDotsIcon,
} from '@/components/ui/svgs';

// ─── Constants ────────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  Active: 'bg-[#24A9591A] text-[#24A959]',
  Onboarding: 'bg-[#4B55631A] text-[#4B5563]',
  'On Leave': 'bg-[#F39C121A] text-[#F39C12]',
  Exited: 'bg-[#EF44441A] text-[#EF4444]',
  Inactive: 'bg-[#F3F4F6] text-[#6B7280]',
};

const COLS = [
  { key: 'name', label: 'Employee Name', flex: '2fr' },
  { key: 'role', label: 'Role', flex: '1.5fr' },
  { key: 'department', label: 'Department', flex: '1.5fr' },
  { key: 'employeeId', label: 'Employee ID', flex: '1.5fr' },
  { key: 'status', label: 'Status', flex: '1fr' },
];

const GRID = 'grid grid-cols-[2fr_1.5fr_1.5fr_1.5fr_1fr_44px]';

// ─── Skeleton row ─────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div
      className={`${GRID} items-center gap-4 rounded-xl border border-gray-100 bg-white px-4 py-3`}
    >
      <div className="flex items-center gap-3">
        <div className="size-10 shrink-0 animate-pulse rounded-full bg-gray-200" />
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-4 w-24 animate-pulse rounded bg-gray-200" />
      ))}
      <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
      <div className="ml-auto size-7 animate-pulse rounded bg-gray-200" />
    </div>
  );
}

// ─── Pagination helper ────────────────────────────────────────────────────────
function buildPages(page, totalPages) {
  if (totalPages <= 7)
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages = [1];
  if (page > 3) pages.push('…');
  for (
    let i = Math.max(2, page - 1);
    i <= Math.min(totalPages - 1, page + 1);
    i++
  ) {
    pages.push(i);
  }
  if (page < totalPages - 2) pages.push('…');
  if (totalPages > 1) pages.push(totalPages);
  return pages;
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function EmployeeTable({
  data = [],
  isLoading = false,
  paginationData = { page: 1, totalPages: 1, pageSize: 20, totalCount: 0 },
  onPageChange,
  onRowAction,
  dropdownActions = [],
  selectedDepartment = 'all',
  onDepartmentChange,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = searchTerm
    ? data.filter((e) =>
        [e.name, e.role, e.department, e.employeeId].some((v) =>
          v?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;

  const { page, totalPages } = paginationData;
  const pages = buildPages(page, totalPages);

  return (
    <div className="w-full rounded-2xl bg-white p-6">
      {/* ── Header ── */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-900">All Employees</h2>

        <div className="flex items-center gap-[7px]">
          {/* Search — icon left, text padded so it doesn’t overlap icon */}
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2">
              <SearchIcon className="size-4 text-[#7D7D7D]" />
            </span>
            <Input
              placeholder="Search employee......."
              className="h-12 w-[228px] rounded-[16px] border border-[#E5E7EB] py-3 pl-10 pr-[100px] text-sm outline-none focus-visible:ring-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Department filter — same style as search input: h-48px, radius 16px, border */}
          <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
            <SelectTrigger className="h-12 w-[228px] gap-[7px] rounded-[16px] border border-[#E5E7EB] py-3 pr-4 pl-3 text-sm outline-none focus:ring-0 focus:ring-offset-0">
              <DepartmentIcon className="shrink-0 text-[#7D7D7D]" />
              <SelectValue placeholder="All Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Department</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="hr">Human Resources</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter icon */}
          <Button
            variant="outline"
            size="icon"
            className="size-12 shrink-0 rounded-[16px] border"
          >
            <FilterIcon className="size-5 text-[#7D7D7D]" />
          </Button>
        </div>
      </div>

      {/* ── Column headers: Raleway 500, 14px, 24px line-height, #7D7D7D ── */}
      <div className={`${GRID} mb-2 items-center gap-4 px-4`}>
        {COLS.map((col) => (
          <span
            key={col.key}
            className="font-raleway text-sm leading-6 font-medium text-[#7D7D7D]"
          >
            {col.label}
          </span>
        ))}
        <span />
      </div>

      {/* ── Rows (12px spacing between rows) ── */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <img
              src={emptyTableImg}
              alt="No employees found"
              className="mx-auto w-[200px]"
            />
          </div>
        ) : (
          filtered.map((employee) => (
            <div
              key={employee.id}
              className={`${GRID} h-[66px] w-full items-center gap-6 rounded-[16px] border border-[#E8E8E8] bg-white px-5 py-4`}
            >
              {/* Employee Name + Avatar */}
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="size-10 shrink-0">
                  <AvatarImage src={employee.avatarUrl} alt={employee.name} />
                  <AvatarFallback
                    className={`${employee.avatarColor || 'bg-blue-600'} font-raleway text-sm font-medium text-white`}
                  >
                    {employee.avatarInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="font-raleway truncate text-sm leading-6 font-medium text-[#000000CC]">
                  {employee.name}
                </span>
              </div>

              {/* Role */}
              <span className="font-raleway truncate text-sm leading-6 font-medium text-[#000000CC]">
                {employee.role || '—'}
              </span>

              {/* Department */}
              <span className="font-raleway truncate text-sm leading-6 font-medium text-[#000000CC]">
                {employee.department || '—'}
              </span>

              {/* Employee ID */}
              <span className="font-raleway text-sm leading-6 font-medium text-[#000000CC]">
                {employee.employeeId || '—'}
              </span>

              {/* Status badge — 98×34px, radius 16px, padding 5px 10px, gap 10px */}
              <span
                className={`flex h-[34px] w-[98px] items-center justify-center gap-2.5 overflow-hidden rounded-[16px] px-[10px] py-[5px] text-center text-xs font-medium opacity-100 ${STATUS_STYLES[employee.status] || 'bg-gray-100 text-gray-600'}`}
              >
                {employee.status}
              </span>

              {/* Actions */}
              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <HorizontalDotsIcon className="size-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="flex min-h-[85px] w-[93px] flex-col gap-2 rounded-md border-0 bg-white py-2.5 pr-4 pl-5 shadow-[0px_1px_3px_0px_#0000004D,0px_4px_8px_3px_#00000026]"
                  >
                    {dropdownActions.map((action) => (
                      <DropdownMenuItem
                        key={action.key}
                        onClick={() => onRowAction?.(action.key, employee)}
                        className="font-raleway flex cursor-pointer items-center gap-2 text-xs leading-6 font-normal text-black hover:bg-gray-100 focus:bg-gray-100 [&_svg]:shrink-0 [&_svg_path]:stroke-black"
                      >
                        {action.icon && (
                          <span className="flex size-4 shrink-0 items-center justify-center">
                            <action.icon />
                          </span>
                        )}
                        {action.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Pagination ── */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => page > 1 && onPageChange?.(page - 1)}
          disabled={page <= 1}
          className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-xs transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ArrowLeftIcon className="size-5" />
        </button>

        <div className="flex items-center gap-1">
          {pages.map((p, i) =>
            p === '…' ? (
              <span
                key={`ellipsis-${i}`}
                className="flex size-8 items-center justify-center text-sm text-gray-400"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange?.(p)}
                className={`flex size-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  p === page
                    ? 'bg-[#6C2BD9] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => page < totalPages && onPageChange?.(page + 1)}
          disabled={page >= totalPages}
          className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-xs transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ArrowRightIcon className="size-5" />
        </button>
      </div>
    </div>
  );
}
