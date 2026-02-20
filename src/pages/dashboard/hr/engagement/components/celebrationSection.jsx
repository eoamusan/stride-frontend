'use client';

import { useState } from 'react';
import { useTableStore } from '@/stores/table-store';

import FilterIcon from '@/assets/icons/filter.svg';
import { SearchInput } from '@/components/customs';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { CardContent } from '@/components/ui/card';
import CelebrationCard from './celebrationCard';

// Mock data for celebrations
const mockCelebrations = [
  {
    id: 1,
    name: 'Sarah Adeyemi',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    celebrationType: 'Birthday',
    date: 'Oct 15, 2023',
  },
  {
    id: 2,
    name: 'Sarah Adeyemi',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    celebrationType: 'Work Anniversary',
    date: 'Oct 15, 2023',
  },
  {
    id: 3,
    name: 'Sarah Adeyemi',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    celebrationType: 'Promotion',
    date: 'Oct 15, 2023',
  },
  {
    id: 4,
    name: 'Sarah Adeyemi',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    celebrationType: 'Birthday',
    date: 'Oct 15, 2023',
  },
  {
    id: 5,
    name: 'Sarah Adeyemi',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    celebrationType: 'Work Anniversary',
    date: 'Oct 15, 2023',
  },
  {
    id: 6,
    name: 'Sarah Adeyemi',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    celebrationType: 'Promotion',
    date: 'Oct 15, 2023',
  },
  {
    id: 7,
    name: 'John Doe',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    celebrationType: 'Birthday',
    date: 'Oct 20, 2023',
  },
  {
    id: 8,
    name: 'Jane Smith',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
    celebrationType: 'Work Anniversary',
    date: 'Oct 22, 2023',
  },
  {
    id: 9,
    name: 'Michael Brown',
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
    celebrationType: 'Promotion',
    date: 'Oct 25, 2023',
  },
  {
    id: 10,
    name: 'Emily Johnson',
    image: 'https://randomuser.me/api/portraits/women/33.jpg',
    celebrationType: 'Birthday',
    date: 'Oct 28, 2023',
  },
];

const filterData = [
  { key: 'all', label: 'All Celebrations' },
  { key: 'birthday', label: 'Birthday' },
  { key: 'work anniversary', label: 'Work Anniversary' },
  { key: 'promotion', label: 'Promotion' },
];

const CelebrationSection = ({ onEdit, onDelete, onSendWishes }) => {
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const currentPage = useTableStore((s) => s.currentPage);
  const setCurrentPage = useTableStore((state) => state.setCurrentPage);

  // Filter celebrations
  const filteredCelebrations = mockCelebrations.filter((celebration) => {
    const matchesType =
      typeFilter === 'all' ||
      celebration.celebrationType.toLowerCase() === typeFilter.toLowerCase();
    const matchesSearch = celebration.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Pagination
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredCelebrations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCelebrations = filteredCelebrations.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleTypeFilterChange = (type) => {
    setTypeFilter(type);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const generatePaginationItems = () => {
    const items = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
            className="cursor-pointer"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <CardContent>
      <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <h2 className="text-lg font-semibold">Celebrations</h2>

        <div className="flex items-center gap-3">
          <SearchInput
            placeholder="Search employee......"
            value={searchTerm}
            onValueChange={setSearchTerm}
            onResetPage={() => setCurrentPage(1)}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={`h-12 w-12 rounded-xl ${typeFilter !== 'all' ? 'border-blue-200 bg-blue-50' : ''}`}
              >
                <img src={FilterIcon} alt="Filter Icon" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {filterData.map((filter) => (
                <DropdownMenuItem
                  key={filter.key}
                  onClick={() => handleTypeFilterChange(filter.key)}
                  className={typeFilter === filter.key ? 'bg-blue-50' : ''}
                >
                  {filter.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Celebration Cards Grid */}
      <div className="mb-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedCelebrations.length > 0 ? (
          paginatedCelebrations.map((celebration) => (
            <CelebrationCard
              key={celebration.id}
              name={celebration.name}
              image={celebration.image}
              celebrationType={celebration.celebrationType}
              date={celebration.date}
              onEdit={() => onEdit?.(celebration)}
              onDelete={() => onDelete?.(celebration)}
              onSendWishes={() => onSendWishes?.(celebration)}
            />
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center py-12">
            <p className="text-gray-500">No celebrations found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent className="w-full justify-between">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={
                  currentPage === 1
                    ? 'pointer-events-none border text-sm opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>

            <div className="flex gap-2">{generatePaginationItems()}</div>

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                className={
                  currentPage === totalPages
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer border text-sm'
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </CardContent>
  );
};

export default CelebrationSection;
