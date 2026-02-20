'use client';

import { useState } from 'react';
import { useTableStore } from '@/stores/table-store';

import FilterIcon from '@/assets/icons/filter.svg';
import { SearchInput } from '@/components/customs';
import CustomDialog from '@/components/customs/dialog';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
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
import CertificatePreview from '../components/certificatePreview';
import CertificateCard from './certificateCard';
import { certificatesData } from './data';

const CertificatesSection = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeCertificate, setActiveCertificate] = useState(null);

  const currentPage = useTableStore((s) => s.currentPage);
  const setCurrentPage = useTableStore((state) => state.setCurrentPage);

  const filteredCertificates = certificatesData.filter((certificate) => {
    const matchesStatus =
      statusFilter === 'all' || certificate.status === statusFilter;
    const matchesSearch = certificate.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCertificates = filteredCertificates.slice(
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

  const handlePreview = (certificate) => {
    setActiveCertificate(certificate);
    setDialogOpen(true);
  };

  const handleDownload = (certificate) => {
    if (certificate?.downloadUrl) {
      window.open(certificate.downloadUrl, '_blank');
    }
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
        <h2 className="text-lg font-semibold">Certificates</h2>

        <div className="flex items-center gap-3">
          <SearchInput
            placeholder="Search certificate..."
            value={searchTerm}
            onValueChange={setSearchTerm}
            onResetPage={() => setCurrentPage(1)}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={`h-12 w-12 rounded-xl ${statusFilter !== 'all' ? 'border-blue-200 bg-blue-50' : ''}`}
              >
                <img src={FilterIcon} alt="Filter" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {filterData.map((filter) => (
                <DropdownMenuItem
                  key={filter.key}
                  onClick={() => handleStatusFilterChange(filter.key)}
                  className={`text-xs ${statusFilter === filter.key ? 'bg-blue-50' : ''}`}
                >
                  {filter.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedCertificates.length > 0 ? (
          paginatedCertificates.map((certificate) => (
            <CertificateCard
              key={certificate.id}
              certificate={certificate}
              onPreview={handlePreview}
              onDownload={handleDownload}
            />
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center py-12">
            <p className="text-gray-500">No certificates found</p>
          </div>
        )}
      </div>

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

      <CustomDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Certificate Preview"
        description={activeCertificate?.title || ''}
        outlineBtnText="Close"
        defaultBtnText="Download"
        onOutlineBtnClick={() => setDialogOpen(false)}
        onDefaultBtnClick={() => handleDownload(activeCertificate)}
      >
        <CertificatePreview
          certificate={
            activeCertificate
              ? {
                  name: activeCertificate.owner,
                  course: activeCertificate.title,
                  issueDate: activeCertificate.issued,
                  validUntil: activeCertificate.expires,
                  issuer: activeCertificate.issuer,
                }
              : null
          }
        />
      </CustomDialog>
    </CardContent>
  );
};

export default CertificatesSection;

const filterData = [
  { key: 'all', label: 'All Certificates' },
  { key: 'active', label: 'Active' },
  { key: 'expiring', label: 'Expiring Soon' },
  { key: 'expired', label: 'Expired' },
];
