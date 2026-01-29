import { Button } from '@/components/ui/button';
import { DownloadIcon, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import BudgetForm from '@/components/dashboard/accounting/budgeting/overview/budget-form';
import { AppDialog } from '@/components/core/app-dialog';
import { PiggyBank } from 'lucide-react';
import Metrics from '../../invoicing/plain-metrics';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import YoutubeVideoGuideButton from '../../shared/youtube-video-guide-button';
import useBudgetAnalytics from '@/hooks/budgeting/useBudgetAnalytics';

const BudgetHeader = ( { triggerBudgetForm, setTriggerBudgetForm, prepareCustomBudgetForm }) => {

  const [selectedValue, setSelectedValue] = useState('revenue');
  const { data: analyticsData, loading: loadingAnalytics } = useBudgetAnalytics();

  const handleOnChange = (value) => {
    setSelectedValue(value);
  }

  const budgetMetrics = useMemo(() => {
    const isRevenue = selectedValue === 'revenue';
    const { totalBudget, actualSpend, variance } = analyticsData || {};

    const totalRevenueOrExpenseBudget = isRevenue ? totalBudget?.totalInvoiceBudget : totalBudget?.totalExpenseBudget
    const totalActualRevenueOrExpense = isRevenue ? actualSpend?.totalActualInvoice : actualSpend?.totalActualExpense
    const varianceAmount = isRevenue ? variance?.invoiceVariance : variance?.expenseVariance

    
    const accuracy = (1 - (totalActualRevenueOrExpense - totalRevenueOrExpenseBudget)/100) * 100;
    const formattedAccuracy = accuracy.toFixed(2) + '%';

    return [
      {
        title: isRevenue ? 'Total Budget' : 'Total Expense Budget',
        value: totalRevenueOrExpenseBudget,
      },
      {
        title: isRevenue ? 'Actual Spend' : 'Actual Expense Spend',
        value: totalActualRevenueOrExpense,
      },
      {
        title: 'Variance',
        value: varianceAmount,
      },
      {
        title: 'Forecast Accuracy',
        value: formattedAccuracy,
      },
    ]
  }, [analyticsData, selectedValue]);

  const [openBudgetForm, setOpenBudgetForm] = useState(false);

  const handlePrepareCustomBudgetForm = (budgetPayload) => {
    setOpenBudgetForm(false)
    prepareCustomBudgetForm(budgetPayload)
  }

  useEffect(() => {
    setOpenBudgetForm(triggerBudgetForm)
  }, [triggerBudgetForm])

  useEffect(() => {
    setTriggerBudgetForm?.(openBudgetForm)
  }, [openBudgetForm, setTriggerBudgetForm])

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Budgeting & Forecasting</h1>
          <p className="text-sm text-[#7D7D7D]">
            Manage budgets, forecasts, and financial planning
          </p>
        </hgroup>

        <div className="flex space-x-4">
          <YoutubeVideoGuideButton url="" />
          <Button
            onClick={() => setOpenBudgetForm(true)}
            className={'h-10 rounded-2xl text-sm'}
          >
            <PlusCircleIcon className="size-4" />
            Create Budget
          </Button>
          <Button size={'icon'} className={'size-10'} variant={'outline'}>
            <DownloadIcon size={16} />
          </Button>
          <Button size={'icon'} className={'size-10'} variant={'outline'}>
            <SettingsIcon size={16} />
          </Button>
        </div>
      </div>

      <div className='flex mt-4'>
          <div className='w-1/5'>
            <Select onValueChange={handleOnChange} value={selectedValue}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

      <div className="mt-10">
        <Metrics metrics={budgetMetrics} loading={loadingAnalytics} />
      </div>

      <AppDialog 
        title="How do you want to set up your budget?"
        headerIcon={<PiggyBank />} 
        open={openBudgetForm} 
        onOpenChange={setOpenBudgetForm}
        className='sm:max-w-130'
      >
        <BudgetForm prepareCustomBudgetForm={handlePrepareCustomBudgetForm} onCancel={() => setOpenBudgetForm(false)} />
      </AppDialog>
    </>
  );
};

export default BudgetHeader;