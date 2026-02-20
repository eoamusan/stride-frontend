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
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import FileUploadDropzone from "../../shared/file-upload-dropzone";
import { useState } from "react";
import toast from "react-hot-toast";
import AssetService from "@/api/asset";
import { uploadMultipleToCloudinary } from "@/lib/cloudinary";

export default function InsuranceForm({ onBack, onNext, formValues }) {
  const formSchema = z.object({
      insuranceCompany: z.string().min(1, "Insurance company is required"),
      plan: z.string().min(1, "Plan is required"),
      risk: z.string().min(1, "Risk is required"),
      startDate: z.date().min(1, "Start date is required"),
      endDate: z.date().min(1, "End date is required"),
      sumIssued: z.coerce.number().min(1, "Sum insured is required"),
      exclusions: z.string().min(1, "Exclusions is required"),
      claimMade: z.boolean({ message: 'Select an option'}),
      date: z.date().min(1, "Claim date is required"),
      documents: z.array(z.string()).optional(),
    })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      insuranceCompany: formValues.insuranceCompany || '',
      plan: formValues.plan || '',
      risk: formValues.risk || '',
      startDate: formValues.startDate || null,
      endDate: formValues.endDate || null,
      sumIssued: formValues.sumIssued || 0,
      exclusions: formValues.exclusions || '',
      claimMade: formValues.claimMade || true,
      date: formValues.date || null,
      documents: formValues.insuranceDocuments || formValues.documents || []
    },
    mode: "onChange"
  })
  const { handleSubmit, control, formState } = form;

  const { isValid } = formState

  const [filesForUpload, setFilesForUpload] = useState([])
  const [isLoading, setIsLoading] = useState(false)


  const handleNext = async (values) => {
    if (!isValid) return

    try {
      setIsLoading(true)
      console.log("formValues in status condition form", formValues)
      const payload = { ...values, assetId: formValues.item.asset?._id }
      // upload the files and get the urls, then include in the payload
      if (filesForUpload.length > 0) {
        const uploadedFiles  = await uploadMultipleToCloudinary(
          filesForUpload,
          {
            folder: 'assets/insurance',
            tags: ['asset', formValues.item.asset?._id, 'insurance']
          }
        );
        const fileUrls = uploadedFiles.map(file => file.url)
        payload.documents = fileUrls
      }
      await AssetService.updateInsurance({ data: payload, id: formValues.item?.insurance?._id })
      toast.success("Insurance information saved successfully")
      onNext(values)
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Failed to save Insurance Information")
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
            name="insuranceCompany"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 items-baseline">
                <FormLabel className="whitespace-nowrap min-w-25">Insurance Company</FormLabel>
                <FormControl className="flex w-full">
                  <Input type="text" placeholder="Enter name" onChange={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid lg:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="plan"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3 items-baseline">
                  <FormLabel className="whitespace-nowrap min-w-25">Plan</FormLabel>
                  <FormControl className="flex w-full">
                    <Input type="text" placeholder="Enter Plan" onChange={field.onChange} value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="risk"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3 items-baseline">
                  <FormLabel className="whitespace-nowrap min-w-25">Risk</FormLabel>
                  <FormControl className="flex w-full">
                    <Input type="text" placeholder="Enter Risk" onChange={field.onChange} value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
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
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
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
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="sumIssued"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3 items-baseline">
                  <FormLabel className="whitespace-nowrap min-w-25">Sum insured (NGN)</FormLabel>
                  <FormControl className="flex w-full">
                    <Input type="number" placeholder="Enter price" onChange={field.onChange} value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="exclusions"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3 items-baseline">
                  <FormLabel className="whitespace-nowrap min-w-25">Exclusions</FormLabel>
                  <FormControl className="flex w-full">
                    <Input type="text" placeholder="Enter exclusions" onChange={field.onChange} value={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="claimMade"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3">
                <FormLabel>Has claimed been made?</FormLabel>
                <FormControl className="flex gap-8">
                  <RadioGroup  value={field.value} onValueChange={field.onChange}>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={true} id="yes" />
                      <Label htmlFor="yes">Yes</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={false} id="no" />
                      <Label htmlFor="no">No</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="date"
            render={({ field }) => (
              <FormItem>
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

          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Documents</Label>
            <FileUploadDropzone
              accept=".png,.jpg,.jpeg"
              onFilesChange={(files) => setFilesForUpload(files)}
            />
            {/* Show preview of previously uploaded documents */}
            {formValues.insuranceDocuments && formValues.insuranceDocuments.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formValues.insuranceDocuments.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded bg-gray-50 p-2"
                  >
                    <span className="text-sm truncate">Document {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end mt-4">
            <Button variant="secondary" onClick={onBack} className="h-10 px-10 text-sm rounded-3xl">
              Back
            </Button>
            <Button
              type="submit"
              className="h-10 px-10 text-sm rounded-3xl"
              disabled={!isValid || isLoading || filesForUpload.length === 0}
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