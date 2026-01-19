import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

export default function CompanyInformation({ onBack, onNext, formValues }) {
  const formSchema = z.object({
      companyName: z.string().min(1, "Company name is required"),
      taxIdentificationNumber: z.string().min(1, "TIN is required"),
      registeredBusinessAddress: z.string().min(1, "Business address is required"),
      businessType: z.string({ message: 'Select a business type'}),
    })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: formValues.companyName || '',
      taxIdentificationNumber: formValues.taxIdentificationNumber || '',
      registeredBusinessAddress: formValues.registeredBusinessAddress || '',
      businessType: formValues.businessType || ''
    },
    mode: "onChange"
  })
  const { handleSubmit, control, formState } = form;

  const { isValid } = formState

  const handleNext = (values) => {
    if (!isValid) return
    onNext(values)
  }

  return (
    <div className="mt-10">
      <Form {...form} >
        <form onSubmit={handleSubmit(handleNext)} className="space-y-5">

          <FormField
            control={control}
            name="companyName"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 items-baseline">
                <FormLabel className="whitespace-nowrap min-w-25">Company Name</FormLabel>
                <FormControl className="flex w-full">
                  <Input type="text" placeholder="Enter company name" onChange={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="taxIdentificationNumber"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 items-baseline">
                <FormLabel className="whitespace-nowrap min-w-25">Tax Identification Number (TIN)</FormLabel>
                <FormControl className="flex w-full">
                  <Input type="text" placeholder="Enter TIN No" onChange={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="registeredBusinessAddress"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 items-baseline">
                <FormLabel className="whitespace-nowrap min-w-25">Registered Business Address</FormLabel>
                <FormControl className="flex w-full">
                  <Input type="text" placeholder="Enter Business Address" onChange={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="businessType"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 items-baseline">
                <FormLabel className="whitespace-nowrap min-w-25">Business Type</FormLabel>
                <FormControl className="flex w-full">
                  <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Business Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Profiles</SelectLabel>
                          <SelectItem value="profile1">Profile 1</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2 justify-end mt-4">
            <Button variant="secondary" onClick={onBack} className="h-10 px-10 text-sm rounded-3xl">
              Back
            </Button>
            <Button
              type="submit"
              className="h-10 px-10 text-sm rounded-3xl"
              disabled={!isValid}
            >
              Next
            </Button>
          </div>

          
        </form>
      </Form>
    </div>
  );
}