import AssetService from "@/api/asset";
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import useCategories from "@/hooks/fixed-asset-management/useCategories";
import CategoryForm from "../categories/category-form";
import { AppDialog } from "@/components/core/app-dialog";
import { HousePlus } from "lucide-react";
import { Combobox } from "@/components/core/combo-box";
import useOptions from "@/hooks/fixed-asset-management/useOptions";
import OptionsForm from "./options-form";

export default function AssetInformationForm({ onBack, onNext, formValues }) {

  const { loadingOptions, subCategoryOptions, openOptionsForm, setOpenOptionsForm, fetchOptions } = useOptions()

  const formSchema = z.object({
      assetName: z.string().min(1, "Asset name is required"),
      assetType: z.string({ message: 'Select an asset type'}),
      serialNo: z.string().min(1, "Serial number is required"),
      category: z.string({ message: 'Select a category'}),
      subCategory: z.string({ message: 'Select a sub-category'}),
      description: z.optional(z.string())
    })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assetName: formValues.assetName || '',
      assetType: formValues.assetType || '',
      serialNo: formValues.serialNo || '',
      category: formValues.category || '',
      subCategory: formValues.subCategory || '',
      description: formValues.description || ''
    },
    mode: "onChange"
  })
  const { handleSubmit, control, formState } = form;

  const { isValid } = formState
  const [isLoading, setIsLoading] = useState(false)
  const { categories, fetchCategories } = useCategories()

  const handleNext = async (values) => {
    if (!isValid) return
    // save form data and go to next step
    try {
      setIsLoading(true)

      const create = async () => {
        return await AssetService.create({ data: values })
      }

      const update = async () => {
        return await AssetService.update({ data: values, id: formValues.assetId })
      }

      const res = formValues?.assetId ? await update() : await create();
      const assetData = res.data?.data
      toast.success("Asset Information saved successfully")
      onNext({...values, item: { assetData, ...formValues.item} })
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Failed to save Asset Information")
      return
    } finally {
      setIsLoading(false)
    }
  }

  const [openCategoryForm, setOpenCategoryForm] = useState(false);

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories, formValues])

  useEffect(() => {
    fetchOptions('sub-category');
  }, [fetchOptions])

  useEffect(() => {
    if (!formValues) return

    form.reset({
      assetName: formValues.assetName ?? '',
      assetType: formValues.assetType ?? '',
      serialNo: formValues.serialNo ?? '',
      category: formValues.category ?? '',
      subCategory: formValues.subCategory ?? '',
      description: formValues.description ?? '',
    })
  }, [formValues, form])

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
                          <SelectLabel>Types</SelectLabel>
                            <SelectItem value="fixedAssets">Fixed assets</SelectItem>
                            <SelectItem value="intangible">Intangible assets</SelectItem>
                          <SelectItem value="current">Current assets</SelectItem>
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
            name="serialNo"
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
                    <Combobox
                      items={categories}
                      value={field.value}
                      onChange={(v) => form.setValue('category', v)}
                      getValue={(item) => item._id}
                      getLabel={(item) => item.categoryName}
                      getSubLabel={(item) => item.code}
                      onAddItem={() => setOpenCategoryForm(true)}
                      addItemLabel='Add New Category'
                    /> 
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
                  <Combobox
                    loading={loadingOptions}
                    items={subCategoryOptions}
                    value={field.value}
                    onChange={(v) => form.setValue('subCategory', v)}
                    getValue={(item) => item._id}
                    getLabel={(item) => `${item.name}`}
                    onAddItem={() => setOpenOptionsForm({ open: true, type: 'sub-category' })}
                    addItemLabel='Add New Sub-Category'
                  /> 
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
            <Button variant="secondary" onClick={onBack} disabled className="h-10 px-10 text-sm rounded-3xl">
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
      <AppDialog 
        title="Add New Category"
        headerIcon={<HousePlus />}
        open={openCategoryForm} 
        onOpenChange={setOpenCategoryForm}
        className='sm:max-w-163'
      >
        <CategoryForm onCreateCategory={(newCategory) => {
          fetchCategories()
          setOpenCategoryForm(false)
          form.setValue('category', newCategory?._id || '')
          toast.success('Category added successfully');
        }} onCancel={() => setOpenCategoryForm(false)} />
      </AppDialog>
      <OptionsForm open={openOptionsForm.open} optionType={openOptionsForm.type} 
        onSubmit={(data) => {
          fetchOptions(data.section)
          setOpenOptionsForm({ open: false, type: '' })
        }} 
        onClose={() => setOpenOptionsForm((prev) => ({ ...prev, open: false }))} 
      />
    </div>
  );
}