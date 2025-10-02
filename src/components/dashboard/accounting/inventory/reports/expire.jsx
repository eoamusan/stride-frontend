import BarChartOverview from '@/components/dashboard/bar-metric-card';
import PieMetricCard from '@/components/dashboard/pie-metric-card';
import AccountingTable from '@/components/dashboard/accounting/table';
import { useState } from 'react';
import geishaImg from '@/assets/images/geisha.png';

// Damage & Loss Report data
const damageLossData = [
  {
    day: 'Jan 1-15',
    value1: 260,
    value2: 490,
    value3: 430,
    value4: 560,
  },
  {
    day: 'Jan 1-15',
    value1: 570,
    value2: 360,
    value3: 920,
    value4: 110,
  },
  {
    day: 'Jan 1-15',
    value1: 570,
    value2: 800,
    value3: 850,
    value4: 370,
  },
  {
    day: 'Jan 1-15',
    value1: 700,
    value2: 540,
    value3: 830,
    value4: 540,
  },
  {
    day: 'Jan 1-15',
    value1: 130,
    value2: 390,
    value3: 650,
    value4: 880,
  },
  {
    day: 'Jan 1-15',
    value1: 970,
    value2: 450,
    value3: 920,
    value4: 150,
  },
];

const damageLossConfig = {
  value1: {
    label: 'Damage',
    color: '#FF2C2C',
  },
  value2: {
    label: 'Expired',
    color: '#6FD195',
  },
  value3: {
    label: 'Theft',
    color: '#FFAE4C',
  },
  value4: {
    label: 'Others',
    color: '#07DBFA',
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

// Perishable items Expiry Report data based on the image
const perishableItemsData = [
  {
    id: 1,
    img: geishaImg,
    sku: 'GE-2001',
    itemName: 'Geisha',
    expiryDate: '2025-29-12',
    daysLeft: 25,
    valueAtRisk: 1200.0,
    status: 'Urgent',
  },
  {
    id: 2,
    img: geishaImg,
    sku: 'HBS-2001',
    itemName: 'Head Set',
    expiryDate: '2025-29-12',
    daysLeft: 25,
    valueAtRisk: 1200.0,
    status: 'Plan Sale',
  },
  {
    id: 3,
    img: geishaImg,
    sku: 'HBS-2001',
    itemName: 'Head Set',
    expiryDate: '2025-29-12',
    daysLeft: 25,
    valueAtRisk: 1200.0,
    status: 'Urgent',
  },
  {
    id: 4,
    img: geishaImg,
    sku: 'HBS-2001',
    itemName: 'Head Set',
    expiryDate: '2025-29-12',
    daysLeft: 25,
    valueAtRisk: 1200.0,
    status: 'Urgent',
  },
];

export default function ExpireReport() {
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
      setSelectedItems(perishableItemsData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Table columns configuration for Perishable items Expiry Report
  const perishableColumns = [
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
      key: 'expiryDate',
      label: 'Expiry Date',
    },
    {
      key: 'daysLeft',
      label: 'Days Left',
    },
    {
      key: 'valueAtRisk',
      label: 'Value at Risk',
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
          title="Damage & Loss Report"
          chartConfig={damageLossConfig}
          chartData={damageLossData}
          numberOfBars={4}
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

      {/* Perishable items Expiry Report Table */}
      <div>
        <AccountingTable
          title="Perishable items Expiry Report"
          data={perishableItemsData}
          columns={perishableColumns}
          searchFields={['sku', 'itemName']}
          searchPlaceholder="Search by SKU or name......."
          statusStyles={{
            Urgent: 'bg-red-100 text-red-800 hover:bg-red-100',
            'Plan Sale': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
            Safe: 'bg-green-100 text-green-800 hover:bg-green-100',
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
