import BarChartOverview from '@/components/dashboard/bar-metric-card';
import AccountingTable from '@/components/dashboard/accounting/table';
import { useState } from 'react';
import geishaImg from '@/assets/images/geisha.png';

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

// Sales & Stock Trend data
const salesStockTrendData = [
  {
    day: 'Jan',
    value1: 560,
    value2: 390,
  },
  {
    day: 'Feb',
    value1: 650,
    value2: 800,
  },
  {
    day: 'Mar',
    value1: 760,
    value2: 150,
  },
  {
    day: 'Apr',
    value1: 780,
    value2: 170,
  },
  {
    day: 'May',
    value1: 700,
    value2: 650,
  },
  {
    day: 'Jun',
    value1: 370,
    value2: 140,
  },
];

const salesStockTrendConfig = {
  value1: {
    label: 'Sales',
    color: '#7086FD',
  },
  value2: {
    label: 'Stock',
    color: '#6FD195',
  },
};

// Low Stock Items data based on the image
const lowStockItemsData = [
  {
    id: 1,
    img: geishaImg,
    sku: 'HBS-2001',
    itemName: 'Head Set',
    category: 'Office Supplies',
    currentStock: 25,
    suppliers: 'JJ Solutions',
    lastOrder: '2025-22-12',
    status: 'High',
  },
  {
    id: 2,
    img: geishaImg,
    sku: 'HBS-2001',
    itemName: 'Head Set',
    category: 'Office Supplies',
    currentStock: 25,
    suppliers: 'JJ Solutions',
    lastOrder: '2025-22-12',
    status: 'Medium',
  },
  {
    id: 3,
    img: geishaImg,
    sku: 'GE-2001',
    itemName: 'Geisha',
    category: 'Office Supplies',
    currentStock: 25,
    suppliers: 'JJ Solutions',
    lastOrder: '2025-22-12',
    status: 'Low',
  },
];

export default function LowStockReport() {
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
      setSelectedItems(lowStockItemsData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Table columns configuration for Low Stock Items
  const lowStockColumns = [
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
      label: 'Item Name',
      className: 'font-medium',
    },
    {
      key: 'category',
      label: 'Category',
    },
    {
      key: 'currentStock',
      label: 'Current Stock',
      render: (value) => (
        <span className="font-medium text-[#EF4444]">{value}</span>
      ),
    },
    {
      key: 'suppliers',
      label: 'Suppliers',
    },
    {
      key: 'lastOrder',
      label: 'Last Order',
    },
    {
      key: 'status',
      label: 'Urgency',
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
    totalPages: 3,
    pageSize: 12,
    totalCount: 36,
  };

  const handleRowAction = (action, item) => {
    console.log(`Action ${action} on item:`, item);
  };
  return (
    <div className="space-y-10">
      <div className="grid gap-10 md:grid-cols-2">
        <BarChartOverview
          title="Stock Summary"
          chartConfig={stockSummaryConfig}
          chartData={stockSummaryData}
          numberOfBars={3}
          showLegend={true}
          className={'w-full'}
        />

        <BarChartOverview
          title="Sales & Stock Trend"
          chartConfig={salesStockTrendConfig}
          chartData={salesStockTrendData}
          numberOfBars={2}
          showLegend={true}
          className={'w-full'}
        />
      </div>

      {/* Low Stock Items Table */}
      <div className="mb-10 w-full">
        <AccountingTable
          title="Low Stock Items"
          data={lowStockItemsData}
          columns={lowStockColumns}
          searchFields={['sku', 'itemName', 'category']}
          searchPlaceholder="Search by SKU or name......."
          statusStyles={{
            High: 'bg-red-100 text-red-800 hover:bg-red-100',
            Medium: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
            Low: 'bg-green-100 text-green-800 hover:bg-green-100',
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
