import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CustomButton, FormSelect } from '@/components/customs';

import CalendarIcon from '@/assets/icons/calendar.svg';

const schema = z.object({
  month: z.string().min(1, 'Month is required'),
  year: z.string().min(1, 'Year is required'),
  payrollType: z.string().min(1, 'Payroll type is required'),
  payDate: z.date({ required_error: 'Pay date is required' }),
});

export default function PeriodAndType({
  defaultValues = null,
  onBack,
  onNext,
}) {
  const currentYear = new Date().getFullYear();

  // Map years and months to standard { value, label } objects
  const yearOptions = useMemo(() => {
    const y = [];
    for (let i = currentYear - 2; i <= currentYear + 2; i++) {
      y.push({ value: String(i), label: String(i) });
    }
    return y;
  }, [currentYear]);

  const monthOptions = useMemo(
    () => [
      { value: '01', label: 'January' },
      { value: '02', label: 'February' },
      { value: '03', label: 'March' },
      { value: '04', label: 'April' },
      { value: '05', label: 'May' },
      { value: '06', label: 'June' },
      { value: '07', label: 'July' },
      { value: '08', label: 'August' },
      { value: '09', label: 'September' },
      { value: '10', label: 'October' },
      { value: '11', label: 'November' },
      { value: '12', label: 'December' },
    ],
    []
  );

  const payrollOptions = [
    { value: 'Regular Monthly Payroll', label: 'Regular Monthly Payroll' },
    { value: 'Performance Bonus', label: 'Performance Bonus' },
    { value: 'Others', label: 'Others' },
  ];

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {
      month: String(new Date().getMonth() + 1).padStart(2, '0'),
      year: String(currentYear),
      payrollType: 'Regular Monthly Payroll',
      payDate: new Date(),
    },
  });

  const { handleSubmit, control } = form;

  const handleFormSubmit = (values) => {
    if (typeof onNext === 'function') {
      onNext(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <FormSelect
            control={control}
            name="month"
            label="Month"
            placeholder="Select month"
            options={monthOptions}
          />

          <FormSelect
            control={control}
            name="year"
            label="Year"
            placeholder="Select year"
            options={yearOptions}
          />
        </div>

        <FormSelect
          control={control}
          name="payrollType"
          label="Payroll Type"
          placeholder="Select payroll type"
          options={payrollOptions}
        />

        {/* Keeping Calendar as is since it's a unique UI pattern */}
        <FormField
          control={control}
          name="payDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Pay Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={`flex h-10 w-full justify-between rounded-xl text-left text-sm font-normal ${!field.value ? 'text-muted-foreground' : ''}`}
                    >
                      {field.value ? format(field.value, 'PPP') : 'Choose date'}
                      <img src={CalendarIcon} alt="calendar-icon" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <hr />

        <div className="flex items-center justify-between">
          <CustomButton
            type="button"
            variant="outline"
            onClick={() => onBack?.()}
          >
            Back
          </CustomButton>

          <CustomButton type="submit">Next Step</CustomButton>
        </div>
      </form>
    </Form>
  );
}
