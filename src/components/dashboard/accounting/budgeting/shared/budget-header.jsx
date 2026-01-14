import { Button } from '@/components/ui/button';
import { DownloadIcon, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import BudgetForm from '@/components/dashboard/accounting/budgeting/overview/budget-form';
import { AppDialog } from '@/components/core/app-dialog';
import { PiggyBank } from 'lucide-react';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import Metrics from '../../invoicing/plain-metrics';

const BudgetHeader = ( { triggerBudgetForm, setTriggerBudgetForm }) => {

  const budgetMetrics = useMemo(() => {
    return [
      {
        title: 'Total Budget',
        value: 2000,
      },
      {
        title: 'Actual Spend',
        value: 3000,
      },
      {
        title: 'Variance',
        value: 1500,
      },
      {
        title: 'Forecast Accuracy',
        value: 1000,
      },
    ]
  })

  const [openBudgetForm, setOpenBudgetForm] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  const handleOnCreateBudget = () => {
    setOpenBudgetForm(false)
    setTriggerBudgetForm(false)
    setIsSuccessModalOpen(true)
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
      <div className="mt-10">
        <Metrics metrics={budgetMetrics} />
      </div>

      <AppDialog 
        title="How do you want to set up your budget?"
        headerIcon={<PiggyBank />} 
        open={openBudgetForm} 
        onOpenChange={setOpenBudgetForm}
      >
        <BudgetForm onCreateBudget={handleOnCreateBudget} />
      </AppDialog>

      <SuccessModal
        title={'Budget Created'}
        description={"You've successfully created a budget."}
        open={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
        backText={'Back'}
        handleBack={() => {
          setIsSuccessModalOpen(false);
        }} 
      />
    </>
  );
};

export default BudgetHeader;
