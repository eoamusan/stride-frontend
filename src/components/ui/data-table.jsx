import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import emptyTableImg from '@/assets/icons/empty-table.svg';
import { cn } from '@/lib/utils';
import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import FilterIcon from '@/assets/icons/filter.svg';
import { Button } from './button';

export function DataTable({
  columns,
  data,
  isLoading,
  pagination,
  onPageChange,
  title,
  description,
  placeholder,
  inputValue,
  handleInputChange,
  dropdownItems = [],
  statusFilter,
  setStatusFilter,
  searchTerm,
  setSearchTerm,
}) {
  const { page, totalPages } = pagination || {};

  const renderPaginationItems = () => {
    const items = [];
    const activePage = page;

    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              className="size-7 cursor-pointer text-sm"
              isActive={i === activePage}
              onClick={() => onPageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            className="size-7 cursor-pointer text-sm"
            isActive={1 === activePage}
            onClick={() => onPageChange(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Calculate which pages to show in the middle
      let startPage, endPage;

      if (activePage <= 2) {
        // Near the beginning: show 2, 3
        startPage = 2;
        endPage = 3;
      } else if (activePage >= totalPages - 1) {
        // Near the end: show totalPages-2, totalPages-1
        startPage = totalPages - 2;
        endPage = totalPages - 1;
      } else {
        // In the middle: show activePage-1, activePage, activePage+1
        startPage = activePage - 1;
        endPage = activePage + 1;
      }

      // Add left ellipsis if needed
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-left">
            <PaginationEllipsis className="size-7 text-sm" />
          </PaginationItem>
        );
      }

      // Add the middle pages
      for (let i = startPage; i <= endPage; i++) {
        if (i > 1 && i < totalPages) {
          // Don't duplicate first and last pages
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                className="size-7 cursor-pointer text-sm"
                isActive={i === activePage}
                onClick={() => onPageChange(i)}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      // Add right ellipsis if needed
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-right">
            <PaginationEllipsis className="size-7 text-sm" />
          </PaginationItem>
        );
      }

      // Always show last page if more than 1 page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              className="size-7 cursor-pointer text-sm"
              isActive={totalPages === activePage}
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <div className="w-full rounded-2xl px-4 py-2">
      {/* Header Section */}
      <div className="mb-2 flex flex-col items-center justify-between gap-2 md:flex-row">
        <hgroup className="flex w-full flex-col">
          {title && <h2 className="text-xl font-bold">{title}</h2>}
          {description && (
            <span className="text-sm text-[#7D7D7D]">{description}</span>
          )}
        </hgroup>

        <div className="flex items-center gap-3">
          <div className="relative">
            <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />

            <Input
              placeholder={placeholder}
              value={inputValue}
              onChange={handleInputChange}
              className={'w-auto max-w-64 rounded-xl py-6 pl-10'}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={
                  statusFilter !== 'all' ? 'border-blue-200 bg-blue-50' : ''
                }
              >
                <img src={FilterIcon} alt="Filter Icon" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              {dropdownItems.map((item) => (
                <DropdownMenuItem
                  key={item.value}
                  onClick={() => setStatusFilter && setStatusFilter(item.value)}
                  className={statusFilter === item.value ? 'bg-blue-50' : ''}
                >
                  {item.label}
                </DropdownMenuItem>
              ))}
              {(statusFilter !== 'all' || searchTerm) && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      if (setStatusFilter) setStatusFilter('all');
                      if (setSearchTerm) setSearchTerm('');
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    Clear All Filters
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Table className="border-separate border-spacing-y-2">
        <TableHeader>
          <TableRow className="border-none hover:bg-transparent">
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className={cn(
                  'py-4 font-semibold text-gray-600',
                  column.className
                )}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow
                key={`skeleton-${index}`}
                className="hover:bg-muted/50 border-transparent [&_td]:border-y [&_td:first-child]:rounded-l-3xl [&_td:first-child]:border-l [&_td:last-child]:rounded-r-3xl [&_td:last-child]:border-r"
              >
                {columns.map((_, colIndex) => (
                  <TableCell key={colIndex} className="px-6 py-4">
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-gray-500"
              >
                <div className="flex flex-col items-center justify-center py-8">
                  <img
                    src={emptyTableImg}
                    alt="Empty Table"
                    className="mb-4 w-55"
                  />
                  <p>No data found.</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIndex) => (
              <TableRow
                key={row.id || rowIndex}
                className="hover:bg-muted/50 border-transparent capitalize [&_td]:border-y [&_td:first-child]:rounded-l-3xl [&_td:first-child]:border-l [&_td:last-child]:rounded-r-3xl [&_td:last-child]:border-r"
              >
                {columns.map((column, colIndex) => (
                  <TableCell
                    key={colIndex}
                    className={cn('py-4 pr-6 font-medium', column.className)}
                  >
                    {column.cell ? column.cell(row) : row[column.accessorKey]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {pagination && totalPages > 1 && (
        <Pagination>
          <PaginationContent className="mt-6 w-full justify-between">
            <PaginationItem>
              <PaginationPrevious
                className={`cursor-pointer border ${page <= 1 ? 'pointer-events-none opacity-50' : ''}`}
                onClick={() =>
                  page > 1 && onPageChange && onPageChange(page - 1)
                }
              />
            </PaginationItem>

            <div className="flex gap-2">{renderPaginationItems()}</div>

            <PaginationItem>
              <PaginationNext
                className={`cursor-pointer border ${page >= totalPages ? 'pointer-events-none opacity-50' : ''}`}
                onClick={() =>
                  page < totalPages && onPageChange && onPageChange(page + 1)
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
