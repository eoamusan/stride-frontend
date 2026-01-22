import { useCallback, useMemo, useState } from 'react';
import AccountingTable from '@/components/dashboard/accounting/table';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DownloadIcon, HousePlus, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import EmptyAsset from '@/components/dashboard/accounting/fixed-asset-management/overview/empty-state';
import UpcomingMaintenance from '@/components/dashboard/accounting/fixed-asset-management/overview/upcoming-maintenance';
import AreaMetricCard from '@/components/dashboard/area-metric-card';
import AssetCategories from '@/components/dashboard/accounting/fixed-asset-management/overview/asset-categories';
import PieMetricCard from '@/components/dashboard/pie-metric-card';
import AssetCard from '@/components/dashboard/accounting/fixed-asset-management/overview/asset-card';
import AssetForm from '@/components/dashboard/accounting/fixed-asset-management/assets/asset-form';
import { AppDialog } from '@/components/core/app-dialog';
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

export default function FixedAssetMgtOverview() {
  // State for table selection
  const [selectedItems, setSelectedItems] = useState([]);
  const [ openAssetForm, setOpenAssetForm ] = useState(false)
  const [assets] = useState([...sampleData])

  const pieData = [
    { name: 'Disposed', value: 93, color: '#6366f1' },
    { name: 'Idle', value: 85, color: '#22c55e' },
    { name: 'In Use', value: 53, color: '#f59e0b' },
    { name: 'In Repair', value: 43, color: '#06b6d4' },
  ];

  const pieConfig = {
    Disposed: {
      label: 'Disposed',
      color: '#6366f1',
    },
    'Idle': {
      label: 'Idle',
      color: '#22c55e',
    },
    'In Use': {
      label: 'In Use',
      color: '#f59e0b',
    },
    'In Repair': {
      label: 'In Repair',
      color: '#06b6d4',
    },
  };


  const sampleChartData = [
    { date: '2024-01-01', expenses: 5000 },
    { date: '2024-02-01', expenses: 97000 },
    { date: '2024-03-01', expenses: 15000 },
    { date: '2024-04-01', expenses: 10000 },
    { date: '2024-05-01', expenses: 40000 },
    { date: '2024-06-01', expenses: 35000 },
    { date: '2024-07-01', expenses: 180 },
  ];

  const sampleChartConfig = {
    expenses: {
      label: 'Budget',
      color: '#7086FD',
    },
  };

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
    <div className={cn(!assets.length && 'hidden')}>
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Asset Management Overview</h1>
          <p className="text-sm text-[#7D7D7D]">
            Monitor and manage your organization's fixed assets efficiently
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
        <div className='grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-3 gap-4 mt-10'>
          <div className='col-span-2'>
            <AreaMetricCard
              className={'h-full w-full'}
              title={'Monthly Depreciation Trend'}
              chartData={sampleChartData}
              chartConfig={sampleChartConfig}
            />
          </div>
          <UpcomingMaintenance />
        </div>
        <div className='grid grid-cols-3 gap-4 mt-10'>
          <div>
            <PieMetricCard
              title="Assets By Status"
              chartData={pieData}
              chartConfig={pieConfig}
              className="w-full h-full"
            />
          </div>
          <div className='col-span-2 flex'>
            <AssetCategories />
          </div>
          
        </div>
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
    </div>
  );
}
