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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

export default function ReconciliationForm({ onBack, onNext }) {
  const formSchema = z.object({
    })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
    <div className="mt-5">
      <Form {...form} >
        <form onSubmit={handleSubmit(handleNext)} className="space-y-5">

          <FormField
            control={control}
            name="bank"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 items-baseline">
                <FormLabel className="whitespace-nowrap min-w-25">Account</FormLabel>
                <FormControl className="flex w-full">
                  <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Account" />
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

          <div className="mt-5">
            <h2 className="font-medium text-sm">Add the following information</h2>
            <div className="grid lg:grid-cols-3 gap-2 text-sm mt-5">

              <div className="font-semibold">
                <div className="flex flex-col gap-4">
                  <Label className="font-semibold">Beginning Balance</Label>
                  <span>0.00</span>
                </div>
              </div>
              <div>
                <FormField
                  control={control}
                  name="accountName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-3 items-baseline">
                      <FormLabel className="whitespace-nowrap min-w-25 font-semibold">Statement ending balance</FormLabel>
                      <FormControl className="flex w-full">
                        <Input type="number" placeholder="0.00" onChange={field.onChange} value={field.value} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={control}
                  name="accountName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-3 items-baseline">
                      <FormLabel className="whitespace-nowrap min-w-25 font-semibold">Statement ending balance</FormLabel>
                      <FormControl className="flex w-full">
                        <Input type="number" placeholder="0.00" onChange={field.onChange} value={field.value} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

          </div>

          <div className="mt-5">
            <h2 className="font-medium text-sm">Enter the service charge or  interest earned, if necessary</h2>
            <div className="grid lg:grid-cols-3 gap-2 text-sm mt-5 items-center">

              <FormField
                control={control}
                name="claimDate"
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

              <div>
                <FormField
                  control={control}
                  name="accountName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-3 items-baseline">
                      <FormControl className="flex w-full">
                        <Input type="number" placeholder="0.00" onChange={field.onChange} value={field.value} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={control}
                  name="accountType"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-3 items-baseline">
                      <FormControl className="flex w-full">
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Account" />
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
            </div>

            <div className="grid lg:grid-cols-3 gap-2 text-sm mt-5 items-center">

              <FormField
                control={control}
                name="claimDate"
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

              <div>
                <FormField
                  control={control}
                  name="accountName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-3 items-baseline">
                      <FormControl className="flex w-full">
                        <Input type="number" placeholder="0.00" onChange={field.onChange} value={field.value} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={control}
                  name="accountType"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-3 items-baseline">
                      <FormControl className="flex w-full">
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Account" />
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
            </div>
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
              Start Reconciling
            </Button>
          </div>

          
        </form>
      </Form>
    </div>
  );
}