
import { useState } from 'react';
import AccountingTable from '../../table';
import useAssets from '@/hooks/fixed-asset-management/useAssets';
import AssetCard from '../assets/asset-card';
import toast from 'react-hot-toast';
import { AppDialog } from '@/components/core/app-dialog';
import { HousePlus } from 'lucide-react';
import AssetForm from '../assets/asset-form';

const AssetTable = ({ showItemDetails }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const { assets, loadingAssets, paginationData, loadingAssetDetails, fetchAssetById } = useAssets();
  const [openAssetForm, setOpenAssetForm] = useState(false);
  // Table columns configuration
  const tableColumns = [
    {
      key: 'serialNo',
      label: 'No',
    },
    {
      key: 'assetName',
      label: 'Asset',
      className: 'font-medium',
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
      key: 'value',
      label: 'Value',
    },
    {
      key: 'updatedAt',
      label: 'Last Updated',
    },
    {
      key: 'depreciation',
      label: 'Depreciation',
    },
    {
      key: 'status',
      label: 'Status',
    },
  ];

  // Dropdown actions for each row
  const dropdownActions = [
    { key: 'view', label: 'View' },
    { key: 'edit', label: 'Edit' },
    { key: 'assign', label: 'Assign Asset' },
    { key: 'list-on-shobu', label: 'List On Shobu' },
    { key: 'delete', label: 'Delete' },
  ];

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

  const handleRowAction = (action, item) => {
    console.log(`Action ${action} on item:`, item);

    // Implement row action logic here
    switch (action) {
      case 'view':
        showItemDetails(item);
        break;
      case 'edit':
        // fetch item details and open form
        setOpenAssetForm(true);
        fetchAssetById(item.id).then((detailedItem) => {
          setSelectedItem(detailedItem);
        });
        break;
    }
  };

  return (
    <>
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
      isLoading={loadingAssets}
    /> 

    <AppDialog 
      title="Edit Asset"
      headerIcon={<HousePlus />}
      open={openAssetForm} 
      onOpenChange={setOpenAssetForm}
      className='sm:max-w-163'
    >
    {loadingAssetDetails ? <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-70">
      <div className='py-4'>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="border-primary mb-4 h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"></div>
          <p className="text-muted-foreground">Loading asset details...</p>
        </div>
      </div>
    </div> : 
      <AssetForm
        formValues={selectedItem}
        onCreateAsset={() => {
        toast.success('Asset updated successfully')
        setOpenAssetForm(false)
      }} />
    }
    </AppDialog>
    </>
  );
};

export default AssetTable;
