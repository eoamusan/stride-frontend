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
import { useState } from "react";
import { uploadMultipleToCloudinary } from "@/lib/cloudinary";
import AssetService from "@/api/asset";
import toast from "react-hot-toast";

export default function FileUploadForm({ onBack, onNext, formValues }) {
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
  const { handleSubmit, formState } = form;
  const [isLoading, setIsLoading] = useState(false)
  const [assetPhotos, setAssetPhotos] =  useState([])
  const [takePhoto, setTakePhoto] =  useState([])
  const [documents, setDocuments] =  useState([])

  const { isValid } = formState

  const handleNext = async (values) => {
    if (!isValid) return

    try {
      setIsLoading(true)
      console.log("formValues in status condition form", formValues)
      const payload = { ...values, assetId: formValues.item.asset?._id }
      // upload the files and get the urls, then include in the payload
      if (assetPhotos.length > 0) {
        const uploadedFiles  = await uploadMultipleToCloudinary(
          assetPhotos,
          {
            folder: 'assets/photos',
            tags: ['asset', formValues.item.asset?._id, 'photos']
          }
        );
        const fileUrls = uploadedFiles.map(file => file.url)
        payload.assetPhotos = fileUrls
      }
      if (takePhoto.length > 0) {
        const uploadedFiles  = await uploadMultipleToCloudinary(
          takePhoto,
          {
            folder: 'assets/photos',
            tags: ['asset', formValues.item.asset?._id, 'photos']
          }
        );
        const fileUrls = uploadedFiles.map(file => file.url)
        payload.photo = fileUrls[0]
      }
      if (documents.length > 0) {
        const uploadedFiles  = await uploadMultipleToCloudinary(
          documents,
          {
            folder: 'assets/photos',
            tags: ['asset', formValues.item.asset?._id, 'documents']
          }
        );
        const fileUrls = uploadedFiles.map(file => file.url)
        payload.documents = fileUrls
      }
      await AssetService.updateAssetFile({ data: payload, id: formValues.item?.assetFile?._id })
      toast.success("File information saved successfully")
      onNext(values)
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Failed to save File Information")
      return
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Form {...form} >
        <form onSubmit={handleSubmit(handleNext)} className="space-y-5">
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Asset Photos</Label>
            <FileUploadDropzone
              accept=".png,.jpg,.jpeg"
              onFilesChange={(files) => setAssetPhotos(files)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Take a photo</Label>
            <FileUploadDropzone
              accept=".png,.jpg,.jpeg"
              onFilesChange={(files) => setTakePhoto(files)}
            />
          </div>
          

          <div className="space-y-2">
            <Label className="text-sm font-medium">Documents</Label>
            <FileUploadDropzone
              accept=".png,.jpg,.jpeg"
              onFilesChange={(files) => setDocuments(files)}
            />
          </div>

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
              Submit
            </Button>
          </div>

          
        </form>
      </Form>
    </div>
  );
}