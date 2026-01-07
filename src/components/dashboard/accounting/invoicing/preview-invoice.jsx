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
  PrinterIcon,
  DownloadIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { useUserStore } from '@/stores/user-store';
import { useRef, useState, useEffect } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import toast from 'react-hot-toast';

if (pdfFonts.pdfMake) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
} else {
  pdfMake.vfs = pdfFonts;
}
import SendInvoiceEmail from './send-email';
import { uploadToCloudinary } from '@/lib/cloudinary';
import PaymentPreview from './payment-preview';
import PaymentForm from './payment-form';
import SuccessModal from '../success-modal';
import PaymentService from '@/api/payment';
import InvoiceService from '@/api/invoice';

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
  const [refreshPayments, setRefreshPayments] = useState(0);
  const [fetchedPayments, setFetchedPayments] = useState([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [calculatedBalanceDue, setCalculatedBalanceDue] = useState(0);

  console.log('preview invoice customer', customers);

  // Use business brand color or default
  const primaryColor =
    businessData?.businessInvoiceSettings?.brandColor || '#00aa00';

  // Determine if this is a proforma invoice (no account field in products)
  const isProforma = Array.isArray(formData.products)
    ? !formData.products.some((p) => p.accountId)
    : !formData.products?.products?.some((p) => p.accountId);

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
        const response = await PaymentService.fetchInvoiceDetails({
          invoiceId: formData.id,
        });

        console.log('Payment API Response:', response.data);
        const paymentsData = response.data?.data?.payments || [];

        // Transform payment data to match the expected structure
        const transformedPayments = paymentsData.map((item) => {
          console.log('Individual Payment:', item);
          return {
            amount: item.amountPaid,
            datePaid: item.paymentDate || item.createdAt,
            method: item.paymentMethod || 'Bank Transfer',
            dateCreated: item.createdAt,
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
  }, [formData.id, total, refreshPayments]);

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

  // Convert image URL to base64
  const getBase64ImageFromURL = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = (error) => {
        reject(error);
      };
      img.src = url;
    });
  };

  const generatePDF = async (uploadToCloud = false) => {
    const loadingToast = toast.loading('Generating PDF...');
    try {
      // Convert logo to base64 if it exists
      let logoBase64 = null;
      if (businessData?.businessInvoiceSettings?.logoUrl) {
        try {
          logoBase64 = await getBase64ImageFromURL(
            businessData.businessInvoiceSettings.logoUrl
          );
        } catch (error) {
          console.error('Error converting logo to base64:', error);
        }
      }

      const primaryColor =
        businessData?.businessInvoiceSettings?.brandColor || '#00aa00';

      // Build PDF content
      const content = [];

      // Proforma Invoice Label (at the very top)
      if (isProforma) {
        content.push({
          text: 'PROFORMA INVOICE',
          fontSize: 14,
          bold: true,
          margin: [0, 0, 0, 15],
        });
      }

      // Header section with logo and invoice details
      const headerSection = {
        columns: [
          {
            width: '*',
            stack: [
              ...(logoBase64
                ? [
                    {
                      image: logoBase64,
                      width: 80,
                      margin: [0, 0, 0, 10],
                    },
                  ]
                : [
                    {
                      text: businessData?.businessName || '',
                      fontSize: 16,
                      bold: true,
                      margin: [0, 0, 0, 10],
                    },
                  ]),
              {
                text: businessData?.businessLocation || '',
                fontSize: 9,
                color: '#727273',
                width: 200,
              },
            ],
          },
          {
            width: 'auto',
            stack: [
              {
                text: formData.invoice_number || '',
                fontSize: 14,
                bold: true,
                alignment: 'right',
              },
              {
                text: 'Balance Due',
                fontSize: 9,
                bold: true,
                alignment: 'right',
                margin: [0, 20, 0, 2],
              },
              {
                text: `${formData.currency === 'USD' ? '$' : formData.currency === 'EUR' ? '€' : formData.currency === 'GBP' ? '£' : '₦'} ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
                fontSize: 12,
                bold: true,
                alignment: 'right',
              },
            ],
          },
        ],
        margin: [0, 0, 0, 20],
      };
      content.push(headerSection);

      // Billed To and Dates section
      const billedToSection = {
        columns: [
          {
            width: '*',
            stack: [
              {
                text: 'Billed To:',
                fontSize: 9,
                bold: true,
                margin: [0, 0, 0, 4],
              },
              {
                text: selectedCustomer?.displayName || '',
                fontSize: 11,
                bold: true,
                margin: [0, 0, 0, 2],
              },
              {
                text: selectedCustomer?.companyName || '',
                fontSize: 9,
                color: '#727273',
                margin: [0, 0, 0, 2],
              },
              {
                text: selectedCustomer?.email || '',
                fontSize: 9,
                color: '#727273',
                margin: [0, 0, 0, 2],
              },
              {
                text: selectedCustomer?.phoneNumber || '',
                fontSize: 9,
                color: '#727273',
                margin: [0, 0, 0, 2],
              },
              {
                text: [
                  selectedCustomer?.address?.address1 || '',
                  selectedCustomer?.address?.city
                    ? `, ${selectedCustomer.address.city}`
                    : '',
                  selectedCustomer?.address?.state
                    ? `, ${selectedCustomer.address.state}`
                    : '',
                  selectedCustomer?.address?.country
                    ? `, ${selectedCustomer.address.country}`
                    : '',
                ].join(''),
                fontSize: 9,
                color: '#727273',
              },
            ],
          },
          {
            width: 'auto',
            stack: [
              {
                text: 'Invoice Date',
                fontSize: 10,
                bold: true,
                alignment: 'right',
                margin: [0, 0, 0, 2],
              },
              {
                text: formData.invoice_date
                  ? format(new Date(formData.invoice_date), 'MM-dd-yyyy')
                  : '',
                fontSize: 9,
                color: '#727273',
                alignment: 'right',
                margin: [0, 0, 0, 10],
              },
              {
                text: 'Due Date',
                fontSize: 10,
                bold: true,
                alignment: 'right',
                margin: [0, 0, 0, 2],
              },
              {
                text: formData.due_date
                  ? format(new Date(formData.due_date), 'MM-dd-yyyy')
                  : '',
                fontSize: 9,
                color: '#727273',
                alignment: 'right',
              },
            ],
          },
        ],
        margin: [0, 0, 0, 25],
      };
      content.push(billedToSection);

      // Items table
      const tableBody = [
        [
          {
            text: 'Item',
            style: 'tableHeader',
            fillColor: primaryColor,
            color: '#ffffff',
          },
          {
            text: 'Qty',
            style: 'tableHeader',
            fillColor: primaryColor,
            color: '#ffffff',
            alignment: 'center',
          },
          {
            text: `Rate (${formData.currency === 'USD' ? '$' : formData.currency === 'EUR' ? '€' : formData.currency === 'GBP' ? '£' : '₦'})`,
            style: 'tableHeader',
            fillColor: primaryColor,
            color: '#ffffff',
            alignment: 'center',
          },
          {
            text: `Amount (${formData.currency === 'USD' ? '$' : formData.currency === 'EUR' ? '€' : formData.currency === 'GBP' ? '£' : '₦'})`,
            style: 'tableHeader',
            fillColor: primaryColor,
            color: '#ffffff',
            alignment: 'right',
          },
        ],
      ];

      const products = Array.isArray(formData.products)
        ? formData.products
        : formData.products?.products || [];
      products.forEach((product, index) => {
        const amount = (product.unit_price || 0) * (product.quantity || 1);
        tableBody.push([
          {
            stack: [
              {
                text:
                  product.name || product.accountName || `Product ${index + 1}`,
                fontSize: 10,
                bold: true,
              },
              {
                text: product.description || '',
                fontSize: 8,
                color: '#666666',
                margin: [0, 2, 0, 0],
              },
            ],
            fillColor: index % 2 === 1 ? '#f5f5f5' : '#ffffff',
          },
          {
            text: (product.quantity || 1).toString(),
            fontSize: 10,
            alignment: 'center',
            fillColor: index % 2 === 1 ? '#f5f5f5' : '#ffffff',
          },
          {
            text: (product.unit_price || 0).toLocaleString('en-US', {
              minimumFractionDigits: 2,
            }),
            fontSize: 10,
            alignment: 'center',
            fillColor: index % 2 === 1 ? '#f5f5f5' : '#ffffff',
          },
          {
            text: amount.toLocaleString('en-US', { minimumFractionDigits: 2 }),
            fontSize: 10,
            alignment: 'right',
            fillColor: index % 2 === 1 ? '#f5f5f5' : '#ffffff',
          },
        ]);
      });

      content.push({
        table: {
          headerRows: 1,
          widths: ['*', 60, 80, 100],
          body: tableBody,
        },
        layout: {
          hLineWidth: (i, node) =>
            i === 0 || i === 1 || i === node.table.body.length ? 1 : 0.5,
          vLineWidth: () => 1,
          hLineColor: () => '#dddddd',
          vLineColor: () => '#dddddd',
          paddingLeft: () => 10,
          paddingRight: () => 10,
          paddingTop: () => 8,
          paddingBottom: () => 8,
        },
        margin: [0, 0, 0, 15],
      });

      // Totals section
      const totalsData = [
        [
          'Sub Total:',
          subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 }),
        ],
      ];

      if (formData.vat > 0) {
        totalsData.push([
          `VAT (${formData.vat}%):`,
          vatAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }),
        ]);
      }

      totalsData.push([
        'Total:',
        total.toLocaleString('en-US', { minimumFractionDigits: 2 }),
      ]);

      content.push({
        columns: [
          { width: '*', text: '' },
          {
            width: 'auto',
            table: {
              widths: [100, 100],
              body: totalsData.map((row, index) => [
                {
                  text: row[0],
                  fontSize: 10,
                  bold: index === totalsData.length - 1,
                  alignment: 'right',
                  border: [
                    false,
                    false,
                    false,
                    index === totalsData.length - 1,
                  ],
                },
                {
                  text: row[1],
                  fontSize: 10,
                  bold: index === totalsData.length - 1,
                  alignment: 'right',
                  border: [
                    false,
                    false,
                    false,
                    index === totalsData.length - 1,
                  ],
                },
              ]),
            },
            layout: {
              hLineWidth: (i) => (i === totalsData.length ? 1 : 0),
              vLineWidth: () => 0,
              hLineColor: () => '#000000',
              paddingTop: () => 6,
              paddingBottom: () => 6,
            },
          },
        ],
        margin: [0, 0, 0, 25],
      });

      // Terms & Conditions
      if (formData.terms) {
        content.push({
          stack: [
            {
              text: 'Terms & Conditions:',
              fontSize: 10,
              bold: true,
              margin: [0, 0, 0, 5],
            },
            {
              text: formData.terms,
              fontSize: 9,
              color: '#666666',
            },
          ],
          margin: [0, 0, 0, 15],
        });
      }

      // Bank Details
      if (
        formData.display_bank_details &&
        formData.products?.banks?.length > 0
      ) {
        const bankDetailsContent = [
          {
            text: 'Bank Details:',
            fontSize: 10,
            bold: true,
            margin: [0, 0, 0, 5],
          },
        ];

        formData.products.banks.forEach((bank, index) => {
          const bankInfo = [];
          if (bank.accountName) {
            bankInfo.push({
              text: [
                { text: 'Account Name: ', bold: true },
                { text: bank.accountName },
              ],
              fontSize: 9,
              color: '#666666',
              margin: [0, 2, 0, 0],
            });
          }
          if (bank.accountNumber) {
            bankInfo.push({
              text: [
                { text: 'Account Number: ', bold: true },
                { text: bank.accountNumber },
              ],
              fontSize: 9,
              color: '#666666',
              margin: [0, 2, 0, 0],
            });
          }
          if (bank.bankName) {
            bankInfo.push({
              text: [
                { text: 'Bank Name: ', bold: true },
                { text: bank.bankName },
              ],
              fontSize: 9,
              color: '#666666',
              margin: [0, 2, 0, 0],
            });
          }
          if (bank.sortCode) {
            bankInfo.push({
              text: [
                { text: 'Sort Code: ', bold: true },
                { text: bank.sortCode },
              ],
              fontSize: 9,
              color: '#666666',
              margin: [0, 2, 0, 0],
            });
          }
          if (bank.tin) {
            bankInfo.push({
              text: [{ text: 'TIN: ', bold: true }, { text: bank.tin }],
              fontSize: 9,
              color: '#666666',
              margin: [0, 2, 0, 0],
            });
          }
          if (bank.swiftCode) {
            bankInfo.push({
              text: [
                { text: 'Swift Code: ', bold: true },
                { text: bank.swiftCode },
              ],
              fontSize: 9,
              color: '#666666',
              margin: [0, 2, 0, 0],
            });
          }
          if (bank.fnbUniversalCode) {
            bankInfo.push({
              text: [
                { text: 'FNB Universal Code: ', bold: true },
                { text: bank.fnbUniversalCode },
              ],
              fontSize: 9,
              color: '#666666',
              margin: [0, 2, 0, 0],
            });
          }

          bankDetailsContent.push(...bankInfo);

          // Add separator line between banks (except for the last one)
          if (index < formData.products.banks.length - 1) {
            bankDetailsContent.push({
              canvas: [
                {
                  type: 'line',
                  x1: 0,
                  y1: 5,
                  x2: 515,
                  y2: 5,
                  lineWidth: 0.5,
                  lineColor: '#cccccc',
                },
              ],
              margin: [0, 8, 0, 8],
            });
          }
        });

        content.push({
          stack: bankDetailsContent,
          margin: [0, 0, 0, 15],
        });
      }

      // Payment Gateways
      if (formData.products?.paymentGateways?.length > 0) {
        const gatewayContent = [
          {
            text: 'Other Payment Options:',
            fontSize: 10,
            bold: true,
            margin: [0, 0, 0, 5],
          },
        ];

        formData.products.paymentGateways.forEach((gateway) => {
          gatewayContent.push({
            text: [
              { text: 'Pay with ', fontSize: 9, color: '#666666' },
              {
                text: gateway.name,
                fontSize: 9,
                color: '#2563eb',
                decoration: 'underline',
                link: gateway.link,
              },
            ],
            margin: [0, 2, 0, 0],
          });
        });

        content.push({
          stack: gatewayContent,
          margin: [0, 0, 0, 15],
        });
      }

      // Signature
      if (
        formData.apply_signature &&
        businessData?.businessInvoiceSettings?.signatureUrl
      ) {
        try {
          const signatureBase64 = await getBase64ImageFromURL(
            businessData.businessInvoiceSettings.signatureUrl
          );
          content.push({
            stack: [
              {
                text: 'Authorized Signature:',
                fontSize: 10,
                bold: true,
                margin: [0, 0, 0, 5],
              },
              {
                image: signatureBase64,
                width: 150,
                margin: [0, 5, 0, 0],
              },
            ],
            margin: [0, 0, 0, 0],
          });
        } catch (error) {
          console.error('Error converting signature to base64:', error);
        }
      }

      const docDefinition = {
        pageSize: 'A4',
        pageMargins: [40, 40, 40, 40],
        content: content,
        styles: {
          tableHeader: {
            fontSize: 11,
            bold: true,
          },
        },
      };

      const pdfDocGenerator = pdfMake.createPdf(docDefinition);

      if (uploadToCloud) {
        // Get blob and upload to Cloudinary
        pdfDocGenerator.getBlob(async (pdfBlob) => {
          try {
            const fileName = `${formData.invoice_number || 'invoice'}.pdf`;
            const pdfUrl = await uploadPdfToCloudinary(pdfBlob, fileName);
            toast.dismiss(loadingToast);
            return pdfUrl;
          } catch (error) {
            toast.dismiss(loadingToast);
            toast.error('Failed to upload PDF');
            throw error;
          }
        });
      } else {
        // Download the PDF
        const fileName = `${formData.invoice_number || 'invoice'}.pdf`;
        pdfDocGenerator.download(fileName);
        toast.dismiss(loadingToast);
        toast.success('PDF downloaded successfully!');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Error generating PDF:', error);
      toast.error('Error generating PDF. Please try again.');
      throw error;
    }
  };

  // New method: Download PDF from backend API
  // const handleDownloadPDF = async () => {
  //   if (!formData.id) {
  //     toast.error('Invoice ID is required to download PDF');
  //     return;
  //   }

  //   const loadingToast = toast.loading('Downloading PDF from server...');
  //   try {
  //     const response = await InvoiceService.generatePdf({ id: formData.id });
  //     console.log(response);
  //     // Create a blob from the response
  //     const blob = new Blob([response.data], { type: 'application/pdf' });

  //     // Create a URL for the blob
  //     const url = window.URL.createObjectURL(blob);

  //     // Create a temporary link and trigger download
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.download = `${formData.invoice_number || 'invoice'}.pdf`;
  //     document.body.appendChild(link);
  //     link.click();

  //     // Cleanup
  //     document.body.removeChild(link);
  //     window.URL.revokeObjectURL(url);

  //     toast.dismiss(loadingToast);
  //     toast.success('PDF downloaded successfully!');
  //   } catch (error) {
  //     toast.dismiss(loadingToast);
  //     console.error('Error downloading PDF from server:', error);
  //     toast.error('Failed to download PDF. Please try again.');
  //   }
  // };

  const handlePrint = () => {
    // Hide all elements except the invoice
    const invoice = invoiceRef.current;
    if (!invoice) return;

    // Set page title for print
    document.title = `Invoice-${formData.invoice_number || 'draft'}`;

    // Trigger print dialog
    window.print();
  };

  return (
    <div>
      <style>{`
        @media print {
          .edit-button,
          .action-buttons {
            display: none !important;
          }
          body * {
            visibility: hidden;
          }
          .invoice-print-area,
          .invoice-print-area * {
            visibility: visible;
          }
          .invoice-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            transform-origin: top center;
          }
        }
      `}</style>
      <div
        className="invoice-print-area mx-auto max-w-2xl rounded-2xl bg-white p-8"
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
          {/* Proforma Invoice Label */}
          {isProforma && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold">PROFORMA INVOICE</h2>
            </div>
          )}

          {/* Company Logo and Details */}

          <div className="mb-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 mb-4 grid w-fit grid-cols-1 gap-1 text-left">
                {businessData?.businessInvoiceSettings?.logoUrl ? (
                  <img
                    src={businessData.businessInvoiceSettings.logoUrl}
                    alt="Company Logo"
                    className="h-24 w-auto object-contain"
                  />
                ) : (
                  <div className="text-sm font-bold text-black">
                    <p>{businessData?.businessName || 'Business Name'}</p>
                  </div>
                )}

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
                  {selectedCustomer?.email || ''}
                </p>

                <p className="max-w-46 text-sm text-[#727273]">
                  {selectedCustomer?.phoneNumber || ''}
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
            {(Array.isArray(formData.products)
              ? formData.products
              : formData.products?.products || []
            ).map((product, index) => {
              const amount =
                (product.unit_price || 0) * (product.quantity || 1);

              return (
                <div
                  key={index}
                  className={`grid grid-cols-15 gap-4 border-b border-gray-200 p-4 ${index % 2 === 1 ? 'bg-[#D3D3D3]/20' : ''}`}
                >
                  <div className="col-span-6">
                    <p className="text-sm font-semibold">
                      {product.name ||
                        product.accountName ||
                        `Product ${index + 1}`}
                    </p>
                    <p className="text-xs">
                      {product.description || 'No description provided'}
                    </p>
                  </div>
                  <div className="col-span-3 text-center">
                    {product.quantity || 1}
                  </div>
                  <div className="col-span-3 text-center">
                    {(product.unit_price || 0).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                  <div className="col-span-3 text-right">
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
          formData.products?.banks?.length > 0 && (
            <div className="mb-8">
              <p className="text-sm font-bold">Bank Details:</p>
              {formData.products.banks.map((bank, index) => (
                <div key={index} className="mt-2 text-sm text-gray-600">
                  {bank.accountName && (
                    <p>
                      <span className="font-medium">Account Name:</span>{' '}
                      {bank.accountName}
                    </p>
                  )}
                  {bank.accountNumber && (
                    <p>
                      <span className="font-medium">Account Number:</span>{' '}
                      {bank.accountNumber}
                    </p>
                  )}
                  {bank.bankName && (
                    <p>
                      <span className="font-medium">Bank Name:</span>{' '}
                      {bank.bankName}
                    </p>
                  )}
                  {bank.sortCode && (
                    <p>
                      <span className="font-medium">Sort Code:</span>{' '}
                      {bank.sortCode}
                    </p>
                  )}
                  {bank.tin && (
                    <p>
                      <span className="font-medium">TIN:</span> {bank.tin}
                    </p>
                  )}
                  {bank.swiftCode && (
                    <p>
                      <span className="font-medium">Swift Code:</span>{' '}
                      {bank.swiftCode}
                    </p>
                  )}
                  {bank.fnbUniversalCode && (
                    <p>
                      <span className="font-medium">FNB Universal Code:</span>{' '}
                      {bank.fnbUniversalCode}
                    </p>
                  )}
                  {index < formData.products.banks.length - 1 && (
                    <hr className="my-2" />
                  )}
                </div>
              ))}
            </div>
          )}

        {/* Payment Gateways */}
        {formData.products?.paymentGateways?.length > 0 && (
          <div className="mb-8">
            <p className="text-sm font-bold">Other Payment Options:</p>
            <div className="mt-2 space-y-1 text-sm">
              {formData.products.paymentGateways.map((gateway, index) => (
                <p key={index} className="text-gray-600">
                  Pay with{' '}
                  <a
                    href={gateway.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {gateway.name}
                  </a>
                </p>
              ))}
            </div>
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

          <Button variant="outline" className="h-10 px-8" onClick={handlePrint}>
            <PrinterIcon className="mr-2 h-4 w-4" />
            Print
          </Button>

          <Button
            variant="outline"
            className="h-10 px-8"
            onClick={() => generatePDF(false)}
          >
            <DownloadIcon className="mr-2 h-4 w-4" />
            Download
          </Button>

          <Button
            variant="outline"
            className="h-10 px-8"
            disabled={
              !formData.id ||
              formData.status === 'PAID' ||
              calculatedBalanceDue === 0
            }
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
          balanceDue={calculatedBalanceDue ?? balanceDue ?? total ?? 0}
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
          setRefreshPayments((prev) => prev + 1);
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
