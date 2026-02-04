import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Form, FormControl, FormField } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { FormInput, FormSelect } from '@/components/customs';



const componentSchema = z.object({
  name: z.string().min(1, { message: 'Component name is required' }),
  type: z.string().min(1, { message: 'Type is required' }),
  amountType: z.string().min(1, { message: 'Amount type is required' }),
  taxable: z.boolean().default(false),
  recurringMonthly: z.boolean().default(false),
});

export default function AddComponent({ open, onOpenChange, onSave, data = null }) {
  const form = useForm({
    resolver: zodResolver(componentSchema),
    defaultValues: data || {
      name: '',
      type: '',
      amountType: '',
      taxable: false,
      recurringMonthly: false,
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset(data || { name: '', type: '', amountType: '', taxable: false, recurringMonthly: false });
    } else if (data) {
      form.reset(data);
    }
  }, [open, data, form]);

  const onFormSubmit = async (formData) => {
    const row = {
      componentName: formData.name,
      amountType: formData.amountType === 'fixed' ? 'Fixed' : 'Percentage',
      taxable: !!formData.taxable,
      recurring: !!formData.recurringMonthly,
      type: formData.type || 'Earning',
    };

    if (onSave) await onSave(row);
    if (onOpenChange) onOpenChange(false);
    form.reset();
  };

  const typeOptions = [
    { value: "earning", label: "Earning" },
    { value: "deduction", label: "Deduction" },
    { value: "reimbursement", label: "Reimbursement" }
  ];

  const amountTypeOptions = [
    { value: "fixed", label: "Fixed" },
    { value: "percentage", label: "Percentage" }
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
        
        <FormInput 
          control={form.control}
          name="name"
          label="Component Name"
          placeholder="Enter component name"
        />

        <div className="grid md:grid-cols-2 gap-3">
          <FormSelect 
            control={form.control}
            name="type"
            label="Type"
            placeholder="Select type"
            options={typeOptions}
          />

          <FormSelect 
            control={form.control}
            name="amountType"
            label="Amount Type"
            placeholder="Select amount type"
            options={amountTypeOptions}
          />
        </div>

        {/* Switch sections stay as they are for custom layout */}
        <div className="flex flex-col gap-4">
          {[
            { name: "taxable", label: "Taxable Component", desc: "Include in tax calculations" },
            { name: "recurringMonthly", label: "Recurring Monthly", desc: "Repeats monthly in each cycle" }
          ].map((item) => (
            <FormField
              key={item.name}
              control={form.control}
              name={item.name}
              render={({ field }) => (
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold">{item.label}</h3>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <FormControl>
                    <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </div>
              )}
            />
          ))}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="h-12 px-6 rounded-xl"
          >
            Cancel
          </Button>
          <Button type="submit" className="h-12 px-6 rounded-xl">
            Add Component
          </Button>
        </div>
      </form>
    </Form>
  );
}