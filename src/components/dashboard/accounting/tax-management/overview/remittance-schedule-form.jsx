import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

export default function RemittanceSchedule({ onBack, onNext, formValues }) {
  const formSchema = z.object({
      monthlyRemittanceDay: z.string().min(1, "Monthly remittance day is required"),
      fiscalYearEnd: z.string().min(1, "Fiscal year end is required"),
    })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthlyRemittanceDay: formValues.monthlyRemittanceDay || '',
      fiscalYearEnd: formValues.fiscalYearEnd || ''
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
            name="monthlyRemittanceDay"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 items-baseline">
                <FormLabel className="whitespace-nowrap min-w-25">Monthly Remittance Day</FormLabel>
                <FormControl className="flex w-full">
                  <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Day" />
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

          <FormField
            control={control}
            name="fiscalYearEnd"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 items-baseline">
                <FormLabel className="whitespace-nowrap min-w-25">Fiscal Year End</FormLabel>
                <FormControl className="flex w-full">
                  <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Fiscal Year End" />
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
              Submit
            </Button>
          </div>

          
        </form>
      </Form>
    </div>
  );
}