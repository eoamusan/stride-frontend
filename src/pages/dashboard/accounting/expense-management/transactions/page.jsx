import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon, DownloadIcon, SettingsIcon } from 'lucide-react';
import ExpenseForm from '@/components/dashboard/accounting/expense-mgmt/overview/expense-form';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import AccountingTable from '@/components/dashboard/accounting/table';

const expensesMetrics = [
  {
    title: 'Total Expenses',
    value: '$675',
  },
  {
    title: 'This Month',
    value: 64,
  },
  {
    title: 'Average Daily',
    value: 64,
  },
  {
    title: 'Categories',
    value: 10,
  },
];

// Transaction data from the image
const transactionData = [
  {
    id: 1,
    no: '0001',
    date: '1/10/2024',
    type: 'Expenses',
    payer: 'James Doe',
    category: 'Bank charges',
    total: '$15,400.00',
    status: 'Completed',
  },
  {
    id: 2,
    no: '0001',
    date: '1/10/2024',
    type: 'Expenses',
    payer: 'James Doe',
    category: 'Bank charges',
    total: '$15,400.00',
    status: 'Completed',
  },
];

export default function ExpenseTransactions() {
  const [openExpenseForm, setOpenExpenseForm] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Selection handlers
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(transactionData.map((item) => item.id));
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
    // Handle different actions here
  };
  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Expense Transactions</h1>
          <p className="text-sm text-[#7D7D7D]">
            Track and manage all your expenses
          </p>
        </hgroup>

        <div className="flex space-x-4">
          <Button
            onClick={() => setOpenExpenseForm(true)}
            className={'h-10 rounded-2xl text-sm'}
          >
            <PlusCircleIcon className="size-4" />
            Record Expense
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
        <Metrics metrics={expensesMetrics} />
        <AccountingTable
          title="Expenses Transaction"
          data={transactionData}
          columns={[
            { key: 'no', label: 'No' },
            { key: 'date', label: 'Date' },
            { key: 'type', label: 'Type' },
            { key: 'payer', label: 'Payer' },
            { key: 'category', label: 'Category' },
            { key: 'total', label: 'Total' },
          ]}
          searchFields={['no', 'payer', 'category', 'type']}
          searchPlaceholder="Search amount or category ......"
          selectedItems={selectedItems}
          handleSelectAll={handleSelectAll}
          handleSelectItem={handleSelectItem}
          onRowAction={handleRowAction}
          dropdownActions={[
            { key: 'view', label: 'View Details' },
            { key: 'edit', label: 'Edit' },
            { key: 'delete', label: 'Delete' },
          ]}
          paginationData={{
            page: currentPage,
            totalPages: 7,
            pageSize: 10,
            totalCount: transactionData.length,
          }}
          onPageChange={setCurrentPage}
        />
      </div>

      <ExpenseForm
        open={openExpenseForm}
        onOpenChange={setOpenExpenseForm}
        onSuccess={() => setOpenSuccessModal(true)}
      />
      <SuccessModal
        open={openSuccessModal}
        onOpenChange={setOpenSuccessModal}
        backText={'Back'}
        title={'Expense Recorded'}
        description={"You've successfully added an expense"}
      />
    </div>
  );
}
