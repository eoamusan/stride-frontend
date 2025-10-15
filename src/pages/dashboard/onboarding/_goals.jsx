import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import StrideLogo from '@/assets/icons/stride.svg';
import { ArrowLeftIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import BusinessService from '@/api/business';
import { useUserStore } from '@/stores/user-store';

const formSchema = z.object({
  goals: z.array(z.string()).min(1, {
    message: 'At least one goal is required',
  }),
});

export default function Goals({ setBack, setFormData, formData }) {
  const navigate = useNavigate();
  const [selectedGoals, setSelectedGoals] = useState(formData.goals || []);
  const [submitLoading, setSubmitLoading] = useState(false);
  const userStore = useUserStore.getState();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goals: formData.goals || [],
    },
  });

  const goalOptions = [
    {
      value: 'i want to use all of strides features',
      label: "I want to use All of Stride's features",
    },
    { value: 'contact management', label: 'Contact Management' },
    { value: 'hr management', label: 'HR Management' },
    { value: 'task management', label: 'Task Management' },
    { value: 'team management', label: 'Team Management' },
    {
      value: 'wish list and birthdays and life celebrations',
      label: 'Wish List and Birthdays and Life Celebrations',
    },
    { value: 'report management', label: 'Report Management' },
    { value: 'invoicing', label: 'Invoicing' },
    {
      value: 'bookkeeping and general ledger',
      label: 'Bookkeeping and General Ledger',
    },
    { value: 'bid and vendor management', label: 'Bid and Vendor Management' },
    { value: 'customer management', label: 'Customer Management' },
    { value: 'inventory management', label: 'Inventory Management' },
    { value: 'point of sale', label: 'Point of Sale' },
    {
      value: 'expense and bill management',
      label: 'Expense and Bill Management',
    },
    { value: 'budgeting and forecasting', label: 'Budgeting and Forecasting' },
    { value: 'fixed asset management', label: 'Fixed Asset Management' },
    { value: 'tax management', label: 'Tax Management' },
    {
      value: 'banking and reconciliation',
      label: 'Banking and Reconciliation',
    },
  ];

  const handleGoalSelect = (value) => {
    if (!selectedGoals.includes(value)) {
      const newGoals = [...selectedGoals, value];
      setSelectedGoals(newGoals);
      form.setValue('goals', newGoals);
    }
  };

  const handleGoalRemove = (goalToRemove) => {
    const newGoals = selectedGoals.filter((goal) => goal !== goalToRemove);
    setSelectedGoals(newGoals);
    form.setValue('goals', newGoals);
  };

  const getGoalLabel = (value) => {
    return goalOptions.find((option) => option.value === value)?.label || value;
  };

  const onSubmit = async (data) => {
    try {
      setSubmitLoading(true);
      setFormData((prev) => ({ ...prev, ...data }));
      const res = await BusinessService.create({
        ...formData,
        goals: data.goals,
        accountId: userStore.data?.account?._id,
      });
      toast.success(res.data?.message || 'Form submitted successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Couldn't complete setup! Try again."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-16">
      <div className="mx-auto flex w-full max-w-[720px] flex-col items-center justify-center gap-4 rounded-xl py-10 max-md:px-[5%] md:border md:shadow-xl">
        <header className="relative w-full">
          <Button
            size={'sm'}
            variant={'link'}
            className={'absolute inset-y-3 left-4 text-zinc-600'}
            onClick={setBack}
          >
            <ArrowLeftIcon className="mr- h-4 w-4" /> Back
          </Button>
          <img
            src={StrideLogo}
            alt="Stride"
            className="mx-auto block w-[131px]"
          />
          <hgroup className="mt-6 max-w-[420px] text-center">
            <h1 className="text-4xl font-semibold">Goals</h1>
          </hgroup>
        </header>
        <main className="mt-4 w-full max-w-[420px]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex min-h-56 flex-col justify-between gap-4"
            >
              <FormField
                control={form.control}
                name="goals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What do you want to do with Stride?</FormLabel>

                    {/* Selected Goals as Badges */}
                    {selectedGoals.length > 0 && (
                      <div className="mt-4 mb-2 flex flex-wrap gap-2">
                        {selectedGoals.map((goal) => (
                          <Badge
                            key={goal}
                            variant="secondary"
                            className="flex items-center gap-1 px-3 py-1 font-medium"
                          >
                            {getGoalLabel(goal)}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-4 w-4 p-0 hover:bg-transparent"
                              onClick={() => handleGoalRemove(goal)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Select Dropdown */}
                    <Select onValueChange={handleGoalSelect}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your goals" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {goalOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            disabled={selectedGoals.includes(option.value)}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-8 flex justify-end">
                <Button
                  type="submit"
                  size={'lg'}
                  className="h-10"
                  disabled={submitLoading}
                  isLoading={submitLoading}
                >
                  Complete Setup
                </Button>
              </div>
            </form>
          </Form>
        </main>
      </div>
    </div>
  );
}
