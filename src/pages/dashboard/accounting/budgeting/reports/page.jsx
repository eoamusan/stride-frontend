
import { useMemo } from 'react';
import AccountingTable from '@/components/dashboard/accounting/table';
import EmptyBudget from '@/components/dashboard/accounting/budgeting/overview/empty-state';
import BudgetForm from '@/components/dashboard/accounting/budgeting/overview/budget-form';
import { AppDialog } from '@/components/core/app-dialog';
import { PiggyBank } from 'lucide-react';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import BudgetCard from '@/components/dashboard/accounting/budgeting/overview/budget-card';
import BudgetHeader from '@/components/dashboard/accounting/budgeting/shared/budget-header';

export default function BudgetingAnalytics() {
  // Mock computed data
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

  return (
    <div className='my-4 min-h-screen'>
      <>
        <BudgetHeader />
        <div className="mt-10">
          <Metrics metrics={budgetMetrics} />
        </div>
        <div className="relative mt-10">
          
        </div>
      </>
    </div>
  );
}
