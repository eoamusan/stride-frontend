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
  account_name: z.string().min(1, { message: 'Account name is required' }),
  account_number: z.string().min(1, { message: 'Account number is required' }),
  bank_name: z.string().min(1, { message: 'Bank name is required' }),
  tax_identification_no: z
    .string()
    .min(1, { message: 'Tax identification number is required' }),
  sort_code: z.string().min(1, { message: 'Sort code is required' }),
});

export default function AddBankModal({ open, onOpenChange }) {
  const form = useForm({
    resolver: zodResolver(bankFormSchema),
    defaultValues: {
      account_name: '',
      account_number: '',
      bank_name: '',
      tax_identification_no: '',
      sort_code: '',
    },
  });

  const onSubmit = (data) => {
    console.log('Bank data:', data);
    // Handle form submission
    onOpenChange(false);
    form.reset();
  };

  const handleCancel = () => {
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-full max-w-lg overflow-y-auto sm:max-w-lg">
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
              name="account_name"
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
              name="account_number"
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
              name="bank_name"
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
              name="tax_identification_no"
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
              name="sort_code"
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
            <div className="flex justify-end gap-6 pt-8">
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
