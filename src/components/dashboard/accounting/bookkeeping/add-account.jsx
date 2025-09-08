import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  accountType: z.string().min(1, { message: 'Account type is required' }),
  accountName: z.string().min(1, { message: 'Account name is required' }),
  accountNumber: z.string().min(1, { message: 'Account number is required' }),
  accountRelation: z.enum(['subaccount', 'parent'], {
    required_error: 'Please select account relation',
  }),
  detailType: z.string().min(1, { message: 'Detail type is required' }),
  description: z.string().optional(),
});

export default function AddAccountForm({
  isOpen = false,
  onClose,
  formData = null,
  showSuccessModal,
}) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountType: '',
      accountName: '',
      accountNumber: '',
      accountRelation: 'subaccount',
      detailType: '',
      description: '',
    },
  });

  // Prefill form data when formData prop changes
  useEffect(() => {
    if (formData) {
      form.reset({
        accountType: formData.accountType || '',
        accountName: formData.accountName || '',
        accountNumber: formData.accountNumber || '',
        accountRelation: formData.accountRelation || 'subaccount',
        detailType: formData.detailType || '',
        description: formData.description || '',
      });
    }
  }, [formData, form]);

  const handleSubmit = (data) => {
    console.log('Form submitted:', data);

    handleCancel();
    showSuccessModal();
    // Reset form after submission
    // form.reset();
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] w-full max-w-2xl overflow-y-auto p-8 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add Account</DialogTitle>
          <DialogDescription className="text-sm">
            Enter the details
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Account Type */}
            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Account type
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="assets">Assets</SelectItem>
                      <SelectItem value="liabilities">Liabilities</SelectItem>
                      <SelectItem value="equity">Equity</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expenses">Expenses</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Account Name */}
            <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter account name"
                      className="h-10"
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
                  <FormLabel>Account number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter account number"
                      className="h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Account Relation Radio Buttons */}
            <FormField
              control={form.control}
              name="accountRelation"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid gap-8 sm:grid-cols-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="subaccount" id="subaccount" />
                        <Label
                          htmlFor="subaccount"
                          className="text-sm font-medium"
                        >
                          Make this a subaccount
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="parent" id="parent" />
                        <Label htmlFor="parent" className="text-sm font-medium">
                          Make this a parent account
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Detail Type */}
            <FormField
              control={form.control}
              name="detailType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detail type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-10 w-full">
                        <SelectValue placeholder="Select detail type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="checking">Checking Account</SelectItem>
                      <SelectItem value="savings">Savings Account</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="credit-card">Credit Card</SelectItem>
                      <SelectItem value="office-equipment">
                        Office Equipment
                      </SelectItem>
                      <SelectItem value="accounts-payable">
                        Accounts Payable
                      </SelectItem>
                      <SelectItem value="accounts-receivable">
                        Accounts Receivable
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="write description"
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="h-10 px-8 text-sm"
              >
                Cancel
              </Button>
              <Button className="h-10 px-8 text-sm" type="submit">
                Add account
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
