import { useMemo, useState } from 'react';

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

const ReviewTable = ({ onAction, isFrozen = false }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [rows, setRows] = useState(tableData);
  const [searchTerm, setSearchTerm] = useState('');

  const currentPage = useTableStore((s) => s.currentPage);
  const setCurrentPage = useTableStore((state) => state.setCurrentPage);

  const pageSize = 5;

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (statusFilter && statusFilter !== 'all') {
        if ((r.type ?? '').toLowerCase() !== statusFilter.toLowerCase())
          return false;
      }

      if (!searchTerm) return true;

      const term = searchTerm.toLowerCase();
      return (
        r.employeeName.toLowerCase().includes(term) ||
        (r.role ?? '').toLowerCase().includes(term) ||
        (r.type ?? '').toLowerCase().includes(term)
      );
    });
  }, [rows, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const currentPageRows = filteredRows.slice(startIndex, startIndex + pageSize);

  const handleDelete = (rowId) => {
    setRows((prev) => prev.filter((r) => r.employeeName !== rowId));
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const typeToBadgeVariant = (type) => {
    if (!type) return 'default';
    const t = type.toLowerCase();
    if (t === 'calculated') return 'success';
    if (t === 'missing info') return 'danger';
    return 'default';
  };

  return (
    <CardContent>
      <div className="mb-2 flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <h2 className="font-bold">Salary Component</h2>

        <div className="flex items-center gap-3">
          <SearchInput
            placeholder="Search component..."
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
      >
        {currentPageRows.map((row) => (
          <TableRow key={row.employeeName}>
            <TableCell className="py-4 font-medium">
              {row.employeeName}
            </TableCell>

            <TableCell className="py-4 font-medium">{row.role}</TableCell>

            <TableCell className="py-4 font-medium">{row.grossPay}</TableCell>

            <TableCell className="py-4 font-medium">{row.deductions}</TableCell>
            <TableCell className="py-4 font-medium">{row.netPay}</TableCell>

            <TableCell className="py-4 font-medium">
              <Badge
                variant={typeToBadgeVariant(row.type)}
                className="px-6 py-2"
              >
                {row.type}
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
                    onClick={() => handleDelete(row.employeeName)}
                  >
                    <img src={DeleteIcon} alt="Delete" className="mr-1 h-4" />
                    <span>Delete</span>
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

export default ReviewTable;

const filterData = [
  { key: 'all', label: 'All Components' },
  { key: 'calculated', label: 'Calculated', color: 'bg-green-500' },
  { key: 'missing Info', label: 'Missing Info', color: 'bg-red-500' },
];

const tableHeaders = [
  { key: 'employeeName', label: 'Employee Name', className: '' },
  { key: 'role', label: 'Role', className: '' },
  { key: 'grossPay', label: 'Gross Pay', className: '' },
  { key: 'deductions', label: 'Deductions', className: '' },
  { key: 'netPay', label: 'Net Pay', className: '' },
  { key: 'status', label: 'Status', className: '' },
];

const tableData = [
  {
    employeeName: 'Nathaniel Desire',
    role: 'Manager',
    grossPay: '₦8,500',
    deductions: '₦1,500',
    netPay: '₦7,500',
    type: 'Calculated',
  },
  {
    employeeName: 'Femi Johnson',
    role: 'Senior Software Developer',
    grossPay: '₦8,500',
    deductions: '₦1,500',
    netPay: '₦7,500',
    type: 'Calculated',
  },
  {
    employeeName: 'Sarah Adeyemi',
    role: 'HR Manager',
    grossPay: '₦8,500',
    deductions: '₦1,500',
    netPay: '₦7,500',
    type: 'Calculated',
  },
  {
    employeeName: 'Kemi Ajileye',
    role: 'Software Engineer',
    grossPay: '₦8,500',
    deductions: '₦1,500',
    netPay: '₦7,500',
    type: 'Missing Info',
  },
];
