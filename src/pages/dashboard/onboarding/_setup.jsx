import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import StrideLogo from '@/assets/icons/stride.svg';

const formSchema = z.object({
  business_name: z
    .string()
    .min(2, {
      message: 'Business name must be at least 2 characters long',
    })
    .nonempty({
      message: 'Business name is required',
    })
    .transform((val) => val.trim()),
  num_of_employees: z.string().nonempty({
    message: 'Number of employees is required',
  }),
  business_location: z
    .string()
    .min(2, {
      message: 'Business location must be at least 2 characters long',
    })
    .nonempty({
      message: 'Business location is required',
    })
    .transform((val) => val.trim()),
  industry: z.string().nonempty({
    message: 'Industry is required',
  }),
  currency: z.string().nonempty({
    message: 'Currency is required',
  }),
  time_zone: z.string().nonempty({
    message: 'Time zone is required',
  }),
});

export default function Setup({ setNext, setFormData, formData }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      business_name: formData.business_name || '',
      num_of_employees: formData.num_of_employees || '',
      business_location: formData.business_location || '',
      industry: formData.industry || '',
      currency: formData.currency || '',
      time_zone: formData.time_zone || '',
    },
  });

  const onSubmit = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setNext();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-16">
      <div className="mx-auto flex w-full max-w-[720px] flex-col items-center justify-center gap-4 rounded-xl py-10 max-md:px-[5%] md:border md:shadow-xl">
        <header>
          <img
            src={StrideLogo}
            alt="Stride"
            className="mx-auto block w-[131px]"
          />
          <hgroup className="mt-6 max-w-[420px] text-center">
            <h1 className="text-4xl font-semibold">
              Complete Your Business Information
            </h1>
          </hgroup>
        </header>
        <main className="mt-4 w-full max-w-[420px]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="business_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your business name"
                        className={'h-10'}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="num_of_employees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Employees</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select number of employees" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-500">
                          201-500 employees
                        </SelectItem>
                        <SelectItem value="501-1000">
                          501-1000 employees
                        </SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="business_location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Location</FormLabel>
                    <FormControl>
                      <Input
                        className={'h-10'}
                        placeholder="e.g., Lagos, Nigeria"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="manufacturing">
                          Manufacturing
                        </SelectItem>
                        <SelectItem value="consulting">Consulting</SelectItem>
                        <SelectItem value="real-estate">Real Estate</SelectItem>
                        <SelectItem value="hospitality">Hospitality</SelectItem>
                        <SelectItem value="agriculture">Agriculture</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="NGN">
                          NGN - Nigerian Naira
                        </SelectItem>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="CAD">
                          CAD - Canadian Dollar
                        </SelectItem>
                        <SelectItem value="AUD">
                          AUD - Australian Dollar
                        </SelectItem>
                        <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                        <SelectItem value="CNY">CNY - Chinese Yuan</SelectItem>
                        <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                        <SelectItem value="ZAR">
                          ZAR - South African Rand
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time_zone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Zone</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select time zone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Africa/Lagos">
                          Africa/Lagos (WAT)
                        </SelectItem>
                        <SelectItem value="America/New_York">
                          America/New_York (EST)
                        </SelectItem>
                        <SelectItem value="America/Los_Angeles">
                          America/Los_Angeles (PST)
                        </SelectItem>
                        <SelectItem value="Europe/London">
                          Europe/London (GMT)
                        </SelectItem>
                        <SelectItem value="Europe/Paris">
                          Europe/Paris (CET)
                        </SelectItem>
                        <SelectItem value="Asia/Tokyo">
                          Asia/Tokyo (JST)
                        </SelectItem>
                        <SelectItem value="Asia/Shanghai">
                          Asia/Shanghai (CST)
                        </SelectItem>
                        <SelectItem value="Asia/Kolkata">
                          Asia/Kolkata (IST)
                        </SelectItem>
                        <SelectItem value="Australia/Sydney">
                          Australia/Sydney (AEDT)
                        </SelectItem>
                        <SelectItem value="America/Toronto">
                          America/Toronto (EST)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className={'h-10 w-full'} size={'lg'} type="submit">
                Next
              </Button>
            </form>
          </Form>
        </main>
      </div>
    </div>
  );
}
