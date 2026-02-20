import BarChartOverview from '@/components/dashboard/bar-metric-card';
import PieMetricCard from '@/components/dashboard/pie-metric-card';
import AccountingTable from '@/components/dashboard/accounting/table';
import ProductCard from '@/components/dashboard/accounting/inventory/products/product-card';
import { useState } from 'react';
import geishaImg from '@/assets/images/geisha.png';

const stockSummaryData = [
  {
    day: 'Electronics',
    value1: 45,
    value2: 30,
    value3: 59,
  },
  {
    day: 'Home & Garden',
    value1: 89,
    value2: 28,
    value3: 70,
  },
  {
    day: 'Fresh Produce',
    value1: 85,
    value2: 95,
    value3: 84,
  },
  {
    day: 'Frozen Items',
    value1: 18,
    value2: 12,
    value3: 88,
  },
  {
    day: 'Dairy Products',
    value1: 44,
    value2: 46,
    value3: 67,
  },
  {
    day: 'Stationery',
    value1: 91,
    value2: 39,
    value3: 96,
  },
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

// Pie chart data for Inventory Distribution & Total Value
const inventoryDistributionData = [
  {
    name: 'Electronics',
    value: 93,
    percentage: 31.0,
    totalValue: '$234',
    color: '#6366f1', // indigo-500
  },
  {
    name: 'Home & Garden',
    value: 85,
    percentage: 28.33,
    totalValue: '$45',
    color: '#22c55e', // green-500
  },
  {
    name: 'Fresh Produce',
    value: 53,
    percentage: 17.67,
    totalValue: '$34',
    color: '#f59e0b', // amber-500
  },
  {
    name: 'Dairy Products',
    value: 43,
    percentage: 14.33,
    totalValue: '$66',
    color: '#06b6d4', // cyan-500
  },
  {
    name: 'Stationery',
    value: 26,
    percentage: 8.67,
    totalValue: '$44',
    color: '#8b5cf6', // violet-500
  },
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

// Product data for the table (4 items only)
const productData = [
  {
    id: 1,
    img: geishaImg,
    sku: 'BILL-2001',
    itemName: 'Office Supplies Co',
    category: 'Office Supplies',
    currentStock: 25,
    unitCost: 1200.0,
    purchasePrice: 30000.0,
    status: 'In stock',
  },
  {
    id: 2,
    img: geishaImg,
    sku: 'BILL-2002',
    itemName: 'Tech Equipment Ltd',
    category: 'Electronics',
    currentStock: 12,
    unitCost: 850.0,
    purchasePrice: 10200.0,
    status: 'Low stock',
  },
  {
    id: 3,
    img: geishaImg,
    sku: 'BILL-2003',
    itemName: 'Garden Supplies Inc',
    category: 'Home & Garden',
    currentStock: 0,
    unitCost: 450.0,
    purchasePrice: 0.0,
    status: 'Out of stock',
  },
  {
    id: 4,
    img: geishaImg,
    sku: 'BILL-2004',
    itemName: 'Fresh Foods Co',
    category: 'Fresh Produce',
    currentStock: 67,
    unitCost: 125.0,
    purchasePrice: 8375.0,
    status: 'In stock',
  },
];

export default function InventoryReport() {
  // State for table selection
  const [selectedItems, setSelectedItems] = useState([]);

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
      setSelectedItems(productData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Table columns configuration (exact copy from inventory management)
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

  // Dropdown actions for each row
  const dropdownActions = [
    { key: 'edit', label: 'Edit' },
    { key: 'view', label: 'View' },
    { key: 'delete', label: 'Delete' },
  ];

  // Pagination data
  const paginationData = {
    page: 1,
    totalPages: 8,
    pageSize: 4,
    totalCount: 32,
  };

  const handleRowAction = (action, item) => {
    console.log(`Action ${action} on item:`, item);
  };
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-10 md:flex-row">
        <BarChartOverview
          title="Stock Summary"
          chartConfig={stockSummaryConfig}
          chartData={stockSummaryData}
          numberOfBars={3}
          showLegend={true}
          className={'w-full'}
        />

        <PieMetricCard
          title="Inventory Distribution & Total Value"
          chartConfig={inventoryDistributionConfig}
          chartData={inventoryDistributionData}
          className="max-w-lg"
        />
      </div>

      {/* Product Catalog Table */}
      <div className="w-full">
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
