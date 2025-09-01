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
  NotepadTextIcon,
  PlusIcon,
  SettingsIcon,
  TrashIcon,
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

const formSchema = z.object({
  invoice_number: z.string().min(1, { message: 'Invoice number is required' }),
  customer_name: z.string().min(1, { message: 'Customer name is required' }),
  currency: z.string().min(1, { message: 'Currency is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  c_o: z.string().optional(),
  invoice_date: z.string().min(1, { message: 'Invoice date is required' }),
  term_of_payment: z
    .string()
    .min(1, { message: 'Term of payment is required' }),
  due_date: z.string().min(1, { message: 'Due date is required' }),
  products: z
    .array(
      z.object({
        name: z.string().min(1, { message: 'Product name is required' }),
        description: z.string().optional(),
        unit_price: z
          .number()
          .min(0, { message: 'Unit price must be positive' }),
        quantity: z.number().min(1, { message: 'Quantity must be at least 1' }),
        total_price: z
          .number()
          .min(0, { message: 'Total price must be positive' }),
      })
    )
    .min(1, { message: 'At least one product is required' }),
  account_name: z.string().min(1, { message: 'Account name is required' }),
  account_number: z.string().min(1, { message: 'Account number is required' }),
  bank_name: z.string().min(1, { message: 'Bank name is required' }),
  tax_identification_no: z
    .string()
    .min(1, { message: 'Tax identification number is required' }),
  sort_code: z.string().min(1, { message: 'Sort code is required' }),
  discount: z.number().min(0).max(100).optional(),
  vat: z.number().min(0).max(100).optional(),
  delivery_fee: z.number().min(0).optional(),
  terms: z.string().optional(),
  internal_notes: z.string().optional(),
  paid_with_cash: z.boolean().default(false),
  display_bank_details: z.boolean().default(false),
  invoice_paid: z.boolean().default(false),
  apply_signature: z.boolean().default(false),
});

const STORAGE_KEY = 'create_invoice_draft';

export default function CreateInvoice() {
  const [isPreview, setIsPreview] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoice_number: 'INV-1001',
      customer_name: '',
      currency: '',
      category: '',
      c_o: '',
      invoice_date: '',
      term_of_payment: '2 days',
      due_date: '',
      products: [
        {
          name: '',
          description: '',
          unit_price: 0,
          quantity: 1,
          total_price: 0,
        },
      ],
      account_name: 'James John',
      account_number: '254675987',
      bank_name: 'James Bank',
      tax_identification_no: '3545',
      sort_code: '3545',
      discount: 0,
      vat: 7.5,
      delivery_fee: 0,
      terms: '',
      internal_notes: '',
      paid_with_cash: false,
      display_bank_details: false,
      invoice_paid: false,
      apply_signature: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'products',
  });

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        form.reset(parsedData);
      } catch (error) {
        console.error('Error loading saved invoice data:', error);
      }
    }
  }, [form]);

  // Save to localStorage whenever form data changes
  useEffect(() => {
    const subscription = form.watch((formData) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Calculate product total when unit price or quantity changes
  const watchProducts = form.watch('products');
  useEffect(() => {
    watchProducts.forEach((product, index) => {
      const total = (product.unit_price || 0) * (product.quantity || 1);
      if (product.total_price !== total) {
        form.setValue(`products.${index}.total_price`, total);
      }
    });
  }, [watchProducts, form]);

  const calculateSubtotal = () => {
    return watchProducts.reduce(
      (sum, product) => sum + (product.total_price || 0),
      0
    );
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = form.watch('discount') || 0;
    const vat = form.watch('vat') || 0;
    const deliveryFee = form.watch('delivery_fee') || 0;

    const discountAmount = (subtotal * discount) / 100;
    const afterDiscount = subtotal - discountAmount;
    const vatAmount = (afterDiscount * vat) / 100;

    return afterDiscount + vatAmount + deliveryFee;
  };

  const addProduct = () => {
    append({
      name: '',
      description: '',
      unit_price: 0,
      quantity: 1,
      total_price: 0,
    });
  };

  const addNewBank = () => {
    // Functionality to add new bank
    console.log('Add new bank');
  };

  const addPaymentGateway = () => {
    // Functionality to add payment gateway
    console.log('Add payment gateway');
  };

  const onSubmit = (data) => {
    console.log('Invoice data:', data);
    // Clear localStorage after successful submission
    localStorage.removeItem(STORAGE_KEY);
    // Handle form submission
  };

  const handlePreview = () => {
    setIsPreview(true);
  };

  const handleSend = () => {
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="mx-auto max-w-7xl rounded-2xl bg-white p-6">
      <div className="flex items-center justify-end gap-4">
        <Button variant="outline" className={'h-11'}>
          <NotepadTextIcon />
          Template
        </Button>
        <Button variant="outline" className={'h-11'}>
          <SettingsIcon />
          Settings
        </Button>
      </div>
      {/* Header */}
      <div className="mt-4 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold">New Invoice</h1>
            <p className="text-gray-600">{form.watch('invoice_number')}</p>
          </div>
        </div>
      </div>

      {/* Company Info */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">4140 Parker Rd, Allentown,</p>
        <p className="text-sm text-gray-600">New Mexico 31134</p>
        <p className="text-sm text-gray-600">stridedev@dole.com</p>
        <p className="text-sm text-gray-600">(308) 555-0121</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Customer and Basic Info */}
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-6 md:flex-row">
              <div className="flex w-full max-w-xs items-end gap-2">
                <FormField
                  control={form.control}
                  name="customer_name"
                  render={({ field }) => (
                    <FormItem className={'w-full'}>
                      <FormLabel>Customer Name</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={'w-full'}>
                            <SelectValue placeholder="Select customer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="customer1">Customer 1</SelectItem>
                          <SelectItem value="customer2">Customer 2</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" className={'h-10 w-8'}>
                  <PlusIcon />
                </Button>
              </div>

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem className={'w-full max-w-xs'}>
                    <FormLabel>Currency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className={'w-full'}>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="NGN">
                          NGN - Nigerian Naira
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col justify-between gap-6 md:flex-row">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className={'w-full max-w-xs'}>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className={'w-full'}>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="services">Services</SelectItem>
                        <SelectItem value="products">Products</SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="c_o"
                render={({ field }) => (
                  <FormItem className={'w-full max-w-xs'}>
                    <FormLabel>C/O (optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        className={'w-full'}
                        placeholder="Additional notes..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-12 flex flex-wrap justify-between gap-6">
              <FormField
                control={form.control}
                name="invoice_date"
                render={({ field }) => (
                  <FormItem className="flex w-full max-w-xs flex-col">
                    <FormLabel>Invoice Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'h-10 w-full max-w-xs pl-3 text-left text-sm font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
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
                          // disabled={(date) =>
                          //   date > new Date() || date < new Date("1900-01-01")
                          // }
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="term_of_payment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Term of payment</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className={'w-48'}>
                          <SelectValue placeholder="Select term" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1 day">1 day</SelectItem>
                        <SelectItem value="2 days">2 days</SelectItem>
                        <SelectItem value="7 days">7 days</SelectItem>
                        <SelectItem value="14 days">14 days</SelectItem>
                        <SelectItem value="30 days">30 days</SelectItem>
                        <SelectItem value="60 days">60 days</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem className="flex w-full max-w-xs flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'h-10 w-full max-w-xs pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
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
                          // disabled={(date) =>
                          //   date > new Date() || date < new Date("1900-01-01")
                          // }
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Products Section */}
          <div className="mt-4 space-y-4 border-t">
            <h3 className="pt-6 text-xl font-semibold">Products</h3>

            {/* Products Header */}
            <div className="grid grid-cols-12 gap-4 text-sm font-medium tracking-wide text-gray-700 uppercase">
              <div className="col-span-3">Product / Item Name</div>
              <div className="col-span-2">Unit Price</div>
              <div className="col-span-2">QTY</div>
              <div className="col-span-2">Total Price</div>
              <div className="col-span-2"></div>
              <div className="col-span-1"></div>
            </div>

            {/* Product Rows */}
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-2">
                <div className="grid grid-cols-12 items-start gap-4">
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name={`products.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              className={'h-10'}
                              placeholder="Enter product / item name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`products.${index}.unit_price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              className={'h-10'}
                              placeholder="Enter price"
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
                  </div>

                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`products.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              className={'h-10'}
                              placeholder="QTY"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 1)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`products.${index}.total_price`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="TOTAL PRICE"
                              className={'h-10'}
                              value={field.value || 0}
                              readOnly
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-2"></div>

                  <div className="col-span-1">
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="h-8 w-8 p-0"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name={`products.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Enter Description"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="ghost"
              onClick={addProduct}
              className="mt-2"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>

          {/* Bank Details */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Bank Details</h3>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={addNewBank}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add New bank
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={addPaymentGateway}
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add payment Gateway
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="account_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Name</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly className="bg-gray-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="account_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly className="bg-gray-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bank_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly className="bg-gray-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tax_identification_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Identification No</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly className="bg-gray-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sort_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sort Code</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly className="bg-gray-50" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Totals Section */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Terms</h3>
              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <textarea
                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[100px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Terms and conditions..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h3 className="text-lg font-semibold">Internal Notes</h3>
              <FormField
                control={form.control}
                name="internal_notes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <textarea
                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[100px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Internal notes..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Sub total</span>
                  <span>{calculateSubtotal().toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Discount</span>
                  <div className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name="discount"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter price"
                              className="w-24 text-right"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <span>%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span>Vax (7.5%)</span>
                  <div className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name="vat"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(parseFloat(value))
                              }
                              defaultValue={field.value?.toString()}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">0%</SelectItem>
                                <SelectItem value="5">5%</SelectItem>
                                <SelectItem value="7.5">7.5%</SelectItem>
                                <SelectItem value="10">10%</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span>Delivery fee</span>
                  <FormField
                    control={form.control}
                    name="delivery_fee"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter price"
                            className="w-24 text-right"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="paid_with_cash"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Paid with cash
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="display_bank_details"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Display my bank details
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="invoice_paid"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        This invoice has been{' '}
                        <span className="font-medium text-blue-600">paid</span>
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="apply_signature"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Apply signature
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <Button type="button" variant="outline" onClick={handlePreview}>
              Preview
            </Button>
            <Button type="button" onClick={handleSend}>
              Send
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
