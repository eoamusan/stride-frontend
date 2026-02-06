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

export default function CategoryForm({ onCreateCategory, onCancel, onUpdateCategory, formValues }) {
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
      categoryName: formValues?.categoryName || '',
      depreciationMethod: formValues?.depreciationMethod || '',
      usefulLifeYears: formValues?.usefulLifeYears || '',
      depreciationRate: formValues?.depreciationRate || '',
      // format salvage value to remove commas
      salvageValue: formValues?.salvageValue ? formValues.salvageValue.replace(/,/g, '') : '',
      // residualValuePercentage: formValues?.residualValuePercentage || '',
      description: formValues?.description || ''
    },
    mode: "onChange"
  })
  const { handleSubmit, control, formState } = form;

  const { isValid } = formState

  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateCategory = async (values) => {
    try {
      setIsSubmitting(true);
      console.log("Updating category with values:", formValues, values)
      const response = await AssetCategoryService.update({id: formValues._id, data: values });
      form.reset();
      onUpdateCategory(response.data?.data)
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error(error.response?.data?.message || 'Failed to update category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const createCategory = async (values) => {
    try {
      setIsSubmitting(true);
      values.usefulLifeYears = String(values.usefulLifeYears);
      values.salvageValue = String(values.salvageValue);
      values.depreciationRate = String(values.depreciationRate);
      const response = await AssetCategoryService.create({ data: values });
      form.reset();
      onCreateCategory(response.data?.data)
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error(error.response?.data?.message || 'Failed to create category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }
  
  const onSubmit = async (values) => {
    if (!isValid) return
    if (formValues) {
      await updateCategory(values)
    } else {
      await createCategory(values)
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
                          <SelectLabel>Methods</SelectLabel>
                          <SelectItem value="decliningBalance">Declining Balance</SelectItem>
                          <SelectItem value="straightLine">Straight Line</SelectItem>
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
            <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting} className="h-10 px-10 text-sm rounded-3xl">
              Back
            </Button>
            <Button
              type="submit"
              className="h-10 px-10 text-sm rounded-3xl"
              disabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
            >
              {formValues ? 'Update Category' : 'Add Category'}
            </Button>
          </div>

          
        </form>
      </Form>
    </div>
  );
}