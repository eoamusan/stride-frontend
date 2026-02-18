import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { EditIcon } from '@/components/ui/svgs';
import toast from 'react-hot-toast';

const ticketFormSchema = z.object({
  requestType: z.string().min(1, { message: 'Request type is required' }),
  employeeName: z.string().min(1, { message: 'Employee name is required' }),
  priority: z.string().min(1, { message: 'Priority is required' }),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(200, { message: 'Description must be 200 characters or less' }),
});

export default function EditTicketModal({
  open,
  onOpenChange,
  onSuccess,
  ticket,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      requestType: '',
      employeeName: '',
      priority: '',
      description: '',
    },
  });

  const descriptionValue = form.watch('description') || '';
  const charCount = descriptionValue.length;

  // Populate form when ticket data changes
  useEffect(() => {
    if (ticket && open) {
      form.reset({
        requestType: ticket.requestType || '',
        employeeName: ticket.submittedBy || '',
        priority: ticket.priority || 'medium',
        description: ticket.description || '',
      });
    }
  }, [ticket, open, form]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      // TODO: Replace with actual API call when available
      console.log('Updating ticket:', { id: ticket?.id, ...data });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onOpenChange(false);
      form.reset();
      onSuccess?.();
      toast.success('Ticket updated successfully');
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error('Failed to update ticket. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto p-8"
        overlayClassName="bg-[#0C0C0CE5]"
      >
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 text-left">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#3300C9]">
            <EditIcon className="size-5 text-white" />
          </div>
          <div className="flex-1">
            <DialogTitle className="font-raleway text-2xl font-semibold">
              Edit Ticket
            </DialogTitle>
            <p className="font-raleway mt-1 text-sm font-normal text-gray-500">
              Update ticket information
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="group flex size-8 items-center justify-center rounded-full border border-zinc-200 bg-white"
          >
            <X className="size-4 -rotate-45 transition-transform duration-200 group-hover:rotate-0" />
          </Button>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-6 space-y-5"
          >
            <FormField
              control={form.control}
              name="requestType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Request Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder="Select request type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="employment-letter">
                        Employment Letter
                      </SelectItem>
                      <SelectItem value="verification">Verification</SelectItem>
                      <SelectItem value="leave">Leave Request</SelectItem>
                      <SelectItem value="payroll">Payroll Inquiry</SelectItem>
                      <SelectItem value="benefits">Benefits</SelectItem>
                      <SelectItem value="attendance">Attendance</SelectItem>
                      <SelectItem value="documents">Documents</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employeeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee Name</FormLabel>
                  <FormControl>
                    <Input
                      className={'h-11'}
                      placeholder="Search employee..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the request..."
                      className="min-h-[120px] resize-none"
                      maxLength={200}
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-end">
                    <p className="text-xs text-gray-500">{charCount}/200</p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-6 pt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  form.reset();
                }}
                className="font-raleway h-11 min-w-[120px] rounded-full border border-[#254C00] px-6 py-2 text-[12px] leading-[24px] font-normal text-[#254C00] hover:bg-[#254C00] hover:text-white"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="font-raleway h-11 min-w-[160px] rounded-full border border-[#3300C9] bg-[#3300C9] px-8 py-2 text-[12px] leading-[24px] font-normal text-white hover:bg-[#3300C9]/90"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Ticket'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
