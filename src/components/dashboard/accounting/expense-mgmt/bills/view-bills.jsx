import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Building2, Receipt } from 'lucide-react';

export default function ViewBills({
  open,
  onOpenChange,
  billData = {
    id: 'BILL-2024-001',
    billNumber: 'Bill-001',
    vendor: 'JJ Solutions',
    amount: '$23,000',
    dueDate: '12/23/2025',
    status: 'Paid',
    invoiceReference: 'INV-2025-002',
    paymentMethod: 'Bank Transfer',
    billDate: '12/23/2025',
  },
  onEdit,
  onExport,
}) {
  const handleClose = () => {
    onOpenChange?.(false);
  };

  const handleEdit = () => {
    onEdit?.(billData);
  };

  const handleExport = () => {
    onExport?.(billData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[95%] overflow-y-auto sm:max-w-3xl">
        {/* Header */}
        <div className="flex gap-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-[#254C00]">
            <Receipt className="size-4 text-white" />
          </div>
          <div>
            <DialogHeader>
              <DialogTitle>Bill Details</DialogTitle>
              <DialogDescription>#{billData.id}</DialogDescription>
            </DialogHeader>
          </div>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-8">
          {/* Bill Summary */}
          <div className="space-y-6 rounded-2xl border border-dashed p-6">
            {/* Bill Header with Status */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex flex-col gap-3">
                  <div className="bg-primary/10 flex size-8 items-center justify-center rounded-full">
                    <Building2 className="text-primary size-4" />
                  </div>
                  <div className="text-primary">
                    <h2 className="text-xl font-semibold">
                      {billData.billNumber}
                    </h2>
                    <p className="text-sm font-medium">
                      Payment to {billData.vendor}
                    </p>
                  </div>
                </div>
              </div>
              <Badge
                className={`${
                  billData.status === 'Paid'
                    ? 'bg-[#24A959]/10 text-[#24A959] hover:bg-[#24A959]/10'
                    : billData.status === 'Pending'
                      ? 'bg-orange-100 text-orange-800 hover:bg-orange-100'
                      : 'bg-red-100 text-red-800 hover:bg-red-100'
                }`}
              >
                {billData.status}
              </Badge>
            </div>

            {/* Amount and Due Date */}
            <div className="flex items-end justify-between">
              <div className="text-primary">
                <p className="text-lg font-semibold">Amount</p>
                <p className="text-sm font-medium">{billData.amount}</p>
              </div>
              <div className="text-primary text-right">
                <p className="text-lg font-semibold">Due Date</p>
                <p className="text-sm font-medium">{billData.dueDate}</p>
              </div>
            </div>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Payment Information */}
            <div className="space-y-6">
              <h3 className="text-base font-semibold">Payment Information:</h3>

              <div className="space-y-4">
                <div className="flex justify-between py-2">
                  <span className="text-sm text-[#434343]">
                    Invoice Reference:
                  </span>
                  <span className="font-semibold text-[#434343]">
                    {billData.invoiceReference}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-sm text-[#434343]">
                    Payment Method:
                  </span>
                  <span className="font-semibold text-[#434343]">
                    {billData.paymentMethod}
                  </span>
                </div>
              </div>
            </div>

            {/* Vendor Information */}
            <div className="space-y-6">
              <h3 className="text-base font-semibold">Vendor Information</h3>

              <div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-[#434343]">Vendor Name:</span>
                  <span className="font-semibold text-[#434343]">
                    {billData.vendor}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-sm text-[#434343]">
                    Payment Status:
                  </span>
                  <Badge
                    className={`${
                      billData.status === 'Paid'
                        ? 'bg-green-100 text-green-800 hover:bg-green-100'
                        : billData.status === 'Pending'
                          ? 'bg-orange-100 text-orange-800 hover:bg-orange-100'
                          : 'bg-red-100 text-red-800 hover:bg-red-100'
                    }`}
                  >
                    {billData.status}
                  </Badge>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-sm text-[#434343]">Bill Date:</span>
                  <span className="font-semibold text-[#434343]">
                    {billData.billDate}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-8 pb-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="h-10 min-w-[140px] text-sm"
            >
              Close
            </Button>
            <Button
              variant="outline"
              onClick={handleEdit}
              className="h-10 min-w-[140px] text-sm"
            >
              Edit Bill
            </Button>
            <Button
              onClick={handleExport}
              className="h-10 min-w-[140px] text-sm"
            >
              Export
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
