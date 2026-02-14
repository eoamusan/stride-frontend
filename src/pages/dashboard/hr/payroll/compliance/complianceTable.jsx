import { useEffect, useMemo, useState } from 'react';

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

import FilterIcon from '@/assets/icons/filter.svg';
import CheckmarkIcon from '@/assets/icons/gray-checkmark.svg';
import DeleteIcon from '@/assets/icons/gray-delete.svg';
import { defaultComplianceRows } from './data';

const statusStyles = {
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-600',
  upcoming: 'bg-gray-200 text-gray-700',
};

const ComplianceTable = ({ rows, onRowsChange }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [internalRows, setInternalRows] = useState(defaultComplianceRows);
  const [searchTerm, setSearchTerm] = useState('');

  const dataRows = rows ?? internalRows;
  const setDataRows = onRowsChange ?? setInternalRows;

  const currentPage = useTableStore((s) => s.currentPage);
  const setCurrentPage = useTableStore((state) => state.setCurrentPage);
  const pageSize = 5;

  const filteredRows = useMemo(() => {
    return dataRows.filter((r) => {
      const matchesStatus =
        statusFilter === 'all' || r.status.toLowerCase() === statusFilter;
      const matchesSearch = searchTerm
        ? r.obligation.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.type.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      return matchesStatus && matchesSearch;
    });
  }, [dataRows, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const currentPageRows = filteredRows.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages, setCurrentPage]);

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleMarkPaid = (obligation) => {
    setDataRows((prev) =>
      prev.map((r) =>
        r.obligation === obligation ? { ...r, status: 'Paid' } : r
      )
    );
  };

  const handleDelete = (obligation) => {
    setDataRows((prev) => prev.filter((r) => r.obligation !== obligation));
  };

  const renderBadge = (status) => {
    const key = status.toLowerCase();
    const styles = statusStyles[key] ?? 'bg-gray-100 text-gray-700';
    return (
      <span
        className={`inline-flex w-[98px] items-center justify-center rounded-full px-4 py-2 text-sm font-medium ${styles}`}
      >
        {status}
      </span>
    );
  };

  return (
    <CardContent>
      <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <h2 className="text-lg font-semibold">Obligations</h2>

        <div className="flex items-center gap-3">
          <SearchInput
            placeholder="Search Obligation..."
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
                className={
                  statusFilter !== 'all' ? 'border-blue-200 bg-blue-50' : ''
                }
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
                  className={statusFilter === filter.key ? 'bg-blue-50' : ''}
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
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
      >
        {currentPageRows.map((row) => (
          <TableRow key={row.obligation} className="rounded-2xl">
            <TableCell className="py-5 text-sm font-medium">
              {row.obligation}
            </TableCell>

            <TableCell className="py-5 text-sm font-medium">
              {row.type}
            </TableCell>

            <TableCell className="py-5 text-sm font-medium">
              {row.dueDate}
            </TableCell>

            <TableCell className="py-5 text-sm font-medium">
              <div className="flex items-center gap-3">
                <span>{row.amount}</span>
              </div>
            </TableCell>

            <TableCell className="py-5 text-sm font-medium">
              {renderBadge(row.status)}
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
                    disabled={row.status.toLowerCase() === 'paid'}
                    onClick={() => handleMarkPaid(row.obligation)}
                    className="text-sm"
                  >
                    <img src={CheckmarkIcon} alt="checkmark" />
                    Mark as Paid
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => handleDelete(row.obligation)}
                    className="text-sm"
                  >
                    <img src={DeleteIcon} alt="delete" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
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
