import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar } from '@/components/ui/calendar';
import { useJobRequisitionStore } from '@/stores/job-requisition-store';
import toast from 'react-hot-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FormInput, FormSelect } from '@/components/customs'; // Custom wrappers
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import PreviewForm from './preview-form';
import CalendarIcon from '@/assets/icons/calendar.svg';

const requisitionSchema = z.object({
  jobTitle: z.string().min(1, { message: 'Job Title is required' }),
  department: z.string().min(1, { message: 'Department is required' }),
  employmentType: z.string().min(1, { message: 'Employment Type is required' }),
  grade: z.string().min(1, { message: 'Grade is required' }),
  minBudget: z.string().min(1, { message: 'Min Budget is required' }),
  maxBudget: z.string().min(1, { message: 'Max Budget is required' }),
  noOfOpenings: z.coerce
    .number()
    .min(1, { message: 'At least one opening is required' }),
  urgency: z.string().min(1, { message: 'Urgency is required' }),
  startDate: z.date({ required_error: 'Start Date is required' }),
  reason: z.string().min(1, { message: 'Reason for hire is required' }),
  detailedReason: z
    .string()
    .max(200, { message: 'Must be 200 characters or less' })
    .optional(),
});
const departments = [
  { label: 'Engineering', value: 'engineering' },
  { label: 'Design', value: 'design' },
  { label: 'Marketing', value: 'marketing' },
  { label: 'Human Resources', value: 'hr' },
];

const employmentTypes = [
  { label: 'Full-time', value: 'full-time' },
  { label: 'Part-time', value: 'part-time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Internship', value: 'internship' },
];

const cadres = [
  { label: 'Entry Level', value: 'entry-level' },
  { label: 'Mid Level', value: 'mid-level' },
  { label: 'Senior Level', value: 'senior-level' },
  { label: 'Executive Level', value: 'executive-level' },
  { label: 'Director Level', value: 'director-level' },
  { label: 'CEO Level', value: 'ceo-level' },
];

const urgencyLevels = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
];

const reasons = [
  { label: 'Recruitment', value: 'recruitment' },
  { label: 'Replacement', value: 'replacement' },
  { label: 'Rotation', value: 'rotation' },
  { label: 'Other', value: 'other' },
];
export default function ManpowerRequisitionForm({ onSuccess, initialData }) {
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createRequisition, updateRequisition } = useJobRequisitionStore();

  const form = useForm({
    resolver: zodResolver(requisitionSchema),
    defaultValues: {
      jobTitle: '',
      department: '',
      employmentType: '',
      grade: '',
      minBudget: '',
      maxBudget: '',
      noOfOpenings: 1,
      urgency: '',
      startDate: undefined,
      reason: '',
      detailedReason: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        jobTitle: initialData.jobTitle || '',
        department: initialData.department || '',
        employmentType: initialData.employmentType || '',
        grade: initialData.grade || '',
        minBudget: initialData.minBudget || '',
        maxBudget: initialData.maxBudget || '',
        noOfOpenings: initialData.noOfOpenings || initialData.openings || 1,
        urgency: initialData.urgency || '',
        startDate: initialData.startDate
          ? new Date(initialData.startDate)
          : undefined,
        reason: initialData.reason || '',
        detailedReason: initialData.detailedReason || '',
      });
    }
  }, [initialData, form]);

  const formatBudget = (value) => {
    if (!value) return '';
    const rawValue = value.replace(/,/g, '').replace(/\D/g, '');
    return rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const onBudgetChange = (e, field) => {
    const formatted = formatBudget(e.target.value);
    field.onChange(formatted);
  };

  const onSubmit = (data) => {
    setIsPreview(true);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    const formData = form.getValues();
    try {
      const payload = {
        jobTitle: formData.jobTitle,
        department: formData.department,
        employmentType: formData.employmentType,
        grade: formData.grade,
        minBudget: formData.minBudget.replace(/,/g, ''),
        maxBudget: formData.maxBudget.replace(/,/g, ''),
        noOfOpenings: `${formData.noOfOpenings}`,
        urgency: formData.urgency === 'High',
        reason: formData.reason,
        detailedReason: formData.detailedReason,
        startDate: formData.startDate,
      };

      if (initialData?._id || initialData?.id) {
        await updateRequisition({
          id: initialData._id || initialData.id,
          data: payload,
        });
        toast.success('Requisition updated successfully');
      } else {
        await createRequisition({ data: payload });
        toast.success('Requisition created successfully');
      }

      form.reset();
      setIsPreview(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error saving requisition:', error);
      toast.error(
        error.response?.data?.message || 'Failed to save requisition'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPreview) {
    return (
      <PreviewForm
        formData={form.getValues()}
        handleFinalSubmit={handleFinalSubmit}
        isSubmitting={isSubmitting}
        setIsPreview={setIsPreview}
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-2xl space-y-6"
        >
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
            {initialData
              ? 'Edit Man-Power Requisition Form'
              : 'Man-Power Requisition Form'}
          </h2>

          <FormInput
            control={form.control}
            name="jobTitle"
            label={
              <>
                Job Title<span className="text-red-500">*</span>
              </>
            }
            placeholder="e.g Senior Software Engineer"
          />

          <FormSelect
            control={form.control}
            name="department"
            label={
              <>
                Department<span className="text-red-500">*</span>
              </>
            }
            placeholder="Select Department"
            options={departments}
          />

          <FormField
            control={form.control}
            name="employmentType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>
                  Employment Type<span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                    className="flex items-center gap-4"
                  >
                    {employmentTypes.map((type) => (
                      <FormItem
                        key={type.value}
                        className="flex items-center space-y-0 space-x-1"
                      >
                        <FormControl>
                          <RadioGroupItem value={type.value} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {type.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormSelect
            control={form.control}
            name="grade"
            label={
              <>
                Cadre<span className="text-red-500">*</span>
              </>
            }
            placeholder="Select the role level or grade"
            options={cadres}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Budget Range{' '}
              <span className="text-xs text-gray-400">(Per Annum)</span>{' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="minBudget"
                render={({ field }) => (
                  <FormItem className="relative flex-1">
                    <span className="absolute top-5 left-3 z-10 -translate-y-[calc(50%+10px)] text-xs text-gray-400">
                      Min
                    </span>
                    <span className="absolute top-9 left-3 z-10 -translate-y-[calc(50%+10px)] text-lg font-bold text-gray-400">
                      ₦
                    </span>
                    <FormControl>
                      <input
                        {...field}
                        onChange={(e) => onBudgetChange(e, field)}
                        placeholder="₦15,000,000"
                        className="h-12 w-full rounded-xl border border-gray-200 pr-3 pl-10 text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        value={formatBudget(field.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxBudget"
                render={({ field }) => (
                  <FormItem className="relative flex-1">
                    <span className="absolute top-5 left-3 z-10 -translate-y-[calc(50%+10px)] text-xs text-gray-400">
                      Max
                    </span>
                    <span className="absolute top-9 left-3 z-10 -translate-y-[calc(50%+10px)] text-lg font-bold text-gray-400">
                      ₦
                    </span>
                    <FormControl>
                      <input
                        {...field}
                        onChange={(e) => onBudgetChange(e, field)}
                        placeholder="₦25,000,000"
                        value={formatBudget(field.value)}
                        className="h-12 w-full rounded-xl border border-gray-200 pr-3 pl-10 text-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormInput
            control={form.control}
            name="noOfOpenings"
            label={
              <>
                Number of Openings<span className="text-red-500">*</span>
              </>
            }
            type="number"
            placeholder="1"
          />

          <FormField
            control={form.control}
            name="urgency"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>
                  Urgency<span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                    className="flex items-center gap-4"
                  >
                    {urgencyLevels.map((urgency) => (
                      <FormItem
                        key={urgency.value}
                        className="flex items-center space-y-0 space-x-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={urgency.value} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {urgency.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  Expected Start Date<span className="text-red-500">*</span>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="h-12 w-full justify-between rounded-xl bg-gray-50 text-left text-sm font-normal"
                      >
                        {field.value
                          ? format(field.value, 'PPP')
                          : 'Pick a date'}
                        <img
                          src={CalendarIcon}
                          alt="Calendar Icon"
                          className="ml-2"
                        />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
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

          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>
                  Reason for Hire<span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                    className="flex items-center gap-4"
                  >
                    {reasons.map((reason) => (
                      <FormItem
                        key={reason.value}
                        className="flex items-center space-y-0 space-x-0"
                      >
                        <FormControl>
                          <RadioGroupItem value={reason.value} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {reason.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="detailedReason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Detailed Reason</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Textarea
                      placeholder="Explain with details the reasons for this hire and how it benefits the company"
                      className="min-h-32 resize-none"
                      maxLength={200}
                      {...field}
                    />
                    <div className="text-muted-foreground mt-1 text-right text-xs">
                      {field.value?.length || 0}/200
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-[#3b07bb] py-3 font-medium text-white shadow-sm transition-colors hover:bg-[#2f0596]"
          >
            {initialData ? 'Update Requisition' : 'Preview Requisition'}
          </button>
        </form>
      </Form>
    </div>
  );
}
