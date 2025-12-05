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
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
  const [accountsList, setAccountsList] = useState([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [accountRelation, setAccountRelation] = useState('parent');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { businessData } = useUserStore();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountType: type || '',
      accountName: '',
      accountNumber: '',
      description: '',
      accountRelation: 'parent',
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
    }
  }, [type, form]);

  // Call generateCode when accountType is selected or when type prop changes
  useEffect(() => {
    const generateCode = async (accountType) => {
      try {
        const response = await AccountService.generatecode({
          accountType: accountType,
        });
        // Set the generated account number
        if (response.data?.success && response.data?.data) {
          form.setValue('accountNumber', response.data.data);
        }
      } catch (error) {
        console.error('Error generating code:', error);
      }
    };

    // Generate code when type prop is provided
    if (type) {
      generateCode(type);
    }

    // Watch for accountType changes
    const subscription = form.watch(async (value, { name }) => {
      if (name === 'accountType' && value.accountType) {
        generateCode(value.accountType);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, type]);

  // Watch accountRelation and update local state
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'accountRelation') {
        setAccountRelation(value.accountRelation || 'subaccount');
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Fetch accounts with debounce based on accountRelation and search
  useEffect(() => {
    // Only fetch when the dialog is open
    if (!isOpen) {
      return;
    }

    // Only fetch if accountRelation is 'subaccount'
    if (accountRelation !== 'subaccount') {
      setAccountsList([]);
      return;
    }

    const debounceTimer = setTimeout(async () => {
      try {
        setIsLoadingAccounts(true);
        const parentAccount = !(accountRelation === 'parent');

        const response = await AccountService.fetch({
          parentAccount,
          search: searchQuery,
          accountType: form.getValues('accountType') || type,
        });

        setAccountsList(response.data?.data?.accounts || []);
      } catch (error) {
        console.error('Error fetching accounts:', error);
        toast.error('Failed to fetch accounts');
        setAccountsList([]);
      } finally {
        setIsLoadingAccounts(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, accountRelation, isOpen, form, type]);

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Prepare payload according to API requirements
      const payload = {
        businessId: businessData?._id,
        accountType: data.accountType,
        accountName: data.accountName,
        accountCode: data.accountNumber,
        subAccount: data.accountRelation === 'subaccount',
        parentAccount: data.accountRelation === 'parent',
        description: data.description || '',
      };

      // Only add parentAccountId if it exists
      if (selectedParentAccount?._id) {
        payload.parentAccountId = selectedParentAccount._id;
      }

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

  const handleAccountSelect = (account) => {
    setSelectedParentAccount(account);
    setIsPopoverOpen(false);
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
                return (
                  <FormItem>
                    <FormLabel>Account number</FormLabel>
                    <FormControl>
                      <InputOTP
                        className={'items-center justify-center'}
                        maxLength={5}
                        value={field.value}
                        onChange={field.onChange}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot
                            index={0}
                            className="h-14 w-14 text-lg"
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
                        <RadioGroupItem value="parent" id="parent" />
                        <Label htmlFor="parent" className="text-sm font-medium">
                          Make this a parent account
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="subaccount" id="subaccount" />
                        <Label
                          htmlFor="subaccount"
                          className="text-sm font-medium"
                        >
                          Make this a subaccount
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
                {/* Search Input with Dropdown */}
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverAnchor>
                    <div className="relative">
                      <Search className="pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        placeholder="search parent account"
                        value={
                          selectedParentAccount
                            ? `${selectedParentAccount.accountCode || selectedParentAccount.accountNumber} - ${selectedParentAccount.accountName}`
                            : searchQuery
                        }
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          if (!isPopoverOpen) {
                            setIsPopoverOpen(true);
                          }
                        }}
                        onFocus={() => setIsPopoverOpen(true)}
                        onClick={() => setIsPopoverOpen(true)}
                        className="h-12 pl-10"
                      />
                    </div>
                  </PopoverAnchor>
                  <PopoverContent
                    className="w-(--radix-popover-trigger-width) p-0"
                    align="start"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                  >
                    {/* Accounts List */}
                    <div className="max-h-[250px] overflow-y-auto rounded-lg bg-white">
                      {isLoadingAccounts ? (
                        <div className="flex items-center justify-center py-8">
                          <p className="text-sm text-gray-500">
                            Loading accounts...
                          </p>
                        </div>
                      ) : accountsList.length > 0 ? (
                        <div className="space-y-1 p-2">
                          {accountsList.map((account) => (
                            <div
                              key={account._id || account.id}
                              className="grid cursor-pointer grid-cols-[auto_1fr_1fr_1fr] items-center gap-3 rounded px-3 py-3 hover:bg-gray-50"
                              onClick={() => handleAccountSelect(account)}
                            >
                              <Checkbox
                                checked={
                                  selectedParentAccount?._id === account._id ||
                                  selectedParentAccount?.id === account.id
                                }
                                onCheckedChange={() =>
                                  handleAccountSelect(account)
                                }
                              />
                              <span className="text-sm font-medium">
                                {account.accountCode || account.accountNumber}
                              </span>
                              <span className="text-sm text-gray-600">
                                {account.accountType}
                              </span>
                              <span className="overflow-hidden text-sm text-nowrap text-ellipsis text-gray-600">
                                {account.accountName}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8">
                          <div className="mb-3">
                            <img
                              src={notFoundImg}
                              alt="No Account Found"
                              className="h-24 w-auto"
                            />
                          </div>
                          <p className="text-sm font-medium text-gray-700">
                            No Account found
                          </p>
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
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
