import { Input } from '@/components/ui/input';
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
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function BusinessInformationStep({ control }) {
  return (
    <div className="space-y-6">
      {/* Business Name */}
      <FormField
        control={control}
        name="businessName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Name</FormLabel>
            <FormControl>
              <Input
                className={'h-10'}
                placeholder="Enter business"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Service Category */}
      <FormField
        control={control}
        name="serviceCategory"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Service Category</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className={'h-10 w-full'}>
                  <SelectValue placeholder="Select  Category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="financial-services">
                  Financial Services
                </SelectItem>
                <SelectItem value="transportation-and-logistics">
                  Transportation and Logistics Services
                </SelectItem>
                <SelectItem value="personal-care">
                  Personal Care Services
                </SelectItem>
                <SelectItem value="creative-and-media">
                  Creative and Media Services
                </SelectItem>
                <SelectItem value="hospitality">Hospitality Service</SelectItem>
                <SelectItem value="health-and-wellness">
                  Health and Wellness Services
                </SelectItem>
                <SelectItem value="education-and-training">
                  Education and Training Services
                </SelectItem>
                <SelectItem value="real-estate">
                  Real Estate Services
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Registration Number */}
      <FormField
        control={control}
        name="registrationNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Registration Number</FormLabel>
            <FormControl>
              <Input
                className={'h-10'}
                placeholder="Enter Registration"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Date of Registration */}
      <FormField
        control={control}
        name="dateOfRegistration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date of Registration</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      'h-10 w-full pl-3 text-left font-normal',
                      !field.value && 'text-muted-foreground'
                    )}
                  >
                    {field.value ? (
                      format(field.value, 'PPP')
                    ) : (
                      <span>Choose date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Type of Incorporation */}
      <FormField
        control={control}
        name="typeOfIncorporation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type of Incorporation</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className={'h-10 w-full'}>
                  <SelectValue placeholder="Select  incorporation" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="llc">
                  Limited Liability Company (LLC)
                </SelectItem>
                <SelectItem value="plc">
                  Public Limited Company (PLC)
                </SelectItem>
                <SelectItem value="limited-by-guarantee">
                  Limited by Guarantee
                </SelectItem>
                <SelectItem value="incorporated-trustees">
                  Incorporated Trustees
                </SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
                <SelectItem value="llp">
                  Limited Liability Partnership (LLP)
                </SelectItem>
                <SelectItem value="foreign-company">Foreign Company</SelectItem>
                <SelectItem value="joint-venture">Joint Venture</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Tax ID */}
      <FormField
        control={control}
        name="taxId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tax ID</FormLabel>
            <FormControl>
              <Input
                className={'h-10 max-w-xs'}
                placeholder="Enter tax id"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
