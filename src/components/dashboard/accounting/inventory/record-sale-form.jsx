import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { ShoppingCart } from 'lucide-react';
import { DialogDescription } from '@radix-ui/react-dialog';

// Zod schema for form validation
const recordSaleSchema = z.object({
  product: z.string().min(1, 'Product is required'),
  quantityToSell: z.string().min(1, 'Quantity is required'),
  discount: z.string().optional(),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email('Please enter a valid email').optional(),
  notes: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
});

export default function RecordSaleForm({
  open,
  onOpenChange,
  onSubmit,
  onSuccess,
}) {
  const form = useForm({
    resolver: zodResolver(recordSaleSchema),
    defaultValues: {
      product: '',
      quantityToSell: '',
      discount: '',
      paymentMethod: '',
      customerName: '',
      customerEmail: '',
      notes: '',
      category: '',
    },
  });

  const { handleSubmit, reset } = form;

  const handleCancel = () => {
    reset();
    onOpenChange?.(false);
  };

  const onFormSubmit = (data) => {
    console.log('Sale data:', data);
    if (onSubmit) {
      onSubmit(data);
    }
    reset();
    onOpenChange?.(false);
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[90%] overflow-y-auto p-8 sm:max-w-4xl">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-[#254C00]">
            <ShoppingCart className="size-4 text-white" />
          </div>
          <DialogHeader>
            <DialogTitle className="font-semibold">Record New Sale</DialogTitle>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="space-y-6 py-4"
          >
            {/* First Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Product */}
              <FormField
                control={form.control}
                name="product"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 w-full">
                          <SelectValue placeholder="Select a Product" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="geisha">Geisha</SelectItem>
                        <SelectItem value="headset">Headset</SelectItem>
                        <SelectItem value="bournvita">Bournvita</SelectItem>
                        <SelectItem value="titus">Titus</SelectItem>
                        <SelectItem value="pen">Pen</SelectItem>
                        <SelectItem value="cards">Cards</SelectItem>
                        <SelectItem value="chair">Chair</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Quantity to sell */}
              <FormField
                control={form.control}
                name="quantityToSell"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity to sell</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter no"
                        {...field}
                        className="h-10 w-full"
                        type="number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Discount(%) */}
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount(%)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter no"
                        {...field}
                        className="h-10 w-full"
                        type="number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Method */}
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 w-full">
                          <SelectValue placeholder="Cash" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="bank-transfer">
                          Bank Transfer
                        </SelectItem>
                        <SelectItem value="mobile-money">
                          Mobile Money
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Third Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Customer Name */}
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter name"
                        {...field}
                        className="h-10 w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Customer Email address */}
              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Email address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter no"
                        {...field}
                        className="h-10 w-full"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Fourth Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add short note"
                        {...field}
                        className="min-h-[120px] w-full resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className={'self-start'}>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 w-full">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="food">Food & Beverages</SelectItem>
                        <SelectItem value="office-supplies">
                          Office Supplies
                        </SelectItem>
                        <SelectItem value="furniture">Furniture</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="h-10 min-w-[120px] rounded-full text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-10 min-w-[152px] rounded-full text-sm"
              >
                Complete Sale
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
