import { useState, useRef } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { CalendarIcon, StoreIcon, UploadIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import RichTextEditor from '@/components/dashboard/rich-text-editor';

// Zod schema for form validation
const bidSchema = z.object({
  bidTitle: z.string().min(1, 'Bid title is required'),
  description: z.string().min(1, 'Description is required'),
  vendorType: z.string().min(1, 'Vendor type is required'),
  startDate: z.date({
    required_error: 'Start date is required',
  }),
  expirationDate: z.date({
    required_error: 'Expiration date is required',
  }),
  bidType: z.enum(['private', 'public'], {
    required_error: 'Bid type is required',
  }),
});

export default function CreateBidForm({ open, onOpenChange, onSuccess }) {
  const [currentStep, setCurrentStep] = useState(1);

  // Document upload states
  const [taxClearanceType, setTaxClearanceType] = useState('private');
  const [taxClearanceFile, setTaxClearanceFile] = useState(null);
  const [cacCertificateFile, setCacCertificateFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const taxFileInputRef = useRef();
  const cacFileInputRef = useRef();

  // React Hook Form setup
  const form = useForm({
    resolver: zodResolver(bidSchema),
    defaultValues: {
      bidTitle: '',
      description: '',
      vendorType: '',
      startDate: undefined,
      expirationDate: undefined,
      bidType: 'private',
    },
  });

  const { handleSubmit, control, reset } = form;

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    reset();
    setTaxClearanceFile(null);
    setCacCertificateFile(null);
    setCurrentStep(1);
    onOpenChange?.(false);
  };

  const onSubmit = (data) => {
    console.log('Bid data:', data);
    console.log('Tax clearance file:', taxClearanceFile);
    console.log('CAC certificate file:', cacCertificateFile);
    // Logic to save bid
    reset();
    setTaxClearanceFile(null);
    setCacCertificateFile(null);
    setCurrentStep(1);
    onOpenChange?.(false);
    if (onSuccess) onSuccess();
  };

  // File upload handlers
  const handleTaxFileUpload = (file) => {
    setTaxClearanceFile(file);
  };

  const handleCacFileUpload = (file) => {
    setCacCertificateFile(file);
  };

  const handleTaxFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleTaxFileUpload(file);
    }
  };

  const handleCacFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleCacFileUpload(file);
    }
  };

  const handleCacDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleCacDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleCacDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleCacFileUpload(files[0]);
    }
  };

  const removeTaxFile = () => {
    setTaxClearanceFile(null);
    if (taxFileInputRef.current) {
      taxFileInputRef.current.value = '';
    }
  };

  const removeCacFile = () => {
    setCacCertificateFile(null);
    if (cacFileInputRef.current) {
      cacFileInputRef.current.value = '';
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8 flex items-center justify-center">
      <div className="flex items-center space-x-4">
        {/* Step 1 */}
        <div className="flex items-center">
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
              currentStep >= 1
                ? 'bg-[#254C00] text-white'
                : 'bg-gray-200 text-gray-600'
            )}
          >
            1
          </div>
          <span className="ml-2 text-sm font-medium">Basic Information</span>
        </div>

        {/* Connector */}
        <div className="h-px w-24 bg-gray-300"></div>

        {/* Step 2 */}
        <div className="flex items-center">
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
              currentStep >= 2
                ? 'bg-[#254C00] text-white'
                : 'bg-gray-200 text-gray-600'
            )}
          >
            2
          </div>
          <span className="ml-2 text-sm font-medium">Business Documents</span>
        </div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Bid Title */}
      <FormField
        control={control}
        name="bidTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bid Title</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter bid title"
                {...field}
                className="h-10 w-full"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Description */}
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <div className="rounded-md border">
                <RichTextEditor
                  placeholder="Enter bid description..."
                  currentValue={field.value}
                  setCurrentValue={field.onChange}
                  className="min-h-[200px]"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Vendor Type */}
      <FormField
        control={control}
        name="vendorType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vendor Type</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="consulting">Consulting</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="services">Services</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Start Date and Expiration Date */}
      <div className="grid grid-cols-2 gap-6">
        <FormField
          control={control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'h-10 w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
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
                <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="expirationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiration Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        'h-10 w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
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
                <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Bid Type */}
      <FormField
        control={control}
        name="bidType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bid Type</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="flex gap-16"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private" className="font-normal">
                    Private
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public" className="font-normal">
                    Public
                  </Label>
                </div>
              </RadioGroup>
            </FormControl>
            <p className="max-w-sm text-sm text-[#434343]">
              Public bids are visible to all vendors. Private bids are sent only
              to selected vendors.
            </p>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      {/* Upload Tax Clearance Certificate */}
      <div className="space-y-8">
        <h3 className="text-sm font-semibold text-[#434343]">
          Upload Tax Clearance Certificate
        </h3>

        {/* Private/Public Radio Group */}
        <div className="space-y-3">
          <RadioGroup
            value={taxClearanceType}
            onValueChange={setTaxClearanceType}
            className="flex gap-16"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="tax-private" />
              <Label htmlFor="tax-private">Private</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="tax-public" />
              <Label htmlFor="public">Public</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Tax Clearance File Upload */}
        <div className="mt- space-y-3">
          <Label>Upload Tax Clearance Certificate</Label>
          <input
            type="file"
            ref={taxFileInputRef}
            onChange={handleTaxFileSelect}
            accept=".pdf,.doc,.docx"
            className="hidden"
          />

          {taxClearanceFile ? (
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center space-x-3">
                <div className="rounded bg-blue-100 p-2">
                  <UploadIcon className="text-primary h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {taxClearanceFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(taxClearanceFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeTaxFile}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              onClick={() => taxFileInputRef.current?.click()}
              className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-gray-400 hover:bg-gray-50"
            >
              <UploadIcon className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">PDF, DOC, DOCX (max 10MB)</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload CAC Certificate */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-[#434343]">
          Upload CAC Certificate
        </h3>

        <div className="space-y-2">
          <input
            type="file"
            ref={cacFileInputRef}
            onChange={handleCacFileSelect}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            className="hidden"
          />

          {cacCertificateFile ? (
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center space-x-3">
                <div className="rounded bg-green-100 p-2">
                  <UploadIcon className="text-primary h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {cacCertificateFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(cacCertificateFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeCacFile}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              onClick={() => cacFileInputRef.current?.click()}
              onDragOver={handleCacDragOver}
              onDragLeave={handleCacDragLeave}
              onDrop={handleCacDrop}
              className={cn(
                'cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors',
                isDragOver
                  ? 'border-primary bg-primary/50'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              )}
            >
              <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-lg font-medium text-gray-900">
                Drag and drop files here
              </p>
              <p className="mt-2 text-sm text-gray-600">
                or click to browse files
              </p>
              <p className="mt-1 text-xs text-gray-500">
                PDF, DOC, DOCX, JPG, PNG (max 10MB)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader className="relative">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#254C00]">
              <StoreIcon size={16} color="white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">
                Create New Bid
              </DialogTitle>
              <DialogDescription>
                Set up a new procurement bid to connect with qualified vendors.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
            {renderStepIndicator()}

            <div className="mt-8">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="h-10 px-8 text-sm"
              >
                Cancel
              </Button>

              {currentStep === 1 && (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="h-10 px-8 text-sm"
                >
                  Next
                </Button>
              )}

              {currentStep === 2 && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="h-10 px-8 text-sm"
                  >
                    Back
                  </Button>
                  <Button type="submit" className="h-10 px-8 text-sm">
                    Create Bid
                  </Button>
                </>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
