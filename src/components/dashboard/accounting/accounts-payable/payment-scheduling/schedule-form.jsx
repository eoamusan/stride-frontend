import { useState, useEffect, useCallback } from 'react';
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
} from '@/components/ui/command';
import { format } from 'date-fns';
import {
  CalendarIcon,
  Search,
  Plus,
  FileText,
  CreditCardIcon,
  Check,
  ChevronsUpDown,
} from 'lucide-react';
import AccountingTable from '@/components/dashboard/accounting/table';
import BillService from '@/api/bills';
import { cn } from '@/lib/utils';
import VendorService from '@/api/vendor';
import PaymentScheduleService from '@/api/paymentSchedule';
import { useUserStore } from '@/stores/user-store';
import toast from 'react-hot-toast';

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

export default function SchedulePaymentForm({ open, onOpenChange, onSuccess }) {
  const [paymentType, setPaymentType] = useState('invoice');
  const [showSelectInvoices, setShowSelectInvoices] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState();
  const [allInvoices, setAllInvoices] = useState([]);
  const [isLoadingBills, setIsLoadingBills] = useState(false);
  const [openInvoiceCombobox, setOpenInvoiceCombobox] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [isLoadingVendors, setIsLoadingVendors] = useState(false);
  const [openVendorCombobox, setOpenVendorCombobox] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { activeBusiness } = useUserStore();

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

  const { handleSubmit, control, reset } = form;

  // Fetch bills
  const fetchBills = useCallback(async () => {
    try {
      setIsLoadingBills(true);
      const res = await BillService.fetch({ page: 1, perPage: 100 });
      const billsData = res.data?.data?.bills || [];

      // Transform bills for display
      const transformed = billsData.map((bill) => {
        const vendor = bill.vendorId;
        const vendorName =
          `${vendor?.firstName || ''} ${vendor?.lastName || ''}`.trim();
        const vendorInitials =
          `${vendor?.firstName?.[0] || ''}${vendor?.lastName?.[0] || ''}`.toUpperCase();

        return {
          id: bill._id || bill.id,
          vendorInitials: vendorInitials || 'NA',
          vendor: vendorName || 'N/A',
          invoiceId: bill.billNo,
          amount: `$${Number(bill.billAmount).toLocaleString('en-US')}`,
          category:
            bill.category?.charAt(0).toUpperCase() + bill.category?.slice(1) ||
            'N/A',
          dueDate: bill.dueDate
            ? format(new Date(bill.dueDate), 'M/d/yyyy')
            : 'N/A',
          status: bill.status,
          rawAmount: bill.billAmount,
          rawVendor: vendor,
        };
      });
      setAllInvoices(transformed);
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setIsLoadingBills(false);
    }
  }, []);

  // Fetch vendors
  const fetchVendors = useCallback(async () => {
    try {
      setIsLoadingVendors(true);
      const res = await VendorService.fetch({ page: 1, perPage: 100 });
      const vendorsData = res.data?.data?.vendors || [];
      setVendors(vendorsData);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setIsLoadingVendors(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchBills();
      fetchVendors();
    }
  }, [open, fetchBills, fetchVendors]);

  const handleCancel = () => {
    reset();
    setSelectedInvoice(null);
    setSelectedInvoices([]);
    onOpenChange?.(false);
  };

  const onSubmit = async (data) => {
    if (!activeBusiness?._id) {
      toast.error('Business not found');
      return;
    }

    try {
      setIsSubmitting(true);

      // Map form data to API payload
      const payload = {
        businessId: activeBusiness._id,
        invoiceId: data.invoiceId || undefined,
        vendorId: data.vendor,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        scheduledDate: data.scheduledDate.toISOString(),
        priority: data.priority,
        notes: data.notes || undefined,
        description: data.paymentDescription || undefined,
      };

      await PaymentScheduleService.create({ data: payload });

      toast.success('Payment scheduled successfully');
      reset();
      setSelectedInvoice(null);
      setSelectedInvoices([]);
      onOpenChange?.(false);
      onSuccess?.(); // Refresh the payment schedules list
    } catch (error) {
      console.error('Error scheduling payment:', error);
      toast.error(
        error.response?.data?.message || 'Failed to schedule payment'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentTypeChange = (type) => {
    setPaymentType(type);
    form.setValue('paymentType', type);
    if (type === 'invoice') {
      setShowSelectInvoices(true);
    }
  };

  const handleInvoiceSelect = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleSelectItem = (itemId, checked) => {
    if (checked) {
      // Find the selected invoice
      const selectedInvoice = allInvoices.find(
        (invoice) => invoice.id === itemId
      );

      if (selectedInvoice) {
        // Update form fields
        form.setValue('invoiceId', selectedInvoice.id);
        form.setValue('amount', selectedInvoice.rawAmount);

        // Find and set vendor by ID
        const vendorId =
          selectedInvoice.rawVendor?._id || selectedInvoice.rawVendor?.id;
        if (vendorId) {
          form.setValue('vendor', vendorId);
        }

        // Update selected invoice state
        setSelectedInvoice(selectedInvoice);
        setSelectedInvoices([itemId]);
        handleInvoiceSelect(selectedInvoice);
      }
    } else {
      // Deselect - clear form fields
      form.setValue('invoiceId', '');
      form.setValue('amount', '');
      form.setValue('vendor', '');
      setSelectedInvoice(null);
      setSelectedInvoices([]);
      handleInvoiceSelect(null);
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
                    {selectedInvoice
                      ? ` 1 Invoice selected`
                      : `${allInvoices.length || '0'} Invoices available`}
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
                  <div className="font-medium">Create Manual Payment</div>
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
                  {/* Invoice ID - Searchable Dropdown */}
                  <FormField
                    control={control}
                    name="invoiceId"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Invoice ID</FormLabel>
                        <Popover
                          open={openInvoiceCombobox}
                          onOpenChange={setOpenInvoiceCombobox}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  'h-10 w-full justify-between',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value
                                  ? allInvoices.find(
                                      (invoice) => invoice.id === field.value
                                    )?.invoiceId
                                  : 'Select invoice...'}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-87.5 p-0">
                            <Command>
                              <CommandInput placeholder="Search invoice..." />
                              {isLoadingBills ? (
                                <div className="flex items-center justify-center py-6">
                                  <div className="text-sm text-gray-500">
                                    Loading invoices...
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <CommandEmpty>No invoice found.</CommandEmpty>
                                  <CommandGroup className="max-h-75 overflow-auto">
                                    {allInvoices.map((invoice) => (
                                      <CommandItem
                                        key={invoice.id}
                                        value={invoice.invoiceId}
                                        onSelect={() => {
                                          form.setValue(
                                            'invoiceId',
                                            invoice.id
                                          );
                                          form.setValue(
                                            'amount',
                                            invoice.rawAmount
                                          );
                                          // Find and set vendor by ID
                                          const vendorId =
                                            invoice.rawVendor?._id ||
                                            invoice.rawVendor?.id;
                                          if (vendorId) {
                                            form.setValue('vendor', vendorId);
                                          }
                                          setSelectedInvoice(invoice);
                                          setSelectedInvoices([invoice.id]);
                                          setOpenInvoiceCombobox(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            'mr-2 h-4 w-4',
                                            invoice.id === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        <div className="flex flex-col">
                                          <span className="font-medium">
                                            {invoice.invoiceId}
                                          </span>
                                          <span className="text-xs text-gray-500">
                                            {invoice.vendor} - {invoice.amount}
                                          </span>
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </>
                              )}
                            </Command>
                          </PopoverContent>
                        </Popover>
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
                            formatNumber
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
                          <PopoverContent
                            className="w-(--radix-popover-trigger-width) p-0"
                            align="start"
                          >
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
                  {/* Vendor - Searchable Dropdown */}
                  <FormField
                    control={control}
                    name="vendor"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Vendor</FormLabel>
                        <Popover
                          open={openVendorCombobox}
                          onOpenChange={setOpenVendorCombobox}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  'h-10 w-full justify-between',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value
                                  ? (() => {
                                      const vendor = vendors.find(
                                        (v) => (v._id || v.id) === field.value
                                      );
                                      return vendor
                                        ? `${vendor.firstName || ''} ${vendor.lastName || ''}`.trim()
                                        : 'Select vendor...';
                                    })()
                                  : 'Select vendor...'}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-100 p-0">
                            <Command>
                              <CommandInput placeholder="Search vendor..." />
                              {isLoadingVendors ? (
                                <div className="flex items-center justify-center py-6">
                                  <div className="text-sm text-gray-500">
                                    Loading vendors...
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <CommandEmpty>No vendor found.</CommandEmpty>
                                  <CommandGroup className="max-h-75 overflow-auto">
                                    {vendors.map((vendor) => {
                                      const vendorId = vendor._id || vendor.id;
                                      const vendorName =
                                        `${vendor.firstName || ''} ${vendor.lastName || ''}`.trim();
                                      return (
                                        <CommandItem
                                          key={vendorId}
                                          value={vendorName}
                                          onSelect={() => {
                                            form.setValue('vendor', vendorId);
                                            setOpenVendorCombobox(false);
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              'mr-2 h-4 w-4',
                                              vendorId === field.value
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                            )}
                                          />
                                          <div className="flex flex-col">
                                            <span className="font-medium">
                                              {vendorName}
                                            </span>
                                            {vendor.contact?.email && (
                                              <span className="text-xs text-gray-500">
                                                {vendor.contact.email}
                                              </span>
                                            )}
                                          </div>
                                        </CommandItem>
                                      );
                                    })}
                                  </CommandGroup>
                                </>
                              )}
                            </Command>
                          </PopoverContent>
                        </Popover>
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
                              <SelectValue placeholder="Select Priority" />
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
                          className="min-h-25 w-full resize-none"
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
                        className="min-h-25 w-full resize-none"
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
                className="h-10 min-w-28.25"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-10 min-w-39"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Scheduling...' : 'Schedule Payment'}
              </Button>
            </div>
          </form>
        </Form>

        <SelectInvoices
          open={showSelectInvoices}
          onOpenChange={setShowSelectInvoices}
          allInvoices={allInvoices}
          onInvoiceSelect={handleInvoiceSelect}
          handleSelectItem={handleSelectItem}
          isLoadingBills={isLoadingBills}
          selectedInvoices={selectedInvoices}
          setSelectedInvoices={setSelectedInvoices}
        />
      </DialogContent>
    </Dialog>
  );
}

const SelectInvoices = ({
  open,
  onOpenChange,
  allInvoices = [],
  handleSelectItem,
  isLoadingBills = false,
  selectedInvoices = [],
  setSelectedInvoices,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const onSelectItem = (itemId, checked) => {
    if (checked) {
      setSelectedInvoices([itemId]);
    } else {
      setSelectedInvoices([]);
    }
    // Call parent handler to update form
    if (handleSelectItem) {
      handleSelectItem(itemId, checked);
    }
  };

  // Column configuration matching the payment scheduling page
  const invoiceColumns = [
    {
      key: 'img',
      label: 'Img',
      render: (value, item) => (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium">
          {item.vendorInitials}
        </div>
      ),
    },
    { key: 'vendor', label: 'Vendor' },
    { key: 'invoiceId', label: 'Invoice ID' },
    { key: 'amount', label: 'Amount' },
    { key: 'category', label: 'Category' },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (value, item) => (
        <div className="flex flex-col">
          <span className="text-sm text-[#434343]">{value}</span>
          {item.overdueDays && item.overdueDays !== '0 days overdue' && (
            <span className="text-xs text-red-500">{item.overdueDays}</span>
          )}
        </div>
      ),
    },
    { key: 'status', label: 'Status' },
  ];

  const statusStyles = {
    Pending: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
    PENDING: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
    Paid: 'bg-green-100 text-green-800 hover:bg-green-100',
    PAID: 'bg-green-100 text-green-800 hover:bg-green-100',
    Overdue: 'bg-red-100 text-red-800 hover:bg-red-100',
    PAST_DUE: 'bg-red-100 text-red-800 hover:bg-red-100',
    'Past Due': 'bg-red-100 text-red-800 hover:bg-red-100',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[90%] max-w-5xl overflow-y-auto p-8 sm:max-w-5xl">
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
            <AccountingTable
              title="Available Invoices"
              isLoading={isLoadingBills}
              actionBtns={
                <>
                  <Button onClick={() => onOpenChange?.(false)}>
                    Continue
                  </Button>
                </>
              }
              data={allInvoices}
              columns={invoiceColumns}
              searchFields={['vendor', 'invoiceId', 'amount', 'category']}
              showDataSize={true}
              searchPlaceholder="Search vendor, amount or invoice ......"
              statusStyles={statusStyles}
              paginationData={{
                page: currentPage,
                totalPages: Math.ceil(allInvoices.length / itemsPerPage),
                pageSize: itemsPerPage,
                totalCount: allInvoices.length,
              }}
              onPageChange={setCurrentPage}
              selectedItems={selectedInvoices}
              handleSelectItem={onSelectItem}
            />
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
            className="h-10 min-w-28.25"
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
