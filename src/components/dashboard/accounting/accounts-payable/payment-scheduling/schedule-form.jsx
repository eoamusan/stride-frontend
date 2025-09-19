import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import {
  CalendarIcon,
  Search,
  Plus,
  FileText,
  CreditCardIcon,
} from 'lucide-react';

// Zod schema for form validation
const paymentScheduleSchema = z.object({
  paymentType: z.enum(['invoice', 'manual'], {
    required_error: 'Payment type is required',
  }),
  invoiceId: z.string().optional(),
  amount: z.string().min(1, 'Amount is required'),
  scheduledDate: z.date({
    required_error: 'Scheduled date is required',
  }),
  vendor: z.string().min(1, 'Vendor is required'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  priority: z.string().min(1, 'Priority is required'),
  paymentDescription: z.string().optional(),
  notes: z.string().optional(),
});

export default function SchedulePaymentForm({
  open,
  onOpenChange,
  allInvoices = [],
  selectedInvoices = [],
  handleSelectInvoice,
  clearSelections,
}) {
  const [paymentType, setPaymentType] = useState('invoice');
  const [showSelectInvoices, setShowSelectInvoices] = useState(false);

  // React Hook Form setup
  const form = useForm({
    resolver: zodResolver(paymentScheduleSchema),
    defaultValues: {
      paymentType: 'invoice',
      invoiceId: '',
      amount: '',
      scheduledDate: undefined,
      vendor: '',
      paymentMethod: '',
      priority: '',
      paymentDescription: '',
      notes: '',
    },
  });

  const { handleSubmit, control, reset, watch } = form;

  const handleCancel = () => {
    reset();
    onOpenChange?.(false);
  };

  const onSubmit = (data) => {
    console.log('Payment schedule data:', data);
    // Logic to schedule payment
    reset();
    onOpenChange?.(false);
    if (clearSelections) {
      clearSelections();
    }
  };

  const handlePaymentTypeChange = (type) => {
    setPaymentType(type);
    form.setValue('paymentType', type);
    if (type === 'invoice') {
      setShowSelectInvoices(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[90%] max-w-3xl overflow-y-auto p-8 sm:max-w-3xl">
        <div className="flex gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#254C00] text-white">
            <CreditCardIcon className="size-4" />
          </div>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            Schedule payment
          </DialogTitle>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 py-4">
            {/* Payment Type Selection */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant={'outline'}
                className={`flex h-16 flex-1 items-center justify-start gap-3 px-6 ${
                  paymentType === 'invoice'
                    ? 'border-gray-300 bg-gray-100 text-gray-900'
                    : 'bg-white'
                }`}
                onClick={() => handlePaymentTypeChange('invoice')}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#254C00] text-white">
                  <FileText className="size-4" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Select From Invoices</div>
                  <div className="text-sm text-gray-500">
                    {selectedInvoices.length || '0'} Invoices available
                  </div>
                </div>
              </Button>

              <Button
                type="button"
                variant={'outline'}
                className={`flex h-16 flex-1 items-center justify-start gap-3 px-6 ${
                  paymentType === 'manual'
                    ? 'border-gray-300 bg-gray-100 text-gray-900'
                    : 'bg-white'
                }`}
                onClick={() => handlePaymentTypeChange('manual')}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#254C00] text-white">
                  <Plus className="size-4" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Create Manuel Payment</div>
                  <div className="text-sm text-gray-500">
                    For ad-hoc payment
                  </div>
                </div>
              </Button>
            </div>

            {/* Payment Details Section */}
            <div className="space-y-6">
              <h3 className="text-base font-semibold">Payment Details</h3>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Invoice ID - Show for both types */}
                  <FormField
                    control={control}
                    name="invoiceId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice ID</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="INV-2025-001"
                              {...field}
                              className="h-10 w-full pr-10"
                            />
                            <Search className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Amount */}
                  <FormField
                    control={control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (NGN)</FormLabel>
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

                  {/* Scheduled Date */}
                  <FormField
                    control={control}
                    name="scheduledDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Scheduled Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={`h-10 w-full pl-3 text-left text-sm font-normal ${
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
                              className={'text-sm'}
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

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Vendor */}
                  <FormField
                    control={control}
                    name="vendor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vendor</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Vendor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="vendor1">
                              ABC Corporation
                            </SelectItem>
                            <SelectItem value="vendor2">XYZ Ltd</SelectItem>
                            <SelectItem value="vendor3">
                              Tech Solutions Inc
                            </SelectItem>
                            <SelectItem value="vendor4">
                              Global Services
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Payment Method */}
                  <FormField
                    control={control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Bank Transfer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="bank-transfer">
                              Bank Transfer
                            </SelectItem>
                            <SelectItem value="cheque">Cheque</SelectItem>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="online-payment">
                              Online Payment
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Priority */}
                  <FormField
                    control={control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Medium" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {/* Payment Description - Only show for manual type */}
              {paymentType === 'manual' && (
                <FormField
                  control={control}
                  name="paymentDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter payment description..."
                          className="min-h-[100px] w-full resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {/* Notes */}
              <FormField
                control={control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional notes..."
                        className="min-h-[100px] w-full resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end space-x-4 pt-8">
              <Button
                type="button"
                className="h-10 min-w-[113px]"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button type="submit" className="h-10 min-w-[156px]">
                Schedule Payment
              </Button>
            </div>
          </form>
        </Form>

        <SelectInvoices
          open={showSelectInvoices}
          onOpenChange={setShowSelectInvoices}
          allInvoices={allInvoices}
          selectedInvoices={selectedInvoices}
          onUpdateSelection={handleSelectInvoice}
        />
      </DialogContent>
    </Dialog>
  );
}

const SelectInvoices = ({
  open,
  onOpenChange,
  allInvoices = [],
  selectedInvoices = [],
  onUpdateSelection,
}) => {
  const handleInvoiceToggle = (invoiceId) => {
    const isCurrentlySelected = selectedInvoices.includes(invoiceId);
    onUpdateSelection(invoiceId, !isCurrentlySelected);
  };

  const isInvoiceSelected = (invoiceId) => {
    return selectedInvoices.includes(invoiceId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[90%] max-w-4xl overflow-y-auto p-8 sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Select Invoice
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {selectedInvoices.length} of {allInvoices.length} invoices selected
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {allInvoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 text-gray-400">
                <FileText className="mx-auto h-12 w-12" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                No invoices available
              </h3>
              <p className="text-sm text-gray-500">
                No invoices are available for selection at this time.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Img</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allInvoices.map((invoice, index) => (
                    <TableRow
                      key={index}
                      className={`cursor-pointer hover:bg-gray-50 ${
                        isInvoiceSelected(invoice.id)
                          ? 'border-blue-200 bg-blue-50'
                          : ''
                      }`}
                      onClick={() => handleInvoiceToggle(invoice.id)}
                    >
                      <TableCell>
                        <Checkbox
                          checked={isInvoiceSelected(invoice.id)}
                          onChange={() => handleInvoiceToggle(invoice.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback
                            className={`text-xs font-medium text-white ${
                              invoice.vendor.includes('JI') ||
                              invoice.vendor.includes('JJ')
                                ? 'bg-red-500'
                                : 'bg-gray-800'
                            }`}
                          >
                            {invoice.vendor
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {invoice.vendor}
                      </TableCell>
                      <TableCell>{invoice.id}</TableCell>
                      <TableCell className="font-medium">
                        {invoice.amount}
                      </TableCell>
                      <TableCell>{invoice.category}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">{invoice.dueDate}</span>
                          {(invoice.status === 'Overdue' ||
                            invoice.overdueDays !== '0 days overdue') && (
                            <span className="text-xs text-red-500">
                              {invoice.overdueDays}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            invoice.status === 'Pending'
                              ? 'bg-orange-100 text-orange-700'
                              : invoice.status === 'Overdue'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                          }
                        >
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <span className="text-gray-400">⋯</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Footer - Simple close button */}
        <div className="flex items-center justify-between pt-6">
          <div className="text-sm text-gray-500">
            {selectedInvoices.length} invoice
            {selectedInvoices.length !== 1 ? 's' : ''} selected
          </div>
          <Button
            type="button"
            className="h-10 min-w-[113px]"
            variant="outline"
            onClick={() => onOpenChange?.(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
