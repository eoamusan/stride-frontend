import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import { Button } from '@/components/ui/button';
import { DownloadIcon, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import { useState } from 'react';

const vendorMetrics = [
  {
    title: 'Total Vendors',
    value: '75',
  },
  {
    title: 'Active',
    value: 64,
  },
  {
    title: 'Pending',
    value: 64,
  },
  {
    title: 'Total Spent',
    value: '$12,000',
  },
];

export default function VendorsExpenses() {
  const [openAddVendor, setOpenAddVendor] = useState(false);
  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Vendors</h1>
          <p className="text-sm text-[#7D7D7D]">
            Manage your vendor relationships
          </p>
        </hgroup>

        <div className="flex space-x-4">
          <Button
            onClick={() => setOpenAddVendor(true)}
            className={'h-10 rounded-2xl text-sm'}
          >
            <PlusCircleIcon className="size-4" />
            Add Vendor
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
        <Metrics metrics={vendorMetrics} />

        
      </div>
    </div>
  );
}
