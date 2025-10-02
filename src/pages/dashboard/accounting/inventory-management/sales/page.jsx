import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  ChevronDownIcon,
  DownloadIcon,
  PlusCircleIcon,
  SettingsIcon,
} from 'lucide-react';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import SimpleAreaMetricCard from '@/components/dashboard/simple-area-metric-card';
import ListCard from '@/components/dashboard/accounting/accounts-payable/reports/report-lists-card';
import AccountingTable from '@/components/dashboard/accounting/table';
import ProductCard from '@/components/dashboard/accounting/inventory/products/product-card';
import RecordSaleForm from '@/components/dashboard/accounting/inventory/sales/record-sale-form';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import ViewSaleModal from '@/components/dashboard/accounting/inventory/sales/view-sale-details';

const salesMetrics = [
  {
    title: 'Total Sales',
    value: '$343.00',
  },
  {
    title: 'Transactions',
    value: '20',
  },
  {
    title: 'Avg sale value',
    value: '$156.23',
  },
  {
    title: 'Pending Sales',
    value: '3',
  },
];

const monthlyTrendsData = [
  { date: '2024-01-01', value: 70000 },
  { date: '2024-02-01', value: 18000 },
  { date: '2024-03-01', value: 32000 },
  { date: '2024-04-01', value: 20000 },
  { date: '2024-05-01', value: 41000 },
  { date: '2024-06-01', value: 12000 },
  { date: '2024-07-01', value: 57000 },
  { date: '2024-08-01', value: 15000 },
  { date: '2024-09-01', value: 57000 },
  { date: '2024-10-01', value: 52000 },
  { date: '2024-11-01', value: 95000 },
  { date: '2024-12-01', value: 42000 },
];
const chartConfig = [
  {
    dataKey: 'value',
    color: '#6366F1',
  },
];

const topSellingProducts = [
  {
    period: 'Geisha',
    invoiceCount: 43,
    amount: '$23,000',
    percentage: '+4.4%',
    color: 'bg-green-500',
  },
  {
    period: 'Headset',
    invoiceCount: 24,
    amount: '$20,000',
    percentage: '-44.4%',
    color: 'bg-green-500',
  },
  {
    period: 'Bournvita',
    invoiceCount: 22,
    amount: '$67,000',
    percentage: '-66.4%',
    color: 'bg-green-500',
  },
  {
    period: 'Titus',
    invoiceCount: 22,
    amount: '$53,000',
    percentage: '+6.4%',
    color: 'bg-green-500',
  },
  {
    period: 'Pen',
    invoiceCount: 22,
    amount: '$93,000',
    percentage: '+8.4%',
    color: 'bg-green-500',
  },
  {
    period: 'Cards',
    invoiceCount: 22,
    amount: '$13,000',
    percentage: '+7.4%',
    color: 'bg-green-500',
  },
  {
    period: 'Chair',
    invoiceCount: 22,
    amount: '$83,000',
    percentage: '+6.4%',
    color: 'bg-green-500',
  },
];

const productData = [
  {
    id: 1,
    img: 'https://placehold.co/100',
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
    img: 'https://placehold.co/100',
    sku: 'BILL-2001',
    itemName: 'Office Supplies Co',
    category: 'Office Supplies',
    currentStock: 25,
    unitCost: 1200.0,
    purchasePrice: 30000.0,
    status: 'In stock',
  },
  {
    id: 3,
    img: 'https://placehold.co/100',
    sku: 'BILL-2001',
    itemName: 'Office Supplies Co',
    category: 'Office Supplies',
    currentStock: 25,
    unitCost: 1200.0,
    purchasePrice: 30000.0,
    status: 'In stock',
  },
  {
    id: 4,
    img: 'https://placehold.co/100',
    sku: 'BILL-2001',
    itemName: 'Office Supplies Co',
    category: 'Office Supplies',
    currentStock: 25,
    unitCost: 1200.0,
    purchasePrice: 30000.0,
    status: 'In stock',
  },
  {
    id: 5,
    img: 'https://placehold.co/100',
    sku: 'BILL-2001',
    itemName: 'Office Supplies Co',
    category: 'Office Supplies',
    currentStock: 25,
    unitCost: 1200.0,
    purchasePrice: 30000.0,
    status: 'In stock',
  },
  {
    id: 6,
    img: 'https://placehold.co/100',
    sku: 'BILL-2001',
    itemName: 'Office Supplies Co',
    category: 'Office Supplies',
    currentStock: 25,
    unitCost: 1200.0,
    purchasePrice: 30000.0,
    status: 'In stock',
  },
  {
    id: 7,
    img: 'https://placehold.co/100',
    sku: 'BILL-2001',
    itemName: 'Office Supplies Co',
    category: 'Office Supplies',
    currentStock: 25,
    unitCost: 1200.0,
    purchasePrice: 30000.0,
    status: 'In stock',
  },
];

export default function Sales() {
  const [dateFilter, setDateFilter] = useState();
  const [openRecordSaleForm, setOpenRecordSaleForm] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openViewSale, setOpenViewSale] = useState(false);

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

  // Table columns configuration
  const tableColumns = [
    {
      key: 'img',
      label: 'IMG',
      render: (value) => (
        <div className="bg-muted-foreground flex h-10 w-10 items-center justify-center rounded">
          <img
            src={value}
            alt="Product"
            className="h-8 w-8 rounded object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div className="hidden h-8 w-8 rounded bg-amber-100"></div>
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
    totalPages: 6,
    pageSize: 12,
    totalCount: 64,
  };

  const handleRowAction = (action, item) => {
    console.log(`Action ${action} on item:`, item);

    // Implement row action logic here
    switch (action) {
      case 'view':
        setOpenViewSale(true);
        break;
    }
  };

  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Sales</h1>
          <p className="text-sm text-[#7D7D7D]">
            Connect inventory to sales records and track stock reductions
            automatically
          </p>
        </hgroup>

        <div className="flex space-x-4">
          <Button
            onClick={() => setOpenRecordSaleForm(true)}
            className={'h-10 rounded-2xl text-sm'}
          >
            <PlusCircleIcon className="size-4" />
            Record Sale
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`h-10 rounded-2xl pl-3 text-left font-normal`}
              >
                {dateFilter ? (
                  format(dateFilter, 'PPP')
                ) : (
                  <span>Select date</span>
                )}
                <ChevronDownIcon className="ml-auto h-4 w-4 opacity-90" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full min-w-80 p-0" align="start">
              <Calendar
                className={'w-full'}
                mode="single"
                defaultMonth={dateFilter}
                numberOfMonths={2}
                selected={dateFilter}
                onSelect={setDateFilter}
              />
            </PopoverContent>
          </Popover>
          <Button size={'icon'} className={'size-10'} variant={'outline'}>
            <DownloadIcon size={16} />
          </Button>

          <Button size={'icon'} className={'size-10'} variant={'outline'}>
            <SettingsIcon size={16} />
          </Button>
        </div>
      </div>
      <div className="mt-10">
        <Metrics metrics={salesMetrics} />

        <div className="mt-10 flex gap-10 max-sm:flex-col">
          <div className="w-full">
            <SimpleAreaMetricCard
              title="Monthly Payment Trends"
              chartData={monthlyTrendsData}
              chartConfig={chartConfig}
            />
          </div>
          <div className="w-full max-w-xs">
            <ListCard title="Top Selling Products" items={topSellingProducts} />
          </div>
        </div>

        <div className="my-10">
          <AccountingTable
            title="Recent Sales"
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

      <RecordSaleForm
        open={openRecordSaleForm}
        onOpenChange={setOpenRecordSaleForm}
        onSuccess={() => setOpenSuccessModal(true)}
      />

      <SuccessModal
        open={openSuccessModal}
        onOpenChange={setOpenSuccessModal}
        title={'Sale Recorded Successfully'}
        description={"You've successfully made a sale"}
        backText={'Back'}
        nextText={'Generate Receipt'}
        handleNext={() => {}}
      />

      <ViewSaleModal open={openViewSale} onOpenChange={setOpenViewSale} />
    </div>
  );
}
