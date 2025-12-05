import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  BadgeDollarSignIcon,
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Plus,
  Trash2,
  UploadIcon,
  X,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Switch } from '@/components/ui/switch';
import AccountService from '@/api/accounts';
import VendorService from '@/api/vendor';
import ExpenseService from '@/api/expense';
import AddAccountForm from '../../bookkeeping/add-account';
import VendorForm from '../../accounts-payable/vendors/vendor-form';
import { uploadMultipleToCloudinary } from '@/lib/cloudinary';
import { useUserStore } from '@/stores/user-store';
import toast from 'react-hot-toast';

// Zod schema for form validation
const expenseSchema = z.object({
  payee: z.string().min(1, 'Payee is required'),
  refNo: z.string().optional(),
  paymentAccount: z.string().min(1, 'Payment account is required'),
  paymentDate: z.date({
    required_error: 'Payment date is required',
  }),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  country: z.string().min(1, 'Country is required'),
  memo: z.string().optional(),
  categories: z
    .array(
      z.object({
        accountingAccountId: z.string().min(1, 'Category is required'),
        amount: z.string().min(1, 'Amount is required'),
        description: z.string().optional(),
        billable: z.boolean().default(false),
        tax: z.string().optional(),
        clientProject: z.string().optional(),
        class: z.string().optional(),
      })
    )
    .min(1, 'At least one category is required'),
});

export default function ExpenseForm({
  open,
  onOpenChange,
  onSubmit,
  onSuccess,
  isEditMode = false,
  expenseToEdit = null,
}) {
  // File upload state and refs
  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const attachmentFileInputRef = useRef(null);
  const [countries, setCountries] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [isAddVendorModalOpen, setIsAddVendorModalOpen] = useState(false);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch vendors
  useEffect(() => {
    const fetchVendors = async () => {
      if (!open) return;

      try {
        const response = await VendorService.fetch({});
        const vendorData = response.data?.data?.vendors || [];
        setVendors(vendorData);
      } catch (error) {
        console.error('Error fetching vendors:', error);
        setVendors([]);
      }
    };

    fetchVendors();
  }, [open]);

  // Fetch accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      if (!open) return;

      try {
        const response = await AccountService.fetch({
          accountType: 'expenses',
        });
        const accountsData = response.data?.data?.accounts || [];
        setAccounts(accountsData);
      } catch (error) {
        console.error('Error fetching accounts:', error);
        setAccounts([]);
      }
    };

    fetchAccounts();
  }, [open]);

  useEffect(() => {
    async function fetchCountries() {
      if (!open) return;
      const response = await fetch(
        'https://restcountries.com/v3.1/all?fields=name,flags,cca2'
      );
      const data = await response.json();
      setCountries(data);
    }
    fetchCountries();
  }, [open]);

  const form = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      payee: '',
      refNo: '',
      paymentAccount: '',
      paymentDate: null,
      paymentMethod: '',
      country: '',
      memo: '',
      categories: [
        {
          accountingAccountId: '',
          amount: '',
          description: '',
          billable: false,
          tax: '',
          clientProject: '',
          class: '',
        },
      ],
    },
  });

  const { handleSubmit, reset, control, watch } = form;
  const categories = watch('categories');
  const payee = watch('payee');
  const paymentAccount = watch('paymentAccount');
  const paymentDate = watch('paymentDate');
  const paymentMethod = watch('paymentMethod');
  const country = watch('country');

  // Form validation - disable submit button if required fields are empty
  const isFormValid = () => {
    // Check required fields
    if (
      !payee ||
      !paymentAccount ||
      !paymentDate ||
      !paymentMethod ||
      !country
    ) {
      return false;
    }

    // Check at least one category with accountingAccountId and amount
    const hasValidCategory = categories.some(
      (category) =>
        category.accountingAccountId &&
        category.amount &&
        parseFloat(category.amount) > 0
    );

    return hasValidCategory;
  };

  // Pre-populate form when in edit mode
  useEffect(() => {
    if (isEditMode && expenseToEdit && open) {
      const expense = expenseToEdit.expense;
      const vendor = expenseToEdit.vendor;

      form.reset({
        payee: vendor?._id || vendor?.id || '',
        refNo: expense?.refNo || '',
        paymentAccount: expense?.paymentAccount || '',
        paymentDate: expense?.paymentDate
          ? new Date(expense.paymentDate)
          : null,
        paymentMethod: expense?.paymentMethod || '',
        country: expense?.country || '',
        memo: expense?.memo || '',
        categories:
          expense?.categoryDetails?.length > 0
            ? expense.categoryDetails.map((cat) => ({
                accountingAccountId: cat.accountingAccountId || '',
                amount: String(cat.amount || ''),
                description: cat.description || '',
                billable: cat.billable === true || cat.billable === 'true',
                tax: String(cat.tax || ''),
                clientProject: cat.clientProject || '',
                class: cat.class || '',
              }))
            : [
                {
                  accountingAccountId: '',
                  amount: '',
                  description: '',
                  billable: false,
                  tax: '',
                  clientProject: '',
                  class: '',
                },
              ],
      });

      // Note: Attachments from existing expense would need to be handled separately
      // if you want to show existing attachments
    } else if (!open) {
      // Reset form when modal closes
      form.reset({
        payee: '',
        refNo: '',
        paymentAccount: '',
        paymentDate: null,
        paymentMethod: '',
        country: '',
        memo: '',
        categories: [
          {
            accountingAccountId: '',
            amount: '',
            description: '',
            billable: false,
            tax: '',
            clientProject: '',
            class: '',
          },
        ],
      });
      setAttachmentFiles([]);
    }
  }, [isEditMode, expenseToEdit, open, form]);

  // File upload handlers
  const handleAttachmentFileSelect = (event) => {
    const files = Array.from(event.target.files);

    files.forEach((file) => {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(
          `File "${file.name}" is too large. File size must be less than 10MB`
        );
        return;
      }

      // Check if file already exists
      setAttachmentFiles((prev) => {
        const fileExists = prev.some(
          (existingFile) =>
            existingFile.name === file.name && existingFile.size === file.size
        );

        if (fileExists) {
          alert(`File "${file.name}" is already attached`);
          return prev;
        }

        return [...prev, file];
      });
    });

    // Clear the input so the same file can be selected again if needed
    event.target.value = '';
  };

  const removeAttachmentFile = (fileToRemove) => {
    setAttachmentFiles((prev) => prev.filter((file) => file !== fileToRemove));
  };

  const removeAllAttachments = () => {
    setAttachmentFiles([]);
    if (attachmentFileInputRef.current) {
      attachmentFileInputRef.current.value = '';
    }
  };

  // Category management
  const addCategory = () => {
    const currentCategories = form.getValues('categories');
    form.setValue('categories', [
      ...currentCategories,
      {
        accountingAccountId: '',
        amount: '',
        description: '',
        billable: false,
        tax: '',
        clientProject: '',
        class: '',
      },
    ]);
  };

  const removeCategory = (index) => {
    const currentCategories = form.getValues('categories');
    if (currentCategories.length > 1) {
      form.setValue(
        'categories',
        currentCategories.filter((_, i) => i !== index)
      );
    }
  };

  // Calculate total
  const calculateTotal = () => {
    return categories.reduce((total, category) => {
      const amount = parseFloat(category.amount) || 0;
      return total + amount;
    }, 0);
  };

  const handleCancel = () => {
    reset();
    setAttachmentFiles([]);
    onOpenChange?.(false);
  };

  const onFormSubmit = async (data) => {
    setIsSubmitting(true);
    const businessId = useUserStore.getState().businessData?._id;

    try {
      // Upload attachments to Cloudinary if any
      let attachmentUrls = [];
      if (attachmentFiles.length > 0) {
        toast.loading('Uploading attachments...');
        const uploadResults = await uploadMultipleToCloudinary(
          attachmentFiles,
          {
            folder: 'expenses',
            tags: ['expense', businessId],
          }
        );
        attachmentUrls = uploadResults.map((result) => result.url);
        toast.dismiss();
      }

      // Transform form data to match API schema
      const payload = {
        businessId,
        vendorId: data.payee,
        refNo: data.refNo || '',
        accountingAccountId: data.paymentAccount,
        paymentDate: data.paymentDate,
        paymentMethod: data.paymentMethod,
        country: data.country,
        categoryDetails: data.categories.map((cat) => ({
          accountingAccountId: cat.accountingAccountId,
          amount: parseFloat(cat.amount),
          description: cat.description || '',
          billable: cat.billable || '',
          tax: cat.tax || '',
          clientProject: cat.clientProject || '',
          class: cat.class || '',
        })),
        total: calculateTotal(),
        memo: data.memo || '',
        attachments:
          isEditMode && attachmentFiles.length === 0
            ? expenseToEdit?.expense?.attachments || []
            : attachmentUrls,
      };

      // Call the create or update expense API
      let response;
      if (isEditMode && expenseToEdit?.expense?._id) {
        toast.loading('Updating expense...');
        response = await ExpenseService.update({
          id: expenseToEdit.expense._id,
          data: payload,
        });
        toast.dismiss();
        toast.success('Expense updated successfully!');
      } else {
        toast.loading('Creating expense...');
        response = await ExpenseService.create({ data: payload });
        toast.dismiss();
        toast.success('Expense created successfully!');
      }

      if (response.data) {
        // Reset form and close modal
        reset();
        setAttachmentFiles([]);
        onOpenChange?.(false);

        // Call success callbacks
        if (onSubmit) {
          onSubmit(response.data);
        }
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      toast.dismiss();
      console.error(
        isEditMode ? 'Error updating expense:' : 'Error creating expense:',
        error
      );
      toast.error(
        error.response?.data?.message ||
          error.message ||
          `Failed to ${isEditMode ? 'update' : 'create'} expense`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[95%] overflow-y-auto sm:max-w-5xl">
        {/* Header */}
        <div className="flex gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#254C00]">
            <BadgeDollarSignIcon size={16} color="white" />
          </div>
          <div>
            <DialogHeader>
              <DialogTitle className="text-xl">
                {isEditMode ? 'Edit Expense' : 'Record Expense'}
              </DialogTitle>
              <DialogDescription className="text-sm">
                Enter the details
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Basic Details Section */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Payee */}
              <FormField
                control={control}
                name="payee"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Payee</FormLabel>
                    <Popover modal={true}>
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
                                    (vendor._id || vendor.id) === field.value
                                )?.firstName +
                                  ' ' +
                                  vendors.find(
                                    (vendor) =>
                                      (vendor._id || vendor.id) === field.value
                                  )?.lastName || 'Select vendor'
                              : 'Who did you pay?'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-(--radix-popover-trigger-width) p-0"
                        align="start"
                      >
                        <Command>
                          <CommandInput placeholder="Search vendors..." />
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
                                      field.value === (vendor._id || vendor.id)
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {vendor.firstName} {vendor.lastName}
                                    </span>
                                    {vendor.businessInformation && (
                                      <span className="text-xs text-gray-500">
                                        {vendor.businessInformation
                                          ?.businessName || ''}
                                      </span>
                                    )}
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                            <div
                              className="flex cursor-pointer items-center gap-1 px-2 py-1 text-sm font-medium hover:font-semibold"
                              onClick={() => setIsAddVendorModalOpen(true)}
                            >
                              <Plus size={16} color="#254C00" /> Add New
                            </div>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ref No */}
              <FormField
                control={control}
                name="refNo"
                render={({ field }) => (
                  <FormItem className={'lg:col-start-3'}>
                    <FormLabel>Ref No</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter ref no"
                        {...field}
                        className="h-10 w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Account */}
              <FormField
                control={control}
                name="paymentAccount"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Payment Account</FormLabel>
                    <Popover modal={true}>
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
                              ? accounts.find(
                                  (account) =>
                                    (account._id || account.id) === field.value
                                )?.accountName || 'Select account'
                              : 'Select payment account'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
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
                              {accounts.map((account) => (
                                <CommandItem
                                  key={account._id || account.id}
                                  value={account.accountName}
                                  onSelect={() => {
                                    field.onChange(account._id || account.id);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      field.value ===
                                        (account._id || account.id)
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                    )}
                                  />
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {account.accountName}
                                    </span>
                                    {account.accountCode && (
                                      <span className="text-xs text-gray-500">
                                        {account.accountCode}
                                      </span>
                                    )}
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>

                            <div className="border-t p-2">
                              <Button
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={() => setIsAddAccountModalOpen(true)}
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Account
                              </Button>
                            </div>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Date */}
              <FormField
                control={control}
                name="paymentDate"
                render={({ field }) => (
                  <FormItem className={'lg:col-start-1'}>
                    <FormLabel>Payment date</FormLabel>
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
                      <PopoverContent
                        className="w-(--radix-popover-trigger-width) p-0"
                        align="start"
                      >
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

              {/* Payment Method */}
              <FormField
                control={control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 w-full">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="debit_card">Debit Card</SelectItem>
                        <SelectItem value="bank_transfer">
                          Bank Transfer
                        </SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                        <SelectItem value="online">Online Payment</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Country */}
              <FormField
                control={control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Popover modal={true}>
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
                            {field.value ? (
                              <span className="flex items-center gap-2">
                                <img
                                  src={
                                    countries.find(
                                      (country) => country.cca2 === field.value
                                    )?.flags.svg
                                  }
                                  alt={
                                    countries.find(
                                      (country) => country.cca2 === field.value
                                    )?.flags.alt
                                  }
                                  width={20}
                                  height={15}
                                />
                                <span>
                                  {
                                    countries.find(
                                      (country) => country.cca2 === field.value
                                    )?.name.common
                                  }
                                </span>
                              </span>
                            ) : (
                              'Select country'
                            )}

                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        align="start"
                        className="w-(--radix-popover-trigger-width) p-0"
                      >
                        <Command>
                          <CommandInput
                            placeholder="Search countries..."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>Country(s) not found.</CommandEmpty>
                            <CommandGroup>
                              {countries.length > 0 &&
                                countries
                                  .sort((a, b) =>
                                    a.name.common.localeCompare(b.name.common)
                                  )
                                  .map((country, i) => (
                                    <CommandItem
                                      value={country.name.common}
                                      key={i}
                                      onSelect={() => {
                                        form.setValue('country', country.cca2);
                                      }}
                                    >
                                      <img
                                        src={country.flags.svg}
                                        alt={country.flags.alt}
                                        width={20}
                                        height={15}
                                      />
                                      {country.name.common}
                                      <Check
                                        className={cn(
                                          'ml-auto',
                                          country.cca2 === field.value
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
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
            </div>

            <hr />

            {/* Category Details Section */}
            <div className="space-y-4">
              <h3 className="text-base font-semibold">Category details</h3>

              {/* Category Rows */}
              <div className="space-y-4">
                {categories.map((_, index) => (
                  <div
                    key={index}
                    className="space-y-3 rounded-lg border border-gray-200 p-4"
                  >
                    {/* First Row: Category, Amount, Client/Project, Class/Branch */}
                    <div className="grid grid-cols-12 items-start gap-4">
                      {/* Category */}
                      <div className="col-span-3">
                        <FormField
                          control={control}
                          name={`categories.${index}.accountingAccountId`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Category</FormLabel>
                              <Popover modal={true}>
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
                                        ? accounts.find(
                                            (account) =>
                                              (account._id || account.id) ===
                                              field.value
                                          )?.accountName || 'Select category'
                                        : 'Select category'}
                                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-(--radix-popover-trigger-width) p-0"
                                  align="start"
                                >
                                  <Command>
                                    <CommandInput placeholder="Search accounts..." />
                                    <CommandList>
                                      <CommandEmpty>
                                        No account found.
                                      </CommandEmpty>
                                      <CommandGroup>
                                        {accounts.map((account) => (
                                          <CommandItem
                                            key={account._id || account.id}
                                            value={account.accountName}
                                            onSelect={() => {
                                              field.onChange(
                                                account._id || account.id
                                              );
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                'mr-2 h-4 w-4',
                                                field.value ===
                                                  (account._id || account.id)
                                                  ? 'opacity-100'
                                                  : 'opacity-0'
                                              )}
                                            />
                                            <div className="flex flex-col">
                                              <span className="font-medium">
                                                {account.accountName}
                                              </span>
                                              {account.accountCode && (
                                                <span className="text-xs text-gray-500">
                                                  {account.accountCode}
                                                </span>
                                              )}
                                            </div>
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>

                                      <div className="border-t p-2">
                                        <Button
                                          variant="ghost"
                                          className="w-full justify-start"
                                          onClick={() =>
                                            setIsAddAccountModalOpen(true)
                                          }
                                        >
                                          <Plus className="mr-2 h-4 w-4" />
                                          Add Account
                                        </Button>
                                      </div>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Amount */}
                      <div className="col-span-3">
                        <FormField
                          control={control}
                          name={`categories.${index}.amount`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amount</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  formatNumber
                                  placeholder="Enter amount"
                                  {...field}
                                  className="h-10"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Client/Project */}
                      <div className="col-span-3">
                        <FormField
                          control={control}
                          name={`categories.${index}.clientProject`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Client/Project</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter client name or project"
                                  {...field}
                                  className="h-10"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Class/Branch */}
                      <div className="col-span-2">
                        <FormField
                          control={control}
                          name={`categories.${index}.class`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Class/Branch</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter class or branch"
                                  {...field}
                                  className="h-10"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Delete Button */}
                      <div className="col-span-1 flex items-end justify-center pb-2">
                        {categories.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeCategory(index)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Second Row: Description, Billable, Tax */}
                    <div className="grid grid-cols-12 items-start gap-4">
                      {/* Description */}
                      <div className="col-span-6">
                        <FormField
                          control={control}
                          name={`categories.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter description"
                                  {...field}
                                  className="min-h-20 resize-none"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Billable */}
                      <div className="col-span-5 flex items-center gap-6">
                        <FormField
                          control={control}
                          name={`categories.${index}.billable`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Billable</FormLabel>
                              <FormControl>
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                  <span className="text-sm text-gray-600">
                                    {field.value ? 'Yes' : 'No'}
                                  </span>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={control}
                          name={`categories.${index}.tax`}
                          render={({ field }) => (
                            <FormItem className={'pt-3'}>
                              <FormLabel>Tax</FormLabel>
                              <FormControl>
                                <Input
                                  type={'number'}
                                  formatNumber
                                  placeholder="Enter tax"
                                  {...field}
                                  className="h-10"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Tax */}
                      <div className="col-span-3"></div>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addCategory}
                  className="mt-6 flex items-center gap-2 text-xs"
                >
                  <Plus className="size-4" />
                  Add Lines
                </Button>
              </div>

              {/* Total */}
              <div className="flex justify-end">
                <div className="text-right">
                  <div className="text-sm text-gray-600">Total</div>
                  <div className="text-lg font-semibold">
                    $
                    {new Intl.NumberFormat('en-US').format(
                      calculateTotal().toFixed(2)
                    )}
                  </div>
                </div>
              </div>
            </div>

            <hr />

            {/* Memo and Attachments Section */}
            <div className="grid grid-cols-1 gap-6 pt-3 lg:grid-cols-2">
              {/* Memo */}
              <div className="space-y-3">
                <Label>Memo</Label>
                <FormField
                  control={control}
                  name="memo"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Add any additional notes..."
                          className="min-h-40 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Attachments */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Attachments</Label>
                  {attachmentFiles.length > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeAllAttachments}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                <input
                  type="file"
                  ref={attachmentFileInputRef}
                  onChange={handleAttachmentFileSelect}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  multiple
                  className="hidden"
                />

                {/* Display attached files */}
                {attachmentFiles.length > 0 && (
                  <div className="space-y-2">
                    {attachmentFiles.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="rounded bg-blue-100 p-2">
                            <UploadIcon className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachmentFile(file)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload area */}
                <div
                  onClick={() => attachmentFileInputRef.current?.click()}
                  className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center hover:border-gray-400 hover:bg-gray-50"
                >
                  <UploadIcon className="text-primary mx-auto h-12 w-12" />
                  <p className="mt-2 text-sm text-gray-600">
                    Click or drag file to this area to upload
                  </p>
                  <p className="text-xs text-gray-500">
                    Support for a single or bulk upload
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end space-x-4 pt-10 pb-5">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="h-10 min-w-[130px] text-sm"
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="h-10 min-w-[195px] text-sm"
                disabled={isSubmitting || !isFormValid()}
              >
                {isSubmitting
                  ? isEditMode
                    ? 'Updating...'
                    : 'Adding...'
                  : isEditMode
                    ? 'Update Expense'
                    : 'Add Expenses'}
              </Button>
            </div>
          </form>
        </Form>

        {/* Add Vendor Modal */}
        <VendorForm
          open={isAddVendorModalOpen}
          onOpenChange={setIsAddVendorModalOpen}
          showSuccessModal={async () => {
            // Refresh vendors list
            try {
              const response = await VendorService.fetch({});
              const vendorData = response.data?.data?.vendors || [];
              setVendors(vendorData);
            } catch (error) {
              console.error('Error refreshing vendors:', error);
            }
          }}
        />

        {/* Add Account Modal */}
        <AddAccountForm
          isOpen={isAddAccountModalOpen}
          type={'expenses'}
          onClose={setIsAddAccountModalOpen}
          showSuccessModal={async () => {
            // Refresh accounts list
            try {
              const response = await AccountService.fetch({
                accountType: 'expenses',
              });
              const accountsData = response.data?.data?.accounts || [];
              setAccounts(accountsData);
            } catch (error) {
              console.error('Error refreshing accounts:', error);
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
