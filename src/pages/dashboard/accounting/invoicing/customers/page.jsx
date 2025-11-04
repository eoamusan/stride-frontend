import { useEffect, useState } from 'react';
import AddCustomerModal from '@/components/dashboard/accounting/invoicing/customers/add-customer';
import { Button } from '@/components/ui/button';
import { DownloadIcon, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import AccountingTable from '@/components/dashboard/accounting/table';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import CustomerService from '@/api/customer';
import { useUserStore } from '@/stores/user-store';
import { format } from 'date-fns';

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
  const [selectedItems, setSelectedItems] = useState([]);
  const { businessData } = useUserStore();
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Transform customer data to match table format
  const transformCustomerData = (customers) => {
    return customers.map((customer) => ({
      id: customer.id || customer._id,
      name: customer.displayName,
      companyName: customer.companyName || '-',
      creditLimit: customer.creditLimit
        ? `$${parseFloat(customer.creditLimit).toLocaleString()}`
        : '$0.00',
      balance: '$0.00', // You may need to calculate this from invoices
      dueDate: customer.dueDate
        ? format(new Date(customer.dueDate), 'MMM dd, yyyy')
        : '-',
      status: 'Active',
    }));
  };

  const customerData = transformCustomerData(customers);

  const handleCustomerTableAction = (action, customer) => {
    console.log('Customer action:', action, customer);
    // Handle different actions here
  };

  const handleSelectTableItem = (itemId, checked) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    }
  };

  const handleSelectAllItems = (checked) => {
    if (checked) {
      setSelectedItems(customerData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  useEffect(() => {
    if (businessData) {
      // Fetch customer data based on businessId
      const fetchCustomerData = async () => {
        try {
          setIsLoading(true);
          const response = await CustomerService.fetch();
          setCustomers(response.data?.data || []);
        } catch (error) {
          console.error('Error fetching customer data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCustomerData();
    }
  }, [businessData, isCreateCustomerOpen]);

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
            className={'h-10 rounded-2xl text-sm'}
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
          <AccountingTable
            title={'Customer Management'}
            data={customerData}
            columns={tableColumns}
            searchFields={['name', 'companyName', 'id']}
            searchPlaceholder="Search customers..."
            statusStyles={customerStatusStyles}
            dropdownActions={customerDropdownActions}
            paginationData={customerPaginationData}
            onRowAction={handleCustomerTableAction}
            selectedItems={selectedItems}
            handleSelectItem={handleSelectTableItem}
            handleSelectAll={handleSelectAllItems}
            isLoading={isLoading}
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
