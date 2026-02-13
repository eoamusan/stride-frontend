import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { useJobRequisitionStore } from '@/stores/job-requisition-store';
import toast from 'react-hot-toast';
import {
  NumberInput,
  RadioInput,
  SelectInput,
  TextAreaInput,
  TextInput,
} from './inputs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import PreviewForm from './preview-form';

export default function ManpowerRequisitionForm({ onSuccess, initialData }) {
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createRequisition, updateRequisition } = useJobRequisitionStore();
  const [formData, setFormData] = useState({
    jobTitle: initialData?.jobTitle || '',
    department: initialData?.department || '',
    employmentType: initialData?.employmentType || '',
    detailedReason: initialData?.detailedReason || '',
    grade: initialData?.grade || '',
    minBudget: initialData?.minBudget || '',
    maxBudget: initialData?.maxBudget || '',
    noOfOpenings: initialData?.noOfOpenings || initialData?.openings || 1,
    reason: initialData?.reason || '',
    startDate: initialData?.startDate ? new Date(initialData.startDate) : undefined,
    urgency: initialData?.urgency ? (initialData.urgency === true ? 'High' : 'Low') : '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsPreview(true);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        jobTitle: formData.jobTitle,
        department: formData.department,
        employmentType: formData.employmentType,
        grade: formData.grade,
        minBudget: formData.minBudget,
        maxBudget: formData.maxBudget,
        noOfOpenings: `${formData.noOfOpenings}`,
        urgency: formData.urgency === 'High' ? true : false,
        reason: formData.reason,
        detailedReason: formData.detailedReason.slice(0, 200),
        startDate: formData.startDate,
      };

      if (initialData?._id || initialData?.id) {
        await updateRequisition({
          id: initialData._id || initialData.id,
          data: payload
        });
        toast.success('Requisition updated successfully');
      } else {
        await createRequisition({ data: payload });
        toast.success('Requisition created successfully');
      }

      setFormData({
        jobTitle: '',
        department: '',
        employmentType: '',
        detailedReason: '',
        grade: '',
        minBudget: '',
        maxBudget: '',
        noOfOpenings: 1,
        reason: '',
        startDate: '',
        urgency: true,
      });
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
      <>
        <PreviewForm
          formData={formData}
          handleFinalSubmit={handleFinalSubmit}
          isSubmitting={isSubmitting}
          setIsPreview={setIsPreview}
        />
      </>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl space-y-6"
      >
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
          {initialData ? 'Edit Man-Power Requisition Form' : 'Man-Power Requisition Form'}
        </h2>

        {/* Job Title */}
        <TextInput
          label="Job Title"
          name="jobTitle"
          placeholder="e.g Senior Software Engineer"
          value={formData.jobTitle}
          onChange={handleInputChange}
        />

        {/* Department */}
        <SelectInput
          label="Department"
          name="department"
          value={formData.department}
          onChange={handleInputChange}
          options={[
            { label: 'Select Department', value: '', disabled: true },
            { label: 'Engineering', value: 'engineering' },
            { label: 'Design', value: 'design' },
            { label: 'Marketing', value: 'marketing' },
            { label: 'Human Resources', value: 'hr' },
          ]}
        />

        {/* Employment Type */}
        <RadioInput
          label="Employment Type"
          name="employmentType"
          value={formData.employmentType}
          onChange={handleRadioChange}
          options={['Full Time', 'Contract', 'Internship']}
        />

        {/* Cadre */}
        <SelectInput
          label="Cadre"
          name="grade"
          value={formData.grade}
          onChange={handleInputChange}
          options={[
            {
              label: 'Select the role level or grade',
              value: '',
              disabled: true,
            },
            { label: 'Junior (L1-L2)', value: 'junior' },
            { label: 'Mid-Level (L3-L4)', value: 'mid' },
            { label: 'Senior (L5+)', value: 'senior' },
          ]}
        />

        {/* Budget Range & Number of Openings */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Budget Range{' '}
              <span className="text-xs text-gray-400">(Per Annum)</span>{' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-xs text-gray-400">
                  Min
                </span>
                <input
                  type="text"
                  name="minBudget"
                  placeholder="₦15,000,000"
                  className="w-full rounded-lg border border-gray-200 py-2.5 pr-3 pl-10 text-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  value={formData.minBudget}
                  onChange={handleInputChange}
                />
              </div>
              <div className="relative flex-1">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-xs text-gray-400">
                  Max
                </span>
                <input
                  type="text"
                  name="maxBudget"
                  placeholder="₦25,000,000"
                  className="w-full rounded-lg border border-gray-200 py-2.5 pr-3 pl-10 text-sm focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  value={formData.maxBudget}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <NumberInput
            label="Number of Openings"
            name="noOfOpenings"
            value={formData.noOfOpenings}
            onChange={handleInputChange}
          />
        </div>

        {/* Urgency */}
        <RadioInput
          label="Urgency"
          name="urgency"
          value={formData.urgency}
          onChange={handleRadioChange}
          options={['Low', 'High']}
        />

        {/* Expected Start Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Expected Start Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !formData.startDate && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.startDate ? (
                  format(formData.startDate, 'PPP')
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={(date) =>
                  handleInputChange({
                    target: { name: 'startDate', value: date },
                  })
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Reason for Hire */}
        <RadioInput
          label="Reason for Hire"
          name="reason"
          value={formData.reason}
          onChange={handleRadioChange}
          options={['New Role', 'Replacement', 'Growth']}
        />

        {/* Detailed Reason */}
        <TextAreaInput
          label="Detailed Reason"
          name="detailedReason"
          placeholder="Explain with details the reasons for this hire and how it benefits the company"
          value={formData.detailedReason}
          onChange={handleInputChange}
          textLength={formData.detailedReason.length}
          maxLength={200}
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 w-full rounded-xl bg-[#3b07bb] py-3 font-medium text-white shadow-sm transition-colors hover:bg-[#2f0596]"
        >
          {initialData ? 'Update Requisition' : 'Preview Requisition'}
        </button>
      </form>
    </div>
  );
}
