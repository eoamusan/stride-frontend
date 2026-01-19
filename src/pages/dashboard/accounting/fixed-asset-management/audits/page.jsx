import { useCallback, useMemo, useState } from 'react';
import AccountingTable from '@/components/dashboard/accounting/table';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import { Button } from '@/components/ui/button';
import { DownloadIcon, HousePlus, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import { AppDialog } from '@/components/core/app-dialog';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import MaintenanceForm from '@/components/dashboard/accounting/fixed-asset-management/maintenance/maintenance-form';
import AuditForm from '@/components/dashboard/accounting/fixed-asset-management/audits/audit-form';

// Mock data
const sampleData = [
  {
    id: 'Q1 2024 Revenue Budget',
    name: 'Marketing Budget',
    type: 'Profit and loss',
    date: 'Mar 2025-Feb2025',
    lastModifiedBy: 'James Doe',
    timeModified: 'Thur 12:23pm',
    budgetAmount: 150000,
    actualAmount: 150000,
    cost: 150000,
    status: 'Active',
    variance: 90,
  },
  {
    id: 'Q2 2024 Revenue Budget',
    name: 'Marketing Budget',
    type: 'Profit and loss',
    date: 'Mar 2025-Feb2025',
    lastModifiedBy: 'James Doe',
    timeModified: 'Thur 12:23pm',
    budgetAmount: 150000,
    actualAmount: 150000,
    cost: 150000,
    status: 'Active',
    variance: 23,
  },
  {
    id: 'Q3 2024 Revenue Budget',
    name: 'Marketing Budget',
    type: 'Profit and loss',
    date: 'Mar 2025-Feb2025',
    lastModifiedBy: 'James Doe',
    timeModified: 'Thur 12:23pm',
    budgetAmount: 150000,
    cost: 150000,
    actualAmount: 150000,
    status: 'Active',
    variance: 51,
  }
]

export default function FixedAssetMgtAudits() {
  // State for table selection
  const [selectedItems, setSelectedItems] = useState([]);
  const [ openAuditForm, setOpenAuditForm ] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [assets] = useState([...sampleData])

  const assetMetrics = useMemo(() => {
    return [
      {
        title: 'Total Audited',
        value: 2000,
      },
      {
        title: 'Verified',
        value: 3000,
      },
      {
        title: 'Pending',
        value: 23,
      },
      {
        title: 'Missing',
        value: 10,
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
      key: 'type',
      label: 'Asset',
    },
    {
      key: 'date',
      label: 'Audited By',
    },
    {
      key: 'lastModifiedBy',
      label: 'Audit Date',
    },
    {
      key: 'timeModified',
      label: 'Notes',
    },
    {
      key: 'timeModified',
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

  const handleOnCreateAudit = useCallback((data) => {
    console.log('Audit scheduled:', data)
    setIsSuccessModalOpen(true)
  }, [])

  return (
    <div className='my-4 min-h-screen'>
      <>
        <div>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <hgroup>
              <h1 className="text-2xl font-bold">Asset Auditing</h1>
              <p className="text-sm text-[#7D7D7D]">
                Conduct periodic audits to verify asset availability and condition
              </p>
            </hgroup>

            <div className="flex space-x-4">
              <Button
                onClick={() => setOpenAuditForm(true)}
                className={'h-10 rounded-2xl text-sm'}
              >
                <PlusCircleIcon className="size-4" />
                New Audit
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
                title="Audit History"
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
            title="New Audit"
            headerIcon={<HousePlus />}
            open={openAuditForm} 
            onOpenChange={setOpenAuditForm}
            className='sm:max-w-163'
          >
            <AuditForm onCreate={handleOnCreateAudit} onCancel={() => setOpenAuditForm(false)} />
          </AppDialog>

          <SuccessModal
            title={'Audit Confirmed'}
            description={"You've successfully started an audit."}
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
