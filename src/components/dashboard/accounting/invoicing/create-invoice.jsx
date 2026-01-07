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
  Check,
  ChevronsUpDown,
  EyeIcon,
  NotepadTextIcon,
  PencilIcon,
  PlusIcon,
  SettingsIcon,
  TrashIcon,
  XIcon,
} from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import PreviewInvoice from './preview-invoice';
import AddCustomerModal from './customers/add-customer';
import AddBankModal from './add-bank';
import AddPaymentGatewayModal from './add-payment-gateway';
import AddAccountForm from '@/components/dashboard/accounting/bookkeeping/add-account';
import InvoiceTemplateSettings from './invoice-template';
import SuccessModal from '../success-modal';
import CustomerService from '@/api/customer';
import BusinessService from '@/api/business';
import toast from 'react-hot-toast';
import InvoiceService from '@/api/invoice';
import AccountService from '@/api/accounts';
import ServiceService from '@/api/service';
import { useUserStore } from '@/stores/user-store';
import { Switch } from '@/components/ui/switch';
import { useNavigate, useSearchParams } from 'react-router';

const formSchema = z.object({
  customerId: z.string().min(1, { message: 'Customer name is required' }),
  currency: z.string().min(1, { message: 'Currency is required' }),
  service: z.string().min(1, { message: 'Service is required' }),
  c_o: z.string().optional(),
  invoice_date: z
    .union([z.date(), z.string()])
    .transform((val) => {
      if (typeof val === 'string') {
        const date = new Date(val);
        return isNaN(date.getTime()) ? new Date() : date;
      }
      return val;
    })
    .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
      message: 'Invoice date is required',
    }),
  term_of_payment: z
    .string()
    .min(1, { message: 'Term of payment is required' }),
  due_date: z
    .union([z.date(), z.string()])
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      if (typeof val === 'string') {
        const date = new Date(val);
        return isNaN(date.getTime()) ? undefined : date;
      }
      return val;
    })
    .refine((val) => !val || (val instanceof Date && !isNaN(val.getTime())), {
      message: 'Due date must be valid',
    }),
  products: z
    .array(
      z.object({
        name: z.string().optional(),
        accountId: z.string().optional(),
        accountName: z.string().optional(),
        description: z.string().optional(),
        unit_price: z
          .number()
          .min(0, { message: 'Unit price must be positive' }),
        quantity: z.number().min(1, { message: 'Quantity must be at least 1' }),
        total_price: z
          .number()
          .min(0, { message: 'Total price must be positive' }),
        vat_applicable: z.boolean().default(false),
      })
    )
    .min(1, { message: 'At least one product is required' })
    .refine(
      (products) =>
        products.every((product) => product.name || product.accountId),
      {
        message: 'Product name or accountId is required',
      }
    ),
  discount: z.number().min(0).max(100).optional(),
  vat: z.number().min(0).max(100).optional(),
  delivery_fee: z.number().min(0).optional(),
  terms: z.string().optional(),
  internal_notes: z.string().optional(),
  display_bank_details: z.boolean().default(true),
  apply_signature: z.boolean().default(false),
});

// Extensive list of invoice categories
export default function CreateInvoice({ businessId, onBack, invoiceType }) {
  const [isPreview, setIsPreview] = useState(false);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isAddBankModalOpen, setIsAddBankModalOpen] = useState(false);
  const [isAddPaymentGatewayModalOpen, setIsAddPaymentGatewayModalOpen] =
    useState({ open: false, editIndex: null, initialData: null });
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [isAddingService, setIsAddingService] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [newServiceName, setNewServiceName] = useState('');
  const [isSubmittingService, setIsSubmittingService] = useState(false);
  const [showTemplateSettings, setShowTemplateSettings] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCustomVat, setIsCustomVat] = useState(false);
  const [createdInvoiceData, setCreatedInvoiceData] = useState(null);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [openCustomerCombobox, setOpenCustomerCombobox] = useState(false);
  const [openAccountCombobox, setOpenAccountCombobox] = useState({});
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [paymentGateways, setPaymentGateways] = useState([]);
  const { businessData, getBusinessData, data: userData } = useUserStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerId: '',
      currency: '',
      service: '',
      c_o: '',
      invoice_date: '',
      term_of_payment: '',
      due_date: '',
      products: [
        {
          ...(invoiceType === 'regular'
            ? { accountId: '', accountName: '' }
            : { name: '' }),
          description: '',
          unit_price: 0,
          quantity: 1,
          total_price: 0,
          vat_applicable: true,
        },
      ],
      discount: 0,
      vat: 0,
      delivery_fee: 0,
      terms: '',
      internal_notes: '',
      display_bank_details: true,
      apply_signature: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'products',
  });

  // Check if form is ready for submission
  const isFormValid = () => {
    const values = form.getValues();

    // Check if at least one product is added and valid
    const hasValidProducts =
      values.products &&
      values.products.length > 0 &&
      values.products.some((product) => {
        if (invoiceType === 'regular') {
          return !!product.accountId && product.unit_price > 0;
        } else {
          return !!product.name && product.unit_price > 0;
        }
      });

    return hasValidProducts;
  };

  // Fetch invoice number on mount
  useEffect(() => {
    const fetchInvoiceNumber = async () => {
      try {
        const response = await InvoiceService.getInvoiceNumber();
        const invoiceNo = response.data?.data || '';
        setInvoiceNumber(invoiceNo);
      } catch (error) {
        console.error('Error fetching invoice number:', error);
      }
    };

    fetchInvoiceNumber();
  }, []);

  // Fetch customers data
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await CustomerService.fetch({
          search: customerSearchQuery,
        });
        const customerData = response.data?.data?.customers || [];
        const extractedCustomers = customerData.map((item) => item.customer);
        setCustomers(extractedCustomers);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchCustomers();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [isAddCustomerModalOpen, businessId, customerSearchQuery]);

  // Fetch accounts for regular invoices
  useEffect(() => {
    const fetchAccounts = async () => {
      if (invoiceType !== 'regular') return;

      try {
        const response = await AccountService.fetch({ accountType: 'income' });
        const accountsData = response.data?.data?.accounts || [];
        setAccounts(accountsData);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchAccounts();
  }, [invoiceType, isAddAccountModalOpen]);

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await ServiceService.fetch({});
        const servicesData = response.data?.data?.services || [];
        setServices(servicesData);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, [isAddingService, editingService]);

  // Set customer from URL parameter if provided
  useEffect(() => {
    const customerIdFromUrl = searchParams.get('customerId');

    if (customerIdFromUrl && customers.length > 0) {
      // Check if this customer exists in the customers list
      const customerExists = customers.some(
        (customer) =>
          customer._id === customerIdFromUrl ||
          customer.id === customerIdFromUrl
      );

      if (customerExists) {
        // Only set if the current customerId is empty (to avoid overriding user selection)
        const currentCustomerId = form.getValues('customerId');
        if (!currentCustomerId || currentCustomerId === '') {
          form.setValue('customerId', customerIdFromUrl);
          console.log('Set customer from URL:', customerIdFromUrl);
        }
      }
    }
  }, [customers, searchParams, form]);

  // Calculate product total when unit price or quantity changes
  const watchProducts = form.watch('products');

  useEffect(() => {
    watchProducts.forEach((product, index) => {
      const unitPrice = Number(product.unit_price) || 0;
      const quantity = Number(product.quantity) || 1;
      const total = unitPrice * quantity;

      // Only update if the calculated total is different from the current total
      if (Number(product.total_price) !== total) {
        form.setValue(`products.${index}.total_price`, total, {
          shouldValidate: false,
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(
      watchProducts.map((p) => ({ u: p.unit_price, q: p.quantity }))
    ),
  ]);

  const calculateSubtotal = () => {
    return watchProducts.reduce((sum, product) => {
      const unitPrice = Number(product.unit_price) || 0;
      const quantity = Number(product.quantity) || 1;
      return sum + unitPrice * quantity;
    }, 0);
  };

  const calculateVatAmount = () => {
    const vat = form.watch('vat') || 0;
    const discount = form.watch('discount') || 0;

    // Calculate VAT only for products where vat_applicable is true
    const vatApplicableSubtotal = watchProducts.reduce((sum, product) => {
      if (product.vat_applicable) {
        const unitPrice = Number(product.unit_price) || 0;
        const quantity = Number(product.quantity) || 1;
        return sum + unitPrice * quantity;
      }
      return sum;
    }, 0);

    const vatApplicableAfterDiscount =
      vatApplicableSubtotal * (1 - discount / 100);
    return (vatApplicableAfterDiscount * vat) / 100;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = form.watch('discount') || 0;
    const vat = form.watch('vat') || 0;
    const deliveryFee = form.watch('delivery_fee') || 0;

    const discountAmount = (subtotal * discount) / 100;
    const afterDiscount = subtotal - discountAmount;

    // Calculate VAT only for products where vat_applicable is true
    const vatApplicableSubtotal = watchProducts.reduce((sum, product) => {
      if (product.vat_applicable) {
        const unitPrice = Number(product.unit_price) || 0;
        const quantity = Number(product.quantity) || 1;
        return sum + unitPrice * quantity;
      }
      return sum;
    }, 0);

    const vatApplicableAfterDiscount =
      vatApplicableSubtotal * (1 - discount / 100);
    const vatAmount = (vatApplicableAfterDiscount * vat) / 100;

    return afterDiscount + vatAmount + deliveryFee;
  };

  const addProduct = () => {
    append({
      ...(invoiceType === 'regular'
        ? { accountId: '', accountName: '' }
        : { name: '' }),
      description: '',
      unit_price: 0,
      quantity: 1,
      total_price: 0,
      vat_applicable: true,
    });
  };

  const handleAddService = async () => {
    if (!newServiceName.trim()) {
      toast.error('Service name is required');
      return;
    }

    setIsSubmittingService(true);
    try {
      await ServiceService.create({ name: newServiceName });
      toast.success('Service added successfully');
      setNewServiceName('');
      setIsAddingService(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add service');
    } finally {
      setIsSubmittingService(false);
    }
  };

  const handleEditService = async (id) => {
    if (!newServiceName.trim()) {
      toast.error('Service name is required');
      return;
    }

    setIsSubmittingService(true);
    try {
      await ServiceService.update({ id, name: newServiceName });
      toast.success('Service updated successfully');
      setNewServiceName('');
      setEditingService(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update service');
    } finally {
      setIsSubmittingService(false);
    }
  };

  const handleDeleteService = async (id) => {
    setIsSubmittingService(true);
    try {
      await ServiceService.delete({ id });
      toast.success('Service deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete service');
    } finally {
      setIsSubmittingService(false);
    }
  };

  const cancelServiceAction = () => {
    setIsAddingService(false);
    setEditingService(null);
    setNewServiceName('');
  };

  const addNewBank = () => {
    setIsAddBankModalOpen(true);
  };

  const handleTemplateBack = () => {
    setShowTemplateSettings(false);
  };

  const handleTemplateSave = async ({ selectedTemplate, selectedColor }) => {
    try {
      await BusinessService.patchSettings({
        id: businessId,
        data: {
          template: selectedTemplate,
          brandColor: selectedColor,
        },
      });
      toast.success('Template settings updated successfully');
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          'Failed to save template settings'
      );
    }
    setShowTemplateSettings(false);
  };

  const handleAddBank = async (newBankData) => {
    try {
      // Get current business settings
      const currentBankAccounts =
        businessData?.businessInvoiceSettings?.bankAccounts || [];

      // Add the new bank to existing banks
      const updatedBankAccounts = [...currentBankAccounts, newBankData];

      // Update business settings
      await BusinessService.patchSettings({
        id: businessId,
        data: {
          bankAccounts: updatedBankAccounts,
        },
      });

      toast.success('Bank account added successfully');

      await getBusinessData();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          'Failed to add bank account. Please try again.'
      );
    }
  };

  const addPaymentGateway = () => {
    setIsAddPaymentGatewayModalOpen({
      open: true,
      editIndex: null,
      initialData: null,
    });
  };

  const handleAddPaymentGateway = (newPaymentGatewayData) => {
    if (isAddPaymentGatewayModalOpen.editIndex !== null) {
      // Edit existing gateway
      setPaymentGateways((prev) =>
        prev.map((gateway, i) =>
          i === isAddPaymentGatewayModalOpen.editIndex
            ? newPaymentGatewayData
            : gateway
        )
      );
      toast.success('Payment gateway updated successfully');
    } else {
      // Add new gateway
      setPaymentGateways((prev) => [...prev, newPaymentGatewayData]);
      toast.success('Payment gateway added successfully');
    }
  };

  const handleRemovePaymentGateway = (index) => {
    setPaymentGateways((prev) => prev.filter((_, i) => i !== index));
    toast.success('Payment gateway removed');
  };

  const onSubmit = async (data) => {
    console.log('Form submitted with data:', data);
    try {
      setIsSubmitting(true);

      // Ensure each product has the correct total_price calculated
      const productsWithCalculatedTotals = data.products.map((product) => ({
        ...product,
        total_price:
          parseFloat(product.unit_price || 0) *
          parseFloat(product.quantity || 1),
      }));

      // Format data according to the new structure
      const formattedData = {
        accountId: businessData?.accountId,
        businessId: businessId,
        invoice: {
          type: invoiceType,
          customerId: data.customerId,
          currency: data.currency,
          serviceId: data.service,
          co: data.c_o || '',
          invoiceDate: data.invoice_date,
          termsOfPayment: data.term_of_payment,
          dueDate: data.due_date,
          invoiceNo: invoiceNumber,
        },
        products: {
          products: productsWithCalculatedTotals,
          banks: businessData?.businessInvoiceSettings?.bankAccounts || [],
          paymentGateways: paymentGateways,
          terms: data.terms || '',
          notes: data.internal_notes || '',
          displayBankDetails: data.display_bank_details,
          applySignature: data.apply_signature,
          subTotal: calculateSubtotal().toString(),
          discount: (data.discount || 0).toString(),
          vat: (data.vat || 0).toString(),
          deliveryFee: (data.delivery_fee || 0).toString(),
          total: calculateTotal().toString(),
        },
      };

      let res;
      // Create new invoice
      res = await InvoiceService.create({ data: formattedData });
      toast.success('Invoice created successfully');
      // Store the created invoice data for preview
      setCreatedInvoiceData(res.data?.data);

      form.reset();
      setIsSuccessModalOpen(true);
    } catch (err) {
      console.error('Error submitting form:', err);
      toast.error(err.response?.message || err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = async () => {
    setIsPreview(true);
  };

  // Transform created invoice data to match formData structure
  const getPreviewData = () => {
    if (createdInvoiceData) {
      console.log('Created invoice data for preview:', createdInvoiceData);

      // Check if data has invoice and product objects (create response format)
      // or if it's the direct invoice object with product nested (update response format)
      const invoice = createdInvoiceData.invoice || createdInvoiceData;
      const product = createdInvoiceData.product;

      // Extract customerId - could be an object (populated) or a string (ID only)
      const customerId =
        typeof invoice.customerId === 'object'
          ? invoice.customerId._id || invoice.customerId.id
          : invoice.customerId;

      return {
        customerId: customerId,
        currency: invoice.currency,
        service: invoice.service,
        c_o: invoice.co || '',
        invoice_date: new Date(invoice.invoiceDate),
        term_of_payment: invoice.termsOfPayment,
        due_date: invoice.dueDate ? new Date(invoice.dueDate) : undefined,
        invoice_number: invoice.invoiceNo,
        products: {
          products: product.products || [],
          banks: product.banks || [],
          paymentGateways: product.paymentGateways || [],
        },
        discount: parseFloat(product.discount || 0),
        vat: parseFloat(product.vat || 0),
        delivery_fee: parseFloat(product.deliveryFee || 0),
        terms: product.terms || '',
        internal_notes: product.notes || '',
        display_bank_details: product.displayBankDetails,
        apply_signature: product.applySignature,
        status: invoice.status,
        id: invoice._id || invoice.id,
      };
    }

    // Fallback to form data if no created invoice data
    const formValues = form.getValues();
    return {
      ...formValues,
      products: {
        products: formValues.products || [],
        banks: businessData?.businessInvoiceSettings?.bankAccounts || [],
        paymentGateways: paymentGateways || [],
      },
    };
  };

  const handleSave = async () => {
    console.log('Save button clicked');
    if (isSubmitting) {
      console.log('Already submitting, returning');
      return;
    }

    // Check form validity
    const formData = form.getValues();
    console.log('Current form data:', formData);

    // Trigger form validation and submission
    const isValid = await form.trigger();
    console.log('Form validation result:', isValid);

    if (isValid) {
      console.log('Form is valid, submitting...');
      form.handleSubmit(onSubmit)();
    } else {
      console.log('Form validation failed');
      const errors = form.formState.errors;
      console.log('Form errors:', errors);
      toast.error('Please fill in all required fields');
    }
  };

  if (isPreview) {
    const previewData = getPreviewData();

    return (
      <PreviewInvoice
        formData={previewData}
        calculateSubtotal={() => {
          if (createdInvoiceData) {
            return parseFloat(createdInvoiceData.product.subTotal);
          }
          return calculateSubtotal();
        }}
        onEdit={() => {
          setIsPreview(false);
          // Don't clear createdInvoiceData yet, in case user wants to preview again
        }}
        onBack={() => setIsPreview(false)}
        customers={customers}
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl rounded-2xl bg-white p-6">
      {showTemplateSettings ? (
        <InvoiceTemplateSettings
          onBack={handleTemplateBack}
          onSave={handleTemplateSave}
          initialTemplate={businessData?.businessInvoiceSettings?.template}
          initialColor={businessData?.businessInvoiceSettings?.brandColor}
        />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Button
              size={'sm'}
              variant={'outline'}
              onClick={() => {
                if (onBack) {
                  onBack();
                } else {
                  navigate(-1);
                }
              }}
            >
              Back
            </Button>
            <div className="flex items-center justify-end gap-4">
              <Button
                variant="outline"
                className={'h-11'}
                onClick={() => setShowTemplateSettings(true)}
              >
                <NotepadTextIcon />
                Template
              </Button>
              <Button
                variant="outline"
                className={'h-11'}
                onClick={() =>
                  navigate('/dashboard/accounting/invoicing/settings')
                }
              >
                <SettingsIcon />
                Settings
              </Button>
            </div>
          </div>
          {/* Header */}
          <div className="mt-4 mb-5">
            <h1 className="text-2xl font-semibold">
              {invoiceType === 'proforma' ? 'Proforma Invoice' : 'New Invoice'}
            </h1>
            <p className="mt-1 text-base font-medium">{invoiceNumber}</p>
          </div>

          {/* Company Info with Logo */}
          <div className="mb-6 flex flex-col items-start gap-4">
            {businessData?.businessInvoiceSettings?.logoUrl ? (
              <div className="flex h-24 items-center justify-center">
                <img
                  src={businessData.businessInvoiceSettings.logoUrl}
                  alt={businessData?.businessName || 'Company Logo'}
                  className="h-24 w-auto object-contain"
                />
              </div>
            ) : (
              <div className="text-sm font-bold">
                <p>{businessData?.businessName || 'Business Name'}</p>
              </div>
            )}
            <div className="text-sm font-medium">
              <p>{businessData?.businessLocation || 'Business Location'}</p>
              {userData?.account?.email && <p>{userData.account.email}</p>}
              {userData?.account?.phoneNumber && (
                <p>{userData.account.phoneNumber}</p>
              )}
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Customer and Basic Info */}
              <div className="space-y-6">
                <div className="flex flex-col justify-between gap-6 md:flex-row">
                  <div className="flex w-full max-w-xs items-end gap-2">
                    <FormField
                      control={form.control}
                      name="customerId"
                      render={({ field }) => (
                        <FormItem className="flex w-full flex-col">
                          <FormLabel>Customer Name</FormLabel>
                          <Popover
                            open={openCustomerCombobox}
                            onOpenChange={setOpenCustomerCombobox}
                          >
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    'h-10 w-full justify-between text-sm',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value
                                    ? customers.find(
                                        (customer) =>
                                          customer._id === field.value
                                      )?.displayName || 'Select customer'
                                    : 'Select customer'}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-(--radix-popover-trigger-width) p-0"
                              align="start"
                            >
                              <Command>
                                <CommandInput
                                  placeholder="Search customers..."
                                  value={customerSearchQuery}
                                  onValueChange={setCustomerSearchQuery}
                                />
                                <CommandList>
                                  <CommandEmpty>
                                    No customer found.
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {customers?.map((customer) => (
                                      <CommandItem
                                        value={customer.displayName}
                                        key={customer._id}
                                        onSelect={() => {
                                          form.setValue(
                                            'customerId',
                                            customer._id
                                          );
                                          setOpenCustomerCombobox(false);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            'mr-2 h-4 w-4',
                                            customer._id === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          )}
                                        />
                                        <div className="flex flex-col">
                                          <span className="font-medium">
                                            {customer.displayName}
                                          </span>
                                          <span className="text-muted-foreground text-xs">
                                            {customer.email}
                                          </span>
                                        </div>
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
                    <Button
                      type="button"
                      onClick={() => setIsAddCustomerModalOpen(true)}
                      className={'h-10 w-8 bg-[#254C00] hover:bg-[#254C00]/90'}
                    >
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
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className={'w-full'}>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="GBP">
                              GBP - British Pound
                            </SelectItem>
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
                    name="service"
                    render={({ field }) => (
                      <FormItem className={'w-full max-w-xs'}>
                        <FormLabel>Service</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className={'w-full'}>
                              <SelectValue placeholder="Select service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {!isAddingService && !editingService && (
                              <>
                                {services.map((service) => (
                                  <div
                                    key={service._id}
                                    className="flex items-center justify-between px-2 py-1.5 hover:bg-gray-100"
                                  >
                                    <SelectItem
                                      value={service._id}
                                      className="flex-1 border-0 p-0 focus:bg-inherit"
                                    >
                                      {service.name}
                                    </SelectItem>
                                    <div className="flex items-center gap-1">
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        disabled={isSubmittingService}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setEditingService(service);
                                          setNewServiceName(service.name);
                                        }}
                                      >
                                        <PencilIcon className="h-3 w-3 text-gray-600" />
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        disabled={isSubmittingService}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteService(service._id);
                                        }}
                                      >
                                        <TrashIcon className="h-3 w-3 text-red-600" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                                <div className="border-t">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full justify-start text-sm"
                                    onClick={() => {
                                      setIsAddingService(true);
                                      setNewServiceName('');
                                    }}
                                  >
                                    <PlusIcon className="mr-1 h-4 w-4" />
                                    Add Service
                                  </Button>
                                </div>
                              </>
                            )}

                            {(isAddingService || editingService) && (
                              <div className="space-y-2 p-2">
                                <Input
                                  placeholder="Enter service name"
                                  value={newServiceName}
                                  onChange={(e) =>
                                    setNewServiceName(e.target.value)
                                  }
                                  className="h-10"
                                  autoFocus
                                />
                                <div className="flex gap-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-10 flex-1"
                                    onClick={cancelServiceAction}
                                    disabled={isSubmittingService}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    className="h-10 flex-1"
                                    disabled={isSubmittingService}
                                    onClick={() => {
                                      if (editingService) {
                                        handleEditService(editingService._id);
                                      } else {
                                        handleAddService();
                                      }
                                    }}
                                  >
                                    {isSubmittingService
                                      ? editingService
                                        ? 'Updating...'
                                        : 'Adding...'
                                      : editingService
                                        ? 'Update'
                                        : 'Add'}
                                  </Button>
                                </div>
                              </div>
                            )}
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
                          <PopoverContent
                            className="w-(--radix-popover-trigger-width) p-0"
                            align="start"
                          >
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
                          value={field.value}
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
                          <PopoverContent
                            className="w-(--radix-popover-trigger-width) p-0"
                            align="start"
                          >
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

                {/* Products Header - Wraps on mobile */}
                <div className="mb-2 grid grid-cols-2 gap-4 text-xs font-semibold tracking-wide text-[#434343] uppercase md:grid-cols-10">
                  <div className="col-span-2 md:col-span-3">
                    Product / Item Name
                  </div>
                  <div className="col-span-1 md:col-span-2">Unit Price</div>
                  <div className="col-span-1 md:col-span-2">QTY</div>
                  <div className="col-span-2 md:col-span-2">Total Price</div>
                  <div className="col-span-2 md:col-span-1"></div>
                </div>

                {/* Product Rows */}
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="space-y-2 rounded-lg border p-4 md:border-0 md:p-0"
                  >
                    <div className="grid grid-cols-2 items-start gap-4 md:grid-cols-10">
                      <div className="col-span-2 md:col-span-3">
                        {invoiceType === 'regular' ? (
                          <FormField
                            control={form.control}
                            name={`products.${index}.accountId`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Popover
                                    open={openAccountCombobox[index] || false}
                                    onOpenChange={(open) =>
                                      setOpenAccountCombobox((prev) => ({
                                        ...prev,
                                        [index]: open,
                                      }))
                                    }
                                  >
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                          'h-10 w-full justify-between text-sm',
                                          !field.value &&
                                            'text-muted-foreground'
                                        )}
                                      >
                                        {field.value
                                          ? accounts?.find(
                                              (account) =>
                                                account?._id === field.value
                                            )?.accountName ||
                                            accounts?.find(
                                              (account) =>
                                                account?._id === field.value
                                            )?.accountCode ||
                                            'Select service'
                                          : 'Select service'}
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
                                          <CommandEmpty>
                                            No account found.
                                          </CommandEmpty>
                                          <CommandGroup>
                                            {accounts?.map((account) => (
                                              <CommandItem
                                                value={account?._id}
                                                key={account?._id}
                                                onSelect={() => {
                                                  form.setValue(
                                                    `products.${index}.accountId`,
                                                    account._id
                                                  );
                                                  // Store accountName for preview
                                                  form.setValue(
                                                    `products.${index}.accountName`,
                                                    account.accountName
                                                  );
                                                  setOpenAccountCombobox(
                                                    (prev) => ({
                                                      ...prev,
                                                      [index]: false,
                                                    })
                                                  );
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
                                          <div className="border-t p-2">
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              className="w-full justify-start text-sm"
                                              onClick={() => {
                                                setOpenAccountCombobox(
                                                  (prev) => ({
                                                    ...prev,
                                                    [index]: false,
                                                  })
                                                );
                                                setIsAddAccountModalOpen(true);
                                              }}
                                            >
                                              <PlusIcon className="mr-2 h-4 w-4" />
                                              Add Service
                                            </Button>
                                          </div>
                                        </CommandList>
                                      </Command>
                                    </PopoverContent>
                                  </Popover>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ) : (
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
                        )}
                      </div>

                      <div className="col-span-1 md:col-span-2">
                        <FormField
                          control={form.control}
                          name={`products.${index}.unit_price`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="number"
                                  formatNumber
                                  className={'h-10'}
                                  placeholder="Enter price"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseFloat(e.target.value || 0)
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-1 md:col-span-2">
                        <FormField
                          control={form.control}
                          name={`products.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  className={'h-10'}
                                  placeholder="QTY"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseInt(e.target.value || 0)
                                    )
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-2 md:col-span-2">
                        <FormField
                          control={form.control}
                          name={`products.${index}.total_price`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type={'number'}
                                  formatNumber
                                  placeholder="TOTAL PRICE"
                                  className={'h-10 bg-gray-50'}
                                  {...field}
                                  value={field.value || 0}
                                  readOnly
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="col-span-2 flex items-center justify-between gap-2 md:col-span-1 md:h-full md:justify-center">
                        <FormField
                          control={form.control}
                          name={`products.${index}.vat_applicable`}
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center gap-2 md:flex-col">
                                <label
                                  htmlFor={`vat-${index}`}
                                  className="text-xs md:text-center"
                                >
                                  VAT
                                </label>
                                <FormControl>
                                  <Switch
                                    size="sm"
                                    id={`vat-${index}`}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
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

                    <div className="mt-4 grid grid-cols-12 gap-4">
                      <div className="col-span-12 md:col-span-6">
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
                  size={'sm'}
                  className="mt-2 text-sm"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Product
                </Button>
              </div>

              {/* Bank Details */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div className="flex flex-col gap-2">
                    {businessData?.businessInvoiceSettings?.bankAccounts
                      ?.length > 0 ? (
                      (() => {
                        const activeBank =
                          businessData.businessInvoiceSettings.bankAccounts.find(
                            (bank) => bank.isActive
                          ) ||
                          businessData.businessInvoiceSettings.bankAccounts[0];

                        return (
                          <div className="mb-2 space-y-1 border-b pb-2 last:mb-0 last:border-b-0 last:pb-0">
                            {activeBank.accountName && (
                              <div className="flex flex-nowrap items-center gap-1.5 text-xs">
                                <p className="font-semibold">Account Name:</p>
                                <p>{activeBank.accountName}</p>
                              </div>
                            )}
                            {activeBank.accountNumber && (
                              <div className="flex flex-nowrap items-center gap-1.5 text-xs">
                                <p className="font-semibold">Account Number:</p>
                                <p>{activeBank.accountNumber}</p>
                              </div>
                            )}
                            {activeBank.bankName && (
                              <div className="flex flex-nowrap items-center gap-1.5 text-xs">
                                <p className="font-semibold">Bank Name:</p>
                                <p>{activeBank.bankName}</p>
                              </div>
                            )}
                            {activeBank.tin && (
                              <div className="flex flex-nowrap items-center gap-1.5 text-xs">
                                <p className="font-semibold">
                                  Tax identification No:
                                </p>
                                <p>{activeBank.tin}</p>
                              </div>
                            )}
                            {activeBank.sortCode && (
                              <div className="flex flex-nowrap items-center gap-1.5 text-xs">
                                <p className="font-semibold">Sort Code:</p>
                                <p>{activeBank.sortCode}</p>
                              </div>
                            )}
                            {activeBank.swiftCode && (
                              <div className="flex flex-nowrap items-center gap-1.5 text-xs">
                                <p className="font-semibold">Swift Code:</p>
                                <p>{activeBank.swiftCode}</p>
                              </div>
                            )}
                            {activeBank.fnbUniversalCode && (
                              <div className="flex flex-nowrap items-center gap-1.5 text-xs">
                                <p className="font-semibold">
                                  FNB Universal Code:
                                </p>
                                <p>{activeBank.fnbUniversalCode}</p>
                              </div>
                            )}
                          </div>
                        );
                      })()
                    ) : (
                      <div className="text-xs text-gray-500">
                        No bank accounts configured
                      </div>
                    )}
                    <Button
                      type="button"
                      className={'w-fit text-sm'}
                      variant="ghost"
                      size={'sm'}
                      onClick={addNewBank}
                    >
                      <PlusIcon className="h-4 w-4" />
                      Add New bank
                    </Button>

                    <div className="mt-6">
                      <h4 className="mb-2 text-sm font-semibold">
                        Payment Gateways
                      </h4>
                      {paymentGateways?.length > 0 ? (
                        paymentGateways.map((gateway, index) => (
                          <div
                            key={index}
                            className="mb-2 space-y-1 border-b pb-2 last:mb-0 last:border-b-0 last:pb-0"
                          >
                            <div className="flex justify-between gap-2">
                              <div className="flex-1 space-y-1">
                                <div className="flex flex-nowrap items-center gap-1.5 text-xs">
                                  <p className="font-semibold">Name:</p>
                                  <p>{gateway.name}</p>
                                </div>
                                <div className="flex flex-nowrap items-center gap-1.5 text-xs">
                                  <p className="font-semibold">Link:</p>
                                  <a
                                    href={gateway.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    {gateway.link}
                                  </a>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => {
                                    setPaymentGateways((prev) => {
                                      const selected = prev[index];
                                      setIsAddPaymentGatewayModalOpen({
                                        open: true,
                                        editIndex: index,
                                        initialData: selected,
                                      });
                                      return prev;
                                    });
                                  }}
                                >
                                  <PencilIcon className="h-3 w-3 text-gray-600" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() =>
                                    handleRemovePaymentGateway(index)
                                  }
                                >
                                  <TrashIcon className="h-3 w-3 text-red-600" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-gray-500">
                          No payment gateways configured
                        </div>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        className={'mt-4 w-fit text-sm'}
                        size={'sm'}
                        onClick={addPaymentGateway}
                      >
                        <PlusIcon className="h-4 w-4" />
                        Add payment Gateway
                      </Button>
                    </div>
                  </div>
                  <div className="w-full max-w-sm space-y-4">
                    <div className="space-y-2 text-sm font-medium">
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
                                    className="h-10 w-24 text-right"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(parseFloat(e.target.value))
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
                        <span>VAT (%)</span>
                        <div className="flex items-center gap-2">
                          <FormField
                            control={form.control}
                            name="vat"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  {isCustomVat ? (
                                    <div className="flex items-center gap-1">
                                      <Input
                                        type="number"
                                        placeholder="0"
                                        className="h-10 w-20 text-center"
                                        value={field.value || ''}
                                        onChange={(e) => {
                                          const value =
                                            parseFloat(e.target.value) || 0;
                                          field.onChange(value);
                                        }}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => setIsCustomVat(false)}
                                        className="text-xs text-gray-500 hover:text-gray-700"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  ) : (
                                    <Select
                                      onValueChange={(value) => {
                                        if (value === 'custom') {
                                          setIsCustomVat(true);
                                          return;
                                        }
                                        field.onChange(parseFloat(value));
                                      }}
                                      value={field.value?.toString()}
                                    >
                                      <SelectTrigger className="w-24">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="0">0%</SelectItem>
                                        <SelectItem value="5">5%</SelectItem>
                                        <SelectItem value="7.5">
                                          7.5%
                                        </SelectItem>
                                        <SelectItem value="10">10%</SelectItem>
                                        <SelectItem value="custom">
                                          Custom
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between text-xs text-[#434343]">
                        <span>VAT Amount</span>
                        <span>{calculateVatAmount().toFixed(2)}</span>
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
                                  formatNumber
                                  placeholder="Enter price"
                                  className="h-10 w-24 text-right"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(parseFloat(e.target.value))
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
              </div>

              {/* Totals Section */}
              <div className="grid grid-cols-1 gap-8 border-t pt-6 md:grid-cols-5">
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-semibold">Terms</h3>
                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Terms and conditions..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4 md:col-span-2 md:col-start-4">
                  <h3 className="text-lg font-semibold">Internal Notes</h3>
                  <FormField
                    control={form.control}
                    name="internal_notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Internal notes..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
                  <div className="space-y-4 md:col-span-2">
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
                  </div>

                  <div className="md:col-span-2 md:col-start-4">
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
                <Button
                  type="button"
                  className={'h-10'}
                  onClick={handleSave}
                  disabled={isSubmitting || !isFormValid()}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  type="button"
                  className={'h-10'}
                  variant="outline"
                  onClick={handlePreview}
                  disabled={isSubmitting || !isFormValid()}
                >
                  <EyeIcon className="size-4" />
                  Preview
                </Button>
              </div>
            </form>
          </Form>
          <AddCustomerModal
            open={isAddCustomerModalOpen}
            onOpenChange={setIsAddCustomerModalOpen}
          />

          <AddBankModal
            open={isAddBankModalOpen}
            onOpenChange={setIsAddBankModalOpen}
            handleSubmit={handleAddBank}
          />

          <AddPaymentGatewayModal
            open={isAddPaymentGatewayModalOpen.open}
            onOpenChange={(open) =>
              setIsAddPaymentGatewayModalOpen({
                open,
                editIndex: null,
                initialData: null,
              })
            }
            handleSubmit={handleAddPaymentGateway}
            initialData={isAddPaymentGatewayModalOpen.initialData}
            isEditing={isAddPaymentGatewayModalOpen.editIndex !== null}
          />

          <AddAccountForm
            isOpen={isAddAccountModalOpen}
            onClose={() => setIsAddAccountModalOpen(false)}
            type={'income'}
            showSuccessModal={() => {
              setIsAddAccountModalOpen(false);
              toast.success('Account added successfully');
            }}
          />

          <SuccessModal
            title={'Invoice Created'}
            description={"You've successfully created the invoice."}
            open={isSuccessModalOpen}
            onOpenChange={setIsSuccessModalOpen}
            nextText={'View'}
            handleNext={() => {
              navigate(
                `/dashboard/accounting/invoicing/${createdInvoiceData?.invoice?._id || createdInvoiceData?._id}`
              );
            }}
            backText={'Back'}
            handleBack={() => {
              setIsSuccessModalOpen(false);
              // Clear created invoice data when going back
              setCreatedInvoiceData(null);
              if (onBack) {
                onBack();
              } else {
                navigate('/dashboard/accounting/invoicing');
              }
            }}
          />
        </>
      )}
    </div>
  );
}
