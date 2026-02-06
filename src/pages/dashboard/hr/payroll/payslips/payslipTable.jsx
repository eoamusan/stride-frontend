import { useMemo, useState } from 'react';

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
import { MoreHorizontalIcon } from 'lucide-react';

const payrollBadgeStyles = {
  frozen: 'bg-gray-200 text-gray-700',
  finalized: 'bg-green-100 text-green-700',
};

const distributionBadgeStyles = {
  pending: 'bg-amber-100 text-amber-600',
  released: 'bg-green-100 text-green-700',
};

const PayslipTable = ({ onAction }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [rows, setRows] = useState(tableData);
  const [searchTerm, setSearchTerm] = useState('');

  const currentPage = useTableStore((s) => s.currentPage);
  const setCurrentPage = useTableStore((state) => state.setCurrentPage);

  const pageSize = 5;

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (statusFilter !== 'all') {
        return r.payrollStatus.toLowerCase() === statusFilter;
      }

      if (!searchTerm) return true;

      const term = searchTerm.toLowerCase();
      return r.period.toLowerCase().includes(term);
    });
  }, [rows, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const currentPageRows = filteredRows.slice(startIndex, startIndex + pageSize);

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleDelete = (period) => {
    setRows((prev) => prev.filter((r) => r.period !== period));
  };

  const actionOptions = (row) => {
    if (row.distributionStatus.toLowerCase() === 'pending') {
      return [
        {
          label: 'Generate Payslip',
          action: () => onAction?.(row, 'generate'),
        },
      ];
    }
    return [
      { label: 'Preview', action: () => onAction?.(row, 'preview') },
      { label: 'Delete', action: () => handleDelete(row.period) },
    ];
  };

  const renderBadge = (text, map) => {
    const key = (text || '').toLowerCase();
    const styles = map[key] ?? 'bg-gray-100 text-gray-700';
    return (
      <span className={`rounded-full px-4 py-2 text-sm font-medium ${styles}`}>
        {text}
      </span>
    );
  };

  return (
    <CardContent>
      <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <h2 className="text-lg font-semibold">Payslips</h2>

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
                className={
                  statusFilter !== 'all' ? 'border-blue-200 bg-blue-50' : ''
                }
              >
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
          <TableRow key={row.period} className="rounded-2xl">
            <TableCell className="py-6 text-base font-medium">
              {row.period}
            </TableCell>

            <TableCell className="py-6 text-base font-medium">
              {row.employeeCount}
            </TableCell>

            <TableCell className="py-6 text-base font-medium">
              {renderBadge(row.payrollStatus, payrollBadgeStyles)}
            </TableCell>

            <TableCell className="py-6 text-base font-medium">
              {renderBadge(row.distributionStatus, distributionBadgeStyles)}
            </TableCell>

            <TableCell className="py-6 text-right md:w-5">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <MoreHorizontalIcon />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="text-sm">
                  {actionOptions(row).map((item) => (
                    <DropdownMenuItem key={item.label} onClick={item.action}>
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </CustomTable>
    </CardContent>
  );
};

export default PayslipTable;

const filterData = [
  { key: 'all', label: 'All Payrolls' },
  { key: 'frozen', label: 'Frozen' },
  { key: 'finalized', label: 'Finalized' },
];

const tableHeaders = [
  { key: 'period', label: 'Period', className: '' },
  { key: 'employeeCount', label: 'Employees No', className: '' },
  { key: 'payrollStatus', label: 'Payroll Status', className: '' },
  { key: 'distributionStatus', label: 'Distribution Status', className: '' },
  { key: 'actions', label: '', className: 'w-10 text-right' },
];

const tableData = [
  {
    period: 'May 2025',
    employeeCount: 140,
    payrollStatus: 'Frozen',
    distributionStatus: 'Pending',
    previewData: {
      employeeName: 'Sarah Jenkins',
      employeeId: 'N145,000',
      department: 'Product Design',
      role: 'Senior Product Designer',
      period: 'May 2025',
    },
  },
  {
    period: 'April 2025',
    employeeCount: 140,
    payrollStatus: 'Finalized',
    distributionStatus: 'Released',
    previewData: {
      employeeName: 'Sarah Jenkins',
      employeeId: 'N145,000',
      department: 'Product Design',
      role: 'Senior Product Designer',
      period: 'April 2025',
    },
  },
  {
    period: 'March 2025',
    employeeCount: 140,
    payrollStatus: 'Finalized',
    distributionStatus: 'Released',
    previewData: {
      employeeName: 'Sarah Jenkins',
      employeeId: 'N145,000',
      department: 'Product Design',
      role: 'Senior Product Designer',
      period: 'March 2025',
    },
  },
  {
    period: 'February 2025',
    employeeCount: 140,
    payrollStatus: 'Frozen',
    distributionStatus: 'Pending',
    previewData: {
      employeeName: 'Sarah Jenkins',
      employeeId: 'N145,000',
      department: 'Product Design',
      role: 'Senior Product Designer',
      period: 'February 2025',
    },
  },
  {
    period: 'January 2025',
    employeeCount: 140,
    payrollStatus: 'Finalized',
    distributionStatus: 'Released',
    previewData: {
      employeeName: 'Sarah Jenkins',
      employeeId: 'N145,000',
      department: 'Product Design',
      role: 'Senior Product Designer',
      period: 'January 2025',
    },
  },
];
