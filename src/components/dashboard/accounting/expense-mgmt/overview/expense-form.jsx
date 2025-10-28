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
        category: z.string().min(1, 'Category is required'),
        amount: z.string().min(1, 'Amount is required'),
        description: z.string().optional(),
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
  onSave,
  onSaveAndClose,
  onSuccess,
}) {
  // File upload state and refs
  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const attachmentFileInputRef = useRef(null);
  const [countries, setCountries] = useState([]);

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
          category: '',
          amount: '',
          description: '',
          clientProject: '',
          class: '',
        },
      ],
    },
  });

  const { handleSubmit, reset, control, watch } = form;
  const categories = watch('categories');

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
        category: '',
        amount: '',
        description: '',
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

  const onFormSubmit = (data) => {
    const formData = {
      ...data,
      attachments: attachmentFiles,
      total: calculateTotal(),
    };

    console.log('Expense data:', formData);

    if (onSubmit) {
      onSubmit(formData);
    }

    if (onSuccess) {
      onSuccess();
    }
  };

  const handleSave = () => {
    handleSubmit((data) => {
      const formData = {
        ...data,
        attachments: attachmentFiles,
        total: calculateTotal(),
      };
      onSave?.(formData);
    })();
  };

  const handleSaveAndClose = () => {
    handleSubmit((data) => {
      const formData = {
        ...data,
        attachments: attachmentFiles,
        total: calculateTotal(),
      };
      onSaveAndClose?.(formData);
      reset();
      setAttachmentFiles([]);
      onOpenChange?.(false);
    })();
    if (onSuccess) {
      onSuccess();
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
              <DialogTitle className="text-xl">Record Expense</DialogTitle>
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
                  <FormItem>
                    <FormLabel>Payee</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 w-full">
                          <SelectValue placeholder="Who did you pay?" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="supplier1">Office Depot</SelectItem>
                        <SelectItem value="supplier2">
                          Tech Solutions Ltd
                        </SelectItem>
                        <SelectItem value="supplier3">
                          Marketing Agency
                        </SelectItem>
                        <SelectItem value="supplier4">
                          Utilities Company
                        </SelectItem>
                        <SelectItem value="supplier5">
                          Transportation Co
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
                  <FormItem>
                    <FormLabel>Payment account</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 w-full">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="account1">
                          10035 GT Business
                        </SelectItem>
                        <SelectItem value="account2">
                          10036 Petty Cash
                        </SelectItem>
                        <SelectItem value="account3">
                          10037 Credit Card
                        </SelectItem>
                        <SelectItem value="account4">
                          10038 Bank Account
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
                      <PopoverContent className="w-auto p-0" align="start">
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
                      <PopoverContent align="start" className="w-74 p-0">
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

              {/* Category Table Header */}
              <div className="grid grid-cols-12 gap-4 rounded-lg p-4 text-sm font-semibold text-[#434343]">
                <div className="col-span-2">Category</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-3">Description</div>
                <div className="col-span-2">Client/Project</div>
                <div className="col-span-2">Class</div>
                <div className="col-span-1"></div>
              </div>

              {/* Category Rows */}
              <div className="space-y-2">
                {categories.map((_, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 items-start gap-4"
                  >
                    {/* Category */}
                    <div className="col-span-2">
                      <FormField
                        control={control}
                        name={`categories.${index}.category`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Enter category"
                                {...field}
                                className="h-10"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Amount */}
                    <div className="col-span-2">
                      <FormField
                        control={control}
                        name={`categories.${index}.amount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
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

                    {/* Description */}
                    <div className="col-span-3">
                      <FormField
                        control={control}
                        name={`categories.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Enter description"
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
                    <div className="col-span-2">
                      <FormField
                        control={control}
                        name={`categories.${index}.clientProject`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Enter name"
                                {...field}
                                className="h-10"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Class */}
                    <div className="col-span-2">
                      <FormField
                        control={control}
                        name={`categories.${index}.class`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Enter class"
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
                    <div className="col-span-1 flex justify-center">
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
                    ${calculateTotal().toFixed(2)}
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
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleSave}
                className="h-10 min-w-[130px] text-sm"
              >
                Save
              </Button>
              <Button
                type="button"
                onClick={handleSaveAndClose}
                className="h-10 min-w-[195px] text-sm"
              >
                Save and Close
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
