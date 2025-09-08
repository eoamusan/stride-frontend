import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
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
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  templateName: z.string().min(1, { message: 'Template name is required' }),
  type: z.enum(['scheduled', 'create'], {
    required_error: 'Please select a type',
  }),
  createDaysInAdvance: z.number().optional(),
  interval: z.string().min(1, { message: 'Interval is required' }),
  onDay: z.string().min(1, { message: 'Day is required' }),
  onDate: z.string().min(1, { message: 'Date is required' }),
  everyNumber: z.string().min(1, { message: 'Number is required' }),
  everyPeriod: z.string().min(1, { message: 'Period is required' }),
  startDate: z.date({ required_error: 'Start date is required' }),
  endDate: z.string().min(1, { message: 'End option is required' }),
  currency: z.string().min(1, { message: 'Currency is required' }),
});

export default function RecurringTemplateForm({
  open,
  onOpenChange,
  onSubmit,
}) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      templateName: '',
      type: 'scheduled',
      createDaysInAdvance: 0,
      interval: 'monthly',
      onDay: 'day',
      onDate: '1st',
      everyNumber: '1st',
      everyPeriod: 'months',
      startDate: new Date(),
      endDate: 'none',
      currency: 'ngn',
    },
  });

  const handleSubmit = (data) => {
    console.log('Recurring template data:', data);
    if (onSubmit) {
      onSubmit(data);
    }
    onOpenChange(false);
  };

  const intervalOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'daily', label: 'Daily' },
    { value: 'yearly', label: 'Yearly' },
  ];

  const dayOptions = [
    { value: 'day', label: 'Day' },
    { value: 'weekday', label: 'Weekday' },
    { value: 'weekend', label: 'Weekend' },
  ];

  const dateOptions = [
    { value: '1st', label: '1st' },
    { value: '2nd', label: '2nd' },
    { value: '3rd', label: '3rd' },
    { value: '15th', label: '15th' },
    { value: 'last', label: 'Last' },
  ];

  const everyNumberOptions = [
    { value: '1st', label: '1st' },
    { value: '2nd', label: '2nd' },
    { value: '3rd', label: '3rd' },
    { value: '4th', label: '4th' },
  ];

  const everyPeriodOptions = [
    { value: 'months', label: 'Months' },
    { value: 'weeks', label: 'Weeks' },
    { value: 'days', label: 'Days' },
    { value: 'years', label: 'Years' },
  ];

  const endOptions = [
    { value: 'none', label: 'None' },
    { value: 'after', label: 'After' },
    { value: 'on', label: 'On' },
  ];

  const currencyOptions = [
    { value: 'ngn', label: 'NGN Nigeria Naira' },
    { value: 'usd', label: 'USD US Dollar' },
    { value: 'eur', label: 'EUR Euro' },
    { value: 'gbp', label: 'GBP British Pound' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[90%] max-w-2xl overflow-y-auto p-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Create Recurring Template
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Template Name */}
            <FormField
              control={form.control}
              name="templateName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Template Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter template name"
                      className="h-12 w-full rounded-lg border border-gray-300"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Type
                  </FormLabel>
                  <div className="flex items-center gap-4">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 w-48 rounded-lg border border-gray-300">
                          <SelectValue placeholder="Scheduled" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="create">Create</SelectItem>
                      </SelectContent>
                    </Select>

                    {field.value === 'create' && (
                      <>
                        <FormField
                          control={form.control}
                          name="createDaysInAdvance"
                          render={({ field: daysField }) => (
                            <FormItem className="flex items-center gap-2">
                              <FormControl>
                                <Input
                                  {...daysField}
                                  type="number"
                                  className="h-12 w-20 rounded-lg border border-gray-300 text-center"
                                  onChange={(e) =>
                                    daysField.onChange(parseInt(e.target.value))
                                  }
                                />
                              </FormControl>
                              <span className="text-sm text-gray-600">
                                days in advance
                              </span>
                            </FormItem>
                          )}
                        />
                      </>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Interval */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="interval"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Interval
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-lg border border-gray-300">
                            <SelectValue placeholder="Monthly" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {intervalOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-end justify-start">
                  <span className="text-sm font-medium text-gray-700">On</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <FormField
                  control={form.control}
                  name="onDay"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-lg border border-gray-300">
                            <SelectValue placeholder="Day" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {dayOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="onDate"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-lg border border-gray-300">
                            <SelectValue placeholder="1st" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {dateOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    Of every
                  </span>
                </div>

                <div></div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="everyNumber"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-lg border border-gray-300">
                            <SelectValue placeholder="1st" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {everyNumberOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="everyPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-lg border border-gray-300">
                            <SelectValue placeholder="Months" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {everyPeriodOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Start Date and End */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Start date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'h-12 w-full justify-start rounded-lg border border-gray-300 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value
                              ? format(field.value, 'PPP')
                              : 'Choose date'}
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

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      End
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-lg border border-gray-300">
                          <SelectValue placeholder="None" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {endOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Currency */}
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Currency
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 w-full rounded-lg border border-gray-300">
                        <SelectValue placeholder="NGN Nigeria Naira" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currencyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex justify-start gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-10"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
