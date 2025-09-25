import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchIcon, Trash2Icon, BanIcon, UploadIcon } from 'lucide-react';
import VendorCard from './vendor-card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import emptyTableImg from '@/assets/icons/empty-table.svg';

// Sample vendor data
const vendorData = [
  {
    id: 1,
    name: 'JJ Solutions',
    category: 'IT Services',
    contactPerson: 'Adeniyi James',
    email: 'jjsolutions@gmail.com',
    phone: '+2347065724230',
    address: '2118 Thornridge Cir. Syracuse, Connecticut 35624',
    services: 'IT Support, Cloud Services',
    rating: 4.8,
    joinDate: '2025-01-12',
    verified: true,
    avatar: null,
  },
  {
    id: 2,
    name: 'Adam Craft',
    category: 'Marketing',
    contactPerson: 'Adam Johnson',
    email: 'adam.craft@gmail.com',
    phone: '+2347065724231',
    address: '1234 Business Ave, Lagos, Nigeria',
    services: 'Digital Marketing, Brand Strategy',
    rating: 4.2,
    joinDate: '2024-11-08',
    verified: false,
    avatar: null,
  },
  {
    id: 3,
    name: 'Tech Innovators',
    category: 'Technology',
    contactPerson: 'Sarah Wilson',
    email: 'info@techinnovators.com',
    phone: '+2347065724232',
    address: '567 Innovation Drive, Abuja, Nigeria',
    services: 'Software Development, AI Solutions',
    rating: 4.9,
    joinDate: '2024-09-15',
    verified: true,
    avatar: null,
  },
  {
    id: 4,
    name: 'Tech Innovators',
    category: 'Technology',
    contactPerson: 'Sarah Wilson',
    email: 'info@techinnovators.com',
    phone: '+2347065724232',
    address: '567 Innovation Drive, Abuja, Nigeria',
    services: 'Software Development, AI Solutions',
    rating: 4.9,
    joinDate: '2024-09-15',
    verified: true,
    avatar: null,
  },
  {
    id: 5,
    name: 'Tech Innovators',
    category: 'Technology',
    contactPerson: 'Sarah Wilson',
    email: 'info@techinnovators.com',
    phone: '+2347065724232',
    address: '567 Innovation Drive, Abuja, Nigeria',
    services: 'Software Development, AI Solutions',
    rating: 4.9,
    joinDate: '2024-09-15',
    verified: true,
    avatar: null,
  },
  {
    id: 6,
    name: 'Tech Innovators',
    category: 'Technology',
    contactPerson: 'Sarah Wilson',
    email: 'info@techinnovators.com',
    phone: '+2347065724232',
    address: '567 Innovation Drive, Abuja, Nigeria',
    services: 'Software Development, AI Solutions',
    rating: 4.9,
    joinDate: '2024-09-15',
    verified: true,
    avatar: null,
  },
];

export default function VendorsList({
  className,
  vendorsData = vendorData,
  searchPlaceholder = 'Search vendors...',
  onVendorEdit,
  onVendorDelete,
  onVendorView,
  paginationData = { page: 1, totalPages: 1 },
  onPageChange,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  // Filter vendors based on search term
  const filteredVendors = vendorsData.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.services.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle vendor actions
  const handleEditVendor = (vendor) => {
    console.log('Edit vendor:', vendor);
    onVendorEdit?.(vendor);
  };

  const handleDeleteVendor = (vendor) => {
    console.log('Delete vendor:', vendor);
    onVendorDelete?.(vendor);
  };

  const handleViewVendor = (vendor) => {
    console.log('View vendor:', vendor);
    onVendorView?.(vendor);
  };

  const handleContactVendor = (vendor) => {
    console.log('Contact vendor:', vendor);
    // Handle contact logic here
  };

  // Handle bulk actions
  const handleBulkDelete = () => {
    console.log('Bulk delete vendors:', selectedItems);
    setSelectedItems([]);
  };

  const handleBulkBan = () => {
    console.log('Bulk ban vendors:', selectedItems);
    setSelectedItems([]);
  };

  const handleBulkExport = () => {
    console.log('Bulk export vendors:', selectedItems);
  };

  const vendors = filteredVendors;

  const { page, totalPages } = paginationData;
  const renderPaginationItems = () => {
    const items = [];
    const delta = 1; // Number of pages to show on each side of current page

    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              className={'size-7 cursor-pointer text-sm'}
              isActive={i === page}
              onClick={() => onPageChange?.(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            className={'size-7 cursor-pointer text-sm'}
            isActive={1 === page}
            onClick={() => onPageChange?.(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Calculate the range around current page
      let startPage = Math.max(2, page - delta);
      let endPage = Math.min(totalPages - 1, page + delta);

      // Add left ellipsis if needed
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-left">
            <PaginationEllipsis className={'size-7 text-sm'} />
          </PaginationItem>
        );
      }

      // Add pages around current page
      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              className={'size-7 cursor-pointer text-sm'}
              isActive={i === page}
              onClick={() => onPageChange?.(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Add right ellipsis if needed
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-right">
            <PaginationEllipsis className={'size-7 text-sm'} />
          </PaginationItem>
        );
      }

      // Always show last page (if it's not page 1)
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              className={'size-7 cursor-pointer text-sm'}
              isActive={totalPages === page}
              onClick={() => onPageChange?.(totalPages)}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    return items;
  };

  return (
    <div className={`w-full rounded-2xl bg-white p-6 ${className}`}>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-6">
        {selectedItems.length > 0 ? (
          <>
            <div />
            <div className="flex items-center gap-2">
              <Button
                size={'icon'}
                variant={'outline'}
                onClick={handleBulkDelete}
                title="Delete selected vendors"
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
              <Button
                size={'icon'}
                variant={'outline'}
                onClick={handleBulkBan}
                title="Ban selected vendors"
              >
                <BanIcon className="h-4 w-4" />
              </Button>
              <Button
                size={'icon'}
                variant={'outline'}
                onClick={handleBulkExport}
                title="Export selected vendors"
              >
                <UploadIcon className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="grid w-full gap-6 md:grid-cols-3">
            <div className="w-full space-y-2">
              <Label>Search vendors</Label>
              <div className="relative">
                <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder={searchPlaceholder}
                  className="h-10 w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full space-y-2">
              <Label>Category</Label>
              <Select onValueChange={() => {}} value={''}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full space-y-2">
              <Label>Status</Label>
              <Select onValueChange={() => {}} value={''}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Vendor Cards Grid */}
      <div className="flex flex-wrap gap-6">
        {vendors.length > 0 ? (
          vendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              onSelected={({ id, checked }) => {
                setSelectedItems((prev) => {
                  if (checked) {
                    return [...prev, id];
                  } else {
                    return prev.filter((itemId) => itemId !== id);
                  }
                });
              }}
              onViewDetails={handleViewVendor}
              onContact={handleContactVendor}
              onEdit={handleEditVendor}
              onDelete={handleDeleteVendor}
            />
          ))
        ) : (
          <div className="mx-auto w-full py-12 text-center">
            <img
              src={emptyTableImg}
              alt="Empty Table"
              className="mx-auto my-4 block w-[220px]"
            />
            <div className="text-sm text-gray-400">
              {searchTerm
                ? 'Try adjusting your search criteria'
                : 'Add your first vendor to get started'}
            </div>
          </div>
        )}
      </div>
      <div className="mt-6 flex items-center justify-between">
        {/* Pagination */}
        <Pagination className={`w-full`}>
          <PaginationContent className={'w-full justify-between'}>
            <PaginationItem>
              <PaginationPrevious
                className={
                  'bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 cursor-pointer border text-sm text-[#414651] shadow-xs'
                }
                onClick={() => page > 1 && onPageChange?.(page - 1)}
              />
            </PaginationItem>
            <span className="flex items-center md:gap-1">
              {renderPaginationItems()}
            </span>
            <PaginationItem>
              <PaginationNext
                className={
                  'bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 cursor-pointer border text-sm text-[#414651] shadow-xs'
                }
                onClick={() => page < totalPages && onPageChange?.(page + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
