import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import FileUploadDropzone from "../../shared/file-upload-dropzone";

export default function UploadCSV({ onBack, onNext, formValues }) {
  const formSchema = z.object({
      files: z.instanceof(File, { message: "Please upload a file" })
            .refine(
              (file) =>
                ["text/csv"]
                  .includes(file.type),
              { message: "Only CSV files are allowed" }
            )
            .refine(
              (file) => file.size <= 5 * 1024 * 1024,
              { message: "File must be less than 5MB" }
            ),
    })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: formValues.companyName || '',
    },
    mode: "onChange"
  })
  const { handleSubmit, control, formState } = form;

  const { isValid } = formState

  const handleNext = (values) => {
    console.log(values, 'mmmmmmm');
    if (!isValid) return
    onNext(values)
  }

  return (
    <div className="mt-10">
      <Form {...form} >
        <form onSubmit={handleSubmit(handleNext)} className="space-y-5">

          <FormField
            control={control}
            name="files"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Bank Statement (CSV)</FormLabel>

                <FormControl>
                    <div className="space-y-2">
                      <FileUploadDropzone
                        accept=".csv,.xlsx,.png,.jpg"
                        onFilesChange={(files) => {
                          field.onChange(files?.[0])
                        }}
                      />
                    </div>

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
            >
              Next
            </Button>
          </div>

          
        </form>
      </Form>
    </div>
  );
}