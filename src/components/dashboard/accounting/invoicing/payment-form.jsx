import { useState, useEffect } from 'react';
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  CalendarIcon,
  CreditCardIcon,
  ChevronsUpDown,
  Check,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/stores/user-store';
import toast from 'react-hot-toast';
import PaymentService from '@/api/payment';
import AccountService from '@/api/accounts';
import { uploadToCloudinary } from '@/lib/cloudinary';

const paymentFormSchema = z.object({
  amountPaid: z.number().min(0, { message: 'Amount paid is required' }),
  vatAmount: z
    .number()
    .min(0, { message: 'VAT amount must be positive' })
    .optional(),
  paymentDate: z.date({
    required_error: 'Payment date is required',
  }),
  paymentMethod: z.string().min(1, { message: 'Payment method is required' }),
  accountCode: z.string().min(1, { message: 'Account code is required' }),
  referenceNumber: z
    .string()
    .min(1, { message: 'Reference number is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  vatCertificate: z.any().optional(),
  attachment: z.any().optional(),
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
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [openAccountCombobox, setOpenAccountCombobox] = useState(false);
  const { businessData } = useUserStore();

  // Create schema with dynamic validation based on amountDue
  const paymentFormSchemaWithValidation = paymentFormSchema.refine(
    (data) => data.amountPaid <= amountDue,
    {
      message: `Amount paid cannot exceed amount due (₦${amountDue?.toLocaleString()})`,
      path: ['amountPaid'],
    }
  );

  const form = useForm({
    resolver: zodResolver(paymentFormSchemaWithValidation),
    defaultValues: {
      amountPaid: 0,
      vatAmount: 0,
      paymentDate: undefined,
      paymentMethod: '',
      accountCode: '',
      referenceNumber: '',
      category: '',
      vatCertificate: null,
      attachment: null,
      notes: '',
    },
  });

  // Fetch accounts on mount
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await AccountService.fetch({});
        const accountsData = response.data?.data?.accounts || [];
        setAccounts(accountsData);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    if (open) {
      fetchAccounts();
    }
  }, [open]);
  console.log(invoiceId);
  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setIsUploadingFiles(true);

      // Upload files to Cloudinary if they exist
      let vatCertificateUrl = '';
      let attachmentUrl = '';

      if (data.vatCertificate) {
        try {
          const vatUploadResult = await uploadToCloudinary(
            data.vatCertificate,
            {
              folder: 'payment-documents/vat-certificates',
              tags: ['vat-certificate', invoiceNo],
            }
          );
          vatCertificateUrl = vatUploadResult.url;
        } catch (error) {
          console.error('Error uploading VAT certificate:', error);
          toast.error('Failed to upload VAT certificate');
          setIsSubmitting(false);
          setIsUploadingFiles(false);
          return;
        }
      }

      if (data.attachment) {
        try {
          const attachmentUploadResult = await uploadToCloudinary(
            data.attachment,
            {
              folder: 'payment-documents/attachments',
              tags: ['payment-attachment', invoiceNo],
            }
          );
          attachmentUrl = attachmentUploadResult.url;
        } catch (error) {
          console.error('Error uploading attachment:', error);
          toast.error('Failed to upload attachment');
          setIsSubmitting(false);
          setIsUploadingFiles(false);
          return;
        }
      }

      setIsUploadingFiles(false);

      // Prepare payload according to API requirements
      const paymentPayload = {
        amountDue: amountDue.toString(),
        amountPaid: data.amountPaid.toString(),
        businessId: businessData?._id,
        invoiceId: invoiceId,
        paymentDate: data.paymentDate.toISOString(),
        paymentMethod: data.paymentMethod,
        trxNo: data.referenceNumber,
        vat: (data.vatAmount || 0).toString(),
        vatCertificate: vatCertificateUrl,
        category: data.category,
        notes: data.notes || '',
        accountingAccountId: data.accountCode,
        attachment: attachmentUrl,
      };

      const response = await PaymentService.create({
        data: paymentPayload,
      });

      console.log('Payment recorded successfully:', response.data);
      toast.success('Payment recorded successfully');

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
      setIsUploadingFiles(false);
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

                {/* Amount Paid */}
                <FormField
                  control={form.control}
                  name="amountPaid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount Paid</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          formatNumber
                          placeholder="Enter price"
                          className="h-10"
                          max={amountDue}
                          {...field}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value || 0);
                            // Restrict to not exceed amountDue (with floating-point tolerance)
                            if (value > amountDue + 0.001) {
                              field.onChange(amountDue);
                              toast.error(
                                `Amount paid cannot exceed amount due (₦${amountDue?.toLocaleString()})`
                              );
                            } else {
                              field.onChange(value);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Invoice ID */}
                <div className="space-y-2">
                  <FormLabel>Invoice ID</FormLabel>
                  <div className="border-input flex h-10 items-center rounded-md border bg-gray-50 px-3 text-sm text-gray-600">
                    {invoiceNo}
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
                        <PopoverContent className="w-auto p-0" align="start">
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
                {/* VAT Amount */}
                <FormField
                  control={form.control}
                  name="vatAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>VAT Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          formatNumber
                          placeholder="Enter VAT amount"
                          className="h-10"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
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
                          <SelectItem value="Bank Transfer">
                            Bank Transfer
                          </SelectItem>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Cheque">Cheque</SelectItem>
                          <SelectItem value="Card">Card</SelectItem>
                          <SelectItem value="Mobile Money">
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
                {/* Attach VAT Certificate */}
                <FormField
                  control={form.control}
                  name="vatCertificate"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Attach VAT Certificate</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="file"
                            className="hidden"
                            id="vat-certificate"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              onChange(file);
                            }}
                            {...field}
                          />
                          <label
                            htmlFor="vat-certificate"
                            className="border-input flex h-10 cursor-pointer items-center justify-between rounded-md border bg-white px-3 text-sm hover:bg-gray-50"
                          >
                            <span className="text-muted-foreground">
                              {value?.name || 'No file chosen'}
                            </span>
                            <span className="rounded bg-gray-200 px-3 py-1 text-xs text-gray-700">
                              Choose File
                            </span>
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Account Code - Only show if payment method is selected */}
                {form.watch('paymentMethod') && (
                  <FormField
                    control={form.control}
                    name="accountCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Code</FormLabel>
                        <FormControl>
                          <Popover
                            open={openAccountCombobox}
                            onOpenChange={setOpenAccountCombobox}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  'h-10 w-full justify-between text-sm',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value
                                  ? (() => {
                                      const selectedAccount = accounts?.find(
                                        (account) =>
                                          account?._id === field.value
                                      );
                                      if (selectedAccount) {
                                        const name =
                                          selectedAccount.accountName || '';
                                        const code =
                                          selectedAccount.accountCode ||
                                          selectedAccount.accountNumber ||
                                          '';
                                        return code
                                          ? `${name} (${code})`
                                          : name || 'Select account';
                                      }
                                      return 'Select account';
                                    })()
                                  : 'Select account'}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-(--radix-popover-trigger-width) p-0"
                              align="start"
                            >
                              <Command>
                                <CommandInput placeholder="Search accounts..." />
                                <CommandList>
                                  <CommandEmpty>No account found.</CommandEmpty>
                                  <CommandGroup>
                                    {accounts?.map((account) => (
                                      <CommandItem
                                        value={account?._id}
                                        key={account?._id}
                                        onSelect={() => {
                                          form.setValue(
                                            'accountCode',
                                            account._id
                                          );
                                          setOpenAccountCombobox(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            'mr-2 h-4 w-4',
                                            account?._id === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        <div className="flex flex-col">
                                          <span className="font-medium">
                                            {account?.accountName}
                                          </span>
                                          {(account?.accountNumber ||
                                            account?.accountCode) && (
                                            <span className="text-muted-foreground text-xs">
                                              {account?.accountNumber ||
                                                account?.accountCode}
                                            </span>
                                          )}
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                            <SelectValue placeholder="Office supplies" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Office supplies">
                            Office supplies
                          </SelectItem>
                          <SelectItem value="Utilities">Utilities</SelectItem>
                          <SelectItem value="Rent">Rent</SelectItem>
                          <SelectItem value="Salaries">Salaries</SelectItem>
                          <SelectItem value="Equipment">Equipment</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

                {/* Attachment */}
                <FormField
                  control={form.control}
                  name="attachment"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Attachment</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="file"
                            className="hidden"
                            id="attachment"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              onChange(file);
                            }}
                            {...field}
                          />
                          <label
                            htmlFor="attachment"
                            className="border-input flex h-10 cursor-pointer items-center justify-between rounded-md border bg-white px-3 text-sm hover:bg-gray-50"
                          >
                            <span className="text-muted-foreground">
                              {value?.name || 'No file chosen'}
                            </span>
                            <span className="rounded bg-gray-200 px-3 py-1 text-xs text-gray-700">
                              Choose File
                            </span>
                          </label>
                        </div>
                      </FormControl>
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
                {isUploadingFiles
                  ? 'Uploading files...'
                  : isSubmitting
                    ? 'Recording...'
                    : 'Record Payment'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
