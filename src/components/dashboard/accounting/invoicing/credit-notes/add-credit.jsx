import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  CalendarIcon,
  PlusIcon,
  TrashIcon,
  UploadIcon,
  XIcon,
  FileIcon,
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import CustomerService from '@/api/customer';
import CreditNoteService from '@/api/creditNote';
import { useUserStore } from '@/stores/user-store';
import { uploadToCloudinary } from '@/lib/cloudinary';
import toast from 'react-hot-toast';

const formSchema = z.object({
  customer: z.string().min(1, { message: 'Customer is required' }),
  credit_memo_date: z.date({ required_error: 'Credit memo date is required' }),
  send_later: z.boolean().default(false),
  billing_address: z
    .string()
    .min(1, { message: 'Billing address is required' }),
  email_address: z.string().email({ message: 'Valid email is required' }),
  credit_memo_no: z
    .string()
    .min(1, { message: 'Credit memo number is required' }),
  line_items: z
    .array(
      z.object({
        service_date: z.date().optional(),
        service: z.string().min(1, { message: 'Service is required' }),
        description: z.string().optional(),
        amount: z.number().min(0, { message: 'Amount must be positive' }),
        qty: z.number().min(1, { message: 'Quantity must be at least 1' }),
      })
    )
    .min(1, { message: 'At least one line item is required' }),
  vat: z.number().min(0).max(100).optional(),
  message_credit_memo: z.string().optional(),
  message_statement: z.string().optional(),
  attachments: z.array(z.any()).optional(),
});

const STORAGE_KEY = 'create_credit_note_draft';

export default function AddCreditNote({ open, onOpenChange }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { businessData } = useUserStore();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer: '',
      credit_memo_date: new Date(),
      send_later: false,
      billing_address: '',
      email_address: '',
      credit_memo_no: '1012',
      line_items: [
        {
          service_date: undefined,
          service: '',
          description: '',
          amount: 0,
          qty: 1,
        },
        {
          service_date: undefined,
          service: '',
          description: '',
          amount: 0,
          qty: 1,
        },
      ],
      vat: 7.5,
      message_credit_memo: '',
      message_statement: '',
      attachments: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'line_items',
  });

  const watchLineItems = form.watch('line_items');

  // Fetch customers on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoadingCustomers(true);
        const response = await CustomerService.fetch();
        setCustomers(response.data.data || []);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setIsLoadingCustomers(false);
      }
    };

    if (open && businessData?._id) {
      fetchCustomers();
    }
  }, [open, businessData?._id]);

  const calculateSubtotal = () => {
    return watchLineItems.reduce((sum, item) => {
      const amount = Number(item.amount);
      const qty = Number(item.qty);
      return sum + amount * qty;
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const vat = form.watch('vat');
    const vatAmount = (subtotal * vat) / 100;
    return subtotal + vatAmount;
  };

  const addLineItem = () => {
    append({
      service_date: undefined,
      service: '',
      description: '',
      amount: 0,
      qty: 1,
    });
  };

  const clearItems = () => {
    // Keep at least one item
    // const itemsToKeep = fields.slice(0, 1);
    form.setValue('line_items', [
      {
        service_date: undefined,
        service: '',
        description: '',
        amount: 0,
        qty: 1,
      },
    ]);
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Transform form data to match backend API structure
      const payload = {
        customerId: data.customer,
        invoiceId: '', // Add this if you have invoice selection
        memoDate: data.credit_memo_date.toISOString(),
        sendLater: data.send_later,
        billingAddress: data.billing_address,
        email: data.email_address,
        memoNumber: data.credit_memo_no,
        lineItems: data.line_items.map((item) => ({
          serviceDate: item.service_date?.toISOString() || null,
          service: item.service,
          description: item.description || '',
          amount: item.amount,
          qty: item.qty,
        })),
        messageOnMemo: data.message_credit_memo || '',
        messageOnStatement: data.message_statement || '',
        attachments: data.attachments || [],
      };

      const response = await CreditNoteService.create({ data: payload });

      console.log('Credit note created successfully:', response.data);
      toast.success('Credit note created successfully!');

      // Reset form and close modal
      form.reset();
      setUploadedFiles([]);
      onOpenChange?.(false);
    } catch (error) {
      console.error('Error creating credit note:', error);
      toast.error(
        error.response?.data?.message ||
          'Failed to create credit note. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveDraft = () => {
    const formData = form.getValues();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    console.log('Draft saved');
    onOpenChange?.(false);
  };

  const saveAndSend = async () => {
    // Validate and submit the form
    await form.handleSubmit(onSubmit)();
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsUploadingFiles(true);
    const loadingToast = toast.loading('Uploading files to Cloudinary...');

    try {
      // Upload all files to Cloudinary
      const uploadPromises = files.map(async (file) => {
        const result = await uploadToCloudinary(file, {
          folder: 'credit-notes/attachments',
          tags: ['credit-note', 'attachment'],
        });

        return {
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: result.url,
        };
      });

      const uploadedResults = await Promise.all(uploadPromises);

      // Update state with uploaded files (containing URLs)
      setUploadedFiles((prev) => [...prev, ...uploadedResults]);

      // Store only URLs in form data
      const allUrls = [
        ...uploadedFiles.map((f) => f.url),
        ...uploadedResults.map((f) => f.url),
      ];
      form.setValue('attachments', allUrls);

      toast.dismiss(loadingToast);
      toast.success(`${files.length} file(s) uploaded successfully!`);
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.dismiss(loadingToast);
      toast.error('Failed to upload files. Please try again.');
    } finally {
      setIsUploadingFiles(false);
    }
  };

  const handleFileDrop = async (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files || []);
    if (files.length === 0) return;

    setIsUploadingFiles(true);
    const loadingToast = toast.loading('Uploading files to Cloudinary...');

    try {
      // Upload all files to Cloudinary
      const uploadPromises = files.map(async (file) => {
        const result = await uploadToCloudinary(file, {
          folder: 'credit-notes/attachments',
          tags: ['credit-note', 'attachment'],
        });

        return {
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: result.url,
        };
      });

      const uploadedResults = await Promise.all(uploadPromises);

      // Update state with uploaded files (containing URLs)
      setUploadedFiles((prev) => [...prev, ...uploadedResults]);

      // Store only URLs in form data
      const allUrls = [
        ...uploadedFiles.map((f) => f.url),
        ...uploadedResults.map((f) => f.url),
      ];
      form.setValue('attachments', allUrls);

      toast.dismiss(loadingToast);
      toast.success(`${files.length} file(s) uploaded successfully!`);
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.dismiss(loadingToast);
      toast.error('Failed to upload files. Please try again.');
    } finally {
      setIsUploadingFiles(false);
    }
  };

  const removeFile = (fileId) => {
    const updatedFiles = uploadedFiles.filter((file) => file.id !== fileId);
    setUploadedFiles(updatedFiles);
    // Update form with only URLs
    const urls = updatedFiles.map((f) => f.url);
    form.setValue('attachments', urls);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-full max-w-5xl overflow-y-auto p-8 sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Create Credit Notes</DialogTitle>
          <p className="text-muted-foreground text-sm">
            Create a new Create Credit Notes
          </p>
        </DialogHeader>

        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Customer and Credit Memo Details */}
              <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="customer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoadingCustomers}
                      >
                        <FormControl>
                          <SelectTrigger className={'w-full'}>
                            <SelectValue
                              placeholder={
                                isLoadingCustomers
                                  ? 'Loading customers...'
                                  : 'Select customer'
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {customers.length === 0 ? (
                            <SelectItem value="no-customers" disabled>
                              No customers found
                            </SelectItem>
                          ) : (
                            customers.map((customer) => (
                              <SelectItem
                                key={customer._id}
                                value={customer._id}
                              >
                                {customer.displayName ||
                                  customer.firstName + ' ' + customer.lastName}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2.5">
                  <FormField
                    control={form.control}
                    name="credit_memo_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Credit Memo Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  'h-10 w-full pl-3 text-left text-sm font-normal',
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
                            className="w-full min-w-80 p-0"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              // disabled={(date) =>
                              //   date > new Date() || date < new Date('1900-01-01')
                              // }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Send Later Checkbox */}
                  <FormField
                    control={form.control}
                    name="send_later"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div>
                          <FormLabel>Send Later</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Billing Address and Email */}
              <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="billing_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Billing Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter billing address"
                          className="min-h-[126px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            className={'h-10'}
                            placeholder="Enter email address"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="credit_memo_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Credit Memo no</FormLabel>
                        <FormControl>
                          <Input
                            className={'h-10'}
                            placeholder="1012"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-6 border-t pt-4">
                <div className="">
                  <h3 className="text-lg font-semibold">Line items</h3>
                </div>

                <div className="space-y-6">
                  {fields.map((field, index) => (
                    <div key={field.id} className="space-y-6">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                        <FormField
                          control={form.control}
                          name={`line_items.${index}.service_date`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Service Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        'h-10 w-full pl-3 text-left text-sm font-normal',
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
                                  className="w-auto p-0"
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
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`line_items.${index}.service`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Service</FormLabel>
                              <FormControl>
                                <Input
                                  className={'h-10'}
                                  placeholder="Enter service"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`line_items.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Input
                                  className={'h-10'}
                                  placeholder="Enter description"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`line_items.${index}.amount`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Amount</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  placeholder="0"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex items-center gap-2">
                          <FormField
                            control={form.control}
                            name={`line_items.${index}.qty`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Qty</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min="1"
                                    placeholder="1"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            disabled={fields.length === 1}
                            className="mt-6"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addLineItem}
                  className="text-sm"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add items
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearItems}
                  className="text-sm"
                >
                  Clear items
                </Button>
              </div>

              {/* Totals Section */}
              <div className="flex justify-end">
                <div className="w-full max-w-xs space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>VAT</span>
                      <FormField
                        control={form.control}
                        name="vat"
                        render={({ field }) => (
                          <Select
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                            defaultValue={field.value?.toString()}
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">0%</SelectItem>
                              <SelectItem value="5">5%</SelectItem>
                              <SelectItem value="7.5">7.5%</SelectItem>
                              <SelectItem value="10">10%</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <span>
                      $
                      {(
                        (calculateSubtotal() * (form.watch('vat') || 0)) /
                        100
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total Credit</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-4 border-t pt-6">
                <FormField
                  control={form.control}
                  name="message_credit_memo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message displayed on credit memo</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder=""
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                      <div className="text-muted-foreground text-right text-xs">
                        {field.value?.length || 0}/1000
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message_statement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message displayed on statement</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder=""
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                      <div className="text-muted-foreground text-right text-xs">
                        {field.value?.length || 0}/1000
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Attachments */}
              <div className="space-y-4">
                <FormLabel>Attachments</FormLabel>
                <div
                  className={cn(
                    'border-muted-foreground/25 hover:border-muted-foreground/50 rounded-lg border-2 border-dashed p-6 transition-colors',
                    isUploadingFiles && 'pointer-events-none opacity-50'
                  )}
                  onDrop={handleFileDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={(e) => e.preventDefault()}
                >
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                    disabled={isUploadingFiles}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <UploadIcon className="text-primary h-8 w-8" />
                      <p className="text-muted-foreground text-sm">
                        {isUploadingFiles
                          ? 'Uploading...'
                          : 'Click or drag file to this area to upload'}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Support for a single or bulk upload.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Display uploaded files */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Uploaded Files:</p>
                    <div className="space-y-2">
                      {uploadedFiles.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between rounded-lg border p-3"
                        >
                          <div className="flex items-center space-x-3">
                            <FileIcon className="text-muted-foreground h-5 w-5" />
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-muted-foreground text-xs">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            className=""
                          >
                            <XIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-end gap-6 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  className={'h-10 w-full max-w-44 text-sm'}
                  onClick={() => onOpenChange?.(false)}
                  disabled={isSubmitting || isUploadingFiles}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={'h-10 w-full max-w-44 text-sm'}
                  onClick={saveDraft}
                  disabled={isSubmitting || isUploadingFiles}
                >
                  Save Draft
                </Button>
                <Button
                  type="button"
                  onClick={saveAndSend}
                  className={'h-10 w-full max-w-44 text-sm'}
                  disabled={isSubmitting || isUploadingFiles}
                >
                  {isSubmitting ? 'Saving...' : 'Save and send'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
