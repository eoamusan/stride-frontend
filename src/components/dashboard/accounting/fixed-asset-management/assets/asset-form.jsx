import MultiStepForm from "@/components/dashboard/accounting/shared/multi-step-form";
import AssetInformationForm from "./asset-information-form";
import PurchaseDetailsForm from "./purchase-details-form";
import LocationForm from "./location-form";
import StatusConditionForm from "./status-condition-form";
import InsuranceForm from "./insurance-form";
import FileUploadForm from "./file-upload-form";
import { useEffect, useState } from "react";

export default function AssetForm({onCreateAsset, formValues}) {
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
    onCreateAsset(data);
  }

  const [initialValues, setInitialValues] = useState()
  useEffect(() => {
    const values = {
      assetId: formValues?.asset?._id || '',
      assetName: formValues?.asset?.assetName || '',
      assetType: formValues?.asset?.assetType || '',
      serialNo: formValues?.asset?.serialNo || '',
      category: formValues?.asset?.category?._id || '',
      subCategory: formValues?.asset?.subCategory || '',
      description: formValues?.asset?.description || '',
      purchaseDate: formValues?.purchaseDetails?.createdAt || null,
      pon: formValues?.purchaseDetails?.pon || '',
      purchasePrice: formValues?.purchaseDetails?.purchasePrice || 0,
      supplier: formValues?.purchaseDetails?.supplier || '',
      warrantyStartDate: formValues?.purchaseDetails?.warrantyStartDate ? new Date(formValues.purchaseDetails.warrantyStartDate) : null,
      warrantyEndDate: formValues?.purchaseDetails?.warrantyEndDate ? new Date(formValues.purchaseDetails.warrantyEndDate) : null,
      building: formValues?.location?.building || '',
      floor: formValues?.location?.floor || '',
      room: formValues?.location?.room || '',
      department: formValues?.location?.department || '',
      assignedTo: formValues?.location?.assignedTo || '',
      assignmentDate: formValues?.location?.assignmentDate || null,
      initialStatus: formValues?.status?.initialStatus || '',
      conditionalAssessment: formValues?.status?.conditionalAssessment || '',
      notes: formValues?.status?.notes || '',
      insuranceCompany: formValues?.insurance.insuranceCompany || '',
      plan: formValues?.insurance.plan || '',
      risk: formValues?.insurance.risk || '',
      startDate: formValues?.insurance.startDate ? new Date(formValues.insurance.startDate) : null,
      endDate: formValues?.insurance.endDate ? new Date(formValues.insurance.endDate) : null,
      sumIssued: formValues?.insurance.sumIssued || 0,
      exclusions: formValues?.insurance.exclusions || '',
      claimMade: formValues?.insurance.claimMade || true,
      date: formValues?.insurance.date ? new Date(formValues.insurance.date) : null,
      insuranceDocuments: formValues?.insurance.documents || [],
      assetPhotos: formValues?.assetFile?.assetPhotos || [],
      assetDocuments: formValues?.assetFile?.documents || [],
      assetPhoto: formValues?.assetFile?.photo || '',
      item: { ...formValues }
    }
    console.log("Initial form values:", values)
    setInitialValues(values)
  }, [formValues])

  return (
    <>
      <MultiStepForm steps={steps} onSubmit={handleFormSubmit} initialValues={initialValues} />
    </>
  )
}