import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { InfoIcon } from 'lucide-react';
import { DialogDescription } from '@radix-ui/react-dialog';

// Zod schema for form validation
const recordMovementSchema = z.object({
  productName: z.string().min(1, 'Product name is required'),
  quantityToMove: z.string().min(1, 'Quantity to move is required'),
  fromLocation: z.string().min(1, 'From location is required'),
  toLocation: z.string().min(1, 'To location is required'),
  reasonForMovement: z.string().min(1, 'Reason for movement is required'),
});

export default function RecordMovementForm({
  open,
  onOpenChange,
  onMovementRecorded,
}) {
  // React Hook Form setup
  const form = useForm({
    resolver: zodResolver(recordMovementSchema),
    defaultValues: {
      productName: '',
      quantityToMove: '',
      fromLocation: '',
      toLocation: '',
      reasonForMovement: '',
    },
  });

  const { handleSubmit, control, reset } = form;

  const handleCancel = () => {
    reset();
    onOpenChange?.(false);
  };

  const onSubmit = (data) => {
    console.log('Movement data:', data);
    // Logic to save movement
    reset();
    if (onMovementRecorded) {
      onMovementRecorded();
    } else {
      onOpenChange?.(false);
    }
  };

  // Get current date and time for display
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[90%] max-w-2xl overflow-y-auto p-8 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Record Inventory Movement
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Track transfers between locations, departments, or warehouses
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            {/* First Row: Product Name and Quantity to Move */}
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
                        <SelectItem value="office-supplies">
                          Office Supplies
                        </SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="stationery">Stationery</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="quantityToMove"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity to Move</FormLabel>
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

            {/* Second Row: From Location and To Location */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={control}
                name="fromLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Location</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className={'w-full'}>
                          <SelectValue placeholder="Select Location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="warehouse-a">Warehouse A</SelectItem>
                        <SelectItem value="warehouse-b">Warehouse B</SelectItem>
                        <SelectItem value="storage-room">
                          Storage Room
                        </SelectItem>
                        <SelectItem value="main-floor">Main Floor</SelectItem>
                        <SelectItem value="cold-storage">
                          Cold Storage
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="toLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To Location</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className={'w-full'}>
                          <SelectValue placeholder="Select Location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="warehouse-a">Warehouse A</SelectItem>
                        <SelectItem value="warehouse-b">Warehouse B</SelectItem>
                        <SelectItem value="storage-room">
                          Storage Room
                        </SelectItem>
                        <SelectItem value="main-floor">Main Floor</SelectItem>
                        <SelectItem value="cold-storage">
                          Cold Storage
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Third Row: Reason for Movement (full width) */}
            <div className="grid grid-cols-1">
              <FormField
                control={control}
                name="reasonForMovement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Movement</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className={'w-full'}>
                          <SelectValue placeholder="Select Reason" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="restocking">Restocking</SelectItem>
                        <SelectItem value="transfer">Transfer</SelectItem>
                        <SelectItem value="relocation">Relocation</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="reorganization">
                          Reorganization
                        </SelectItem>
                        <SelectItem value="damaged-goods">
                          Damaged Goods
                        </SelectItem>
                        <SelectItem value="customer-request">
                          Customer Request
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Movement Information Section */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                  <InfoIcon className="h-3 w-3" />
                </div>
                <h3 className="text-sm font-semibold text-primary">
                  Movement Information
                </h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Moved By:
                  </span>
                  <span className="text-sm text-primary">john Doe</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Date of Movement:
                  </span>
                  <span className="text-sm text-primary">
                    {getCurrentDateTime()}
                  </span>
                </div>
              </div>
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
                Record Movement
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
