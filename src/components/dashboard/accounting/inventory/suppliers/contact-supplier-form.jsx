import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { User, Mail, Phone, IdCardLanyardIcon } from 'lucide-react';

// Zod schema for form validation
const contactSupplierSchema = z.object({
  requestType: z.string().min(1, 'Request type is required'),
  priority: z.string().min(1, 'Priority is required'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
});

export default function ContactSupplierForm({
  open,
  onOpenChange,
  supplierData = {
    name: 'Office Depot',
    contactPerson: 'Adeniyi James',
    email: 'jjsolutions@gmail.com',
    phone: '+2347065724230',
  },
  onSubmit,
  openSuccessModal,
}) {
  const form = useForm({
    resolver: zodResolver(contactSupplierSchema),
    defaultValues: {
      requestType: '',
      priority: '',
      subject: '',
      message: '',
    },
  });

  const { handleSubmit, reset } = form;

  const handleCancel = () => {
    reset();
    onOpenChange?.(false);
  };

  const onFormSubmit = (data) => {
    console.log('Contact request data:', data);
    if (onSubmit) {
      onSubmit({
        ...data,
        supplier: supplierData,
      });
    }
    reset();
    onOpenChange?.(false);
    openSuccessModal?.(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[90%] overflow-y-auto p-8 sm:max-w-3xl">
        {/* Header */}
        <div className="flex gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#254C00]">
            <IdCardLanyardIcon className="size-4 text-white" />
          </div>
          <div>
            <DialogHeader>
              <DialogTitle>Contact Supplier</DialogTitle>
              <DialogDescription>{supplierData.name}</DialogDescription>
            </DialogHeader>
          </div>
        </div>

        {/* Supplier Contact Information */}
        <div className="mt-2 flex flex-wrap items-center gap-6 text-sm text-[#434343]">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{supplierData.contactPerson}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>{supplierData.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>{supplierData.phone}</span>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="space-y-6 py-4"
          >
            {/* Request Type and Priority Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Request Type */}
              <FormField
                control={form.control}
                name="requestType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Request Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 w-full">
                          <SelectValue placeholder="Request Type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="quote">Quote</SelectItem>
                        <SelectItem value="inquiry">General Inquiry</SelectItem>
                        <SelectItem value="order">Order Request</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                        <SelectItem value="complaint">Complaint</SelectItem>
                        <SelectItem value="payment">Payment Issue</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Priority */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 w-full">
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Subject */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter message subject"
                      {...field}
                      className="h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your message"
                      {...field}
                      className="min-h-[150px] resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Footer Buttons */}
            <div className="flex justify-end space-x-4 pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="h-10 min-w-[120px] rounded-full"
              >
                Cancel
              </Button>
              <Button type="submit" className="h-10 min-w-[140px] rounded-full">
                Send Message
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
