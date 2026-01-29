import { useCallback, useEffect, useState } from 'react';
import AccountingTable from '@/components/dashboard/accounting/table';
import BudgetCard from '@/components/dashboard/accounting/budgeting/overview/budget-card';
import BudgetHeader from '@/components/dashboard/accounting/budgeting/shared/budget-header';
import useBudgeting from '@/hooks/budgeting/useBudgeting';
import { useSearchParams } from 'react-router';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import CustomBudgetForm from '@/components/dashboard/accounting/budgeting/overview/custom-budget-form';

export default function Budgeting() {

  const [searchParams, ] = useSearchParams()
  
  // State for table selection
  const [selectedItems, setSelectedItems] = useState([]);
  const [ openBudgetForm, setOpenBudgetForm ] = useState(false)
  const [showCustomBudgetForm, setShowCustomBudgetForm] = useState(false)
  const [customBudgetFormValues, setCustomBudgetFormValues] = useState(null)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState({visible: false, isCreate: true});
  

  const { budgets, loading, paginationData, fetchBudgets } = useBudgeting();

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
      key: 'format',
      label: 'Format',
    },
    {
      key: 'scope',
      label: 'Scope',
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
    { key: 'edit-budget', label: 'View Budget' },
    // { key: 'run-budget', label: 'Run Budget vs. Actuals report' },
    // { key: 'run-overview', label: 'Run Budget Overview report' },
    { key: 'archive', label: 'Archive' },
    { key: 'duplicate', label: 'Duplicate' },
    { key: 'delete', label: 'Delete' },
  ];

  const [, setSearchParams] = useSearchParams() 
  const handleRowAction = (action, item) => {
    console.log(`Action ${action} on item:`, item);

    // Implement row action logic here
    switch (action) {
      case 'edit-budget':
        setSearchParams(prev => {
          const params = new URLSearchParams(prev);
          const budgetName = item.budgetName;
          params.set("budget", budgetName);
          return params;
        });
        setCustomBudgetFormValues(item);
        setShowCustomBudgetForm(true);
        break;
    }
  };

  const handlePrepareBudgetForm = useCallback((payload) => {
    console.log("Preparing custom budget form with payload: ", payload);
    setOpenBudgetForm(false)
    setShowCustomBudgetForm(true)
    setCustomBudgetFormValues(payload)
  }, []);

  const handleOnCreateBudget = useCallback(() => {
    setIsSuccessModalOpen({visible: true, isCreate: true})
    fetchBudgets()
  }, [fetchBudgets]);

  const handleOnUpdateBudget = useCallback(() => {
    setIsSuccessModalOpen({visible: true, isCreate: false})
    fetchBudgets()
  }, [fetchBudgets]);

  useEffect(() => {
    if (!searchParams.get("budget")) {
      setShowCustomBudgetForm(false);
      setCustomBudgetFormValues(null);
    }
  }, [searchParams]);


  return (
    <div className='my-4 min-h-screen'>
    { showCustomBudgetForm ? <CustomBudgetForm formValues={customBudgetFormValues} onCreateBudget={() => handleOnCreateBudget()} onUpdateBudget={() => handleOnUpdateBudget()} /> :
    <>
      <BudgetHeader triggerBudgetForm={openBudgetForm} budgetCreated={fetchBudgets} prepareCustomBudgetForm={handlePrepareBudgetForm}  />
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
          isLoading={loading}
          itemComponent={BudgetCard}
        />
      </div>
    </>
    }
      <SuccessModal
        title={isSuccessModalOpen.isCreate ? 'Budget Created' : 'Budget Updated'}
        description={isSuccessModalOpen.isCreate ? "You've successfully created a budget." : "You've successfully updated the budget."}
        open={isSuccessModalOpen.visible}
        onOpenChange={() => setIsSuccessModalOpen({visible: false, isCreate: true})}
        backText={'Back'}
        handleBack={() => {
          setIsSuccessModalOpen(false);
        }} 
      />
    </div>
  );
}
