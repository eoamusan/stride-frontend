import { useCallback, useMemo, useState } from 'react';
import AccountingTable from '@/components/dashboard/accounting/table';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import { Button } from '@/components/ui/button';
import { DownloadIcon, HousePlus, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import EmptyAsset from '@/components/dashboard/accounting/fixed-asset-management/overview/empty-state';
import AssetCard from '@/components/dashboard/accounting/fixed-asset-management/overview/asset-card';
import AssetForm from '@/components/dashboard/accounting/fixed-asset-management/assets/asset-form';
import { AppDialog } from '@/components/core/app-dialog';
import AssetDetails from '@/components/dashboard/accounting/fixed-asset-management/assets/asset-details';
import YoutubeVideoGuideButton from '@/components/dashboard/accounting/shared/youtube-video-guide-button';

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
    actualAmount: 150000,
    status: 'Active',
    variance: 51,
  },
  {
    id: 'Q4 2024 Revenue Budget',
    name: 'Marketing Budget',
    type: 'Profit and loss',
    date: 'Mar 2025-Feb2025',
    lastModifiedBy: 'James Doe',
    timeModified: 'Thur 12:23pm',
    budgetAmount: 150000,
    actualAmount: 150000,
    status: 'Active',
    variance: 67,
  }
]

export default function FixedAssetMgtAssets() {
  // State for table selection
  const [selectedItems, setSelectedItems] = useState([]);
  const [ openAssetForm, setOpenAssetForm ] = useState(false)
  const [assets] = useState([...sampleData])

  const [showDetails, setShowDetails] = useState(false);

  const assetMetrics = useMemo(() => {
    return [
      {
        title: 'Total Assets',
        value: 2000,
      },
      {
        title: 'In Use',
        value: 3000,
      },
      {
        title: 'Maintenance Due',
        value: 23,
      },
      {
        title: 'Monthly Depreciation',
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
      key: 'id',
      label: 'No',
    },
    {
      key: 'name',
      label: 'Asset',
      className: 'font-medium',
    },
    {
      key: 'type',
      label: 'Category',
    },
    {
      key: 'date',
      label: 'Department',
    },
    {
      key: 'lastModifiedBy',
      label: 'Value',
    },
    {
      key: 'timeModified',
      label: 'Last Updated',
    },
    {
      key: 'timeModified',
      label: 'Depreciation',
    },
    {
      key: 'timeModified',
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

  const handleSetOpenAssetForm = useCallback((value) => {
    setOpenAssetForm(value)
  }, [])

  const handleOnCreateAsset = useCallback((data) => {
    console.log('Asset created:', data)
  }, [])

  return (
    <div className='my-4 min-h-screen'>
      { showDetails ? <AssetDetails data={null} setShowDetails={setShowDetails} /> :
      <>
        <div>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <hgroup>
              <h1 className="text-2xl font-bold">Asset Management</h1>
              <p className="text-sm text-[#7D7D7D]">
                Manage all your organization's assets with advanced filtering and bulk operations
              </p>
            </hgroup>

            <div className="flex space-x-4">
              <YoutubeVideoGuideButton url="" />
              <Button
                onClick={() => setOpenAssetForm(true)}
                className={'h-10 rounded-2xl text-sm'}
              >
                <PlusCircleIcon className="size-4" />
                Add New Asset
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
        { !assets.length ? <EmptyAsset onClick={() => handleSetOpenAssetForm(true)} /> : 
          <>
            <div className="relative mt-10">
              <AccountingTable
                title="Recent Assets"
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
                isProductTable
                showDataSize
                itemComponent={AssetCard}
                setShowDetails={setShowDetails}
              />
            </div>
          </>}
          <AppDialog 
            title="Add New Asset"
            description="Create a new asset entry with comprehensive information and documentation"
            headerIcon={<HousePlus />}
            open={openAssetForm} 
            onOpenChange={setOpenAssetForm}
            className='sm:max-w-163'
          >
            <AssetForm onCreateAsset={handleOnCreateAsset} />
          </AppDialog>
      </>}
    </div>
  );
}
