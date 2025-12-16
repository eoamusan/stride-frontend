import Metrics from '../invoicing/plain-metrics';
import BarChartOverview from '@/components/dashboard/bar-metric-card';
import PieMetricCard from '@/components/dashboard/pie-metric-card';
import AccountingTable from '@/components/dashboard/accounting/table';
import { useState } from 'react';

export default function FixedAsset() {
  const [selectedItems, setSelectedItems] = useState([]);

  const metrics = [
    { title: 'Total Assets', value: '200', symbol: '$' },
    { title: 'Net Book Value', value: '170', symbol: '$' },
    { title: 'Depreciation', value: '160,434', symbol: '$' },
    { title: 'Avg Asset Age', value: '4/5 years', symbol: '' },
  ];

  // Net Value Bar Chart Data (showing yearly asset values)
  const netValueData = [
    { year: '2020', value: 32000 },
    { year: '2021', value: 80000 },
    { year: '2022', value: 32000 },
    { year: '2023', value: 65000 },
    { year: '2024', value: 22000 },
  ];

  const netValueConfig = {
    value: {
      label: 'Net Value',
      color: '#8B5CF6',
    },
  };

  // Assets by Category Pie Chart Data
  const assetsByCategoryData = [
    { name: 'Electronics', value: 234, color: '#6B8AFF' },
    { name: 'Home & Garden', value: 45, color: '#4ADE80' },
    { name: 'Fresh Produce', value: 34, color: '#FB923C' },
    { name: 'Dairy Products', value: 66, color: '#22D3EE' },
    { name: 'Stationery', value: 44, color: '#A78BFA' },
  ];

  const assetsCategoryConfig = {
    Electronics: {
      label: 'Electronics',
      color: '#6B8AFF',
    },
    'Home & Garden': {
      label: 'Home & Garden',
      color: '#4ADE80',
    },
    'Fresh Produce': {
      label: 'Fresh Produce',
      color: '#FB923C',
    },
    'Dairy Products': {
      label: 'Dairy Products',
      color: '#22D3EE',
    },
    Stationery: {
      label: 'Stationery',
      color: '#A78BFA',
    },
  };

  // Recent Assets Table Data
  const recentAssetsData = [
    {
      id: 1,
      asset: 'Toyota Camry',
      assetIcon: '🚗',
      category: 'Vehicles',
      department: 'Sales Team',
      value: 15400.0,
      lastUpdated: '2 Hours ago',
      depreciation: 'Straight Line',
      status: 'In Use',
    },
    {
      id: 2,
      asset: 'Canon EOS 5D',
      assetIcon: '📷',
      category: 'Tools',
      department: 'Sales Team',
      value: 15400.0,
      lastUpdated: '2 Hours ago',
      depreciation: 'Straight Line',
      status: 'In Repair',
    },
    {
      id: 3,
      asset: 'Home Office Chair',
      assetIcon: '🪑',
      category: 'Office Furniture',
      department: 'Sales Team',
      value: 15400.0,
      lastUpdated: '2 Hours ago',
      depreciation: 'Straight Line',
      status: 'Idle',
    },
    {
      id: 4,
      asset: 'MacBook Pro 16"',
      assetIcon: '💻',
      category: 'Electronics',
      department: 'IT Team',
      value: 25000.0,
      lastUpdated: '5 Hours ago',
      depreciation: 'Straight Line',
      status: 'In Use',
    },
    {
      id: 5,
      asset: 'Conference Table',
      assetIcon: '🪑',
      category: 'Office Furniture',
      department: 'Admin',
      value: 8500.0,
      lastUpdated: '1 Day ago',
      depreciation: 'Straight Line',
      status: 'In Use',
    },
  ];

  const tableColumns = [
    {
      key: 'asset',
      label: 'Asset',
      render: (value, item) => (
        <div className="flex items-center gap-2">
          <span className="text-xl">{item.assetIcon}</span>
          <span className="font-medium">{value}</span>
        </div>
      ),
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
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      key: 'lastUpdated',
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

  const handleSelectItem = (itemId, checked) => {
    setSelectedItems((prevItems) => {
      if (checked) {
        return [...prevItems, itemId];
      } else {
        return prevItems.filter((id) => id !== itemId);
      }
    });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(recentAssetsData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const dropdownActions = [
    { key: 'view', label: 'View' },
    { key: 'edit', label: 'Edit' },
    { key: 'delete', label: 'Delete' },
  ];

  const handleRowAction = (action, item) => {
    console.log(`Action ${action} on asset:`, item);
  };

  const paginationData = {
    page: 1,
    totalPages: 6,
    pageSize: 12,
    totalCount: 64,
  };

  return (
    <div className="my-10">
      <div>
        <Metrics metrics={metrics} />
      </div>
      <div className="mt-10 flex flex-col gap-10 md:flex-row">
        <BarChartOverview
          title="Net Value"
          chartConfig={netValueConfig}
          chartData={netValueData}
          numberOfBars={1}
          showLegend={false}
          className="w-full md:w-3/5"
        />
        <PieMetricCard
          title="Assets by Category"
          chartData={assetsByCategoryData}
          chartConfig={assetsCategoryConfig}
          className="w-full md:w-2/5"
        />
      </div>
      <div className="mt-10">
        <AccountingTable
          title="Recent Assets"
          data={recentAssetsData}
          columns={tableColumns}
          searchFields={['asset', 'category', 'department']}
          searchPlaceholder="Search assets......."
          statusStyles={{
            'In Use': 'bg-green-100 text-green-800 hover:bg-green-100',
            'In Repair': 'bg-orange-100 text-orange-800 hover:bg-orange-100',
            Idle: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
          }}
          dropdownActions={dropdownActions}
          paginationData={paginationData}
          selectedItems={selectedItems}
          handleSelectItem={handleSelectItem}
          handleSelectAll={handleSelectAll}
          onRowAction={handleRowAction}
          showDataSize
        />
      </div>
    </div>
  );
}
