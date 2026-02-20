import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  subWeeks,
  subMonths,
  subQuarters,
  subYears,
} from 'date-fns';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  filterReport: z.string().min(1, { message: 'Filter report is required' }),
  reportPeriod: z.string().min(1, { message: 'Report period is required' }),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
});

// Helper function to get date range based on period
// Creates dates that represent local time but will be sent as UTC to match GMT+1
const getDateRangeForPeriod = (period) => {
  const today = new Date();

  // Helper to create a date that preserves local time when converted to ISO
  const createUTCDate = (localDate) => {
    return new Date(
      Date.UTC(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate(),
        localDate.getHours(),
        localDate.getMinutes(),
        localDate.getSeconds(),
        localDate.getMilliseconds()
      )
    );
  };

  switch (period) {
    case 'today':
      return {
        fromDate: createUTCDate(startOfDay(today)),
        toDate: createUTCDate(endOfDay(today)),
      };
    case 'this-week':
      return {
        fromDate: createUTCDate(startOfWeek(today, { weekStartsOn: 1 })),
        toDate: createUTCDate(endOfDay(endOfWeek(today, { weekStartsOn: 1 }))),
      };
    case 'last-week': {
      const lastWeek = subWeeks(today, 1);
      return {
        fromDate: createUTCDate(startOfWeek(lastWeek, { weekStartsOn: 1 })),
        toDate: createUTCDate(
          endOfDay(endOfWeek(lastWeek, { weekStartsOn: 1 }))
        ),
      };
    }
    case 'this-month':
      return {
        fromDate: createUTCDate(startOfMonth(today)),
        toDate: createUTCDate(endOfDay(endOfMonth(today))),
      };
    case 'last-month': {
      const lastMonth = subMonths(today, 1);
      return {
        fromDate: createUTCDate(startOfMonth(lastMonth)),
        toDate: createUTCDate(endOfDay(endOfMonth(lastMonth))),
      };
    }
    case 'this-quarter':
      return {
        fromDate: createUTCDate(startOfQuarter(today)),
        toDate: createUTCDate(endOfDay(endOfQuarter(today))),
      };
    case 'last-quarter': {
      const lastQuarter = subQuarters(today, 1);
      return {
        fromDate: createUTCDate(startOfQuarter(lastQuarter)),
        toDate: createUTCDate(endOfDay(endOfQuarter(lastQuarter))),
      };
    }
    case 'this-year':
      return {
        fromDate: createUTCDate(startOfYear(today)),
        toDate: createUTCDate(endOfDay(endOfYear(today))),
      };
    case 'last-year': {
      const lastYear = subYears(today, 1);
      return {
        fromDate: createUTCDate(startOfYear(lastYear)),
        toDate: createUTCDate(endOfDay(endOfYear(lastYear))),
      };
    }
    case 'all-date':
    default:
      return { fromDate: undefined, toDate: undefined };
  }
};

const reportPeriodOptions = [
  { value: 'all-date', label: 'All Date' },
  { value: 'custom-dates', label: 'Custom dates' },
  { value: 'today', label: 'Today' },
  { value: 'this-week', label: 'This week' },
  { value: 'last-week', label: 'Last week' },
  { value: 'this-month', label: 'This month' },
  { value: 'last-month', label: 'Last month' },
  { value: 'this-quarter', label: 'This quarter' },
  { value: 'last-quarter', label: 'Last quarter' },
  { value: 'this-year', label: 'This year' },
  { value: 'last-year', label: 'Last year' },
];

const filterReportOptions = [
  { value: 'ALL', label: 'All Invoices' },
  { value: 'PAID', label: 'Paid Invoices' },
  { value: 'PENDING', label: 'Unpaid Invoice' },
];

export default function RunReportDialog({ isOpen = false, onClose, onSubmit }) {
  const [showDateRanges, setShowDateRanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      filterReport: 'ALL',
      reportPeriod: 'all-date',
      fromDate: undefined,
      toDate: undefined,
    },
  });

  const watchReportPeriod = form.watch('reportPeriod');

  // Show date range inputs when custom dates is selected
  useEffect(() => {
    setShowDateRanges(watchReportPeriod === 'custom-dates');

    // Set date ranges based on selected period
    if (
      watchReportPeriod &&
      watchReportPeriod !== 'custom-dates' &&
      watchReportPeriod !== 'all-date'
    ) {
      const { fromDate, toDate } = getDateRangeForPeriod(watchReportPeriod);
      form.setValue('fromDate', fromDate);
      form.setValue('toDate', toDate);
    } else if (
      watchReportPeriod === 'custom-dates' ||
      watchReportPeriod === 'all-date'
    ) {
      // Clear date fields for all-date or keep them for custom-dates
      if (watchReportPeriod === 'all-date') {
        form.setValue('fromDate', undefined);
        form.setValue('toDate', undefined);
      }
    }
  }, [watchReportPeriod, form]);

  const handleSubmit = async (data) => {
    console.log('Run report with data:', data);

    // Set loading state
    setIsSubmitting(true);

    // Ensure toDate is set to end of day (23:59:59) if provided
    if (data.toDate) {
      data.toDate = endOfDay(data.toDate);
    }

    if (onSubmit) {
      await onSubmit(data);
    }

    // Small delay to ensure navigation happens before dialog closes
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    // Reset states
    setIsSubmitting(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && onClose(open)}>
      <DialogContent className="sm:max-w-3xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-4 gap-4 py-4">
              {/* Filter Report */}
              <FormField
                control={form.control}
                name="filterReport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Filter Report
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="All Invoices" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filterReportOptions.map((option) => (
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

              {/* Report Period */}
              <FormField
                control={form.control}
                name="reportPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Report Period
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Date" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {reportPeriodOptions.map((option) => (
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

              {/* From Date */}
              <FormField
                control={form.control}
                name="fromDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      From
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full h-10 justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground',
                              !showDateRanges && 'cursor-not-allowed opacity-50'
                            )}
                            disabled={!showDateRanges}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, 'MMM d, yyyy')
                            ) : (
                              <span className="text-gray-500">Date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* To Date */}
              <FormField
                control={form.control}
                name="toDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      To
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full h-10 justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground',
                              !showDateRanges && 'cursor-not-allowed opacity-50'
                            )}
                            disabled={!showDateRanges}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, 'MMM d, yyyy')
                            ) : (
                              <span className="text-gray-500">Date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="sm:justify-end">
              <Button
                type="submit"
                className="rounded-lg h-10 px-8"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Loading...' : 'Run report'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
