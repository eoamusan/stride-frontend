import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon, DownloadIcon, SettingsIcon } from 'lucide-react';
import ExpenseForm from '@/components/dashboard/accounting/expense-mgmt/overview/expense-form';
import ExpenseTransactionsSkeleton from '@/components/dashboard/accounting/expense-mgmt/overview/expense-transactions-skeleton';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import AccountingTable from '@/components/dashboard/accounting/table';
import ExpenseService from '@/api/expense';
import { format, startOfMonth, endOfMonth, startOfDay } from 'date-fns';

export default function ExpenseTransactions() {
  const [openExpenseForm, setOpenExpenseForm] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paginationData, setPaginationData] = useState({
    totalDocs: 0,
    limit: 20,
    totalPages: 1,
    page: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Fetch expenses and vendors
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const response = await ExpenseService.fetch();
      const expenseData = response.data?.data?.expenses || [];
      setExpenses(expenseData);
      setPaginationData({
        totalDocs: response.data?.data?.totalDocs || 0,
        limit: response.data?.data?.limit || 20,
        totalPages: response.data?.data?.totalPages || 1,
        page: response.data?.data?.page || 1,
        hasNextPage: response.data?.data?.hasNextPage || false,
        hasPrevPage: response.data?.data?.hasPrevPage || false,
      });
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setExpenses([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate metrics from expenses
  const expensesMetrics = useMemo(() => {
    if (!expenses.length) {
      return [
        { title: 'Total Expenses', value: '$0' },
        { title: 'This Month', value: '$0' },
        { title: 'Average Daily', value: '$0' },
        { title: 'Categories', value: 0 },
      ];
    }

    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum, expense) => {
      const expenseTotal =
        expense.categoryDetails?.reduce(
          (catSum, cat) => catSum + (cat.amount || 0),
          0
        ) || 0;
      return sum + expenseTotal;
    }, 0);

    // Calculate this month's expenses
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const thisMonthExpenses = expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.paymentDate);
        return expenseDate >= monthStart && expenseDate <= monthEnd;
      })
      .reduce((sum, expense) => {
        const expenseTotal =
          expense.categoryDetails?.reduce(
            (catSum, cat) => catSum + (cat.amount || 0),
            0
          ) || 0;
        return sum + expenseTotal;
      }, 0);

    // Calculate average daily expenses
    const uniqueDays = new Set(
      expenses.map((expense) =>
        startOfDay(new Date(expense.paymentDate)).toISOString()
      )
    ).size;
    const averageDaily = uniqueDays > 0 ? totalExpenses / uniqueDays : 0;

    // Count unique categories
    const categoriesSet = new Set();
    expenses.forEach((expense) => {
      expense.categoryDetails?.forEach((cat) => {
        if (cat.category) categoriesSet.add(cat.category);
      });
    });

    return [
      {
        title: 'Total Expenses',
        value: `$${totalExpenses.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      },
      {
        title: 'This Month',
        value: `$${thisMonthExpenses.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      },
      {
        title: 'Average Daily',
        value: `$${averageDaily.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
      },
      {
        title: 'Categories',
        value: categoriesSet.size,
      },
    ];
  }, [expenses]);

  // Transform expenses data for the table
  const transactionData = useMemo(() => {
    return expenses.map((expense, index) => {
      const totalAmount =
        expense.categoryDetails?.reduce(
          (sum, cat) => sum + (cat.amount || 0),
          0
        ) || 0;

      const mainCategory = expense.categoryDetails?.[0]?.category || 'N/A';

      return {
        id: expense._id || expense.id,
        no: String(index + 1).padStart(4, '0'),
        date: expense.paymentDate
          ? format(new Date(expense.paymentDate), 'dd/MM/yyyy')
          : 'N/A',
        type: 'Expense',
        payer: '-', // Will be provided by backend later
        category: mainCategory,
        total: `$${totalAmount.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        status: 'Completed',
        paymentMethod: expense.paymentMethod,
        refNo: expense.refNo || 'N/A',
      };
    });
  }, [expenses]);

  // Selection handlers
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(transactionData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId, checked) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    }
  };

  // Row action handler
  const handleRowAction = (action, item) => {
    console.log('Action:', action, 'Item:', item);
    // Handle different actions here
  };

  const handleExpenseSuccess = async () => {
    setOpenSuccessModal(true);
    // Refresh expenses after creation
    await fetchExpenses();
  };

  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Expense Transactions</h1>
          <p className="text-sm text-[#7D7D7D]">
            Track and manage all your expenses
          </p>
        </hgroup>

        <div className="flex space-x-4">
          <Button
            onClick={() => setOpenExpenseForm(true)}
            className={'h-10 rounded-2xl text-sm'}
          >
            <PlusCircleIcon className="size-4" />
            Record Expense
          </Button>
          <Button size={'icon'} className={'size-10'} variant={'outline'}>
            <DownloadIcon size={16} />
          </Button>
          <Button size={'icon'} className={'size-10'} variant={'outline'}>
            <SettingsIcon size={16} />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="my-10">
          <ExpenseTransactionsSkeleton />
        </div>
      ) : (
        <div className="my-10 space-y-10">
          <Metrics metrics={expensesMetrics} />
          <AccountingTable
            title="Expenses Transaction"
            data={transactionData}
            columns={[
              { key: 'no', label: 'No' },
              { key: 'date', label: 'Date' },
              { key: 'type', label: 'Type' },
              { key: 'payer', label: 'Payer' },
              { key: 'category', label: 'Category' },
              { key: 'total', label: 'Total' },
            ]}
            searchFields={['no', 'payer', 'category', 'type']}
            searchPlaceholder="Search amount or category ......"
            selectedItems={selectedItems}
            handleSelectAll={handleSelectAll}
            handleSelectItem={handleSelectItem}
            onRowAction={handleRowAction}
            dropdownActions={[
              { key: 'view', label: 'View Details' },
              { key: 'edit', label: 'Edit' },
              { key: 'delete', label: 'Delete' },
            ]}
            paginationData={{
              page: paginationData.page,
              totalPages: paginationData.totalPages,
              pageSize: paginationData.limit,
              totalCount: paginationData.totalDocs,
            }}
            onPageChange={(page) => {
              setPaginationData((prev) => ({ ...prev, page }));
              // TODO: Implement pagination API call if backend supports it
            }}
          />
        </div>
      )}

      <ExpenseForm
        open={openExpenseForm}
        onOpenChange={setOpenExpenseForm}
        onSuccess={handleExpenseSuccess}
      />
      <SuccessModal
        open={openSuccessModal}
        onOpenChange={setOpenSuccessModal}
        backText={'Back'}
        title={'Expense Recorded'}
        description={"You've successfully added an expense"}
      />
    </div>
  );
}
