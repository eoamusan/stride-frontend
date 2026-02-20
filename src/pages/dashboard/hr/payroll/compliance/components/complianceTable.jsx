import { useEffect, useMemo } from 'react';
import { MoreHorizontalIcon } from 'lucide-react';

import { CustomTable, SearchInput } from '@/components/customs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/components/ui/table';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTableStore } from '@/stores/table-store';
import {
  formatCurrencyValue,
  formatDateLabel,
  formatStatusLabel,
  normalizeStatus,
  resolveEntityIdentifier,
} from '@/lib/utils';

import FilterIcon from '@/assets/icons/filter.svg';
import CheckmarkIcon from '@/assets/icons/gray-checkmark.svg';
import DeleteIcon from '@/assets/icons/gray-delete.svg';
import { Spinner } from '@/components/ui/spinner';

const statusStyles = {
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-600',
  upcoming: 'bg-gray-200 text-gray-700',
};

const ComplianceTable = ({
  rows = [],
  isLoading = false,
  totalPages = 1,
  searchTerm = '',
  onSearchChange,
  statusFilter = 'all',
  onStatusFilterChange,
  onEdit,
  onMarkPaid,
  onDelete,
  actionLoading = {},
}) => {
  const currentPage = useTableStore((s) => s.currentPage);
  const setCurrentPage = useTableStore((state) => state.setCurrentPage);
  const handleSearchUpdate = (value) => {
    onSearchChange?.(value);
  };

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages, setCurrentPage]);

  const normalizedRows = useMemo(() => {
    return (rows ?? []).map((row) => {
      const statusKey = normalizeStatus(row?.status, 'upcoming');
      return {
        id:
          resolveEntityIdentifier(row) ??
          `${row?.obligationName ?? row?.name}-${row?.dueDate}`,
        obligationName: row?.obligationName ?? row?.name ?? '—',
        obligationType: row?.obligationType ?? row?.type ?? '—',
        dueDateLabel: formatDateLabel(row?.dueDate),
        amountLabel: formatCurrencyValue(row?.amount),
        statusLabel: formatStatusLabel(row?.status, 'Upcoming'),
        statusKey,
        original: row,
      };
    });
  }, [rows]);

  const normalizedFilter = normalizeStatus(statusFilter, 'all');

  const filteredRows = useMemo(() => {
    if (normalizedFilter === 'all') return normalizedRows;
    return normalizedRows.filter((row) => row.statusKey === normalizedFilter);
  }, [normalizedRows, normalizedFilter]);

  const isEmpty = !isLoading && filteredRows.length === 0;

  const actionState = {
    edit: Boolean(actionLoading.edit),
    markPaid: Boolean(actionLoading.markPaid),
    delete: Boolean(actionLoading.delete),
  };

  const handleStatusFilterChange = (status) => {
    onStatusFilterChange?.(status);
    setCurrentPage(1);
  };

  const renderBadge = (status, statusKey) => {
    const styles = statusStyles[statusKey] ?? 'bg-gray-100 text-gray-700';
    return (
      <span
        className={`inline-flex w-[98px] items-center justify-center rounded-full px-4 py-2 text-sm font-medium ${styles}`}
      >
        {status}
      </span>
    );
  };

  const renderRows = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell
            colSpan={tableHeaders.length}
            className="py-6 text-center text-sm"
          >
            Loading obligations...
          </TableCell>
        </TableRow>
      );
    }

    return filteredRows.map((row) => (
      <TableRow key={row.id} className="rounded-2xl">
        <TableCell className="py-5 text-sm font-medium">
          {row.obligationName}
        </TableCell>

        <TableCell className="py-5 text-sm font-medium">
          {row.obligationType}
        </TableCell>

        <TableCell className="py-5 text-sm font-medium">
          {row.dueDateLabel}
        </TableCell>

        <TableCell className="py-5 text-sm font-medium">
          <div className="flex items-center gap-3">
            <span>{row.amountLabel}</span>
          </div>
        </TableCell>

        <TableCell className="py-5 text-sm font-medium">
          {renderBadge(row.statusLabel, row.statusKey)}
        </TableCell>

        <TableCell className="py-5 text-right md:w-5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontalIcon />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="text-xs">
              <DropdownMenuItem
                disabled={row.statusKey === 'paid' || actionState.edit}
                onClick={() =>
                  row.statusKey !== 'paid' && onEdit?.(row.original)
                }
                className="text-sm"
              >
                <img src={CheckmarkIcon} alt="checkmark" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                disabled={row.statusKey === 'paid' || actionState.markPaid}
                onClick={() =>
                  row.statusKey !== 'paid' && onMarkPaid?.(row.original)
                }
                className="text-sm"
              >
                <img src={CheckmarkIcon} alt="checkmark" />
                Mark as Paid
              </DropdownMenuItem>

              <DropdownMenuItem
                disabled={actionState.delete}
                onClick={() => onDelete?.(row.original)}
                className="text-sm"
              >
                <img src={DeleteIcon} alt="delete" />
                {actionState.delete ? 'Deleting...' : 'Delete'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <CardContent>
      <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <h2 className="text-lg font-semibold">Obligations</h2>

        <div className="flex items-center gap-3">
          <SearchInput
            placeholder="Search Obligation..."
            value={searchTerm}
            onValueChange={handleSearchUpdate}
            resetPageOnChange
            onResetPage={() => setCurrentPage(1)}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={`h-12 w-12 rounded-xl ${normalizedFilter !== 'all' ? 'border-blue-200 bg-blue-50' : ''}`}
              >
                <span className="sr-only">Filter</span>
                <img src={FilterIcon} alt="Filter Icon" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="text-sm">
              {filterData.map((filter) => (
                <DropdownMenuItem
                  key={filter.key}
                  onClick={() => handleStatusFilterChange(filter.key)}
                  className={
                    normalizedFilter === filter.key ? 'bg-blue-50' : ''
                  }
                >
                  {filter.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CustomTable
        tableHeaders={tableHeaders}
        totalPages={totalPages}
        searchTerm={searchTerm}
        setSearchTerm={handleSearchUpdate}
        statusFilter={statusFilter}
        hasNoData={isEmpty}
      >
        {renderRows()}
      </CustomTable>
    </CardContent>
  );
};

export default ComplianceTable;

const filterData = [
  { key: 'all', label: 'All' },
  { key: 'paid', label: 'Paid' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'upcoming', label: 'Upcoming' },
];

const tableHeaders = [
  { key: 'obligation', label: 'Obligation', className: '' },
  { key: 'type', label: 'Type', className: '' },
  { key: 'dueDate', label: 'Due Date', className: '' },
  { key: 'amount', label: 'Amount', className: '' },
  { key: 'status', label: 'Status', className: '' },
  { key: 'actions', label: '', className: 'w-10 text-right' },
];
