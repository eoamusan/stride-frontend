import { useState } from 'react';
import EmptyExpense from '@/components/dashboard/accounting/expense-mgmt/overview/empty-state';
import ExpenseForm from '@/components/dashboard/accounting/expense-mgmt/overview/expense-form';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import RecentTransactionCard from '@/components/dashboard/accounting/overview/transactions-card';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import PieMetricCard from '@/components/dashboard/pie-metric-card';
import SimpleAreaMetricCard from '@/components/dashboard/simple-area-metric-card';
import { Button } from '@/components/ui/button';
import { DownloadIcon, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import RangeOverviewCard from '@/components/dashboard/range-card';

const expenses = [''];
const expensesMetrics = [
  {
    title: 'Total Expenses',
    value: '$675',
  },
  {
    title: 'This Month',
    value: 64,
  },
  {
    title: 'Average Daily',
    value: 64,
  },
  {
    title: 'Categories',
    value: 10,
  },
];

const monthlyTrendsData = [
  { date: '2024-01-01', value: 70000 },
  { date: '2024-02-01', value: 18000 },
  { date: '2024-03-01', value: 32000 },
  { date: '2024-04-01', value: 20000 },
  { date: '2024-05-01', value: 41000 },
  { date: '2024-06-01', value: 12000 },
  { date: '2024-07-01', value: 57000 },
  { date: '2024-08-01', value: 15000 },
  { date: '2024-09-01', value: 57000 },
  { date: '2024-10-01', value: 52000 },
  { date: '2024-11-01', value: 95000 },
  { date: '2024-12-01', value: 42000 },
];
const chartConfig = [
  {
    dataKey: 'value',
    color: '#6366F1',
  },
];

// Pie chart data for Inventory Distribution & Total Value
const inventoryDistributionData = [
  {
    name: 'Electronics',
    value: 93,
    percentage: 31.0,
    totalValue: '$234',
    color: '#6366f1', // indigo-500
  },
  {
    name: 'Home & Garden',
    value: 85,
    percentage: 28.33,
    totalValue: '$45',
    color: '#22c55e', // green-500
  },
  {
    name: 'Fresh Produce',
    value: 53,
    percentage: 17.67,
    totalValue: '$34',
    color: '#f59e0b', // amber-500
  },
  {
    name: 'Dairy Products',
    value: 43,
    percentage: 14.33,
    totalValue: '$66',
    color: '#06b6d4', // cyan-500
  },
  {
    name: 'Stationery',
    value: 26,
    percentage: 8.67,
    totalValue: '$44',
    color: '#8b5cf6', // violet-500
  },
];

const inventoryDistributionConfig = {
  Electronics: {
    label: 'Electronics',
    color: '#6366f1',
  },
  'Home & Garden': {
    label: 'Home & Garden',
    color: '#22c55e',
  },
  'Fresh Produce': {
    label: 'Fresh Produce',
    color: '#f59e0b',
  },
  'Dairy Products': {
    label: 'Dairy Products',
    color: '#06b6d4',
  },
  Stationery: {
    label: 'Stationery',
    color: '#8b5cf6',
  },
};

export default function ExpenseManagement() {
  const [openExpenseForm, setOpenExpenseForm] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  return (
    <div className="my-4 min-h-screen">
      {expenses && expenses.length === 0 ? (
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
                  chartConfig={inventoryDistributionConfig}
                  chartData={inventoryDistributionData}
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
        onSuccess={() => setOpenSuccessModal(true)}
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
