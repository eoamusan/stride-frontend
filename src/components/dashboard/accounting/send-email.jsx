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
import RichTextEditor from '../rich-text-editor';
import { MailIcon, DownloadIcon } from 'lucide-react';

export default function SendInvoiceEmail({ open, onOpenChange, invoiceData }) {
  const [formData, setFormData] = useState({
    cc: '',
    bcc: '',
    subject: 'Invoice from Stride Business',
    message: `
      <p>Dear Customer,</p>
      <p>Please find attached your invoice. We appreciate your business and look forward to continuing our partnership.</p>
      <p>If you have any questions about this invoice, please don't hesitate to contact us.</p>
      <p>Best regards,<br/>Your Stride Business Team</p>
    `,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSend = () => {
    // TODO: Implement email sending logic
    console.log('Sending email with data:', formData);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] sm:max-w-4xl overflow-y-auto">
        {/* Header */}
        <DialogHeader className="space-y-0 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <MailIcon className="h-5 w-5 text-green-600" />
            </div>
            <DialogTitle className="text-xl font-semibold">
              Send via Email
            </DialogTitle>
          </div>

          {/* Recipient Info */}
          <div className="mt-4 flex flex-col gap-1 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-medium">Adeniyi James</span>
            </div>
            <div className="flex items-center gap-2">
              <span>jjsolutions@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <span>+2347065724230</span>
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
                placeholder="Enter CC email addresses"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bcc">Bcc</Label>
              <Input
                id="bcc"
                type="email"
                value={formData.bcc}
                onChange={(e) => handleInputChange('bcc', e.target.value)}
                placeholder="Enter BCC email addresses"
              />
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
            <div className="flex items-center gap-2 rounded-md border p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-red-100">
                <svg
                  className="h-4 w-4 text-red-600"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20,2H8A2,2 0 0,0 6,4V16A2,2 0 0,0 8,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M20,8H8V6H20V8Z" />
                </svg>
              </div>
              <span className="text-sm font-medium">Invoice.pdf</span>
              <Button variant="ghost" size="sm" className="ml-auto">
                <DownloadIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <Button variant="outline" onClick={handleCancel} className="px-8">
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              className="bg-purple-600 px-8 hover:bg-purple-700"
            >
              Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
