import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SettingsIcon } from 'lucide-react';

export default function SettingsDropdown({
  // Column visibility settings
  columns = {},
  onColumnsChange = () => {},

  // Other settings
  includeInactive = false,
  onIncludeInactiveChange = () => {},
  showAccountTypeBadges = true,
  onShowAccountTypeBadgesChange = () => {},

  // Page size settings
  pageSize = '50',
  onPageSizeChange = () => {},
  pageSizeOptions = ['50', '75', '100', '200', '300'],

  // Table density settings
  tableDensity = 'Cozy',
  onTableDensityChange = () => {},
  densityOptions = ['Cozy', 'Compact'],

  // Customization props
  buttonClassName = 'mr-1 size-10',
  menuWidth = 'w-56',

  // Section visibility controls
  showColumns = true,
  showOthers = true,
  showPageSizes = true,
  showTableDensity = true,

  // Custom column definitions
  columnDefinitions = [
    { key: 'number', label: 'Number' },
    { key: 'type', label: 'Type' },
    { key: 'detailType', label: 'Detail type' },
    { key: 'currency', label: 'Currency' },
    { key: 'bankBalance', label: 'Bank balance' },
  ],
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={'icon'} className={buttonClassName} variant={'outline'}>
          <SettingsIcon size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={`${menuWidth} text-xs`} align="end">
        {/* Columns Section */}
        {showColumns && columnDefinitions.length > 0 && (
          <>
            <DropdownMenuLabel>Columns</DropdownMenuLabel>
            {columnDefinitions.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.key}
                checked={columns[column.key] || false}
                onCheckedChange={(checked) =>
                  onColumnsChange(column.key, checked)
                }
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            ))}

            {(showOthers || showPageSizes || showTableDensity) && (
              <DropdownMenuSeparator />
            )}
          </>
        )}

        {/* Others Section */}
        {showOthers && (
          <>
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

            {(showPageSizes || showTableDensity) && <DropdownMenuSeparator />}
          </>
        )}

        {/* Page Sizes Section */}
        {showPageSizes && (
          <>
            <DropdownMenuLabel>Page sizes</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={pageSize}
              onValueChange={onPageSizeChange}
            >
              {pageSizeOptions.map((size) => (
                <DropdownMenuRadioItem key={size} value={size}>
                  {size}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>

            {showTableDensity && <DropdownMenuSeparator />}
          </>
        )}

        {/* Table Density Section */}
        {showTableDensity && (
          <>
            <DropdownMenuLabel>Table Density</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={tableDensity}
              onValueChange={onTableDensityChange}
            >
              {densityOptions.map((density) => (
                <DropdownMenuRadioItem key={density} value={density}>
                  {density}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
