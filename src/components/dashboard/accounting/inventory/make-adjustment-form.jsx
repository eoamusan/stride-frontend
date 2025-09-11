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
import { UploadIcon, X, CalendarIcon } from 'lucide-react';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';

// Zod schema for form validation
const makeAdjustmentSchema = z.object({
  productName: z.string().min(1, 'Product name is required'),
  adjustmentType: z.string().min(1, 'Adjustment type is required'),
  quantityAdjusted: z.string().min(1, 'Quantity adjusted is required'),
  reasonForAdjustment: z.string().min(1, 'Please select a reason'),
  purchasePrice: z.date({
    required_error: 'Purchase date is required',
  }),
  performedBy: z.string().min(1, 'Performed by is required'),
  documents: z.any().optional(),
});

export default function MakeAdjustmentForm({ open, onOpenChange }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // React Hook Form setup
  const form = useForm({
    resolver: zodResolver(makeAdjustmentSchema),
    defaultValues: {
      productName: '',
      adjustmentType: '',
      quantityAdjusted: '',
      reasonForAdjustment: '',
      purchasePrice: undefined,
      performedBy: 'John Doe',
      documents: null,
    },
  });

  const { handleSubmit, control, reset } = form;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    setUploadedFiles((prev) => [...prev, ...fileArray]);
  };

  const handleCancel = () => {
    reset();
    setUploadedFiles([]);
    onOpenChange?.(false);
  };

  const onSubmit = (data) => {
    console.log('Adjustment data:', data);
    // Logic to save adjustment
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[90%] max-w-4xl overflow-y-auto p-8 sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Make Adjustment
          </DialogTitle>
          <DialogDescription>Enter the details</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            {/* First Row: Product Name and Adjustment Type */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className={'w-full'}>
                          <SelectValue placeholder="Select Product Name" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="fresh-apples">
                          Fresh Apples
                        </SelectItem>
                        <SelectItem value="fresh-bananas">
                          Fresh Bananas
                        </SelectItem>
                        <SelectItem value="fresh-oranges">
                          Fresh Oranges
                        </SelectItem>
                        <SelectItem value="fresh-tomatoes">
                          Fresh Tomatoes
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="adjustmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adjustment Type</FormLabel>
                    <FormControl>
                      <Input
                        className={'h-10 w-full'}
                        placeholder="Enter SKU or barcode"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Second Row: Quantity Adjusted and Reason for Adjustment */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={control}
                name="quantityAdjusted"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity Adjusted</FormLabel>
                    <FormControl>
                      <Input
                        type={'number'}
                        placeholder="Enter no"
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
                name="reasonForAdjustment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Adjustment</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className={'w-full'}>
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="expiration">Expiration</SelectItem>
                        <SelectItem value="damage">Damage</SelectItem>
                        <SelectItem value="theft">Theft</SelectItem>
                        <SelectItem value="inventory-count">
                          Inventory Count
                        </SelectItem>
                        <SelectItem value="supplier-return">
                          Supplier Return
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Third Row: Purchase Price and Performed By */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={control}
                name="purchasePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Price</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
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
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
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

              <FormField
                control={control}
                name="performedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Performed By</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        className="h-10 w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* File Upload Area */}
            <div className="space-y-2">
              <div
                className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                  dragActive ? 'border-primary bg-blue-50' : 'border-gray-300'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <UploadIcon className="text-primary h-6 w-6" />
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
                    onChange={(e) => handleFiles(e.target.files)}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document.getElementById('file-upload').click()
                    }
                  >
                    Browse Files
                  </Button>
                </div>
              </div>

              {/* Display uploaded files */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium">Uploaded Files:</p>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded bg-gray-50 p-2"
                      >
                        <span className="text-sm">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setUploadedFiles((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                className={'h-10'}
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button type="submit" className={'h-10'}>
                Record Adjustment
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
