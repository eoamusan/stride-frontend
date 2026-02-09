import CustomBudgetForm from "@/components/dashboard/accounting/budgeting/overview/custom-budget-form";
import SuccessModal from "@/components/dashboard/accounting/success-modal";
import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router";

export default function CreateBudget() {

  const navigate = useNavigate()
  const location = useLocation()

  const { state } = location
  const budgetPayload = state?.budgetPayload
  
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState({visible: false, isCreate: true});

  const handleOnCreateBudget = useCallback(() => {
      setIsSuccessModalOpen({visible: true, isCreate: true})
      // redirect to budget overview page after creation
      navigate('/dashboard/accounting/budgeting/overview')
    }, [navigate]);

  const handleOnUpdateBudget = useCallback(() => {
    setIsSuccessModalOpen({visible: true, isCreate: false})
    navigate('/dashboard/accounting/budgeting/overview')
  }, [navigate]);

  return (
    <>
    <div className="my-4 min-h-screen">
      <CustomBudgetForm formValues={budgetPayload} onCreateBudget={() => handleOnCreateBudget()} onUpdateBudget={() => handleOnUpdateBudget()} />

      <SuccessModal
        title={isSuccessModalOpen.isCreate ? 'Budget Created' : 'Budget Updated'}
        description={isSuccessModalOpen.isCreate ? "You've successfully created a budget." : "You've successfully updated the budget."}
        open={isSuccessModalOpen.visible}
        onOpenChange={() => setIsSuccessModalOpen({visible: false, isCreate: true})}
        backText={'Back'}
        handleBack={() => {
          setIsSuccessModalOpen({visible: false, isCreate: true});
        }} 
      />
    </div>
    </>
  )
}