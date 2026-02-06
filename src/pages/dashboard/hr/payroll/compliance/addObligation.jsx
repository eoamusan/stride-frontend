import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { CustomButton, FormInput } from '@/components/customs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import CalendarIcon from '@/assets/icons/calendar-search.svg';

const obligationSchema = z.object({
  name: z.string().trim().min(1, { message: 'Obligation name is required' }),
  type: z.string().trim().min(1, { message: 'Obligation type is required' }),
  period: z.date({ required_error: 'Period is required' }),
  dueDate: z.date({ required_error: 'Due date is required' }),
  amount: z
    .string()
    .trim()
    .transform((val) => val.replace(/[^\d.]/g, ''))
    .refine((val) => val.length > 0, { message: 'Amount is required' })
    .transform((val) => Number(val))
    .refine((val) => !Number.isNaN(val) && val > 0, {
      message: 'Enter a valid amount',
    }),
});

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(value);

const defaultValues = {
  name: '',
  type: '',
  period: null,
  dueDate: null,
  amount: '',
};

const inferStatusFromDueDate = (date) => {
  if (!date) return 'Upcoming';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 'Upcoming';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  parsed.setHours(0, 0, 0, 0);
  return parsed < today ? 'Overdue' : 'Upcoming';
};

const toTitle = (value) => {
  if (!value) return '';
  return value.trim().slice(0, 1).toUpperCase() + value.trim().slice(1);
};

export default function AddObligationForm({ open, onOpenChange, onSave }) {
  const form = useForm({
    resolver: zodResolver(obligationSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) form.reset(defaultValues);
  }, [open, form]);

  const onSubmit = (values) => {
    const status = inferStatusFromDueDate(values.dueDate);
    const amountDisplay = formatCurrency(values.amount);

    const formattedPeriod = values.period ? format(values.period, 'MM-yy') : '';
    const formattedDueDate = values.dueDate
      ? format(values.dueDate, 'dd-MM-yy')
      : '';

    const newRow = {
      obligation: values.name.trim(),
      type: toTitle(values.type),
      dueDate: formattedDueDate,
      period: formattedPeriod,
      amount: amountDisplay,
      status,
    };

    onSave?.(newRow);
    onOpenChange?.(false);
    form.reset(defaultValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormInput
          control={form.control}
          name="name"
          label="Obligation Name"
          placeholder="e.g. PAYE Tax Filing"
        />

        <FormInput
          control={form.control}
          name="type"
          label="Obligation Type"
          placeholder="e.g. Tax"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="period"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Period</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={`flex h-12 w-full items-center justify-between rounded-xl px-4 text-left text-sm ${
                          !field.value ? 'text-muted-foreground' : ''
                        }`}
                      >
                        {field.value ? format(field.value, 'MM-yy') : 'mm-yy'}
                        <img src={CalendarIcon} alt="Calendar" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => field.onChange(date)}
                      captionLayout="dropdown"
                      fromYear={2000}
                      toYear={2100}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={`flex h-12 w-full items-center justify-between rounded-xl px-4 text-left text-sm ${
                          !field.value ? 'text-muted-foreground' : ''
                        }`}
                      >
                        {field.value
                          ? format(field.value, 'dd-MM-yy')
                          : 'dd-mm-yy'}
                        <img src={CalendarIcon} alt="Calendar" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => field.onChange(date)}
                      captionLayout="dropdown"
                      fromYear={2000}
                      toYear={2100}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormInput
          control={form.control}
          name="amount"
          label="Amount"
          placeholder="e.g. #4,000"
          type="text"
        />

        <div className="flex items-center justify-end gap-3 pt-2">
          <CustomButton
            type="button"
            variant="outline"
            onClick={() => onOpenChange?.(false)}
            // className="h-12 rounded-2xl border-[#254C00] px-6 text-[#254C00] hover:bg-[#254C00]/10"
          >
            Back
          </CustomButton>

          <CustomButton
            type="submit"
            // className="h-12 rounded-2xl bg-[#3F00A8] px-6 text-white hover:bg-[#2f0080]"
          >
            Add Component
          </CustomButton>
        </div>
      </form>
    </Form>
  );
}
