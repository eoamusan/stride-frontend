import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FilterIcon, MoreHorizontalIcon, SearchIcon } from 'lucide-react';

// Dummy data for table headers

export function TableActions({
  jobRequests,
  tableHeaders,
  title,
  description,
  pageSize = 3,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'approved', 'rejected'

  // Filter data based on search term and status filter
  const filteredData = jobRequests.filter((request) => {
    // Status filter
    if (statusFilter !== 'all') {
      const statusMatch =
        request.status.toLowerCase() === statusFilter.toLowerCase();
      if (!statusMatch) return false;
    }

    // Search filter
    if (!searchTerm) return true;

    return (
      request.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Calculate pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Render pagination items
  const renderPaginationItems = () => {
    const items = [];

    if (totalPages <= 3) {
      // Show all pages if total is 3 or less
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              className="size-7 cursor-pointer text-sm"
              isActive={i === currentPage}
              onClick={() => handlePageChange(i)}
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
            isActive={1 === currentPage}
            onClick={() => handlePageChange(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Calculate which 3 pages to show in the middle
      let startPage, endPage;

      if (currentPage <= 2) {
        // Near the beginning: show 2, 3
        startPage = 2;
        endPage = 3;
      } else if (currentPage >= totalPages - 1) {
        // Near the end: show totalPages-2, totalPages-1
        startPage = totalPages - 2;
        endPage = totalPages - 1;
      } else {
        // In the middle: show currentPage-1, currentPage, currentPage+1
        startPage = currentPage - 1;
        endPage = currentPage + 1;
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
                isActive={i === currentPage}
                onClick={() => handlePageChange(i)}
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
              isActive={totalPages === currentPage}
              onClick={() => handlePageChange(totalPages)}
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
      <div className="mb-2 flex items-center justify-between">
        <hgroup>
          <h2 className="text-xl font-bold">{title}</h2>
          {description && (
            <span className="text-sm text-[#7D7D7D]">{description}</span>
          )}
        </hgroup>

        <div className="flex items-center gap-3">
          <div className="relative">
            <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search job requests..."
              className="w-full max-w-80 pl-10"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
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
                <FilterIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => handleStatusFilterChange('all')}
                className={statusFilter === 'all' ? 'bg-blue-50' : ''}
              >
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusFilterChange('pending')}
                className={statusFilter === 'pending' ? 'bg-blue-50' : ''}
              >
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                  Pending Approval
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusFilterChange('approved')}
                className={statusFilter === 'approved' ? 'bg-blue-50' : ''}
              >
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  Approved
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusFilterChange('rejected')}
                className={statusFilter === 'rejected' ? 'bg-blue-50' : ''}
              >
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500"></span>
                  Rejected
                </span>
              </DropdownMenuItem>
              {(statusFilter !== 'all' || searchTerm) && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setStatusFilter('all');
                      setSearchTerm('');
                      setCurrentPage(1);
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

      <Table className="table-auto border-spacing-2">
        <TableHeader>
          <TableRow className="border-none">
            {tableHeaders.map((header) => (
              <TableHead
                key={header.key}
                className={`py-4 font-semibold text-gray-600 ${header.className}`}
              >
                {header.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentData.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="py-4 font-medium">
                {request.jobTitle}
              </TableCell>
              <TableCell className="py-4 font-medium">
                {request.department}
              </TableCell>
              <TableCell className="py-4 font-medium">
                {request.requestedBy}
              </TableCell>
              <TableCell className="py-4 font-medium">
                {request.openings}
              </TableCell>
              <TableCell className="py-4 font-medium">
                <span
                  className="rounded-full px-3 py-2 text-xs"
                  style={{
                    backgroundColor:
                      (request.status == 'Pending' && '#CE8D001A') ||
                      (request.status == 'Approved' && '#0596691A') ||
                      (request.status == 'Rejected' && '#DC26261A'),
                    color:
                      (request.status == 'Pending' && '#CE8D00') ||
                      (request.status == 'Approved' && '#059669') ||
                      (request.status == 'Rejected' && '#DC2626'),
                  }}
                >
                  {request.status}
                </span>
              </TableCell>
              <TableCell className="py-4 font-medium">
                {request.dateCreated}
              </TableCell>
              <TableCell className="py-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontalIcon />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View</DropdownMenuItem>
                    <DropdownMenuItem>Approve</DropdownMenuItem>
                    <DropdownMenuItem>Reject</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {(statusFilter !== 'all' || searchTerm) && (
            <div className="flex items-center gap-2">
              {searchTerm && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setCurrentPage(1);
                    }}
                    className="ml-1 text-gray-600 hover:text-gray-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <Pagination>
        <PaginationContent className="mt-6 w-full justify-between">
          <PaginationItem>
            <PaginationPrevious
              className="cursor-pointer border"
              onClick={() =>
                currentPage > 1 && handlePageChange(currentPage - 1)
              }
            />
          </PaginationItem>

          <div className="flex gap-2">{renderPaginationItems()}</div>

          <PaginationItem>
            <PaginationNext
              className="cursor-pointer border"
              onClick={() =>
                currentPage < totalPages && handlePageChange(currentPage + 1)
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
