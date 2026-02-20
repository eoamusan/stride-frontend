import {
  FilterIcon,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import youtubeIcon from '@/assets/icons/youtube-red.png';
import AccountService from '@/api/accounts';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { useUserStore } from '@/stores/user-store';

if (pdfFonts.pdfMake) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
} else {
  pdfMake.vfs = pdfFonts;
}

export default function AccountReportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeBusiness = useUserStore((state) => state.activeBusiness);

  // Get data from navigation state
  const { accountIds = [], startDate, endDate } = location.state || {};

  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [expandedRows, setExpandedRows] = useState({});

  const [filters, setFilters] = useState({
    codeSeries: false,
    transactionsDate: false,
    type: false,
    name: false,
    accountFullName: false,
    balance: false,
    amount: false,
  });

  // Fetch transactions when component mounts
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!accountIds || accountIds.length === 0) {
        toast.error('No accounts selected');
        return;
      }

      try {
        setIsLoading(true);
        const response = await AccountService.fetchTransactions({
          accountingAccountId: accountIds.at(0),
          startDate: startDate ? new Date(startDate).toISOString() : undefined,
          endDate: endDate ? new Date(endDate).toISOString() : undefined,
        });

        const fetchedTransactions =
          response.data?.data?.transactions?.length > 0
            ? response.data?.data?.transactions
            : response.data?.data?.mergedTransactions || [];
        setTransactions(fetchedTransactions);
        console.log(fetchedTransactions);

        // Expand first group by default
        if (fetchedTransactions.length > 0) {
          const firstAccountCode =
            fetchedTransactions[0]?.accountingAccountId?.accountCode;
          if (firstAccountCode) {
            setExpandedRows({ [firstAccountCode]: true });
          }
        }

        if (fetchedTransactions.length === 0) {
          toast.error('No transactions found for the selected criteria');
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast.error('Failed to fetch transactions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [accountIds, startDate, endDate]);

  const toggleRow = (accountCode) => {
    setExpandedRows((prev) => ({
      ...prev,
      [accountCode]: !prev[accountCode],
    }));
  };

  const handleFilterChange = (filterKey, checked) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: checked,
    }));
  };

  // Group transactions by account code
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const accountCode = transaction.accountingAccountId?.accountCode;
    if (!accountCode) return acc;

    if (!acc[accountCode]) {
      acc[accountCode] = [];
    }
    acc[accountCode].push(transaction);
    return acc;
  }, {});

  // Calculate totals for each group
  const calculateGroupTotal = (transactionGroup) => {
    return transactionGroup.reduce((total, transaction) => {
      return total + parseFloat(getBalanceByAccountType(transaction) || 0);
    }, 0);
  };

  // Format currency
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  // Get name from transaction based on type
  const getTransactionName = (transaction) => {
    if (transaction.type === 'expense' && transaction.vendorId) {
      return `${transaction.vendorId.firstName} ${transaction.vendorId.lastName}`;
    }
    if (transaction.type === 'product' && transaction.customerId) {
      return (
        transaction.customerId.displayName ||
        `${transaction.customerId.firstName} ${transaction.customerId.lastName}`
      );
    }
    return 'N/A';
  };

  // Get appropriate balance based on account type
  const getBalanceByAccountType = (transaction) => {
    const accountType =
      transaction.accountingAccountId?.accountType?.toLowerCase();

    switch (accountType) {
      case 'income':
      case 'equity':
      case 'liabilities':
        return transaction.creditBalance || 0;
      case 'expenses':
      case 'assets':
        return transaction.debitBalance || 0;
      default:
        // Fallback to whichever balance has a value
        return transaction.creditBalance || transaction.debitBalance || 0;
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

  // Export to PDF
  const handleExportPDF = async () => {
    try {
      // Convert logo to base64 if it exists
      let logoBase64 = null;
      if (activeBusiness?.businessInvoiceSettings?.logoUrl) {
        try {
          logoBase64 = await getBase64ImageFromURL(
            activeBusiness.businessInvoiceSettings.logoUrl
          );
        } catch (error) {
          console.error('Error converting logo to base64:', error);
          toast.error('Failed to load logo for PDF');
        }
      }

      // Build content array with separate tables for each group
      const content = [
        ...(logoBase64
          ? [
              {
                image: logoBase64,
                width: 80,
                alignment: 'center',
                margin: [0, 0, 0, 15],
              },
            ]
          : [
              {
                text: activeBusiness?.businessName || 'Business Name',
                style: 'businessName',
                alignment: 'center',
                margin: [0, 0, 0, 15],
              },
            ]),
        { text: 'Account Report', style: 'header' },
        {
          text:
            startDate && endDate
              ? `${format(new Date(startDate), 'MMMM d, yyyy')} - ${format(new Date(endDate), 'MMMM d, yyyy')}`
              : 'All Time',
          style: 'subheader',
          margin: [0, 0, 0, 30],
        },
        // Header row table
        {
          table: {
            widths: [60, 90, 55, '*', 70, 100, 85, 85],
            body: [
              [
                { text: 'Code Series', style: 'tableHeader' },
                { text: 'Transactions Date', style: 'tableHeader' },
                { text: 'Type', style: 'tableHeader' },
                { text: 'Description', style: 'tableHeader' },
                { text: 'Name', style: 'tableHeader' },
                { text: 'Account full name', style: 'tableHeader' },
                { text: 'Amount', style: 'tableHeader' },
                { text: 'Balance', style: 'tableHeader' },
              ],
            ],
          },
          layout: {
            hLineWidth: () => 0,
            vLineWidth: () => 0,
            paddingLeft: () => 12,
            paddingRight: () => 12,
            paddingTop: () => 0,
            paddingBottom: () => 0,
          },
          margin: [0, 0, 0, 10],
        },
      ];

      // Add each group as a separate bordered section
      Object.entries(groupedTransactions).forEach(
        ([accountCode, transactionGroup]) => {
          // Group header
          content.push({
            table: {
              widths: [60, 90, 55, '*', 70, 100, 85, 85],
              body: [
                [
                  {
                    text: `${accountCode} (${transactionGroup.length})`,
                    style: 'groupHeader',
                    colSpan: 4,
                  },
                  {},
                  {},
                  {},
                  {
                    text:
                      transactionGroup[0]?.accountingAccountId?.accountName ||
                      '',
                    style: 'groupHeader',
                    colSpan: 4,
                  },
                  {},
                  {},
                  {},
                ],
              ],
            },
            layout: {
              hLineWidth: () => 1,
              vLineWidth: (i, node) => {
                // Add borders on left and right edges only
                return i === 0 || i === node.table.widths.length ? 1 : 0;
              },
              hLineColor: () => '#d1d5db',
              vLineColor: () => '#d1d5db',
              paddingLeft: () => 12,
              paddingRight: () => 12,
              paddingTop: () => 10,
              paddingBottom: () => 10,
            },
            margin: [0, 0, 0, 8],
          });

          // Transaction rows
          transactionGroup.forEach((transaction) => {
            content.push({
              table: {
                widths: [60, 90, 55, '*', 70, 100, 85, 85],
                body: [
                  [
                    {
                      text: transaction.accountingAccountId?.accountCode || '',
                      style: 'tableCell',
                    },
                    {
                      text: format(
                        new Date(transaction.createdAt),
                        'dd/MM/yyyy'
                      ),
                      style: 'tableCell',
                    },
                    { text: transaction.type || '', style: 'tableCell' },
                    {
                      text: transaction.description || 'N/A',
                      style: 'tableCell',
                    },
                    {
                      text: getTransactionName(transaction),
                      style: 'tableCell',
                    },
                    {
                      text: transaction.accountingAccountId?.accountName || '',
                      style: 'tableCell',
                    },
                    {
                      text: formatCurrency(
                        transaction.amount,
                        transaction.invoiceId?.currency
                      ),
                      style: 'tableCell',
                    },
                    {
                      text: formatCurrency(
                        getBalanceByAccountType(transaction),
                        transaction.invoiceId?.currency
                      ),
                      style: 'tableCell',
                    },
                  ],
                ],
              },
              layout: {
                hLineWidth: () => 1,
                vLineWidth: (i, node) => {
                  // Add borders on left and right edges only
                  return i === 0 || i === node.table.widths.length ? 1 : 0;
                },
                hLineColor: () => '#d1d5db',
                vLineColor: () => '#d1d5db',
                paddingLeft: () => 12,
                paddingRight: () => 12,
                paddingTop: () => 10,
                paddingBottom: () => 10,
              },
              margin: [0, 0, 0, 8],
            });
          });

          // Total row
          content.push({
            table: {
              widths: [60, 90, 55, '*', 70, 100, 85, 85],
              body: [
                [
                  { text: 'Total', colSpan: 6, style: 'totalCell' },
                  {},
                  {},
                  {},
                  {},
                  {},
                  {
                    text: formatCurrency(calculateGroupTotal(transactionGroup)),
                    style: 'totalCell',
                  },
                  { text: '', style: 'totalCell' },
                ],
              ],
            },
            layout: {
              hLineWidth: () => 1,
              vLineWidth: (i, node) => {
                // Add borders on left and right edges only
                return i === 0 || i === node.table.widths.length ? 1 : 0;
              },
              hLineColor: () => '#d1d5db',
              vLineColor: () => '#d1d5db',
              paddingLeft: () => 12,
              paddingRight: () => 12,
              paddingTop: () => 10,
              paddingBottom: () => 10,
            },
            margin: [0, 0, 0, 20],
          });
        }
      );

      // Add footer
      content.push({
        text: format(new Date(), "EEEE, MMMM d, yyyy h:mmaaa 'GMT' XXX"),
        style: 'footer',
        margin: [0, 20, 0, 0],
      });

      const docDefinition = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        pageMargins: [60, 60, 60, 60],
        content: content,
        styles: {
          businessName: {
            fontSize: 26,
            bold: true,
            color: '#000000',
          },
          header: {
            fontSize: 24,
            bold: true,
            alignment: 'center',
            margin: [0, 0, 0, 15],
          },
          subheader: {
            fontSize: 14,
            alignment: 'center',
            color: '#374151',
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
          groupHeader: {
            fontSize: 11,
            bold: true,
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
        .download(`Account_Report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
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

      // Add header row
      excelData.push([
        'Code Series',
        'Transaction Date',
        'Type',
        'Description',
        'Name',
        'Account Full Name',
        'Amount',
        'Balance',
      ]);

      // Add transaction rows grouped by account
      Object.entries(groupedTransactions).forEach(
        ([accountCode, transactionGroup]) => {
          // Add group header
          excelData.push([
            `${accountCode} (${transactionGroup.length})`,
            '',
            '',
            '',
            '',
            transactionGroup[0]?.accountingAccountId?.accountName || '',
            '',
            '',
          ]);

          // Add transactions
          transactionGroup.forEach((transaction) => {
            excelData.push([
              transaction.accountingAccountId?.accountCode || '',
              format(new Date(transaction.createdAt), 'dd/MM/yyyy'),
              transaction.type || '',
              transaction.description || 'N/A',
              getTransactionName(transaction),
              transaction.accountingAccountId?.accountName || '',
              transaction.amount || 0,
              getBalanceByAccountType(transaction),
            ]);
          });

          // Add total row
          excelData.push([
            'Total',
            '',
            '',
            '',
            '',
            '',
            calculateGroupTotal(transactionGroup),
            '',
          ]);

          // Add empty row for spacing
          excelData.push([]);
        }
      );

      // Create worksheet
      const ws = XLSX.utils.aoa_to_sheet(excelData);

      // Set column widths
      ws['!cols'] = [
        { wch: 15 },
        { wch: 15 },
        { wch: 12 },
        { wch: 25 },
        { wch: 20 },
        { wch: 25 },
        { wch: 15 },
        { wch: 15 },
      ];

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Account Report');

      // Generate filename with date
      const filename = `Account_Report_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;

      // Save file
      XLSX.writeFile(wb, filename);
      toast.success('Excel file downloaded successfully');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Failed to export to Excel');
    }
  };

  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <Button
          variant={'ghost'}
          className={''}
          onClick={() => navigate('/dashboard/accounting/bookkeeping')}
        >
          <ChevronLeft size={16} className="mr-1" />
          Back
        </Button>

        <div className="flex space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size={'icon'}
                variant={'outline'}
                className={'h-10 text-sm'}
              >
                <FilterIcon size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-4" align="end">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Filter</h3>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="codeSeries"
                      checked={filters.codeSeries}
                      onCheckedChange={(checked) =>
                        handleFilterChange('codeSeries', checked)
                      }
                    />
                    <label
                      htmlFor="codeSeries"
                      className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Code Series
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="transactionsDate"
                      checked={filters.transactionsDate}
                      onCheckedChange={(checked) =>
                        handleFilterChange('transactionsDate', checked)
                      }
                    />
                    <label
                      htmlFor="transactionsDate"
                      className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Transactions Date
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="type"
                      checked={filters.type}
                      onCheckedChange={(checked) =>
                        handleFilterChange('type', checked)
                      }
                    />
                    <label
                      htmlFor="type"
                      className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Type
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="name"
                      checked={filters.name}
                      onCheckedChange={(checked) =>
                        handleFilterChange('name', checked)
                      }
                    />
                    <label
                      htmlFor="name"
                      className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Name
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="accountFullName"
                      checked={filters.accountFullName}
                      onCheckedChange={(checked) =>
                        handleFilterChange('accountFullName', checked)
                      }
                    />
                    <label
                      htmlFor="accountFullName"
                      className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Account full name
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="balance"
                      checked={filters.balance}
                      onCheckedChange={(checked) =>
                        handleFilterChange('balance', checked)
                      }
                    />
                    <label
                      htmlFor="balance"
                      className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Balance
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="amount"
                      checked={filters.amount}
                      onCheckedChange={(checked) =>
                        handleFilterChange('amount', checked)
                      }
                    />
                    <label
                      htmlFor="amount"
                      className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Amount
                    </label>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
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

      {/* Account Report Section */}
      <div
        id="account-report-section"
        className="mt-8 rounded-xl bg-white py-6"
      >
        {/* Report Header */}
        <div className="mb-6 text-center">
          {activeBusiness?.businessInvoiceSettings?.logoUrl ? (
            <img
              src={activeBusiness.businessInvoiceSettings.logoUrl}
              alt={activeBusiness?.businessName || 'Business Logo'}
              className="mx-auto mb-4 h-16 object-contain"
            />
          ) : (
            <div className="mx-auto mb-4 text-lg font-bold">
              {activeBusiness?.businessName || 'Business Name'}
            </div>
          )}
          <h1 className="mb-2 text-xl font-bold">Account Report</h1>
          <p className="text-sm text-gray-700">
            {startDate && endDate
              ? `${format(new Date(startDate), 'MMMM d, yyyy')} - ${format(new Date(endDate), 'MMMM d, yyyy')}`
              : 'All Time'}
          </p>
        </div>

        {/* Report Table */}
        <div className="px-4">
          {isLoading ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">No transactions found</p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="grid grid-cols-8 gap-4 p-4 text-sm font-medium text-[#7d7d7d]">
                <div className="flex items-center">
                  Code Series
                  <ChevronsUpDown size={14} className="ml-1" />
                </div>
                <div className="flex items-center">
                  Transactions Date
                  <ChevronsUpDown size={14} className="ml-1" />
                </div>
                <div className="flex items-center">
                  Type
                  <ChevronsUpDown size={14} className="ml-1" />
                </div>
                <div className="flex items-center">
                  Description
                  <ChevronsUpDown size={14} className="ml-1" />
                </div>
                <div className="flex items-center">
                  Name
                  <ChevronsUpDown size={14} className="ml-1" />
                </div>
                <div className="flex items-center">
                  Account full name
                  <ChevronsUpDown size={14} className="ml-1" />
                </div>
                <div className="flex items-center">
                  Amount
                  <ChevronsUpDown size={14} className="ml-1" />
                </div>
                <div className="flex items-center">
                  Balance
                  <ChevronsUpDown size={14} className="ml-1" />
                </div>
              </div>

              {/* Grouped Transactions */}
              {Object.entries(groupedTransactions).map(
                ([accountCode, transactionGroup]) => (
                  <div key={accountCode} className="mb-4 space-y-4">
                    {/* Group Header */}
                    <div
                      className="grid cursor-pointer grid-cols-8 gap-4 rounded-2xl border p-4 hover:bg-gray-50"
                      onClick={() => toggleRow(accountCode)}
                    >
                      <div className="flex items-center font-medium">
                        {expandedRows[accountCode] ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronUp size={16} />
                        )}
                        <span className="ml-2">
                          {accountCode} ({transactionGroup.length})
                        </span>
                      </div>
                      <div className="col-span-3 font-medium">
                        {transactionGroup[0]?.accountingAccountId?.accountName}
                      </div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>

                    {/* Expanded Rows */}
                    {expandedRows[accountCode] && (
                      <>
                        {transactionGroup.map((transaction) => (
                          <div
                            key={transaction._id}
                            className="grid grid-cols-8 gap-4 rounded-2xl border p-4 text-sm"
                          >
                            <div
                              title={
                                transaction.accountingAccountId?.accountCode ||
                                ''
                              }
                            >
                              {transaction.accountingAccountId?.accountCode}
                            </div>
                            <div
                              title={format(
                                new Date(transaction.createdAt),
                                'dd/MM/yyyy'
                              )}
                            >
                              {format(
                                new Date(transaction.createdAt),
                                'dd/MM/yyyy'
                              )}
                            </div>
                            <div
                              className="capitalize"
                              title={transaction.type || ''}
                            >
                              {transaction.type}
                            </div>
                            <div
                              className="truncate"
                              title={transaction.description || 'N/A'}
                            >
                              {transaction.description || 'N/A'}
                            </div>
                            <div title={getTransactionName(transaction)}>
                              {getTransactionName(transaction)}
                            </div>
                            <div
                              title={
                                transaction.accountingAccountId?.accountName ||
                                ''
                              }
                            >
                              {transaction.accountingAccountId?.accountName}
                            </div>
                            <div
                              title={formatCurrency(
                                transaction.amount,
                                transaction.invoiceId?.currency
                              )}
                            >
                              {formatCurrency(
                                transaction.amount,
                                transaction.invoiceId?.currency
                              )}
                            </div>
                            <div
                              title={formatCurrency(
                                getBalanceByAccountType(transaction),
                                transaction.invoiceId?.currency
                              )}
                            >
                              {formatCurrency(
                                getBalanceByAccountType(transaction),
                                transaction.invoiceId?.currency
                              )}
                            </div>
                          </div>
                        ))}
                        {/* Total Row */}
                        <div className="grid grid-cols-8 gap-4 rounded-2xl border p-4 text-sm font-medium">
                          <div>Total</div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                          <div>
                            {formatCurrency(
                              calculateGroupTotal(transactionGroup)
                            )}
                          </div>
                          <div></div>
                        </div>
                      </>
                    )}
                  </div>
                )
              )}
            </>
          )}
        </div>

        {/* Report Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm font-medium text-[#292D32]">
            {format(new Date(), "EEEE, MMMM d, yyyy h:mmaaa 'GMT' XXX")}
          </p>
        </div>
      </div>
    </div>
  );
}
