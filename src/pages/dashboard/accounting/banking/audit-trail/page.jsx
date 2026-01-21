import { useCallback, useState } from 'react';
import AccountingTable from '@/components/dashboard/accounting/table';
import { Button } from '@/components/ui/button';
import { DownloadIcon, HousePlus, Landmark, PlusCircleIcon, SettingsIcon, UploadIcon } from 'lucide-react';
import { AppDialog } from '@/components/core/app-dialog';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import BankForm from '@/components/dashboard/accounting/banking/overview/bank-form';

// Mock data
const sampleData = [
  {
    id: 1,
    date: '2024-10-01 10:15:30',
    user: 'John Doe',
    action: 'Reconciled Transaction',
    details: 'Reconciled $500 payment from Client A',
    account: 'Business Checking *****1234',
    changes: 'Status changed to Reconciled',
    status: 'Success',
  },
  {
    id: 2,
    date: '2024-10-02 14:22:10',
    user: 'Jane Smith',
    action: 'Edited Bank Account',
    details: 'Updated account nickname to "Main Business Account"',
    account: 'Business Savings *****5678',
    changes: 'Nickname updated',
    status: 'Success',
  }
]

export default function AuditTrail() {
  // State for table selection
  const [selectedItems, setSelectedItems] = useState([]);
  const [ openBankForm, setOpenBankForm ] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
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
      key: 'date',
      label: 'Timestamp',
    },
    {
      key: 'user',
      label: 'User',
    },
    {
      key: 'action',
      label: 'Action',
    },
    {
      key: 'details',
      label: 'Details',
    },
    {
      key: 'account',
      label: 'Account',
    },
    {
      key: 'changes',
      label: 'Changes',
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
              <h1 className="text-2xl font-bold">Audit Trail</h1>
              <p className="text-sm text-[#7D7D7D]">
                Automatically Reconcile and Verify Your Financial Transactions
              </p>
            </hgroup>

            <div className="flex space-x-4">
              <Button
                className={'h-10 rounded-2xl text-sm'}
                variant="outline"
              >
                <UploadIcon className="size-4" />
                Upload Statement
              </Button>
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
        </div>
          <>
            <div className="relative mt-10">
              <AccountingTable
                title="Audit Trail"
                description="Complete history of all reconciliation activities and changes"
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
