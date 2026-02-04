import React from 'react';
import { cn } from '@/lib/utils';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { useTableStore } from '@/stores/table-store';

const CustomTable = (props) => {
  const {
    totalPages,
    searchTerm,
    setSearchTerm,
    statusFilter,
    tableHeaders,
    children,
  } = props;
  const { currentPage, setCurrentPage } = useTableStore();

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
    <div className="flex flex-col gap-2">
      <Table
        className="table-auto border-separate"
        style={{ borderSpacing: '0 0.75rem' }}
      >
        <TableHeader>
          <TableRow className="border-none">
            {tableHeaders.map((header) => (
              <TableHead
                key={header.key}
                className={`text-[#7D7D7D] ${header.className}`}
              >
                {header.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {React.Children.map(children, (child, rowIndex) => {
            if (!React.isValidElement(child)) return child;

            const cells = React.Children.toArray(child.props.children);

            return React.cloneElement(child, {
              className: cn(
                'hover:bg-muted/50 data-[state=selected]:bg-muted bg-transparent transition-colors',
                child.props.className
              ),
              style: Object.assign(
                {},
                child.props.style || {},
                rowIndex >= 0 ? { position: 'relative', top: '-0.75rem' } : {}
              ),
              children: cells.map((cell, i) => {
                if (!React.isValidElement(cell)) return cell;

                return React.cloneElement(cell, {
                  className: cn(
                    'border-t border-b border-[#E8E8E8] bg-white p-2 align-middle whitespace-nowrap',
                    i === 0 && 'rounded-l-2xl border-l border-[#E8E8E8]',
                    i === cells.length - 1 &&
                      'rounded-r-2xl border-r border-[#E8E8E8]',
                    cell.props.className
                  ),
                });
              }),
            });
          })}
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
        <PaginationContent className="w-full justify-between">
          <PaginationItem>
            <PaginationPrevious
              className="cursor-pointer border text-sm"
              onClick={() =>
                currentPage > 1 && handlePageChange(currentPage - 1)
              }
            />
          </PaginationItem>

          <div className="flex gap-2">{renderPaginationItems()}</div>

          <PaginationItem>
            <PaginationNext
              className="cursor-pointer border text-sm"
              onClick={() =>
                currentPage < totalPages && handlePageChange(currentPage + 1)
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default CustomTable;
