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
import { CalendarIcon, DownloadIcon, FilterIcon } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect } from 'react';

// Helper function to get date range based on period
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
    default:
      return { fromDate: undefined, toDate: undefined };
  }
};

export default function TrialBalanceCta({
  reportPeriod,
  onReportPeriodChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  accountingMethod,
  onAccountingMethodChange,
  onRunReport,
  onFilter,
  onDownloadFormats,
}) {
  const reportPeriodOptions = [
    { value: 'empty', label: 'Select Date' },
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

  const showDatePickers = reportPeriod === 'custom-dates';

  // Update date ranges based on selected report period
  useEffect(() => {
    if (
      reportPeriod &&
      reportPeriod !== 'custom-dates' &&
      reportPeriod !== 'empty'
    ) {
      const { fromDate, toDate } = getDateRangeForPeriod(reportPeriod);
      if (onFromDateChange && fromDate) {
        onFromDateChange(fromDate);
      }
      if (onToDateChange && toDate) {
        onToDateChange(toDate);
      }
    } else if (reportPeriod === 'empty') {
      // Clear date fields when empty is selected
      if (onFromDateChange) {
        onFromDateChange(null);
      }
      if (onToDateChange) {
        onToDateChange(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportPeriod]);

  return (
    <div className="space-y-4 px-1">
      {/* Top Row - Selectors and Button */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Report Period */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Report Period</label>
          <Select onValueChange={onReportPeriodChange} value={reportPeriod}>
            <SelectTrigger className="h-10 w-48 bg-white">
              <SelectValue placeholder="Select Date" />
            </SelectTrigger>
            <SelectContent>
              {reportPeriodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* From Date */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">From</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'h-10 w-48 justify-start bg-white text-left text-sm font-normal',
                  !fromDate && 'text-muted-foreground',
                  !showDatePickers && 'cursor-not-allowed opacity-50'
                )}
                disabled={!showDatePickers}
              >
                {fromDate ? format(fromDate, 'PPP') : 'Pick date'}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={fromDate}
                onSelect={onFromDateChange}
                disabled={(date) =>
                  date > new Date() || date < new Date('1900-01-01')
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* To Date */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">To</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'h-10 w-48 justify-start bg-white text-left text-sm font-normal',
                  !toDate && 'text-muted-foreground',
                  !showDatePickers && 'cursor-not-allowed opacity-50'
                )}
                disabled={!showDatePickers}
              >
                {toDate ? format(toDate, 'PPP') : 'Pick date'}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={toDate}
                onSelect={onToDateChange}
                disabled={(date) =>
                  date > new Date() || date < new Date('1900-01-01')
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={onFilter}
          className="mt-6 h-10 w-10"
        >
          <FilterIcon className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size={'icon'}
              className={'mt-6 size-10'}
              variant={'outline'}
            >
              <DownloadIcon size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-11 min-w-24 text-xs" align="end">
            <DropdownMenuCheckboxItem
              onCheckedChange={(checked) => onDownloadFormats('pdf', checked)}
            >
              Pdf
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              onCheckedChange={(checked) => onDownloadFormats('excel', checked)}
            >
              Excel
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              onCheckedChange={(checked) => onDownloadFormats('csv', checked)}
            >
              csv**
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Run Report Button */}
        <div className="pt-6">
          <Button onClick={onRunReport} className="h-10 text-sm">
            Run report
          </Button>
        </div>
      </div>

      {/* Bottom Row - Accounting Method */}
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Accounting method</span>
        <RadioGroup
          value={accountingMethod}
          onValueChange={onAccountingMethodChange}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cash" id="cash" />
            <Label htmlFor="cash" className="text-sm font-medium">
              Cash
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="accrual" id="accrual" />
            <Label htmlFor="accrual" className="text-sm font-medium">
              Accrual
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
