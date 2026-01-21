import MultiStepForm from "@/components/dashboard/accounting/shared/multi-step-form";
import { useState } from "react";
import SuccessModal from "../../success-modal";
import CompanyInformation from "./company-information-form";
import TaxConfiguration from "./tax-configuration-form";
import RemittanceSchedule from "./remittance-schedule-form";

export default function TaxForm() {
  const steps = [
    {
      id: 1,
      name: 'Company Information',
      component: CompanyInformation
    },
    {
      id: 2,
      name: 'Tax Configuration',
      component: TaxConfiguration
    },
    {
      id: 3,
      name: 'Remittance schedule',
      component: RemittanceSchedule
    },
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