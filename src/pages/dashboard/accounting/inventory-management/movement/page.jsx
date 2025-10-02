import RecordMovementForm from '@/components/dashboard/accounting/inventory/movement/record-movement-form';
import AccountingTable from '@/components/dashboard/accounting/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DownloadIcon, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import { useState } from 'react';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import { set } from 'zod';
import ViewMovementModal from '@/components/dashboard/accounting/inventory/movement/view-movement-modal';

// Movement history data based on the image
const movementData = [
  {
    id: 1,
    product: 'Office item',
    productImage: 'https://placehold.co/40',
    from: 'Warehouse A - Main Floor',
    to: 'Retail Floor - Front Section',
    quantity: 25,
    movedBy: 'John Doe',
    reason: 'Department Transfer',
    date: '2024-01-15',
    status: 'Completed',
  },
  {
    id: 2,
    product: 'Office item',
    productImage: 'https://placehold.co/40',
    from: 'Warehouse A - Main Floor',
    to: 'Retail Floor - Front Section',
    quantity: 25,
    movedBy: 'John Doe',
    reason: 'Expired Item Removal',
    date: '2024-01-15',
    status: 'Completed',
  },
];

// Table columns configuration
const movementColumns = [
  {
    key: 'productImage',
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
  { key: 'product', label: 'Product' },
  { key: 'from', label: 'From' },
  { key: 'to', label: 'To' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'movedBy', label: 'Moved by' },
  { key: 'reason', label: 'Reason' },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status' },
];

const paginationData = {
  page: 1,
  totalPages: 5,
  pageSize: 12,
  totalCount: 64,
};

const statusStyles = {
  Completed: 'bg-green-100 text-green-800 hover:bg-green-100',
  'In Progress': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  Pending: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  Cancelled: 'bg-red-100 text-red-800 hover:bg-red-100',
  Failed: 'bg-red-100 text-red-800 hover:bg-red-100',
};

export default function InventoryMovement() {
  const [openRecordMovementForm, setOpenRecordMovementForm] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openViewMovementModal, setOpenViewMovementModal] = useState(false);

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
      setSelectedItems(movementData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };
  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Inventory Movement</h1>
          <p className="text-sm text-[#7D7D7D]">
            Track transfers between locations, departments, and warehouses
          </p>
        </hgroup>

        <div className="flex space-x-4">
          <Button
            onClick={() => setOpenRecordMovementForm(true)}
            className={'h-10 rounded-2xl text-sm'}
          >
            <PlusCircleIcon className="size-4" />
            Record Movement
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
        <AccountingTable
          title="Adjustment History"
          data={movementData}
          columns={movementColumns}
          searchFields={['product', 'from', 'to', 'reason', 'movedBy']}
          searchPlaceholder="Search by SKU or name......."
          statusStyles={statusStyles}
          paginationData={paginationData}
          dropdownActions={[
            { key: 'view', label: 'View' },
            { key: 'edit', label: 'Edit' },
            { key: 'delete', label: 'Delete' },
          ]}
          selectedItems={selectedItems}
          handleSelectItem={handleSelectItem}
          handleSelectAll={handleSelectAll}
          onRowAction={(action, item) => {
            console.log(`Action: ${action}`, item);
            switch (action) {
              case 'view':
                setOpenViewMovementModal(true);
                break;
            }
          }}
        />
      </div>

      <RecordMovementForm
        open={openRecordMovementForm}
        onOpenChange={setOpenRecordMovementForm}
        onMovementRecorded={() => {
          setOpenRecordMovementForm(false);
          setOpenSuccessModal(true);
        }}
      />

      <SuccessModal
        open={openSuccessModal}
        onOpenChange={setOpenSuccessModal}
        title="Movement Recorded"
        description="The inventory movement has been successfully recorded."
        backText={'Back'}
      />

      <ViewMovementModal
        open={openViewMovementModal}
        onOpenChange={setOpenViewMovementModal}
      />
    </div>
  );
}
