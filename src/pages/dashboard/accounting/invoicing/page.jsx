import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import EmptyInvoice from '@/components/dashboard/accounting/invoicing/empty-state';
import CreateInvoice from '@/components/dashboard/accounting/invoicing/create-invoice';
import { Button } from '@/components/ui/button';
import { DownloadIcon, PlusCircle, SettingsIcon } from 'lucide-react';
import MetricCard from '@/components/dashboard/metric-card';
import InvoiceTable from '@/components/dashboard/accounting/invoicing/invoice-table';

const invoice = [''];
const invoiceStats = [
  {
    title: 'Total Invoices',
    unit: '',
  },
  {
    title: 'Total Amount',
    unit: '$',
  },
  {
    title: 'Outstanding Invoices',
    unit: '$',
  },
  {
    title: 'Unpaid Invoices',
    unit: '',
  },
  {
    title: 'Collection Rate',
    unit: '%',
  },
];

export default function Invoicing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [toggleCreateInvoice, setToggleCreateInvoice] = useState(false);

  // Check for create parameter on component mount
  useEffect(() => {
    const createParam = searchParams.get('create');
    if (createParam === 'true') {
      setToggleCreateInvoice(true);
    } else {
      setToggleCreateInvoice(false);
    }
  }, [searchParams]);

  const handleToggleCreateInvoice = () => {
    const newToggleState = !toggleCreateInvoice;
    setToggleCreateInvoice(newToggleState);

    // Update search params when toggleCreateInvoice changes
    if (newToggleState) {
      setSearchParams({ create: 'true' });
    } else {
      // Remove the create parameter when closing
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('create');
      setSearchParams(newSearchParams);
    }
  };

  if (toggleCreateInvoice) {
    return (
      <div className="my-4 min-h-screen">
        <CreateInvoice />
      </div>
    );
  }

  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Invoice Management</h1>
          <p className="text-sm text-[#7D7D7D]">
            Manage your accounts receivable
          </p>
        </hgroup>

        {invoice.length > 0 && (
          <div className="flex space-x-4">
            <Button
              onClick={handleToggleCreateInvoice}
              className={'h-10 rounded-2xl'}
            >
              <PlusCircle className="size-4" />
              Create Invoice
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
      {invoice.length === 0 ? (
        <EmptyInvoice onClick={handleToggleCreateInvoice} />
      ) : (
        <div>
          <div className="my-10 flex w-full flex-wrap gap-4">
            {invoiceStats.length > 0 &&
              invoiceStats.map((stat, index) => (
                <MetricCard
                  key={index}
                  className="w-full max-w-[259px]"
                  title={stat.title}
                  unit={stat.unit}
                  emptyState={true}
                  {...stat}
                />
              ))}
          </div>

          <InvoiceTable />
        </div>
      )}
    </div>
  );
}
