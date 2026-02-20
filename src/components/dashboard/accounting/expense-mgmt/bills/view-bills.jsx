import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Building2, Receipt, Eye } from 'lucide-react';
import pdfIcon from '@/assets/icons/pdf-icon.svg';

export default function ViewBills({
  open,
  onOpenChange,
  billData,
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
        {!billData ? (
          <div className="flex items-center justify-center p-8">
            <p className="text-muted-foreground">Loading bill details...</p>
          </div>
        ) : (
          <>
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
                  <h3 className="text-base font-semibold">
                    Payment Information:
                  </h3>

                  <div className="space-y-1">
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

                    <div className="flex flex-col justify-between py-2">
                      <span className="text-base font-medium text-[#434343]">
                        Attachment
                      </span>
                      <div className="mt-2">
                        {billData.attachment ? (
                          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2">
                            <img src={pdfIcon} alt="PDF" className="size-5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-700">
                                Invoice {billData.billNumber}
                              </p>
                              <p className="text-xs text-gray-500">
                                {billData.billDate}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                window.open(billData.attachment, '_blank')
                              }
                              className="hover:bg-secondary flex cursor-pointer items-center gap-1 rounded-md p-2"
                              title="View attachment"
                            >
                              <Eye className="size-4" />
                            </button>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No attachment</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vendor Information */}
                <div className="space-y-6">
                  <h3 className="text-base font-semibold">
                    Vendor Information
                  </h3>

                  <div>
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-[#434343]">
                        Vendor Name:
                      </span>
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
                  className="h-10 min-w-35 text-sm"
                >
                  Close
                </Button>
                <Button
                  variant="outline"
                  onClick={handleEdit}
                  className="h-10 min-w-35 text-sm"
                >
                  Edit Bill
                </Button>
                <Button
                  onClick={handleExport}
                  className="h-10 min-w-35 text-sm"
                >
                  Export
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
