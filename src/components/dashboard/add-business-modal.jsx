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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { LandmarkIcon } from 'lucide-react';
import { useState } from 'react';
import BusinessService from '@/api/business';
import { useUserStore } from '@/stores/user-store';
import SuccessModal from '@/components/dashboard/accounting/success-modal';

const formSchema = z.object({
  businessName: z
    .string()
    .min(2, {
      message: 'Business name must be at least 2 characters long',
    })
    .nonempty({
      message: 'Business name is required',
    })
    .transform((val) => val.trim()),
  numberOfEmployees: z.string().nonempty({
    message: 'Number of employees is required',
  }),
  businessLocation: z
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
  timezone: z.string().nonempty({
    message: 'Time zone is required',
  }),
});

export default function AddBusinessModal({ isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const userStore = useUserStore();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: '',
      numberOfEmployees: '',
      businessLocation: '',
      industry: '',
      currency: '',
      timezone: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await BusinessService.create({
        businessName: data.businessName,
        numberOfEmployees: data.numberOfEmployees,
        businessLocation: data.businessLocation,
        industry: data.industry,
        currency: data.currency,
        timezone: data.timezone,
        goals: [], // Empty goals array for now
        accountId: userStore.data?.account?._id,
      });

      // Refresh business data
      await userStore.getBusinessData();

      // Show success modal
      setShowSuccess(true);
      form.reset();
    } catch (err) {
      console.error('Error creating business:', err);
      // Handle error - you can add toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-155">
          <DialogHeader>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#254C00]">
                <LandmarkIcon className="h-6 w-6 text-white" />
              </div>
              <DialogTitle className="text-2xl">
                Fill your Business Information
              </DialogTitle>
            </div>
            <DialogDescription className="sr-only">
              Complete the form to add a new business
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Business Name<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Business name"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numberOfEmployees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Employees</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 w-full">
                          <SelectValue placeholder="Select option" />
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
                name="businessLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Location</FormLabel>
                    <FormControl>
                      <Input
                        className="h-11"
                        placeholder="Lagos, Nigeria"
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
                        <SelectTrigger className="h-11 w-full">
                          <SelectValue placeholder="Select Industry" />
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
                        <SelectTrigger className="h-11 w-full">
                          <SelectValue placeholder="Select Currency" />
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
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Zone</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 w-full">
                          <SelectValue placeholder="Select Time Zone" />
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

              <Button
                className="h-12 w-full"
                size="lg"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Adding Business...' : 'Add Business'}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <SuccessModal
        open={showSuccess}
        onOpenChange={setShowSuccess}
        title="Business Added"
        description="You've successfully added a new business."
        backText="Done"
        handleBack={handleSuccessClose}
      />
    </>
  );
}
