import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DownloadIcon } from 'lucide-react';

export default function DownloadDropdown({
  // Event handler for download format selection
  onDownloadFormats = () => {},

  // Download format options
  downloadFormats = [
    { key: 'pdf', label: 'Pdf' },
    { key: 'excel', label: 'Excel' },
    { key: 'csv', label: 'CSV' },
  ],

  // Optional loading state
  isLoading = false,

  // Optional disabled state
  disabled = false,
}) {
  const handleFormatChange = (format, checked) => {
    if (onDownloadFormats) {
      onDownloadFormats(format, checked);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size={'icon'}
          className={'size-10'}
          variant={'outline'}
          disabled={disabled || isLoading}
        >
          <DownloadIcon size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={'w-11 min-w-24 text-xs'} align={'end'}>
        {downloadFormats.map((format) => (
          <DropdownMenuCheckboxItem
            key={format.key}
            onCheckedChange={(checked) =>
              handleFormatChange(format.key, checked)
            }
            disabled={isLoading}
          >
            {format.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
