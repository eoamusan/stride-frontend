import { useCallback, useMemo, useState } from 'react';
import AccountingTable from '@/components/dashboard/accounting/table';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import { Button } from '@/components/ui/button';
import { DownloadIcon, HousePlus, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import EmptyAsset from '@/components/dashboard/accounting/fixed-asset-management/overview/empty-state';
import { AppDialog } from '@/components/core/app-dialog';
import geishaImg from '@/assets/images/geisha.png';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import { Badge } from '@/components/ui/badge';
import AssetRetrievalForm from '@/components/dashboard/accounting/fixed-asset-management/assets-retrieve/assets-retrieval-form';
import AssetDetailCard from '@/components/dashboard/accounting/fixed-asset-management/assets-retrieve/asset-detail-card';

// Mock data
const sampleData = [
  {
    id: '1',
    img: geishaImg,
    name: 'Canon EOS R5',
    employee: 'John Doe',
    category: 'Good',
    department: 'Sales Team',
    assignedDate: 'Thur 12:23pm',
    returnDate: 'Mon 09:15am',
    condition: 150000,
    actualReturn: 150000,
    status: 'Retrieved',
  },
  {
    id: '2',
    img: geishaImg,
    name: 'MacBook Pro 16"',
    employee: 'Jane Smith',
    category: 'Good',
    department: 'Marketing Team ',
    assignedDate: 'Mon 09:15am',
    returnDate: 'Mon 09:15am',
    condition: 150000,
    actualReturn: 150000,
    status: 'Retrieved',
  }
]

export default function FixedAssetMgtAssetRetrieval() {
  // State for table selection
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [ openAssignmentForm, setOpenAssignmentForm ] = useState(false)
  const [assets] = useState([...sampleData])

  const assetMetrics = useMemo(() => {
    return [
      {
        title: 'Total Asset Retrieved',
        value: 2000,
      },
      {
        title: 'Assets due for Retrieval',
        value: 3000,
      },
      {
        title: 'Current Value',
        value: 23,
      },
      {
        title: 'Recovery Rate',
        value: 17,
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
      label: 'Depreciation Status',
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
      label: 'Retrieval Date',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge variant="success">{value} qwerty</Badge>
      ),
    }
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
              <h1 className="text-2xl font-bold">Assets Retrievals</h1>
              <p className="text-sm text-[#7D7D7D]">
                Asset Recovery and Management
              </p>
            </hgroup>

            <div className="flex space-x-4">
              <Button
                onClick={() => setOpenAssignmentForm(true)}
                className={'h-10 rounded-2xl text-sm'}
              >
                <PlusCircleIcon className="size-4" />
                Retrieve Assets
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
                title="Asset Retrievals History"
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
                isProductTable
                itemComponent={AssetDetailCard}
              />
            </div>
          </>}
          <AppDialog 
            title="Retrieve Assets"
            headerIcon={<HousePlus />}
            open={openAssignmentForm} 
            onOpenChange={setOpenAssignmentForm}
            className='sm:max-w-163'
          >
            <AssetRetrievalForm onCancel={() => setOpenAssignmentForm(false)} onSubmit={handleOnCreateAssignment} />
          </AppDialog>

          <SuccessModal
            title={'Asset Retrieved Successfully'}
            description={"You've successfully retrieved an asset from Sale Team."}
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
