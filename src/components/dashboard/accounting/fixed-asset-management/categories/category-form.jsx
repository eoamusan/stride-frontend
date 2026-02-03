import AssetCategoryService from "@/api/category";
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
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

export default function CategoryForm({ onCreateCategory, onCancel }) {
  const formSchema = z.object({
      categoryName: z.string().min(1, "Category name is required"),
      depreciationMethod: z.string({ message: 'Select a depreciation method'}),
      salvageValue: z.coerce.number().min(0, "Salvage value is required"),
      usefulLifeYears: z.coerce.number().min(1, "Useful life in years is required"),
      depreciationRate: z.coerce.number().min(0, "Depreciation rate is required"),
      // residualValuePercentage: z.coerce.number().min(0, "Residual value percentage is required"),
      description: z.string().min(1, "Description is required"),
    })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryName: '',
      depreciationMethod: '',
      usefulLifeYears: '',
      depreciationRate: '',
      salvageValue: '',
      // residualValuePercentage: '',
      description: ''
    },
    mode: "onChange"
  })
  const { handleSubmit, control, formState } = form;

  const { isValid } = formState

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values) => {
    if (!isValid) return
    console.log('Category Data:', values)
    try {
      setIsSubmitting(true);
      values.usefulLifeYears = String(values.usefulLifeYears);
      values.salvageValue = String(values.salvageValue);
      values.depreciationRate = String(values.depreciationRate);
      await AssetCategoryService.create({ data: values });
      form.reset();
      onCreateCategory(values)
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error(error.response?.data?.message || 'Failed to create category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
    
  }

  return (
    <div>
      <Form {...form} >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <FormField
            control={control}
            name="categoryName"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 items-baseline">
                <FormLabel className="whitespace-nowrap min-w-25">Category Name</FormLabel>
                <FormControl className="flex w-full">
                  <Input type="text" placeholder="Enter category name" onChange={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="depreciationMethod"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 items-baseline">
                <FormLabel className="whitespace-nowrap min-w-25">Depreciation Method</FormLabel>
                <FormControl className="flex w-full">
                  <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Depreciation Method" />
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


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="usefulLifeYears"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3 items-baseline">
                  <FormLabel className="whitespace-nowrap min-w-25">Useful Life Years</FormLabel>
                  <FormControl className="flex w-full">
                    <Input type="number" placeholder="Enter number of years" onChange={field.onChange} value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="salvageValue"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3 items-baseline">
                  <FormLabel className="whitespace-nowrap min-w-25">Salvage Value (NGN)</FormLabel>
                  <FormControl className="flex w-full">
                    <Input type="number" formatNumber placeholder="Enter salvage value" onChange={field.onChange} value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="depreciationRate"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3 items-baseline">
                  <FormLabel className="whitespace-nowrap min-w-25">Depreciation Rate (%)</FormLabel>
                  <FormControl className="flex w-full">
                    <Input type="number" placeholder="Enter percentage" onChange={field.onChange} value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 items-baseline">
                <FormLabel className="whitespace-nowrap min-w-25">Description</FormLabel>
                <FormControl className="flex w-full">
                  <Textarea type="text" placeholder="Enter category description" onChange={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2 justify-end mt-4">
            <Button variant="secondary" onClick={onCancel} disabled={isSubmitting} className="h-10 px-10 text-sm rounded-3xl">
              Back
            </Button>
            <Button
              type="submit"
              className="h-10 px-10 text-sm rounded-3xl"
              disabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
            >
              Add Category
            </Button>
          </div>

          
        </form>
      </Form>
    </div>
  );
}