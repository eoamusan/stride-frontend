import { useCallback, useMemo, useState } from 'react';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import { Button } from '@/components/ui/button';
import { DownloadIcon, HousePlus, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import EmptyAsset from '@/components/dashboard/accounting/fixed-asset-management/overview/empty-state';
import UpcomingMaintenance from '@/components/dashboard/accounting/fixed-asset-management/overview/upcoming-maintenance';
import AreaMetricCard from '@/components/dashboard/area-metric-card';
import AssetCategories from '@/components/dashboard/accounting/fixed-asset-management/overview/asset-categories';
import PieMetricCard from '@/components/dashboard/pie-metric-card';
import AssetForm from '@/components/dashboard/accounting/fixed-asset-management/assets/asset-form';
import { AppDialog } from '@/components/core/app-dialog';
import YoutubeVideoGuideButton from '@/components/dashboard/accounting/shared/youtube-video-guide-button';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import AssetTable from '@/components/dashboard/accounting/fixed-asset-management/overview/asset-table';
import useAssets from '@/hooks/budgeting/useAssets';
import AssetDetails from '@/components/dashboard/accounting/fixed-asset-management/assets/asset-details';

export default function FixedAssetMgtOverview() {
  // State for table selection
  const [ openAssetForm, setOpenAssetForm ] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState()
  const { assets, loadingAssets } = useAssets();

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

  
  const handleSetOpenAssetForm = useCallback((value) => {
    setOpenAssetForm(value)
  }, [])

  const handleOnCreateAsset = useCallback(() => {
    setOpenAssetForm(false)
    setIsSuccessModalOpen(true);
  }, [])

  const handleShowDetails = useCallback((value) => {
    setSelectedItem(value)
  }, [])

  return (
    <div className='my-4 min-h-screen'>
      { selectedItem ? <AssetDetails selectedItem={selectedItem} setShowDetails={() => setSelectedItem(null)} /> :
      <>
      { !assets.length && !loadingAssets ? <EmptyAsset onClick={() => handleSetOpenAssetForm(true)} /> : 
        <>
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
            {/* <Button size={'icon'} className={'size-10'} variant={'outline'}>
              <DownloadIcon size={16} />
            </Button>
            <Button size={'icon'} className={'size-10'} variant={'outline'}>
              <SettingsIcon size={16} />
            </Button> */}
          </div>
        </div>

        <div className="mt-10">
          <Metrics metrics={assetMetrics} />
        </div>

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
            <AssetTable showItemDetails={handleShowDetails} />
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
        <SuccessModal
          title={'Asset Saved'}
          description={"You've successfully created an Asset."}
          open={isSuccessModalOpen}
          onOpenChange={setIsSuccessModalOpen}
          backText={'Back'}
          handleBack={() => {
            setIsSuccessModalOpen(false);
          }} 
        /></>
      }
    </div>
    
  );
}
