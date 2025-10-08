import AddBillForm from '@/components/dashboard/accounting/expense-mgmt/bills/add-bill-form';
import ViewBills from '@/components/dashboard/accounting/expense-mgmt/bills/view-bills';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import AccountingTable from '@/components/dashboard/accounting/table';
import { Button } from '@/components/ui/button';
import { DownloadIcon, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import { useState } from 'react';

const billMetrics = [
  {
    title: 'Total Bills',
    value: '75',
  },
  {
    title: 'Pending',
    value: 64,
  },
  {
    title: 'Overdue',
    value: 64,
  },
  {
    title: 'Total Spent',
    value: '$12,000',
  },
];

// Bill data from the image
const billsData = [
  {
    id: 1,
    vendor: 'JJ Solutions',
    vendorInitials: 'JJ',
    billNumber: '0003',
    source: 'Software License',
    billNo: '0003',
    billDate: '1/10/2024',
    category: 'Utilities',
    dueDate: '1/10/2024',
    billAmount: '$2,500',
    status: 'Pending',
  },
  {
    id: 2,
    vendor: 'JJ Solutions',
    vendorInitials: 'JJ',
    billNumber: '0003',
    source: 'Software License',
    billNo: '0003',
    billDate: '1/10/2024',
    category: 'Utilities',
    dueDate: '1/10/2024',
    billAmount: '$2,500',
    status: 'Paid',
  },
  {
    id: 3,
    vendor: 'JJ Solutions',
    vendorInitials: 'JJ',
    billNumber: '0003',
    source: 'Software License',
    billNo: '0003',
    billDate: '1/10/2024',
    category: 'Utilities',
    dueDate: '1/10/2024',
    billAmount: '$2,500',
    status: 'Overdue',
  },
];

export default function Bills() {
  const [openAddBill, setOpenAddBill] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openViewBill, setOpenViewBill] = useState(false);
  const [editData, setEditData] = useState({});

  // Selection handlers
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(billsData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId, checked) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    }
  };

  // Row action handler
  const handleRowAction = (action, item) => {
    console.log('Action:', action, 'Item:', item);

    switch (action) {
      case 'view':
        setOpenViewBill(true);
        break;
      case 'edit':
        setEditData(() => ({ ...item }));
        setOpenAddBill(true);
        break;
    }
  };
  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Bills</h1>
          <p className="text-sm text-[#7D7D7D]">
            Track and manage your bills and payments
          </p>
        </hgroup>

        <div className="flex space-x-4">
          <Button
            onClick={() => {
              setEditData({});
              setOpenAddBill(true);
            }}
            className={'h-10 rounded-2xl text-sm'}
          >
            <PlusCircleIcon className="size-4" />
            Add Bill
          </Button>
          <Button size={'icon'} className={'size-10'} variant={'outline'}>
            <DownloadIcon size={16} />
          </Button>
          <Button size={'icon'} className={'size-10'} variant={'outline'}>
            <SettingsIcon size={16} />
          </Button>
        </div>
      </div>

      <div className="my-10 space-y-10">
        <Metrics metrics={billMetrics} />

        <AccountingTable
          title="Recent Bills"
          data={billsData}
          columns={[
            {
              key: 'vendor',
              label: 'Vendor',
              render: (value, item) => (
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium">
                    {item.vendorInitials}
                  </div>
                  <span>{value}</span>
                </div>
              ),
            },
            { key: 'billNumber', label: 'Bill#' },
            { key: 'source', label: 'Source' },
            { key: 'billNo', label: 'Bill NO' },
            { key: 'billDate', label: 'Bill Date' },
            { key: 'category', label: 'Category' },
            { key: 'dueDate', label: 'Due date' },
            { key: 'billAmount', label: 'Bill Amount' },
            { key: 'status', label: 'Status' },
          ]}
          searchFields={['vendor', 'source', 'category', 'billNumber']}
          searchPlaceholder="Search bills"
          selectedItems={selectedItems}
          handleSelectAll={handleSelectAll}
          handleSelectItem={handleSelectItem}
          onRowAction={handleRowAction}
          statusStyles={{
            Pending: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
            Paid: 'bg-green-100 text-green-800 hover:bg-green-100',
            Overdue: 'bg-red-100 text-red-800 hover:bg-red-100',
          }}
          dropdownActions={[
            { key: 'view', label: 'View Details' },
            { key: 'edit', label: 'Edit Bill' },
            { key: 'pay', label: 'Mark as Paid' },
            { key: 'delete', label: 'Delete' },
          ]}
          paginationData={{
            page: currentPage,
            totalPages: 10,
            pageSize: 10,
            totalCount: billsData.length,
          }}
          onPageChange={setCurrentPage}
        />
      </div>

      <AddBillForm
        open={openAddBill}
        onOpenChange={setOpenAddBill}
        onSuccess={() => setOpenSuccessModal(true)}
        initialData={editData}
      />
      <SuccessModal
        open={openSuccessModal}
        onOpenChange={setOpenSuccessModal}
        backText={'Back'}
        title={'Bill Added'}
        description={"You've successfully added a bill."}
      />

      <ViewBills open={openViewBill} onOpenChange={setOpenViewBill} />
    </div>
  );
}
