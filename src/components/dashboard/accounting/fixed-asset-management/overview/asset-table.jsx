
import { useEffect, useState } from 'react';
import AccountingTable from '../../table';
import useAssets from '@/hooks/budgeting/useAssets';
import AssetCard from '../assets/asset-card';

const AssetTable = ({ showItemDetails }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const { assets, loadingAssets, paginationData, fetchAssets } = useAssets();
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
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return (
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
  );
};

export default AssetTable;
