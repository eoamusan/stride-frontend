import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
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
  DialogDescription,
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
  Plus,
  ReceiptIcon,
  X,
  Check,
  ChevronsUpDown,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import VendorService from '@/api/vendor';
import BillService from '@/api/bills';
import { useUserStore } from '@/stores/user-store';
import toast from 'react-hot-toast';
import AddVendorForm from '@/components/dashboard/accounting/accounts-payable/vendors/vendor-form';

// Zod schema for form validation
const billSchema = z.object({
  vendorId: z.string().min(1, 'Vendor ID is required'),
  source: z.string().min(1, 'Source is required'),
  billDate: z.date({
    required_error: 'Bill date is required',
  }),
  billNo: z.string().min(1, 'Bill number is required'),
  dueDate: z.date({
    required_error: 'Due date is required',
  }),
  category: z.string().min(1, 'Category is required'),
  billAmount: z.string().min(1, 'Bill amount is required'),
});

export default function AddBillForm({
  open,
  onOpenChange,
  initialData,
  onSuccess,
}) {
  const [openVendorForm, setOpenVendorForm] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = Boolean(
    initialData && (initialData.billNo || initialData.billId)
  );
  const businessId = useUserStore((state) => state.businessData?._id);

  // Fetch vendors
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await VendorService.fetch({ page: 1, perPage: 100 });
        const vendorsData = res.data?.data?.vendors || [];
        setVendors(vendorsData);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };

    if (open) {
      fetchVendors();
    }
  }, [open]);

  const form = useForm({
    resolver: zodResolver(billSchema),
    defaultValues: {
      vendorId: '',
      source: '',
      billDate: null,
      billNo: '',
      dueDate: null,
      category: '',
      billAmount: '',
    },
  });

  const { handleSubmit, reset } = form;

  // Update form values when initialData changes
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      const formData = {
        vendorId: initialData.vendor || initialData.vendorId || '',
        source: initialData.source || '',
        billDate: initialData.billDate ? new Date(initialData.billDate) : null,
        billNo: initialData.billNo || '',
        dueDate: initialData.dueDate ? new Date(initialData.dueDate) : null,
        category: initialData.category.toLowerCase() || '',
        billAmount: Number(initialData.billAmount) || '',
      };
      reset(formData);
    } else {
      // Reset to empty values when no initialData
      reset({
        vendorId: '',
        source: '',
        billDate: null,
        billNo: '',
        dueDate: null,
        category: '',
        billAmount: '',
      });
    }
  }, [initialData, reset]);

  const handleCancel = () => {
    reset();
    onOpenChange?.(false);
  };

  const onFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        vendorId: data.vendorId,
        source: data.source,
        billDate: data.billDate,
        dueDate: data.dueDate,
        billNo: data.billNo,
        category: data.category,
        billAmount: data.billAmount,
        businessId: businessId,
      };

      if (isEditing && initialData?.billId) {
        // Update existing bill
        await BillService.update({ id: initialData.billId, data: payload });
        toast.success('Bill updated successfully!');
      } else {
        // Create new bill
        await BillService.create({ data: payload });
        toast.success('Bill added successfully!');
      }

      reset();
      onOpenChange?.(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving bill:', error);
      toast.error(
        isEditing
          ? 'Failed to update bill. Please try again.'
          : 'Failed to add bill. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectVendor = () => {
    setOpenVendorForm(true);
  };

  const handleVendorSuccess = async () => {
    // Refresh vendors list after adding new vendor
    try {
      const res = await VendorService.fetch({ page: 1, perPage: 100 });
      const vendorsData = res.data?.data?.vendors || [];
      setVendors(vendorsData);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[95%] overflow-y-auto sm:max-w-3xl">
        {/* Header */}

        <div className="flex gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#254C00]">
            <ReceiptIcon color="white" size={16} />
          </div>
          <div>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Edit Bill' : 'Add New Bill'}
              </DialogTitle>
              <DialogDescription>Enter the necessary details</DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="mt-4 space-y-6"
          >
            {/* Details Section */}
            <div>
              <h3 className="mb-4 text-base font-semibold">Details</h3>

              <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
                {/* Vendor Name */}
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="vendorId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vendor Name</FormLabel>
                        <Popover>
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
                                  ? vendors.find(
                                      (vendor) =>
                                        (vendor._id || vendor.id) ===
                                        field.value
                                    )?.firstName +
                                    ' ' +
                                    vendors.find(
                                      (vendor) =>
                                        (vendor._id || vendor.id) ===
                                        field.value
                                    )?.lastName
                                  : 'Select vendor'}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                            <Command>
                              <CommandInput placeholder="Search vendor..." />
                              <CommandList>
                                <CommandEmpty>No vendor found.</CommandEmpty>
                                <CommandGroup>
                                  {vendors.map((vendor) => (
                                    <CommandItem
                                      key={vendor._id || vendor.id}
                                      value={`${vendor.firstName} ${vendor.lastName}`}
                                      onSelect={() => {
                                        field.onChange(vendor._id || vendor.id);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          (vendor._id || vendor.id) ===
                                            field.value
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                      {vendor.firstName} {vendor.lastName}
                                      {vendor.businessInformation
                                        ?.businessName && (
                                        <span className="text-muted-foreground ml-2 text-xs">
                                          (
                                          {
                                            vendor.businessInformation
                                              .businessName
                                          }
                                          )
                                        </span>
                                      )}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <button
                    type="button"
                    onClick={handleSelectVendor}
                    className="text-primary/90 hover:text-primary flex cursor-pointer items-center gap-1 text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    Select vendor
                  </button>
                </div>

                {/* Source */}
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter source"
                          {...field}
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Bill Date */}
                <FormField
                  control={form.control}
                  name="billDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bill Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'h-10 w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Enter bill date</span>
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

                {/* Bill No */}
                <FormField
                  control={form.control}
                  name="billNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bill No</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter no"
                          {...field}
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Due Date */}
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'h-10 w-full pl-3 text-left font-normal',
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
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="utilities">Utilities</SelectItem>
                          <SelectItem value="rent">Rent</SelectItem>
                          <SelectItem value="supplies">
                            Office Supplies
                          </SelectItem>
                          <SelectItem value="equipment">Equipment</SelectItem>
                          <SelectItem value="services">
                            Professional Services
                          </SelectItem>
                          <SelectItem value="maintenance">
                            Maintenance
                          </SelectItem>
                          <SelectItem value="travel">
                            Travel & Transport
                          </SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="insurance">Insurance</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Bill Amount */}
                <FormField
                  control={form.control}
                  name="billAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bill Amount</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            formatNumber
                            placeholder="Enter no"
                            {...field}
                            className="h-10 pr-8"
                            step="0.01"
                          />
                          <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
                            $
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="h-10 min-w-[120px] text-sm"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-10 min-w-[140px] text-sm"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Saving...'
                  : isEditing
                    ? 'Update Bill'
                    : 'Add Bill'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>

      {/* Add Vendor Form Modal */}
      <AddVendorForm
        open={openVendorForm}
        onOpenChange={setOpenVendorForm}
        showSuccessModal={handleVendorSuccess}
      />
    </Dialog>
  );
}
