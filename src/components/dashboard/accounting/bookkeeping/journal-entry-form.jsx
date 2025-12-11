import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import {
  CalendarIcon,
  Trash2Icon,
  Upload,
  UploadIcon,
  Plus,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Switch } from '@/components/ui/switch';
import AccountService from '@/api/accounts';
import CustomerService from '@/api/customer';
import VendorService from '@/api/vendor';
import JournalService from '@/api/journal';
import AddAccountForm from '@/components/dashboard/accounting/bookkeeping/add-account';
import { useUserStore } from '@/stores/user-store';
import toast from 'react-hot-toast';

const entrySchema = z.object({
  account: z.string().min(1, { message: 'Account is required' }),
  debit: z.string().optional(),
  credit: z.string().optional(),
  description: z.string().optional(),
  name: z.string().optional(),
  branch: z.string().optional(),
  class: z.string().optional(),
});

const formSchema = z.object({
  journalDate: z.date({ required_error: 'Journal date is required' }),
  currency: z.string().min(1, { message: 'Currency is required' }),
  journalNo: z.string().min(1, { message: 'Journal number is required' }),
  entries: z
    .array(entrySchema)
    .min(1, { message: 'At least one entry is required' }),
  memo: z.string().optional(),
  makeRecurring: z.boolean().default(false),
});

export default function JournalEntryForm({ isOpen, onClose, onSuccess }) {
  const [attachments, setAttachments] = useState([]);
  const [accountOptions, setAccountOptions] = useState([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [nameOptions, setNameOptions] = useState([]);
  const [isLoadingNames, setIsLoadingNames] = useState(false);
  const [accountSearchQuery, setAccountSearchQuery] = useState('');
  const [nameSearchQuery, setNameSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { businessData } = useUserStore();

  // Filter account options based on search query
  const filteredAccountOptions = accountOptions.filter((option) =>
    option.label.toLowerCase().includes(accountSearchQuery.toLowerCase())
  );

  // Filter name options based on search query
  const filteredNameOptions = nameOptions.filter((option) =>
    option.label.toLowerCase().includes(nameSearchQuery.toLowerCase())
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      journalDate: new Date(),
      currency: '',
      journalNo: '',
      entries: [
        {
          account: '',
          debit: '',
          credit: '',
          description: '',
          name: '',
          branch: '',
          class: '',
        },
      ],
      memo: '',
      makeRecurring: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'entries',
  });

  const currencyOptions = [
    { value: 'ngn', label: 'NGN Nigerian Naira' },
    { value: 'usd', label: 'USD US Dollar' },
    { value: 'eur', label: 'EUR Euro' },
    { value: 'gbp', label: 'GBP British Pound' },
  ];

  // Fetch accounts on mount
  useEffect(() => {
    const fetchAccounts = async () => {
      setIsLoadingAccounts(true);
      try {
        const response = await AccountService.fetch({
          page: 1,
          perPage: 100,
        });
        const accounts = response.data?.data?.accounts || [];
        const formattedAccounts = accounts.map((account) => ({
          value: account._id,
          label: `${account.accountCode || account.accountNumber || ''} - ${account.accountName}`,
        }));
        setAccountOptions(formattedAccounts);
      } catch (error) {
        console.error('Error fetching accounts:', error);
        toast.error('Failed to fetch accounts');
      } finally {
        setIsLoadingAccounts(false);
      }
    };

    if (isOpen) {
      fetchAccounts();
    }
  }, [isOpen]);

  // Fetch customers and vendors
  useEffect(() => {
    const fetchNamesData = async () => {
      setIsLoadingNames(true);
      try {
        const [customersResponse, vendorsResponse] = await Promise.all([
          CustomerService.fetch({ page: 1, perPage: 100 }),
          VendorService.fetch({ page: 1, perPage: 100 }),
        ]);

        const customers = customersResponse.data?.data?.customers || [];
        const vendors = vendorsResponse.data?.data?.vendors || [];

        const formattedCustomers = customers.map((customer) => ({
          value: customer?.customer?._id,
          label: `Customer - ${customer?.customer?.displayName || `${customer?.customer?.firstName} ${customer?.customer?.lastName}`}`,
          type: 'customer',
        }));

        const formattedVendors = vendors.map((vendor) => ({
          value: vendor._id,
          label: `Vendor - ${vendor.displayName || `${vendor.firstName} ${vendor.lastName}`}`,
          type: 'vendor',
        }));

        setNameOptions([...formattedCustomers, ...formattedVendors]);
      } catch (error) {
        console.error('Error fetching customers/vendors:', error);
        toast.error('Failed to fetch customers and vendors');
      } finally {
        setIsLoadingNames(false);
      }
    };

    if (isOpen) {
      fetchNamesData();
    }
  }, [isOpen]);

  const branchOptions = [
    { value: 'main', label: 'Main Branch' },
    { value: 'lagos', label: 'Lagos Branch' },
    { value: 'abuja', label: 'Abuja Branch' },
  ];

  const classOptions = [
    { value: 'operating', label: 'Operating' },
    { value: 'capital', label: 'Capital' },
    { value: 'project', label: 'Project' },
  ];

  const addLine = () => {
    append({
      account: '',
      debit: '',
      credit: '',
      description: '',
      name: '',
      branch: '',
      class: '',
    });
  };

  const removeLine = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  // Watch entries to recalculate totals when they change
  const watchedEntries = form.watch('entries');

  const calculateTotals = (entries) => {
    const totalDebit = entries.reduce(
      (sum, entry) => sum + (parseFloat(entry.debit) || 0),
      0
    );
    const totalCredit = entries.reduce(
      (sum, entry) => sum + (parseFloat(entry.credit) || 0),
      0
    );
    return { totalDebit, totalCredit };
  };

  const { totalDebit, totalCredit } = calculateTotals(watchedEntries || []);

  const handleSubmit = async (data) => {
    // Validate that debits equal credits
    if (totalDebit.toFixed(2) !== totalCredit.toFixed(2)) {
      toast.error('Journal not balanced', {
        description: 'Total debits must equal total credits',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Transform entries to match API format
      const formattedEntries = data.entries.map((entry) => ({
        accountingAccountId: entry.account,
        debit: parseFloat(entry.debit) || 0,
        credit: parseFloat(entry.credit) || 0,
        description: entry.description || '',
        name: entry.name || '',
        branch: entry.branch || '',
        class: entry.class || '',
      }));

      const journalData = {
        businessId: businessData?._id,
        date: data.journalDate.toISOString(),
        currency: data.currency,
        journalNo: data.journalNo,
        account: formattedEntries,
        memo: data.memo || '',
        attachments: attachments.map((att) => att.name),
        recurring: data.makeRecurring,
        recurringDetails: data.makeRecurring ? [] : undefined,
      };

      await JournalService.create({ data: journalData });
      toast.success('Journal entry created successfully');
      onClose();
      form.reset();
      setAttachments([]);
      onSuccess();
    } catch (error) {
      console.error('Error creating journal entry:', error);
      toast.error(
        error.response?.data?.message || 'Failed to create journal entry'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleClearAll = () => {
  //   setAttachments([]);
  //   form.reset({
  //     journalDate: new Date(),
  //     currency: '',
  //     journalNo: '',
  //     entries: [
  //       {
  //         account: '',
  //         debit: '',
  //         credit: '',
  //         description: '',
  //         name: '',
  //         branch: '',
  //         class: '',
  //       },
  //     ],
  //     memo: '',
  //     makeRecurring: false,
  //   });
  // };

  const handleAccountAdded = async () => {
    // Refetch accounts after adding a new one
    setIsLoadingAccounts(true);
    try {
      const response = await AccountService.fetch({
        page: 1,
        perPage: 100,
      });
      const accounts = response.data?.data?.accounts || [];
      const formattedAccounts = accounts.map((account) => ({
        value: account._id,
        label: `${account.accountCode || account.accountNumber || ''} - ${account.accountName}`,
      }));
      setAccountOptions(formattedAccounts);
      toast.success('Account added successfully');
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map((file, index) => ({
      id: Date.now() + index,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    setAttachments([...attachments, ...newAttachments]);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const newAttachments = files.map((file, index) => ({
      id: Date.now() + index,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
    }));
    setAttachments([...attachments, ...newAttachments]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeAttachment = (id) => {
    setAttachments(attachments.filter((attachment) => attachment.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] w-[90%] max-w-6xl overflow-y-auto p-8 sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">New Entry</DialogTitle>
          <DialogDescription>Enter the details</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mt-4 w-full space-y-6"
          >
            {/* Top Form Fields */}
            <div className="flex flex-wrap gap-4">
              {/* Journal Date */}
              <FormField
                control={form.control}
                name="journalDate"
                render={({ field }) => (
                  <FormItem className="w-[197px]">
                    <FormLabel className="text-sm font-medium">
                      Journal date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'h-10 w-[197px] justify-start text-left text-sm font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value
                              ? format(field.value, 'PP')
                              : 'Choose date'}
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
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Currency */}
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem className="w-[197px]">
                    <FormLabel className="text-sm font-medium">
                      Currency
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-[197px] text-sm">
                          <SelectValue placeholder="NGN Nigerian Naira" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Journal No */}
              <FormField
                control={form.control}
                name="journalNo"
                render={({ field }) => (
                  <FormItem className="w-[197px]">
                    <FormLabel className="text-sm font-medium">
                      Journal no
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-10 w-[197px]"
                        placeholder="Enter no"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Journal Entries Table */}
            <div className="w-full max-w-[75vw] overflow-auto sm:max-w-[80vw] lg:max-w-[85vw]">
              <div className="mt-4 min-w-[1086px] space-y-4 overflow-auto">
                <div className="grid grid-cols-12 gap-2 text-sm font-medium text-[#434343]">
                  <div className="col-span-2">Account</div>
                  <div className="col-span-1">Debits(NGN)</div>
                  <div className="col-span-1">Credits(NGN)</div>
                  <div className="col-span-2">Description</div>
                  <div className="col-span-2">Name</div>
                  <div className="col-span-1">Branch</div>
                  <div className="col-span-2">Class</div>
                  <div className="col-span-1"></div>
                </div>

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-12 items-center gap-2.5"
                  >
                    {/* Account */}
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name={`entries.${index}.account`}
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={isLoadingAccounts}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full truncate">
                                  <SelectValue
                                    placeholder={
                                      isLoadingAccounts
                                        ? 'Loading accounts...'
                                        : 'Select account'
                                    }
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <div className="p-2">
                                  <Input
                                    placeholder="Search accounts..."
                                    value={accountSearchQuery}
                                    onChange={(e) =>
                                      setAccountSearchQuery(e.target.value)
                                    }
                                    className="h-8"
                                  />
                                </div>
                                {filteredAccountOptions.length > 0 ? (
                                  filteredAccountOptions.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div className="p-2 text-center text-sm text-gray-500">
                                    No accounts found
                                  </div>
                                )}
                                <div className="border-t">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="w-full text-sm"
                                    onClick={() => setIsAddAccountOpen(true)}
                                  >
                                    <Plus className="h-4 w-4" />
                                    Add new account
                                  </Button>
                                </div>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Debit */}
                    <div className="col-span-1">
                      <FormField
                        control={form.control}
                        name={`entries.${index}.debit`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="0.00"
                                className="h-10 w-full"
                                type="number"
                                formatNumber
                                step="0.01"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Credit */}
                    <div className="col-span-1">
                      <FormField
                        control={form.control}
                        name={`entries.${index}.credit`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="0.00"
                                className="h-10 w-full"
                                type="number"
                                formatNumber
                                step="0.01"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Description */}
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name={`entries.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter description"
                                className="h-10 w-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Name */}
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name={`entries.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={isLoadingNames}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue
                                    placeholder={
                                      isLoadingNames
                                        ? 'Loading...'
                                        : 'Select name'
                                    }
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <div className="p-2">
                                  <Input
                                    placeholder="Search customers/vendors..."
                                    value={nameSearchQuery}
                                    onChange={(e) =>
                                      setNameSearchQuery(e.target.value)
                                    }
                                    className="h-8"
                                  />
                                </div>
                                {filteredNameOptions.length > 0 ? (
                                  filteredNameOptions.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div className="p-2 text-center text-sm text-gray-500">
                                    No customers or vendors found
                                  </div>
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Branch */}
                    <div className="col-span-1">
                      <FormField
                        control={form.control}
                        name={`entries.${index}.branch`}
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full truncate">
                                  <SelectValue placeholder="Select branch" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {branchOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Class */}
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name={`entries.${index}.class`}
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="col-span-2 w-full">
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {classOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Delete */}
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLine(index)}
                        className="h-8 w-8"
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Totals Row */}
                <div className="grid grid-cols-12 gap-2 pt-2">
                  <div className="col-span-2 text-sm font-medium">
                    Total NGN
                  </div>
                  <div className="col-span-1 text-sm font-medium">
                    NGN{totalDebit.toFixed(2)}
                  </div>
                  <div className="col-span-1 text-sm font-medium">
                    NGN{totalCredit.toFixed(2)}
                  </div>
                  <div className="col-span-7"></div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={addLine}
                      className="mr-4 text-sm"
                    >
                      Add Line
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Memo */}
            <FormField
              control={form.control}
              name="memo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Memo</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter memo details..."
                      className="min-h-[100px] w-full max-w-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Attachments */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Attachments</Label>
              <div
                className="border-muted-foreground bg-muted hover:bg-muted/80 w-full max-w-xl cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors"
                onDrop={handleFileDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById('file-upload').click()}
              >
                <UploadIcon size={24} className="mx-auto mb-4" />
                <p className="mb-2 text-sm text-gray-600">
                  Click or drag file to this area to upload
                </p>
                <p className="text-xs text-gray-500">
                  Support for a single or bulk upload
                </p>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.xls,.xlsx,.csv,.txt"
                />
              </div>

              {/* Display uploaded files */}
              {attachments.length > 0 && (
                <div className="w-full max-w-xl space-y-2">
                  {attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="bg-background flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-muted flex h-8 w-8 items-center justify-center rounded">
                          <Upload size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-foreground truncate text-sm font-medium">
                            {attachment.name}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {formatFileSize(attachment.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAttachment(attachment.id)}
                        className="text-muted-foreground h-8 w-8"
                      >
                        <Trash2Icon size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Make Recurring */}
            <FormField
              control={form.control}
              name="makeRecurring"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm">Make recurring</FormLabel>
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4 md:justify-end">
              <Button
                type="button"
                variant="outline"
                className="h-10 w-[127px] text-sm"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              {/* <Button
                type="button"
                variant="outline"
                className="h-10 w-[127px] text-sm"
                onClick={handleClearAll}
              >
                Clear all
              </Button> */}
              <Button
                type="submit"
                className="h-10 w-44 text-sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
      <AddAccountForm
        isOpen={isAddAccountOpen}
        onClose={() => setIsAddAccountOpen(false)}
        showSuccessModal={handleAccountAdded}
      />
    </Dialog>
  );
}
