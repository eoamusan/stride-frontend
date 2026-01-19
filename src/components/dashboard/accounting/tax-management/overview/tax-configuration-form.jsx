import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

export default function TaxConfiguration({ onBack, onNext, formValues }) {
  const formSchema = z.object({
      vatEnabled: z.boolean().optional(),
      whtEnabled: z.boolean().optional(),
      payeEnabled: z.boolean().optional(),
      citEnabled: z.boolean().optional(),
    })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vatEnabled: formValues.vatEnabled || false,
      whtEnabled: formValues.whtEnabled || false,
      payeEnabled: formValues.payeEnabled || false,
      citEnabled: formValues.citEnabled || false,
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
    <div className="mt-10">
      <Form {...form} >
        <form onSubmit={handleSubmit(handleNext)} className="space-y-5">

          <FormField
            control={control}
            name="vatEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 items-baseline w-full">
                <FormLabel className="hover:bg-accent/50 flex items-center justify-between gap-3 rounded-lg border p-3 w-full">
                  <div className="grid gap-1.5 font-normal">
                    <p className="text-sm leading-none font-medium">
                      Value Added Tax (VAT)
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Tax on goods and services sold
                    </p>
                  </div>


                  <Checkbox
                    onCheckedChange={field.onChange} checked={field.value}
                  />
                </FormLabel>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="whtEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 items-baseline w-full">
                <FormLabel className="hover:bg-accent/50 flex items-center justify-between gap-3 rounded-lg border p-3 w-full">
                  <div className="grid gap-1.5 font-normal">
                    <p className="text-sm leading-none font-medium">
                      Withholding Tax (WHT)
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Tax withheld from payments to suppliers
                    </p>
                  </div>

                  <Checkbox
                    onCheckedChange={field.onChange} checked={field.value}
                  />
                  
                </FormLabel>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="payeEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 items-baseline w-full">
                <FormLabel className="hover:bg-accent/50 flex items-center justify-between gap-3 rounded-lg border p-3 w-full">
                  <div className="grid gap-1.5 font-normal">
                    <p className="text-sm leading-none font-medium">
                      Pay As You Earn (PAYE)
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Tax deducted from employee salaries
                    </p>
                  </div>

                  <Checkbox
                    onCheckedChange={field.onChange} checked={field.value}
                  />
                  
                </FormLabel>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="citEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3 items-baseline w-full">
                <FormLabel className="hover:bg-accent/50 flex items-center justify-between gap-3 rounded-lg border p-3 w-full">
                  <div className="grid gap-1.5 font-normal">
                    <p className="text-sm leading-none font-medium">
                      Company Income Tax (CIT)
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Tax on company profits (typically 30%)
                    </p>
                  </div>

                  <Checkbox
                    onCheckedChange={field.onChange} checked={field.value}
                  />
                  
                </FormLabel>

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
              disabled={!isValid}
            >
              Next
            </Button>
          </div>

          
        </form>
      </Form>
    </div>
  );
}