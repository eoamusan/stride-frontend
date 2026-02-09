import { useCallback, useEffect, useMemo, useState } from 'react';
import AccountingTable from '@/components/dashboard/accounting/table';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import { Button } from '@/components/ui/button';
import { DownloadIcon, HousePlus, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import { AppDialog } from '@/components/core/app-dialog';
import CategoryForm from '@/components/dashboard/accounting/fixed-asset-management/categories/category-form';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import useCategories from '@/hooks/fixed-asset-management/useCategories';
import toast from 'react-hot-toast';

export default function FixedAssetMgtCategories() {
  // State for table selection
  const [selectedItems, setSelectedItems] = useState([]);
  const [ openCategoryForm, setOpenCategoryForm ] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const { categories, fetchCategories, paginationData, loadingCategories } = useCategories()
  const [selectedCategory, setSelectedCategory] = useState(null)

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
      setSelectedItems(categories.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Table columns configuration
  const tableColumns = [
    {
      key: 'categoryName',
      label: 'Category',
    },
    {
      key: 'depreciationMethod',
      label: 'Depreciation Method',
    },
    {
      key: 'lastModifiedBy',
      label: 'Asset Count',
    },
    {
      key: 'usefulLifeYears',
      label: 'Useful Life',
    },
    {
      key: 'salvageValue',
      label: 'Salvage Value',
    },
    // {
    //   key: 'timeModified',
    //   label: 'Status',
    // },
  ];

  // Dropdown actions for each row
  const dropdownActions = [
    { key: 'view', label: 'View' },
    { key: 'edit', label: 'Edit' },
  ];

  const handleRowAction = (action, item) => {
    console.log(`Action ${action} on item:`, item);

    // Implement row action logic here
    switch (action) {
      case 'view':
        break;
      case 'edit':
        setSelectedCategory(item)
        setOpenCategoryForm(true)
        break;
      default:
        break;
    }
  };

  const handleOnCreateCategory = useCallback(() => {
    setOpenCategoryForm(false)
    setIsSuccessModalOpen(true)
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return (
    <div className='my-4 min-h-screen'>
      <>
        <div>
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
              {/* <Button size={'icon'} className={'size-10'} variant={'outline'}>
                <SettingsIcon size={16} />
              </Button> */}
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
                data={categories}
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
                isLoading={loadingCategories}
              />
            </div>
          </>
          <AppDialog 
            title={ selectedCategory ? "Edit Category" : "Add New Category" }
            headerIcon={<HousePlus />}
            open={openCategoryForm} 
            onOpenChange={setOpenCategoryForm}
            className='sm:max-w-163'
          >
            <CategoryForm 
              formValues={selectedCategory} 
              onCreateCategory={handleOnCreateCategory} 
              onUpdateCategory={() => {
                toast.success('Category updated successfully')
                setOpenCategoryForm(false)
                fetchCategories()
                setSelectedCategory(null)
              }} 
              onCancel={() => setOpenCategoryForm(false)} />
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
