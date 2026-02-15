import { useState, useMemo } from 'react';

export function useDataTable({ data, pageSize = 10, filterKeys = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter Logic
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Status filter
      if (statusFilter !== 'all') {
        const statusMatch =
          item.status?.toLowerCase() === statusFilter.toLowerCase();
        if (!statusMatch) return false;
      }

      // Search filter
      if (!searchTerm) return true;

      return filterKeys.some((key) =>
        item[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [data, filterKeys, statusFilter, searchTerm]);

  // Pagination Logic
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentTableData = filteredData.slice(
    startIndex,
    startIndex + pageSize
  );

  return {
    currentTableData,
    pagination: {
      page: currentPage,
      totalPages,
    },
    searchTerm,
    setSearchTerm: (term) => {
      setSearchTerm(term);
      setCurrentPage(1); // Reset to first page on search
    },
    statusFilter,
    setStatusFilter: (status) => {
      setStatusFilter(status);
      setCurrentPage(1); // Reset to first page on filter
    },
    currentPage,
    setCurrentPage,
  };
}
