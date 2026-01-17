import MultiStepForm from "@/components/dashboard/accounting/shared/multi-step-form";
import AssetInformationForm from "./asset-information-form";
import PurchaseDetailsForm from "./purchase-details-form";
import LocationForm from "./location-form";
import StatusConditionForm from "./status-condition-form";
import InsuranceForm from "./insurance-form";
import FileUploadForm from "./file-upload-form";

export default function AssetForm() {

  const steps = [
    {
      id: 1,
      name: 'Asset Information',
      component: AssetInformationForm
    },
    {
      id: 2,
      name: 'Purchase Details',
      component: PurchaseDetailsForm
    },
    {
      id: 3,
      name: 'Location',
      component: LocationForm
    },
    {
      id: 4,
      name: 'Status & Condition',
      component: StatusConditionForm
    },
    {
      id: 5,
      name: 'Insurance',
      component: InsuranceForm
    },
    {
      id: 6,
      name: 'File Uploads',
      component: FileUploadForm
    },
  ]

  const handleFormSubmit = (data) => {
    console.log("Final form data:", data)
  }

  return (
    <MultiStepForm steps={steps} onSubmit={handleFormSubmit} />
  )
}