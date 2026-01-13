import { useState } from 'react'
import EmptyBudget from '@/components/dashboard/accounting/budgeting/overview/empty-state';
import BudgetForm from '@/components/dashboard/accounting/budgeting/overview/budget-form';
import { AppDialog } from '@/components/core/app-dialog';
import { PiggyBank } from 'lucide-react';

export default function Budgeting() {
  const [budgets, setBudgets] = useState([])
  const [openBudgetForm, setOpenBudgetForm] = useState(false);

  return (
    <div className="my-4 min-h-screen">
      {
        !budgets.length ? <EmptyBudget onClick={() => setOpenBudgetForm(true)} /> : ''
      }
      <AppDialog 
        title="How do you want to set up your budget?"
        headerIcon={<PiggyBank />} 
        open={openBudgetForm} 
        onOpenChange={setOpenBudgetForm}
      >
        <BudgetForm />
      </AppDialog>
      
    </div>
  );
}
