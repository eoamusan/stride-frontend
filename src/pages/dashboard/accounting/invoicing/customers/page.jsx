import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import AddCustomerModal from '@/components/dashboard/accounting/invoicing/customers/add-customer';
import { Button } from '@/components/ui/button';
import { DownloadIcon, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import AccountingTable from '@/components/dashboard/accounting/table';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import CustomerService from '@/api/customer';
import { useUserStore } from '@/stores/user-store';

const tableColumns = [
  { key: 'name', label: 'Name' },
  { key: 'companyName', label: 'Company Name' },
  { key: 'email', label: 'Email' },
  { key: 'creditLimit', label: 'Credit Limit' },
  { key: 'balance', label: 'Balance' },
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
  // { key: 'create-charge', label: 'Create Charge' },
  // { key: 'make-inactive', label: 'Make inactive' },
  // { key: 'create-statement', label: 'Create Statement' },
  // { key: 'create-task', label: 'Create Task' },
];

export default function Customers() {
  const [isCreateCustomerOpen, setIsCreateCustomerOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const { activeBusiness } = useUserStore();
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState({
    page: 1,
    totalPages: 1,
    pageSize: 20,
    totalCount: 0,
  });
  const [analytics, setAnalytics] = useState({
    outstanding: 0,
    overDue: 0,
    dueThisWeek: 0,
    activeCustomers: 0,
  });
  const navigate = useNavigate();

  // Transform customer data to match table format
  const transformCustomerData = (customersData) => {
    return customersData.map((item) => {
      const customer = item.customer;
      const balance = item.balance || 0;

      return {
        id: customer.id || customer._id,
        name: customer.displayName,
        companyName: customer.companyName || '-',
        creditLimit: `${parseFloat(customer.creditLimit || 0).toLocaleString(
          'en-US',
          {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          }
        )}`,
        balance: `${parseFloat(balance).toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })}`,
        email: customer.email || '-',
        status: customer.status === 'ACTIVE' ? 'Active' : 'Inactive',
      };
    });
  };

  const customerData = transformCustomerData(customers);

  // Create metrics from analytics data
  const customerMetrics = [
    { title: 'Total Outstanding', value: analytics.outstanding },
    { title: 'Overdue', value: analytics.overDue },
    { title: 'Due This week', value: analytics.dueThisWeek },
    { title: 'Active Customers', value: analytics.activeCustomers },
  ];

  const handleCustomerTableAction = (action, customer) => {
    console.log('Customer action:', action, customer);

    switch (action) {
      case 'view':
        navigate(`/dashboard/accounting/invoicing/customers/${customer.id}`);
        break;
      case 'create-invoice':
        // Navigate to invoice creation with customer pre-selected
        navigate(
          `/dashboard/accounting/invoicing/create?customerId=${customer.id}`
        );
        break;
      default:
        console.log('Unknown action:', action);
    }
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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSelectedItems([]); // Clear selections when changing pages
  };

  useEffect(() => {
    if (activeBusiness) {
      // Fetch customer data based on businessId
      const fetchCustomerData = async () => {
        try {
          setIsLoading(true);
          const response = await CustomerService.fetch({
            page: currentPage,
            perPage: paginationData.pageSize,
          });
          // Extract customer data from the new response structure
          const responseData = response.data?.data || {};
          const customersData = responseData.customers || [];

          // Store the full customer data (includes customer, invoices, balance)
          setCustomers(customersData);

          // Update pagination data from API response
          setPaginationData({
            page: responseData.page || 1,
            totalPages: responseData.totalPages || 1,
            pageSize: responseData.limit || 20,
            totalCount: responseData.totalDocs || customersData.length,
          });

          // Fetch analytics data
          const analyticsRes = await CustomerService.analytics();
          console.log('Customer analytics data:', analyticsRes.data);
          setAnalytics(
            analyticsRes.data?.data || {
              outstanding: 0,
              overDue: 0,
              dueThisWeek: 0,
              activeCustomers: 0,
            }
          );
        } catch (error) {
          console.error('Error fetching customer data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCustomerData();
    }
  }, [
    activeBusiness,
    isCreateCustomerOpen,
    currentPage,
    paginationData.pageSize,
  ]);

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
            paginationData={paginationData}
            onPageChange={handlePageChange}
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
