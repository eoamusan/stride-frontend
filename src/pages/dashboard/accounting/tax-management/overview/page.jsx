import { useCallback, useMemo, useState } from 'react';
import AccountingTable from '@/components/dashboard/accounting/table';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DownloadIcon, HousePlus, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import { AppDialog } from '@/components/core/app-dialog';
import EmptyTax from '@/components/dashboard/accounting/tax-management/overview/empty-state';
import TaxForm from '@/components/dashboard/accounting/tax-management/overview/tax-form';
import UpcomingDeadlines from '@/components/dashboard/accounting/tax-management/overview/upcoming-deadlines';
import ComplianceRate from '@/components/dashboard/accounting/tax-management/overview/compliance-rate';
import temporaryImg from '@/assets/images/customer-ledger-temp.png';

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

export default function TaxOverview() {
  // State for table selection
  const [selectedItems, setSelectedItems] = useState([]);
  const [ openTaxForm, setOpenTaxForm ] = useState(false)
  const [taxData] = useState([...sampleData])

  const assetMetrics = useMemo(() => {
    return [
      {
        title: 'Total Tax Paid',
        value: 2000,
      },
      {
        title: 'Total Pending',
        value: 3000,
      },
      {
        title: 'Tax Refunds',
        value: 23,
      },
      {
        title: 'Penalties Avoided',
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

  const handleSetOpenTaxForm = useCallback((value) => {
    setOpenTaxForm(value)
  }, [])

  const handleOnCreateTax = useCallback((data) => {
    console.log('Tax created:', data)
  }, [])

  return (
    <div className='my-4 min-h-screen'>
    <div className={cn(!taxData.length && 'hidden')}>
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Tax Overview</h1>
          <p className="text-sm text-[#7D7D7D]">
            Overview of your tax obligations and compliance status
          </p>
        </hgroup>

        <div className="flex space-x-4">
          <Button
            onClick={() => setOpenTaxForm(true)}
            className={'h-10 rounded-2xl text-sm'}
          >
            <PlusCircleIcon className="size-4" />
            Configure Tax
          </Button>
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
    { !taxData.length ? <EmptyTax onClick={() => handleSetOpenTaxForm(true)} /> : 
      <>
        <div className='mt-5 flex gap-4 w-full'>
          <div className='w-3/5'>
            <UpcomingDeadlines />
          </div>
          <div className='flex gap-4 w-4/5'>
            <div className='w-3/5'>
              <ComplianceRate />
            </div>
            <div className='flex w-2/5 max-h-[300px]'>
              <img src={temporaryImg} alt="temporary" className="w-full object-cover" />
            </div>
          </div>
        </div>
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
      </>}
      <AppDialog 
        title="Tax Management Setup"
        description="Let’s use configure your tax management system in few simple steps"
        headerIcon={<HousePlus />}
        open={openTaxForm} 
        onOpenChange={setOpenTaxForm}
        className='sm:max-w-163'
      >
        <TaxForm onCreateTax={handleOnCreateTax} />
      </AppDialog>
    </div>
  );
}