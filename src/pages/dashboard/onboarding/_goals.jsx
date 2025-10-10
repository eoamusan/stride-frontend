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

const formSchema = z.object({
  goals: z.array(z.string()).min(1, {
    message: 'At least one goal is required',
  }),
});

export default function Goals({ setBack, setFormData, formData }) {
  const navigate = useNavigate();
  const [selectedGoals, setSelectedGoals] = useState(formData.goals || []);
  const [submitLoading, setSubmitLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goals: formData.goals || [],
    },
  });

  const goalOptions = [
    { value: 'manage-finances', label: 'Manage Business Finances' },
    { value: 'track-expenses', label: 'Track Expenses' },
    { value: 'generate-reports', label: 'Generate Financial Reports' },
    { value: 'manage-inventory', label: 'Manage Inventory' },
    { value: 'handle-invoicing', label: 'Handle Invoicing & Billing' },
    { value: 'track-sales', label: 'Track Sales Performance' },
    { value: 'manage-customers', label: 'Manage Customer Relationships' },
    { value: 'payroll-management', label: 'Payroll Management' },
    { value: 'tax-compliance', label: 'Tax Compliance & Filing' },
    { value: 'business-analytics', label: 'Business Analytics & Insights' },
    { value: 'other', label: 'Other' },
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
