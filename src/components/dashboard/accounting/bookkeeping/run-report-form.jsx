import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  reportPeriod: z.string().min(1, { message: 'Report period is required' }),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
  accountingMethod: z.enum(['cash', 'accrual'], {
    required_error: 'Please select an accounting method',
  }),
});

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

export default function RunReportForm({ isOpen = false, onClose, onSubmit }) {
  const [showDateRanges, setShowDateRanges] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reportPeriod: '',
      fromDate: undefined,
      toDate: undefined,
      accountingMethod: 'cash',
    },
  });

  const watchReportPeriod = form.watch('reportPeriod');

  // Show date range inputs when custom dates is selected
  useEffect(() => {
    setShowDateRanges(watchReportPeriod === 'custom-dates');

    // Clear date fields when not using custom dates
    if (watchReportPeriod !== 'custom-dates') {
      form.setValue('fromDate', undefined);
      form.setValue('toDate', undefined);
    }
  }, [watchReportPeriod, form]);

  const handleSubmit = (data) => {
    console.log('Run report with data:', data);
    if (onSubmit) {
      onSubmit(data);
    }
    // Reset form after submission
    form.reset();
  };

  const handleCancel = () => {
    form.reset();
    if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-6">
              {/* Report Period Section */}
              <div className="grid items-start gap-4 sm:grid-cols-3">
                {/* Report Period Dropdown */}
                <FormField
                  control={form.control}
                  name="reportPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report Period</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-10 w-full">
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
                      <FormLabel>From</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'h-10 w-full pl-3 text-left text-sm font-normal',
                                !field.value && 'text-muted-foreground',
                                !showDateRanges &&
                                  'cursor-not-allowed opacity-50'
                              )}
                              disabled={!showDateRanges}
                            >
                              {field.value ? (
                                format(field.value, 'PP')
                              ) : (
                                <span>Date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
                      <FormLabel>To</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'h-10 w-full pl-3 text-left text-sm font-normal',
                                !field.value && 'text-muted-foreground',
                                !showDateRanges &&
                                  'cursor-not-allowed opacity-50'
                              )}
                              disabled={!showDateRanges}
                            >
                              {field.value ? (
                                format(field.value, 'PP')
                              ) : (
                                <span>Date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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

              {/* Accounting Method */}
              <div className="flex flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="accountingMethod"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col items-end justify-center gap-1.5">
                        <FormLabel className="pr-7 text-sm font-medium">
                          Accounting method
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex gap-8"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="cash" id="cash" />
                              <Label
                                htmlFor="cash"
                                className="text-sm font-medium"
                              >
                                Cash
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="accrual" id="accrual" />
                              <Label
                                htmlFor="accrual"
                                className="text-sm font-medium"
                              >
                                Accrual
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Run Report Button */}
              <div className="flex items-end justify-end">
                <Button type="submit" className="w-full max-w-[176px] text-sm">
                  Run report
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
