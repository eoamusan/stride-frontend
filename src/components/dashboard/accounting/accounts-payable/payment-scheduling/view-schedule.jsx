import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Building2Icon, CreditCardIcon } from 'lucide-react';

export default function ViewScheduleModal({ open, onOpenChange, paymentData }) {
  // Default data if none provided -- For test
  const defaultData = {
    id: 'Pay-001',
    vendor: 'JJ Solutions',
    amount: '$23,000',
    status: 'Scheduled',
    scheduledDate: '12/23/2025',
    paymentId: 'PAY-001',
    invoiceReference: 'INV-2025-002',
    paymentMethod: 'Bank Transfer',
    vendorName: 'JJ Solution',
    timeline: {
      status: 'Payment Scheduled',
      description: 'Created for processing on 12/23/2025',
    },
  };

  const data = paymentData || defaultData;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[90%] max-w-4xl overflow-y-auto p-8 sm:max-w-4xl">
        {/* Header */}

        <div className="mb-4 flex gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#254C00] text-white">
            <CreditCardIcon className="size-4" />
          </div>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            Payment Details
          </DialogTitle>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Top Section - Payment Overview */}
          <div className="flex items-start justify-between rounded-xl border border-dashed p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="bg-primary/10 w-fit rounded-full p-2.5">
                  <Building2Icon className="text-primary size-5" />
                </div>
                <div>
                  <h2 className="text-primary text-base font-semibold">
                    {data.id}
                  </h2>
                  <p className="text-primary text-sm">
                    Payment to {data.vendor}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-primary text-base font-semibold">Amount</p>
                <p className="text-primary text-sm">{data.amount}</p>
              </div>
            </div>

            <div className="space-y-8 text-right">
              <Badge
                variant="secondary"
                className="bg-primary/20 text-primary rounded-xl px-4 py-2 text-sm font-semibold"
              >
                {data.status}
              </Badge>

              <div>
                <p className="text-primary text-base font-semibold">
                  Scheduled Date
                </p>
                <p className="text-primary text-sm">{data.scheduledDate}</p>
              </div>
            </div>
          </div>

          {/* Information Sections */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-4">
            {/* Payment Information */}
            <div className="lg:col-span-2">
              <h3 className="mb-6 text-lg font-semibold">
                Payment Information:
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-zinc-600">Payment ID:</span>
                  <span className="font-medium">{data.paymentId}</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-zinc-600">Invoice Reference:</span>
                  <span className="font-medium">{data.invoiceReference}</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-zinc-600">Payment Method:</span>
                  <span className="font-medium">{data.paymentMethod}</span>
                </div>
              </div>
            </div>

            {/* Vendor Information */}
            <div className="lg:col-span-2 lg:col-start-4">
              <h3 className="mb-6 text-lg font-semibold">Vendor Information</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-zinc-600">Vendor Name:</span>
                  <span className="font-medium">{data.vendorName}</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-zinc-600">Payment Status:</span>
                  <Badge
                    variant="secondary"
                    className="bg-primary/20 text-primary rounded-xl px-4 py-2 text-sm font-semibold"
                  >
                    {data.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-zinc-600">Scheduled Date:</span>
                  <span className="font-medium">{data.scheduledDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Timeline */}
          <div className="mt-4">
            <h3 className="mb-4 text-lg font-semibold">Payment Timeline</h3>
            <div className="flex items-start gap-2.5">
              <div className="bg-primary/10 rounded-full p-1.5">
                <CalendarIcon className="text-primary size-4" />
              </div>
              <div>
                <h4 className="font-medium">{data.timeline.status}</h4>
                <p className="text-sm text-zinc-600">
                  {data.timeline.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-4 flex justify-end gap-4 px-6 py-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange?.(false)}
            className="h-10 min-w-36.75 rounded-2xl text-sm"
          >
            Close
          </Button>
          <Button
            variant="outline"
            className="h-10 min-w-36.75 rounded-2xl text-sm"
          >
            Execute Now
          </Button>
          <Button className="h-10 min-w-36.75 rounded-2xl text-sm">
            View Invoice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
