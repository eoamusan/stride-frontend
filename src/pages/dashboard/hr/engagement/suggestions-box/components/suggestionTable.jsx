import { useMemo, useState } from 'react';

import { useTableStore } from '@/stores/table-store';

import FilterIcon from '@/assets/icons/filter.svg';
import EyeIcon from '@/assets/icons/eye.svg';
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
  new: 'bg-gray-200 text-gray-600',
  'under review': 'bg-amber-50 text-amber-500',
  resolved: 'bg-green-50 text-green-500',
};

const SuggestionTable = ({ onView }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const currentPage = useTableStore((s) => s.currentPage);
  const setCurrentPage = useTableStore((state) => state.setCurrentPage);

  const pageSize = 5;

  const filteredRows = useMemo(() => {
    return tableData.filter((row) => {
      const matchesStatus =
        statusFilter === 'all' || row.status.toLowerCase() === statusFilter;

      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        row.title.toLowerCase().includes(term) ||
        row.author.toLowerCase().includes(term) ||
        row.category.toLowerCase().includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const currentPageRows = filteredRows.slice(startIndex, startIndex + pageSize);

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const renderBadge = (text) => {
    const key = (text || '').toLowerCase();
    const styles = statusBadgeStyles[key] ?? 'bg-gray-100 text-gray-700';
    return (
      <span
        className={`inline-flex w-[110px] items-center justify-center rounded-full px-4 py-2 text-xs font-medium ${styles}`}
      >
        {text}
      </span>
    );
  };

  return (
    <CardContent>
      <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <h2 className="text-lg font-semibold">Suggestions</h2>

        <div className="flex items-center gap-3">
          <SearchInput
            placeholder="Search suggestions..."
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
        hasNoData={currentPageRows.length === 0}
      >
        {currentPageRows.map((row) => (
          <TableRow key={row.id} className="rounded-2xl">
            <TableCell className="py-6 text-sm font-medium">
              {row.title}
            </TableCell>

            <TableCell className="py-6 text-sm font-medium">
              {row.category}
            </TableCell>

            <TableCell className="py-6 text-sm font-medium">
              {row.dateSubmitted}
            </TableCell>

            <TableCell className="py-6 text-sm font-medium">
              {row.author}
            </TableCell>

            <TableCell className="py-6 text-sm font-medium">
              {renderBadge(row.status)}
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
                  <DropdownMenuItem
                    onSelect={() => onView?.(row)}
                    className="cursor-pointer"
                  >
                    <img src={EyeIcon} alt="View" className="mr-1 h-4" />
                    <span>View</span>
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

export default SuggestionTable;

const filterData = [
  { key: 'all', label: 'All Suggestions' },
  { key: 'new', label: 'New' },
  { key: 'under review', label: 'Under Review' },
  { key: 'resolved', label: 'Resolved' },
];

const tableHeaders = [
  { key: 'title', label: 'Title', className: '' },
  { key: 'category', label: 'Category', className: '' },
  { key: 'dateSubmitted', label: 'Date Submitted', className: '' },
  { key: 'author', label: 'Author', className: '' },
  { key: 'status', label: 'Status', className: '' },
  { key: 'actions', label: '', className: 'w-10 text-right' },
];

const tableData = [
  {
    id: 1,
    title: 'Flexible Work Hours',
    category: 'Work-Life Balance',
    dateSubmitted: 'Jan 15, 2026',
    author: 'Sarah Adeyemi',
    status: 'New',
    details:
      'Allowing flexible start and end times would help employees manage personal commitments while maintaining productivity. A core hours policy (10am-3pm) could ensure collaboration time.',
  },
  {
    id: 2,
    title: 'On-site Gym Facility',
    category: 'Health & Wellness',
    dateSubmitted: 'Jan 12, 2026',
    author: 'Femi Johnson',
    status: 'Under Review',
    details:
      'Our design team would benefit from upgrading to the latest version of Figma with advanced prototyping features. This would improve our design workflow and collaboration.',
  },
  {
    id: 3,
    title: 'Monthly Team Bonding',
    category: 'Team Culture',
    dateSubmitted: 'Jan 10, 2026',
    author: 'Grace Bola',
    status: 'Resolved',
    details:
      'Organizing monthly team bonding activities such as game nights, outings, or group cooking classes would strengthen relationships across departments and improve morale.',
    hrResponse:
      'Great suggestion! We have started organizing monthly team bonding activities starting from February. The first event was a game night and it was a success.',
  },
  {
    id: 4,
    title: 'Remote Work Allowance',
    category: 'Compensation',
    dateSubmitted: 'Jan 8, 2026',
    author: 'Michael Brown',
    status: 'New',
    details:
      'Providing a monthly stipend for internet, electricity, and home office setup for remote employees would show the company values their work environment regardless of location.',
  },
  {
    id: 5,
    title: 'Learning Budget Increase',
    category: 'Professional Growth',
    dateSubmitted: 'Jan 5, 2026',
    author: 'Emily Okafor',
    status: 'New',
    details:
      'Increasing the annual learning budget from ₦50,000 to ₦150,000 per employee would allow staff to attend more conferences, purchase courses, and obtain industry certifications.',
  },
  {
    id: 6,
    title: 'Mentorship Program',
    category: 'Professional Growth',
    dateSubmitted: 'Jan 3, 2026',
    author: 'John Adewale',
    status: 'Under Review',
    details:
      'A structured mentorship program pairing junior employees with senior leaders would accelerate career development and improve knowledge transfer across the organization.',
  },
  {
    id: 7,
    title: 'Ergonomic Desk Chairs',
    category: 'Health & Wellness',
    dateSubmitted: 'Dec 28, 2025',
    author: 'Amina Bello',
    status: 'Resolved',
    details:
      'Replacing the current office chairs with ergonomic alternatives would significantly reduce back pain complaints and improve overall employee comfort and productivity.',
    hrResponse:
      'We have upgraded all office chairs to ergonomic models. The rollout was completed on Oct 1st. Please reach out if you need any adjustments.',
  },
  {
    id: 8,
    title: 'Quarterly Innovation Day',
    category: 'Team Culture',
    dateSubmitted: 'Dec 22, 2025',
    author: 'David Okoro',
    status: 'New',
    details:
      'Dedicating one day per quarter for employees to work on passion projects or innovative ideas could spark creativity and lead to valuable internal tools or process improvements.',
  },
];
