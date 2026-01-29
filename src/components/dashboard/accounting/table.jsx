import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  BanIcon,
  FilterIcon,
  LayoutGridIcon,
  ListIcon,
  MoreHorizontalIcon,
  SearchIcon,
  Trash2Icon,
  UploadIcon,
} from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import emptyTableImg from '@/assets/icons/empty-table.svg';

export default function AccountingTable({
  title,
  description,
  data = [],
  columns = [],
  searchFields = [],
  searchPlaceholder = 'Search...',
  statusStyles = {},
  dropdownActions = [],
  paginationData = {
    page: 1,
    totalPages: 1,
    pageSize: 10,
    totalCount: 0,
  },
  onPageChange,
  onRowAction,
  className = '',
  selectedItems = [],
  handleSelectAll,
  handleSelectItem,
  showDataSize = false,
  isProductTable = false,
  itemComponent = null,
  isLoading = false,
  setShowDetails,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeProductView, setActiveProductView] = useState('list');

  const getStatusBadge = (status) => {
    const defaultStyles = 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    const badgeStyle = statusStyles[status] || defaultStyles;

    return <Badge className={badgeStyle}>{status}</Badge>;
  };

  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;

    return searchFields.some((field) => {
      const value = item[field];
      if (value && typeof value === 'string') {
        return value.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    });
  });

  const handleDropdownAction = (action, item) => {
    if (onRowAction) {
      onRowAction(action, item);
    }
  };

  // Helper to render pagination items
  const { page, totalPages } = paginationData;
  const renderPaginationItems = () => {
    const items = [];
    const delta = 1; // Number of pages to show on each side of current page

    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              className={'size-7 cursor-pointer text-sm'}
              isActive={i === page}
              onClick={() => onPageChange?.(i)}
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
            className={'size-7 cursor-pointer text-sm'}
            isActive={1 === page}
            onClick={() => onPageChange?.(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Calculate the range around current page
      let startPage = Math.max(2, page - delta);
      let endPage = Math.min(totalPages - 1, page + delta);

      // Add left ellipsis if needed
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-left">
            <PaginationEllipsis className={'size-7 text-sm'} />
          </PaginationItem>
        );
      }

      // Add pages around current page
      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              className={'size-7 cursor-pointer text-sm'}
              isActive={i === page}
              onClick={() => onPageChange?.(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Add right ellipsis if needed
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-right">
            <PaginationEllipsis className={'size-7 text-sm'} />
          </PaginationItem>
        );
      }

      // Always show last page (if it's not page 1)
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              className={'size-7 cursor-pointer text-sm'}
              isActive={totalPages === page}
              onClick={() => onPageChange?.(totalPages)}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    return items;
  };

  const renderCellContent = (item, column) => {
    const value = item[column.key];

    if (column.key === 'status') {
      return getStatusBadge(value);
    }

    if (column.render) {
      return column.render(value, item);
    }

    return value;
  };

  const ProductCard = itemComponent;

  return (
    <div className={`w-full rounded-2xl bg-white p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-6">
        {selectedItems.length > 0 ? (
          <>
            <div />
            <div className="flex items-center gap-2">
              <Button size={'icon'} variant={'outline'}>
                <Trash2Icon />
              </Button>
              <Button size={'icon'} variant={'outline'}>
                <BanIcon />
              </Button>
              <Button size={'icon'} variant={'outline'}>
                <UploadIcon />
              </Button>
            </div>
          </>
        ) : (
          <>
            <div>
              <h2 className="text-xl font-bold">{title}</h2>
            { description && <span className='text-[#7D7D7D] text-sm'>{description}</span> }
            </div>

            <div className="flex items-center gap-3">
              {isProductTable && (
                <div className="mr-5 flex items-center gap-2">
                  <div
                    onClick={() => setActiveProductView('grid')}
                    className={`flex h-9 cursor-pointer items-center gap-2 px-2 font-medium ${activeProductView === 'grid' ? 'border-primary text-primary border-b' : ''}`}
                  >
                    <LayoutGridIcon size={16} /> <span>Grid</span>
                  </div>
                  <div
                    onClick={() => setActiveProductView('list')}
                    className={`flex h-9 cursor-pointer items-center gap-2 px-2 font-medium ${activeProductView === 'list' ? 'border-primary text-primary border-b' : ''}`}
                  >
                    <ListIcon size={16} /> <span>List</span>
                  </div>
                </div>
              )}
              <div className="relative">
                <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder={searchPlaceholder}
                  className="w-full max-w-80 pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <FilterIcon className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Table */}
      {isProductTable && activeProductView === 'grid' ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredData.map((item, i) => (
            <ProductCard
              key={i}
              isSelected={selectedItems.includes(item.id)}
              handleSelect={(checked) => {
                if (!handleSelectItem) return;
                handleSelectItem(item.id, checked);
              }}
              handleDropdownAction={handleDropdownAction}
              data={item}
              setShowDetails={setShowDetails}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50">
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedItems.length === data.length && data.length > 0
                    }
                    onCheckedChange={(checked) => {
                      if (!handleSelectAll) return;
                      handleSelectAll(checked);
                    }}
                  />
                </TableHead>
                {columns.map((column, index) => (
                  <TableHead
                    key={index}
                    className={`font-semibold text-gray-600 ${column.className || ''}`}
                  >
                    {column.label}
                  </TableHead>
                ))}
                {dropdownActions.length > 0 && (
                  <TableHead className="w-12"></TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeleton rows
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell>
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                    {columns.map((column, colIndex) => (
                      <TableCell key={colIndex}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                    {dropdownActions.length > 0 && (
                      <TableCell>
                        <Skeleton className="h-8 w-8" />
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <TableRow key={index} className="hover:bg-zinc-50">
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={(checked) => {
                          if (!handleSelectItem) return;
                          handleSelectItem(item.id, checked);
                        }}
                      />
                    </TableCell>
                    {columns.map((column, colIndex) => (
                      <TableCell
                        key={colIndex}
                        className={colIndex === 0 ? 'font-medium' : ''}
                      >
                        {renderCellContent(item, column)}
                      </TableCell>
                    ))}
                    {dropdownActions.length > 0 && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {dropdownActions.map((action, actionIndex) => (
                              <DropdownMenuItem
                                key={actionIndex}
                                onClick={() =>
                                  handleDropdownAction(action.key, item)
                                }
                              >
                                {action.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={
                      columns.length + 1 + (dropdownActions.length > 0 ? 1 : 0)
                    }
                    className="h-24 py-12 text-center text-gray-500"
                  >
                    <img
                      src={emptyTableImg}
                      alt="Empty Table"
                      className="mx-auto block w-[220px]"
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        {showDataSize && (
          <p className="text-sm font-medium text-zinc-600">
            Showing{' '}
            {`${paginationData.page * paginationData.pageSize - paginationData.pageSize + 1}-${(paginationData.totalCount < paginationData.page * paginationData.pageSize ? paginationData.totalCount : paginationData.page * paginationData.pageSize)} of ${paginationData.totalCount}`}
          </p>
        )}

        {/* Pagination */}
        <Pagination className={`${showDataSize ? 'mx-0 w-fit' : 'w-full'}`}>
          <PaginationContent className={'w-full justify-between'}>
            <PaginationItem>
              <PaginationPrevious
                className={
                  'bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 cursor-pointer border text-sm text-[#414651] shadow-xs'
                }
                onClick={() => page > 1 && onPageChange?.(page - 1)}
              />
            </PaginationItem>
            <span className="flex items-center md:gap-1">
              {renderPaginationItems()}
            </span>
            <PaginationItem>
              <PaginationNext
                className={
                  'bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 cursor-pointer border text-sm text-[#414651] shadow-xs'
                }
                onClick={() => page < totalPages && onPageChange?.(page + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
