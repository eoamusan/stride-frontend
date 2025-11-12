import { useState, useEffect, useMemo } from 'react';
import EmptyExpense from '@/components/dashboard/accounting/expense-mgmt/overview/empty-state';
import ExpenseForm from '@/components/dashboard/accounting/expense-mgmt/overview/expense-form';
import ExpenseSkeleton from '@/components/dashboard/accounting/expense-mgmt/overview/expense-skeleton';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import RecentTransactionCard from '@/components/dashboard/accounting/overview/transactions-card';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import PieMetricCard from '@/components/dashboard/pie-metric-card';
import SimpleAreaMetricCard from '@/components/dashboard/simple-area-metric-card';
import { Button } from '@/components/ui/button';
import { DownloadIcon, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import RangeOverviewCard from '@/components/dashboard/range-card';
import ExpenseService from '@/api/expense';
import {
  startOfMonth,
  endOfMonth,
  startOfDay,
  format as formatDate,
} from 'date-fns';

// Pie chart colors for categories
const categoryColors = [
  '#6366f1', // indigo-500
  '#22c55e', // green-500
  '#f59e0b', // amber-500
  '#06b6d4', // cyan-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#f97316', // orange-500
  '#14b8a6', // teal-500
  '#a855f7', // purple-500
  '#64748b', // slate-500
];

const chartConfig = [
  {
    dataKey: 'value',
    color: '#6366F1',
  },
];

export default function ExpenseManagement() {
  const [openExpenseForm, setOpenExpenseForm] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      setIsLoading(true);
      try {
        const response = await ExpenseService.fetch();
        setExpenses(response.data?.data?.expenses || []);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, []);

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

    // Calculate average daily expenses (based on total expenses / days with expenses)
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

  // Calculate monthly trends data
  const monthlyTrendsData = useMemo(() => {
    if (!expenses.length) return [];

    // Group expenses by month
    const monthlyData = {};
    expenses.forEach((expense) => {
      const month = formatDate(new Date(expense.paymentDate), 'yyyy-MM-01');
      const expenseTotal =
        expense.categoryDetails?.reduce(
          (sum, cat) => sum + (cat.amount || 0),
          0
        ) || 0;

      if (!monthlyData[month]) {
        monthlyData[month] = 0;
      }
      monthlyData[month] += expenseTotal;
    });

    // Convert to array and sort by date
    return Object.entries(monthlyData)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [expenses]);

  // Calculate expenses by category for pie chart
  const { categoryDistributionData, categoryDistributionConfig } =
    useMemo(() => {
      if (!expenses.length) {
        return {
          categoryDistributionData: [],
          categoryDistributionConfig: {},
        };
      }

      // Group expenses by category
      const categoryTotals = {};
      let grandTotal = 0;

      expenses.forEach((expense) => {
        expense.categoryDetails?.forEach((cat) => {
          const category = cat.category || 'Uncategorized';
          const amount = cat.amount || 0;

          if (!categoryTotals[category]) {
            categoryTotals[category] = 0;
          }
          categoryTotals[category] += amount;
          grandTotal += amount;
        });
      });

      // Convert to array and calculate percentages
      const sortedCategories = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // Top 10 categories

      const data = sortedCategories.map(([category, amount], index) => ({
        name: category,
        value: amount,
        percentage: grandTotal > 0 ? (amount / grandTotal) * 100 : 0,
        totalValue: `$${amount.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        color: categoryColors[index % categoryColors.length],
      }));

      const config = {};
      sortedCategories.forEach(([category], index) => {
        config[category] = {
          label: category,
          color: categoryColors[index % categoryColors.length],
        };
      });

      return {
        categoryDistributionData: data,
        categoryDistributionConfig: config,
      };
    }, [expenses]);

  const handleExpenseSuccess = async () => {
    setOpenSuccessModal(true);
    // Refresh expenses after successful creation
    setIsLoading(true);
    try {
      const response = await ExpenseService.fetch();
      setExpenses(response.data?.data?.expenses || []);
    } catch (error) {
      console.error('Error refreshing expenses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-4 min-h-screen">
      {isLoading ? (
        <ExpenseSkeleton />
      ) : expenses && expenses.length === 0 ? (
        <EmptyExpense onClick={() => setOpenExpenseForm(true)} />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <hgroup>
              <h1 className="text-2xl font-bold">Overview</h1>
              <p className="text-sm text-[#7D7D7D]">
                Welcome back! Here's your expense summary
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
          <div className="mt-10">
            <Metrics metrics={expensesMetrics} />

            <div className="mt-10 flex flex-col items-start gap-10 lg:flex-row">
              <div className="w-full space-y-10">
                <SimpleAreaMetricCard
                  title="Monthly Expenses"
                  chartData={monthlyTrendsData}
                  chartConfig={chartConfig}
                />

                <RecentTransactionCard
                  title={'Recent Expenses'}
                  description={'Your latest transactions'}
                />
              </div>
              <div className="w-full max-w-md space-y-10">
                <PieMetricCard
                  title="Expenses by Category"
                  chartConfig={categoryDistributionConfig}
                  chartData={categoryDistributionData}
                />
                <RangeOverviewCard />
              </div>
            </div>
          </div>
        </>
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
