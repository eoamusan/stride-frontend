import { useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Check, ChevronsUpDown, PlusIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Combobox({
  loading = false,
  items = [],
  value,
  onChange,

  getValue,
  getLabel,
  getSubLabel,

  placeholder = 'Select option',
  searchPlaceholder = 'Search...',
  emptyText = 'No results found',

  onAddItem,
  addItemLabel = 'Add item',
  disabled,
}) {
  const [open, setOpen] = useState(false)

  const selectedItem = items.find(
    (item) => getValue(item) === value
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={disabled}
          className={cn(
            'h-10 w-full justify-between text-sm',
            !value && 'text-muted-foreground'
          )}
        >
          {selectedItem
            ? getLabel(selectedItem)
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>

            {/* show loading state */}
            {loading && (
              <div className="p-2 text-center text-sm text-muted-foreground">
                Loading...
              </div>
            )}

            <CommandGroup>
              {items.map((item) => {
                const itemValue = getValue(item)

                return (
                  <CommandItem
                    key={itemValue}
                    value={itemValue}
                    onSelect={() => {
                      onChange(itemValue)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        itemValue === value
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />

                    <div className="flex flex-col">
                      <span className="font-medium">
                        {getLabel(item)}
                      </span>

                      {getSubLabel && getSubLabel(item) && (
                        <span className="text-muted-foreground text-xs">
                          {getSubLabel(item)}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>

            {onAddItem && (
              <div className="border-t p-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    setOpen(false)
                    onAddItem()
                  }}
                >
                  <PlusIcon className="mr-2 h-4 w-4" />
                  {addItemLabel}
                </Button>
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
