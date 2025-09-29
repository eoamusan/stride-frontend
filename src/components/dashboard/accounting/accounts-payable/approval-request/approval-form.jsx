import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
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
} from '@/components/ui/form';
import { Check, X, Download, User, Mail, FileText } from 'lucide-react';
import { DialogDescription } from '@radix-ui/react-dialog';
import pdfIcon from '@/assets/icons/pdf-icon.svg';

// Zod schema for approval request validation
const approvalRequestSchema = z.object({
  description: z.string().optional(),
  requestIds: z.array(z.string()).optional(),
});

export default function ApprovalRequestForm({
  open,
  onOpenChange,
  requestData = {
    invoiceNumber: 'INV-2024-001',
    vendor: 'JJ Solutions',
    amount: 15500.0,
    category: 'INV-2024-001',
    department: 'IT',
    projectCode: 'IT-2024-001',
    dueDate: 'INV-2024-001',
    description: '',
    priority: 'High',
    submittedBy: {
      name: 'James ben',
      avatar: null,
      submissionDate: 'Monday, January 15, 2024',
    },
    budgetImpact: {
      invoiceAmount: 12888,
      remainingBudget: 12888,
      afterApproval: 12888,
    },
    attachments: [
      { name: 'Invoice.pdf', type: 'pdf' },
      { name: 'Invoice.pdf', type: 'pdf' },
      { name: 'Invoice.pdf', type: 'pdf' },
    ],
    vendorInfo: {
      company: 'JJ Solutions',
      email: 'jjsolutions@gmail.com',
      phone: '07025679257',
      address: 'Ikeja Lagos state',
    },
  },
  onApprove,
  onReject,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(approvalRequestSchema),
    defaultValues: {
      description: requestData.description || '',
      requestIds: [requestData.invoiceNumber], // or whatever ID field is used
    },
  });

  const { handleSubmit } = form;

  const handleApprove = async (formData) => {
    setIsSubmitting(true);
    try {
      if (onApprove) {
        await onApprove({
          ...formData,
          action: 'approve',
          requestData,
        });
      }
      onOpenChange?.(false);
    } catch (error) {
      console.error('Error approving request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (formData) => {
    setIsSubmitting(true);
    try {
      if (onReject) {
        await onReject({
          ...formData,
          action: 'reject',
          requestData,
        });
      }
      onOpenChange?.(false);
    } catch (error) {
      console.error('Error rejecting request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = (attachment) => {
    console.log('Downloading:', attachment.name);
    // Implement download logic
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[90%] overflow-y-auto sm:max-w-4xl">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-[#FFAE4C]">
              <FileText className="size-4 text-white" />
            </div>
            <div>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Approval Request
                </DialogTitle>
                <DialogDescription className="text-sm font-medium">
                  {requestData.invoiceNumber} - {requestData.vendor}
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="border-red-200 bg-red-50 text-red-600"
          >
            {requestData.priority}
          </Badge>
        </div>

        <Form {...form}>
          <form
            onSubmit={handleSubmit((data) =>
              console.log('Form submitted:', data)
            )}
          >
            <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-16">
              {/* Left Column - Main Content */}
              <div className="space-y-8 lg:col-span-2">
                {/* Invoice Details Section */}
                <div className="space-y-4 rounded-2xl border p-4">
                  <h3 className="text-base font-semibold">Invoice Details</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">
                        Invoicing Number
                      </Label>
                      <p className="text-sm">{requestData.invoiceNumber}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Amount</Label>
                      <p className="text-sm">
                        ${requestData.amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Category</Label>
                      <p className="text-sm">{requestData.category}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Department</Label>
                      <p className="text-sm">{requestData.department}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">
                        Project Code
                      </Label>
                      <p className="text-sm">{requestData.projectCode}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Due Date</Label>
                      <p className="text-sm">{requestData.dueDate}</p>
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Description</h3>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Add description or comments..."
                            className="min-h-[100px] bg-gray-50"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Attachments Section */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold">Attachments</h3>
                  <div className="flex gap-4">
                    {requestData.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-xl border px-3 py-1.5"
                      >
                        <img src={pdfIcon} alt="pdf" className="h-6 w-auto" />

                        <span className="text-sm font-medium">
                          {attachment.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(attachment)}
                          className="h-8 w-8 p-0"
                        >
                          <Download className="h-4 w-4 text-[#24A959]" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vendor Information Section */}
                <div className="space-y-4 rounded-2xl border p-4">
                  <h3 className="text-base font-semibold">
                    Vendor Information
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Company</Label>
                      <p className="text-sm">
                        {requestData.vendorInfo.company}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">
                        Email Address
                      </Label>
                      <p className="text-sm">{requestData.vendorInfo.email}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">
                        Phone Number
                      </Label>
                      <p className="text-sm">{requestData.vendorInfo.phone}</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Address</Label>
                      <p className="text-sm">
                        {requestData.vendorInfo.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Actions & Info */}
              <div className="space-y-6">
                {/* Actions Section */}
                <div className="space-y-3">
                  <h3 className="text-base font-semibold">Actions</h3>
                  <div className="space-y-3">
                    <Button
                      type="button"
                      onClick={handleSubmit(handleApprove)}
                      disabled={isSubmitting}
                      className="h-10 w-full bg-[#24A959] text-white hover:bg-[#24A959]/90"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Approve (1)
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSubmit(handleReject)}
                      disabled={isSubmitting}
                      variant="destructive"
                      className="h-10 w-full bg-[#EF4444] hover:bg-[#EF4444]/90"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject (1)
                    </Button>
                  </div>
                </div>

                {/* Submitted By Section */}
                <div className="space-y-3 rounded-2xl border p-4">
                  <h3 className="text-base font-semibold">Submitted By</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={requestData.submittedBy.avatar}
                          className={'size-4'}
                        />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">
                          {requestData.submittedBy.name}
                        </p>
                        <p className="text-xs text-[#434343]">
                          Submitted on {requestData.submittedBy.submissionDate}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" size="sm">
                      <Mail className="mr-2 h-4 w-4" />
                      Contact
                    </Button>
                  </div>
                </div>

                {/* Budget Impact Section */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-base font-semibold">Budget Impact</h3>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        Invoice Amount:
                      </Label>
                      <p className="text-sm font-semibold">
                        $
                        {requestData.budgetImpact.invoiceAmount.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        Remaining Budget:
                      </Label>
                      <p className="text-sm font-semibold">
                        $
                        {requestData.budgetImpact.remainingBudget.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        After Approval:
                      </Label>
                      <p className="text-sm font-semibold">
                        $
                        {requestData.budgetImpact.afterApproval.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
