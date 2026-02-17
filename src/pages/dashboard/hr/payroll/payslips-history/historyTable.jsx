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

const statusBadgeStyles = {
  pending: 'bg-amber-50 text-amber-700',
  paid: 'bg-emerald-50 text-emerald-700',
};

const PayslipTable = ({ onAction }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [rows, _setRows] = useState(tableData);
  const [searchTerm, setSearchTerm] = useState('');

  const currentPage = useTableStore((s) => s.currentPage);
  const setCurrentPage = useTableStore((state) => state.setCurrentPage);

  const pageSize = 5;

  const filteredRows = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return rows.filter((row) => {
      const statusMatches =
        statusFilter === 'all' || row.status.toLowerCase() === statusFilter;
      const searchMatches =
        !term || row.period.toLowerCase().includes(term.trim());

      return statusMatches && searchMatches;
    });
  }, [rows, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const currentPageRows = filteredRows.slice(startIndex, startIndex + pageSize);

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const actionOptions = (row) => {
    return [
      { label: 'View', action: () => onAction?.(row, 'view') },
      { label: 'Download', action: () => onAction?.(row, 'download') },
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
            placeholder="Search pay period......."
            value={searchTerm}
            onValueChange={setSearchTerm}
            className="w-full rounded-full border border-gray-200 bg-white py-5 pr-4 pl-10 md:w-[320px]"
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
              {row.grossPay}
            </TableCell>

            <TableCell className="py-6 text-base font-medium">
              {row.deductions}
            </TableCell>

            <TableCell className="py-6 text-base font-medium">
              {row.netPay}
            </TableCell>

            <TableCell className="py-6 text-base font-medium">
              {row.paymentDate}
            </TableCell>

            <TableCell className="py-6 text-base font-medium">
              {renderBadge(row.status, statusBadgeStyles)}
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
  { key: 'all', label: 'All Payslips' },
  { key: 'paid', label: 'Paid' },
  { key: 'pending', label: 'Pending' },
];

const tableHeaders = [
  { key: 'period', label: 'Pay Period', className: '' },
  { key: 'grossPay', label: 'Gross Pay', className: '' },
  { key: 'deductions', label: 'Deductions', className: '' },
  { key: 'netPay', label: 'Net Pay', className: '' },
  { key: 'paymentDate', label: 'Payment Date', className: '' },
  { key: 'status', label: 'Status', className: '' },
  { key: 'actions', label: '', className: 'w-10 text-right' },
];

const tableData = [
  {
    period: 'May 2025',
    grossPay: '₦8,500',
    deductions: '₦1,500',
    netPay: '₦7,000',
    paymentDate: 'Feb -12-2025',
    status: 'Pending',
    previewData: {
      employeeName: 'Sarah Jenkins',
      employeeId: 'N145,000',
      department: 'Product Design',
      role: 'Senior Product Designer',
      period: 'May 2025',
      grossPay: '₦8,500',
      deductionsTotal: '₦1,500',
      netPay: '₦7,000',
    },
  },
  {
    period: 'April 2025',
    grossPay: '₦8,500',
    deductions: '₦1,500',
    netPay: '₦7,000',
    paymentDate: 'Feb -12-2025',
    status: 'Paid',
    previewData: {
      employeeName: 'Sarah Jenkins',
      employeeId: 'N145,000',
      department: 'Product Design',
      role: 'Senior Product Designer',
      period: 'April 2025',
      grossPay: '₦8,500',
      deductionsTotal: '₦1,500',
      netPay: '₦7,000',
    },
  },
  {
    period: 'March 2025',
    grossPay: '₦8,500',
    deductions: '₦1,500',
    netPay: '₦7,000',
    paymentDate: 'Feb -12-2025',
    status: 'Paid',
    previewData: {
      employeeName: 'Sarah Jenkins',
      employeeId: 'N145,000',
      department: 'Product Design',
      role: 'Senior Product Designer',
      period: 'March 2025',
      grossPay: '₦8,500',
      deductionsTotal: '₦1,500',
      netPay: '₦7,000',
    },
  },
  {
    period: 'February 2025',
    grossPay: '₦8,500',
    deductions: '₦1,500',
    netPay: '₦7,000',
    paymentDate: 'Feb -12-2025',
    status: 'Paid',
    previewData: {
      employeeName: 'Sarah Jenkins',
      employeeId: 'N145,000',
      department: 'Product Design',
      role: 'Senior Product Designer',
      period: 'February 2025',
      grossPay: '₦8,500',
      deductionsTotal: '₦1,500',
      netPay: '₦7,000',
    },
  },
  {
    period: 'January 2025',
    grossPay: '₦8,500',
    deductions: '₦1,500',
    netPay: '₦7,000',
    paymentDate: 'Feb -12-2025',
    status: 'Paid',
    previewData: {
      employeeName: 'Sarah Jenkins',
      employeeId: 'N145,000',
      department: 'Product Design',
      role: 'Senior Product Designer',
      period: 'January 2025',
      grossPay: '₦8,500',
      deductionsTotal: '₦1,500',
      netPay: '₦7,000',
    },
  },
];
