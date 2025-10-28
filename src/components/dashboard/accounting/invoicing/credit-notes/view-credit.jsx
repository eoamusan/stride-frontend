import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function ViewCreditNote({ open, onOpenChange, creditNote }) {
  // Sample data - in real app this would come from props
  const defaultCreditNote = {
    id: 'CN-2024-001',
    issueDate: '2024-01-15',
    originalInvoice: 'INV-2024-001',
    type: 'CN-2024-001',
    status: 'Approved',
    refundStatus: 'Approved',
    reason: 'Product Return',
    description:
      'Credit note issued for returned merchandise. Items were returned in original condition within return policy period.',
    customer: {
      id: 'CN-2024-001',
      email: '2024-01-15',
      phone: 'INV-2024-001',
    },
    items: [
      {
        name: 'Product A - Model X1',
        qty: 2,
        unitPrice: 100000.0,
        total: 200000.0,
      },
      {
        name: 'Product A - Model X1',
        qty: 2,
        unitPrice: 100000.0,
        total: 200000.0,
      },
    ],
    amounts: {
      subtotal: 200000.0,
      vat: 7.5,
      vatAmount: 75,
      total: 200000.0,
      totalCredit: 200000.0,
    },
    approval: {
      approvedBy: 'John Smith',
      approvalDate: '2024-01-15',
    },
  };

  const data = creditNote || defaultCreditNote;

  const getStatusBadgeStyle = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'approved':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'processing':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'rejected':
      case 'failed':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      case 'refunded':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleDownload = () => {
    console.log('Download credit note');
  };

  const handleSend = () => {
    console.log('Send credit note');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-full max-w-4xl overflow-y-auto p-8 sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Credit Note Details</DialogTitle>
          <p className="text-muted-foreground text-sm">{data.id}</p>
        </DialogHeader>

        <div className="space-y-8">
          {/* Credit Note Information & Reason Section */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Credit Note Information */}
            <div className="space-y-4 bg-[#FBFBFB] p-4">
              <h3 className="text-sm font-semibold">Credit Note Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">
                    Credit Note ID:
                  </span>
                  <span className="text-sm">{data.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">
                    Issue Date:
                  </span>
                  <span className="text-sm">{data.issueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">
                    Original Invoice:
                  </span>
                  <span className="text-sm">{data.originalInvoice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Type:</span>
                  <span className="text-sm">{data.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Status:</span>
                  <Badge className={getStatusBadgeStyle(data.status)}>
                    {data.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">
                    Refund Status:
                  </span>
                  <Badge className={getStatusBadgeStyle(data.refundStatus)}>
                    {data.refundStatus}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Reason & Description */}
            <div className="space-y-4 bg-[#FBFBFB] p-4">
              <h3 className="text-sm font-semibold">Reason & Description</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium">Reason:</span>
                  <p className="mt-1 text-sm">{data.reason}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Description:</span>
                  <p className="mt-1 text-sm">{data.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information & Items Section */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Customer Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">
                    Customer:
                  </span>
                  <span className="text-sm">{data.customer.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Email:</span>
                  <span className="text-sm">{data.customer.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Phone:</span>
                  <span className="text-sm">{data.customer.phone}</span>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Items</h3>
              <div className="space-y-3">
                {data.items.map((item, index) => (
                  <div key={index} className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-muted-foreground text-xs">
                        Qty: {item.qty} • {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatCurrency(item.total)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Amount Summary */}
          <div className="pt-6">
            <div className="flex justify-end">
              <div className="w-full max-w-sm space-y-3">
                <h3 className="text-sm font-semibold">Amount Summary</h3>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Subtotal</span>
                    <span className="text-sm font-semibold">
                      {formatCurrency(data.amounts.subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      Vax ({data.amounts.vat}%)
                    </span>
                    <span className="text-sm font-semibold">
                      {data.amounts.vatAmount}%
                    </span>
                  </div>

                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Total</span>
                    <span className="font-semibold">
                      {formatCurrency(data.amounts.total)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-semibold">Total Credit</span>
                    <span className="font-semibold">
                      {formatCurrency(data.amounts.totalCredit)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Approval Information */}
          <div className="mt-12 rounded-lg bg-green-50 p-4 text-xs">
            <h3 className="mb-3 font-semibold text-green-800">
              Approval Information
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-700">Approved By</p>
                <p className="font-medium text-green-800">
                  {data.approval.approvedBy}
                </p>
              </div>
              <div className="text-right">
                <p className="text-green-700">Approval Date</p>
                <p className="font-medium text-green-800">
                  {data.approval.approvalDate}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-6 pt-4">
            <Button
              variant="outline"
              onClick={handleDownload}
              className="h-10 w-full max-w-44 text-sm"
            >
              Download
            </Button>
            <Button
              onClick={handleSend}
              className="h-10 w-full max-w-44 text-sm"
            >
              Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
