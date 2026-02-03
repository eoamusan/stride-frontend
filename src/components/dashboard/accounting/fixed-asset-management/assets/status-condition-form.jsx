import AssetService from "@/api/asset";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

export default function StatusConditionForm({ onBack, onNext, formValues }) {
  const formSchema = z.object({
      initialStatus: z.string({ message: 'Select an initial status'}),
      conditionalAssessment: z.string({ message: 'Select a conditional assessment'}),
      notes: z.string().min(1, "Description is required"),
    })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      initialStatus: formValues.initialStatus || '',
      conditionalAssessment: formValues.conditionalAssessment || '',
      notes: formValues.notes || ''
    },
    mode: "onChange"
  })
  const { handleSubmit, control, formState } = form;

  const { isValid } = formState
  const [isLoading, setIsLoading] = useState(false)

  const handleNext = async (values) => {
    if (!isValid) return

    try {
      setIsLoading(true)
      console.log("formValues in status condition form", formValues)
      const payload = { ...values, assetId: formValues.item.asset?._id }
      await AssetService.updateStatusCondition({ data: payload, id: formValues.item?.status?._id })
      toast.success("Status and Condition saved successfully")
      onNext(values)
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Failed to save Status and Condition")
      return
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Form {...form} >
        <form onSubmit={handleSubmit(handleNext)} className="space-y-5">
          <FormField
            control={control}
            name="initialStatus"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 items-baseline">
                <FormLabel className="whitespace-nowrap min-w-25">Initial Status</FormLabel>
                <FormControl className="flex w-full">
                  <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Status" />
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
            name="conditionalAssessment"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 items-baseline">
                <FormLabel className="whitespace-nowrap min-w-25">Conditional Assessment</FormLabel>
                <FormControl className="flex w-full">
                  <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Condition" />
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
            name="notes"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 items-baseline">
                <FormLabel className="whitespace-nowrap min-w-25">Description</FormLabel>
                <FormControl className="flex w-full">
                  <Textarea placeholder="Enter detailed asset description" onChange={field.onChange} value={field.value} />
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
              disabled={!isValid || isLoading}
              isLoading={isLoading}
            >
              Next
            </Button>
          </div>

          
        </form>
      </Form>
    </div>
  );
}