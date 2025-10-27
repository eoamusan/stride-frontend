import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NotepadTextIcon,
  SendIcon,
  XIcon,
  ChevronDownIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { useUserStore } from '@/stores/user-store';

export default function PreviewInvoice({
  formData,
  calculateSubtotal,
  onEdit,
  customers = [],
}) {
  const subtotal = calculateSubtotal();
  const { businessData } = useUserStore();

  // Use business brand color or default
  const primaryColor =
    businessData?.businessInvoiceSettings?.brandColor || '#00aa00';

  // Find the selected customer
  const selectedCustomer = customers.find(
    (customer) => customer.id.toString() === formData.customerId
  );

  const discount = (subtotal * (formData.discount || 0)) / 100;
  const afterDiscount = subtotal - discount;
  const vatAmount = (afterDiscount * (formData.vat || 0)) / 100;
  const total = afterDiscount + vatAmount + (formData.delivery_fee || 0);

  return (
    <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8">
      {/* Header with Edit Button */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <Button size={'icon'} variant={'ghost'} onClick={onEdit}>
          <XIcon className="h-4 w-4" />
        </Button>
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
            <div className="col-span-2 mb-4 grid w-fit grid-cols-1 gap-1 text-left">
              {businessData?.businessInvoiceSettings?.logoUrl ? (
                <img
                  src={businessData.businessInvoiceSettings.logoUrl}
                  alt="Company Logo"
                  className="h-16 w-auto object-contain"
                />
              ) : (
                <div className="flex h-16 w-32 items-center justify-center bg-gray-100 text-sm font-medium text-gray-500">
                  {businessData?.businessName || 'No Logo'}
                </div>
              )}

              <p className="text-sm font-semibold text-black">
                {businessData?.businessName || 'Business Name'}
              </p>
              <p className="max-w-48 text-sm text-[#727273]">
                {businessData?.businessLocation || ''}
              </p>
            </div>

            {/* Balance Due */}
            <div className="col-span-1 text-right">
              <p className="text-base font-bold text-black">
                {formData.invoice_number || ''}
              </p>
              <p className="mt-6 text-xs font-semibold text-black">
                Balance Due
              </p>
              <p className="text-sm font-bold">
                {formData.currency === 'USD'
                  ? '$'
                  : formData.currency === 'EUR'
                    ? '€'
                    : formData.currency === 'GBP'
                      ? '£'
                      : '₦'}{' '}
                {total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="space-y-1 text-sm text-gray-600">
              <p className="text-xs font-semibold text-black">Billed To:</p>
              <p className="text-sm font-bold">
                {selectedCustomer?.displayName || 'Customer Name'}
              </p>

              <p className="max-w-46 text-sm text-[#727273]">
                {selectedCustomer?.companyName || 'Company Name'}
              </p>
              <p className="max-w-46 text-sm text-[#727273]">
                {selectedCustomer?.address?.address1 || 'Customer Address'}
                {selectedCustomer?.address?.city &&
                  `, ${selectedCustomer.address.city}`}{' '}
                {selectedCustomer?.address?.state &&
                  `, ${selectedCustomer.address.state}`}
                {selectedCustomer?.address?.country &&
                  `, ${selectedCustomer.address.country}`}
              </p>
            </div>

            <div className="space-y-1 text-right text-sm">
              <div>
                <p className="font-bold">Invoice Date</p>
                <p className="text-[#727273]">
                  {formData.invoice_date
                    ? format(new Date(formData.invoice_date), 'MM-dd-yyyy')
                    : '06-12-2025'}
                </p>
              </div>
              <div>
                <p className="font-bold">Due Date</p>
                <p className="text-[#727273]">
                  {formData.due_date
                    ? format(new Date(formData.due_date), 'MM-dd-yyyy')
                    : '06-20-2024'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-6">
        {/* Table Header */}
        <div className={`text-white`} style={{ backgroundColor: primaryColor }}>
          <div className="grid grid-cols-15 gap-4 p-4 font-semibold max-sm:p-2">
            <div className="col-span-6">Item</div>
            <div className="col-span-3 text-center">Qty</div>
            <div className="col-span-3 text-center">
              Rate (
              {formData.currency === 'USD'
                ? '$'
                : formData.currency === 'EUR'
                  ? '€'
                  : formData.currency === 'GBP'
                    ? '£'
                    : '₦'}
              )
            </div>
            <div className="col-span-3 truncate text-right">
              Amount (
              {formData.currency === 'USD'
                ? '$'
                : formData.currency === 'EUR'
                  ? '€'
                  : formData.currency === 'GBP'
                    ? '£'
                    : '₦'}
              )
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="border-r border-l border-gray-200">
          {formData.products.map((product, index) => {
            const amount = (product.unit_price || 0) * (product.quantity || 1);
            const currencySymbol =
              formData.currency === 'USD'
                ? '$'
                : formData.currency === 'EUR'
                  ? '€'
                  : formData.currency === 'GBP'
                    ? '£'
                    : '₦';

            return (
              <div
                key={index}
                className={`grid grid-cols-15 gap-4 border-b border-gray-200 p-4 ${index % 2 === 1 ? 'bg-[#D3D3D3]/20' : ''}`}
              >
                <div className="col-span-6">
                  <p className="text-sm font-semibold">
                    {product.name || `Product ${index + 1}`}
                  </p>
                  <p className="text-xs">
                    {product.description || 'No description provided'}
                  </p>
                </div>
                <div className="col-span-3 text-center">
                  {product.quantity || 1}
                </div>
                <div className="col-span-3 text-center">
                  {currencySymbol}{' '}
                  {(product.unit_price || 0).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <div className="col-span-3 text-right">
                  {currencySymbol}{' '}
                  {amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Totals */}
      <div className="mb-4">
        <div className="space-y-2 border-b pb-4">
          <div className="grid grid-cols-15 gap-4">
            <div className="col-span-9"></div>
            <div className="col-span-3 text-right font-medium">Sub Total:</div>
            <div className="col-span-3 text-right font-bold">
              {formData.currency === 'USD'
                ? '$'
                : formData.currency === 'EUR'
                  ? '€'
                  : formData.currency === 'GBP'
                    ? '£'
                    : '₦'}{' '}
              {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
          {formData.discount > 0 && (
            <div className="grid grid-cols-15 gap-4">
              <div className="col-span-9"></div>
              <div className="col-span-3 text-right font-medium">
                Discount ({formData.discount}%):
              </div>
              <div className="col-span-3 text-right font-bold">
                -
                {formData.currency === 'USD'
                  ? '$'
                  : formData.currency === 'EUR'
                    ? '€'
                    : formData.currency === 'GBP'
                      ? '£'
                      : '₦'}{' '}
                {discount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
          )}
          <div className="grid grid-cols-15 gap-4">
            <div className="col-span-9"></div>
            <div className="col-span-3 text-right font-medium">
              VAT ({formData.vat || 7.5}%):
            </div>
            <div className="col-span-3 text-right font-bold">
              {formData.currency === 'USD'
                ? '$'
                : formData.currency === 'EUR'
                  ? '€'
                  : formData.currency === 'GBP'
                    ? '£'
                    : '₦'}{' '}
              {vatAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}
            </div>
          </div>
          {formData.delivery_fee > 0 && (
            <div className="grid grid-cols-15 gap-4">
              <div className="col-span-9"></div>
              <div className="col-span-3 text-right">Delivery Fee:</div>
              <div className="col-span-3 text-right">
                {formData.currency === 'USD'
                  ? '$'
                  : formData.currency === 'EUR'
                    ? '€'
                    : formData.currency === 'GBP'
                      ? '£'
                      : '₦'}{' '}
                {(formData.delivery_fee || 0).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>
          )}
          <div className="mt-4 grid grid-cols-15 gap-4 border-t border-dashed pt-4 font-semibold">
            <div className="col-span-9"></div>
            <div className="col-span-3 text-right">Total:</div>
            <div className="col-span-3 text-right">
              {formData.currency === 'USD'
                ? '$'
                : formData.currency === 'EUR'
                  ? '€'
                  : formData.currency === 'GBP'
                    ? '£'
                    : '₦'}{' '}
              {total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Conditions */}
      {formData.terms && (
        <div className="mb-8">
          <p className="text-sm font-bold">Terms & Conditions:</p>
          <p className="text-sm text-gray-600">{formData.terms}</p>
        </div>
      )}

      {/* Bank Details */}
      {formData.display_bank_details &&
        businessData?.businessInvoiceSettings?.bankAccounts?.length > 0 && (
          <div className="mb-8">
            <p className="text-sm font-bold">Bank Details:</p>
            {businessData.businessInvoiceSettings.bankAccounts.map(
              (bank, index) => (
                <div key={index} className="mt-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Account Name:</span>{' '}
                    {bank.accountName}
                  </p>
                  <p>
                    <span className="font-medium">Account Number:</span>{' '}
                    {bank.accountNumber}
                  </p>
                  <p>
                    <span className="font-medium">Bank Name:</span>{' '}
                    {bank.bankName}
                  </p>
                  <p>
                    <span className="font-medium">Sort Code:</span>{' '}
                    {bank.sortCode}
                  </p>
                  {bank.tin && (
                    <p>
                      <span className="font-medium">TIN:</span> {bank.tin}
                    </p>
                  )}
                  {index <
                    businessData.businessInvoiceSettings.bankAccounts.length -
                      1 && <hr className="my-2" />}
                </div>
              )
            )}
          </div>
        )}

      {/* Signature */}
      {formData.apply_signature &&
        businessData?.businessInvoiceSettings?.signatureUrl && (
          <div className="mb-8">
            <p className="text-sm font-bold">Authorized Signature:</p>
            <img
              src={businessData.businessInvoiceSettings.signatureUrl}
              alt="Authorized Signature"
              className="mt-2 h-16 w-auto object-contain"
            />
          </div>
        )}

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        {/* Send Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="h-10 px-8"
              style={{ backgroundColor: primaryColor }}
            >
              <SendIcon className="mr-2 h-4 w-4" />
              Send
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Send via Email</DropdownMenuItem>
            <DropdownMenuItem>Send via Stride</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" className="h-10 px-8">
          <NotepadTextIcon className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button variant="outline" className="h-10 px-8">
          <NotepadTextIcon className="mr-2 h-4 w-4" />
          Print
        </Button>

        {/* Record Payment Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10 px-8">
              Record Payment
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="space-y-1 p-2">
              <DropdownMenuItem className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-primary outline-primary mr-2 h-4 w-4 rounded-full outline"></div>
                  Paid with cash
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="border-primary mr-2 h-4 w-4 rounded-full border"></div>
                  Paid with Mobile transfer
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="border-primary mr-2 h-4 w-4 rounded-full border"></div>
                  Paid with Credit Card
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="border-primary mr-2 h-4 w-4 rounded-full border"></div>
                  Paid with POS
                </div>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
