import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import z from "zod";

export default function AssetAssignmentForm({ onCancel, onSubmit }) {
  const formSchema = z.object({
      asset: z.string({ message: 'Select an asset'}),
      assignedTo: z.string({ message: 'Select an employee'}),
      assignmentDate: z.date({ required_error: 'Assignment date is required' }),
      assetCondition: z.string({ message: 'Select asset condition'}),
      returnDate: z.date({ required_error: 'Return date is required' }),
      department: z.string({ message: 'Select a department'}),
      assignedBy: z.string({ message: 'Select who assigned the asset'}),
      category: z.string({ message: 'Select a category'}),
      notes: z.string().optional(),
    })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      asset: '',
      assignedTo: '',
      assignmentDate: null,
      assetCondition: '',
      returnDate: null,
      department: '',
      assignedBy: '',
      category: '',
      notes: '',
    },
    mode: "onChange"
  })
  const { handleSubmit, control, formState } = form;

  const { isValid } = formState

  const onFormSubmission = (values) => {
    if (!isValid) return
    onSubmit(values)
  }

  return (
    <div>
      <Form {...form} >
        <form onSubmit={handleSubmit(onFormSubmission)} className="space-y-5">

          <FormField
            control={control}
            name="asset"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 items-baseline">
                <FormLabel className="whitespace-nowrap min-w-25">Asset</FormLabel>
                <FormControl className="flex w-full">
                  <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Asset" />
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

          <div className="grid lg:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3 items-baseline">
                  <FormLabel className="whitespace-nowrap min-w-25">Employee/Assign To</FormLabel>
                  <FormControl className="flex w-full">
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Employee" />
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

            <FormField
              control={control}
              name="assignmentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignment Date</FormLabel>
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
              name="assetCondition"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3 items-baseline">
                  <FormLabel className="whitespace-nowrap min-w-25">Asset Condition</FormLabel>
                  <FormControl className="flex w-full">
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Condition" />
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

            <FormField
              control={control}
              name="returnDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Return Date</FormLabel>
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
              name="department"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3 items-baseline">
                  <FormLabel className="whitespace-nowrap min-w-25">Department</FormLabel>
                  <FormControl className="flex w-full">
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Department" />
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

            <FormField
              control={control}
              name="assignedBy"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3 items-baseline">
                  <FormLabel className="whitespace-nowrap min-w-25">Assigned by</FormLabel>
                  <FormControl className="flex w-full">
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Assigned by" />
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
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <FormField
              control={control}
              name="category"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3 items-baseline">
                  <FormLabel className="whitespace-nowrap min-w-25">Category</FormLabel>
                  <FormControl className="flex w-full">
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Category" />
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
          </div>

          <FormField
            control={control}
            name="notes"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 items-baseline">
                <FormLabel className="whitespace-nowrap min-w-25">Notes</FormLabel>
                <FormControl className="flex w-full">
                  <Textarea type="text" placeholder="Write Note" onChange={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2 justify-end mt-4">
            <Button variant="secondary" onClick={onCancel} className="h-10 px-10 text-sm rounded-3xl">
              Back
            </Button>
            <Button
              type="submit"
              className="h-10 px-10 text-sm rounded-3xl"
              disabled={!isValid}
            >
              Assign Asset
            </Button>
          </div>

        </form>
      </Form>
    </div>
  );
}