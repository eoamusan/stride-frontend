import { useCallback, useMemo, useState } from 'react';
import AccountingTable from '@/components/dashboard/accounting/table';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import { Button } from '@/components/ui/button';
import { DownloadIcon, HousePlus, Landmark, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import { AppDialog } from '@/components/core/app-dialog';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import BankForm from '@/components/dashboard/accounting/banking/overview/bank-form';

// Mock data
const sampleData = [
  {
    id: 'TXN-1001',
    date: '2024-01-15',
    bankTransaction: 'Payment to Supplier A',
    amount: 1500,
    ledgerMatch: 'Invoice INV-1001',
    confidence: 'High',
    status: 'Matched',
  },
  {
    id: 'TXN-1002',
    date: '2024-01-20',
    bankTransaction: 'Payment from Client B',
    amount: 2500,
    ledgerMatch: 'Invoice INV-1002',
    confidence: 'Medium',
    status: 'Matched',
  },
  {
    id: 'TXN-1003',
    date: '2024-01-22',
    bankTransaction: 'Unrecognized Transaction',
    amount: 500,
    ledgerMatch: 'N/A',
    confidence: 'Medium',
    status: 'Unmatched',
  },
]

export default function TransactionMatching() {
  // State for table selection
  const [selectedItems, setSelectedItems] = useState([]);
  const [ openBankForm, setOpenBankForm ] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [assets] = useState([...sampleData])

  const assetMetrics = useMemo(() => {
    return [
      {
        title: 'Total Transactions',
        value: 2000,
      },
      {
        title: 'Matched Transactions',
        value: 3000,
      },
      {
        title: 'Unmatched',
        value: 23,
      },
      {
        title: 'Auto Suggestions',
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
      setSelectedItems(assets.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Table columns configuration
  const tableColumns = [
    {
      key: 'date',
      label: 'Date',
    },
    {
      key: 'bankTransaction',
      label: 'Bank Transaction',
    },
    {
      key: 'amount',
      label: 'Amount',
    },
    {
      key: 'ledgerMatch',
      label: 'Ledger Match',
    },
    {
      key: 'confidence',
      label: 'Confidence',
    },
    {
      key: 'status',
      label: 'Status',
    },
  ];

  // Dropdown actions for each row
  const dropdownActions = [
    { key: 'view', label: 'View' },
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

  const handleOnCreateBank = useCallback((data) => {
    console.log('Bank created:', data)
  }, [])

  return (
    <div className='my-4 min-h-screen'>
      <>
        <div>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <hgroup>
              <h1 className="text-2xl font-bold">Asset Categories Management</h1>
              <p className="text-sm text-[#7D7D7D]">
                Configure and manage depreciation settings for different asset types
              </p>
            </hgroup>

            <div className="flex space-x-4">
              <Button
                onClick={() => setOpenBankForm(true)}
                className={'h-10 rounded-2xl text-sm'}
              >
                <PlusCircleIcon className="size-4" />
                Connect Bank
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
          <>
            <div className="relative mt-10">
              <AccountingTable
                title="Transaction Matching"
                description="Automatically Reconcile and Verify Your Financial Transactions"
                data={assets}
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
          <AppDialog 
            title="Connect Bank Account"
            description="Connect your bank account via secure API or upload a CSV statement "
            headerIcon={<Landmark />}
            open={openBankForm} 
            onOpenChange={setOpenBankForm}
            className='sm:max-w-163'
          >
            <BankForm onCreateBank={handleOnCreateBank} />
          </AppDialog>

          <SuccessModal
            title={'Category Added'}
            description={"You've successfully added a category."}
            open={isSuccessModalOpen}
            onOpenChange={setIsSuccessModalOpen}
            backText={'Back'}
            handleBack={() => {
              setIsSuccessModalOpen(false);
            }} 
          />
      </>
    </div>
  );
}
