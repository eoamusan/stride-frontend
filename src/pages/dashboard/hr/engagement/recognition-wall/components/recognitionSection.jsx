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
import RecognitionCard from './recognitionCard';

// Mock data for recognitions
const mockRecognitions = [
  {
    id: 1,
    senderName: 'Grace Bola',
    senderRole: 'Manager',
    senderImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    recipientName: 'Femi Johnson',
    recipientImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    message:
      'Femi went above and beyond to deliver the Q3 campaign on time. His creativity and dedication were instrumental to our success.',
    category: 'Teamwork',
    timeAgo: '2 hours ago',
    likeCount: 12,
  },
  {
    id: 2,
    senderName: 'Sarah Williams',
    senderRole: 'HR Associate',
    senderImage: 'https://randomuser.me/api/portraits/women/65.jpg',
    recipientName: 'Femi Johnson',
    recipientImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    message:
      'Femi went above and beyond to deliver the Q3 campaign on time. His creativity and dedication were instrumental to our success.',
    category: 'Collaboration',
    timeAgo: '2 hours ago',
    likeCount: 12,
  },
  {
    id: 3,
    senderName: 'Grace Bola',
    senderRole: 'Manager',
    senderImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    recipientName: 'Femi Johnson',
    recipientImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    message:
      'Femi went above and beyond to deliver the Q3 campaign on time. His creativity and dedication were instrumental to our success.',
    category: 'Teamwork',
    timeAgo: '2 hours ago',
    likeCount: 12,
  },
  {
    id: 4,
    senderName: 'John Doe',
    senderRole: 'Team Lead',
    senderImage: 'https://randomuser.me/api/portraits/men/45.jpg',
    recipientName: 'Sarah Adeyemi',
    recipientImage: 'https://randomuser.me/api/portraits/women/33.jpg',
    message:
      'Sarah showed exceptional leadership during the project rollout. Her ability to coordinate across teams was impressive.',
    category: 'Leadership',
    timeAgo: '5 hours ago',
    likeCount: 8,
  },
  {
    id: 5,
    senderName: 'Emily Johnson',
    senderRole: 'Product Manager',
    senderImage: 'https://randomuser.me/api/portraits/women/55.jpg',
    recipientName: 'Michael Brown',
    recipientImage: 'https://randomuser.me/api/portraits/men/50.jpg',
    message:
      'Michael brought innovative ideas to solve our biggest challenges. His out-of-the-box thinking saved us weeks of work.',
    category: 'Innovation',
    timeAgo: '1 day ago',
    likeCount: 15,
  },
];

const filterData = [
  { key: 'all', label: 'All Recognitions' },
  { key: 'teamwork', label: 'Teamwork' },
  { key: 'collaboration', label: 'Collaboration' },
  { key: 'leadership', label: 'Leadership' },
  { key: 'innovation', label: 'Innovation' },
];

const RecognitionSection = ({ onEdit, onDelete }) => {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const currentPage = useTableStore((s) => s.currentPage);
  const setCurrentPage = useTableStore((state) => state.setCurrentPage);

  // Filter recognitions
  const filteredRecognitions = mockRecognitions.filter((recognition) => {
    const matchesCategory =
      categoryFilter === 'all' ||
      recognition.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesSearch =
      recognition.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recognition.recipientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination
  const itemsPerPage = 3;
  const totalPages = Math.ceil(filteredRecognitions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRecognitions = filteredRecognitions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleCategoryFilterChange = (category) => {
    setCategoryFilter(category);
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
        <h2 className="text-lg font-semibold">Recognition</h2>

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
                className={`h-12 w-12 rounded-xl ${categoryFilter !== 'all' ? 'border-blue-200 bg-blue-50' : ''}`}
              >
                <img src={FilterIcon} alt="Filter Icon" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {filterData.map((filter) => (
                <DropdownMenuItem
                  key={filter.key}
                  onClick={() => handleCategoryFilterChange(filter.key)}
                  className={categoryFilter === filter.key ? 'bg-blue-50' : ''}
                >
                  {filter.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Recognition Cards */}
      <div className="mb-8 flex flex-col gap-4">
        {paginatedRecognitions.length > 0 ? (
          paginatedRecognitions.map((recognition) => (
            <RecognitionCard
              key={recognition.id}
              senderName={recognition.senderName}
              senderRole={recognition.senderRole}
              senderImage={recognition.senderImage}
              recipientName={recognition.recipientName}
              recipientImage={recognition.recipientImage}
              message={recognition.message}
              category={recognition.category}
              timeAgo={recognition.timeAgo}
              likeCount={recognition.likeCount}
              onEdit={() => onEdit?.(recognition)}
              onDelete={() => onDelete?.(recognition)}
            />
          ))
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500">No recognitions found</p>
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

export default RecognitionSection;
