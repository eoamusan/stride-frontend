import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { format, parse } from 'date-fns';
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

const defaultValues = {
  name: '',
  type: '',
  period: null,
  dueDate: null,
  amount: '',
};

const periodFormats = ['MMMM yyyy', 'MMM yyyy', 'MM-yyyy', 'MM-yy', 'yyyy-MM'];

const parsePeriodToDate = (value) => {
  if (!value) return null;

  for (const formatString of periodFormats) {
    const parsed = parse(value, formatString, new Date());
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  const fallback = new Date(value);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
};

const normalizeAmountInput = (value) => {
  if (value === undefined || value === null) return '';
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'string') return value.replace(/[^\d.]/g, '');
  return '';
};

export default function AddObligationForm({
  open,
  onOpenChange,
  onSubmit,
  mode = 'create',
  initialData = null,
  isSubmitting = false,
}) {
  const form = useForm({
    resolver: zodResolver(obligationSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) {
      form.reset(defaultValues);
      return;
    }

    if (initialData) {
      form.reset({
        name: initialData.obligationName ?? initialData.name ?? '',
        type: initialData.obligationType ?? initialData.type ?? '',
        period: parsePeriodToDate(initialData.period) ?? null,
        dueDate: initialData.dueDate ? new Date(initialData.dueDate) : null,
        amount: normalizeAmountInput(initialData.amount),
      });
    } else {
      form.reset(defaultValues);
    }
  }, [open, form, initialData]);

  const handleSubmit = async (values) => {
    await onSubmit?.(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
            disabled={isSubmitting}
          >
            Back
          </CustomButton>

          <CustomButton type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Saving...'
              : mode === 'edit'
                ? 'Update Obligation'
                : 'Add Obligation'}
          </CustomButton>
        </div>
      </form>
    </Form>
  );
}
