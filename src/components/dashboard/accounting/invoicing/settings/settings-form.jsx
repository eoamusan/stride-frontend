import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useRef, useEffect, useMemo } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  UploadIcon,
  PlusIcon,
  RotateCcwIcon,
  XIcon,
  ChevronDown,
} from 'lucide-react';
import AddBankModal from '../add-bank';
import RichTextEditor from '@/components/dashboard/rich-text-editor';
import ColorPicker from '@/components/ui/color-picker';
import { uploadToCloudinary } from '@/lib/cloudinary';
import toast from 'react-hot-toast';
import BusinessService from '@/api/business';
import { formatDate } from 'date-fns';
import { EMAIL_TEMPLATE_VARIABLES } from '@/constants/email-template-variables';
import { useUserStore } from '@/stores/user-store';

const formSchema = z.object({
  prefix: z.string().min(1, { message: 'Invoice prefix is required' }),
  logoUrl: z.string().optional(),
  useLogo: z.boolean(),
  emailTemplate: z.string().optional(),
  terms: z.string().optional(),
  signatureUrl: z.string().optional(),
  tin: z.string().optional(),
  brandColor: z.string().default('#3B82F6'),
  template: z.string().optional(),
  bankAccounts: z
    .array(
      z.object({
        accountName: z.string(),
        accountNumber: z.string(),
        bankName: z.string(),
        tin: z.string(),
        sortCode: z.string(),
        swiftCode: z.string().optional(),
        fnbUniversalCode: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .optional(),
});

export default function SettingsForm({ businessId, initialData }) {
  const { getBusinessData } = useUserStore();
  const [uploadedLogo, setUploadedLogo] = useState(
    initialData?.logoUrl
      ? { url: initialData.logoUrl, name: 'Existing Logo', size: 0 }
      : null
  );
  const [uploadedSignature, setUploadedSignature] = useState(
    initialData?.signatureUrl
      ? { url: initialData.signatureUrl, name: 'Existing Signature', size: 0 }
      : null
  );
  const [isAddBankModalOpen, setIsAddBankModalOpen] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    initialData?.brandColor || '#3B82F6'
  );
  const [logoUploading, setLogoUploading] = useState(false);
  const [signatureUploading, setSignatureUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasFormChanged, setHasFormChanged] = useState(false);
  const [showVariables, setShowVariables] = useState(false);
  const emailEditorRef = useRef(null);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  // File removal functions
  const removeLogo = () => {
    setUploadedLogo(null);
    form.setValue('logoUrl', '');
  };

  const removeSignature = () => {
    setUploadedSignature(null);
    form.setValue('signatureUrl', '');
  };

  // Store initial values for comparison
  const initialValues = useMemo(
    () => ({
      prefix: initialData?.prefix || '',
      logoUrl: initialData?.logoUrl || '',
      useLogo: initialData?.useLogo || false,
      emailTemplate: initialData?.emailTemplate || '',
      terms: initialData?.terms || '',
      signatureUrl: initialData?.signatureUrl || '',
      tin: initialData?.tin || '',
      brandColor: initialData?.brandColor || '#3B82F6',
      template: initialData?.template || '',
      bankAccounts: initialData?.bankAccounts || [],
    }),
    [initialData]
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  // Initialize canvas for signature drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    canvas.style.width = `${canvas.offsetWidth}px`;
    canvas.style.height = `${canvas.offsetHeight}px`;

    const context = canvas.getContext('2d');
    context.scale(2, 2);
    context.lineCap = 'round';
    context.strokeStyle = '#000000';
    context.lineWidth = 2;
    contextRef.current = context;
  }, []);

  // Reset form when initialData changes (for async loading)
  useEffect(() => {
    if (initialData) {
      form.reset({
        prefix: initialData.prefix || '',
        logoUrl: initialData.logoUrl || '',
        useLogo: initialData.useLogo || false,
        emailTemplate: initialData.emailTemplate || '',
        terms: initialData.terms || '',
        signatureUrl: initialData.signatureUrl || '',
        tin: initialData.tin || '',
        brandColor: initialData.brandColor || '#3B82F6',
        template: initialData.template || '',
        bankAccounts: initialData.bankAccounts || [],
      });

      // Update file states
      if (initialData.logoUrl) {
        setUploadedLogo({
          url: initialData.logoUrl,
          name: 'Existing Logo',
          size: 0,
        });
      } else {
        setUploadedLogo(null);
      }

      if (initialData.signatureUrl) {
        setUploadedSignature({
          url: initialData.signatureUrl,
          name: 'Existing Signature',
          size: 0,
        });
      } else {
        setUploadedSignature(null);
      }

      // Update color state
      setSelectedColor(initialData.brandColor || '#3B82F6');
    }
  }, [initialData, form]);

  // Watch for form changes to enable/disable submit button
  useEffect(() => {
    const subscription = form.watch((values) => {
      // Check if current form values differ from initial values
      const hasChanged =
        JSON.stringify(values) !== JSON.stringify(initialValues) ||
        uploadedLogo?.url !== initialValues.logoUrl ||
        uploadedSignature?.url !== initialValues.signatureUrl;

      setHasFormChanged(hasChanged);
    });

    return () => subscription.unsubscribe();
  }, [form, initialValues, uploadedLogo, uploadedSignature]);

  // Canvas drawing functions
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveCanvasSignature = async () => {
    if (!canvasRef.current) return;

    setSignatureUploading(true);
    try {
      const canvas = canvasRef.current;

      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        // Create a file from the blob
        const file = new File([blob], `signature_${Date.now()}.png`, {
          type: 'image/png',
        });

        const result = await uploadToCloudinary(file, {
          folder: 'stride/signatures',
          tags: ['signature', 'canvas', 'invoice'],
        });

        const signatureData = {
          file: file,
          url: result.url,
          publicId: result.publicId,
          name: file.name,
          size: file.size,
          isCanvas: true,
        };

        setUploadedSignature(signatureData);
        form.setValue('signatureUrl', result.url);
        setSignatureUploading(false);
      }, 'image/png');
    } catch (error) {
      console.error('Canvas signature upload failed:', error);
      alert('Failed to save signature. Please try again.');
      setSignatureUploading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    // Format the data according to the expected structure
    const formattedData = {
      prefix: data.prefix,
      tin: data.tin || '',
      logoUrl: uploadedLogo?.url || data.logoUrl || '',
      useLogo: data.useLogo,
      bankAccounts: data.bankAccounts || [],
      emailTemplate: data.emailTemplate || '',
      terms: data.terms || '',
      signatureUrl: uploadedSignature?.url || data.signatureUrl || '',
      brandColor: data.brandColor,
      template: data.template || '',
    };

    try {
      await BusinessService.patchSettings({
        id: businessId,
        data: formattedData,
      });
      toast.success('Settings saved successfully');

      // Refresh business data in the store
      await getBusinessData();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          'Failed to save settings. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoUploading(true);
      try {
        const result = await uploadToCloudinary(file, {
          folder: 'stride/logos',
          tags: ['logo', 'invoice'],
        });

        const logoData = {
          file: file,
          url: result.url,
          publicId: result.publicId,
          name: file.name,
          size: file.size,
        };

        setUploadedLogo(logoData);
        form.setValue('logoUrl', result.url);
      } catch (error) {
        console.error('Logo upload failed:', error);
        alert('Failed to upload logo. Please try again.');
      } finally {
        setLogoUploading(false);
      }
    }
  };

  const handleSignatureUpload = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSignatureUploading(true);
      try {
        const result = await uploadToCloudinary(file, {
          folder: 'stride/signatures',
          tags: ['signature', 'invoice'],
        });

        const signatureData = {
          file: file,
          url: result.url,
          publicId: result.publicId,
          name: file.name,
          size: file.size,
        };

        setUploadedSignature(signatureData);
        form.setValue('signatureUrl', result.url);
      } catch (error) {
        console.error('Signature upload failed:', error);
        alert('Failed to upload signature. Please try again.');
      } finally {
        setSignatureUploading(false);
      }
    }
  };

  const addNewBank = () => {
    setIsAddBankModalOpen(true);
  };

  const bankAccounts = form.watch('bankAccounts');

  const handleSetActiveBank = (index) => {
    const currentBanks = form.getValues('bankAccounts') || [];
    const updatedBanks = currentBanks.map((bank, i) => ({
      ...bank,
      isActive: i === index,
    }));
    form.setValue('bankAccounts', updatedBanks);
  };

  const handleInsertVariable = (variable) => {
    if (emailEditorRef.current && emailEditorRef.current.insertVariable) {
      emailEditorRef.current.insertVariable(variable);
      setShowVariables(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm">
          Last modified{' '}
          {initialData?.updatedAt
            ? formatDate(initialData.updatedAt, 'PPpp')
            : 'N/A'}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Top Section - Invoice Prefix and Tax ID */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <FormField
              control={form.control}
              name="prefix"
              render={({ field }) => (
                <FormItem className={'max-w-sm'}>
                  <FormLabel>Invoice Prefix</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className={'h-10 pr-44'}
                        placeholder="INV"
                        {...field}
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-400">
                        -YYYYY-MM-DD-XXXX
                      </div>
                    </div>
                  </FormControl>
                  <p className="text-xs text-gray-400">
                    Example: {field.value || 'INV'}-2025-11-01-0001
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tin"
              render={({ field }) => (
                <FormItem className={'max-w-sm'}>
                  <FormLabel>Tax Identification Number</FormLabel>
                  <FormControl>
                    <Input
                      className={'h-10'}
                      placeholder="Enter TIN"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Bank and Logo Section */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Logo Upload Section */}
            <div className="w-full max-w-sm space-y-4">
              <FormLabel>Upload Logo</FormLabel>
              <div className="border-muted-foreground/25 flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-black/2 p-8">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                  disabled={logoUploading}
                />
                <label
                  htmlFor="logo-upload"
                  className={`cursor-pointer ${logoUploading ? 'opacity-50' : ''}`}
                >
                  <div className="flex flex-col items-center">
                    <UploadIcon className="text-primary h-8 w-8" />
                    <p className="mt-4 text-base">
                      {logoUploading
                        ? 'Uploading...'
                        : 'Click or drag file to this area to upload'}
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {logoUploading
                        ? 'Please wait while your logo is being uploaded'
                        : 'Support for a single or bulk upload.'}
                    </p>
                  </div>
                </label>
              </div>

              {uploadedLogo && (
                <div className="mt-2 flex items-center justify-between rounded border bg-gray-50 p-2">
                  <div>
                    <p className="text-sm text-gray-700">
                      📎 {uploadedLogo.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {uploadedLogo.size > 0
                        ? `${(uploadedLogo.size / 1024).toFixed(1)} KB`
                        : 'Existing file'}
                    </p>
                    {uploadedLogo.url && (
                      <a
                        href={uploadedLogo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        View Logo
                      </a>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeLogo}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <FormField
                control={form.control}
                name="useLogo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="">
                      <FormLabel>Use logo</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            {/* Bank Accounts Section */}
            <div className="space-y-4">
              <FormLabel className={'font-semibold'}>Bank Accounts</FormLabel>
              {bankAccounts && bankAccounts.length > 0 ? (
                <div className="space-y-4">
                  {bankAccounts.map((bank, index) => {
                    const isActive =
                      bank.isActive ||
                      bankAccounts.length === 1 ||
                      (index === 0 && !bankAccounts.some((b) => b.isActive));
                    return (
                      <div
                        key={index}
                        onClick={() => handleSetActiveBank(index)}
                        className={`flex cursor-pointer items-start gap-2 rounded border p-3 transition-all ${
                          isActive
                            ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                            : 'hover:border-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        <div className="shrink-0 pt-1">
                          {isActive && (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">
                              <svg
                                className="h-3 w-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-2 text-sm">
                          <p>
                            <span className="font-medium">Account Name:</span>{' '}
                            {bank.accountName}
                          </p>
                          <p>
                            <span className="font-medium">Account Number:</span>{' '}
                            {bank.accountNumber}
                          </p>
                          <p>
                            <span className="font-medium">Bank Name:</span>{' '}
                            {bank.bankName}
                          </p>
                          <p>
                            <span className="font-medium">
                              Tax identification No:
                            </span>{' '}
                            {bank.tin}
                          </p>
                          <p>
                            <span className="font-medium">Sort Code:</span>{' '}
                            {bank.sortCode}
                          </p>
                          <p>
                            <span className="font-medium">Swift Code:</span>{' '}
                            {bank.swiftCode}
                          </p>
                          <p>
                            <span className="font-medium">
                              FNB Universal Code:
                            </span>{' '}
                            {bank.fnbUniversalCode}
                          </p>
                          {isActive && (
                            <p className="mt-2 text-xs font-semibold text-green-600">
                              ✓ Active Bank
                            </p>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            const currentBanks =
                              form.getValues('bankAccounts') || [];
                            const updatedBanks = currentBanks.filter(
                              (_, i) => i !== index
                            );
                            form.setValue('bankAccounts', updatedBanks);
                          }}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div>
                  <p className="text-sm text-[#434343]">
                    No bank accounts added yet.
                  </p>
                </div>
              )}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addNewBank}
                className="text-sm"
              >
                <PlusIcon className="h-4 w-4" />
                Add New bank
              </Button>
            </div>
          </div>
          {/* Invoice Template and Terms Section */}
          <div className="grid grid-cols-1 gap-8 pt-3 md:grid-cols-2">
            <FormField
              control={form.control}
              name="emailTemplate"
              render={({ field }) => (
                <FormItem className={'w-full max-w-md'}>
                  <FormLabel>Email Template</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      ref={emailEditorRef}
                      currentValue={field.value}
                      setCurrentValue={field.onChange}
                      placeholder="Enter your email template..."
                    />
                  </FormControl>
                  <div className="flex items-center justify-between text-xs">
                    <Popover
                      open={showVariables}
                      onOpenChange={setShowVariables}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 text-xs font-normal text-blue-600 hover:bg-transparent hover:text-blue-800"
                        >
                          Show variables
                          <ChevronDown className="ml-1 h-3 w-3" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search variables..." />
                          <CommandList>
                            <CommandEmpty>No variable found.</CommandEmpty>
                            <CommandGroup>
                              {EMAIL_TEMPLATE_VARIABLES.map((item) => (
                                <CommandItem
                                  key={item.variable}
                                  onSelect={() =>
                                    handleInsertVariable(item.variable)
                                  }
                                  className="flex cursor-pointer flex-col items-start gap-1"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-sm font-medium text-blue-600">
                                      {`{{${item.variable}}}`}
                                    </span>
                                    <span className="text-xs text-gray-700">
                                      {item.label}
                                    </span>
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    {item.description}
                                  </span>
                                  <span className="text-xs text-gray-400 italic">
                                    e.g., {item.example}
                                  </span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <span className="text-gray-500">
                      {field.value?.length || 0}/1000
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className={'w-full max-w-md'}>
                  <FormLabel>Terms</FormLabel>
                  <FormControl>
                    <Textarea placeholder="" className="h-60" {...field} />
                  </FormControl>
                  <div className="text-right text-xs">
                    {field.value?.length || 0}/1000
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            {/* Brand Color Picker Section */}
            <div className="space-y-4">
              <FormLabel>Choose Brand Color</FormLabel>
              <ColorPicker
                selectedColor={selectedColor}
                onColorChange={(color) => {
                  setSelectedColor(color);
                  form.setValue('brandColor', color);
                }}
                disabled={isSubmitting}
              />
            </div>
          </div>{' '}
          {/* Signature Section */}
          <div className="grid grid-cols-1 gap-8 pt-3 md:grid-cols-2">
            <div className="w-full max-w-md space-y-4">
              <FormLabel>Draw Your Signature</FormLabel>
              <div className="space-y-4">
                <div className="border-muted-foreground/25 rounded-lg border-2 bg-white p-4">
                  <canvas
                    ref={canvasRef}
                    className="h-32 w-full cursor-crosshair rounded border border-gray-200"
                    onMouseDown={startDrawing}
                    onMouseUp={finishDrawing}
                    onMouseMove={draw}
                    onTouchStart={(e) => {
                      const touch = e.touches[0];
                      const rect = e.target.getBoundingClientRect();
                      startDrawing({
                        nativeEvent: {
                          offsetX: touch.clientX - rect.left,
                          offsetY: touch.clientY - rect.top,
                        },
                      });
                    }}
                    onTouchEnd={finishDrawing}
                    onTouchMove={(e) => {
                      e.preventDefault();
                      const touch = e.touches[0];
                      const rect = e.target.getBoundingClientRect();
                      draw({
                        nativeEvent: {
                          offsetX: touch.clientX - rect.left,
                          offsetY: touch.clientY - rect.top,
                        },
                      });
                    }}
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearCanvas}
                        className="h-7"
                      >
                        <RotateCcwIcon className="h-3 w-3" />
                        Clear
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={saveCanvasSignature}
                        disabled={signatureUploading}
                        className="h-7"
                      >
                        {signatureUploading ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                    <p className="text-muted-foreground text-center text-xs">
                      Draw your signature above using mouse or touch
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Signature Section */}
            <div className="w-full max-w-md space-y-4">
              <FormLabel>Or Upload Signature</FormLabel>
              <div className="border-muted-foreground/25 flex h-[198px] flex-col items-center justify-center rounded-lg border-2 border-dashed bg-black/2 p-8">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSignatureUpload}
                  className="hidden"
                  id="signature-upload"
                  disabled={signatureUploading}
                />
                <label
                  htmlFor="signature-upload"
                  className={`cursor-pointer ${signatureUploading ? 'opacity-50' : ''}`}
                >
                  <div className="flex flex-col items-center">
                    <UploadIcon className="text-primary h-8 w-8" />
                    <p className="mt-4 text-base">
                      {signatureUploading
                        ? 'Uploading...'
                        : 'Click or drag file to this area to upload'}
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {signatureUploading
                        ? 'Please wait while your signature is being uploaded'
                        : 'Upload your signature image (PNG, JPG, SVG)'}
                    </p>
                  </div>
                </label>
              </div>

              {uploadedSignature && (
                <div className="mt-2 flex items-center justify-between rounded border bg-gray-50 p-2">
                  <div>
                    <p className="text-sm text-gray-700">
                      📎 {uploadedSignature.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {uploadedSignature.size > 0
                        ? `${(uploadedSignature.size / 1024).toFixed(1)} KB`
                        : 'Existing file'}
                    </p>
                    {uploadedSignature.url && (
                      <a
                        href={uploadedSignature.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        View Signature
                      </a>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeSignature}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-end gap-4 pt-6">
            <Button
              className={'h-10 w-full max-w-44'}
              type="button"
              variant="outline"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              className={'h-10 w-full max-w-44'}
              type="submit"
              disabled={isSubmitting || !hasFormChanged}
            >
              {isSubmitting ? 'Saving...' : 'Save settings'}
            </Button>
          </div>
        </form>
      </Form>

      <AddBankModal
        open={isAddBankModalOpen}
        onOpenChange={setIsAddBankModalOpen}
        handleSubmit={(data) => {
          const currentBanks = form.getValues('bankAccounts') || [];
          const newBank = {
            ...data,
            isActive: currentBanks.length === 0, // Set as active if it's the first bank
          };
          form.setValue('bankAccounts', [...currentBanks, newBank]);
        }}
      />
    </div>
  );
}
