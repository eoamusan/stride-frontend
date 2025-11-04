import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, ChevronsUpDown, Check } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import CustomerService from '@/api/customer';
import { useUserStore } from '@/stores/user-store';

const customerFormSchema = z.object({
  customer: z.object({
    title: z.string().optional(),
    firstName: z.string().min(1, { message: 'First name is required' }),
    middleName: z.string().optional(),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    displayName: z.string().min(1, { message: 'Display name is required' }),
    companyName: z.string().optional(),
    phoneNumber: z.string().min(1, { message: 'Phone number is required' }),
    email: z.email({ message: 'Please enter a valid email address' }),
    creditLimit: z.string().optional(),
    dueDate: z.date().optional(),
    isSubCustomer: z.boolean().default(false),
  }),
  address: z.object({
    address1: z.string().min(1, { message: 'Address is required' }),
    address2: z.string().optional(),
    city: z.string().min(1, { message: 'City is required' }),
    state: z.string().min(1, { message: 'State is required' }),
    zipcode: z.string().min(1, { message: 'ZIP code is required' }),
    country: z.string().min(1, { message: 'Country is required' }),
    sameAsBilling: z.boolean().default(false),
  }),
});

export default function AddCustomerModal({ open, onOpenChange }) {
  const { businessData } = useUserStore();
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      customer: {
        title: '',
        firstName: '',
        middleName: '',
        lastName: '',
        displayName: '',
        companyName: '',
        phoneNumber: '',
        email: '',
        creditLimit: '',
        dueDate: '',
        isSubCustomer: false,
      },
      address: {
        address1: '',
        address2: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        sameAsBilling: false,
      },
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const businessId = businessData?._id;
      const dataWithAccountId = {
        ...data,
        businessId: businessId,
      };

      await CustomerService.create({
        data: dataWithAccountId,
      });

      toast.success('Customer successfully added!');
      onOpenChange(false);
      form.reset();
    } catch (err) {
      console.log('Error submitting customer data:', err);
      toast.error(
        err.response.data.message ||
          err.message ||
          'Failed to add customer. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    form.reset();
  };

  // Fetch countries when modal opens
  useEffect(() => {
    async function fetchCountries() {
      if (!open) return;
      try {
        const response = await fetch(
          'https://restcountries.com/v3.1/all?fields=name,flags,cca2'
        );
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    }
    fetchCountries();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-full max-w-4xl overflow-y-auto p-8 sm:max-w-4xl">
        <DialogHeader className={'w-full'}>
          <DialogTitle className="text-2xl font-semibold">
            Add Customer
          </DialogTitle>
          <p className="text-sm text-gray-600">Enter the details</p>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-4xl space-y-6"
          >
            {/* Basic Information */}
            <div className="space-y-6">
              {/* Title and Name Row */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-7">
                <FormField
                  control={form.control}
                  name="customer.title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={'min-w-[55px]'}>
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="mr">Mr.</SelectItem>
                          <SelectItem value="mrs">Mrs.</SelectItem>
                          <SelectItem value="ms">Ms.</SelectItem>
                          <SelectItem value="dr">Dr.</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customer.firstName"
                  render={({ field }) => (
                    <FormItem className={'md:col-span-2'}>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input
                          className={'h-10'}
                          placeholder="Enter name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customer.middleName"
                  render={({ field }) => (
                    <FormItem className={'md:col-span-2'}>
                      <FormLabel>Middle name</FormLabel>
                      <FormControl>
                        <Input
                          className={'h-10'}
                          placeholder="Enter name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customer.lastName"
                  render={({ field }) => (
                    <FormItem className={'md:col-span-2'}>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input
                          className={'h-10'}
                          placeholder="Enter name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Customer Display Name and Company Name */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
                <FormField
                  control={form.control}
                  name="customer.displayName"
                  render={({ field }) => (
                    <FormItem className={'md:col-span-2'}>
                      <FormLabel>Customer display name</FormLabel>
                      <FormControl>
                        <Input
                          className={'h-10'}
                          placeholder="Enter name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customer.companyName"
                  render={({ field }) => (
                    <FormItem className={'md:col-span-2 md:col-start-4'}>
                      <FormLabel>Company name</FormLabel>
                      <FormControl>
                        <Input
                          className={'h-10'}
                          placeholder="Enter name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Phone and Email */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
                <FormField
                  control={form.control}
                  name="customer.phoneNumber"
                  render={({ field }) => (
                    <FormItem className={'md:col-span-2'}>
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <Input
                          className={'h-10'}
                          placeholder="Enter phone number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customer.email"
                  render={({ field }) => (
                    <FormItem className={'md:col-span-2 md:col-start-4'}>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input
                          className={'h-10'}
                          type="email"
                          placeholder="Enter Email address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* CreditLimit and DueDate */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
                <FormField
                  control={form.control}
                  name="customer.creditLimit"
                  render={({ field }) => (
                    <FormItem className={'md:col-span-2'}>
                      <FormLabel>Credit Limit</FormLabel>
                      <FormControl>
                        <Input type={'number'} className={'h-10'} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customer.dueDate"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col md:col-span-2 md:col-start-4">
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'h-10 w-full pl-3 text-left text-sm font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-full min-w-80 p-0"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Sub Customer Checkbox */}
              <FormField
                control={form.control}
                name="customer.isSubCustomer"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Is a sub customer
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>

            {/* Address Section */}
            <div className="mt-8 space-y-6">
              <div>
                <h3 className="mb-2 text-2xl font-semibold">Address</h3>
                <p className="text-sm text-gray-600">Enter the details</p>
              </div>

              {/* Street Addresses */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
                <FormField
                  control={form.control}
                  name="address.address1"
                  render={({ field }) => (
                    <FormItem className={'md:col-span-2'}>
                      <FormLabel>Street address 1</FormLabel>
                      <FormControl>
                        <Input
                          className={'h-10'}
                          placeholder="Enter address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.address2"
                  render={({ field }) => (
                    <FormItem className={'md:col-span-2 md:col-start-4'}>
                      <FormLabel>Street address 2</FormLabel>
                      <FormControl>
                        <Input
                          className={'h-10'}
                          placeholder="Enter address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Country, State, City, and ZIP Code - Rearranged */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
                <FormField
                  control={form.control}
                  name="address.country"
                  render={({ field }) => (
                    <FormItem className="flex flex-col md:col-span-2">
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
                                        (country) =>
                                          country.cca2 === field.value
                                      )?.flags.svg
                                    }
                                    alt={
                                      countries.find(
                                        (country) =>
                                          country.cca2 === field.value
                                      )?.flags.alt
                                    }
                                    width={20}
                                    height={15}
                                  />
                                  <span>
                                    {
                                      countries.find(
                                        (country) =>
                                          country.cca2 === field.value
                                      )?.name.common
                                    }
                                  </span>
                                </span>
                              ) : (
                                'Select country'
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
                              <CommandEmpty>Country(s) not found.</CommandEmpty>
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
                                          form.setValue(
                                            'address.country',
                                            country.cca2
                                          );
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

                <FormField
                  control={form.control}
                  name="address.state"
                  render={({ field }) => (
                    <FormItem className={'md:col-span-2 md:col-start-4'}>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input
                          className={'h-10'}
                          placeholder="Enter state"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* City and ZIP Code */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
                <FormField
                  control={form.control}
                  name="address.city"
                  render={({ field }) => (
                    <FormItem className={'md:col-span-2'}>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input
                          className={'h-10'}
                          placeholder="Enter city"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address.zipcode"
                  render={({ field }) => (
                    <FormItem className={'md:col-span-2 md:col-start-4'}>
                      <FormLabel>ZIP code</FormLabel>
                      <FormControl>
                        <Input
                          className={'h-10'}
                          placeholder="Enter zipcode"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Shipping Address Checkbox */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Shipping address</h4>
                <FormField
                  control={form.control}
                  name="address.sameAsBilling"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        Same as billing address
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="h-10 w-full max-w-[35%]"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-10 w-full max-w-[35%]"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
