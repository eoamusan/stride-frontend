import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, CreditCardIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/stores/user-store';
import toast from 'react-hot-toast';
import PaymentService from '@/api/payment';

const paymentFormSchema = z.object({
  paymentDate: z.date({
    required_error: 'Payment date is required',
  }),
  paymentMethod: z.string().min(1, { message: 'Payment method is required' }),
  accountCode: z.string().min(1, { message: 'Account code is required' }),
  referenceNumber: z
    .string()
    .min(1, { message: 'Reference number is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  notes: z.string().optional(),
});

export default function PaymentForm({
  open,
  onOpenChange,
  invoiceId,
  invoiceNo,
  amountDue,
  onSuccess,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { businessData } = useUserStore();

  const form = useForm({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentDate: undefined,
      paymentMethod: '',
      accountCode: '',
      referenceNumber: '',
      category: '',
      notes: '',
    },
  });
  console.log(invoiceId);
  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      // Prepare payload according to API requirements
      const paymentPayload = {
        businessId: businessData?._id,
        invoiceId: invoiceId,
        paymentDate: data.paymentDate.toISOString(),
        paymentMethod: data.paymentMethod,
        trxNo: data.referenceNumber,
        accountCode: data.accountCode,
        category: data.category,
        notes: data.notes || '',
        amount: amountDue.toString(),
      };

      const response = await PaymentService.create({
        data: paymentPayload,
      });

      console.log('Payment recorded successfully:', response.data);

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      form.reset();
      onOpenChange?.(false);
    } catch (error) {
      console.error('Error submitting payment:', error);
      toast.error(
        error.response?.message ||
          error.message ||
          'Failed to record payment. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[90%] max-w-4xl overflow-y-auto p-8 sm:max-w-4xl">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-[#254C00] text-white">
            <CreditCardIcon className="size-4" />
          </div>
          <DialogHeader>
            <DialogTitle>Record payment</DialogTitle>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 py-4"
          >
            {/* Payment Details Section */}
            <div className="space-y-6">
              <h3 className="text-base font-semibold">Payment Details</h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Amount Due */}
                <div className="space-y-2">
                  <FormLabel>Amount Due</FormLabel>
                  <div className="text-base font-semibold text-[#EF4444]">
                    ₦{amountDue?.toLocaleString() || '0'}
                  </div>
                </div>

                {/* Payment Date */}
                <FormField
                  control={form.control}
                  name="paymentDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Payment Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'h-10 w-full justify-between pl-3 text-left font-normal',
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
                {/* Invoice No */}
                <div className="space-y-2">
                  <FormLabel>Invoice No</FormLabel>
                  <div className="border-input flex h-10 items-center rounded-md border bg-gray-50 px-3 text-sm text-gray-600">
                    {invoiceNo}
                  </div>
                </div>

                {/* Payment Method */}
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10 w-full">
                            <SelectValue placeholder="Select Payment Method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bank-transfer">
                            Bank Transfer
                          </SelectItem>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="cheque">Cheque</SelectItem>
                          <SelectItem value="card">Card</SelectItem>
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

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Account Code */}
                <FormField
                  control={form.control}
                  name="accountCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter account code"
                          className="h-10"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Reference/Transaction Number */}
                <FormField
                  control={form.control}
                  name="referenceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference/Transaction Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Transaction ID"
                          className="h-10"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
                {/* Notes */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder=""
                          className="min-h-32 resize-none"
                          {...field}
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
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10 w-full">
                            <SelectValue placeholder="Select Categories" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="office-supplies">
                            Office supplies
                          </SelectItem>
                          <SelectItem value="utilities">Utilities</SelectItem>
                          <SelectItem value="rent">Rent</SelectItem>
                          <SelectItem value="salaries">Salaries</SelectItem>
                          <SelectItem value="equipment">Equipment</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="h-10 min-w-32"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-10 min-w-40"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Recording...' : 'Record Payment'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
