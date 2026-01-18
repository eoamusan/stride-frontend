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
import { Input } from "@/components/ui/input";

export default function FileUploadForm({ onBack, onNext }) {
  const formSchema = z.object({
    description: z.string().min(1, "Description is required"),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: 'Test description',
    },
    mode: "onChange"
  })
  const { handleSubmit, control, formState } = form;

  const { isValid } = formState

  const handleNext = (values) => {
    // if (!isValid) return
    console.log(values, 'kkkkkk')
    onNext(values)
  }

  return (
    <div>
      <Form {...form} >
        <form onSubmit={handleSubmit(handleNext)} className="space-y-5">

          {/* <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 items-baseline">
                <FormLabel className="whitespace-nowrap min-w-25">Decription</FormLabel>
                <FormControl className="flex w-full">
                  <Input placeholder="Enter detailed asset description" onChange={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          
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
            >
              Submit
            </Button>
          </div>

          
        </form>
      </Form>
    </div>
  );
}