import { useState, useEffect } from 'react';
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
import { ChevronDownIcon, DownloadIcon, SettingsIcon } from 'lucide-react';
import { useSearchParams } from 'react-router';
import InventoryReport from '@/components/dashboard/accounting/inventory/reports/inventory';
import LowStockReport from '@/components/dashboard/accounting/inventory/reports/low-stock';
import SalesReport from '@/components/dashboard/accounting/inventory/reports/sales';
import ExpireReport from '@/components/dashboard/accounting/inventory/reports/expire';
import SuppliersReport from '@/components/dashboard/accounting/inventory/reports/suppliers';

export default function Reports() {
  const [dateFilter, setDateFilter] = useState();

  const [searchParams, setSearchParams] = useSearchParams();
  const currentReport = searchParams.get('type') || 'inventory';

  // Set default report type in URL if not present
  useEffect(() => {
    if (!searchParams.get('type')) {
      setSearchParams({ type: 'inventory' }, { replace: true });
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
          <p className="text-sm text-[#7D7D7D]">
            Comprehensive business insights and inventory analytics
          </p>
        </hgroup>

        <div className="flex space-x-4">
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
          <Button size={'icon'} className={'size-10'} variant={'outline'}>
            <DownloadIcon size={16} />
          </Button>

          <Button size={'icon'} className={'size-10'} variant={'outline'}>
            <SettingsIcon size={16} />
          </Button>
        </div>
      </div>

      <div className="mt-10 ml-1">
        <Select onValueChange={handleReportChange} value={currentReport}>
          <SelectTrigger className="w-full max-w-sm bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="inventory">Inventory Report</SelectItem>
            <SelectItem value="low-stock">Low Stock Report</SelectItem>
            <SelectItem value="sales">Sales Report</SelectItem>
            <SelectItem value="expire-and-damage">Expire and Damage</SelectItem>
            <SelectItem value="suppliers">Suppliers Report</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-10">
        {currentReport === 'inventory' && <InventoryReport />}
        {currentReport === 'low-stock' && <LowStockReport />}
        {currentReport === 'sales' && <SalesReport />}
        {currentReport === 'expire-and-damage' && <ExpireReport />}
        {currentReport === 'suppliers' && <SuppliersReport />}
      </div>
    </div>
  );
}
