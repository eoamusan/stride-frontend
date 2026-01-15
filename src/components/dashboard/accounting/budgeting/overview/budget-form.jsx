import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRef, useState } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import z from "zod"
import PeriodSelector from "@/components/core/period-selector";
import { CircleDashed } from 'lucide-react';
import { AppDialog } from "@/components/core/app-dialog";
import CustomBudgetForm from "./custom-budget-form";


export default function BudgetForm({ onCreateBudget }) {

  const [openCustomBudgetForm, setOpenCustomBudgetForm] = useState(false)

  const periodSchema = z
    .object({
      datePeriod: z.string(),
      fromDate: z.date().min(1, "From date is required"),
      toDate: z.date().min(1, "To date is required"),
    })
    .refine((data) => new Date(data.toDate) >= new Date(data.fromDate), {
      message: "To date must be after From date",
      path: ["toDate"],
    });

  const formSchema = z.object({
    budgetType: z.string(),
    period: periodSchema,
    budgetFormat: z.string(),
    profileData: z.string({ message: 'Select a profile'})
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      budgetType: "profitAndLoss",
      period: { datePeriod: 'today' },
      budgetFormat: "consolidated",
      profileData: undefined
    },
    mode: "onChange"
  })
  const { handleSubmit, reset, control, formState } = form;

  const { isValid, errors } = formState

  const onSubmit = (values) => {
    console.log(values)
    reset()
    onCreateBudget(values)
  }

  const handleCancel = () => {
    reset();
  };

  const fileInputRef = useRef(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log(file)
    }
  }

  return (
    <div>
      <Form {...form} >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <p className="text-sm mt-4">Select your preferred options</p>
          <FormField
            control={control}
            name="budgetType"
            render={({ field }) => (
              <FormItem className="flex gap-3">
                <FormLabel className="min-w-25">Budget Type</FormLabel>
                <FormControl className="flex gap-8">
                  <RadioGroup value={field.value} onValueChange={field.onChange}>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="profitAndLoss" id="profitAndLoss" />
                      <Label htmlFor="profitAndLoss">Profit and loss</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="balanceSheet" id="balanceSheet" />
                      <Label htmlFor="balanceSheet">Balance Sheet</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="period"
            render={({ field }) => (
              <FormItem className="flex gap-3 items-baseline">
                <FormLabel className="whitespace-nowrap min-w-25">Period</FormLabel>
                <FormControl className="flex w-full">
                  <div className="flex flex-col">
                    <PeriodSelector
                      value={field.value}
                      onChange={field.onChange}
                    />
                    {
                      errors.period && <div className="flex flex-col gap-2 mt-2"> {Object.entries(errors.period).map(([key]) => {
                        return <span className="text-destructive text-sm">{ errors.period[key].message }</span>
                      })}</div>
                    }
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="budgetFormat"
            render={({ field }) => (
              <FormItem className="flex gap-3">
                <FormLabel>Budget Format</FormLabel>
                <FormControl className="flex gap-8">
                  <RadioGroup  value={field.value} onValueChange={field.onChange}>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="consolidated" id="consolidated" />
                      <Label htmlFor="consolidated">Consolidated</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="subdivided" id="subdivided" />
                      <Label htmlFor="subdivided">Subdivided</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="profileData"
            render={({ field }) => (
              <FormItem className="flex gap-3">
                <FormLabel className="whitespace-nowrap min-w-25">Profile Data</FormLabel>
                <div className="w-full">
                  <FormControl className="flex gap-8">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="(Optional) Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Profiles</SelectLabel>
                          <SelectItem value="profile1">Profile 1</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="block" />
                </div>
              </FormItem>
            )}
          />


          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Available setup option</span>
            <button type="button" className="flex flex-col items-center text-center text-[8pt] max-w-42 p-2 rounded-md border border-primary cursor-pointer" onClick={() => setOpenCustomBudgetForm(true)}>
              <CircleDashed className="my-2" />
              <span>Custom Budgets</span>
              <span>Create a budget from scratch</span>
            </button>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".csv,.xlsx"
              />
              <button
                type="button"
                onClick={handleClick}
                className="text-xs underline text-primary font-medium bg-transparent p-0 cursor-pointer"
              >
                Import Budget
              </button>
            </div>
          </div>
          

          
          {/* Footer Buttons */}
          <div className="flex justify-end space-x-4 pt-10 pb-5">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="h-10 min-w-[130px] text-sm"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="h-10 min-w-[195px] text-sm"
              disabled={!isValid}
            >
              Next
            </Button>
          </div>
        </form>
      </Form>
      <AppDialog 
        title="Custom Budgets"
        description="Create a budget from scratch"
        open={openCustomBudgetForm} 
        onOpenChange={setOpenCustomBudgetForm}
        className='sm:max-w-150'
      >
        <CustomBudgetForm />
      </AppDialog>
    </div>
  )
}