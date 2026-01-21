import { useCallback, useMemo, useState } from 'react';
import AccountingTable from '@/components/dashboard/accounting/table';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import { Button } from '@/components/ui/button';
import { DownloadIcon, HousePlus, Landmark, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import { AppDialog } from '@/components/core/app-dialog';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import BankForm from '@/components/dashboard/accounting/banking/overview/bank-form';
import ReconciliationForm from '@/components/dashboard/accounting/banking/reconciliation/reconciliation-form';

// Mock data
const sampleData = [
  {
    id: 'REC-1001',
    account: '*****12345',
    period: '2024-01',
    bankBalance: 5000,
    ledgerBalance: 4800,
    difference: 200,
    status: 'Pending',
  },
  {
    id: 'REC-1002',
    account: '*****67890',
    period: '2024-01',
    bankBalance: 10000,
    ledgerBalance: 10000,
    difference: 0,
    status: 'Reconciled',
  },
]

export default function BankingReconciliation() {
  // State for table selection
  const [selectedItems, setSelectedItems] = useState([]);
  const [ openReconciliationForm, setOpenReconciliationForm ] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [assets] = useState([...sampleData])

  const assetMetrics = useMemo(() => {
    return [
      {
        title: 'Overall Progress',
        value: 20,
      },
      {
        title: 'Reconciled',
        value: 3000,
      },
      {
        title: 'Pending',
        value: 23,
      },
      {
        title: 'Overdue',
        value: 2,
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
      key: 'account',
      label: 'Account',
    },
    {
      key: 'period',
      label: 'Period',
    },
    {
      key: 'bankBalance',
      label: 'Bank Balance',
    },
    {
      key: 'ledgerBalance',
      label: 'Ledger Balance',
    },
    {
      key: 'difference',
      label: 'Difference',
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

  const handleOnCreateReconciliation = useCallback((data) => {
    console.log('Reconciliation created:', data)
  }, [])

  return (
    <div className='my-4 min-h-screen'>
      <>
        <div>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <hgroup>
              <h1 className="text-2xl font-bold">Reconciliation</h1>
              <p className="text-sm text-[#7D7D7D]">
                Automatically Reconcile and Verify Your Financial Transactions
              </p>
            </hgroup>

            <div className="flex space-x-4">
              <Button
                onClick={() => setOpenReconciliationForm(true)}
                className={'h-10 rounded-2xl text-sm'}
              >
                <PlusCircleIcon className="size-4" />
                Reconcile
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
                title="Reconciliation summary"
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
            title="Reconcile"
            headerIcon={<Landmark />}
            open={openReconciliationForm} 
            onOpenChange={setOpenReconciliationForm}
            className='sm:max-w-163'
          >
            <ReconciliationForm onCreateReconciliation={handleOnCreateReconciliation} onBack={() => setOpenReconciliationForm(false)} />
          </AppDialog>

          <SuccessModal
            title={'Reconciliation Added'}
            description={"You've successfully added a reconciliation."}
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
