import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { MoreHorizontalIcon } from 'lucide-react';
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

export default function BookkeepingTable({
  data = [],
  columns = [],
  dropdownActions = [],
  paginationData = {
    page: 1,
    totalPages: 1,
    pageSize: 10,
    totalCount: 0,
  },
  onRowAction,
  className = '',
}) {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(data.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId, checked) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    }
  };

  const handleDropdownAction = (action, item) => {
    if (onRowAction) {
      onRowAction(action, item);
    }
  };

  // Helper to render pagination items
  const { page, totalPages } = paginationData;
  const renderPaginationItems = () => {
    const items = [];
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink className={'size-7 text-sm'} isActive={i === page}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // First three
      for (let i = 1; i <= 3; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink className={'size-7 text-sm'} isActive={i === page}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      // Ellipsis
      items.push(
        <PaginationItem key="ellipsis">
          <PaginationEllipsis className={'size-7 text-sm'} />
        </PaginationItem>
      );
      // Last three
      for (let i = totalPages - 2; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink className={'size-7 text-sm'} isActive={i === page}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    return items;
  };

  const renderCellContent = (item, column) => {
    const value = item[column.key];

    if (column.render) {
      return column.render(value, item);
    }

    return value;
  };

  return (
    <div className={`w-full rounded-2xl bg-white p-6 ${className}`}>
      {/* Table */}
      <div className="overflow-hidden rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50">
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedItems.length === data.length && data.length > 0
                  }
                  onCheckedChange={handleSelectAll}
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
            {data.length > 0 ? (
              data.map((item, index) => (
                <TableRow key={index} className="hover:bg-zinc-50">
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={(checked) =>
                        handleSelectItem(item.id, checked)
                      }
                    />
                  </TableCell>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex} className="text-sm">
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
                  className="h-24 text-center text-gray-500"
                >
                  <img
                    src={emptyTableImg}
                    alt="Empty Table"
                    className="mx-auto my-4 block w-[220px]"
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination className={'mt-6'}>
        <PaginationContent className={'w-full justify-between'}>
          <PaginationItem>
            <PaginationPrevious
              className={
                'bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 border text-sm text-[#414651] shadow-xs'
              }
            />
          </PaginationItem>
          <span className="flex items-center md:gap-1">
            {renderPaginationItems()}
          </span>
          <PaginationItem>
            <PaginationNext
              className={
                'bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 border text-sm text-[#414651] shadow-xs'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
