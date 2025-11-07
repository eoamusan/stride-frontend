import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NotepadTextIcon, SendIcon, XIcon, PrinterIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useUserStore } from '@/stores/user-store';
import { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import SendInvoiceEmail from './send-email';
import { uploadToCloudinary } from '@/lib/cloudinary';
import PaymentPreview from './payment-preview';
import PaymentForm from './payment-form';
import SuccessModal from '../success-modal';
import PaymentService from '@/api/payment';

export default function PreviewInvoice({
  formData,
  calculateSubtotal,
  onEdit,
  onBack,
  customers = [],
  balanceDue,
}) {
  const subtotal = calculateSubtotal();
  const { businessData } = useUserStore();
  const invoiceRef = useRef(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [uploadedPdfUrl, setUploadedPdfUrl] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [fetchedPayments, setFetchedPayments] = useState([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [calculatedBalanceDue, setCalculatedBalanceDue] = useState(0);

  // Use business brand color or default
  const primaryColor =
    businessData?.businessInvoiceSettings?.brandColor || '#00aa00';

  // Find the selected customer
  const selectedCustomer = customers.find(
    (customer) => customer.id.toString() === formData.customerId
  );

  // Calculate totals first before useEffect
  const discount = (subtotal * (formData.discount || 0)) / 100;
  const afterDiscount = subtotal - discount;
  const vatAmount = (afterDiscount * (formData.vat || 0)) / 100;
  const total = afterDiscount + vatAmount + (formData.delivery_fee || 0);

  // Fetch payments when invoice ID is available
  useEffect(() => {
    const fetchPayments = async () => {
      if (!formData.id) return;

      try {
        setIsLoadingPayments(true);
        const response = await PaymentService.fetch({
          invoiceId: formData.id,
        });

        console.log('Payment API Response:', response.data);
        const paymentsData = response.data?.data || [];
        console.log('Payments Data:', paymentsData);

        // Transform payment data to match the expected structure
        const transformedPayments = paymentsData.map((payment) => {
          console.log('Individual Payment:', payment);
          return {
            amount: payment.amount || null, // Use null instead of 0 to indicate missing amount
            datePaid: payment.paymentDate || payment.createdAt,
            method: payment.paymentMethod || 'Bank Transfer',
            dateCreated: payment.createdAt,
          };
        });

        console.log('Transformed Payments:', transformedPayments);
        setFetchedPayments(transformedPayments);

        // Calculate total invoice amount
        const totalAmount = total;

        // Calculate total payments made (only count payments with valid amounts)
        const totalPaid = transformedPayments.reduce(
          (sum, payment) => sum + (Number(payment.amount) || 0),
          0
        );

        // Calculate balance due
        const balance = totalAmount - totalPaid;
        setCalculatedBalanceDue(balance);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setFetchedPayments([]);
        setCalculatedBalanceDue(total);
      } finally {
        setIsLoadingPayments(false);
      }
    };

    fetchPayments();
  }, [formData.id, total]);

  // Function to upload PDF to Cloudinary
  const uploadPdfToCloudinary = async (pdfBlob, fileName) => {
    const loadingToast = toast.loading('Uploading PDF to cloud...');
    try {
      // Create a File object from the blob
      const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

      // Upload to Cloudinary
      const result = await uploadToCloudinary(file, {
        folder: 'invoices',
        tags: ['invoice', 'pdf', formData.invoice_number || 'draft'],
      });

      setUploadedPdfUrl(result.url);
      toast.dismiss(loadingToast);
      toast.success('PDF uploaded successfully!');
      return result.url;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast.error('Failed to upload PDF to cloud');
      throw error;
    }
  };

  const handleSendEmail = async () => {
    setShowEmailModal(true);
    try {
      // Generate and upload PDF before opening email modal
      await generatePDF(true);
    } catch (error) {
      console.error('Error preparing email:', error);
    }
  };

  const generatePDF = async (uploadToCloud = false) => {
    if (!invoiceRef.current) return;

    const loadingToast = toast.loading('Generating PDF...');
    try {
      // Hide the action buttons temporarily
      const actionButtons = invoiceRef.current.querySelector('.action-buttons');
      const editButton = invoiceRef.current.querySelector('.edit-button');

      if (actionButtons) actionButtons.style.display = 'none';
      if (editButton) editButton.style.display = 'none';

      // Generate canvas from the invoice content
      const canvas = await html2canvas(invoiceRef.current, {
        useCORS: true,
        allowTaint: true,
        ignoreElements: (element) => {
          return (
            element.classList?.contains('action-buttons') ||
            element.classList?.contains('edit-button')
          );
        },
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Calculate dimensions to fit the page
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(
        imgData,
        'PNG',
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );

      // Generate filename
      const fileName = `invoice-${formData.invoice_number || 'draft'}-${format(new Date(), 'yyyy-MM-dd')}.pdf`;

      let pdfUrl = null;

      if (uploadToCloud) {
        // Upload to Cloudinary if requested
        const pdfBlob = pdf.output('blob');
        pdfUrl = await uploadPdfToCloudinary(pdfBlob, fileName);
      } else {
        // Download the PDF normally
        pdf.save(fileName);
      }

      // Show the action buttons again
      if (actionButtons) actionButtons.style.display = 'flex';
      if (editButton) editButton.style.display = 'flex';

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      if (!uploadToCloud) {
        toast.success('PDF generated successfully!');
      }

      return pdfUrl;
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Error generating PDF:', error);
      // Show the action buttons again in case of error
      const actionButtons =
        invoiceRef.current?.querySelector('.action-buttons');
      const editButton = invoiceRef.current?.querySelector('.edit-button');
      if (actionButtons) actionButtons.style.display = 'flex';
      if (editButton) editButton.style.display = 'flex';

      // Show error toast
      toast.error('Error generating PDF. Please try again.');
      throw error;
    }
  };

  return (
    <div>
      <div
        className="mx-auto max-w-2xl rounded-2xl bg-white p-8"
        ref={invoiceRef}
      >
        {/* Header with Edit Button */}
        <div className="edit-button mb-8 flex items-center justify-between gap-4">
          <Button size={'icon'} variant={'ghost'} onClick={onBack}>
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
                  {selectedCustomer?.displayName || ''}
                </p>

                <p className="max-w-46 text-sm text-[#727273]">
                  {selectedCustomer?.companyName || ''}
                </p>
                <p className="max-w-46 text-sm text-[#727273]">
                  {selectedCustomer?.address?.address1 || ''}
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
                      : ''}
                  </p>
                </div>
                <div>
                  <p className="font-bold">Due Date</p>
                  <p className="text-[#727273]">
                    {formData.due_date
                      ? format(new Date(formData.due_date), 'MM-dd-yyyy')
                      : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          {/* Table Header */}
          <div
            className={`text-white`}
            style={{ backgroundColor: primaryColor }}
          >
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
              const amount =
                (product.unit_price || 0) * (product.quantity || 1);
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
                    {amount.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                    })}
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
              <div className="col-span-3 text-right font-medium">
                Sub Total:
              </div>
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
                  {discount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                  })}
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
        <div className="action-buttons mt-6 flex justify-end gap-4">
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
              <DropdownMenuItem onClick={handleSendEmail}>
                Send via Email
              </DropdownMenuItem>
              <DropdownMenuItem>Send via OneDa</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            className="h-10 px-8"
            onClick={() => generatePDF(false)}
          >
            <PrinterIcon className="mr-2 h-4 w-4" />
            Print
          </Button>

          <Button
            variant="outline"
            className="h-10 px-8"
            disabled={!formData.id}
            onClick={() => setShowPaymentForm(true)}
          >
            Record Payment
          </Button>
        </div>

        {/* Send Email Modal */}
        <SendInvoiceEmail
          open={showEmailModal}
          onOpenChange={setShowEmailModal}
          invoiceData={{
            ...formData,
            customer: selectedCustomer,
            businessSettings: businessData?.businessInvoiceSettings,
            total,
            subtotal,
            vatAmount,
            discount,
            pdfUrl: uploadedPdfUrl,
          }}
        />
      </div>
      {/* Payment Preview Section - Always show for testing */}
      <div className="mx-auto my-8 max-w-2xl rounded-2xl bg-white p-8">
        <PaymentPreview
          payments={fetchedPayments}
          balanceDue={calculatedBalanceDue || balanceDue || total || ''}
          currency={formData.currency}
          isLoading={isLoadingPayments}
        />
      </div>

      <PaymentForm
        open={showPaymentForm}
        onOpenChange={setShowPaymentForm}
        invoiceNo={formData.invoice_number}
        invoiceId={formData.id}
        amountDue={calculatedBalanceDue || balanceDue || total}
        onSuccess={() => {
          setShowSuccessModal(true);
          // Refresh payments after successful payment
          if (formData.id) {
            PaymentService.fetch({ invoiceId: formData.id })
              .then((response) => {
                const paymentsData = response.data?.data || [];
                const transformedPayments = paymentsData.map((payment) => ({
                  amount: payment.amount || null,
                  datePaid: payment.paymentDate || payment.createdAt,
                  method: payment.paymentMethod || 'Bank Transfer',
                  dateCreated: payment.createdAt,
                }));
                setFetchedPayments(transformedPayments);

                const totalPaid = transformedPayments.reduce(
                  (sum, payment) => sum + (Number(payment.amount) || 0),
                  0
                );
                const balance = total - totalPaid;
                setCalculatedBalanceDue(balance);
              })
              .catch((error) => {
                console.error('Error refreshing payments:', error);
              });
          }
        }}
      />

      <SuccessModal
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        title="Payment Recorded"
        description="The payment has been successfully recorded."
        backText={'Back'}
      />
    </div>
  );
}
