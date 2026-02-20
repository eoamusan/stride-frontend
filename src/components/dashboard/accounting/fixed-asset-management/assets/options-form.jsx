// Build form component with only one field (Option name) with shadcn ui and zod validation. This form will be used to add new options for the asset form (e.g. new building, new department, etc.)

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import { OptionIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import OptionService from "@/api/option";

export default function OptionsForm({ open, onSubmit, onClose, optionType }) {
  const formSchema = z.object({
      name: z.string().min(1, "Name is required"),
    })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
    mode: "onChange"
  })
  const { handleSubmit, control, formState, reset } = form;

  const { isValid } = formState
  const [isLoading, setIsLoading] = useState(false)

  const handleAddOption = async (values) => {
    if (!isValid) return

    try {
      setIsLoading(true)
      // Call API to add new option based on optionType (e.g. if optionType is 'building', call API to add new building)
      const response = await OptionService.create({ data: { name: values.name, section: optionType } })
      toast.success(`${optionType.charAt(0).toUpperCase() + optionType.slice(1)} added successfully`)
      onSubmit(response.data?.data)
      reset()
    } catch (error) {
      console.error(`Error adding new ${optionType}:`, error);
      toast.error(`Failed to add ${optionType}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    // Put form within a dialog
    <Dialog open={open} onOpenChange={() => {reset(); onClose()}}>
      <DialogContent>
        <div className="flex gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#254C00] text-white">
            <OptionIcon className="size-4" />
          </div>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              {`Add New ${optionType?.charAt(0).toUpperCase() + optionType?.slice(1)}`}
             </DialogTitle>
          </DialogHeader>
        </div>
        <div>
          <Form {...form} >
            <form onSubmit={handleSubmit(handleAddOption)} className="space-y-5">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder={`Enter ${optionType} name`} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={!isValid || isLoading} className="h-10 min-w-39">
            {isLoading ? 'Adding...' : `Add ${optionType.charAt(0).toUpperCase() + optionType.slice(1)}`}
          </Button>
        </form>
      </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
