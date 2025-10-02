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
import { UploadIcon, X } from 'lucide-react';
import { DialogDescription } from '@radix-ui/react-dialog';

// Zod schema for form validation
const addProductSchema = z.object({
  productName: z.string().min(1, 'Product name is required'),
  skuBarcode: z.string().min(1, 'SKU/Barcode is required'),
  category: z.string().min(1, 'Please select a category'),
  unitOfMeasurement: z.string().min(1, 'Please select a unit'),
  purchasePrice: z.string().min(1, 'Purchase price is required'),
  sellingPrice: z.string().min(1, 'Selling price is required'),
  initialQuantity: z.string().min(1, 'Initial quantity is required'),
  minimumStockLevel: z.string().min(1, 'Minimum stock level is required'),
  supplierName: z.string().min(1, 'Please select a supplier'),
  storageArea: z.string().min(1, 'Please select a storage area'),
  productImage: z.any().optional(),
});

export default function AddProductForm({ open, onOpenChange, onProductAdded }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // React Hook Form setup
  const form = useForm({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      productName: '',
      skuBarcode: '',
      category: '',
      unitOfMeasurement: '',
      purchasePrice: '',
      sellingPrice: '',
      initialQuantity: '',
      minimumStockLevel: '',
      supplierName: '',
      storageArea: '',
      productImage: null,
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
    console.log('Form data:', data);
    // Logic to save product
    reset();
    setUploadedFiles([]);
    if (onProductAdded) {
      onProductAdded();
    } else {
      onOpenChange?.(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[90%] max-w-4xl overflow-y-auto p-8 sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add New Product
          </DialogTitle>
          <DialogDescription>
            Enter the details for the new product item.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            {/* First Row: Product Name and SKU/Barcode */}
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
                        <SelectItem value="office-supplies">
                          Office Supplies
                        </SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="stationery">Stationery</SelectItem>
                        <SelectItem value="furniture">Furniture</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="skuBarcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU/Barcode</FormLabel>
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

            {/* Second Row: Category and Unit of Measurement */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className={'w-full'}>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="office-supplies">
                          Office Supplies
                        </SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="stationery">Stationery</SelectItem>
                        <SelectItem value="furniture">Furniture</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="unitOfMeasurement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit of Measurement</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className={'w-full'}>
                          <SelectValue placeholder="Select Unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pieces">Pieces</SelectItem>
                        <SelectItem value="kg">Kilograms</SelectItem>
                        <SelectItem value="liters">Liters</SelectItem>
                        <SelectItem value="boxes">Boxes</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Third Row: Purchase Price and Selling Price */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={control}
                name="purchasePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Price</FormLabel>
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
                name="sellingPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selling Price</FormLabel>
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
            </div>

            {/* Fourth Row: Initial Quantity and Minimum Stock Level */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={control}
                name="initialQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Quantity</FormLabel>
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
                name="minimumStockLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Stock Level</FormLabel>
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
            </div>

            {/* Fifth Row: Supplier Name and Storage Area */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={control}
                name="supplierName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier Name</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className={'w-full'}>
                          <SelectValue placeholder="Select Supplier" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="supplier-1">Supplier One</SelectItem>
                        <SelectItem value="supplier-2">Supplier Two</SelectItem>
                        <SelectItem value="supplier-3">
                          Supplier Three
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="storageArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage Area</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className={'w-full'}>
                          <SelectValue placeholder="Select Storage Area" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="warehouse-a">Warehouse A</SelectItem>
                        <SelectItem value="warehouse-b">Warehouse B</SelectItem>
                        <SelectItem value="storage-room">
                          Storage Room
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* File Upload Area */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Product Image</Label>
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
                Create product
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
