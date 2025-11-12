import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { StoreIcon } from 'lucide-react';
import PersonalDetailsStep from './steps/personal-details';
import BusinessInformationStep from './steps/business-information';
import ContactStep from './steps/contact';
import AttachmentsStep from './steps/attachments';
import BankDetailsStep from './steps/bank-details';
import StepIndicator from './step-indicator';
import VendorService from '@/api/vendor';
import { useUserStore } from '@/stores/user-store';
import { uploadMultipleToCloudinary } from '@/lib/cloudinary';

// Multi-step configuration
const STEPS = [
  { id: 1, name: 'Personal Details', key: 'personalDetails' },
  { id: 2, name: 'Business Information', key: 'businessInformation' },
  { id: 3, name: 'Contact', key: 'contact' },
  { id: 4, name: 'Attachments', key: 'attachments' },
  { id: 5, name: 'Bank Details', key: 'bankDetails' },
];

// Separate schemas for each step
const personalDetailsSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  gender: z.enum(['Male', 'Female'], {
    required_error: 'Gender is required',
  }),
});

const businessInformationSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  serviceCategory: z.string().min(1, 'Service category is required'),
  registrationNumber: z.string().min(1, 'Registration number is required'),
  dateOfRegistration: z.date({
    required_error: 'Date of registration is required',
  }),
  typeOfIncorporation: z.string().min(1, 'Type of incorporation is required'),
  taxId: z.string().min(1, 'Tax ID is required'),
});

const contactSchema = z.object({
  streetAddress: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  phoneNumber1: z.string().min(1, 'Phone number is required'),
  phoneNumber2: z.string().optional(),
  emailAddress: z.email('Invalid email address'),
  websitePortfolioLink: z.string().optional(),
});

const attachmentsSchema = z.object({
  incorporationCertificate: z.any().optional(),
  companyLogo: z.any().optional(),
  taxClearanceCertificate: z.any().optional(),
  vendorPassport: z.any().optional(),
});

const bankDetailsSchema = z.object({
  accountName: z.string().min(1, 'Account name is required'),
  accountNumber: z.string().min(1, 'Account number is required'),
  bankName: z.string().min(1, 'Bank name is required'),
  branchSortCode: z.string().optional(),
  fnbUniversalCode: z.string().optional(),
  swiftCode: z.string().optional(),
});

export default function AddVendorForm({
  open,
  onOpenChange,
  showSuccessModal,
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countries, setCountries] = useState([]);
  const [vendorId, setVendorId] = useState(null);
  const [attachmentFiles, setAttachmentFiles] = useState({
    taxClearance: [],
    incorporation: [],
    companyLogo: [],
    vendorPassport: [],
  });

  const businessId = useUserStore((state) => state.businessData?._id);

  // Fetch countries when modal opens
  useEffect(() => {
    async function fetchCountries() {
      if (!open) return;
      try {
        const response = await fetch(
          'https://restcountries.com/v3.1/all?fields=name,flags,cca2'
        );
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    }
    fetchCountries();
  }, [open]);

  // Get schema for current step
  const getStepSchema = () => {
    switch (currentStep) {
      case 1:
        return personalDetailsSchema;
      case 2:
        return businessInformationSchema;
      case 3:
        return contactSchema;
      case 4:
        return attachmentsSchema;
      case 5:
        return bankDetailsSchema;
      default:
        return z.object({});
    }
  };

  // React Hook Form setup with dynamic schema
  const form = useForm({
    resolver: zodResolver(getStepSchema()),
    defaultValues: {
      // Personal Details
      firstName: '',
      lastName: '',
      nationality: '',
      gender: '',
      // Business Information
      businessName: '',
      serviceCategory: '',
      registrationNumber: '',
      dateOfRegistration: undefined,
      typeOfIncorporation: '',
      taxId: '',
      // Contact
      streetAddress: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
      phoneNumber1: '',
      phoneNumber2: '',
      emailAddress: '',
      websitePortfolioLink: '',
      // Attachments (handled separately in AttachmentsStep component)
      incorporationCertificate: null,
      companyLogo: null,
      taxClearanceCertificate: null,
      vendorPassport: null,
      // Bank Details
      accountName: '',
      accountNumber: '',
      bankName: '',
      branchSortCode: '',
      fnbUniversalCode: '',
      swiftCode: '',
    },
    mode: 'onChange',
  });

  const { control, reset, trigger } = form;

  // Load saved progress from localStorage
  useEffect(() => {
    if (open) {
      const savedProgress = localStorage.getItem('vendorFormProgress');
      if (savedProgress) {
        try {
          const progress = JSON.parse(savedProgress);
          setVendorId(progress.vendorId);
          setCurrentStep(progress.currentStep);
          setCompletedSteps(progress.completedSteps);
          form.reset(progress.formData);
        } catch (error) {
          console.error('Error loading saved progress:', error);
        }
      }
    }
  }, [open, form]);

  // Save progress to localStorage whenever form data changes
  useEffect(() => {
    if (vendorId) {
      const progress = {
        vendorId,
        currentStep,
        completedSteps,
        formData: form.getValues(),
      };
      localStorage.setItem('vendorFormProgress', JSON.stringify(progress));
    }
  }, [vendorId, currentStep, completedSteps, form]);

  // Step navigation handlers
  const handleNext = async () => {
    // Validate current step fields
    const isValid = await trigger();

    if (isValid) {
      setIsSubmitting(true);

      try {
        const stepData = form.getValues();
        let currentVendorId = vendorId;

        // Step 1: Personal Details - Create vendor
        if (currentStep === 1) {
          const payload = {
            businessId,
            firstName: stepData.firstName,
            lastName: stepData.lastName,
            nationality: stepData.nationality,
            gender: stepData.gender,
            above18: true,
          };

          const response = await VendorService.create({ data: payload });

          // Store vendor ID for subsequent steps
          if (response.data?.data) {
            currentVendorId = response.data?.data?.vendor?.id;
            setVendorId(currentVendorId);
          }
        }

        // Step 2: Business Information
        if (currentStep === 2 && currentVendorId) {
          const payload = {
            businessName: stepData.businessName,
            category: stepData.serviceCategory,
            regNo: stepData.registrationNumber,
            regDate: stepData.dateOfRegistration,
            typeOfInc: stepData.typeOfIncorporation,
            taxId: stepData.taxId,
          };

          const response = await VendorService.addBusinessInfo({
            data: payload,
            id: currentVendorId,
          });
          console.log('Business info added:', response);
        }

        // Step 3: Contact
        if (currentStep === 3 && currentVendorId) {
          const payload = {
            address: stepData.streetAddress,
            city: stepData.city,
            state: stepData.state,
            country: stepData.country,
            zipCode: stepData.zipCode,
            phoneNumber1: stepData.phoneNumber1,
            phoneNumber2: stepData.phoneNumber2 || '',
            email: stepData.emailAddress,
            websiteLink: stepData.websitePortfolioLink || '',
          };

          const response = await VendorService.addContact({
            data: payload,
            id: currentVendorId,
          });
          console.log('Contact info added:', response);
        }

        // Step 4: Attachments
        if (currentStep === 4 && currentVendorId) {
          // Upload files to Cloudinary
          const fileUrls = {
            ci: '', // Incorporation certificate
            cl: '', // Company logo
            tcc: '', // Tax clearance certificate
            vp: '', // Vendor passport
          };

          // Upload incorporation certificate
          if (attachmentFiles.incorporation.length > 0) {
            const uploadResults = await uploadMultipleToCloudinary(
              attachmentFiles.incorporation,
              {
                folder: 'vendors/incorporation',
                tags: ['vendor', currentVendorId],
              }
            );
            fileUrls.ci = uploadResults[0]?.url || '';
          }

          // Upload company logo
          if (attachmentFiles.companyLogo.length > 0) {
            const uploadResults = await uploadMultipleToCloudinary(
              attachmentFiles.companyLogo,
              {
                folder: 'vendors/logo',
                tags: ['vendor', currentVendorId],
              }
            );
            fileUrls.cl = uploadResults[0]?.url || '';
          }

          // Upload tax clearance certificate
          if (attachmentFiles.taxClearance.length > 0) {
            const uploadResults = await uploadMultipleToCloudinary(
              attachmentFiles.taxClearance,
              {
                folder: 'vendors/tax-clearance',
                tags: ['vendor', currentVendorId],
              }
            );
            fileUrls.tcc = uploadResults[0]?.url || '';
          }

          // Upload vendor passport
          if (attachmentFiles.vendorPassport.length > 0) {
            const uploadResults = await uploadMultipleToCloudinary(
              attachmentFiles.vendorPassport,
              {
                folder: 'vendors/passport',
                tags: ['vendor', currentVendorId],
              }
            );
            fileUrls.vp = uploadResults[0]?.url || '';
          }

          // Send file URLs to API
          const response = await VendorService.addAttachments({
            data: fileUrls,
            id: currentVendorId,
          });
          console.log('Attachments added:', response);
        }

        // Step 5: Bank Details
        if (currentStep === 5 && currentVendorId) {
          const payload = {
            accountName: stepData.accountName,
            accountNumber: stepData.accountNumber,
            bankName: stepData.bankName,
            sortCode: stepData.branchSortCode || '',
            fnbCode: stepData.fnbUniversalCode || '',
            swiftCode: stepData.swiftCode || '',
          };

          const response = await VendorService.addBankDetails({
            data: payload,
            id: currentVendorId,
          });
          console.log('Bank details added:', response);

          // Last step completed successfully - clear saved progress and show success modal
          localStorage.removeItem('vendorFormProgress');
          clearProgress();
          handleClose();

          if (showSuccessModal) {
            showSuccessModal();
          }

          return; // Exit early since we're done
        }

        // Mark step as completed
        setCompletedSteps((prev) => [...new Set([...prev, currentStep])]);

        if (currentStep < STEPS.length) {
          setCurrentStep((prev) => prev + 1);
        }
      } catch (error) {
        console.error('Error saving vendor data:', error);
        // TODO: Show error toast notification
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleClose = () => {
    // Don't clear progress - allow user to continue later
    onOpenChange?.(false);
  };

  const clearProgress = () => {
    localStorage.removeItem('vendorFormProgress');
    reset();
    setCurrentStep(1);
    setCompletedSteps([]);
    setVendorId(null);
  };

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalDetailsStep control={control} countries={countries} />;
      case 2:
        return <BusinessInformationStep control={control} />;
      case 3:
        return <ContactStep control={control} countries={countries} />;
      case 4:
        return <AttachmentsStep onFilesChange={setAttachmentFiles} />;
      case 5:
        return <BankDetailsStep control={control} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] w-[95%] max-w-3xl overflow-y-auto p-8 sm:max-w-3xl">
        <div className="flex gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#254C00] text-white">
            <StoreIcon className="size-4" />
          </div>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              Add New Vendor
            </DialogTitle>
            <DialogDescription>
              Manage your vendor relationships and contact information
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Progress Indicator */}
        <StepIndicator
          currentStep={currentStep}
          completedSteps={completedSteps}
        />

        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleNext();
            }}
            className="space-y-8 py-4"
          >
            {/* Render Current Step Content */}
            {renderStepContent()}

            {/* Footer Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              {currentStep > 1 && (
                <Button
                  type="button"
                  className="h-10 min-w-[113px]"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                className="h-10 min-w-[156px]"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Saving...'
                  : currentStep === STEPS.length
                    ? 'Add'
                    : 'Next'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
