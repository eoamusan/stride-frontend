
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useEffect } from 'react';
import {
  CalendarIcon,
} from 'lucide-react';
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

export default function PeriodSelector({ onPeriodChange, value, onChange }) {
  const [datePeriod, setDatePeriod] = useState(value?.datePeriod || 'today');
  const [date, setDate] = useState({from: value?.from, to: value?.to});

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

  useEffect(() => {
      if (
        datePeriod &&
        datePeriod !== 'custom-dates' &&
        datePeriod !== 'empty'
      ) {
        const { fromDate: newFromDate, toDate: newToDate } =
          getDateRangeForPeriod(datePeriod);
        if (newFromDate) {
          setDate({ from: newFromDate, to: newToDate });
        }
      } else if (datePeriod === 'empty') {
        // Clear date fields when empty is selected
        setDate({ from: undefined, to: undefined});
      }
  }, [datePeriod, onPeriodChange]);


  useEffect(() => {
    onChange?.({ datePeriod, from: date.from, to: date.to })
  }, [datePeriod, date, onChange])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 w-full gap-2">
      {/* Report Period Selector */}
      <div className="flex items-end max-[50px] gap-2 w-full">
        <Select value={datePeriod} onValueChange={setDatePeriod}>
          <SelectTrigger className="h-10 bg-white w-full">
            <SelectValue placeholder="Select Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="custom-dates">Custom dates</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this-week">This week</SelectItem>
            <SelectItem value="last-week">Last week</SelectItem>
            <SelectItem value="this-month">This month</SelectItem>
            <SelectItem value="last-month">Last month</SelectItem>
            <SelectItem value="this-quarter">This quarter</SelectItem>
            <SelectItem value="last-quarter">Last quarter</SelectItem>
            <SelectItem value="this-year">This year</SelectItem>
            <SelectItem value="last-year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='grid grid-cols-1 gap-2 w-full col-span-2'>
        <div className="flex flex-col w-full">
          {/* <label className="text-sm font-medium">Range</label> */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'h-10 w-full justify-start text-left text-sm font-normal',
                  !date?.from && 'text-muted-foreground',
                  !date?.to && 'text-muted-foreground',
                  datePeriod !== 'custom-dates' &&
                    'cursor-not-allowed opacity-50'
                )}
                disabled={datePeriod !== 'custom-dates'}
              >
                <CalendarIcon className="h-4 w-4 opacity-50" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={date}
                onSelect={setDate}
                disabled={(date) =>
                  date > new Date() || date < new Date('1900-01-01')
                }
                nuberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}