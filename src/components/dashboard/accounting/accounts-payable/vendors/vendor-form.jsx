import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UploadIcon, X, CalendarIcon, StoreIcon } from 'lucide-react';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';

// Zod schema for form validation
const vendorSchema = z.object({
  vendorName: z.string().min(1, 'Vendor name is required'),
  category: z.string().min(1, 'Category is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  gender: z.enum(['Male', 'Female'], {
    required_error: 'Gender is required',
  }),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  phoneNumber2: z.string().optional(),
  businessName: z.string().min(1, 'Business name is required'),
  dateOfRegistration: z.date({
    required_error: 'Date of registration is required',
  }),
  websitePortfolioLink: z.string().optional(),
  registrationNumber: z.string().min(1, 'Registration number is required'),
  taxId: z.string().min(1, 'Tax ID is required'),
  typeOfIncorporation: z.string().min(1, 'Type of incorporation is required'),
  taxClearanceCertificate: z.any().optional(),
  incorporationCertificate: z.any().optional(),
  companyLogo: z.any().optional(),
  picture: z.any().optional(),
});

export default function AddVendorForm({
  open,
  onOpenChange,
  showSuccessModal,
}) {
  const [dragActive, setDragActive] = useState({
    taxClearance: false,
    incorporation: false,
    companyLogo: false,
    picture: false,
  });
  const [uploadedFiles, setUploadedFiles] = useState({
    taxClearance: [],
    incorporation: [],
    companyLogo: [],
    picture: [],
  });

  // React Hook Form setup
  const form = useForm({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      vendorName: '',
      category: '',
      nationality: '',
      gender: '',
      phoneNumber: '',
      phoneNumber2: '',
      businessName: '',
      dateOfRegistration: undefined,
      websitePortfolioLink: '',
      registrationNumber: '',
      taxId: '',
      typeOfIncorporation: '',
      taxClearanceCertificate: null,
      incorporationCertificate: null,
      companyLogo: null,
      picture: null,
    },
  });

  const { handleSubmit, control, reset } = form;

  const handleDrag = (uploadType, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive((prev) => ({ ...prev, [uploadType]: true }));
    } else if (e.type === 'dragleave') {
      setDragActive((prev) => ({ ...prev, [uploadType]: false }));
    }
  };

  const handleDrop = (uploadType, e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive((prev) => ({ ...prev, [uploadType]: false }));
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(uploadType, e.dataTransfer.files);
    }
  };

  const handleFiles = (uploadType, files) => {
    const fileArray = Array.from(files);
    setUploadedFiles((prev) => ({
      ...prev,
      [uploadType]: [...prev[uploadType], ...fileArray],
    }));
  };

  const removeFile = (uploadType, index) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [uploadType]: prev[uploadType].filter((_, i) => i !== index),
    }));
  };

  const handleCancel = () => {
    reset();
    setUploadedFiles({
      taxClearance: [],
      incorporation: [],
      companyLogo: [],
      picture: [],
    });
    onOpenChange?.(false);
  };

  const onSubmit = (data) => {
    console.log('Vendor data:', data);
    console.log('Uploaded files:', uploadedFiles);
    // Logic to save vendor
    reset();
    setUploadedFiles({
      taxClearance: [],
      incorporation: [],
      companyLogo: [],
      picture: [],
    });
    onOpenChange?.(false);
    if (showSuccessModal) {
      showSuccessModal();
    }
  };

  const renderUploadArea = (uploadType, label) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div
        className={`bg-muted rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          dragActive[uploadType]
            ? 'border-primary bg-blue-50'
            : 'border-gray-300'
        }`}
        onDragEnter={(e) => handleDrag(uploadType, e)}
        onDragLeave={(e) => handleDrag(uploadType, e)}
        onDragOver={(e) => handleDrag(uploadType, e)}
        onDrop={(e) => handleDrop(uploadType, e)}
      >
        <div className="flex flex-col items-center space-y-3">
          <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
            <UploadIcon className="text-primary h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium">
              Click or drag file to this area to upload
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Support for a single or bulk upload.
            </p>
          </div>
          <input
            type="file"
            multiple
            onChange={(e) => handleFiles(uploadType, e.target.files)}
            className="hidden"
            id={`file-upload-${uploadType}`}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() =>
              document.getElementById(`file-upload-${uploadType}`).click()
            }
          >
            Browse Files
          </Button>
        </div>
      </div>

      {/* Display uploaded files */}
      {uploadedFiles[uploadType].length > 0 && (
        <div className="mt-3">
          <p className="mb-2 text-sm font-medium">Uploaded Files:</p>
          <div className="space-y-2">
            {uploadedFiles[uploadType].map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded bg-gray-50 p-2"
              >
                <span className="text-sm">{file.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(uploadType, index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[90%] max-w-4xl overflow-y-auto p-8 sm:max-w-4xl">
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

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 py-4">
            {/* Personal Details Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Personal Details</h3>

              <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
                {/* Vendor Name */}
                <div className="space-y-2">
                  <FormField
                    control={control}
                    name="vendorName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vendor Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter vendor name"
                            {...field}
                            className="h-10 w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="link"
                    className="text-primary h-auto p-0"
                  >
                    + Select vendor
                  </Button>
                </div>

                {/* Category */}
                <FormField
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="supplier">Supplier</SelectItem>
                          <SelectItem value="contractor">Contractor</SelectItem>
                          <SelectItem value="service-provider">
                            Service Provider
                          </SelectItem>
                          <SelectItem value="consultant">Consultant</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
                {/* Gender */}
                <FormField
                  control={control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Male" id="male" />
                            <Label htmlFor="male">Male</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Female" id="female" />
                            <Label htmlFor="female">Female</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Nationality */}
                <FormField
                  control={control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationality</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter nationality"
                          {...field}
                          className="h-10 w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
                {/* Phone Number - Full Width */}
                <FormField
                  control={control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter phone number"
                          {...field}
                          className="h-10 w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="phoneNumber2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number 2 (optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter phone number"
                          {...field}
                          className="h-10 w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Business Information Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Business Information</h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Business Name */}
                <FormField
                  control={control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Business name"
                          {...field}
                          className="h-10 w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Date of Registration */}
                <FormField
                  control={control}
                  name="dateOfRegistration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Registration</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={`h-10 w-full pl-3 text-left font-normal ${
                                !field.value && 'text-muted-foreground'
                              }`}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Choose date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="min-w-80 p-0" align="start">
                          <Calendar
                            className={'w-full'}
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Website/Portfolio Link */}
                <FormField
                  control={control}
                  name="websitePortfolioLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website/Portfolio Link</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Website link"
                          {...field}
                          className="h-10 w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Registration Number */}
                <FormField
                  control={control}
                  name="registrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter RC Number"
                          {...field}
                          className="h-10 w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Tax ID */}
                <FormField
                  control={control}
                  name="taxId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter tax id"
                          {...field}
                          className="h-10 w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Type Of Incorporation */}
                <FormField
                  control={control}
                  name="typeOfIncorporation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type Of Incorporation</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="llc">
                            Limited Liability Company (LLC)
                          </SelectItem>
                          <SelectItem value="corporation">
                            Corporation
                          </SelectItem>
                          <SelectItem value="partnership">
                            Partnership
                          </SelectItem>
                          <SelectItem value="sole-proprietorship">
                            Sole Proprietorship
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* File Upload Sections */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderUploadArea(
                'taxClearance',
                'Upload Tax Clearance Certificate'
              )}
              {renderUploadArea(
                'incorporation',
                'Upload Incorporation Certificate'
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {renderUploadArea(
                'companyLogo',
                'Upload Company Logo (optional)'
              )}
              {renderUploadArea('picture', 'Upload Picture (optional)')}
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                className="h-10 min-w-[113px]"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button type="submit" className="h-10 min-w-[156px]">
                Add Vendor
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
