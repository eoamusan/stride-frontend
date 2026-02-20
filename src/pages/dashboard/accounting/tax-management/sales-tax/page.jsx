import { useMemo, useState } from 'react';
import AccountingTable from '@/components/dashboard/accounting/table';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DownloadIcon, SettingsIcon } from 'lucide-react';

// Mock data
const sampleData = [
  {
    id: 'INV-1001',
    date: 'Jan 2024-Dec 2024',
    customer: 'Acme Corp',
    amount: 50000,
    vatRate: '15%',
    vatAmount: 7500,
    total: 57500,
    status: 'Paid',
  },
  {
    id: 'INV-1002',
    date: 'Jan 2024-Dec 2024',
    customer: 'Beta LLC',
    amount: 30000,
    vatRate: '15%',
    vatAmount: 4500,
    total: 34500,
    status: 'Pending',
  },
]

export default function SalesTax() {
  // State for table selection
  const [selectedItems, setSelectedItems] = useState([]);
  const [taxData] = useState([...sampleData])

  const assetMetrics = useMemo(() => {
    return [
      {
        title: 'Total Sales',
        value: 2000,
      },
      {
        title: 'Vat Collected (7.5%)',
        value: 3000,
      },
      {
        title: 'Filling Status',
        value: 23,
      },
      {
        title: 'Total Invoices',
        value: 1000,
      },
    ]
  })

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
      setSelectedItems(taxData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Table columns configuration
  const tableColumns = [
    {
      key: 'id',
      label: 'Invoice ID',
    },
    {
      key: 'date',
      label: 'Date',
    },
    {
      key: 'customer',
      label: 'Customer',
    },
    {
      key: 'amount',
      label: 'Amount',
    },
    {
      key: 'vatRate',
      label: 'VAT Rate',
    },
    {
      key: 'vatAmount',
      label: 'VAT Amount',
    },
    {
      key: 'total',
      label: 'Total',
    },
    {
      key: 'status',
      label: 'Status'
    },
  ];

  // Dropdown actions for each row
  const dropdownActions = [
    { key: 'run-budget', label: 'Run Budget vs. Actuals report' },
    { key: 'run-overview', label: 'Run Budget Overview report' },
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
    <div className='my-4 min-h-screen'>
    <div className={cn(!taxData.length && 'hidden')}>
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Sales Tax (VAT)</h1>
          <p className="text-sm text-[#7D7D7D]">
            Value Added Tax collected on sales transactions
          </p>
        </hgroup>

        <div className="flex space-x-4">
          <Button size={'icon'} className={'size-10'} variant={'outline'}>
            <DownloadIcon size={16} />
          </Button>
          <Button size={'icon'} className={'size-10'} variant={'outline'}>
            <SettingsIcon size={16} />
          </Button>
        </div>
      </div>

      <div className="mt-10">
        <Metrics metrics={assetMetrics} />
      </div>
    </div>
      <>
        <div className="relative mt-5">
          <AccountingTable
            title="Sales Tax Transactions"
            description="Detailed breakdown of VAT on sales"
            data={taxData}
            columns={tableColumns}
            searchFields={[]}
            searchPlaceholder="Search......"
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