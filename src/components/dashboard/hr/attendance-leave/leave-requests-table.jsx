import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import emptyTableImg from '@/assets/icons/empty-table.svg';
import {
  SearchIcon,
  FilterIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  HorizontalDotsIcon,
  EyeIcon,
  DeleteIcon,
} from '@/components/ui/svgs';

const STATUS_STYLES = {
  Pending: 'bg-[#FEF9C3] text-[#A16207]',
  Approved: 'bg-[#DCFCE7] text-[#15803D]',
  Rejected: 'bg-[#FEE2E2] text-[#B91C1C]',
};

const COLS = [
  { key: 'name', label: 'Employee Name' },
  { key: 'leaveType', label: 'Leave Type' },
  { key: 'duration', label: 'Duration' },
  { key: 'dates', label: 'Dates' },
  { key: 'status', label: 'Status' },
];

const GRID = 'grid grid-cols-[2fr_1.5fr_1fr_1.5fr_1fr_44px] items-center gap-4';

const ROW_ACTIONS = [
  { key: 'view', label: 'View', icon: EyeIcon },
  { key: 'approve', label: 'Approve', icon: EyeIcon },
  { key: 'delete', label: 'Delete', icon: DeleteIcon },
];

function SkeletonRow() {
  return (
    <div
      className={`${GRID} rounded-[16px] border border-gray-100 bg-white px-5 py-4`}
    >
      <div className="flex items-center gap-3">
        <div className="size-10 shrink-0 animate-pulse rounded-full bg-gray-200" />
        <div className="space-y-1">
          <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-4 w-20 animate-pulse rounded bg-gray-200" />
      ))}
      <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200" />
      <div className="ml-auto size-7 animate-pulse rounded bg-gray-200" />
    </div>
  );
}

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

export default function LeaveRequestsTable({
  data = [],
  isLoading = false,
  paginationData = { page: 1, totalPages: 10, pageSize: 20, totalCount: 0 },
  onPageChange,
  onRowAction,
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = searchTerm
    ? data.filter((r) =>
        [r.name, r.leaveType, r.status].some(
          (v) =>
            typeof v === 'string' &&
            v.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;

  const { page, totalPages } = paginationData;
  const pages = buildPages(page, totalPages);

  return (
    <div className="w-full rounded-2xl bg-white p-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-raleway text-xl font-bold text-gray-900">
          Leave Requests
        </h2>

        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2">
              <SearchIcon className="size-4 text-[#7D7D7D]" />
            </span>
            <Input
              placeholder="Search requests......"
              className="h-11 w-[228px] rounded-[16px] border border-[#E5E7EB] pl-10 text-sm outline-none focus-visible:ring-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            className="size-11 shrink-0 rounded-[16px] border"
          >
            <FilterIcon className="size-5 text-[#7D7D7D]" />
          </Button>
        </div>
      </div>

      {/* Column headers */}
      <div className={`${GRID} mb-2 gap-4 px-4`}>
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

      {/* Rows */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <img
              src={emptyTableImg}
              alt="No records found"
              className="mx-auto w-[180px]"
            />
          </div>
        ) : (
          filtered.map((row) => (
            <div
              key={row.id}
              className={`${GRID} h-[72px] w-full rounded-[16px] border border-[#E8E8E8] bg-white px-5`}
            >
              {/* Employee Name */}
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="size-10 shrink-0">
                  {row.photoUrl && (
                    <AvatarImage src={row.photoUrl} alt={row.name} />
                  )}
                  <AvatarFallback
                    className={`${row.avatarColor || 'bg-blue-600'} font-raleway text-sm font-medium text-white`}
                  >
                    {row.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-raleway truncate text-sm font-medium text-[#000000CC]">
                    {row.name}
                  </p>
                  <p className="font-raleway truncate text-xs text-[#7D7D7D]">
                    {row.role}
                  </p>
                </div>
              </div>

              {/* Leave Type */}
              <span className="font-raleway text-sm text-[#000000CC]">
                {row.leaveType}
              </span>

              {/* Duration */}
              <span className="font-raleway text-sm text-[#000000CC]">
                {row.duration}
              </span>

              {/* Dates */}
              <span className="font-raleway text-sm text-[#000000CC]">
                {row.dates}
              </span>

              {/* Status */}
              <span
                className={`inline-flex h-[30px] w-fit items-center justify-center rounded-[16px] px-3 text-xs font-medium ${STATUS_STYLES[row.status] || 'bg-gray-100 text-gray-600'}`}
              >
                {row.status}
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
                    className="flex min-h-[90px] w-[100px] flex-col gap-2 rounded-md border-0 bg-white py-2.5 pr-4 pl-5 shadow-[0px_1px_3px_0px_#0000004D,0px_4px_8px_3px_#00000026]"
                  >
                    {ROW_ACTIONS.map((action) => (
                      <DropdownMenuItem
                        key={action.key}
                        onClick={() => onRowAction?.(action.key, row)}
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

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => page > 1 && onPageChange?.(page - 1)}
          disabled={page <= 1}
          className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-xs transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeftIcon className="size-4" />
          Previous
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
        >
          Next
          <ArrowRightIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
