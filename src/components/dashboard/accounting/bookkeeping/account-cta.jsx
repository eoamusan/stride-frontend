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
  DownloadIcon,
  FilterIcon,
  SearchIcon,
  SettingsIcon,
} from 'lucide-react';

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
}) {
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

      <div className="relative w-full max-w-xs">
        <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
        <Input
          placeholder="Search accountss......"
          className="h-10 w-full max-w-xs bg-white pl-10"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
      </div>

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

        <Button
          size={'sm'}
          className={'h-10 text-sm'}
          onClick={onRunReport}
        >
          Run Report
        </Button>
      </div>
    </div>
  );
}
