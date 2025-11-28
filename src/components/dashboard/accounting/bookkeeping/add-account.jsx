import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import AccountService from '@/api/accounts';
import { useUserStore } from '@/stores/user-store';
import toast from 'react-hot-toast';

const formSchema = z.object({
  accountType: z.string().min(1, { message: 'Account type is required' }),
  accountName: z.string().min(1, { message: 'Account name is required' }),
  accountNumber: z
    .string()
    .min(5, { message: 'Account number must be 5 digits' })
    .max(5),
  description: z.string().optional(),
});

export default function AddAccountForm({
  isOpen = false,
  type,
  onClose,
  formData = null,
  showSuccessModal,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { businessData } = useUserStore();

  //COME HERE
  const accountSuggestions = [40001, 40002, 40003, 40004];

  // Get first digit based on account type
  const getFirstDigit = (accountType) => {
    switch (accountType) {
      case 'assets':
        return '1';
      case 'liabilities':
        return '2';
      case 'equity':
        return '3';
      case 'income':
        return '4';
      case 'expenses':
        return '5';
      default:
        return '';
    }
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountType: type || '',
      accountName: '',
      accountNumber: '',
      description: '',
    },
  });

  // Prefill form data when formData prop changes
  useEffect(() => {
    if (formData) {
      form.reset({
        accountType: formData.accountType || type || '',
        accountName: formData.accountName || '',
        accountNumber: formData.accountNumber || '',
        description: formData.description || '',
      });
    }
  }, [formData, form, type]);

  // Set accountType when type prop is provided
  useEffect(() => {
    if (type) {
      form.setValue('accountType', type);
      // Set the first digit of account number when type is provided
      const firstDigit = getFirstDigit(type);
      const currentNumber = form.getValues('accountNumber') || '';
      const restOfNumber = currentNumber.slice(1);
      form.setValue('accountNumber', firstDigit + restOfNumber);
    }
  }, [type, form]);

  // Watch accountType and update first digit of accountNumber
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (
        name === 'accountType' ||
        (value.accountType && !form.getValues('accountNumber'))
      ) {
        const firstDigit = getFirstDigit(value.accountType);
        if (firstDigit) {
          const currentNumber = form.getValues('accountNumber') || '';
          // Keep the rest of the digits but replace the first one
          const restOfNumber = currentNumber.slice(1);
          form.setValue('accountNumber', firstDigit + restOfNumber);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Prepare payload according to API requirements
      const payload = {
        businessId: businessData?._id,
        accountType: data.accountType,
        accountName: data.accountName,
        accountNumber: data.accountNumber,
        description: data.description || '',
      };

      const response = await AccountService.create({ data: payload });

      console.log('Account created successfully:', response.data);
      toast.success('Account created successfully!');

      // Reset form after successful submission
      form.reset();
      handleCancel();

      // Show success modal if provided
      if (showSuccessModal) {
        showSuccessModal();
      }
    } catch (error) {
      console.error('Error creating account:', error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to create account. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
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
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!!type}
                  >
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
              render={({ field }) => {
                const accountType = form.watch('accountType');
                const firstDigit = getFirstDigit(accountType);

                return (
                  <FormItem>
                    <div className="flex items-center gap-4">
                      <FormLabel>Account number</FormLabel>
                      <div className="flex items-center gap-1">
                        <p className="text-xs font-medium text-[#434343]">
                          Account Codes:{' '}
                        </p>
                        <ul className="flex items-center text-xs font-medium text-[#EF4444]">
                          {accountSuggestions.map((code, i) => (
                            <li
                              key={code}
                              className="cursor-pointer rounded px-1"
                              onClick={() => field.onChange(code.toString())}
                            >
                              {code}
                              {i < accountSuggestions.length - 1 ? ',' : ''}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <FormControl>
                      <InputOTP
                        className={'items-center justify-center'}
                        maxLength={5}
                        value={field.value}
                        onChange={(value) => {
                          const correctedValue = firstDigit + value.slice(1);
                          field.onChange(correctedValue);
                        }}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={0}
                            className="h-14 w-14 cursor-not-allowed bg-gray-50 text-lg"
                          />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={1}
                            className="h-14 w-14 text-lg"
                          />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={2}
                            className="h-14 w-14 text-lg"
                          />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={3}
                            className="h-14 w-14 text-lg"
                          />
                        </InputOTPGroup>
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={4}
                            className="h-14 w-14 text-lg"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
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
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                className="h-10 px-8 text-sm"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add account'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
