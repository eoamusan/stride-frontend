import { useCallback, useMemo, useState } from 'react';
import AccountingTable from '@/components/dashboard/accounting/table';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DownloadIcon, HousePlus, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import EmptyAsset from '@/components/dashboard/accounting/fixed-asset-management/overview/empty-state';
import AssetForm from '@/components/dashboard/accounting/fixed-asset-management/assets/asset-form';
import { AppDialog } from '@/components/core/app-dialog';
import AssetDetails from '@/components/dashboard/accounting/fixed-asset-management/assets/asset-details';
import CategoryForm from '@/components/dashboard/accounting/fixed-asset-management/categories/category-form';
import SuccessModal from '@/components/dashboard/accounting/success-modal';

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

export default function FixedAssetMgtCategories() {
  // State for table selection
  const [selectedItems, setSelectedItems] = useState([]);
  const [ openCategoryForm, setOpenCategoryForm ] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [assets] = useState([...sampleData])

  const assetMetrics = useMemo(() => {
    return [
      {
        title: 'Total Categories',
        value: 2000,
      },
      {
        title: 'Total Assets',
        value: 3000,
      },
      {
        title: 'Most Used Category',
        value: 23,
      },
      {
        title: 'Avg. Depreciation Rate',
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
      label: 'Category',
    },
    {
      key: 'date',
      label: 'Depreciation Method',
    },
    {
      key: 'lastModifiedBy',
      label: 'Asset Count',
    },
    {
      key: 'timeModified',
      label: 'Useful Life',
    },
    {
      key: 'timeModified',
      label: 'Salvage Value',
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

  const handleOnCreateCategory = useCallback((data) => {
    console.log('Category created:', data)
    setIsSuccessModalOpen(true)
  }, [])

  return (
    <div className='my-4 min-h-screen'>
      <>
        <div className={cn(!assets.length && 'hidden')}>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <hgroup>
              <h1 className="text-2xl font-bold">Asset Categories Management</h1>
              <p className="text-sm text-[#7D7D7D]">
                Configure and manage depreciation settings for different asset types
              </p>
            </hgroup>

            <div className="flex space-x-4">
              <Button
                onClick={() => setOpenCategoryForm(true)}
                className={'h-10 rounded-2xl text-sm'}
              >
                <PlusCircleIcon className="size-4" />
                Add New Category
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
                title="Categories"
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
            title="Add New Category"
            headerIcon={<HousePlus />}
            open={openCategoryForm} 
            onOpenChange={setOpenCategoryForm}
            className='sm:max-w-163'
          >
            <CategoryForm onCreateCategory={handleOnCreateCategory} onCancel={() => setOpenCategoryForm(false)} />
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
