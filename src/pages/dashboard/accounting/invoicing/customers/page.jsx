import { useState } from 'react';
import AddCustomerModal from '@/components/dashboard/accounting/invoicing/customers/add-customer';
import CustomerMetrics from '@/components/dashboard/accounting/invoicing/customers/customer-metrics';
import CustomerTable from '@/components/dashboard/accounting/invoicing/customers/customer-table';
import { Button } from '@/components/ui/button';
import { DownloadIcon, PlusCircleIcon, SettingsIcon } from 'lucide-react';

const customers = [''];

export default function Customers() {
  const [isCreateCustomerOpen, setIsCreateCustomerOpen] = useState(false);
  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Customer Management</h1>
          <p className="text-sm text-[#7D7D7D]">
            Manage your customer accounts
          </p>
        </hgroup>

        {customers.length > 0 && (
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
        )}
      </div>

      <div className="mt-10">
        <CustomerMetrics />

        <div className="mt-10">
          <CustomerTable />
        </div>
      </div>

      <AddCustomerModal
        open={isCreateCustomerOpen}
        onOpenChange={setIsCreateCustomerOpen}
      />
    </div>
  );
}
