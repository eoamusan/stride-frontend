import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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

const customerFormSchema = z.object({
  title: z.string().optional(),
  first_name: z.string().min(1, { message: 'First name is required' }),
  middle_name: z.string().optional(),
  last_name: z.string().min(1, { message: 'Last name is required' }),
  customer_display_name: z
    .string()
    .min(1, { message: 'Customer display name is required' }),
  company_name: z.string().optional(),
  phone_number: z.string().min(1, { message: 'Phone number is required' }),
  email_address: z.email({ message: 'Please enter a valid email address' }),
  is_sub_customer: z.boolean().default(false),
  street_address_1: z
    .string()
    .min(1, { message: 'Street address is required' }),
  street_address_2: z.string().optional(),
  city: z.string().min(1, { message: 'City is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  zip_code: z.string().min(1, { message: 'ZIP code is required' }),
  country: z.string().min(1, { message: 'Country is required' }),
  same_as_billing_address: z.boolean().default(false),
});

export default function AddCustomerModal({ open, onOpenChange }) {
  const form = useForm({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      title: '',
      first_name: '',
      middle_name: '',
      last_name: '',
      customer_display_name: '',
      company_name: '',
      phone_number: '',
      email_address: '',
      is_sub_customer: false,
      street_address_1: '',
      street_address_2: '',
      city: '',
      state: '',
      zip_code: '',
      country: '',
      same_as_billing_address: false,
    },
  });

  const onSubmit = (data) => {
    console.log('Customer data:', data);
    // Handle form submission
    onOpenChange(false);
    form.reset();
  };

  const handleCancel = () => {
    onOpenChange(false);
    form.reset();
  };

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
                  name="title"
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
                  name="first_name"
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
                  name="middle_name"
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
                  name="last_name"
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
                  name="customer_display_name"
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
                  name="company_name"
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
                  name="phone_number"
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
                  name="email_address"
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

              {/* Sub Customer Checkbox */}
              <FormField
                control={form.control}
                name="is_sub_customer"
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
                  name="street_address_1"
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
                  name="street_address_2"
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

              {/* City and State */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
                <FormField
                  control={form.control}
                  name="city"
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
                  name="state"
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

              {/* ZIP Code and Country */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
                <FormField
                  control={form.control}
                  name="zip_code"
                  render={({ field }) => (
                    <FormItem className={'md:col-span-2'}>
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

                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className={'md:col-span-2 md:col-start-4'}>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input
                          className={'h-10'}
                          placeholder="Enter country"
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
                  name="same_as_billing_address"
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
              >
                Cancel
              </Button>
              <Button type="submit" className="h-10 w-full max-w-[35%]">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
