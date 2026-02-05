import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Building2Icon, CreditCardIcon } from 'lucide-react';
import { format } from 'date-fns';

export default function ViewScheduleModal({ open, onOpenChange, paymentData }) {
  if (!paymentData) return null;

  // Transform API data for display
  const vendor = paymentData.vendorId;
  const vendorName =
    `${vendor?.firstName || ''} ${vendor?.lastName || ''}`.trim() || 'N/A';
  const invoiceReference = paymentData.invoiceId?.billNo || 'Manual Payment';
  const formattedAmount = `$${Number(paymentData.amount).toLocaleString('en-US')}`;
  const scheduledDate = paymentData.scheduledDate
    ? format(new Date(paymentData.scheduledDate), 'M/d/yyyy')
    : 'N/A';
  const createdDate = paymentData.createdAt
    ? format(new Date(paymentData.createdAt), 'MMM d, yyyy h:mm a')
    : 'N/A';
  const paymentMethod =
    paymentData.paymentMethod?.charAt(0).toUpperCase() +
      paymentData.paymentMethod?.slice(1) || 'N/A';

  // Determine status display
  const today = new Date();
  const scheduled = new Date(paymentData.scheduledDate);
  let statusDisplay = 'Pending';
  let statusColor = 'bg-orange-100 text-orange-800';

  if (paymentData.status === 'PENDING' && scheduled < today) {
    statusDisplay = 'Overdue';
    statusColor = 'bg-red-100 text-red-800';
  } else if (paymentData.status === 'PENDING') {
    statusDisplay = 'Scheduled';
    statusColor = 'bg-blue-100 text-blue-800';
  }

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
                    {/* {paymentData._id || paymentData.id} */}
                  </h2>
                  <p className="text-primary text-sm">
                    Payment to {vendorName}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-primary text-base font-semibold">Amount</p>
                <p className="text-primary text-sm">{formattedAmount}</p>
              </div>
            </div>

            <div className="space-y-8 text-right">
              <Badge
                variant="secondary"
                className={`${statusColor} rounded-xl px-4 py-2 text-sm font-semibold`}
              >
                {statusDisplay}
              </Badge>

              <div>
                <p className="text-primary text-base font-semibold">
                  Scheduled Date
                </p>
                <p className="text-primary text-sm">{scheduledDate}</p>
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
                  <span className="font-medium">
                    {paymentData._id || paymentData.id}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-zinc-600">Invoice Reference:</span>
                  <span className="font-medium">{invoiceReference}</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-zinc-600">Payment Method:</span>
                  <span className="font-medium">{paymentMethod}</span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-zinc-600">Priority:</span>
                  <span className="font-medium capitalize">
                    {paymentData.priority || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Vendor Information */}
            <div className="lg:col-span-2 lg:col-start-4">
              <h3 className="mb-6 text-lg font-semibold">Vendor Information</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-zinc-600">Vendor Name:</span>
                  <span className="font-medium">{vendorName}</span>
                </div>

                {vendor?.contact?.email && (
                  <div className="flex items-center justify-between py-2">
                    <span className="text-zinc-600">Email:</span>
                    <span className="font-medium">{vendor.contact.email}</span>
                  </div>
                )}

                <div className="flex items-center justify-between py-2">
                  <span className="text-zinc-600">Payment Status:</span>
                  <Badge
                    variant="secondary"
                    className={`${statusColor} rounded-xl px-4 py-2 text-sm font-semibold`}
                  >
                    {statusDisplay}
                  </Badge>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-zinc-600">Scheduled Date:</span>
                  <span className="font-medium">{scheduledDate}</span>
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
                <h4 className="font-medium">Payment {statusDisplay}</h4>
                <p className="text-sm text-zinc-600">
                  Created on {createdDate} for processing on {scheduledDate}
                </p>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {paymentData.notes && (
            <div className="mt-4">
              <h3 className="mb-4 text-lg font-semibold">Notes</h3>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-zinc-700">{paymentData.notes}</p>
              </div>
            </div>
          )}

          {paymentData.description && (
            <div className="mt-4">
              <h3 className="mb-4 text-lg font-semibold">Description</h3>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-zinc-700">
                  {paymentData.description}
                </p>
              </div>
            </div>
          )}
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
          {paymentData.status === 'PENDING' && (
            <Button
              variant="outline"
              className="h-10 min-w-36.75 rounded-2xl text-sm"
              onClick={() => {
                // TODO: Implement execute now functionality
                console.log(
                  'Execute payment:',
                  paymentData._id || paymentData.id
                );
              }}
            >
              Execute Now
            </Button>
          )}
          {paymentData.invoiceId && (
            <Button
              className="h-10 min-w-36.75 rounded-2xl text-sm"
              onClick={() => {
                // TODO: Implement view invoice functionality
                console.log(
                  'View invoice:',
                  paymentData.invoiceId._id || paymentData.invoiceId
                );
              }}
            >
              View Invoice
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
