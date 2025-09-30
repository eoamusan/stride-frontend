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
import { format } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import AgingReport from '@/components/dashboard/accounting/accounts-payable/reports/aging-report';
import VendorPerformance from '@/components/dashboard/accounting/accounts-payable/reports/vendor-performance';
import CashflowAnalysis from '@/components/dashboard/accounting/accounts-payable/reports/cashflow-analysis';
import CategoryBreakdown from '@/components/dashboard/accounting/accounts-payable/reports/category-breakdown';

export default function Reports() {
  const [dateFilter, setDateFilter] = useState();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentReport = searchParams.get('type') || 'aging-report';

  // Set default report type in URL if not present
  useEffect(() => {
    if (!searchParams.get('type')) {
      setSearchParams({ type: 'aging-report' }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleReportChange = (value) => {
    setSearchParams({ type: value });
  };

  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-sm text-[#7D7D7D]">All reports and analysis</p>
        </hgroup>

        <div className="flex items-center space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`h-10 rounded-2xl pl-3 text-left font-normal`}
              >
                {dateFilter ? (
                  format(dateFilter, 'PPP')
                ) : (
                  <span>Select date</span>
                )}
                <ChevronDownIcon className="ml-auto h-4 w-4 opacity-90" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full min-w-80 p-0" align="start">
              <Calendar
                className={'w-full'}
                mode="single"
                defaultMonth={dateFilter}
                numberOfMonths={2}
                selected={dateFilter}
                onSelect={setDateFilter}
              />
            </PopoverContent>
          </Popover>
          <Button className={'h-10 min-w-[104px] rounded-2xl text-sm'}>
            Export
          </Button>
        </div>
      </div>

      <div className="mt-10 ml-1">
        <Select onValueChange={handleReportChange} value={currentReport}>
          <SelectTrigger className="w-full max-w-sm bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="aging-report">AP Aging Report</SelectItem>
            <SelectItem value="vendor-performance">
              Vendor Performance
            </SelectItem>
            <SelectItem value="cashflow-analysis">Cashflow Analysis</SelectItem>
            <SelectItem value="category-breakdown">
              Category Breakdown
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-10">
        {currentReport === 'aging-report' && <AgingReport />}
        {currentReport === 'vendor-performance' && <VendorPerformance />}
        {currentReport === 'cashflow-analysis' && <CashflowAnalysis />}
        {currentReport === 'category-breakdown' && <CategoryBreakdown />}
      </div>
    </div>
  );
}
