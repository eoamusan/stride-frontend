'use client';

import { useTableStore } from '@/stores/table-store';
import { useState } from 'react';

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
import CourseCard from './courseCard';
import { CardContent } from '@/components/ui/card';

const CoursesSection = ({ onViewCourse }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const currentPage = useTableStore((s) => s.currentPage);
  const setCurrentPage = useTableStore((state) => state.setCurrentPage);

  // Mock data - replace with actual API call
  const mockCourses = [
    {
      id: 1,
      image:
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
      status: 'Draft',
      category: 'Compliance',
      title: 'Enterprise Security Awareness',
      description:
        'Essential security practices for all employees. Learn how to identify phishing attempts, secure your devices, and protect company data.',
      duration: '45mins',
      trainees: 24,
      deliveryMode: 'Online',
      isMandatory: true,
      categoryTag: 'compliance',
      modules: [
        {
          id: 'm1',
          type: 'video',
          title: 'Introduction to Information Security',
          description:
            'Overview of key concepts and why security matters to everyone.',
          duration: '12 mins',
          completed: true,
          showDownload: true,
        },
        {
          id: 'm2',
          type: 'video',
          title: 'Introduction to Information Security',
          description:
            'Overview of key concepts and why security matters to everyone.',
          duration: '12 mins',
          completed: true,
          showDownload: true,
        },
        {
          id: 'm3',
          type: 'video',
          title: 'Introduction to Information Security',
          description:
            'Overview of key concepts and why security matters to everyone.',
          duration: '12 mins',
          completed: true,
          showDownload: true,
        },
        {
          id: 'm4',
          type: 'pdf',
          title: 'Company Security Policy',
          description:
            'Read the official acceptable use policy for IT resources.',
          duration: '12 mins',
          completed: true,
          showDownload: true,
        },
      ],
    },
    {
      id: 2,
      image:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
      status: 'Active',
      category: 'Soft Skills',
      title: 'Leadership Fundamentals',
      description:
        'Build core leadership capabilities for effective team management and communication.',
      duration: '2 Days',
      trainees: 24,
      deliveryMode: 'Hybrid',
      isMandatory: false,
      categoryTag: 'compliance',
      modules: [],
    },
    {
      id: 3,
      image:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
      status: 'Active',
      category: 'Compliance',
      title: 'Workplace Safety 2025',
      description:
        'Mandatory workplace safety training and best practices for 2025.',
      duration: '45mins',
      trainees: 24,
      deliveryMode: 'In-Person',
      isMandatory: true,
      categoryTag: 'compliance',
      modules: [],
    },
    {
      id: 4,
      image:
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
      status: 'Active',
      category: 'Compliance',
      title: 'Workplace Safety 2025',
      description:
        'Mandatory workplace safety training and best practices for 2025.',
      duration: '45mins',
      trainees: 24,
      deliveryMode: 'In-Person',
      isMandatory: true,
      categoryTag: 'compliance',
      modules: [],
    },
    {
      id: 5,
      image:
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
      status: 'Draft',
      category: 'Compliance',
      title: 'Enterprise Security Awareness',
      description: 'Essential security practices for all employees.',
      duration: '45mins',
      trainees: 24,
      deliveryMode: 'Online',
      isMandatory: true,
      categoryTag: 'compliance',
      modules: [],
    },
    {
      id: 6,
      image:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
      status: 'Active',
      category: 'Soft Skills',
      title: 'Leadership Fundamentals',
      description:
        'Build core leadership capabilities for effective team management and communication.',
      duration: '2 Days',
      trainees: 24,
      deliveryMode: 'Hybrid',
      isMandatory: false,
      categoryTag: 'compliance',
      modules: [],
    },
    {
      id: 7,
      image:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
      status: 'Active',
      category: 'Soft Skills',
      title: 'Leadership Fundamentals',
      description:
        'Build core leadership capabilities for effective team management and communication.',
      duration: '2 Days',
      trainees: 24,
      deliveryMode: 'Hybrid',
      isMandatory: false,
      categoryTag: 'compliance',
      modules: [],
    },
    {
      id: 8,
      image:
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
      status: 'Active',
      category: 'Soft Skills',
      title: 'Leadership Fundamentals',
      description:
        'Build core leadership capabilities for effective team management and communication.',
      duration: '2 Days',
      trainees: 24,
      deliveryMode: 'Hybrid',
      isMandatory: false,
      categoryTag: 'compliance',
      modules: [],
    },
  ];

  // Filter courses
  const filteredCourses = mockCourses.filter((course) => {
    const matchesStatus =
      statusFilter === 'all' ||
      course.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Pagination
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourses = filteredCourses.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
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
        <h2 className="text-lg font-semibold">Courses</h2>

        <div className="flex items-center gap-3">
          <SearchInput
            placeholder="Search courses..."
            value={searchTerm}
            onValueChange={setSearchTerm}
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

      {/* Course Cards Grid */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedCourses.length > 0 ? (
          paginatedCourses.map((course) => (
            <CourseCard
              key={course.id}
              image={course.image}
              status={course.status}
              category={course.category}
              title={course.title}
              duration={course.duration}
              trainees={course.trainees}
              deliveryMode={course.deliveryMode}
              onView={onViewCourse ? () => onViewCourse(course) : undefined}
              onEdit={() => console.log('Edit:', course.id)}
              onDelete={() => console.log('Delete:', course.id)}
              statusVariant={
                course.status === 'Draft' ? 'secondary' : 'default'
              }
            />
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center py-12">
            <p className="text-gray-500">No courses found</p>
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

export default CoursesSection;
const filterData = [
  { key: 'all', label: 'All Courses' },
  { key: 'draft', label: 'Draft' },
  { key: 'active', label: 'Active' },
];
