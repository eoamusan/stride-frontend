import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from '@/components/ui/popover';
// import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DownloadIcon,
  FilterIcon,
  SearchIcon,
  SettingsIcon,
  CalendarIcon,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import AccountService from '@/api/accounts';
import notFoundImg from '@/assets/icons/not-found.png';
// import { format } from 'date-fns';

export default function AccountActions({
  batchAction,
  onBatchActionChange,
  searchTerm,
  onSearchTermChange,
  columns,
  onColumnsChange,
  includeInactive,
  onIncludeInactiveChange,
  showAccountTypeBadges,
  onShowAccountTypeBadgesChange,
  pageSize,
  onPageSizeChange,
  tableDensity,
  onTableDensityChange,
  onFilterClick,
  onDownloadFormats,
  onRunReport,
  searchSelectedAccount,
  onSearchAccountSelect,
  // dateRange,
  // onDateRangeChange,
}) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [accountsList, setAccountsList] = useState([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);

  // Fetch accounts with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      try {
        setIsLoadingAccounts(true);
        const response = await AccountService.fetch({
          search: searchTerm,
        });

        setAccountsList(response.data?.data?.accounts || []);
      } catch (error) {
        console.error('Error fetching accounts:', error);
        setAccountsList([]);
      } finally {
        setIsLoadingAccounts(false);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleAccountSelect = (account) => {
    if (onSearchAccountSelect) {
      onSearchAccountSelect(account);
    }
    setIsPopoverOpen(false);
  };
  return (
    <div className="flex flex-wrap gap-4 px-1 py-4">
      <Select onValueChange={onBatchActionChange} value={batchAction}>
        <SelectTrigger className={'bg-white'}>
          <SelectValue placeholder="Batch Actions" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="BatchDelete">Delete Selected</SelectItem>
          <SelectItem value="BatchExport">Export Selected</SelectItem>
        </SelectContent>
      </Select>

      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverAnchor>
          <div className="relative min-w-sm w-full max-w-md">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search accounts..."
              className="h-10 w-full max-w-lg bg-white pl-10"
              value={
                searchSelectedAccount
                  ? `${searchSelectedAccount.accountCode || searchSelectedAccount.accountNumber} - ${searchSelectedAccount.accountName}`
                  : searchTerm
              }
              onChange={(e) => {
                // Clear selected account when user starts typing
                if (searchSelectedAccount && onSearchAccountSelect) {
                  onSearchAccountSelect(null);
                }
                onSearchTermChange(e.target.value);
                if (!isPopoverOpen) {
                  setIsPopoverOpen(true);
                }
              }}
              onFocus={() => setIsPopoverOpen(true)}
              onClick={() => setIsPopoverOpen(true)}
            />
          </div>
        </PopoverAnchor>
        <PopoverContent
          className="w-(--radix-popover-trigger-width) p-0"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {/* Accounts List */}
          <div className="max-h-[250px] overflow-y-auto rounded-lg bg-white">
            {isLoadingAccounts ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-gray-500">Loading accounts...</p>
              </div>
            ) : accountsList.length > 0 ? (
              <div className="space-y-1 p-2">
                {accountsList.map((account) => (
                  <div
                    key={account._id || account.id}
                    className="grid cursor-pointer grid-cols-[auto_auto_1fr] items-center gap-3 rounded px-3 py-3 hover:bg-gray-50"
                    onClick={() => handleAccountSelect(account)}
                  >
                    <Checkbox
                      checked={
                        searchSelectedAccount?._id === account._id ||
                        searchSelectedAccount?.id === account.id
                      }
                      onCheckedChange={() => handleAccountSelect(account)}
                    />
                    <span className="text-sm font-medium">
                      {account.accountCode || account.accountNumber}
                    </span>
                    <span className="overflow-hidden text-sm text-nowrap text-ellipsis text-gray-600 pl-6">
                      {account.accountName}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="mb-3">
                  <img
                    src={notFoundImg}
                    alt="No Account Found"
                    className="h-24 w-auto"
                  />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  No Account found
                </p>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex items-center gap-2">
        <Button
          size={'icon'}
          className={'size-10'}
          variant={'outline'}
          onClick={onFilterClick}
        >
          <FilterIcon size={16} />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={'icon'} className={'size-10'} variant={'outline'}>
              <SettingsIcon size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 text-xs" align="end">
            <DropdownMenuLabel>Columns</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={columns.number}
              onCheckedChange={(checked) => onColumnsChange('number', checked)}
            >
              Number
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columns.type}
              onCheckedChange={(checked) => onColumnsChange('type', checked)}
            >
              Type
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columns.detailType}
              onCheckedChange={(checked) =>
                onColumnsChange('detailType', checked)
              }
            >
              Detail type
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columns.currency}
              onCheckedChange={(checked) =>
                onColumnsChange('currency', checked)
              }
            >
              Currency
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columns.bankBalance}
              onCheckedChange={(checked) =>
                onColumnsChange('bankBalance', checked)
              }
            >
              Bank balance
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Others</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={includeInactive}
              onCheckedChange={onIncludeInactiveChange}
            >
              Include inactive
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showAccountTypeBadges}
              onCheckedChange={onShowAccountTypeBadgesChange}
            >
              Show account type badges
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Page sizes</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={pageSize}
              onValueChange={onPageSizeChange}
            >
              <DropdownMenuRadioItem value="50">50</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="75">75</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="100">100</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="200">200</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="300">300</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>

            <DropdownMenuSeparator />
            <DropdownMenuLabel>Table Density</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={tableDensity}
              onValueChange={onTableDensityChange}
            >
              <DropdownMenuRadioItem value="Cozy">Cozy</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Compact">
                Compact
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={'icon'} className={'size-10'} variant={'outline'}>
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
        {/* 
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={'h-10 gap-2 text-sm'}
            >
              <CalendarIcon size={16} />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, 'MMM dd, yyyy')} -{' '}
                    {format(dateRange.to, 'MMM dd, yyyy')}
                  </>
                ) : (
                  format(dateRange.from, 'MMM dd, yyyy')
                )
              ) : (
                'Date Range'
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={onDateRangeChange}
              numberOfMonths={2}
              initialFocus
            />
          </PopoverContent>
        </Popover> */}

        <Button size={'sm'} className={'h-10 text-sm'} onClick={onRunReport}>
          Run Report
        </Button>
      </div>
    </div>
  );
}
