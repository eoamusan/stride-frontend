import { useState } from 'react';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import AccountingTable from '@/components/dashboard/accounting/table';
import MakeAdjustmentForm from '@/components/dashboard/accounting/inventory/make-adjustment-form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DownloadIcon,
  PlusCircleIcon,
  SettingsIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  FileTextIcon,
} from 'lucide-react';

const stockMetrics = [
  { title: 'Total Adjustments', value: '34' },
  {
    title: 'Increases',
    value: '20',
  },
  {
    title: 'Decreases',
    value: '14',
  },
  {
    title: 'Documents',
    value: '3',
  },
];

const adjustmentData = [
  {
    id: 1,
    date: '1/15/2024',
    sku: 'FP001',
    product: 'Fresh Apples',
    adjustment: 'Decrease',
    stockChange: '30 → 20',
    reason: 'Expiration',
    performedBy: 'John Doe',
    document: 'View',
  },
  {
    id: 2,
    date: '1/15/2024',
    sku: 'FP001',
    product: 'Fresh Apples',
    adjustment: 'Increase',
    stockChange: '20 → 30',
    reason: 'Expiration',
    performedBy: 'John Doe',
    document: 'None',
  },
];

const adjustmentColumns = [
  { key: 'date', label: 'Date' },
  { key: 'sku', label: 'SKU' },
  { key: 'product', label: 'Product' },
  {
    key: 'adjustment',
    label: 'Adjustment',
    render: (value) => (
      <Badge
        className={
          value === 'Increase'
            ? 'bg-[#24A959]/10 text-[#24A959]'
            : 'bg-[#EF4444]/10 text-[#EF4444]'
        }
      >
        {value === 'Increase' ? (
          <>
            <ArrowUpIcon className="mr-1 h-3 w-3" />
            {value}
          </>
        ) : (
          <>
            <ArrowDownIcon className="mr-1 h-3 w-3" />
            {value}
          </>
        )}
      </Badge>
    ),
  },
  {
    key: 'stockChange',
    label: 'Stock Change',
    render: (value) => <span className="font-mono text-sm">{value}</span>,
  },
  { key: 'reason', label: 'Reason' },
  { key: 'performedBy', label: 'Performed By' },
  {
    key: 'document',
    label: 'Document',
    render: (value) =>
      value === 'View' ? (
        <Button variant="ghost" size="sm">
          <FileTextIcon className="h-4 w-4" />
          View
        </Button>
      ) : (
        <span className="pl-2">{value}</span>
      ),
  },
];

const paginationData = {
  page: 1,
  totalPages: 5,
  pageSize: 12,
  totalCount: 64,
};

export default function StockAdjustment() {
  const [openAddProductForm, setOpenAddProductForm] = useState(false);

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
      setSelectedItems(adjustmentData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };
  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Stock Adjustment</h1>
          <p className="text-sm text-[#7D7D7D]">
            Update inventory quantities and track stock changes
          </p>
        </hgroup>

        <div className="flex space-x-4">
          <Button
            onClick={() => setOpenAddProductForm(true)}
            className={'h-10 rounded-2xl text-sm'}
          >
            <PlusCircleIcon className="size-4" />
            Make Adjustment
          </Button>
          <Button size={'icon'} className={'size-10'} variant={'outline'}>
            <DownloadIcon size={16} />
          </Button>

          <Button size={'icon'} className={'size-10'} variant={'outline'}>
            <SettingsIcon size={16} />
          </Button>
        </div>
      </div>
      <div className="mt-10">
        <Metrics metrics={stockMetrics} />
        <AccountingTable
          className="mt-10"
          title="Adjustment History"
          data={adjustmentData}
          columns={adjustmentColumns}
          searchFields={['sku', 'product', 'reason', 'performedBy']}
          searchPlaceholder="Search by SKU or name......."
          paginationData={paginationData}
          dropdownActions={[
            { key: 'edit', label: 'Edit Adjustment' },
            { key: 'delete', label: 'Delete Adjustment' },
            { key: 'duplicate', label: 'Duplicate' },
          ]}
          selectedItems={selectedItems}
          handleSelectItem={handleSelectItem}
          handleSelectAll={handleSelectAll}
          onRowAction={(action, item) => {
            console.log(`Action: ${action}`, item);
          }}
        />
      </div>

      {/* Make Adjustment Form Modal */}
      <MakeAdjustmentForm
        open={openAddProductForm}
        onOpenChange={setOpenAddProductForm}
      />
    </div>
  );
}
