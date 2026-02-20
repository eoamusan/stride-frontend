import { useState } from 'react';
import AccountingTable from '@/components/dashboard/accounting/table';

// Mock data
const sampleData = [
  {
    id: 'VAT',
    q1: 5000,
    q2: 7000,
    q3: 6000,
    q4: 8000,
    total: 26000,
    status: 'Filed',
  },
]

export default function TaxSummary() {
  // State for table selection
  const [selectedItems, setSelectedItems] = useState([]);
  const [assets] = useState([...sampleData])


  // Handle table item selection
  const handleSelectItem = (itemId, checked) => {
    setSelectedItems((prevItems) => {
      if (checked) {
        return [...prevItems, itemId];
      } else {
        return prevItems.filter((id) => id !== itemId);
      }
    });
  };

  // Handle select all functionality
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(assets.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Table columns configuration
  const tableColumns = [
    {
      key: 'id',
      label: 'Tax Type',
    },
    {
      key: 'q1',
      label: 'Q1 2025',
    },
    {
      key: 'q2',
      label: 'Q2 2025',
    },
    {
      key: 'q3',
      label: 'Q3 2025',
    },
    {
      key: 'q4',
      label: 'Q4 2025',
    },
    {
      key: 'total',
      label: 'Total',
    },
    {
      key: 'status',
      label: 'Status',
    },
  ];

  // Dropdown actions for each row
  const dropdownActions = [
    { key: 'run-budget', label: 'Run Budget vs. Actuals report' },
    { key: 'run-overview', label: 'Run Budget Overview report' },
    { key: 'archive', label: 'Archive' },
    { key: 'duplicate', label: 'Duplicate' },
    { key: 'delete', label: 'Delete' },
  ];

  // Pagination data
  const paginationData = {
    page: 1,
    totalPages: 6,
    pageSize: 12,
    totalCount: 64,
  };

  const handleRowAction = (action, item) => {
    console.log(`Action ${action} on item:`, item);

    // Implement row action logic here
    switch (action) {
      case 'view':
        break;
    }
  };

  return (
    <div className='min-h-screen'>
        <>
          <div className="relative mt-10">
            <AccountingTable
              title="Annual Tax Summary"
              description="Detailed breakdown by tax type and quarter (2025)"
              data={assets}
              columns={tableColumns}
              searchFields={[]}
              searchPlaceholder="Search......"
              statusStyles={{'Filed': 'text-[#24A959] bg-[#24A959]/10'}}
              dropdownActions={dropdownActions}
              paginationData={paginationData}
              selectedItems={selectedItems}
              handleSelectItem={handleSelectItem}
              handleSelectAll={handleSelectAll}
              onRowAction={handleRowAction}
              showDataSize
            />
          </div>
        </>
    </div>
  );
}
