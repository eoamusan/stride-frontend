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
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import youtubeIcon from '@/assets/icons/youtube-red.png';
import AccountService from '@/api/accounts';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function AccountReportPage() {
  const location = useLocation();
  const navigate = useNavigate();

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
      return total + parseFloat(transaction.balance || 0);
    }, 0);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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
          <Button className={'h-10 rounded-2xl text-sm'}>Save as</Button>
        </div>
      </div>

      {/* Account Report Section */}
      <div className="mt-8 rounded-xl bg-white py-6">
        {/* Report Header */}
        <div className="mb-6 text-center">
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
                      <div className="font-medium">
                        {transactionGroup[0]?.accountingAccountId?.accountName}
                      </div>
                      <div></div>
                      <div></div>
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
                            <div>
                              {transaction.accountingAccountId?.accountCode}
                            </div>
                            <div>
                              {format(
                                new Date(transaction.createdAt),
                                'dd/MM/yyyy'
                              )}
                            </div>
                            <div className="capitalize">{transaction.type}</div>
                            <div className="truncate">
                              {transaction.description || 'N/A'}
                            </div>
                            <div>{getTransactionName(transaction)}</div>
                            <div>
                              {transaction.accountingAccountId?.accountName}
                            </div>
                            <div>{formatCurrency(transaction.balance)}</div>
                            <div>{formatCurrency(transaction.balance)}</div>
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
