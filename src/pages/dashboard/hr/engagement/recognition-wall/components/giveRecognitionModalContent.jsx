import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  CustomButton,
  FormSelect,
  SuccessModal,
} from '@/components/customs';
import { Form } from '@/components/ui/form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

const recognitionSchema = z.object({
  employee: z.string().trim().min(1, { message: 'Employee is required' }),
  recognitionTag: z
    .string()
    .trim()
    .min(1, { message: 'Recognition tag is required' }),
  recognitionMessage: z
    .string()
    .trim()
    .max(50, { message: 'Message must be 50 characters or less' })
    .optional(),
});

const defaultFormValues = {
  employee: '',
  recognitionTag: '',
  recognitionMessage: '',
};

const recognitionTagOptions = [
  { value: 'teamwork', label: 'Teamwork' },
  { value: 'collaboration', label: 'Collaboration' },
  { value: 'innovation', label: 'Innovation' },
  { value: 'leadership', label: 'Leadership' },
];

const employeeOptions = [
  { value: 'femi-johnson', label: 'Femi Johnson' },
  { value: 'sarah-adeyemi', label: 'Sarah Adeyemi' },
  { value: 'michael-brown', label: 'Michael Brown' },
  { value: 'grace-bola', label: 'Grace Bola' },
];

const GiveRecognitionModalContent = ({
  mode = 'create',
  initialData = null,
  onOpenChange,
  onSuccess,
}) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const isEditMode = mode === 'edit';

  const form = useForm({
    resolver: zodResolver(recognitionSchema),
    defaultValues: defaultFormValues,
  });

  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { isSubmitting },
  } = form;

  const messageValue = watch('recognitionMessage') || '';

  useEffect(() => {
    if (initialData && isEditMode) {
      reset({
        employee:
          initialData.recipientName?.toLowerCase().replace(' ', '-') || '',
        recognitionTag: initialData.category?.toLowerCase() || '',
        recognitionMessage: initialData.message || '',
      });
    } else {
      reset(defaultFormValues);
    }
  }, [initialData, isEditMode, reset]);

  const onSubmit = async (data) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log('Form submitted:', data);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error submitting recognition:', error);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    reset(defaultFormValues);
    onOpenChange?.(false);
    onSuccess?.();
  };

  const handleCancel = () => {
    reset(defaultFormValues);
    onOpenChange?.(false);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormSelect
            control={control}
            name="employee"
            label="Recognized Employee"
            placeholder="Select employee..."
            options={employeeOptions}
          />

          <FormSelect
            control={control}
            name="recognitionTag"
            label="Recognition Tag"
            placeholder="Select recognition tag"
            options={recognitionTagOptions}
          />

          <FormField
            control={control}
            name="recognitionMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recognition Message</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Textarea
                      placeholder="Share what made this person's contribution special..."
                      className="min-h-[120px] resize-none rounded-xl border-gray-200 px-4 py-3 placeholder:text-xs focus-visible:ring-blue-500"
                      maxLength={50}
                      {...field}
                    />
                    <span className="absolute right-3 bottom-3 text-xs text-gray-400">
                      {messageValue.length}/50
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-end gap-3 pt-2">
            <CustomButton
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </CustomButton>

            <CustomButton type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? 'Saving...'
                : isEditMode
                  ? 'Update Recognition'
                  : 'Send'}
            </CustomButton>
          </div>
        </form>
      </Form>

      <SuccessModal
        open={showSuccessModal}
        onOpenChange={handleSuccessModalClose}
        title={isEditMode ? 'Recognition Updated' : 'Recognition Given'}
        description={
          isEditMode
            ? "You've successfully updated the recognition."
            : "You've successfully given a recognition."
        }
        buttonText="Back"
        onAction={handleSuccessModalClose}
      />
    </>
  );
};

export default GiveRecognitionModalContent;
