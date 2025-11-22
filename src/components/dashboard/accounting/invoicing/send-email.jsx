import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RichTextEditor from '../../rich-text-editor';
import { MailIcon, DownloadIcon, UserIcon, PhoneIcon } from 'lucide-react';
import pdfIcon from '@/assets/icons/pdf-icon.svg';
import InvoiceService from '@/api/invoice';
import toast from 'react-hot-toast';

export default function SendInvoiceEmail({ open, onOpenChange, invoiceData }) {
  console.log(invoiceData);
  const businessName =
    invoiceData?.businessSettings?.businessName || 'Oneda Business';
  const defaultSubject = `Invoice from ${businessName}`;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    cc: '',
    bcc: '',
    subject: defaultSubject,
    message:
      invoiceData?.businessSettings?.emailTemplate ||
      `
      <p>Dear Customer,</p>
      <p>Please find attached your invoice. We appreciate your business and look forward to continuing our partnership.</p>
      <p>If you have any questions about this invoice, please don't hesitate to contact us.</p>
      <p>Best regards,<br/>Your ${businessName} Team</p>
    `,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSend = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Parse CC and BCC strings into arrays
      const ccArray = formData.cc
        ? formData.cc
            .split(',')
            .map((email) => email.trim())
            .filter((email) => email)
        : [];
      const bccArray = formData.bcc
        ? formData.bcc
            .split(',')
            .map((email) => email.trim())
            .filter((email) => email)
        : [];

      // Replace variables in the message with actual values
      let processedMessage = formData.message;
      const variables = {
        fullName:
          `${invoiceData?.customer?.firstName || ''} ${invoiceData?.customer?.lastName || ''}`.trim(),
        firstName: invoiceData?.customer?.firstName || '',
        lastName: invoiceData?.customer?.lastName || '',
        email: invoiceData?.customer?.displayName || '',
        invoiceNumber: invoiceData?.invoice_number || '',
        invoiceDate: '', // Add invoice date property
        dueDate: '', // Add due date property
        invoiceAmount: '', // Add invoice amount property
        currency: '', // Add currency property
        companyName: businessName,
        accountNumber: '', // Add account number property
        bankName: '', // Add bank name property
        invoiceLink: '', // Add invoice link property
        paymentLink: '', // Add payment link property
      };

      // Replace all variables in the message (including those wrapped in HTML tags)
      Object.keys(variables).forEach((key) => {
        // Match {{variable}} even when inside HTML tags with attributes
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        processedMessage = processedMessage.replace(
          regex,
          variables[key] || ''
        );
      });

      const emailData = {
        businessId: invoiceData?.businessSettings?.businessId || '',
        customerId: invoiceData?.customer?.id || invoiceData?.customerId,
        cc: ccArray,
        bcc: bccArray,
        subject: formData.subject,
        message: processedMessage,
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
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-gray-400" />
              <span>
                {invoiceData?.customer?.firstName}{' '}
                {invoiceData?.customer?.lastName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MailIcon className="h-4 w-4 text-gray-400" />
              <span>
                {invoiceData?.customer?.email || 'customer@email.com'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4 text-gray-400" />
              <span>
                {invoiceData?.customer?.phoneNumber || 'Phone not available'}
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* CC and BCC Fields */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cc">CC</Label>
              <Input
                id="cc"
                type="email"
                value={formData.cc}
                onChange={(e) => handleInputChange('cc', e.target.value)}
                className={'h-10'}
                placeholder="Enter CC emails separated by commas"
              />
              <p className="text-xs text-gray-500">
                Separate multiple emails with commas
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bcc">Bcc</Label>
              <Input
                id="bcc"
                type="email"
                value={formData.bcc}
                className={'h-10'}
                onChange={(e) => handleInputChange('bcc', e.target.value)}
                placeholder="Enter BCC emails separated by commas"
              />
              <p className="text-xs text-gray-500">
                Separate multiple emails with commas
              </p>
            </div>
          </div>

          {/* Subject Field */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              type="text"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              className={'h-10'}
              placeholder="Enter message subject"
            />
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <div className="min-h-[200px] rounded-md border">
              <RichTextEditor
                currentValue={formData.message}
                setCurrentValue={(value) => handleInputChange('message', value)}
                placeholder="Enter your message..."
                className="rounded-md"
              />
            </div>
          </div>

          {/* Attachment Section */}
          <div className="space-y-2">
            <Label>Attachment</Label>
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
              variant="outline"
              onClick={handleCancel}
              className="h-10 px-8"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              className="h-10 px-8"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
