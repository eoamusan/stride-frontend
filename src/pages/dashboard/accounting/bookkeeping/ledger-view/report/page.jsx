import {
  FilterIcon,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import youtubeIcon from '@/assets/icons/youtube-red.png';

export default function LedgerReportPage() {
  const [expandedRows, setExpandedRows] = useState({
    10001: true, // First account is expanded by default
  });

  const [filters, setFilters] = useState({
    codeSeries: false,
    transactionsDate: false,
    type: false,
    name: false,
    accountFullName: false,
    balance: false,
    amount: false,
  });

  const toggleRow = (accountCode) => {
    setExpandedRows((prev) => ({
      ...prev,
      [accountCode]: !prev[accountCode],
    }));
  };

  const handleFilterChange = (filterKey, checked) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: checked,
    }));
  };

  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <Button variant={'ghost'} className={''}>
          <ChevronLeft size={16} className="mr-1" />
          Back
        </Button>

        <div className="flex space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size={'icon'}
                variant={'outline'}
                className={'h-10 text-sm'}
              >
                <FilterIcon size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-4" align="end">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Filter</h3>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="codeSeries"
                      checked={filters.codeSeries}
                      onCheckedChange={(checked) =>
                        handleFilterChange('codeSeries', checked)
                      }
                    />
                    <label
                      htmlFor="codeSeries"
                      className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Code Series
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="transactionsDate"
                      checked={filters.transactionsDate}
                      onCheckedChange={(checked) =>
                        handleFilterChange('transactionsDate', checked)
                      }
                    />
                    <label
                      htmlFor="transactionsDate"
                      className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Transactions Date
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="type"
                      checked={filters.type}
                      onCheckedChange={(checked) =>
                        handleFilterChange('type', checked)
                      }
                    />
                    <label
                      htmlFor="type"
                      className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Type
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="name"
                      checked={filters.name}
                      onCheckedChange={(checked) =>
                        handleFilterChange('name', checked)
                      }
                    />
                    <label
                      htmlFor="name"
                      className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Name
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="accountFullName"
                      checked={filters.accountFullName}
                      onCheckedChange={(checked) =>
                        handleFilterChange('accountFullName', checked)
                      }
                    />
                    <label
                      htmlFor="accountFullName"
                      className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Account full name
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="balance"
                      checked={filters.balance}
                      onCheckedChange={(checked) =>
                        handleFilterChange('balance', checked)
                      }
                    />
                    <label
                      htmlFor="balance"
                      className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Balance
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="amount"
                      checked={filters.amount}
                      onCheckedChange={(checked) =>
                        handleFilterChange('amount', checked)
                      }
                    />
                    <label
                      htmlFor="amount"
                      className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Amount
                    </label>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant={'outline'} className={'h-10 rounded-2xl text-sm'}>
            <img src={youtubeIcon} alt="YouTube Icon" className="mr-1 h-4" />
            See video guide
          </Button>
          <Button className={'h-10 rounded-2xl text-sm'}>Save as</Button>
        </div>
      </div>

      {/* Account Report Section */}
      <div className="mt-8 rounded-xl bg-white py-6">
        {/* Report Header */}
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-xl font-bold">Account Report</h1>
          <p className="text-sm text-gray-700">December, 2024, December 2025</p>
        </div>

        {/* Report Table */}
        <div className="px-4">
          {/* Table Header */}
          <div className="grid grid-cols-8 gap-4 p-4 text-sm font-medium text-[#7d7d7d]">
            <div className="flex items-center">
              Code Series
              <ChevronsUpDown size={14} className="ml-1" />
            </div>
            <div className="flex items-center">
              Transactions Date
              <ChevronsUpDown size={14} className="ml-1" />
            </div>
            <div className="flex items-center">
              Type
              <ChevronsUpDown size={14} className="ml-1" />
            </div>
            <div className="flex items-center">
              Description
              <ChevronsUpDown size={14} className="ml-1" />
            </div>
            <div className="flex items-center">
              Name
              <ChevronsUpDown size={14} className="ml-1" />
            </div>
            <div className="flex items-center">
              Account full name
              <ChevronsUpDown size={14} className="ml-1" />
            </div>
            <div className="flex items-center">
              Amount
              <ChevronsUpDown size={14} className="ml-1" />
            </div>
            <div className="flex items-center">
              Balance
              <ChevronsUpDown size={14} className="ml-1" />
            </div>
          </div>

          {/* Account Group 1 - 10001 */}
          <div className="mb-4 space-y-4">
            {/* Group Header */}
            <div
              className="grid cursor-pointer grid-cols-8 gap-4 rounded-2xl border p-4 hover:bg-gray-50"
              onClick={() => toggleRow('10001')}
            >
              <div className="flex items-center font-medium">
                {expandedRows['10001'] ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronUp size={16} />
                )}
                <span className="ml-2">10001 (2)</span>
              </div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>

            {/* Expanded Rows */}
            {expandedRows['10001'] && (
              <>
                <div className="grid grid-cols-8 gap-4 rounded-2xl border p-4 text-sm">
                  <div>10001</div>
                  <div>08/12/2025</div>
                  <div>Expenses</div>
                  <div>Printing of cards</div>
                  <div>JJ Solutions</div>
                  <div>Printing Expenses</div>
                  <div>$200</div>
                  <div>$453</div>
                </div>
                <div className="grid grid-cols-8 gap-4 rounded-2xl border p-4 text-sm">
                  <div>10001</div>
                  <div>08/12/2025</div>
                  <div>Expenses</div>
                  <div>Printing of cards</div>
                  <div>JJ Solutions</div>
                  <div>Printing Expenses</div>
                  <div>$200</div>
                  <div>$453</div>
                </div>
                <div className="grid grid-cols-8 gap-4 rounded-2xl border p-4 text-sm font-medium">
                  <div>Total</div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div>$400</div>
                  <div></div>
                </div>
              </>
            )}
          </div>

          {/* Account Group 2 - 10001 (6) - Collapsed */}
          <div>
            <div
              className="grid cursor-pointer grid-cols-8 gap-4 rounded-2xl border p-4 hover:bg-gray-50"
              onClick={() => toggleRow('10001_6')}
            >
              <div className="flex items-center font-medium">
                {expandedRows['10001_6'] ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronUp size={16} />
                )}
                <span className="ml-2">20001 (6)</span>
              </div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </div>

        {/* Report Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm font-medium text-[#292D32]">
            Tuesday, November 25, 2025 2:23AM GMT +01:00
          </p>
        </div>
      </div>
    </div>
  );
}
