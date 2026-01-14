import { useCallback, useState } from 'react';
import AccountingTable from '@/components/dashboard/accounting/table';
import EmptyBudget from '@/components/dashboard/accounting/budgeting/overview/empty-state';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import BudgetCard from '@/components/dashboard/accounting/budgeting/overview/budget-card';
import BudgetHeader from '@/components/dashboard/accounting/budgeting/shared/budget-header';
import { cn } from '@/lib/utils';

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
  
  // State for table selection
  const [selectedItems, setSelectedItems] = useState([]);
  const [ openBudgetForm, setOpenBudgetForm ] = useState(false)
  const [budgets] = useState([...sampleData])

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

  const handleSetOpenBudgetForm = useCallback((value) => {
    setOpenBudgetForm(value)
  }, [])

  return (
    <div className='my-4 min-h-screen'>
    <div className={cn(!budgets.length && 'hidden')}>
      <BudgetHeader triggerBudgetForm={openBudgetForm} setTriggerBudgetForm={handleSetOpenBudgetForm} />
    </div>
    { !budgets.length ? <EmptyBudget onClick={() => handleSetOpenBudgetForm(true)} /> : 
      <>
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
    </div>
  );
}
