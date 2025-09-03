import { useState } from 'react';
import AddCustomerModal from '@/components/dashboard/accounting/invoicing/customers/add-customer';
import { Button } from '@/components/ui/button';
import { DownloadIcon, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import InvoicingTable from '@/components/dashboard/accounting/invoicing/table';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';

const customers = [''];
const customerData = [
  {
    id: 'CUST-1001',
    name: 'John Smith',
    companyName: 'ABC Corporation',
    creditLimit: '$50,000.00',
    balance: '$15,400.00',
    dueDate: 'Jul 20, 2024',
    status: 'Active',
  },
  {
    id: 'CUST-1002',
    name: 'Sarah Johnson',
    companyName: 'Tech Solutions Ltd',
    creditLimit: '$25,000.00',
    balance: '$8,750.00',
    dueDate: 'Aug 15, 2024',
    status: 'Active',
  },
  {
    id: 'CUST-1003',
    name: 'Michael Brown',
    companyName: 'Global Enterprises',
    creditLimit: '$100,000.00',
    balance: '$0.00',
    dueDate: '-',
    status: 'Inactive',
  },
  {
    id: 'CUST-1004',
    name: 'Emily Davis',
    companyName: 'Creative Agency Inc',
    creditLimit: '$30,000.00',
    balance: '$22,500.00',
    dueDate: 'Jun 30, 2024',
    status: 'Overdue',
  },
];
const tableColumns = [
  { key: 'name', label: 'Name' },
  { key: 'companyName', label: 'Company Name' },
  { key: 'creditLimit', label: 'Credit Limit' },
  { key: 'balance', label: 'Balance' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'status', label: 'Status' },
];
const customerStatusStyles = {
  Active: 'bg-green-100 text-green-800 hover:bg-green-100',
  Inactive: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  Overdue: 'bg-red-100 text-red-800 hover:bg-red-100',
};
const customerDropdownActions = [
  { key: 'view', label: 'View' },
  { key: 'create-invoice', label: 'Create Invoice' },
  { key: 'create-charge', label: 'Create Charge' },
  { key: 'make-inactive', label: 'Make inactive' },
  { key: 'create-statement', label: 'Create Statement' },
  { key: 'create-task', label: 'Create Task' },
];
const customerPaginationData = {
  page: 1,
  totalPages: 10,
  pageSize: 10,
  totalCount: 100,
};

const customerMetrics = [
  { title: 'Total Outstanding', value: '$264' },
  {
    title: 'Overdue',
    value: '$15,600',
  },
  {
    title: 'Due This week',
    value: '$64',
  },
  {
    title: 'Active Customers',
    value: '264',
  },
];

export default function Customers() {
  const [isCreateCustomerOpen, setIsCreateCustomerOpen] = useState(false);

  const handleCustomerTableAction = (action, customer) => {
    console.log('Customer action:', action, customer);
    // Handle different actions here
  };

  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Customer Management</h1>
          <p className="text-sm text-[#7D7D7D]">
            Manage your customer accounts
          </p>
        </hgroup>

        <div className="flex space-x-4">
          <Button
            onClick={() => setIsCreateCustomerOpen(true)}
            className={'h-10 rounded-2xl'}
          >
            <PlusCircleIcon className="size-4" />
            Add Customer
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
        <Metrics metrics={customerMetrics} />

        <div className="mt-10">
          <InvoicingTable
            title={'Customer Management'}
            data={customerData}
            columns={tableColumns}
            searchFields={['name', 'companyName', 'id']}
            searchPlaceholder="Search customers..."
            statusStyles={customerStatusStyles}
            dropdownActions={customerDropdownActions}
            paginationData={customerPaginationData}
            onRowAction={handleCustomerTableAction}
          />
        </div>
      </div>

      <AddCustomerModal
        open={isCreateCustomerOpen}
        onOpenChange={setIsCreateCustomerOpen}
      />
    </div>
  );
}
