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

export default function AssetInformationForm({ onBack, onNext, formValues }) {
  const formSchema = z.object({
      assetName: z.string().min(1, "Asset name is required"),
      assetType: z.string({ message: 'Select an asset type'}),
      serialNumber: z.string().min(1, "Serial number is required"),
      category: z.string({ message: 'Select a category'}),
      subCategory: z.string({ message: 'Select a sub-category'}),
      description: z.string().min(1, "Description is required"),
    })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assetName: formValues.assetName || '',
      assetType: formValues.assetType || '',
      serialNumber: formValues.serialNumber || '',
      category: formValues.category || '',
      subCategory: formValues.subCategory || '',
      description: formValues.description || ''
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
    <div>
      <Form {...form} >
        <form onSubmit={handleSubmit(handleNext)} className="space-y-5">

          <FormField
            control={control}
            name="assetName"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 items-baseline">
                <FormLabel className="whitespace-nowrap min-w-25">Asset Name</FormLabel>
                <FormControl className="flex w-full">
                  <Input type="text" placeholder="Enter asset name" onChange={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="assetType"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 items-baseline">
                <FormLabel className="whitespace-nowrap min-w-25">Asset Type</FormLabel>
                <FormControl className="flex w-full">
                  <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Asset Type" />
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
            name="serialNumber"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 items-baseline">
                <FormLabel className="whitespace-nowrap min-w-25">Serial No</FormLabel>
                <FormControl className="flex w-full">
                  <Input type="text" placeholder="Enter serial number" onChange={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="category"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 items-baseline">
                <FormLabel className="whitespace-nowrap min-w-25">Category</FormLabel>
                <FormControl className="flex w-full">
                  <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Category" />
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
            name="subCategory"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 items-baseline">
                <FormLabel className="whitespace-nowrap min-w-25">Sub-Category</FormLabel>
                <FormControl className="flex w-full">
                  <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Sub-Category" />
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
            name="description"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 items-baseline">
                <FormLabel className="whitespace-nowrap min-w-25">Description</FormLabel>
                <FormControl className="flex w-full">
                  <Textarea type="text" placeholder="Enter detailed asset description" onChange={field.onChange} value={field.value} />
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