import { useMemo, useState } from 'react';

import { MoreHorizontalIcon } from 'lucide-react';

import { useTableStore } from '@/stores/table-store';
import FilterIcon from '@/assets/icons/filter.svg';
import ReminderIcon from '@/assets/icons/reminder.svg';
import CompleteIcon from '@/assets/icons/complete.svg';
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
import { Progress } from '@/components/ui/progress';
import CustomModal from '@/components/customs/modal';
import SetReminderModalContent from './setReminderModalContent';

import DocumentIcon from '@/assets/icons/document-text.svg';

const TrainingProgressTable = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [rows, setRows] = useState(tableData);
  const [searchTerm, setSearchTerm] = useState('');

  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [reminderDate, setReminderDate] = useState(null);
  const [reminderMessage, setReminderMessage] = useState('');

  const currentPage = useTableStore((s) => s.currentPage);
  const setCurrentPage = useTableStore((state) => state.setCurrentPage);

  const pageSize = 5;

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const matchesStatus =
        statusFilter === 'all' ||
        r.status.toLowerCase() === statusFilter.toLowerCase();

      if (!matchesStatus) return false;

      if (!searchTerm) return true;

      const term = searchTerm.toLowerCase();
      return (
        r.employeeName.toLowerCase().includes(term) ||
        r.course.toLowerCase().includes(term)
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

  const handleMarkCompleted = (rowId) => {
    setRows((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, status: 'Completed' } : r))
    );
  };

  const handleOpenReminderModal = (row) => {
    setSelectedRow(row);
    setReminderDate(null);
    setReminderMessage('');
    setReminderModalOpen(true);
  };

  const handleCloseReminderModal = () => {
    setReminderModalOpen(false);
    setSelectedRow(null);
  };

  const handleSubmitReminder = () => {
    // TODO: Implement submit logic
    setReminderModalOpen(false);
  };

  const statusBadgeStyles = {
    completed: 'bg-green-100 text-green-600',
    'in progress': 'bg-amber-50 text-amber-500',
    overdue: 'bg-red-100 text-red-500',
    'not started': 'bg-gray-100 text-gray-600',
  };

  const progressIndicatorStyles = {
    completed: 'bg-green-600',
    'in progress': 'bg-amber-500',
    overdue: 'bg-red-500',
  };

  const renderStatusBadge = (status) => {
    const key = (status || '').toLowerCase();
    const styles = statusBadgeStyles[key] ?? 'bg-gray-100 text-gray-600';
    return (
      <span className={`rounded-full px-4 py-2 text-xs font-medium ${styles}`}>
        {status}
      </span>
    );
  };

  return (
    <CardContent>
      <div className="mb-2 flex flex-col justify-between gap-2 md:flex-row md:items-center">
        <h2 className="font-bold">Training Progress</h2>

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
          <TableRow key={row.id}>
            <TableCell className="py-4 font-medium">
              {row.employeeName}
            </TableCell>

            <TableCell className="py-4 font-medium">{row.course}</TableCell>

            <TableCell className="py-4 font-medium">{row.assigned}</TableCell>

            <TableCell className="py-4 font-medium">{row.dueDate}</TableCell>

            <TableCell className="py-4 font-medium">
              <div className="flex items-center gap-3">
                <Progress
                  value={row.progress}
                  className="h-2 w-28"
                  indicatorClassName={
                    progressIndicatorStyles[row.status.toLowerCase()] ??
                    'bg-gray-200'
                  }
                />
                <span className="text-xs font-semibold text-gray-600">
                  {row.progress}%
                </span>
              </div>
            </TableCell>

            <TableCell className="py-4 font-medium">
              {renderStatusBadge(row.status)}
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
                  {row.status.toLowerCase() === 'in progress' ? (
                    <DropdownMenuItem
                      className="text-xs"
                      onClick={() => handleOpenReminderModal(row)}
                    >
                      <span className="flex items-center gap-2">
                        <img
                          src={ReminderIcon}
                          alt="Send reminder"
                          className="h-4 w-4"
                        />
                        Send Reminder
                      </span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      className="text-xs"
                      onClick={() => handleMarkCompleted(row.id)}
                    >
                      <span className="flex items-center gap-2">
                        <img
                          src={CompleteIcon}
                          alt="Mark as completed"
                          className="h-4 w-4"
                        />
                        Mark as completed
                      </span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </CustomTable>

      <CustomModal
        open={reminderModalOpen}
        handleClose={handleCloseReminderModal}
        title="Set Reminder"
        icon={DocumentIcon}
      >
        {selectedRow && (
          <SetReminderModalContent
            employee={{
              avatar: selectedRow.avatar || undefined,
              name: selectedRow.employeeName,
              role: selectedRow.role || undefined,
            }}
            courseName={selectedRow.course}
            reminderDate={reminderDate}
            setReminderDate={setReminderDate}
            message={reminderMessage}
            setMessage={setReminderMessage}
            onBack={handleCloseReminderModal}
            onSubmit={handleSubmitReminder}
          />
        )}
      </CustomModal>
    </CardContent>
  );
};

export default TrainingProgressTable;

const filterData = [
  { key: 'all', label: 'All Status', color: 'bg-gray-400' },
  { key: 'completed', label: 'Completed', color: 'bg-green-500' },
  { key: 'in progress', label: 'In Progress', color: 'bg-amber-500' },
  { key: 'overdue', label: 'Overdue', color: 'bg-red-500' },
  { key: 'not started', label: 'Not Started', color: 'bg-gray-500' },
];

const tableHeaders = [
  { key: 'employeeName', label: 'Employee', className: '' },
  { key: 'course', label: 'Course', className: '' },
  { key: 'assigned', label: 'Assigned', className: '' },
  { key: 'dueDate', label: 'Due Date', className: '' },
  { key: 'progress', label: 'Progress', className: '' },
  { key: 'status', label: 'Status', className: '' },
  { key: 'action', label: 'Action', className: '' },
];

const tableData = [
  {
    id: '1',
    employeeName: 'Nathaniel Desire',
    course: 'Leadership Training',
    assigned: '2026-01-10',
    dueDate: '2026-02-10',
    progress: 80,
    status: 'In Progress',
  },
  {
    id: '2',
    employeeName: 'Femi Johnson',
    course: 'Advanced Software Development',
    assigned: '2026-01-12',
    dueDate: '2026-02-12',
    progress: 60,
    status: 'In Progress',
  },
  {
    id: '3',
    employeeName: 'Sarah Adeyemi',
    course: 'HR Management Training',
    assigned: '2026-01-05',
    dueDate: '2026-01-30',
    progress: 100,
    status: 'Completed',
  },
  {
    id: '4',
    employeeName: 'Kemi Ajileye',
    course: 'Software Engineering Training',
    assigned: '2026-01-20',
    dueDate: '2026-02-05',
    progress: 20,
    status: 'Overdue',
  },
  {
    id: '5',
    employeeName: 'John Doe',
    course: 'Project Management Training',
    assigned: '2026-01-25',
    dueDate: '2026-02-25',
    progress: 0,
    status: 'Not Started',
  },
  {
    id: '6',
    employeeName: 'Ada Obi',
    course: 'Conflict Resolution',
    assigned: '2026-01-28',
    dueDate: '2026-02-28',
    progress: 45,
    status: 'In Progress',
  },
];
