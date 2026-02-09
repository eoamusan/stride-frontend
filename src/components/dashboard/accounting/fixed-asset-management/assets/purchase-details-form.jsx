import AssetService from "@/api/asset";
import { Combobox } from "@/components/core/combo-box";
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
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import AddVendorForm from "../../accounts-payable/vendors";
import useAssets from "@/hooks/fixed-asset-management/useAssets";

export default function PurchaseDetailsForm({ onBack, onNext, formValues }) {
  const [openVendorForm, setOpenVendorForm] = useState(false)
  const formSchema = z.object({
      purchaseDate: z.date({required_error: "Purchase date is required"}),
      purchasePrice: z.coerce.number().min(1, "Purchase price is required"),
      supplier: z.string({ required_error: 'Select a supplier'}),
      pon: z.string().min(1, "Purchase order number is required"),
      warrantyStartDate: z.date().nullable().refine((date) => date !== null, { message: "Warranty start date is required" }),
      warrantyEndDate: z.date().nullable().refine((date) => date !== null, { message: "Warranty end date is required" }),
    })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purchaseDate: formValues.purchaseDate ? new Date(formValues.purchaseDate) : null,
      pon: formValues.pon || '',
      purchasePrice: formValues.purchasePrice || 0,
      supplier: formValues.supplier || '',
      warrantyStartDate: formValues.warrantyStartDate ? new Date(formValues.warrantyStartDate) : null,
      warrantyEndDate: formValues.warrantyEndDate ? new Date(formValues.warrantyEndDate) : null
    },
    mode: "onChange"
  })

  const { handleSubmit, control, formState } = form;

  const { isValid, errors } = formState
  const [isLoading, setIsLoading] = useState(false)
  const { vendors, fetchVendors, loadingVendors } = useAssets()

  const handleNext = async (values) => {
    console.log(errors)
    if (!isValid) return
    try {
      setIsLoading(true)
      const payload = { ...values, assetId: formValues.item.asset?._id }
      await AssetService.updatePurchaseInformation({ data: payload, id: formValues.item.purchaseDetails?._id })
      toast.success("Purchase Information saved successfully")
      onNext(values)
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Failed to save Purchase Information")
      return
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVendors()
  }, [])
  
  return (
    <div>
      <Form {...form} >
        <form onSubmit={handleSubmit(handleNext)} className="space-y-5">
          <FormField
            control={control}
            name="purchaseDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'h-10 w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Choose date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="purchasePrice"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 items-baseline">
                <FormLabel className="whitespace-nowrap min-w-25">Purchase Price (NGN)</FormLabel>
                <FormControl className="flex w-full">
                  <Input type="number" formatNumber placeholder="Enter price" onChange={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="supplier"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 items-baseline">
                <FormLabel className="whitespace-nowrap min-w-25">Supplier</FormLabel>
                <FormControl className="flex w-full">
                    <Combobox
                      loading={loadingVendors}
                      items={vendors}
                      value={field.value}
                      onChange={(v) => form.setValue('supplier', v)}
                      getValue={(item) => item._id}
                      getLabel={(item) => `${item.firstName} ${item.lastName}`}
                      getSubLabel={(item) => item.businessInformation?.businessName}
                      onAddItem={() => setOpenVendorForm(true)}
                      addItemLabel='Add New Vendor'
                    /> 
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="pon"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 items-baseline">
                <FormLabel className="whitespace-nowrap min-w-25">Purchase Order Number</FormLabel>
                <FormControl className="flex w-full">
                  <Input type="text" placeholder="Enter purchase order number" onChange={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="warrantyStartDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Warranty Start Date </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'h-10 w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Choose date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />


          <FormField
            control={control}
            name="warrantyEndDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Warranty End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'h-10 w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Choose date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
      <AddVendorForm
        open={openVendorForm}
        showSuccessModal={(newVendor) => {
          toast.success('Vendor added successfully')
          form.setValue('category', newVendor?._id || '')
          setOpenVendorForm(false)
        }}
        onOpenChange={setOpenVendorForm}
      />
    </div>
  );
}