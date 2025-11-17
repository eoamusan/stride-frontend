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

export default function LedgerViewCta({
  reportPeriod,
  onReportPeriodChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  accountType,
  onAccountTypeChange,
  accountingMethod,
  onAccountingMethodChange,
  onRunReport,
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

  const accountTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'assets', label: 'Assets' },
    { value: 'liabilities', label: 'Liabilities' },
    { value: 'equity', label: 'Equity' },
    { value: 'income', label: 'Income' },
    { value: 'expenses', label: 'Expenses' },
  ];

  const showDatePickers = reportPeriod === 'custom-dates';

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
            <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
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
            <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
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

        {/* Account Type */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">
            Account Type
          </label>
          <Select onValueChange={onAccountTypeChange} value={accountType}>
            <SelectTrigger className="h-10 w-48 bg-white">
              <SelectValue placeholder="select type" />
            </SelectTrigger>
            <SelectContent>
              {accountTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
