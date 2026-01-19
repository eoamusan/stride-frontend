import { useCallback, useMemo, useState } from 'react';
import AccountingTable from '@/components/dashboard/accounting/table';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import { Button } from '@/components/ui/button';
import { DownloadIcon, HousePlus, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import EmptyAsset from '@/components/dashboard/accounting/fixed-asset-management/overview/empty-state';
import AssetCard from '@/components/dashboard/accounting/fixed-asset-management/overview/asset-card';
import { AppDialog } from '@/components/core/app-dialog';
import geishaImg from '@/assets/images/geisha.png';
import AssetAssignmentForm from '@/components/dashboard/accounting/fixed-asset-management/assets-assignment/asset-assignment-form';
import SuccessModal from '@/components/dashboard/accounting/success-modal';

// Mock data
const sampleData = [
  {
    id: '1',
    img: geishaImg,
    name: 'Canon EOS R5',
    employee: 'John Doe',
    category: 'Mar 2025-Feb2025',
    department: 'James Doe',
    assignedDate: 'Thur 12:23pm',
    returnDate: 150000,
    condition: 150000,
    actualReturn: 150000,
    status: 'Active',
  },
  {
    id: '2',
    img: geishaImg,
    name: 'MacBook Pro 16"',
    employee: 'Jane Smith',
    category: 'Mar 2025-Feb2025',
    department: 'Emily Clark',
    assignedDate: 'Mon 09:15am',
    returnDate: 150000,
    condition: 150000,
    actualReturn: 150000,
    status: 'Active',
  }
]

export default function FixedAssetMgtAssetAssignment() {
  // State for table selection
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [ openAssignmentForm, setOpenAssignmentForm ] = useState(false)
  const [assets] = useState([...sampleData])

  const assetMetrics = useMemo(() => {
    return [
      {
        title: 'Active Assignment',
        value: 2000,
      },
      {
        title: 'Unassigned Assets',
        value: 3000,
      },
      {
        title: 'Total Employees',
        value: 23,
      },
      {
        title: 'Transfer History',
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
      key: 'img',
      label: 'IMG',
      render: (value) => (
        <div className="flex h-10 w-10 items-center justify-center rounded">
          <img
            src={value}
            alt="Product"
            className="h-8 w-8 rounded object-cover"
          />
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Asset',
    },
    {
      key: 'employee',
      label: 'Employee',
    },
    {
      key: 'category',
      label: 'Category',
    },
    {
      key: 'department',
      label: 'Department',
    },
    {
      key: 'assignedDate',
      label: 'Assigned Date',
    },
    {
      key: 'returnDate',
      label: 'Return Date',
    },
    {
      key: 'condition',
      label: 'Condition',
    },
    {
      key: 'actualReturn',
      label: 'Actual Return',
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

  const handleSetOpenAssignmentForm = useCallback((value) => {
    setOpenAssignmentForm(value)
  }, [])

  const handleOnCreateAssignment = useCallback((data) => {
    console.log('Assignment created:', data)
    setIsSuccessModalOpen(true)
  }, [])

  return (
    <div className='my-4 min-h-screen'>
      <>
        <div>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <hgroup>
              <h1 className="text-2xl font-bold">Assets Assignment</h1>
              <p className="text-sm text-[#7D7D7D]">
                Manage all your organization's assets with advanced filtering and bulk operations
              </p>
            </hgroup>

            <div className="flex space-x-4">
              <Button
                onClick={() => setOpenAssignmentForm(true)}
                className={'h-10 rounded-2xl text-sm'}
              >
                <PlusCircleIcon className="size-4" />
                Assign Asset
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
        { !assets.length ? <EmptyAsset onClick={() => handleSetOpenAssignmentForm(true)} /> : 
          <>
            <div className="relative mt-10">
              <AccountingTable
                title="Asset Assignments"
                description="Manage asset assignments and employee transfers"
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
                itemComponent={AssetCard}
              />
            </div>
          </>}
          <AppDialog 
            title="Assign Asset"
            headerIcon={<HousePlus />}
            open={openAssignmentForm} 
            onOpenChange={setOpenAssignmentForm}
            className='sm:max-w-163'
          >
            <AssetAssignmentForm onCancel={() => setOpenAssignmentForm(false)} onSubmit={handleOnCreateAssignment} />
          </AppDialog>

          <SuccessModal
            title={'Asset Assigned Successfully'}
            description={"You've successfully assigned an asset to Sale Team."}
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
