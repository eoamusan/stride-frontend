import BarChartOverview from '@/components/dashboard/bar-metric-card';
import PieMetricCard from '@/components/dashboard/pie-metric-card';
import AccountingTable from '@/components/dashboard/accounting/table';
import { useState } from 'react';
import geishaImg from '@/assets/images/geisha.png';

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

// Recent Sales data based on the image
const recentSalesData = [
  {
    id: 1,
    img: geishaImg,
    salesId: '#002',
    product: 'Geisha',
    customer: 'John Smith',
    quantity: 25,
    unitPrice: 233,
    total: 499,
    payment: 'Credit card',
    date: '2024-01-15',
    status: 'Completed',
  },
  {
    id: 2,
    img: geishaImg,
    salesId: '#003',
    product: 'Blueband',
    customer: 'Smith Ben',
    quantity: 2,
    unitPrice: 3,
    total: 33,
    payment: 'Cash',
    date: '2024-01-15',
    status: 'Refunded',
  },
  {
    id: 3,
    img: geishaImg,
    salesId: '#004',
    product: 'Bournvita',
    customer: 'Adeola Oye',
    quantity: 2,
    unitPrice: 3,
    total: 33,
    payment: 'Bank Transfer',
    date: '2024-01-15',
    status: 'Refunded',
  },
  {
    id: 4,
    img: geishaImg,
    salesId: '#005',
    product: 'Indomie',
    customer: 'Niyi Adeniyi',
    quantity: 2,
    unitPrice: 3,
    total: 33,
    payment: 'Debit Card',
    date: '2024-01-15',
    status: 'Refunded',
  },
];

export default function SalesReport() {
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
      setSelectedItems(recentSalesData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Table columns configuration for Recent Sales
  const salesColumns = [
    {
      key: 'img',
      label: '',
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
      key: 'salesId',
      label: 'Sales ID',
      className: 'font-medium',
    },
    {
      key: 'product',
      label: 'Product',
    },
    {
      key: 'customer',
      label: 'Customer',
    },
    {
      key: 'quantity',
      label: 'Quantity',
    },
    {
      key: 'unitPrice',
      label: 'Unit price',
      render: (value) => `$${value}`,
    },
    {
      key: 'total',
      label: 'Total',
      render: (value) => `$${value}`,
    },
    {
      key: 'payment',
      label: 'Payment',
    },
    {
      key: 'date',
      label: 'Date',
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
    totalPages: 6,
    pageSize: 12,
    totalCount: 64,
  };

  const handleRowAction = (action, item) => {
    console.log(`Action ${action} on item:`, item);
  };
  return (
    <div className="mb-10 space-y-10">
      <div className="flex flex-col gap-10 md:flex-row">
        <BarChartOverview
          title="Sales & Stock Trend"
          chartConfig={salesStockTrendConfig}
          chartData={salesStockTrendData}
          numberOfBars={2}
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

      {/* Recent Sales Table */}
      <div>
        <AccountingTable
          title="Recent Sales"
          data={recentSalesData}
          columns={salesColumns}
          searchFields={['salesId', 'product', 'customer']}
          searchPlaceholder="Search by product, customer......."
          statusStyles={{
            Completed: 'bg-green-100 text-green-800 hover:bg-green-100',
            Refunded: 'bg-red-100 text-red-800 hover:bg-red-100',
            Pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
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
