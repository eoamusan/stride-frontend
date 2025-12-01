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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Search } from 'lucide-react';
import notFoundImg from '@/assets/icons/not-found.png';

const formSchema = z.object({
  accountType: z.string().min(1, { message: 'Account type is required' }),
  accountName: z.string().min(1, { message: 'Account name is required' }),
  accountNumber: z
    .string()
    .min(5, { message: 'Account number must be 5 digits' })
    .max(5),
  accountRelation: z.string().optional(),
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParentAccount, setSelectedParentAccount] = useState(null);
  const [accountsList, setAccountsList] = useState([
    {
      id: 1,
      accountNumber: '20001',
      accountType: 'Income',
      accountName: 'Office equipment',
    },
    {
      id: 2,
      accountNumber: '20001',
      accountType: 'Income',
      accountName: 'Office equipment',
    },
    {
      id: 3,
      accountNumber: '20001',
      accountType: 'Income',
      accountName: 'Office equipment',
    },
  ]);
  const { businessData } = useUserStore();

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
      accountRelation: 'subaccount',
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
        accountRelation: formData.accountRelation || '',
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

  // Filter accounts based on search query
  const filteredAccounts = accountsList.filter(
    (account) =>
      account.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.accountNumber.includes(searchQuery) ||
      account.accountType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAccountSelect = (account) => {
    setSelectedParentAccount(account);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] w-full max-w-2xl overflow-y-auto p-8 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add Service</DialogTitle>
          <DialogDescription className="text-sm">
            Enter the details
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-7"
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
                  <FormLabel>Service</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter service"
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
                    <FormLabel>Account number</FormLabel>
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

            {/* Parent Account Search - Only visible when subaccount is selected */}
            {form.watch('accountRelation') === 'subaccount' && (
              <div className="space-y-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="search parent account"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 pl-10"
                  />
                </div>

                {/* Accounts List */}
                <div className="max-h-[200px] overflow-y-auto rounded-lg border bg-white p-2 shadow-sm drop-shadow">
                  {filteredAccounts.length > 0 ? (
                    <div className="">
                      {filteredAccounts.map((account) => (
                        <div
                          key={account.id}
                          className="flex cursor-pointer items-center space-x-3 border-b bg-white px-3 py-4 hover:bg-gray-50"
                          // onClick={() => handleAccountSelect(account)}
                        >
                          <Checkbox
                            checked={selectedParentAccount?.id === account.id}
                            onCheckedChange={() => handleAccountSelect(account)}
                          />
                          <div className="flex flex-1 items-center justify-between text-sm">
                            <span className="font-medium">
                              {account.accountNumber}
                            </span>
                            <span className="text-gray-600">
                              {account.accountType}
                            </span>
                            <span className="text-gray-600">
                              {account.accountName}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="mb-3">
                        <img src={notFoundImg} alt="No Account Found" className="h-24 w-auto" />
                      </div>
                      <p className="text-sm font-medium text-gray-700">
                        No Account found
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

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
                {isSubmitting ? 'Adding...' : 'Add service'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
