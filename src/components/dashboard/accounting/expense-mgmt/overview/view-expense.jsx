import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BadgeDollarSignIcon, Building2Icon, DownloadIcon } from 'lucide-react';
import pdfIcon from '@/assets/icons/pdf-icon.svg';
import { format } from 'date-fns';

export default function ViewExpenseModal({
  open,
  onOpenChange,
  expense,
  isLoading,
}) {
  // Calculate total amount from category details
  const totalAmount = expense?.total || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-[#254C00]">
                <BadgeDollarSignIcon className="size-4 text-white" />
              </div>
              <div>
                <DialogTitle>Expense Details</DialogTitle>
                {!isLoading && (
                  <p className="mt-2 text-sm font-medium">{expense?.refNo}</p>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="mt-6 space-y-6">
            {/* Skeleton for Expense ID and Amount */}
            <div className="border-primary/20 rounded-lg border border-dashed p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <div className="space-y-2 text-right">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>

            {/* Skeleton for Payment and Vendor Information */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Skeleton className="mb-4 h-5 w-40" />
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i}>
                      <Skeleton className="mb-1 h-4 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Skeleton className="mb-4 h-5 w-40" />
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i}>
                      <Skeleton className="mb-1 h-4 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Skeleton for Category Details and Description */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Skeleton className="mb-4 h-5 w-36" />
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i}>
                      <Skeleton className="mb-1 h-4 w-28" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Skeleton className="mb-4 h-5 w-28" />
                <Skeleton className="h-24 w-full rounded-lg" />
              </div>
            </div>

            {/* Skeleton for Attachments */}
            <div>
              <Skeleton className="mb-4 h-5 w-32" />
              <div className="flex flex-wrap gap-4">
                <Skeleton className="h-12 w-32 rounded-lg" />
              </div>
            </div>

            {/* Skeleton for Action Buttons */}
            <div className="flex justify-end gap-3 border-t pt-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {/* Expense ID and Amount */}
            <div className="border-primary/20 rounded-lg border border-dashed p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex flex-col items-start gap-2">
                    <div className="bg-primary/10 flex size-7 items-center justify-center rounded-full">
                      <Building2Icon className="text-primary h-4 w-4" />
                    </div>
                    <h3 className="text-primary text-base font-semibold">
                      Expense-{expense?.refNo || 'Expenses-001'}
                    </h3>
                  </div>
                  <p className="text-primary mt-1 text-sm">
                    Payment to{' '}
                    {expense?.vendorId &&
                      `${expense.vendorId.firstName} ${expense.vendorId.lastName}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-primary text-sm">Amount</p>
                  <p className="text-primary text-lg font-bold">
                    $
                    {totalAmount.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Information and Vendor Information */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Payment Information */}
              <div>
                <h3 className="mb-4 text-base font-semibold">
                  Payment Information:
                </h3>
                <div className="space-y-3">
                  {/* <div className="grid grid-cols-2 gap-4">
                    <p className="text-sm text-gray-600">Payment Account:</p>
                    <p className="text-sm font-medium">
                      {expense?.expense?.paymentAccount || 'N/A'}
                    </p>
                  </div> */}
                  <div className="grid grid-cols-2 gap-4">
                    <p className="text-sm text-gray-600">Country:</p>
                    <p className="text-sm font-medium">
                      {expense?.country || ''}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <p className="text-sm text-gray-600">Payment Method:</p>
                    <p className="text-sm font-medium">
                      {expense?.paymentMethod || ''}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <p className="text-sm text-gray-600">Payment Date:</p>
                    <p className="text-sm font-medium">
                      {expense?.paymentDate
                        ? format(new Date(expense.paymentDate), 'PP')
                        : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vendor Information */}
              <div>
                <h3 className="mb-4 text-base font-semibold">
                  Vendor Information
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <p className="text-sm text-gray-600">Vendor Name:</p>
                    <p className="text-sm font-medium">
                      {expense?.vendorId
                        ? `${expense.vendorId.firstName} ${expense.vendorId.lastName}`
                        : 'Not provided'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <p className="text-sm text-gray-600">Category:</p>
                    <p className="text-sm font-medium">
                      {expense?.vendorId?.businessInformation?.category ||
                        expense?.categoryDetails?.[0]?.category ||
                        'Income Expenses'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Details and Description */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Category Details */}
              <div>
                <h3 className="mb-4 text-base font-semibold">
                  Category details
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <p className="text-sm text-gray-600">Country:</p>
                    <p className="text-sm font-medium">{expense?.country}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <p className="text-sm text-gray-600">Client/Project:</p>
                    <p className="text-sm font-medium">
                      {expense?.categoryDetails?.[0]?.clientProject}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <p className="text-sm text-gray-600">Tax:</p>
                    <p className="text-sm font-medium">
                      {expense?.categoryDetails?.[0]?.tax || '0'}%
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <p className="text-sm text-gray-600">Billable:</p>
                    <p className="text-sm font-medium">
                      {expense?.categoryDetails?.[0]?.billable ||
                        'Not provided'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="mb-4 text-base font-semibold">Memo</h3>
                <div className="min-h-[150px] rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-sm text-gray-600">{expense?.memo || ''}</p>
                </div>
              </div>
            </div>

            {/* Attachments */}
            <div>
              <h3 className="mb-4 text-base font-semibold">Attachments</h3>
              <div className="flex flex-wrap gap-4">
                {expense?.attachments && expense.attachments.length > 0 ? (
                  expense.attachments.map((attachment, index) => (
                    <a
                      key={index}
                      href={attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:bg-gray-50"
                    >
                      <img src={pdfIcon} alt="PDF Icon" className="h-4 w-4" />
                      <span className="text-xs font-medium text-gray-700">
                        file.pdf
                      </span>
                      <DownloadIcon className="ml-2 h-4 w-4 text-green-600" />
                    </a>
                  ))
                ) : (
                  <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-3">
                    <img src={pdfIcon} alt="PDF Icon" className="h-4 w-4" />
                    <span className="text-xs font-medium text-gray-700">
                      No attachments
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-10 min-w-[100px]"
              >
                Close
              </Button>
              <Button className="h-10 min-w-[130px]">Edit Expense</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
