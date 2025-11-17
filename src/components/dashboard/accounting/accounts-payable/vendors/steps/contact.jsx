import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ContactStep({ control, countries }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 items-start gap-6">
        {/* Street Address */}
        <FormField
          control={control}
          name="streetAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input className={'h-10'} placeholder="Enter street address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
        {/* City */}
        <FormField
          control={control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input className={'h-10'} placeholder="Enter city" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* State */}
        <FormField
          control={control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input className={'h-10'} placeholder="Enter state" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
        {/* Country */}
        <FormField
          control={control}
          name="country"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Country</FormLabel>
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        'h-10 w-full justify-between text-sm font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        <span className="flex items-center gap-2">
                          <img
                            src={
                              countries.find(
                                (country) => country.cca2 === field.value
                              )?.flags.svg
                            }
                            alt={
                              countries.find(
                                (country) => country.cca2 === field.value
                              )?.flags.alt
                            }
                            width={20}
                            height={15}
                          />
                          <span>
                            {
                              countries.find(
                                (country) => country.cca2 === field.value
                              )?.name.common
                            }
                          </span>
                        </span>
                      ) : (
                        'Select Country'
                      )}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-(--radix-popover-trigger-width) p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search countries..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>Country not found.</CommandEmpty>
                      <CommandGroup>
                        {countries.length > 0 &&
                          countries
                            .sort((a, b) =>
                              a.name.common.localeCompare(b.name.common)
                            )
                            .map((country, i) => (
                              <CommandItem
                                value={country.name.common}
                                key={i}
                                onSelect={() => {
                                  field.onChange(country.cca2);
                                }}
                              >
                                <img
                                  src={country.flags.svg}
                                  alt={country.flags.alt}
                                  width={20}
                                  height={15}
                                />
                                {country.name.common}
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    country.cca2 === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Zip Code */}
        <FormField
          control={control}
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zip Code</FormLabel>
              <FormControl>
                <Input className={'h-10'} placeholder="Enter zipcode" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
        {/* Phone Number 1 */}
        <FormField
          control={control}
          name="phoneNumber1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number 1</FormLabel>
              <FormControl>
                <Input className={'h-10'} placeholder="Enter No" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone Number 2 */}
        <FormField
          control={control}
          name="phoneNumber2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number 2</FormLabel>
              <FormControl>
                <Input className={'h-10'} placeholder="Enter No" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-6">
        {/* Email Address */}
        <FormField
          control={control}
          name="emailAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input className={'h-10'} placeholder="Enter email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-6">
        {/* Website/Portfolio Link */}
        <FormField
          control={control}
          name="websitePortfolioLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website/Portfolio Link</FormLabel>
              <FormControl>
                <Input className={'h-10'} placeholder="Enter website/portfolio link" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
