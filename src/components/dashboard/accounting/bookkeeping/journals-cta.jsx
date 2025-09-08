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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, DownloadIcon, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function JournalEntriesCta({
  selectedDate,
  onDateChange,
  transactionType,
  onTransactionTypeChange,
  referenceNumber,
  onReferenceNumberChange,
  onFilter,
  onRunReport,
}) {
  const transactionTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'payment', label: 'Payment' },
    { value: 'transfer', label: 'Transfer' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4 px-1">
      {/* Date Field */}
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium">Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'h-10 w-48 justify-between text-left text-sm font-normal',
                !selectedDate && 'text-muted-foreground'
              )}
            >
              {selectedDate ? format(selectedDate, 'PPP') : 'Select Date'}
              <CalendarIcon className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateChange}
              disabled={(date) =>
                date > new Date() || date < new Date('1900-01-01')
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Transaction Type */}
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium">Transaction type</label>
        <Select onValueChange={onTransactionTypeChange} value={transactionType}>
          <SelectTrigger className="h-10 w-48 bg-white">
            <SelectValue placeholder="select type" />
          </SelectTrigger>
          <SelectContent>
            {transactionTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reference Number */}
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium">Reference number</label>
        <Input
          placeholder="Enter no"
          value={referenceNumber}
          onChange={(e) => onReferenceNumberChange(e.target.value)}
          className="h-10 w-48 bg-white"
        />
      </div>

      {/* Action Icons */}
      <div className="flex items-end gap-2 pt-6">
        <Button
          variant="outline"
          size="icon"
          onClick={onFilter}
          className="h-10 w-10"
        >
          <Filter className="h-4 w-4" />
        </Button>

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

        <Button size={'sm'} className={'h-10 text-sm'} onClick={onRunReport}>
          Run Report
        </Button>
      </div>
    </div>
  );
}
