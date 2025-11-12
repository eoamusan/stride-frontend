import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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

export default function PersonalDetailsStep({ control, countries }) {
  return (
    <div className="space-y-6">
      {/* First Name */}
      <FormField
        control={control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Name</FormLabel>
            <FormControl>
              <Input
                className={'h-10'}
                placeholder="Enter first name"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Last Name */}
      <FormField
        control={control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <FormControl>
              <Input
                className={'h-10'}
                placeholder="Enter last name"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Nationality */}
      <FormField
        control={control}
        name="nationality"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Nationality</FormLabel>
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
                      'Select Nationality'
                    )}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-74 p-0">
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

      {/* Gender */}
      <FormField
        control={control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gender</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="mt-3 flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
