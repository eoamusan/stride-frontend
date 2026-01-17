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
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import FileUploadDropzone from "../../shared/file-upload-dropzone";

export default function FileUploadForm({ onBack, onNext }) {
  const formSchema = z.object({
      insuranceCompany: z.string().min(1, "Insurance company is required"),
      plan: z.string().min(1, "Plan is required"),
      risk: z.string().min(1, "Risk is required"),
      startDate: z.date().min(1, "Start date is required"),
      endDate: z.date().min(1, "End date is required"),
      purchasePrice: z.coerce.number().min(1, "Sum insured is required"),
      exclusions: z.string().min(1, "Exclusions is required"),
      hasClaimed: z.string({ message: 'Select an option'}),
    })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      insuranceCompany: '',
      plan: '',
      risk: '',
      startDate: null,
      endDate: null,
      purchasePrice: 0,
      exclusions: '',
      hasClaimed: ''
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

          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Asset Photos</Label>
            <FileUploadDropzone
              accept=".csv,.xlsx"
              onFilesChange={(files) => console.log(files)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Take a photo</Label>
            <FileUploadDropzone
              accept=".csv,.xlsx"
              onFilesChange={(files) => console.log(files)}
            />
          </div>
          

          <div className="space-y-2">
            <Label className="text-sm font-medium">Documents</Label>
            <FileUploadDropzone
              accept=".csv,.xlsx"
              onFilesChange={(files) => console.log(files)}
            />
          </div>

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