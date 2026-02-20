import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DownloadIcon, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import AddCustomerModal from '@/components/dashboard/accounting/invoicing/customers/add-customer';
import AccountingTable from '@/components/dashboard/accounting/table';
import CustomerService from '@/api/customer';
import { useUserStore } from '@/stores/user-store';

export default function Customers() {
  const navigate = useNavigate();
  const { activeBusiness } = useUserStore();
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateCustomerOpen, setIsCreateCustomerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [customerPaginationData, setCustomerPaginationData] = useState({
    page: 1,
    totalPages: 1,
    pageSize: 50,
    totalCount: 0,
  });
  // State for column visibility
  const [columns, setColumns] = useState({
    number: true,
    type: true,
    detailType: true,
    currency: true,
    bankBalance: true,
  });

  // State for other settings
  const [includeInactive, setIncludeInactive] = useState(false);
  const [showAccountTypeBadges, setShowAccountTypeBadges] = useState(true);
  const [pageSize, setPageSize] = useState('50');
  const [tableDensity, setTableDensity] = useState('Cozy');
  const [selectedItems, setSelectedItems] = useState([]);

  // Handler functions
  const handleToggleCreateCustomer = () => {
    setIsCreateCustomerOpen(true);
  };

  const onDownloadFormats = (format, checked) => {
    console.log(`Download format ${format} changed to:`, checked);
    // Implement download logic here
  };

  const onColumnsChange = (columnName, checked) => {
    setColumns((prev) => ({
      ...prev,
      [columnName]: checked,
    }));
  };

  const onIncludeInactiveChange = (checked) => {
    setIncludeInactive(checked);
  };

  const onShowAccountTypeBadgesChange = (checked) => {
    setShowAccountTypeBadges(checked);
  };

  const onPageSizeChange = (value) => {
    setPageSize(value);
  };

  const onTableDensityChange = (value) => {
    setTableDensity(value);
  };

  const handleCustomerTableAction = (action, customer) => {
    console.log('Customer action:', action, customer);

    switch (action) {
      case 'view':
        navigate(
          `/dashboard/accounting/accounts-receivable/customers/${customer.id}`
        );
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
    console.log(checked);
    if (checked) {
      setSelectedItems(customers.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Pagination handler
  const handlePageChange = (newPage) => {
    console.log('Page changed to:', newPage);
    setCurrentPage(newPage);
  };

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      if (!activeBusiness?._id) return;

      try {
        setIsLoading(true);
        const response = await CustomerService.fetch({
          page: currentPage,
          perPage: parseInt(pageSize),
        });

        console.log('Customers response:', response.data);

        const customersData = response.data?.data?.customers || [];
        const pagination = response.data?.data || {};

        // Transform customer data - response is array of {customer, invoices, balance}
        const transformedCustomers = customersData.map((item) => {
          const customer = item.customer;
          const balance = item.balance || 0;

          return {
            id: customer._id,
            name:
              customer.displayName ||
              `${customer.firstName} ${customer.lastName}`,
            companyName: customer.companyName || '-',
            creditLimit: `${parseFloat(
              customer.creditLimit || 0
            ).toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}`,
            balance: `${parseFloat(balance).toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}`,
            dueDate: customer.dueDate
              ? new Date(customer.dueDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : '-',
            status: customer.status === 'ACTIVE' ? 'Active' : 'Inactive',
          };
        });

        setCustomers(transformedCustomers);
        setCustomerPaginationData({
          page: pagination.page || currentPage,
          totalPages: pagination.totalPages || 1,
          pageSize: pagination.limit || parseInt(pageSize),
          totalCount: pagination.totalDocs || customersData.length,
        });
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [activeBusiness?._id, currentPage, pageSize]);

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
    // { key: 'create-charge', label: 'Create Charge' },
    // { key: 'make-inactive', label: 'Make inactive' },
    // { key: 'create-statement', label: 'Create Statement' },
    // { key: 'create-task', label: 'Create Task' },
  ];

  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Customer Management</h1>
          <p className="text-sm text-[#7D7D7D]">
            Manage your accounts receivable
          </p>
        </hgroup>

        <div className="flex space-x-4">
          <Button
            onClick={handleToggleCreateCustomer}
            className={'h-10 rounded-2xl text-sm'}
          >
            <PlusCircleIcon className="size-4" />
            Add Customer
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={'icon'} className={'size-10'} variant={'outline'}>
                <DownloadIcon size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-11 min-w-24 text-xs" align="end">
              <DropdownMenuCheckboxItem
                onCheckedChange={(checked) => onDownloadFormats('pdf', checked)}
              >
                Pdf
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onCheckedChange={(checked) =>
                  onDownloadFormats('excel', checked)
                }
              >
                Excel
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onCheckedChange={(checked) => onDownloadFormats('csv', checked)}
              >
                csv**
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={'icon'} className={'size-10'} variant={'outline'}>
                <SettingsIcon size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 text-xs" align="end">
              <DropdownMenuLabel>Columns</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={columns.number}
                onCheckedChange={(checked) =>
                  onColumnsChange('number', checked)
                }
              >
                Number
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columns.type}
                onCheckedChange={(checked) => onColumnsChange('type', checked)}
              >
                Type
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columns.detailType}
                onCheckedChange={(checked) =>
                  onColumnsChange('detailType', checked)
                }
              >
                Detail type
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columns.currency}
                onCheckedChange={(checked) =>
                  onColumnsChange('currency', checked)
                }
              >
                Currency
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columns.bankBalance}
                onCheckedChange={(checked) =>
                  onColumnsChange('bankBalance', checked)
                }
              >
                Bank balance
              </DropdownMenuCheckboxItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Others</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={includeInactive}
                onCheckedChange={onIncludeInactiveChange}
              >
                Include inactive
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showAccountTypeBadges}
                onCheckedChange={onShowAccountTypeBadgesChange}
              >
                Show account type badges
              </DropdownMenuCheckboxItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Page sizes</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={pageSize}
                onValueChange={onPageSizeChange}
              >
                <DropdownMenuRadioItem value="50">50</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="75">75</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="100">100</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="200">200</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="300">300</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Table Density</DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={tableDensity}
                onValueChange={onTableDensityChange}
              >
                <DropdownMenuRadioItem value="Cozy">Cozy</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Compact">
                  Compact
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AccountingTable
        className="mt-10"
        title={'Customer Management'}
        data={customers}
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
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />

      <AddCustomerModal
        open={isCreateCustomerOpen}
        onOpenChange={setIsCreateCustomerOpen}
      />
    </div>
  );
}
