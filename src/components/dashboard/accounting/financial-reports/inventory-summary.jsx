import Metrics from '../invoicing/plain-metrics';
import BarChartOverview from '@/components/dashboard/bar-metric-card';
import PieMetricCard from '@/components/dashboard/pie-metric-card';
import AccountingTable from '@/components/dashboard/accounting/table';
import ProductCard from '@/components/dashboard/accounting/inventory/products/product-card';
import { useState } from 'react';
import geishaImg from '@/assets/images/geisha.png';

export default function InventorySummary() {
  const [selectedItems, setSelectedItems] = useState([]);

  const metrics = [
    { title: 'Total Budget', value: '200', symbol: '$' },
    { title: 'Actual', value: '170', symbol: '$' },
    { title: 'Over Budget', value: '160,434', symbol: '$' },
    { title: 'On track', value: '4/5', symbol: '' },
  ];

  const stockSummaryData = [
    { day: 'Electronics', value1: 45, value2: 30, value3: 59 },
    { day: 'Home & Garden', value1: 89, value2: 28, value3: 70 },
    { day: 'Fresh Produce', value1: 85, value2: 95, value3: 84 },
    { day: 'Frozen Items', value1: 18, value2: 12, value3: 88 },
    { day: 'Dairy Products', value1: 44, value2: 46, value3: 67 },
    { day: 'Stationery', value1: 91, value2: 39, value3: 96 },
  ];

  const stockSummaryConfig = {
    value1: {
      label: 'In Stock',
      color: '#6FD195',
    },
    value2: {
      label: 'Low Stock',
      color: '#FFAE4C',
    },
    value3: {
      label: 'Out of Stock',
      color: '#FF2C2C',
    },
  };

  const inventoryDistributionData = [
    { name: 'Electronics', value: 93, color: '#6366f1' },
    { name: 'Home & Garden', value: 85, color: '#22c55e' },
    { name: 'Fresh Produce', value: 53, color: '#f59e0b' },
    { name: 'Dairy Products', value: 43, color: '#06b6d4' },
    { name: 'Stationery', value: 26, color: '#8b5cf6' },
  ];

  const inventoryDistributionConfig = {
    Electronics: {
      label: 'Electronics',
      color: '#6366f1',
    },
    'Home & Garden': {
      label: 'Home & Garden',
      color: '#22c55e',
    },
    'Fresh Produce': {
      label: 'Fresh Produce',
      color: '#f59e0b',
    },
    'Dairy Products': {
      label: 'Dairy Products',
      color: '#06b6d4',
    },
    Stationery: {
      label: 'Stationery',
      color: '#8b5cf6',
    },
  };

  const productData = [
    {
      id: 1,
      img: geishaImg,
      sku: 'GE-2001',
      itemName: 'Geisha',
      category: 'Office Supplies',
      currentStock: 25,
      unitCost: 1200.0,
      purchasePrice: 30000.0,
      status: 'In stock',
    },
    {
      id: 2,
      img: geishaImg,
      sku: 'HBS-2001',
      itemName: 'Head Set',
      category: 'Office Supplies',
      currentStock: 25,
      unitCost: 1200.0,
      purchasePrice: 30000.0,
      status: 'Out of stock',
    },
  ];

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
      key: 'sku',
      label: 'SKU',
      className: 'font-medium',
    },
    {
      key: 'itemName',
      label: 'Item Name',
    },
    {
      key: 'category',
      label: 'Category',
    },
    {
      key: 'currentStock',
      label: 'Current Stock',
    },
    {
      key: 'unitCost',
      label: 'Unit Cost',
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      key: 'purchasePrice',
      label: 'Purchase Price',
      render: (value) => `$${value.toLocaleString()}`,
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
      setSelectedItems(productData.map((item) => item.id));
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
    console.log(`Action ${action} on item:`, item);
  };

  const paginationData = {
    page: 1,
    totalPages: 3,
    pageSize: 2,
    totalCount: 64,
  };

  return (
    <div className="my-10">
      <div>
        <Metrics metrics={metrics} />
      </div>
      <div className="mt-10 flex flex-col gap-10 md:flex-row">
        <BarChartOverview
          title="Stock Summary"
          chartConfig={stockSummaryConfig}
          chartData={stockSummaryData}
          numberOfBars={3}
          showLegend={true}
          className="w-full md:w-3/5"
        />
        <PieMetricCard
          title="Inventory Distribution & Total Value"
          chartData={inventoryDistributionData}
          chartConfig={inventoryDistributionConfig}
          className="w-full md:w-2/5"
        />
      </div>
      <div className="mt-10">
        <AccountingTable
          title="Product Catalog"
          data={productData}
          columns={tableColumns}
          searchFields={['sku', 'itemName', 'category']}
          searchPlaceholder="Search by SKU or name......"
          statusStyles={{
            'In stock': 'bg-green-100 text-green-800 hover:bg-green-100',
            'Low stock': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
            'Out of stock': 'bg-red-100 text-red-800 hover:bg-red-100',
          }}
          dropdownActions={dropdownActions}
          paginationData={paginationData}
          selectedItems={selectedItems}
          handleSelectItem={handleSelectItem}
          handleSelectAll={handleSelectAll}
          onRowAction={handleRowAction}
          isProductTable
          showDataSize
          itemComponent={ProductCard}
        />
      </div>
    </div>
  );
}
