import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import youtubeIcon from '@/assets/icons/youtube-red.png';
import InvoiceService from '@/api/invoice';
import { useUserStore } from '@/stores/user-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

// Setup pdfMake fonts
if (pdfFonts.pdfMake) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
} else {
  pdfMake.vfs = pdfFonts;
}

export default function AccountsReceivableReport() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { businessData } = useUserStore();
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    companyName: '',
  });

  const customerId = searchParams.get('customerId');
  const status = searchParams.get('status');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  // Fetch invoices with filters
  useEffect(() => {
    const fetchInvoices = async () => {
      if (!businessData?._id || !customerId) return;

      try {
        setIsLoading(true);

        // Build fetch params
        const fetchParams = {
          customerId: customerId,
          businessId: businessData._id,
          page: 1,
          perPage: 1000,
        };

        // Only add status if it's not 'ALL'
        if (status && status !== 'ALL') {
          fetchParams.status = status;
        }
        if (startDate) {
          fetchParams.startDate = startDate;
        }
        if (endDate) {
          fetchParams.endDate = endDate;
        }

        const response = await InvoiceService.fetch(fetchParams);

        console.log('Report invoices response:', response.data);

        const invoicesData = response.data?.data?.invoices || [];

        // Transform invoice data
        const transformedInvoices = invoicesData.map((invoice) => ({
          id: invoice._id,
          date: invoice.invoiceDate,
          invoiceNo: invoice.invoiceNo,
          dueDate: invoice.dueDate,
          creditTerms: invoice.termsOfPayment || '',
          amount: parseFloat(invoice.product?.total || 0),
          outstandingAmount: parseFloat(invoice.outstandingBalance || 0),
          status: invoice.status,
          currency: invoice.currency,
        }));

        setInvoices(transformedInvoices);

        // Set customer info from first invoice
        if (invoicesData.length > 0) {
          const firstInvoice = invoicesData[0];
          setCustomerInfo({
            name: firstInvoice.customerId?.displayName || 'Unknown Customer',
            companyName: firstInvoice.customerId?.companyName || '',
          });
        }
      } catch (error) {
        console.error('Error fetching report invoices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [businessData?._id, customerId, status, startDate, endDate]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      default:
        return '₦';
    }
  };

  const getDateRange = () => {
    if (invoices.length === 0) return '';

    const dates = invoices
      .map((inv) => new Date(inv.date))
      .sort((a, b) => a - b);
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];

    const formatMonth = (date) =>
      date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return `${formatMonth(firstDate)}, ${formatMonth(lastDate)}`;
  };

  const calculateTotal = () => {
    return invoices.reduce((sum, invoice) => sum + (invoice.amount || 0), 0);
  };

  const handleBack = () => {
    navigate('/dashboard/accounting/accounts-receivable');
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

  // Export to PDF
  const handleExportPDF = async () => {
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

      // Build table body
      const tableBody = [
        [
          { text: 'Date', style: 'tableHeader' },
          { text: 'Invoice no', style: 'tableHeader' },
          { text: 'Due date', style: 'tableHeader' },
          { text: 'Amount', style: 'tableHeader', alignment: 'right' },
          {
            text: 'Outstanding Amount',
            style: 'tableHeader',
            alignment: 'right',
          },
          { text: 'Status', style: 'tableHeader', alignment: 'right' },
        ],
      ];

      // Add invoice rows
      invoices.forEach((invoice) => {
        tableBody.push([
          { text: formatDate(invoice.date), style: 'tableCell' },
          { text: invoice.invoiceNo, style: 'tableCell' },
          { text: invoice.creditTerms, style: 'tableCell' },
          {
            text: `${getCurrencySymbol(invoice.currency)}${invoice.amount.toLocaleString(
              'en-US',
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}`,
            style: 'tableCell',
            alignment: 'right',
          },
          {
            text:
              invoice.outstandingAmount > 0
                ? `${getCurrencySymbol(invoice.currency)}${invoice.outstandingAmount.toLocaleString(
                    'en-US',
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}`
                : '-',
            style: 'tableCell',
            alignment: 'right',
          },
          {
            text: invoice.status === 'PAID' ? 'Paid' : 'Unpaid',
            style: 'tableCell',
            alignment: 'right',
            color: invoice.status === 'PAID' ? '#24A959' : '#EF4444',
          },
        ]);
      });

      // Add total row
      tableBody.push([
        {},
        {},
        {},
        {},
        { text: 'Total', style: 'totalCell', alignment: 'right' },
        {
          text: `${getCurrencySymbol(invoices[0]?.currency)}${calculateTotal().toLocaleString(
            'en-US',
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}`,
          style: 'totalCell',
          alignment: 'right',
        },
      ]);

      const content = [
        ...(logoBase64
          ? [
              {
                image: logoBase64,
                width: 72,
                alignment: 'center',
                margin: [0, 0, 0, 15],
              },
            ]
          : [
              {
                text: businessData?.businessName || 'Business Name',
                style: 'businessName',
                alignment: 'center',
                margin: [0, 0, 0, 15],
              },
            ]),
        { text: 'Account Report', style: 'header' },
        { text: customerInfo.name, style: 'customerName' },
        {
          text: getDateRange(),
          style: 'subheader',
          margin: [0, 0, 0, 30],
        },
        {
          table: {
            headerRows: 1,
            widths: [80, 110, 80, '*', 110, 80],
            body: tableBody,
          },
          layout: {
            hLineWidth: (i, node) =>
              i === 0 || i === 1 || i === node.table.body.length ? 1 : 0.5,
            vLineWidth: () => 0,
            hLineColor: () => '#d1d5db',
            paddingLeft: () => 12,
            paddingRight: () => 12,
            paddingTop: () => 10,
            paddingBottom: () => 10,
          },
        },
        {
          text: format(new Date(), "EEEE, MMMM d, yyyy h:mmaaa 'GMT' XXX"),
          style: 'footer',
          margin: [0, 20, 0, 0],
        },
      ];

      const docDefinition = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [60, 60, 60, 60],
        content: content,
        styles: {
          businessName: {
            fontSize: 20,
            bold: true,
            color: '#000000',
          },
          header: {
            fontSize: 20,
            bold: true,
            alignment: 'center',
            margin: [0, 0, 0, 10],
          },
          customerName: {
            fontSize: 16,
            bold: true,
            alignment: 'center',
            margin: [0, 0, 0, 5],
          },
          subheader: {
            fontSize: 12,
            alignment: 'center',
            color: '#292d32',
            margin: [0, 0, 0, 4],
          },
          tableHeader: {
            fontSize: 10,
            bold: true,
            color: '#374151',
            margin: [0, 0, 0, 0],
          },
          tableCell: {
            fontSize: 10,
            color: '#000000',
          },
          totalCell: {
            fontSize: 10,
            bold: true,
            color: '#000000',
          },
          footer: {
            fontSize: 8,
            alignment: 'center',
            color: '#292D32',
          },
        },
      };

      pdfMake
        .createPdf(docDefinition)
        .download(
          `Account_Report_${customerInfo.name}_${format(new Date(), 'yyyy-MM-dd')}.pdf`
        );
      toast.success('PDF downloaded successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  // Export to Excel
  const handleExportExcel = () => {
    try {
      // Prepare data for Excel
      const excelData = [];

      // Add title rows
      excelData.push(['Account Report']);
      excelData.push([customerInfo.name]);
      excelData.push([getDateRange()]);
      excelData.push([]);

      // Add header row
      excelData.push([
        'Date',
        'Invoice no',
        'Due date',
        'Amount',
        'Outstanding Amount',
        'Status',
      ]);

      // Add invoice rows
      invoices.forEach((invoice) => {
        excelData.push([
          formatDate(invoice.date),
          invoice.invoiceNo,
          invoice.creditTerms,
          invoice.amount,
          invoice.outstandingAmount > 0 ? invoice.outstandingAmount : 0,
          invoice.status === 'PAID' ? 'Paid' : 'Unpaid',
        ]);
      });

      // Add total row
      excelData.push(['Total', '', '', calculateTotal(), '', '']);

      // Add footer
      excelData.push([]);
      excelData.push([
        format(new Date(), "EEEE, MMMM d, yyyy h:mmaaa 'GMT' XXX"),
      ]);

      // Create worksheet
      const ws = XLSX.utils.aoa_to_sheet(excelData);

      // Set column widths
      ws['!cols'] = [
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 20 },
        { wch: 12 },
      ];

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Account Report');

      // Generate filename with date
      const filename = `Account_Report_${customerInfo.name}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;

      // Save file
      XLSX.writeFile(wb, filename);
      toast.success('Excel file downloaded successfully');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Failed to export to Excel');
    }
  };

  return (
    <div className="mx-auto min-h-screen p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center gap-2 font-medium"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back
        </Button>

        <div className="flex items-center gap-3">
          <Button variant={'outline'} className={'h-10 rounded-2xl text-sm'}>
            <img src={youtubeIcon} alt="YouTube Icon" className="mr-1 h-4" />
            See video guide
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className={'h-10 rounded-2xl text-sm'}>Save as</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportPDF}>PDF</DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportExcel}>
                Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Report Content */}
      <div className="mx-auto rounded-lg bg-white p-12 shadow-sm">
        {/* Title and Customer Info */}
        <div className="mb-12 text-center">
          <h1 className="mb-2 text-xl font-bold text-gray-900">
            Account Report
          </h1>
          <h2 className="mb-1 font-semibold">{customerInfo.name}</h2>
          <p className="text-sm text-[#292d32]">{getDateRange()}</p>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="py-12 text-center text-gray-500">Loading...</div>
        ) : invoices.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            No invoices found for this report
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-4 text-left text-sm font-medium text-gray-600">
                    Date
                  </th>
                  <th className="pb-4 text-left text-sm font-medium text-gray-600">
                    Invoice no
                  </th>
                  <th className="pb-4 text-left text-sm font-medium text-gray-600">
                    Due date
                  </th>
                  <th className="pb-4 text-right text-sm font-medium text-gray-600">
                    Amount
                  </th>
                  <th className="pb-4 text-right text-sm font-medium text-gray-600">
                    Outstanding Amount
                  </th>
                  <th className="pb-4 text-right text-sm font-medium text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice, index) => (
                  <tr
                    key={invoice.id}
                    className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="py-4 text-sm text-gray-900">
                      {formatDate(invoice.date)}
                    </td>
                    <td className="py-4 text-sm text-gray-900">
                      {invoice.invoiceNo}
                    </td>
                    <td className="py-4 text-sm text-gray-900">
                      {invoice.creditTerms}
                    </td>
                    <td className="py-4 text-right text-sm text-gray-900">
                      {getCurrencySymbol(invoice.currency)}
                      {invoice.amount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-4 text-right text-sm text-gray-900">
                      {invoice.outstandingAmount > 0
                        ? `${getCurrencySymbol(invoice.currency)}${invoice.outstandingAmount.toLocaleString(
                            'en-US',
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}`
                        : '-'}
                    </td>
                    <td className="py-4 text-right text-sm">
                      <span
                        className={`font-medium ${
                          invoice.status === 'PAID'
                            ? 'text-[#24A959]'
                            : 'text-[#EF4444]'
                        }`}
                      >
                        {invoice.status === 'PAID' ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total Row */}
            <div className="mt-6 flex justify-end border-t border-gray-200 pt-4">
              <div className="flex items-center gap-12">
                <span className="text-base font-semibold text-gray-900">
                  Total
                </span>
                <span className="text-base font-bold text-gray-900">
                  {getCurrencySymbol(invoices[0]?.currency)}
                  {calculateTotal().toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            {/* Report Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm font-medium text-[#292D32]">
                {format(new Date(), "EEEE, MMMM d, yyyy h:mmaaa 'GMT' XXX")}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
