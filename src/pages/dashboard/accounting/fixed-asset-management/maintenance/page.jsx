import { useCallback, useMemo, useState } from 'react';
import AccountingTable from '@/components/dashboard/accounting/table';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DownloadIcon, HousePlus, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import { AppDialog } from '@/components/core/app-dialog';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import MaintenanceForm from '@/components/dashboard/accounting/fixed-asset-management/maintenance/maintenance-form';

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

export default function FixedAssetMgtMaintenance() {
  // State for table selection
  const [selectedItems, setSelectedItems] = useState([]);
  const [ openMaintenanceForm, setOpenMaintenanceForm ] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [assets] = useState([...sampleData])

  const assetMetrics = useMemo(() => {
    return [
      {
        title: 'Total Schedule',
        value: 2000,
      },
      {
        title: 'Completed',
        value: 3000,
      },
      {
        title: 'Total Cost',
        value: 23,
      },
      {
        title: 'Overdue',
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
      key: 'type',
      label: 'Asset',
    },
    {
      key: 'date',
      label: 'Vendor',
    },
    {
      key: 'lastModifiedBy',
      label: 'Type',
    },
    {
      key: 'timeModified',
      label: 'Scheduled Date',
    },
    {
      key: 'timeModified',
      label: 'Assigned To',
    },
    {
      key: 'cost',
      label: 'Cost',
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

  const handleOnCreateMaintenance = useCallback((data) => {
    console.log('Maintenance scheduled:', data)
    setIsSuccessModalOpen(true)
  }, [])

  return (
    <div className='my-4 min-h-screen'>
      <>
        <div className={cn(!assets.length && 'hidden')}>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <hgroup>
              <h1 className="text-2xl font-bold">Maintenance Schedule</h1>
              <p className="text-sm text-[#7D7D7D]">
                Plan and monitor maintenance activities
              </p>
            </hgroup>

            <div className="flex space-x-4">
              <Button
                onClick={() => setOpenMaintenanceForm(true)}
                className={'h-10 rounded-2xl text-sm'}
              >
                <PlusCircleIcon className="size-4" />
                Schedule Maintenance
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
                title="Maintenance Activities"
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
            title="Schedule Maintenance"
            headerIcon={<HousePlus />}
            open={openMaintenanceForm} 
            onOpenChange={setOpenMaintenanceForm}
            className='sm:max-w-163'
          >
            <MaintenanceForm onCreate={handleOnCreateMaintenance} onCancel={() => setOpenMaintenanceForm(false)} />
          </AppDialog>

          <SuccessModal
            title={'Maintenance Scheduled'}
            description={"You've successfully scheduled a maintenance."}
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
