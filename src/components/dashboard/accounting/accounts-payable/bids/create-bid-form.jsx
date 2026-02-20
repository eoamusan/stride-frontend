import { useState, useRef, useEffect } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
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
import BidsService from '@/api/bids';
import VendorService from '@/api/vendor';
import { uploadToCloudinary } from '@/lib/cloudinary';
import toast from 'react-hot-toast';
import { useUserStore } from '@/stores/user-store';

// Zod schema for form validation
const bidSchema = z.object({
  bidTitle: z.string().min(1, 'Bid title is required'),
  description: z.string().optional(),
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
  requireTaxClearance: z.boolean().default(false),
  requireCacCertificate: z.boolean().default(false),
  supportingDocumentLink: z.string().optional(),
});

export default function CreateBidForm({ open, onOpenChange, onSuccess }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [justChangedStep, setJustChangedStep] = useState(false);
  const businessId = useUserStore((state) => state.activeBusiness?._id);

  // Document upload states
  const [bidImagePreview, setBidImagePreview] = useState(null);
  const [bidImageUrl, setBidImageUrl] = useState('');
  const [supportingDocFile, setSupportingDocFile] = useState(null);
  const [supportingDocUrl, setSupportingDocUrl] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Vendor selection states
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [vendorSearch, setVendorSearch] = useState('');
  const [vendors, setVendors] = useState([]);
  const [isLoadingVendors, setIsLoadingVendors] = useState(false);

  const bidImageInputRef = useRef();
  const supportingDocInputRef = useRef();

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
      requireTaxClearance: false,
      requireCacCertificate: false,
      supportingDocumentLink: '',
    },
  });

  // Fetch vendors when bid type is private
  useEffect(() => {
    const fetchVendors = async () => {
      if (form.watch('bidType') === 'private') {
        setIsLoadingVendors(true);
        try {
          const response = await VendorService.fetch();
          const vendorData = response.data.data.vendors || [];
          // Transform vendor data to match the required format
          const formattedVendors = vendorData.map((vendor) => ({
            id: vendor._id,
            name: vendor.businessInformation?.businessName || 'Unknown Vendor',
            category: vendor.businessInformation?.category || 'Unknown',
            initials: (vendor.businessInformation?.businessName || 'UV')
              .split(' ')
              .map((word) => word[0])
              .join('')
              .toUpperCase()
              .slice(0, 2),
          }));
          setVendors(formattedVendors);
        } catch (error) {
          console.error('Error fetching vendors:', error);
          toast.error('Failed to fetch vendors');
        } finally {
          setIsLoadingVendors(false);
        }
      }
    };

    fetchVendors();
  }, [form]);

  const { handleSubmit, control, reset } = form;

  const handleNext = () => {
    if (currentStep < 3) {
      setJustChangedStep(true);
      setCurrentStep(currentStep + 1);

      // Reset the flag after a short delay
      setTimeout(() => setJustChangedStep(false), 100);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCancel = () => {
    reset();
    setBidImagePreview(null);
    setBidImageUrl('');
    setSupportingDocFile(null);
    setSupportingDocUrl('');
    setSelectedVendors([]);
    setCurrentStep(1);
    onOpenChange?.(false);
  };

  const onSubmit = async (data) => {
    // Prevent submission if not on final step
    if (currentStep !== 3) {
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        businessId,
        bid: {
          title: data.bidTitle,
          vendorType: data.vendorType,
          startDate: data.startDate,
          expirationDate: data.expirationDate,
          image: bidImageUrl || '',
        },
        bidBusinessDocument: {
          biddersToUploadTaxClearanceCert: data.requireTaxClearance,
          biddersToUploadCAC: data.requireCacCertificate,
          bidDescription: data.description || '',
          documentUrl: supportingDocUrl || data.supportingDocumentLink || '',
        },
        bidSettings: {
          type: data.bidType,
          vendorIds: data.bidType === 'private' ? selectedVendors : [],
        },
      };

      await BidsService.create({ data: payload });

      toast.success('Bid created successfully!');
      reset();
      setBidImagePreview(null);
      setBidImageUrl('');
      setSupportingDocFile(null);
      setSupportingDocUrl('');
      setSelectedVendors([]);
      setCurrentStep(1);
      onOpenChange?.(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating bid:', error);
      toast.error(error.response?.data?.message || 'Failed to create bid');
    } finally {
      setIsSubmitting(false);
    }
  };

  // File upload handlers
  const handleBidImageSelect = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setBidImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary immediately
      setIsUploadingImage(true);
      try {
        const uploadResult = await uploadToCloudinary(file, {
          folder: 'bids/images',
          tags: ['bid-image', businessId],
        });
        setBidImageUrl(uploadResult.url);
        toast.success('Image uploaded successfully!');
      } catch (error) {
        console.error('Error uploading bid image:', error);
        toast.error('Failed to upload image. Please try again.');
        setBidImagePreview(null);
      } finally {
        setIsUploadingImage(false);
      }
    }
  };

  const handleSupportingDocSelect = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSupportingDocFile(file);

      // Upload to Cloudinary immediately
      setIsUploadingDoc(true);
      try {
        const uploadResult = await uploadToCloudinary(file, {
          folder: 'bids/documents',
          tags: ['bid-document', businessId],
        });
        setSupportingDocUrl(uploadResult.url);
        toast.success('Document uploaded successfully!');
      } catch (error) {
        console.error('Error uploading supporting document:', error);
        toast.error('Failed to upload document. Please try again.');
        setSupportingDocFile(null);
      } finally {
        setIsUploadingDoc(false);
      }
    }
  };

  const handleSupportingDocDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleSupportingDocDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleSupportingDocDrop = async (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      setSupportingDocFile(file);

      // Upload to Cloudinary immediately
      setIsUploadingDoc(true);
      try {
        const uploadResult = await uploadToCloudinary(file, {
          folder: 'bids/documents',
          tags: ['bid-document', businessId],
        });
        setSupportingDocUrl(uploadResult.url);
        toast.success('Document uploaded successfully!');
      } catch (error) {
        console.error('Error uploading supporting document:', error);
        toast.error('Failed to upload document. Please try again.');
        setSupportingDocFile(null);
      } finally {
        setIsUploadingDoc(false);
      }
    }
  };

  const removeBidImage = () => {
    setBidImagePreview(null);
    setBidImageUrl('');
    if (bidImageInputRef.current) {
      bidImageInputRef.current.value = '';
    }
  };

  const removeSupportingDoc = () => {
    setSupportingDocFile(null);
    setSupportingDocUrl('');
    if (supportingDocInputRef.current) {
      supportingDocInputRef.current.value = '';
    }
  };

  // Vendor selection handlers
  const handleSelectAllVendors = (checked) => {
    if (checked) {
      setSelectedVendors(vendors.map((v) => v.id));
    } else {
      setSelectedVendors([]);
    }
  };

  const handleVendorToggle = (vendorId) => {
    setSelectedVendors((prev) =>
      prev.includes(vendorId)
        ? prev.filter((id) => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const filteredVendors = vendors.filter((v) =>
    v.name.toLowerCase().includes(vendorSearch.toLowerCase())
  );

  const renderStepIndicator = () => (
    <div className="mb-8 flex items-center justify-center">
      <div className="flex items-center space-x-3">
        {/* Step 1 */}
        <div className="flex flex-col items-center gap-2">
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
          <p className="ml-2 hidden text-sm font-medium sm:inline">
            Basic Information
          </p>
        </div>

        {/* Connector */}
        <div className="h-px w-12 bg-gray-300 sm:w-20"></div>

        {/* Step 2 */}
        <div className="flex flex-col items-center gap-2">
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
          <p className="ml-2 hidden text-sm font-medium sm:inline">
            Business Documents
          </p>
        </div>

        {/* Connector */}
        <div className="h-px w-12 bg-gray-300 sm:w-20"></div>

        {/* Step 3 */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
              currentStep >= 3
                ? 'bg-[#254C00] text-white'
                : 'bg-gray-200 text-gray-600'
            )}
          >
            3
          </div>
          <p className="ml-2 hidden text-sm font-medium sm:inline">
            Bid Settings
          </p>
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

      {/* Vendor Type */}
      <FormField
        control={control}
        name="vendorType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vendor Type</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="h-10 w-full">
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                <PopoverContent className="w-auto p-0" align="start">
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
                <PopoverContent className="w-auto p-0" align="start">
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

      {/* Bid Image Upload */}
      <div className="space-y-2">
        <Label>Attach an image that captures what bid is about</Label>
        <input
          type="file"
          ref={bidImageInputRef}
          onChange={handleBidImageSelect}
          accept="image/*"
          className="hidden"
        />

        {bidImagePreview ? (
          <div className="relative rounded-lg border-2 border-dashed border-gray-300 p-4">
            <img
              src={bidImagePreview}
              alt="Bid preview"
              className="mx-auto max-h-48 rounded-lg object-contain"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeBidImage}
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white p-0 shadow-md hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div
            onClick={() => bidImageInputRef.current?.click()}
            className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 hover:bg-gray-50"
          >
            <UploadIcon className="mx-auto h-12 w-12 text-blue-500" />
            <p className="mt-4 text-base font-medium text-gray-700">
              Click or drag file to this area to upload
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Support for a single or bulk upload.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Tax Clearance Certificate Question */}
      <FormField
        control={control}
        name="requireTaxClearance"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Do you want bidders to upload Tax Clearance Certificate ?
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => field.onChange(value === 'yes')}
                value={field.value ? 'yes' : 'no'}
                className="flex gap-8"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="tax-yes" />
                  <Label htmlFor="tax-yes" className="font-normal">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="tax-no" />
                  <Label htmlFor="tax-no" className="font-normal">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* CAC Certificate Question */}
      <FormField
        control={control}
        name="requireCacCertificate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Do you want bidders to upload CAC Certificate ?
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => field.onChange(value === 'yes')}
                value={field.value ? 'yes' : 'no'}
                className="flex gap-8"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="cac-yes" />
                  <Label htmlFor="cac-yes" className="font-normal">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="cac-no" />
                  <Label htmlFor="cac-no" className="font-normal">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Bid Description */}
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bid Description</FormLabel>
            <FormControl>
              <div className="rounded-md border">
                <RichTextEditor
                  placeholder="Enter bid description..."
                  currentValue={field.value}
                  setCurrentValue={field.onChange}
                  className="min-h-40"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Supporting Document */}
      <div className="space-y-3">
        <Label>Kindly attach supporting document</Label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <input
              type="file"
              ref={supportingDocInputRef}
              onChange={handleSupportingDocSelect}
              accept=".pdf,.doc,.docx,image/*"
              className="hidden"
            />

            {supportingDocFile ? (
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center space-x-3">
                  <div className="rounded bg-blue-100 p-2">
                    <UploadIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {supportingDocFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(supportingDocFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeSupportingDoc}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                onClick={() => supportingDocInputRef.current?.click()}
                onDragOver={handleSupportingDocDragOver}
                onDragLeave={handleSupportingDocDragLeave}
                onDrop={handleSupportingDocDrop}
                className={cn(
                  'cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors',
                  isDragOver
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                )}
              >
                <UploadIcon className="mx-auto h-10 w-10 text-blue-500" />
                <p className="mt-3 text-sm font-medium text-gray-700">
                  Click or drag file to this area to upload
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Support for a single or bulk upload.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-start">
            <FormField
              control={control}
              name="supportingDocumentLink"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      placeholder="Paste Document Link"
                      {...field}
                      className="h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
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
                className="flex gap-8"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="type-private" />
                  <Label htmlFor="type-private" className="font-normal">
                    Private
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="type-public" />
                  <Label htmlFor="type-public" className="font-normal">
                    Public
                  </Label>
                </div>
              </RadioGroup>
            </FormControl>
            <p className="text-sm text-gray-600">
              While Public Bids are visible to all vendors (including vendors
              outside of Stride). Private bids are only visible to vendors on
              your list.
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Vendor Selection (only for Private bids) */}
      {form.watch('bidType') === 'private' && (
        <div className="max-w-[320px] space-y-4 rounded-xl p-2 shadow">
          {/* Search */}
          <div className="relative">
            <Input
              placeholder="Search"
              value={vendorSearch}
              onChange={(e) => setVendorSearch(e.target.value)}
              className="h-10"
            />
          </div>

          {/* Select All */}
          <div className="flex items-center space-x-2 border-b pb-3">
            <Checkbox
              id="select-all"
              checked={selectedVendors.length === vendors.length}
              onCheckedChange={handleSelectAllVendors}
            />
            <label
              htmlFor="select-all"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Select all
            </label>
          </div>

          {/* Vendor List */}
          <div className="max-h-64 space-y-3 overflow-y-auto">
            {isLoadingVendors ? (
              <div className="py-8 text-center text-sm text-gray-500">
                Loading vendors...
              </div>
            ) : filteredVendors.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">
                No vendors found
              </div>
            ) : (
              filteredVendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="flex items-center space-x-3 py-2"
                >
                  <Checkbox
                    id={`vendor-${vendor.id}`}
                    checked={selectedVendors.includes(vendor.id)}
                    onCheckedChange={() => handleVendorToggle(vendor.id)}
                  />
                  <div className="text-primary flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold">
                    {vendor.initials}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {vendor.name}
                    </p>
                    <p className="text-xs text-gray-500">{vendor.category}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
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
          <form
            onSubmit={(e) => {
              if (currentStep !== 3 || justChangedStep) {
                e.preventDefault();
                return;
              }
              handleSubmit(onSubmit)(e);
            }}
            onKeyDown={(e) => {
              // Prevent Enter key from submitting form on steps 1-2
              if (e.key === 'Enter' && currentStep !== 3) {
                e.preventDefault();
              }
            }}
            className="mt-6"
          >
            {renderStepIndicator()}

            <div className="mt-8">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-end gap-4 pt-6">
              {currentStep === 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="h-10 w-full max-w-29.25 rounded-xl text-sm"
                >
                  Cancel
                </Button>
              )}

              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="h-10 w-full max-w-29.25 rounded-xl text-sm"
                >
                  Back
                </Button>
              )}

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="h-10 w-full max-w-29.25 rounded-xl text-sm"
                  disabled={isUploadingImage || isUploadingDoc}
                >
                  {isUploadingImage || isUploadingDoc ? 'Uploading...' : 'Next'}
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="h-10 w-full max-w-29.25 rounded-xl text-sm"
                  disabled={isSubmitting || isUploadingImage || isUploadingDoc}
                >
                  {isSubmitting
                    ? 'Creating...'
                    : isUploadingImage || isUploadingDoc
                      ? 'Uploading...'
                      : 'Create Bid'}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
