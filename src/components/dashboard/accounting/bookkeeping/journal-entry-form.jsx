import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
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
import { CalendarIcon, Trash2Icon, Upload, UploadIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DialogDescription } from '@radix-ui/react-dialog';
import { Switch } from '@/components/ui/switch';

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
        {
          account: '',
          debit: '',
          credit: '',
          description: '',
          name: '',
          branch: '',
          class: '',
        },
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

  const accountOptions = [
    { value: 'cash', label: 'Cash' },
    { value: 'accounts-receivable', label: 'Accounts Receivable' },
    { value: 'inventory', label: 'Inventory' },
    { value: 'accounts-payable', label: 'Accounts Payable' },
    { value: 'revenue', label: 'Revenue' },
    { value: 'expenses', label: 'Expenses' },
  ];

  const nameOptions = [
    { value: 'customer-1', label: 'Customer 1' },
    { value: 'vendor-1', label: 'Vendor 1' },
    { value: 'employee-1', label: 'Employee 1' },
  ];

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

  const handleSubmit = (data) => {
    const journalData = {
      ...data,
      attachments,
      totalDebit,
      totalCredit,
    };
    console.log('Saving journal entry:', journalData);
    // Add save logic here
    onClose();
    form.reset();
    onSuccess();
  };

  const handleClearAll = () => {
    setAttachments([]);
    form.reset({
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
    });
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
                            >
                              <FormControl>
                                <SelectTrigger className="w-full truncate">
                                  <SelectValue placeholder="Select account" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {accountOptions.map((option) => (
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
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select name" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {nameOptions.map((option) => (
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
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-10 w-[127px] text-sm"
                onClick={handleClearAll}
              >
                Clear all
              </Button>
              <Button type="submit" className="h-10 w-44 text-sm">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
