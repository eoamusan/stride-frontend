import { z } from 'zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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

const paymentGatewayFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  link: z
    .url({ message: 'Please enter a valid URL' })
    .min(1, { message: 'Link is required' }),
});

export default function AddPaymentGatewayModal({
  open,
  onOpenChange,
  handleSubmit,
  initialData = null,
  isEditing = false,
}) {
  const form = useForm({
    resolver: zodResolver(paymentGatewayFormSchema),
    defaultValues: {
      name: '',
      link: '',
    },
  });

  // Reset form with initial data when modal opens or initial data changes
  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset(initialData);
      } else {
        form.reset({ name: '', link: '' });
      }
    }
  }, [open, initialData, form]);

  const onSubmit = async (data) => {
    if (handleSubmit) {
      await handleSubmit(data);
    }
    onOpenChange(false);
    form.reset();
  };

  const handleCancel = () => {
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-full max-w-lg overflow-y-auto p-8 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-left text-2xl font-semibold">
            {isEditing ? 'Edit Payment Gateway' : 'Add Payment Gateway'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Payment Gateway Name (e.g., Paystack, Stripe)"
                      className="h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Link */}
            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Payment Gateway Link"
                      className="h-10"
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex justify-end gap-6 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="h-10"
              >
                Cancel
              </Button>
              <Button type="submit" className="h-10">
                {isEditing ? 'Update' : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
