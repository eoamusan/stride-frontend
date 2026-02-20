import { useEffect, useMemo, useState } from 'react';

import { MoreHorizontalIcon } from 'lucide-react';

import { useTableStore } from '@/stores/table-store';
import FilterIcon from '@/assets/icons/filter.svg';
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
import { Badge } from '@/components/ui/badge';

import EditIcon from '@/assets/icons/gray-edit.svg';
import DeleteIcon from '@/assets/icons/gray-delete.svg';
import EyeIcon from '@/assets/icons/eye.svg';
import PaidIcon from '@/assets/icons/gray-checkmark.svg';
import { useGetAllPayrollQuery } from '@/hooks/api/useGetAllPayrollQuery';
import {
  formatCurrencyValue,
  normalizeStatus,
  formatStatusLabel,
  resolveEntityIdentifier,
} from '@/lib/utils';

import NoDataIcon from '@/assets/icons/no-data.svg';
import { Spinner } from '@/components/ui/spinner';

const PAYROLL_IDENTIFIER_KEYS = [
  'id',
  '_id',
  'payrollId',
  'payrollRunId',
  'employeeId',
  'reference',
  'employeeName',
];

const ReviewTable = ({ onAction = () => {}, isFrozen = false }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const currentPage = useTableStore((s) => s.currentPage);
  const setCurrentPage = useTableStore((state) => state.setCurrentPage);

  const pageSize = 5;

  const {
    payrollRuns,
    pagination,
    isLoading: isPayrollLoading,
    isFetching: isPayrollFetching,
  } = useGetAllPayrollQuery({
    search: searchTerm,
    page: currentPage,
    perPage: pageSize,
  });

  useEffect(() => {
    if (!Array.isArray(payrollRuns)) {
      setRows([]);
      return;
    }

    setRows(payrollRuns.map(mapPayrollRunToRow).filter(Boolean));
  }, [payrollRuns]);

  useEffect(() => {
    if (
      pagination?.totalPages &&
      currentPage > pagination.totalPages &&
      pagination.totalPages > 0
    ) {
      setCurrentPage(pagination.totalPages);
    }
  }, [pagination?.totalPages, currentPage, setCurrentPage]);

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (statusFilter && statusFilter !== 'all') {
        return (
          normalizeStatus(r.type).toLowerCase() ===
          normalizeStatus(statusFilter).toLowerCase()
        );
      }
      return true;
    });
  }, [rows, statusFilter]);

  const totalPages = pagination?.totalPages ?? 1;
  const currentPageRows = filteredRows;
  const isTableLoading = isPayrollLoading || isPayrollFetching;

  const handleDelete = (rowId) => {
    setRows((prev) =>
      prev.filter(
        (r) => resolveEntityIdentifier(r, PAYROLL_IDENTIFIER_KEYS) !== rowId
      )
    );
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const typeToBadgeVariant = (type) => {
    if (!type) return 'default';
    const t = normalizeStatus(type);
    if (t === 'calculated') return 'success';
    if (t === 'missing info' || t === 'missing-info') return 'danger';
    return 'default';
  };

  if (isTableLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <CardContent>
      <div className="mb-2 flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <h2 className="font-bold">Salary Component</h2>

        <div className="flex items-center gap-3">
          <SearchInput
            placeholder="Search employee..."
            value={searchTerm}
            onValueChange={setSearchTerm}
            resetPageOnChange
            onResetPage={() => setCurrentPage(1)}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={`h-12 w-12 rounded-xl ${statusFilter !== 'all' ? 'border-blue-200 bg-blue-50' : ''}`}
              >
                <img src={FilterIcon} alt="Filter Icon" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {filterData.map((filter) => (
                <DropdownMenuItem
                  key={filter.key}
                  onClick={() => handleStatusFilterChange(filter.key)}
                  className={statusFilter === filter.key ? 'bg-blue-50' : ''}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${filter.color}`}
                    ></span>
                    {filter.label}
                  </span>
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
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        hasNoData={!isTableLoading && currentPageRows.length === 0}
      >
        {!isTableLoading &&
          currentPageRows.length > 0 &&
          currentPageRows.map((row) => {
            const rowIdentifier = resolveEntityIdentifier(
              row,
              PAYROLL_IDENTIFIER_KEYS
            );

            return (
              <TableRow key={rowIdentifier || row.employeeName}>
                <TableCell className="py-4 font-medium">
                  {row.employeeName}
                </TableCell>

                <TableCell className="py-4 font-medium">{row.role}</TableCell>

                <TableCell className="py-4 font-medium">
                  {row.grossPay}
                </TableCell>

                <TableCell className="py-4 font-medium">
                  {row.deductions}
                </TableCell>
                <TableCell className="py-4 font-medium">{row.netPay}</TableCell>

                <TableCell className="py-4 font-medium">
                  <Badge
                    variant={typeToBadgeVariant(row.type)}
                    className="px-6 py-2"
                  >
                    {formatStatusLabel(row.type)}
                  </Badge>
                </TableCell>

                <TableCell className="py-4 text-right md:w-5">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontalIcon />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="text-xs">
                      <DropdownMenuItem
                        className="text-xs"
                        onClick={() => onAction(row, 'view')}
                      >
                        <img src={EyeIcon} alt="View" className="mr-1 h-4" />
                        <span>View</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-xs"
                        disabled={isFrozen}
                        onClick={() => !isFrozen && onAction(row, 'edit')}
                      >
                        <img
                          src={isFrozen ? PaidIcon : EditIcon}
                          alt="Edit"
                          className="mr-1 h-4"
                        />
                        <span>{isFrozen ? 'Paid' : 'Edit'}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-xs"
                        onClick={() => handleDelete(rowIdentifier)}
                      >
                        <img
                          src={DeleteIcon}
                          alt="Delete"
                          className="mr-1 h-4"
                        />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
      </CustomTable>
    </CardContent>
  );
};

export default ReviewTable;

const filterData = [
  { key: 'all', label: 'All Components' },
  { key: 'calculated', label: 'Calculated', color: 'bg-green-500' },
  { key: 'missing-info', label: 'Missing Info', color: 'bg-red-500' },
];

const tableHeaders = [
  { key: 'employeeName', label: 'Employee Name', className: '' },
  { key: 'role', label: 'Role', className: '' },
  { key: 'grossPay', label: 'Gross Pay', className: '' },
  { key: 'deductions', label: 'Deductions', className: '' },
  { key: 'netPay', label: 'Net Pay', className: '' },
  { key: 'status', label: 'Status', className: '' },
  { key: 'actions', label: 'Actions', className: 'text-right' },
];

const mapPayrollRunToRow = (run) => {
  if (!run || typeof run !== 'object') return null;

  const identifier = resolveEntityIdentifier(run, PAYROLL_IDENTIFIER_KEYS);

  const employeeName =
    run.employeeName ||
    run.employee?.fullName ||
    run.employee?.name ||
    run.employee?.displayName ||
    'Unnamed Employee';

  const role =
    run.role ||
    run.employee?.role ||
    run.employee?.position ||
    run.position ||
    '—';

  const statusLabel =
    run.status ||
    run.type ||
    run.payrollStatus ||
    run.processingStatus ||
    'Calculated';

  return {
    id: identifier,
    employeeId: run.employeeId || run.employee?._id,
    employeeName,
    role,
    grossPay: formatCurrencyValue(
      run.grossPay ?? run.gross ?? run.totalGross ?? run.summary?.gross
    ),
    deductions: formatCurrencyValue(
      run.deductions ?? run.totalDeductions ?? run.summary?.deductions
    ),
    netPay: formatCurrencyValue(
      run.netPay ?? run.net ?? run.totalNet ?? run.summary?.net
    ),
    type: statusLabel,
    raw: run,
  };
};
