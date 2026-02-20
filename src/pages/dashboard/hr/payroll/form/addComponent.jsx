import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Form, FormControl, FormField } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { FormInput, FormSelect, SuccessModal } from '@/components/customs';
import { useCreateSalaryComponentMutation } from '@/hooks/api/useCreateSalaryComponentMutation';
import { useUpdateSalaryComponentMutation } from '@/hooks/api/useUpdateSalaryComponentMutation';

const componentSchema = z.object({
  name: z.string().min(1, { message: 'Component name is required' }),
  type: z.string().min(1, { message: 'Type is required' }),
  amountType: z.string().min(1, { message: 'Amount type is required' }),
  taxable: z.boolean().default(false),
  recurringMonthly: z.boolean().default(false),
});

export default function AddComponent({
  open,
  onOpenChange,
  onSave,
  data = null,
  componentId = null,
}) {
  const [showSuccess, setShowSuccess] = useState(false);
  const { createSalaryComponentHandler, isCreateComponentLoading } =
    useCreateSalaryComponentMutation();
  const { updateSalaryComponentHandler, isUpdateComponentLoading } =
    useUpdateSalaryComponentMutation();

  const isEditMode = Boolean(componentId ?? data);
  const shouldUpdate = Boolean(componentId);

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
      form.reset(
        data || {
          name: '',
          type: '',
          amountType: '',
          taxable: false,
          recurringMonthly: false,
        }
      );
    } else if (data) {
      form.reset(data);
    }
  }, [open, data, form]);

  const mapRowForDisplay = (formData) => ({
    componentName: formData.name,
    amountType: formData.amountType === 'fixed' ? 'Fixed' : 'Percentage',
    taxable: !!formData.taxable,
    recurring: !!formData.recurringMonthly,
    type: formData.type || 'Earning',
  });

  const enrichRowWithApiResult = (row, apiResult) => {
    if (!apiResult) return row;
    const candidate =
      apiResult?.data?.component ??
      apiResult?.data?.data ??
      apiResult?.data ??
      apiResult?.component ??
      apiResult;

    if (!candidate || typeof candidate !== 'object') return row;

    const identifier =
      candidate.id ??
      candidate._id ??
      candidate.componentId ??
      candidate?.data?._id ??
      null;

    if (!identifier) return row;
    return {
      ...row,
      id: identifier,
      componentId: identifier,
    };
  };

  const buildApiPayload = (formData) => ({
    componentName: formData.name,
    type: formData.type || 'earning',
    amountType: formData.amountType,
    taxable: !!formData.taxable,
    recurringMonthly: !!formData.recurringMonthly,
  });

  const onFormSubmit = async (formData) => {
    const row = mapRowForDisplay(formData);
    const payload = buildApiPayload(formData);

    const handleSuccess = async (apiResult) => {
      const enrichedRow = enrichRowWithApiResult(row, apiResult);
      if (onSave) await onSave(enrichedRow, apiResult);
      form.reset();
      setShowSuccess(true);
    };

    if (shouldUpdate && componentId) {
      await updateSalaryComponentHandler(componentId, payload, {
        showToast: false,
        onSuccess: handleSuccess,
      });
    } else {
      await createSalaryComponentHandler(payload, {
        showToast: false,
        onSuccess: handleSuccess,
      });
    }
  };

  const typeOptions = [
    { value: 'earning', label: 'Earning' },
    { value: 'deduction', label: 'Deduction' },
    { value: 'reimbursement', label: 'Reimbursement' },
  ];

  const amountTypeOptions = [
    { value: 'fixed', label: 'Fixed' },
    { value: 'percentage', label: 'Percentage' },
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

        <div className="flex flex-col w-full md:flex-row gap-4">
          <FormSelect
            control={form.control}
            name="type"
            label="Type"
            placeholder="Select type"
            options={typeOptions}
            className='flex-1'
          />

          <FormSelect
            control={form.control}
            name="amountType"
            label="Amount Type"
            placeholder="Select amount type"
            options={amountTypeOptions}
            className='flex-1'
          />
        </div>

        <div className="flex flex-col gap-4">
          {[
            {
              name: 'taxable',
              label: 'Taxable Component',
              desc: 'Include in tax calculations',
            },
            {
              name: 'recurringMonthly',
              label: 'Recurring Monthly',
              desc: 'Repeats monthly in each cycle',
            },
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
                    <Switch
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                    />
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
            onClick={() => onOpenChange?.(false)}
            className="h-12 rounded-xl px-6"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="h-12 rounded-xl px-6"
            disabled={isCreateComponentLoading || isUpdateComponentLoading}
            isLoading={isCreateComponentLoading || isUpdateComponentLoading}
          >
            {isEditMode ? 'Update Component' : 'Add Component'}
          </Button>
        </div>
      </form>

      <SuccessModal
        title={isEditMode ? 'Salary Component Updated' : 'Salary Component Added'}
        description={
          isEditMode
            ? "You've successfully updated a salary component."
            : "You've successfully added a salary component."
        }
        buttonText="Okay"
        open={showSuccess}
        onAction={() => {
          setShowSuccess(false);
          onOpenChange?.(false);
        }}
      />
    </Form>
  );
}
