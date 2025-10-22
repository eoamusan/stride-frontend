import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useRef, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  UploadIcon,
  PlusIcon,
  RotateCcwIcon,
  SlidersHorizontalIcon,
  XIcon,
} from 'lucide-react';
import AddBankModal from '../add-bank';
import RichTextEditor from '@/components/dashboard/rich-text-editor';
import Coloris from '@melloware/coloris';
import '@melloware/coloris/dist/coloris.css';

const formSchema = z.object({
  invoice_prefix: z.string().min(1, { message: 'Invoice prefix is required' }),
  logo: z.any().optional(),
  use_logo: z.boolean().default(false),
  invoice_template: z.string().optional(),
  terms: z.string().optional(),
  signature: z.any().optional(),
  tax_identification_number: z.string().optional(),
  brand_color: z.string().default('#3B82F6'),
  bank: z
    .object({
      account_name: z.string(),
      account_number: z.string(),
      bank_name: z.string(),
      tax_id: z.string(),
      sort_code: z.string(),
    })
    .optional(),
});

export default function SettingsForm() {
  const [uploadedLogo, setUploadedLogo] = useState(null);
  const [uploadedSignature, setUploadedSignature] = useState(null);
  const [isAddBankModalOpen, setIsAddBankModalOpen] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#3B82F6');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const colorPickerRef = useRef(null);

  // Predefined brand colors
  const brandColors = [
    '#3B82F6', // Blue
    '#000000', // Black
    '#FFFFFF', // White
    '#FFC107', // Yellow/Amber
    '#FF5722', // Orange
    '#E91E63', // Pink/Magenta
  ];

  // File removal functions
  const removeLogo = () => {
    setUploadedLogo(null);
  };

  const removeSignature = () => {
    setUploadedSignature(null);
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoice_prefix: 'INV',
      customer: '',
      logo: null,
      use_logo: false,
      invoice_template: '',
      terms: '',
      signature: null,
      tax_identification_number: '',
      brand_color: '#3B82F6',
      bank: {
        account_name: 'James john',
        account_number: '25467587',
        bank_name: 'James Bank',
        tax_id: '3545',
        sort_code: '3545',
      },
    },
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
  // Initialize Coloris
  useEffect(() => {
    // Initialize Coloris with configuration
    Coloris.init();
    Coloris({
      themeMode: 'polaroid',
      formatToggle: true,
      selectInput: true,
      onChange: (color, input) => {
        console.log(`The new color is ${color}`);
        setSelectedColor(color);
        form.setValue('brand_color', color);
      },
    });

    // Cleanup function
    return () => {
      Coloris.close();
    };
  }, [form]);

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

  const onSubmit = (data) => {
    // Convert canvas to image before submitting
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const signatureDataURL = canvas.toDataURL();
      data.signature = signatureDataURL;
    }
    console.log('Settings data:', data);
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedLogo(file);
      form.setValue('logo', file);
    }
  };

  const handleSignatureUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedSignature(file);
      form.setValue('signature', file);
    }
  };

  const addNewBank = () => {
    setIsAddBankModalOpen(true);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    form.setValue('brand_color', color);
    setShowColorPicker(false);
  };

  const handleCustomColorChange = (event) => {
    const color = event.target.value;
    setSelectedColor(color);
    form.setValue('brand_color', color);
  };

  const bank = form.watch('bank');

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm">Last modified Sept 3, 2025</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Top Section - Invoice Prefix and Tax ID */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <FormField
              control={form.control}
              name="invoice_prefix"
              render={({ field }) => (
                <FormItem className={'max-w-sm'}>
                  <FormLabel>Invoice Prefix</FormLabel>
                  <FormControl>
                    <Input className={'h-10'} placeholder="INV" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tax_identification_number"
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
                />
                <label htmlFor="logo-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <UploadIcon className="text-primary h-8 w-8" />
                    <p className="mt-4 text-base">
                      Click or drag file to this area to upload
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Support for a single or bulk upload.
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
                      {(uploadedLogo.size / 1024).toFixed(1)} KB
                    </p>
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
                name="use_logo"
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
              {bank && (
                <div className="space-y-2">
                  <div className="text-xs">
                    <p>
                      <span className="font-medium">Account Name:</span>{' '}
                      {bank.account_name}
                    </p>
                    <p>
                      <span className="font-medium">Account Number:</span>{' '}
                      {bank.account_number}
                    </p>
                    <p>
                      <span className="font-medium">Bank Name:</span>{' '}
                      {bank.bank_name}
                    </p>
                    <p>
                      <span className="font-medium">
                        Tax identification No:
                      </span>{' '}
                      {bank.tax_id}
                    </p>
                    <p>
                      <span className="font-medium">Sort Code:</span>{' '}
                      {bank.sort_code}
                    </p>
                  </div>
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
              )}
            </div>
          </div>
          {/* Invoice Template and Terms Section */}
          <div className="grid grid-cols-1 gap-8 pt-3 md:grid-cols-2">
            <FormField
              control={form.control}
              name="invoice_template"
              render={({ field }) => (
                <FormItem className={'w-full max-w-md'}>
                  <FormLabel>Invoice Template</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      currentValue={field.value}
                      setCurrentValue={field.onChange}
                      placeholder=""
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs">
                    <span className="cursor-pointer">Generate template</span>
                    <span>{field.value?.length || 0}/1000</span>
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
                    <Textarea placeholder="" className="h-[240px]" {...field} />
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
              <div className="space-y-3">
                <FormLabel className="text-[#434343]">Select Color</FormLabel>
                <div className="flex items-center gap-3">
                  {brandColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorSelect(color)}
                      className={`h-8 w-8 rounded-lg border-2 transition-all ${
                        selectedColor === color
                          ? 'border-gray-400 ring-2 ring-gray-300 ring-offset-2'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {color === '#FFFFFF' && (
                        <div className="h-full w-full rounded-lg border border-gray-200" />
                      )}
                    </button>
                  ))}

                  <div
                    className={`relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-2 transition-all ${
                      !brandColors.includes(selectedColor)
                        ? 'border-gray-400 ring-2 ring-gray-300 ring-offset-2'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ backgroundColor: selectedColor }}
                  >
                    <SlidersHorizontalIcon size={14} className="text-white" />
                    <input
                      type="text"
                      data-coloris
                      value={selectedColor}
                      ref={colorPickerRef}
                      className={`absolute -bottom-4 -left-6 h-8 w-8 cursor-pointer opacity-0`}
                      readOnly
                    />
                  </div>
                </div>
              </div>
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
                />
                <label htmlFor="signature-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <UploadIcon className="text-primary h-8 w-8" />
                    <p className="mt-4 text-base">
                      Click or drag file to this area to upload
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Upload your signature image (PNG, JPG, SVG)
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
                      {(uploadedSignature.size / 1024).toFixed(1)} KB
                    </p>
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
              className={'h-10 w-full max-w-[176px]'}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button className={'h-10 w-full max-w-[176px]'} type="submit">
              Save settings
            </Button>
          </div>
        </form>
      </Form>

      <AddBankModal
        open={isAddBankModalOpen}
        onOpenChange={setIsAddBankModalOpen}
      />
    </div>
  );
}
