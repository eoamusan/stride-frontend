
import { Button } from '@/components/ui/button';
import { DownloadIcon, SettingsIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from 'react';
import BusinessTaxOverview from '@/components/dashboard/accounting/tax-management/business-tax/overview';
import TaxSummary from '@/components/dashboard/accounting/tax-management/business-tax/tax-summary';
import { useSearchParams } from 'react-router';



export default function BusinessTax() {
  const [selectedValue, setSelectedValue] = useState();
  const [searchParams, setSearchParams] = useSearchParams()

  const handleOnChange = (value) => {
    setSelectedValue(value);
  }

  const VALID_TYPES = ["overview", "tax-summary"];

  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam && VALID_TYPES.includes(typeParam)) {
      setSelectedValue(typeParam);
    } else {
      // Default to 'overview' if invalid or missing
      setSelectedValue("overview");
      setSearchParams(prev => {
        const params = new URLSearchParams(prev);
        params.set("type", "overview");
        return params;
      });
    }
  }, []);

  useEffect(() => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      params.set("type", selectedValue);
      return params;
    });
  }, [selectedValue, setSearchParams]);

  return (
    <div className='my-4 min-h-screen'>
      <div>
        <div className="flex flex-wrap justify-between gap-6">
          <hgroup>
            <h1 className="text-2xl font-bold">Business Tax (VAT)</h1>
            <p className="text-sm text-[#7D7D7D]">
              Comprehensive view of all business tax obligations
            </p>
          </hgroup>

          <div className="flex space-x-4">
            <Button size={'icon'} className={'size-10'} variant={'outline'}>
              <DownloadIcon size={16} />
            </Button>
            <Button size={'icon'} className={'size-10'} variant={'outline'}>
              <SettingsIcon size={16} />
            </Button>
          </div>
        </div>

         <div className='flex mt-4'>
          <div className='w-2/5'>
            <Select onValueChange={handleOnChange} value={selectedValue}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select Business Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="tax-summary">Tax Summary</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-5">
          {selectedValue === 'overview' && (
            // Business Tax Overview Component
            <BusinessTaxOverview />
          )}
          {selectedValue === 'tax-summary' && (
            // Tax Summary Component
            <TaxSummary />
          )}
        </div>
      </div>
    </div>
  );
}
