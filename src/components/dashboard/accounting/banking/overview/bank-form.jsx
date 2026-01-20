import MultiStepForm from "@/components/dashboard/accounting/shared/multi-step-form";
import { useState } from "react";
import SuccessModal from "../../success-modal";
import BankInformation from "./bank-information-form";
import UploadCSV from "./upload-csv";

export default function BankForm() {
  const steps = [
    {
      id: 1,
      name: 'Bank Information',
      component: BankInformation
    },
    {
      id: 2,
      name: 'Upload CSV',
      component: UploadCSV
    }
  ]

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  const handleFormSubmit = (data) => {
    console.log("Final form data:", data)
    setIsSuccessModalOpen(true);
  }

  return (
    <>
      <MultiStepForm steps={steps} onSubmit={handleFormSubmit} />
      <SuccessModal
        title={'Tax Configuration Saved'}
        description={"You've successfully configured the tax settings."}
        open={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
        backText={'Back'}
        handleBack={() => {
          setIsSuccessModalOpen(false);
        }} 
      />
    </>
  )
}