import { Button } from '@/components/ui/button';
import { NotepadTextIcon, SendIcon } from 'lucide-react';
import { format } from 'date-fns';
import invoiceLogo from '@/assets/images/invoice-sample.png';

export default function PreviewInvoice({
  formData,
  calculateSubtotal,
  onEdit,
}) {
  const subtotal = calculateSubtotal();
  const discount = (subtotal * (formData.discount || 0)) / 100;
  const afterDiscount = subtotal - discount;
  const vatAmount = (afterDiscount * (formData.vat || 0)) / 100;
  const total = afterDiscount + vatAmount + (formData.delivery_fee || 0);

  return (
    <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8">
      {/* Header with Edit Button */}
      <div className="mb-8 flex items-center justify-end">
        <Button variant="outline" className="h-10" onClick={onEdit}>
          <NotepadTextIcon className="h-4 w-4" />
          Edit
        </Button>
      </div>

      {/* Invoice Header */}
      <div className="mb-8">
        {/* Company Logo and Details */}

        <div className="">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 mb-4 grid w-fit grid-cols-2 gap-2 text-left">
              <img src={invoiceLogo} alt="Company Logo" />

              {/* Invoice Info */}
              <div className="space-y-2 text-xs">
                <div>
                  <p className="font-bold">Invoice Number</p>
                  <p className="text-gray-600">{formData.invoice_number}</p>
                </div>
                <div>
                  <p className="font-bold">Invoice Date</p>
                  <p className="text-gray-600">
                    {formData.invoice_date
                      ? format(new Date(formData.invoice_date), 'MM-dd-yyyy')
                      : '06-12-2025'}
                  </p>
                </div>
                <div>
                  <p className="font-bold">Due Date</p>
                  <p className="text-gray-600">
                    {formData.due_date
                      ? format(new Date(formData.due_date), 'MM-dd-yyyy')
                      : '06-20-2024'}
                  </p>
                </div>
              </div>
            </div>

            {/* Balance Due */}
            <div className="col-span-1 text-right">
              <p className="font-semibold text-black">Balance Due</p>
              <p className="text-2xl font-bold">
                ₦ {total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <div className="mt-4">
                <p className="text-sm font-semibold text-black">Terms</p>
                <p className="text-sm text-gray-600">Add details</p>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="space-y-1 text-sm text-gray-600">
              <p className="flex flex-col">
                <span className="font-bold text-black">Name</span> Dianne
                Russell
              </p>
              <p className="mt-4 flex flex-col">
                <span className="font-bold text-black">Address</span>
              </p>
              <p>4140 Parker Rd,</p>
              <p>Allentown, New</p>
              <p>Mexico 31134</p>
            </div>

            <div className="space-y-1 text-right text-sm">
              <p className="font-semibold text-black">Billed To:</p>
              <p className="text-gray-600">ABC Corporation</p>
              <p className="text-gray-600">1901 Thornridge Cir,</p>
              <p className="text-gray-600">Shiloh, Hawaii 81063</p>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        {/* Table Header */}
        <div className="bg-primary text-white">
          <div className="grid grid-cols-12 gap-4 p-4 font-semibold">
            <div className="col-span-6">Item</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-2 text-center">Rate</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="border-r border-l border-gray-200">
          {formData.products.map((product, index) => {
            const amount = (product.unit_price || 0) * (product.quantity || 1);
            return (
              <div
                key={index}
                className="grid grid-cols-12 gap-4 border-b border-gray-200 p-4"
              >
                <div className="col-span-6">
                  {product.name || 'Ui/Ux design'}
                </div>
                <div className="col-span-2 text-center">
                  {product.quantity || 1}
                </div>
                <div className="col-span-2 text-center">
                  ₦{' '}
                  {(product.unit_price || 0).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <div className="col-span-2 text-right">
                  ₦{' '}
                  {amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Totals */}
      <div className="mb-4 flex justify-end">
        <div className="w-full space-y-2 border-b pb-4">
          <div className="flex justify-end gap-4">
            <span className="font-medium">Sub Total:</span>
            <span className="font-bold">
              ₦ {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          {formData.discount > 0 && (
            <div className="flex justify-end gap-4">
              <span className="font-medium">
                Discount ({formData.discount}%):
              </span>
              <span className="font-bold">
                -₦{' '}
                {discount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          )}
          <div className="flex justify-end gap-4">
            <span className="font-medium">VAT ({formData.vat || 7.5}%):</span>
            <span className="font-bold">
              ₦{' '}
              {formData.vat.toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
          {formData.delivery_fee > 0 && (
            <div className="mb-3 flex justify-between">
              <span>Delivery Fee:</span>
              <span>
                ₦{' '}
                {(formData.delivery_fee || 0).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          )}
          <div className="mt-4 flex justify-between border-t border-dashed pt-4 font-semibold">
            <span>Total:</span>
            <span>
              ₦ {total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>Balance:</span>
            <span>
              ₦ {total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="mb-8">
        <p className="text-sm font-bold">Terms & Conditions:</p>
        <p className="text-sm text-gray-600">
          Please pay within 15 days of receiving this invoice.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <Button className="h-10 px-8">
          <SendIcon className="mr-2 h-4 w-4" />
          Send
        </Button>
        <Button variant="outline" className="h-10 px-8">
          <NotepadTextIcon className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button variant="outline" className="h-10 px-8">
          <NotepadTextIcon className="mr-2 h-4 w-4" />
          Print
        </Button>
      </div>
    </div>
  );
}
