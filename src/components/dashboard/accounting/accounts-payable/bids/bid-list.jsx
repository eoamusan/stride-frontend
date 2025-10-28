import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  SearchIcon,
  Trash2Icon,
  BanIcon,
  UploadIcon,
  FilterIcon,
} from 'lucide-react';
import BidCard from './bid-card';
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

// Sample bid data
const bidsData = [
  {
    id: 1,
    title: 'Office Cleaning Services',
    description: 'Regular cleaning services for corporate office space',
    category: 'Cleaning Services',
    responses: 12,
    startDate: '2025-02-01',
    deadline: '2025-02-03',
    status: 'Active',
    bidType: 'Public',
    isDeadlinePassed: true,
  },
  {
    id: 2,
    title: 'IT Support Services',
    description: '24/7 technical support for business operations',
    category: 'IT Services',
    responses: 8,
    startDate: '2025-02-15',
    deadline: '2025-03-01',
    status: 'Active',
    bidType: 'Private',
    isDeadlinePassed: false,
  },
  {
    id: 3,
    title: 'Marketing Campaign',
    description: 'Digital marketing campaign for product launch',
    category: 'Marketing',
    responses: 15,
    startDate: '2025-01-20',
    deadline: '2025-02-20',
    status: 'Closed',
    bidType: 'Public',
    isDeadlinePassed: true,
  },
  {
    id: 4,
    title: 'Software Development',
    description: 'Custom software solution development',
    category: 'Technology',
    responses: 6,
    startDate: '2025-03-01',
    deadline: '2025-04-01',
    status: 'Active',
    bidType: 'Private',
    isDeadlinePassed: false,
  },
  {
    id: 5,
    title: 'Legal Consultation',
    description: 'Business legal advisory services',
    category: 'Legal Services',
    responses: 4,
    startDate: '2025-02-10',
    deadline: '2025-02-25',
    status: 'Pending',
    bidType: 'Public',
    isDeadlinePassed: false,
  },
  {
    id: 6,
    title: 'Accounting Services',
    description: 'Monthly bookkeeping and financial reporting',
    category: 'Finance',
    responses: 10,
    startDate: '2025-01-15',
    deadline: '2025-02-15',
    status: 'Active',
    bidType: 'Public',
    isDeadlinePassed: false,
  },
];

export default function BidList({
  className,
  bidsData: propBidsData = bidsData,
  searchPlaceholder = 'Search bids...',
  onBidEdit,
  onBidDelete,
  onBidView,
  onBidClose,
  paginationData = { page: 1, totalPages: 1 },
  onPageChange,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [categoryFilter, _setCategoryFilter] = useState('');
  const [statusFilter, _setStatusFilter] = useState('');

  // Filter bids based on search term and filters
  const filteredBids = propBidsData.filter((bid) => {
    const matchesSearch =
      bid.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !categoryFilter ||
      bid.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesStatus =
      !statusFilter || bid.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handle bid actions
  const handleEditBid = (bid) => {
    console.log('Edit bid:', bid);
    onBidEdit?.(bid);
  };

  const handleDeleteBid = (bid) => {
    console.log('Delete bid:', bid);
    onBidDelete?.(bid);
  };

  const handleViewBid = (bid) => {
    console.log('View bid:', bid);
    onBidView?.(bid);
  };

  const handleCloseBid = (bid) => {
    console.log('Close bid:', bid);
    onBidClose?.(bid);
  };

  // Handle bulk actions
  const handleBulkDelete = () => {
    console.log('Bulk delete bids:', selectedItems);
  };

  const handleBulkClose = () => {
    console.log('Bulk close bids:', selectedItems);
  };

  const handleBulkExport = () => {
    console.log('Bulk export bids:', selectedItems);
  };

  const bids = filteredBids;

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
                title="Delete selected bids"
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
              <Button
                size={'icon'}
                variant={'outline'}
                onClick={handleBulkClose}
                title="Close selected bids"
              >
                <BanIcon className="h-4 w-4" />
              </Button>
              <Button
                size={'icon'}
                variant={'outline'}
                onClick={handleBulkExport}
                title="Export selected bids"
              >
                <UploadIcon className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold">Bids History</h2>
            <div className="flex w-full max-w-lg items-center gap-3">
              <div className="relative w-full max-w-lg">
                <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder={searchPlaceholder}
                  className="h-10 w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Button variant="outline" size="icon">
                <FilterIcon className="h-4 w-4" />
              </Button>

              <Button variant={'outline'} size="icon">
                <UploadIcon className="size-4" />
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Bid Cards Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {bids.length > 0 ? (
          bids.map((bid) => (
            <BidCard
              key={bid.id}
              bid={bid}
              onSelected={({ id, checked }) => {
                setSelectedItems((prev) => {
                  if (checked) {
                    return [...prev, id];
                  } else {
                    return prev.filter((itemId) => itemId !== id);
                  }
                });
              }}
              onViewDetails={handleViewBid}
              onEdit={handleEditBid}
              onClose={handleCloseBid}
              onDelete={handleDeleteBid}
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
                : 'Add your first bid to get started'}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
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
