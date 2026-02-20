import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import RichTextEditor from '../../rich-text-editor';
import { MailIcon, DownloadIcon, UserIcon, PhoneIcon } from 'lucide-react';
import pdfIcon from '@/assets/icons/pdf-icon.svg';
import InvoiceService from '@/api/invoice';
import CustomerService from '@/api/customer';
import toast from 'react-hot-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Helper function to check if email template has actual text content
const hasEmailTemplateContent = (template) => {
  if (!template || template.trim().length === 0) return false;

  // Remove HTML tags and check if there's actual text content
  const textContent = template.replace(/<[^>]*>/g, '').trim();
  return textContent.length > 0;
};

// Default email template
const DEFAULT_EMAIL_TEMPLATE = `<p>Dear {{fullName}},</p>
<p><br></p>
<p>We hope this message finds you well. Please find attached invoice {{invoiceNumber}} for the amount of {{invoiceAmount}} {{currency}}.</p>
<p><br></p>
<p><strong>Invoice Details:</strong></p>
<ul>
<li>Invoice Date: {{invoiceDate}}</li>
<li>Due Date: {{dueDate}}</li>
<li>Amount Due: {{invoiceAmount}} {{currency}}</li>
</ul>
<p><br></p>
<p>You can view and download your invoice using the following link:</p>
<p>{{invoiceLink}}</p>
<p><br></p>
<p>Thank you</p>`;

const emailFormSchema = z.object({
  cc: z.string().optional(),
  bcc: z.string().optional(),
  subject: z.string().min(1, { message: 'Subject is required' }),
  message: z.string().min(1, { message: 'Message is required' }),
});

export default function SendInvoiceEmail({ open, onOpenChange, invoiceData }) {
  const businessName =
    invoiceData?.businessSettings?.businessName || 'Oneda Business';
  const defaultSubject = `Invoice from ${businessName}`;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);

  const form = useForm({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      cc: '',
      bcc: '',
      subject: defaultSubject,
      message: hasEmailTemplateContent(
        invoiceData?.businessSettings?.emailTemplate
      )
        ? invoiceData.businessSettings.emailTemplate
        : DEFAULT_EMAIL_TEMPLATE,
    },
  });

  // Fetch customer data when dialog opens
  useEffect(() => {
    const fetchCustomer = async () => {
      if (open && invoiceData?.customer?.id) {
        setIsLoadingCustomer(true);
        try {
          const response = await CustomerService.get({
            id: invoiceData.customer.id,
          });
          if (response.data?.data) {
            setCustomer(response?.data.data?.customer);
          }
        } catch (error) {
          console.error('Error fetching customer:', error);
          toast.error('Failed to load customer details');
        } finally {
          setIsLoadingCustomer(false);
        }
      }
    };

    fetchCustomer();
  }, [open, invoiceData?.customer?.id]);

  // Replace variables in the email template when dialog opens or invoiceData changes
  useEffect(() => {
    if (open && invoiceData && customer) {
      const template = hasEmailTemplateContent(
        invoiceData?.businessSettings?.emailTemplate
      )
        ? invoiceData.businessSettings.emailTemplate
        : DEFAULT_EMAIL_TEMPLATE;

      // Format dates
      const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      };

      // Format currency amount
      const formatAmount = (amount, currency) => {
        if (!amount) return '';
        const currencySymbols = {
          USD: '$',
          EUR: '€',
          GBP: '£',
          NGN: '₦',
        };
        const symbol = currencySymbols[currency] || currency;
        return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      };

      const firstBankAccount = invoiceData?.businessSettings?.bankAccounts?.[0];

      const variables = {
        fullName: customer?.displayName || '',
        firstName: customer?.firstName || '',
        lastName: customer?.lastName || '',
        email: customer?.email || '',
        invoiceNumber: invoiceData?.invoice_number || '',
        invoiceDate: formatDate(invoiceData?.invoice_date),
        dueDate: formatDate(invoiceData?.due_date),
        invoiceAmount: formatAmount(invoiceData?.total, invoiceData?.currency),
        currency: invoiceData?.currency || '',
        companyName: customer?.companyName || businessName,
        accountNumber: firstBankAccount?.accountNumber || '',
        bankName: firstBankAccount?.bankName || '',
        invoiceLink: invoiceData?.pdfUrl || '',
      };

      let processedMessage = template;
      // Replace all variables in the message (including those wrapped in HTML tags)
      Object.keys(variables).forEach((key) => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'gi');
        processedMessage = processedMessage.replace(
          regex,
          variables[key] || ''
        );
      });

      form.reset({
        cc: '',
        bcc: '',
        subject: defaultSubject,
        message: processedMessage,
      });
    }
  }, [open, invoiceData, customer, businessName, defaultSubject, form]);

  const onSubmit = async (data) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Parse CC and BCC strings into arrays
      const ccArray = data.cc
        ? data.cc
            .split(',')
            .map((email) => email.trim())
            .filter((email) => email)
        : [];
      const bccArray = data.bcc
        ? data.bcc
            .split(',')
            .map((email) => email.trim())
            .filter((email) => email)
        : [];

      const emailData = {
        businessId: invoiceData?.businessSettings?.businessId || '',
        customerId: invoiceData?.customer?.id || invoiceData?.customerId,
        cc: ccArray,
        bcc: bccArray,
        subject: data.subject,
        message: data.message,
        invoiceUrl: invoiceData?.pdfUrl || '',
      };

      await InvoiceService.sendEmail({ data: emailData });
      toast.success('Email sent successfully');
      onOpenChange(false);
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || 'Failed to send email'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        {/* Header */}
        <DialogHeader className="space-y-0 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-[#254C00]">
              <MailIcon className="size-4 text-white" />
            </div>
            <DialogTitle>Send via Email</DialogTitle>
          </div>

          {/* Recipient Info */}
          <div className="mt-4 flex items-center gap-6 text-sm text-[#434343]">
            {isLoadingCustomer ? (
              <span className="text-gray-400">Loading customer details...</span>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-gray-400" />
                  <span>{customer?.displayName || 'Customer Name'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MailIcon className="h-4 w-4 text-gray-400" />
                  <span>{customer?.email || 'customer@email.com'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4 text-gray-400" />
                  <span>{customer?.phoneNumber || 'Phone not available'}</span>
                </div>
              </>
            )}
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* CC and BCC Fields */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="cc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CC</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        className={'h-10'}
                        placeholder="Enter CC emails separated by commas"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500">
                      Separate multiple emails with commas
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bcc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bcc</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        className={'h-10'}
                        placeholder="Enter BCC emails separated by commas"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500">
                      Separate multiple emails with commas
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Subject Field */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className={'h-10'}
                      placeholder="Enter message subject"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Message Field */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <div className="min-h-[200px] rounded-md border">
                      <RichTextEditor
                        key={field.value}
                        currentValue={field.value}
                        setCurrentValue={field.onChange}
                        placeholder="Enter your message..."
                        className="rounded-md"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Attachment Section */}
            <div className="space-y-2">
              <FormLabel>Attachment</FormLabel>
              <div className="flex w-full items-center gap-2 rounded-md border p-3">
                <div className="flex size-5 items-center justify-center">
                  <img src={pdfIcon} className="h-full w-full" />
                </div>
                <span className="text-sm font-medium">
                  {invoiceData?.invoice_number
                    ? `Invoice-${invoiceData.invoice_number}.pdf`
                    : 'Invoice.pdf'}
                </span>
                {invoiceData?.pdfUrl ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-auto"
                    onClick={() => window.open(invoiceData.pdfUrl, '_blank')}
                  >
                    <DownloadIcon className="h-4 w-4" />
                  </Button>
                ) : (
                  <span className="ml-auto text-xs text-gray-400">
                    Generating...
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="h-10 px-8"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-10 px-8"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
