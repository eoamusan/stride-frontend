import { z } from 'zod';
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
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const bankFormSchema = z.object({
  accountName: z.string().min(1, { message: 'Account name is required' }),
  accountNumber: z.string().min(1, { message: 'Account number is required' }),
  bankName: z.string().min(1, { message: 'Bank name is required' }),
  tin: z.string().optional(),
  sortCode: z.string().optional(),
});

export default function AddBankModal({ open, onOpenChange, handleSubmit }) {
  const form = useForm({
    resolver: zodResolver(bankFormSchema),
    defaultValues: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      tin: '',
      sortCode: '',
    },
  });

  const onSubmit = async (data) => {
    if (handleSubmit) {
      await handleSubmit(data);
    } else {
      // Use the default onSubmit behavior
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
            Add Bank
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Account Name */}
            <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter Account Name"
                      className="h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Account Number */}
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter Account Number"
                      className="h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bank Name */}
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter Bank Name"
                      className="h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tax Identification Number */}
            <FormField
              control={form.control}
              name="tin"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter Tax identification No"
                      className="h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sort Code */}
            <FormField
              control={form.control}
              name="sortCode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter Sort Code"
                      className="h-10"
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
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
