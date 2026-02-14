import { useMemo, useState } from 'react';

import { CardContent } from '@/components/ui/card';
import { useTableStore } from '@/stores/table-store';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

import FilterIcon from '@/assets/icons/filter.svg';
import { CustomTable, SearchInput } from '@/components/customs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontalIcon } from 'lucide-react';

import CheckmarkIcon from '@/assets/icons/gray-checkmark.svg';
import CloseIcon from '@/assets/icons/close-circle.svg';

const statusBadgeStyles = {
  pending: 'bg-amber-50 text-amber-400',
  approved: 'bg-green-100 text-green-500',
  rejected: 'bg-red-100 text-red-500',
};

const TrainingQueueTable = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [rows, setRows] = useState(tableData);
  const [searchTerm, setSearchTerm] = useState('');

  const currentPage = useTableStore((s) => s.currentPage);
  const setCurrentPage = useTableStore((state) => state.setCurrentPage);

  const pageSize = 5;

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const matchesStatus =
        statusFilter === 'all' || r.status.toLowerCase() === statusFilter;

      if (!matchesStatus) return false;

      if (!searchTerm) return true;

      const term = searchTerm.toLowerCase();
      return (
        r.employeeName.toLowerCase().includes(term) ||
        r.courseRequested.toLowerCase().includes(term) ||
        r.manager.toLowerCase().includes(term)
      );
    });
  }, [rows, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const currentPageRows = filteredRows.slice(startIndex, startIndex + pageSize);

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleApprove = (requestId) => {
    setRows((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'Approved' } : r))
    );
  };

  const handleReject = (requestId) => {
    setRows((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'Rejected' } : r))
    );
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  };

  const renderBadge = (text) => {
    const key = (text || '').toLowerCase();
    const styles = statusBadgeStyles[key] ?? 'bg-gray-100 text-gray-700';
    return (
      <span
        className={`inline-flex w-[98px] items-center justify-center rounded-full px-4 py-2 text-sm font-medium ${styles}`}
      >
        {text}
      </span>
    );
  };

  return (
    <CardContent>
      <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <h2 className="text-lg font-semibold">Approve Queue</h2>

        <div className="flex items-center gap-3">
          <SearchInput
            placeholder="Search employee or course..."
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
                title="Filter by Status"
              >
                <img src={FilterIcon} alt="Filter by Status" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="text-sm">
              {statusFilterData.map((filter) => (
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
          <TableRow key={row.id} className="rounded-2xl">
            <TableCell className="py-6">
              <div className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarImage src={row.employeeAvatar} />
                  <AvatarFallback className="bg-purple-100 text-purple-700">
                    {getInitials(row.employeeName)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-900">
                  {row.employeeName}
                </span>
              </div>
            </TableCell>

            <TableCell className="py-6 text-sm font-medium">
              {row.courseRequested}
            </TableCell>

            <TableCell className="py-6 text-sm font-medium">
              {row.dateRequested}
            </TableCell>

            <TableCell className="py-6">{row.manager}</TableCell>

            <TableCell className="py-6">{renderBadge(row.status)}</TableCell>

            <TableCell className="py-6 text-right md:w-5">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <MoreHorizontalIcon />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="text-sm">
                  <DropdownMenuItem onClick={() => handleApprove(row.id)}>
                    <img src={CheckmarkIcon} alt="Approve" className="mr-1 h-4" />
                    <span className="text-sm">Approve</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => handleReject(row.id)}>
                    <img src={CloseIcon} alt="Reject" className="mr-1 h-4" />
                    <span className="text-sm">Reject</span>
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

export default TrainingQueueTable;

const statusFilterData = [
  { key: 'all', label: 'All Status' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

const tableHeaders = [
  { key: 'employeeName', label: 'Employee', className: '' },
  { key: 'courseRequested', label: 'Course Requested', className: '' },
  { key: 'dateRequested', label: 'Date', className: '' },
  { key: 'manager', label: 'Manager', className: '' },
  { key: 'status', label: 'Status', className: '' },
  { key: 'actions', label: '', className: 'w-10 text-right' },
];

const tableData = [
  {
    id: '1',
    employeeName: 'Sarah Jenkins',
    employeeAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    courseRequested: 'Advanced React Patterns',
    dateRequested: '2026-02-05',
    manager: 'John Smith',
    managerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    status: 'Pending',
  },
  {
    id: '2',
    employeeName: 'Michael Chen',
    employeeAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    courseRequested: 'Data Privacy Compliance',
    dateRequested: '2026-02-08',
    manager: 'Jennifer Davis',
    managerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer',
    status: 'Approved',
  },
  {
    id: '3',
    employeeName: 'Emily Rodriguez',
    employeeAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    courseRequested: 'Leadership Skills Development',
    dateRequested: '2026-02-10',
    manager: 'Robert Johnson',
    managerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    status: 'Pending',
  },
  {
    id: '4',
    employeeName: 'James Wilson',
    employeeAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    courseRequested: 'Cloud Computing Basics',
    dateRequested: '2026-02-11',
    manager: 'John Smith',
    managerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    status: 'Rejected',
  },
  {
    id: '5',
    employeeName: 'Jessica Lee',
    employeeAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica',
    courseRequested: 'Business Communication',
    dateRequested: '2026-02-09',
    manager: 'Jennifer Davis',
    managerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer',
    status: 'Pending',
  },
  {
    id: '6',
    employeeName: 'David Kumar',
    employeeAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    courseRequested: 'Python for Data Science',
    dateRequested: '2026-02-12',
    manager: 'Robert Johnson',
    managerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    status: 'Approved',
  },
];
