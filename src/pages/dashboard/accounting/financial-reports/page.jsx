import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import FinancialReportService from '@/api/financialReport';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import {
  CalendarIcon,
  MailIcon,
  PrinterIcon,
  DownloadIcon,
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
import youtubeIcon from '@/assets/icons/youtube-red.png';
import CompanyOverview from '@/components/dashboard/accounting/financial-reports/company-overview';
import SalesByCustomer from '@/components/dashboard/accounting/financial-reports/sales-by-customer';
import ExpensesByVendor from '@/components/dashboard/accounting/financial-reports/expenses-by-vendor';
import ArApSummary from '@/components/dashboard/accounting/financial-reports/ar-ap-summary';
import GeneralLedger from '@/components/dashboard/accounting/financial-reports/general-ledger';
import InventorySummary from '@/components/dashboard/accounting/financial-reports/inventory-summary';
import FixedAsset from '@/components/dashboard/accounting/financial-reports/fixed-asset';
import Reconciliation from '@/components/dashboard/accounting/financial-reports/reconciliation';

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

export default function FinancialReports() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentReport = searchParams.get('type') || 'company-overview';
  const [reportPeriod, setReportPeriod] = useState('empty');
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();

  // Set default report type in URL if not present
  useEffect(() => {
    if (!searchParams.get('type')) {
      setSearchParams({ type: 'company-overview' }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Update date ranges based on selected report period
  useEffect(() => {
    if (
      reportPeriod &&
      reportPeriod !== 'custom-dates' &&
      reportPeriod !== 'empty'
    ) {
      const { fromDate: newFromDate, toDate: newToDate } =
        getDateRangeForPeriod(reportPeriod);
      if (newFromDate) {
        setFromDate(newFromDate);
      }
      if (newToDate) {
        setToDate(newToDate);
      }
    } else if (reportPeriod === 'empty') {
      // Clear date fields when empty is selected
      setFromDate(null);
      setToDate(null);
    }
  }, [reportPeriod]);

  // Fetch financial reports data
  useEffect(() => {
    const fetchFinancialReports = async () => {
      try {
        if (!fromDate || !toDate) return;
        const params = {};
        if (fromDate) {
          params.startDate = fromDate.toISOString();
        }
        if (toDate) {
          params.endDate = toDate.toISOString();
        }

        const response = await FinancialReportService.fetch(params);
        console.log('Financial Reports Response:', response);
      } catch (error) {
        console.error('Error fetching financial reports:', error);
      }
    };

    fetchFinancialReports();
  }, [fromDate, toDate]);

  const handleReportChange = (value) => {
    setSearchParams({ type: value });
  };

  return (
    <div className="my-4 min-h-screen pl-1">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Fiancial Reports</h1>
          <p className="text-sm text-[#7D7D7D]">
            View and analyze your financial data
          </p>
        </hgroup>

        <div>
          <Button variant={'outline'} className={'h-10 rounded-lg text-sm'}>
            <img src={youtubeIcon} alt="YouTube Icon" className="mr-1 h-4" />
            See video guide
          </Button>
        </div>
      </div>

      <div className="mt-10 ml-1">
        <Select onValueChange={handleReportChange} value={currentReport}>
          <SelectTrigger className="w-full max-w-sm bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="company-overview">Company Overview</SelectItem>
            <SelectItem value="sales-by-customer">
              Sales by customer summary
            </SelectItem>
            <SelectItem value="expenses-by-vendor">
              Expenses by vendor summary
            </SelectItem>
            <SelectItem value="ar-ap-summary">A/R & A/P summary</SelectItem>
            <SelectItem value="general-ledger">General ledger</SelectItem>
            <SelectItem value="inventory-summary">Inventory summary</SelectItem>
            <SelectItem value="fixed-asset">Fixed asset report</SelectItem>
            <SelectItem value="reconciliation">
              Reconciliation report
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
        <div className="flex flex-wrap items-end gap-6">
          {/* Report Period Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Report Period</label>
            <Select value={reportPeriod} onValueChange={setReportPeriod}>
              <SelectTrigger className="h-10 min-w-[170px] bg-white">
                <SelectValue placeholder="Select Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="empty">Select Date</SelectItem>
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

          {/* From Date */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">From</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'h-10 min-w-[220px] justify-start text-left text-sm font-normal',
                    !fromDate && 'text-muted-foreground',
                    reportPeriod !== 'custom-dates' &&
                      'cursor-not-allowed opacity-50'
                  )}
                  disabled={reportPeriod !== 'custom-dates'}
                >
                  {fromDate ? format(fromDate, 'PPP') : <span>Date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={setFromDate}
                  disabled={(date) =>
                    date > new Date() || date < new Date('1900-01-01')
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* To Date */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">To</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'h-10 min-w-[220px] justify-start text-left text-sm font-normal',
                    !toDate && 'text-muted-foreground',
                    reportPeriod !== 'custom-dates' &&
                      'cursor-not-allowed opacity-50'
                  )}
                  disabled={reportPeriod !== 'custom-dates'}
                >
                  {toDate ? format(toDate, 'PPP') : <span>Date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={setToDate}
                  disabled={(date) =>
                    date > new Date() || date < new Date('1900-01-01')
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button size="icon" variant="ghost">
            <MailIcon className="size-4" />
          </Button>
          <Button size="icon" variant="ghost">
            <PrinterIcon className="size-4" />
          </Button>
          <Button size="icon" variant="ghost">
            <DownloadIcon className="size-4" />
          </Button>
        </div>
      </div>

      <div className="mt-10 mb-24">
        {currentReport === 'company-overview' && <CompanyOverview />}
        {currentReport === 'sales-by-customer' && <SalesByCustomer />}
        {currentReport === 'expenses-by-vendor' && <ExpensesByVendor />}
        {currentReport === 'ar-ap-summary' && <ArApSummary />}
        {currentReport === 'general-ledger' && <GeneralLedger />}
        {currentReport === 'inventory-summary' && <InventorySummary />}
        {currentReport === 'fixed-asset' && <FixedAsset />}
        {currentReport === 'reconciliation' && <Reconciliation />}
      </div>
    </div>
  );
}
