import { Button } from '@/components/ui/button';
import { DownloadIcon, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import AccountingTable from '@/components/dashboard/accounting/table';
import EmptyBudget from '@/components/dashboard/accounting/budgeting/overview/empty-state';
import BudgetForm from '@/components/dashboard/accounting/budgeting/overview/budget-form';
import { AppDialog } from '@/components/core/app-dialog';
import { PiggyBank } from 'lucide-react';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import BudgetCard from '@/components/dashboard/accounting/budgeting/overview/budget-card';

// Mock data
const sampleData = [
  {
    id: 'Q1 2025',
    name: 'Marketing Budget',
    type: 'Profit and loss',
    date: 'Mar 2025-Feb2025',
    lastModifiedBy: 'James Doe',
    timeModified: 'Thur 12:23pm'
  },
  {
    id: 'Q2 2025',
    name: 'Marketing Budget',
    type: 'Profit and loss',
    date: 'Mar 2025-Feb2025',
    lastModifiedBy: 'James Doe',
    timeModified: 'Thur 12:23pm'
  },
  {
    id: 'Q3 2025',
    name: 'Marketing Budget',
    type: 'Profit and loss',
    date: 'Mar 2025-Feb2025',
    lastModifiedBy: 'James Doe',
    timeModified: 'Thur 12:23pm'
  },
  {
    id: 'Q4 2025',
    name: 'Marketing Budget',
    type: 'Profit and loss',
    date: 'Mar 2025-Feb2025',
    lastModifiedBy: 'James Doe',
    timeModified: 'Thur 12:23pm'
  }
]

export default function Budgeting() {
  
  const [budgets] = useState([...sampleData])
  const [openBudgetForm, setOpenBudgetForm] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  const handleOnCreateBudget = () => {
    setOpenBudgetForm(false)
    setIsSuccessModalOpen(true)
  }

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

  // State for table selection
  const [selectedItems, setSelectedItems] = useState([]);

  // Handle table item selection
  const handleSelectItem = (itemId, checked) => {
    setSelectedItems((prevItems) => {
      if (checked) {
        return [...prevItems, itemId];
      } else {
        return prevItems.filter((id) => id !== itemId);
      }
    });
  };

  // Handle select all functionality
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(budgets.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Table columns configuration
  const tableColumns = [
    {
      key: 'id',
      label: 'No',
    },
    {
      key: 'name',
      label: 'Name',
      className: 'font-medium',
    },
    {
      key: 'type',
      label: 'Type',
    },
    {
      key: 'date',
      label: 'Date',
    },
    {
      key: 'lastModifiedBy',
      label: 'Last Modified By',
    },
    {
      key: 'timeModified',
      label: 'Time Modified',
    },
  ];

  // Dropdown actions for each row
  const dropdownActions = [
    { key: 'run-budget', label: 'Run Budget vs. Actuals report' },
    { key: 'run-overveiw', label: 'Run Budget Overview report' },
    { key: 'archive', label: 'Archive' },
    { key: 'duplicate', label: 'Duplicate' },
    { key: 'delete', label: 'Delete' },
  ];

  // Pagination data
  const paginationData = {
    page: 1,
    totalPages: 6,
    pageSize: 12,
    totalCount: 64,
  };

  const handleRowAction = (action, item) => {
    console.log(`Action ${action} on item:`, item);

    // Implement row action logic here
    switch (action) {
      case 'view':
        break;
    }
  };

  return (
    <div className='my-4 min-h-screen'>
    { !budgets.length ? <EmptyBudget onClick={() => setOpenBudgetForm(true)} /> : 
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
        <div className="relative mt-10">
          <AccountingTable
            title="Budgets"
            data={budgets}
            columns={tableColumns}
            searchFields={[]}
            searchPlaceholder="Search......"
            dropdownActions={dropdownActions}
            paginationData={paginationData}
            selectedItems={selectedItems}
            handleSelectItem={handleSelectItem}
            handleSelectAll={handleSelectAll}
            onRowAction={handleRowAction}
            isProductTable
            showDataSize
            itemComponent={BudgetCard}
          />
        </div>
      </>}
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
    </div>
  );
}
