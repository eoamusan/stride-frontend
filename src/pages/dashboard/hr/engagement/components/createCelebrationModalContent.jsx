import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  CustomButton,
  FormInput,
  FormSelect,
  SuccessModal,
} from '@/components/customs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import CalendarIcon from '@/assets/icons/calendar-search.svg';

const celebrationSchema = z.object({
  employee: z.string().trim().min(1, { message: 'Employee is required' }),
  celebrationType: z
    .string()
    .trim()
    .min(1, { message: 'Celebration type is required' }),
  description: z
    .string()
    .trim()
    .max(50, { message: 'Description must be 50 characters or less' })
    .optional(),
  publishDate: z.date({ required_error: 'Publish date is required' }),
});

const defaultValues = {
  employee: '',
  celebrationType: '',
  description: '',
  publishDate: null,
};

const celebrationTypeOptions = [
  { value: 'Birthday', label: 'Birthday' },
  { value: 'Work Anniversary', label: 'Work Anniversary' },
  { value: 'Promotion', label: 'Promotion' },
];

export default function CreateCelebrationModalContent({
  open,
  onOpenChange,
  onSubmit,
  mode = 'create',
  initialData = null,
  isSubmitting = false,
}) {
  const form = useForm({
    resolver: zodResolver(celebrationSchema),
    defaultValues,
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const description = form.watch('description') || '';

  useEffect(() => {
    if (!open) {
      if (!showSuccessModal) {
        form.reset(defaultValues);
      }
      return;
    }

    if (initialData) {
      form.reset({
        employee: initialData.name ?? '',
        celebrationType: initialData.celebrationType ?? '',
        description: initialData.description ?? '',
        publishDate: initialData.publishDate
          ? new Date(initialData.publishDate)
          : null,
      });
    } else {
      form.reset(defaultValues);
    }
  }, [open, form, initialData, showSuccessModal]);

  const handleSubmit = async (values) => {
    await onSubmit?.(values);
    if (mode === 'create') {
      setShowSuccessModal(true);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onOpenChange?.(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormInput
          control={form.control}
          name="employee"
          label="Employee"
          placeholder="Search employee..."
        />

        <FormSelect
          control={form.control}
          name="celebrationType"
          label="Celebration Type"
          placeholder="Select celebration type"
          options={celebrationTypeOptions}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <div className="relative">
                  <Textarea
                    placeholder="Describe the request..."
                    className="min-h-[120px] resize-none rounded-xl border-gray-200 px-4 py-3 placeholder:text-xs focus-visible:ring-blue-500"
                    maxLength={50}
                    {...field}
                  />
                  <span className="absolute right-3 bottom-3 text-xs text-gray-400">
                    {description.length}/50
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="publishDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Publish Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={`flex h-12 w-full items-center justify-between rounded-xl px-4 text-left text-sm ${
                        !field.value ? 'text-muted-foreground' : ''
                      }`}
                    >
                      {field.value
                        ? format(field.value, 'dd/MM/yyyy')
                        : 'dd/mm/yyyy'}
                      <img src={CalendarIcon} alt="Calendar" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => field.onChange(date)}
                    captionLayout="dropdown"
                    fromYear={2000}
                    toYear={2100}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-3 pt-2">
          <CustomButton
            type="button"
            variant="outline"
            onClick={() => onOpenChange?.(false)}
            disabled={isSubmitting}
          >
            Cancel
          </CustomButton>

          <CustomButton type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Saving...'
              : mode === 'edit'
                ? 'Update Celebration'
                : 'Publish Celebration'}
          </CustomButton>
        </div>
      </form>

      <SuccessModal
        open={showSuccessModal}
        onOpenChange={handleSuccessModalClose}
        title="Celebration Created"
        description="You've successfully Created a Celebration."
        buttonText="Back"
        onAction={handleSuccessModalClose}
      />
    </Form>
  );
}
