import { useMemo, useState } from 'react';

import { CardContent } from '@/components/ui/card';
import { useTableStore } from '@/stores/table-store';
import { Badge } from '@/components/ui/badge';
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

const priorityBadgeStyles = {
  mandatory: 'bg-red-100 text-red-500',
  optional: 'bg-blue-50 text-blue-400',
};

const statusBadgeStyles = {
  completed: 'bg-green-100 text-green-500',
  assigned: 'bg-gray-200 text-gray-700',
  'in progress': 'bg-amber-50 text-amber-400',
};

const CourseTable = ({ onEdit }) => {
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [rows, setRows] = useState(tableData);
  const [searchTerm, setSearchTerm] = useState('');

  const currentPage = useTableStore((s) => s.currentPage);
  const setCurrentPage = useTableStore((state) => state.setCurrentPage);

  const pageSize = 5;

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const matchesPriority =
        priorityFilter === 'all' || r.priority.toLowerCase() === priorityFilter;
      const matchesStatus =
        statusFilter === 'all' || r.status.toLowerCase() === statusFilter;

      if (!matchesPriority || !matchesStatus) return false;

      if (!searchTerm) return true;

      const term = searchTerm.toLowerCase();
      return (
        r.courseName.toLowerCase().includes(term) ||
        r.assignedTo.name.toLowerCase().includes(term)
      );
    });
  }, [rows, searchTerm, priorityFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const currentPageRows = filteredRows.slice(startIndex, startIndex + pageSize);

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePriorityFilterChange = (priority) => {
    setPriorityFilter(priority);
    setCurrentPage(1);
  };

  const handleDelete = (courseId) => {
    setRows((prev) => prev.filter((r) => r.id !== courseId));
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  };

  const renderBadge = (text, map) => {
    const key = (text || '').toLowerCase();
    const styles = map[key] ?? 'bg-gray-100 text-gray-700';
    return (
      <span
        className={`min-w-[98px] rounded-full px-4 py-2 text-xs font-medium ${styles}`}
      >
        {text}
      </span>
    );
  };

  return (
    <CardContent>
      <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <h2 className="text-lg font-semibold">Training Assignments</h2>

        <div className="flex items-center gap-3">
          <SearchInput
            placeholder="Search course or employee..."
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
                  priorityFilter !== 'all' ? 'border-blue-200 bg-blue-50' : ''
                }
                title="Filter by Priority"
              >
                <img src={FilterIcon} alt="Filter by Priority" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="text-sm">
              {priorityFilterData.map((filter) => (
                <DropdownMenuItem
                  key={filter.key}
                  onClick={() => handlePriorityFilterChange(filter.key)}
                  className={priorityFilter === filter.key ? 'bg-blue-50' : ''}
                >
                  {filter.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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
            <TableCell className="py-6 text-base font-medium">
              {row.courseName}
            </TableCell>

            <TableCell className="py-6">
              <div className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarImage src={row.assignedTo.avatar} />
                  <AvatarFallback className="bg-purple-100 text-purple-700">
                    {getInitials(row.assignedTo.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-900">
                  {row.assignedTo.name}
                </span>
              </div>
            </TableCell>

            <TableCell className="py-6 text-base font-medium">
              {row.dueDate}
            </TableCell>

            <TableCell className="py-6">
              {renderBadge(row.priority, priorityBadgeStyles)}
            </TableCell>

            <TableCell className="py-6">
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
                  <DropdownMenuItem onClick={() => onEdit(row)}>
                    Edit
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => handleDelete(row.id)}>
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

export default CourseTable;

const priorityFilterData = [
  { key: 'all', label: 'All Priorities' },
  { key: 'mandatory', label: 'Mandatory' },
  { key: 'optional', label: 'Optional' },
];

const statusFilterData = [
  { key: 'all', label: 'All Status' },
  { key: 'completed', label: 'Completed' },
  { key: 'assigned', label: 'Assigned' },
  { key: 'in progress', label: 'In Progress' },
];

const tableHeaders = [
  { key: 'courseName', label: 'Course Name', className: '' },
  { key: 'assignedTo', label: 'Assigned To', className: '' },
  { key: 'dueDate', label: 'Due Date', className: '' },
  { key: 'priority', label: 'Priority', className: '' },
  { key: 'status', label: 'Status', className: '' },
  { key: 'actions', label: '', className: 'w-10 text-right' },
];

const tableData = [
  {
    id: '1',
    courseName: 'Advanced React Patterns',
    assignedTo: {
      name: 'Sarah Jenkins',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
    dueDate: '2026-02-28',
    priority: 'Mandatory',
    status: 'In Progress',
  },
  {
    id: '2',
    courseName: 'Data Privacy Compliance',
    assignedTo: {
      name: 'Michael Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    },
    dueDate: '2026-03-15',
    priority: 'Mandatory',
    status: 'Assigned',
  },
  {
    id: '3',
    courseName: 'Leadership Skills Development',
    assignedTo: {
      name: 'Emily Rodriguez',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    },
    dueDate: '2026-04-10',
    priority: 'Optional',
    status: 'Completed',
  },
  {
    id: '4',
    courseName: 'Cloud Computing Basics',
    assignedTo: {
      name: 'James Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    },
    dueDate: '2026-03-01',
    priority: 'Mandatory',
    status: 'In Progress',
  },
  {
    id: '5',
    courseName: 'Business Communication',
    assignedTo: {
      name: 'Jessica Lee',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica',
    },
    dueDate: '2026-02-20',
    priority: 'Optional',
    status: 'Assigned',
  },
  {
    id: '6',
    courseName: 'Python for Data Science',
    assignedTo: {
      name: 'David Kumar',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    },
    dueDate: '2026-05-01',
    priority: 'Optional',
    status: 'Assigned',
  },
];
