import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import StrideLogo from '@/assets/icons/stride.svg';
import { ArrowLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

const formSchema = z.object({
  goal: z.string().nonempty({
    message: 'Goal is required',
  }),
});

export default function Goals({ setBack, setFormData, formData }) {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goal: formData.goal || '',
    },
  });

  const onSubmit = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    navigate('/dashboard');
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
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What do you want to do with Stride</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your goal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="manage-finances">
                          Manage Business Finances
                        </SelectItem>
                        <SelectItem value="track-expenses">
                          Track Expenses
                        </SelectItem>
                        <SelectItem value="generate-reports">
                          Generate Financial Reports
                        </SelectItem>
                        <SelectItem value="manage-inventory">
                          Manage Inventory
                        </SelectItem>
                        <SelectItem value="handle-invoicing">
                          Handle Invoicing & Billing
                        </SelectItem>
                        <SelectItem value="track-sales">
                          Track Sales Performance
                        </SelectItem>
                        <SelectItem value="manage-customers">
                          Manage Customer Relationships
                        </SelectItem>
                        <SelectItem value="payroll-management">
                          Payroll Management
                        </SelectItem>
                        <SelectItem value="tax-compliance">
                          Tax Compliance & Filing
                        </SelectItem>
                        <SelectItem value="business-analytics">
                          Business Analytics & Insights
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" size={'lg'} className="h-10">
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
