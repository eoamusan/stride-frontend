import PaymentMetrics from '@/components/dashboard/accounting/invoicing/payments/payment-metrics';
import PaymentTable from '@/components/dashboard/accounting/invoicing/payments/payment-table';
import { Button } from '@/components/ui/button';
import { DownloadIcon, SettingsIcon } from 'lucide-react';

const payments = [''];

export default function Payments() {
  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Payment Processing</h1>
          <p className="text-sm text-[#7D7D7D]">
            Record and track incoming payments
          </p>
        </hgroup>

        {payments.length > 0 && (
          <div className="flex space-x-4">
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
        <PaymentMetrics />

        <div className="mt-10">
          <PaymentTable />
        </div>
      </div>
    </div>
  );
}
