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
import AssetTable from '@/components/dashboard/accounting/fixed-asset-management/overview/asset-table';


export default function FixedAssetMgtAssets() {
  // State for table selection
  const [ openAssetForm, setOpenAssetForm ] = useState(false)

  const [selectedItem, setSelectedItem] = useState()

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

  const handleOnCreateAsset = useCallback((data) => {
    console.log('Asset created:', data)
  }, [])

  return (
    <div className='my-4 min-h-screen'>
      { selectedItem ? <AssetDetails selectedItem={selectedItem} setShowDetails={() => setSelectedItem(null)} /> :
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
              {/* <Button size={'icon'} className={'size-10'} variant={'outline'}>
                <SettingsIcon size={16} />
              </Button> */}
            </div>
          </div>

          <div className="mt-10">
            <Metrics metrics={assetMetrics} />
          </div>
        </div>
          <div className="relative mt-10">
            <AssetTable showItemDetails={setSelectedItem} />
          </div>
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
