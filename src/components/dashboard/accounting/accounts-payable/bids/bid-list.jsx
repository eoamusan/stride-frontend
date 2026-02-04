import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import BidCard from './bid-card';
import AccountingTable from '@/components/dashboard/accounting/table';

// Wrapper component to adapt BidCard to AccountingTable's itemComponent format
function BidCardWrapper({
  data,
  // isSelected,
  handleSelect,
  handleDropdownAction,
}) {
  return (
    <BidCard
      bid={data}
      onSelected={({ checked }) => handleSelect(checked)}
      onViewDetails={() => handleDropdownAction('view', data)}
      onEdit={() => handleDropdownAction('edit', data)}
      onDelete={() => handleDropdownAction('delete', data)}
      onClose={() => handleDropdownAction('close', data)}
    />
  );
}

export default function BidList({
  className,
  bidsData = [],
  searchPlaceholder = 'Search bids by title or category......',
  onBidEdit,
  onBidDelete,
  onBidView,
  onBidClose,
  paginationData = { page: 1, totalPages: 1, totalDocs: 0 },
  onPageChange,
}) {
  const [selectedItems, setSelectedItems] = useState([]);

  // Format date to display format
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA'); // Returns YYYY-MM-DD format
  };

  // Define columns for list view
  const columns = [
    {
      key: 'title',
      label: 'Bid Name',
      className: 'font-semibold',
    },
    {
      key: 'category',
      label: 'Category',
    },
    {
      key: 'startDate',
      label: 'Start Date',
      render: (value) => formatDate(value),
    },
    {
      key: 'deadline',
      label: 'Deadline Date',
      render: (value) => formatDate(value),
    },
    {
      key: 'bidType',
      label: 'Visibility',
      render: (value) => (
        <Badge variant="outline" className="font-normal">
          {value}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
    },
  ];

  // Status badge styles
  const statusStyles = {
    Active: 'bg-[#254C00]/10 text-[#254C00] hover:bg-[#254C00]/10',
    Closed: 'bg-gray-100 text-gray-600 hover:bg-gray-100',
    Pending: 'bg-orange-100 text-orange-600 hover:bg-orange-100',
  };

  // Dropdown actions
  const dropdownActions = [
    { key: 'view', label: 'View Details' },
    { key: 'edit', label: 'Edit Bid' },
    { key: 'close', label: 'Close Bid' },
    { key: 'delete', label: 'Delete Bid' },
  ];

  // Handle row actions
  const handleRowAction = (action, bid) => {
    switch (action) {
      case 'view':
        onBidView?.(bid);
        break;
      case 'edit':
        onBidEdit?.(bid);
        break;
      case 'delete':
        onBidDelete?.(bid);
        break;
      case 'close':
        onBidClose?.(bid);
        break;
      default:
        break;
    }
  };

  // Handle select all
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(bidsData.map((bid) => bid.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Handle select item
  const handleSelectItem = (id, checked) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, id]);
    } else {
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  return (
    <AccountingTable
      className={className}
      title="Bids History"
      data={bidsData}
      columns={columns}
      gridCols={2}
      searchFields={['title', 'description', 'category']}
      searchPlaceholder={searchPlaceholder}
      statusStyles={statusStyles}
      dropdownActions={dropdownActions}
      paginationData={{
        page: paginationData.page,
        totalPages: paginationData.totalPages,
        pageSize: 10,
        totalCount: paginationData.totalDocs,
      }}
      onPageChange={onPageChange}
      onRowAction={handleRowAction}
      selectedItems={selectedItems}
      handleSelectAll={handleSelectAll}
      handleSelectItem={handleSelectItem}
      isProductTable={true}
      itemComponent={BidCardWrapper}
    />
  );
}
