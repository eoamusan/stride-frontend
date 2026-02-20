import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar as CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useJobRequisitionStore } from '@/stores/job-requisition-store';
import { useJobPostStore } from '@/stores/job-post-store';
import { toast } from 'react-hot-toast';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FormInput, FormSelect } from '@/components/customs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';

// ─── Schema ──────────────────────────────────────────────────────────────────
const jobPostingSchema = z.object({
  requisitionId: z.string().min(1, { message: 'Please select a requisition' }),
  title: z.string().min(1, { message: 'Job Title is required' }),
  department: z.string().optional(),
  requestedBy: z.string().optional(),
  openings: z.coerce.number().min(1).optional(),
  type: z.string().min(1, { message: 'Employment Type is required' }),
  location: z.string().min(1, { message: 'Location is required' }),
  deadline: z.date({ required_error: 'Application Deadline is required' }),
  cadre: z.string().min(1, { message: 'Cadre is required' }),
  description: z.string().optional(),
});

// ─── Static options ───────────────────────────────────────────────────────────
const departmentOptions = [
  { label: 'Engineering', value: 'Engineering' },
  { label: 'Product', value: 'Product' },
  { label: 'HR', value: 'HR' },
  { label: 'Marketing', value: 'Marketing' },
];

const employmentTypes = ['Full Time', 'Contract', 'Internship'];

const cadreOptions = [
  { label: 'Senior Management', value: 'Senior Management' },
  { label: 'Mid Level', value: 'Mid Level' },
  { label: 'Junior', value: 'Junior' },
];

const SALARY_MAP = {
  'Senior Management': '₦15,000,000 – ₦25,000,000',
  'Mid Level': '₦8,000,000 – ₦15,000,000',
  Junior: '₦3,000,000 – ₦8,000,000',
};

// ─── Input style shared across raw inputs ─────────────────────────────────────
const inputCls =
  'h-12 w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none transition-all focus:ring-2 focus:ring-blue-500';

// ─── Component ────────────────────────────────────────────────────────────────
export default function JobPostingForm({ onSuccess, initialData, onCancel }) {
  const [requirements, setRequirements] = useState([]);
  const [newRequirement, setNewRequirement] = useState('');
  const [responsibilities, setResponsibilities] = useState([]);
  const [newResponsibility, setNewResponsibility] = useState('');

  const { requisitions, fetchRequisitions } = useJobRequisitionStore();
  const { createJobPosting, updateJobPosting, updateJobStatus } =
    useJobPostStore();

  const form = useForm({
    resolver: zodResolver(jobPostingSchema),
    defaultValues: {
      requisitionId: '',
      title: '',
      department: '',
      requestedBy: '',
      openings: 1,
      type: 'Full Time',
      location: '',
      deadline: undefined,
      cadre: 'Senior Management',
      description: '',
    },
  });

  const watchedCadre = form.watch('cadre');

  useEffect(() => {
    fetchRequisitions(1, 100);
  }, []);

  // Pre-fill when editing an existing posting
  useEffect(() => {
    if (initialData) {
      form.reset({
        requisitionId:
          initialData.jobRequisitionId?._id ||
          initialData.jobRequisitionId ||
          '',
        title: initialData.title || initialData.jobTitle || '',
        department:
          initialData.jobRequisitionId?.department ||
          initialData.department ||
          '',
        location: initialData.location || '',
        type: initialData.employmentType || initialData.type || 'Full Time',
        deadline: initialData.deadline
          ? new Date(initialData.deadline)
          : undefined,
        cadre: initialData.cadre || 'Senior Management',
        description: initialData.description || '',
      });
      setRequirements(initialData.requirements || []);
      setResponsibilities(initialData.responsibilities || []);
    }
  }, [initialData, form]);

  // Auto-fill fields when a requisition is selected
  const handleRequisitionChange = (reqId) => {
    form.setValue('requisitionId', reqId, { shouldValidate: true });
    const req = requisitions.find((r) => (r._id || r.id) === reqId);
    if (req) {
      form.setValue('title', req.jobTitle || '');
      form.setValue('department', req.department || '');
      form.setValue('requestedBy', req.user || '');
      form.setValue('openings', req.noOfOpenings || 1);
    }
  };

  // Array helpers
  const addItem = (list, setList, value, setValue) => {
    if (!value.trim()) return;
    setList([...list, value.trim()]);
    setValue('');
  };
  const removeItem = (list, setList, index) =>
    setList(list.filter((_, i) => i !== index));

  // Final submission (called with resolved targetStatus)
  const handleFinalSubmit = async (data, targetStatus) => {
    const finalRequirements = [
      ...requirements,
      ...(newRequirement.trim() ? [newRequirement.trim()] : []),
    ].filter(Boolean);

    const finalResponsibilities = [
      ...responsibilities,
      ...(newResponsibility.trim() ? [newResponsibility.trim()] : []),
    ].filter(Boolean);

    if (targetStatus === 'Active') {
      if (!finalRequirements.length) {
        toast.error('Please add at least one requirement');
        return;
      }
      if (!finalResponsibilities.length) {
        toast.error('Please add at least one responsibility');
        return;
      }
    }

    try {
      const payload = {
        jobRequisitionId: data.requisitionId,
        title: data.title,
        employmentType: data.type,
        location: data.location,
        cadre: data.cadre,
        deadline: data.deadline
          ? new Date(data.deadline).toISOString()
          : undefined,
        description: data.description,
        status: targetStatus,
        requirements: finalRequirements,
        responsibilities: finalResponsibilities,
      };

      if (initialData) {
        await updateJobPosting({
          id: initialData._id || initialData.id,
          data: payload,
        });
        if (targetStatus) {
          await updateJobStatus({
            id: initialData._id || initialData.id,
            status: targetStatus,
          });
        }
        toast.success(
          targetStatus === 'Active'
            ? 'Job updated and posted successfully'
            : 'Job updated as draft'
        );
      } else {
        await createJobPosting(payload);
        toast.success(
          targetStatus === 'Active'
            ? 'Job posted successfully'
            : 'Job saved as draft'
        );
      }

      if (onSuccess) onSuccess(!!initialData, targetStatus);
    } catch (error) {
      console.error('Job posting error:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to post job');
    }
  };

  const submitWithStatus = (status) =>
    form.handleSubmit((data) => handleFinalSubmit(data, status))();

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-gray-100 pb-4">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1a5d1a] text-white">
            <Plus size={24} strokeWidth={3} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {initialData ? 'Edit Job Posting' : 'Post New Job'}
            </h2>
            <p className="text-sm text-gray-500">
              {initialData
                ? 'Update job details'
                : 'Create and publish a new job opening'}
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form className="w-full space-y-6 py-4">
          {/* Requisition select — native <select> for auto-fill logic */}
          <FormField
            control={form.control}
            name="requisitionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Create job from requisition{' '}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <select
                    className={inputCls}
                    value={field.value}
                    onChange={(e) => handleRequisitionChange(e.target.value)}
                  >
                    <option value="" disabled>
                      Select existing requisition
                    </option>
                    {requisitions.map((req) => (
                      <option key={req._id || req.id} value={req._id || req.id}>
                        {req.jobTitle} – {req.department}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Job Title (read-only, auto-filled) & Department */}
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Job Title <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      readOnly
                      placeholder="e.g. Senior Software Engineer"
                      className={inputCls}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormSelect
              control={form.control}
              name="department"
              label="Department"
              placeholder="Select Department"
              options={departmentOptions}
            />
          </div>

          {/* Requested By & Openings */}
          <div className="grid grid-cols-2 gap-6">
            <FormInput
              control={form.control}
              name="requestedBy"
              label="Requested By"
              placeholder="Hiring Manager Name"
              className="[&_input]:bg-gray-50"
            />
            <FormInput
              control={form.control}
              name="openings"
              label="Openings"
              type="number"
              placeholder="1"
              className="[&_input]:bg-gray-50"
            />
          </div>

          {/* Employment Type — RadioGroup */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>
                  Employment Type <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex items-center gap-6"
                  >
                    {employmentTypes.map((t) => (
                      <FormItem
                        key={t}
                        className="flex items-center space-y-0 space-x-2"
                      >
                        <FormControl>
                          <RadioGroupItem value={t} />
                        </FormControl>
                        <FormLabel className="font-normal">{t}</FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Location & Deadline */}
          <div className="grid grid-cols-2 gap-6">
            <FormInput
              control={form.control}
              name="location"
              label={
                <>
                  Location <span className="text-red-500">*</span>
                </>
              }
              placeholder="e.g Lagos, Nigeria"
              className="[&_input]:bg-gray-50"
            />

            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Application Deadline <span className="text-red-500">*</span>
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="h-12 w-full justify-start rounded-xl border border-gray-200 bg-gray-50 text-left text-sm font-normal transition-all"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span className="text-muted-foreground">
                              Pick a date
                            </span>
                          )}
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
          </div>

          {/* Cadre — native select (drives salary, not part of schema) */}
          <FormSelect
            control={form.control}
            name="cadre"
            label="Cadre"
            placeholder="Select Cadre"
            options={cadreOptions}
            className="[&_select]:bg-gray-50"
          />

          {/* Salary Info */}
          <div className="rounded-xl bg-purple-50 p-4 text-sm text-purple-900">
            Typical salary range for{' '}
            <span className="font-bold">"{watchedCadre}"</span> is{' '}
            <span className="font-bold">
              "{SALARY_MAP[watchedCadre] || '...'}"
            </span>
            .
          </div>

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the role..."
                    className="min-h-24 resize-none rounded-xl border-gray-200"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Responsibilities */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Responsibilities
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a responsibility…"
                className="h-12 flex-1 rounded-xl border border-gray-200 bg-white px-4 text-sm transition-all outline-none focus:ring-2 focus:ring-blue-500"
                value={newResponsibility}
                onChange={(e) => setNewResponsibility(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' &&
                  (e.preventDefault(),
                  addItem(
                    responsibilities,
                    setResponsibilities,
                    newResponsibility,
                    setNewResponsibility
                  ))
                }
              />
              <button
                type="button"
                onClick={() =>
                  addItem(
                    responsibilities,
                    setResponsibilities,
                    newResponsibility,
                    setNewResponsibility
                  )
                }
                className="rounded-xl bg-gray-100 p-3 hover:bg-gray-200"
              >
                <Plus size={18} />
              </button>
            </div>
            <ul className="list-disc space-y-1 pl-5">
              {responsibilities.map((item, index) => (
                <li
                  key={index}
                  className="group flex justify-between text-sm text-gray-600"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() =>
                      removeItem(responsibilities, setResponsibilities, index)
                    }
                    className="text-red-400 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Requirements
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a requirement…"
                className="h-12 flex-1 rounded-xl border border-gray-200 bg-white px-4 text-sm transition-all outline-none focus:ring-2 focus:ring-blue-500"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' &&
                  (e.preventDefault(),
                  addItem(
                    requirements,
                    setRequirements,
                    newRequirement,
                    setNewRequirement
                  ))
                }
              />
              <button
                type="button"
                onClick={() =>
                  addItem(
                    requirements,
                    setRequirements,
                    newRequirement,
                    setNewRequirement
                  )
                }
                className="rounded-xl bg-gray-100 p-3 hover:bg-gray-200"
              >
                <Plus size={18} />
              </button>
            </div>
            <ul className="list-disc space-y-1 pl-5">
              {requirements.map((item, index) => (
                <li
                  key={index}
                  className="group flex justify-between text-sm text-gray-600"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() =>
                      removeItem(requirements, setRequirements, index)
                    }
                    className="text-red-400 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full border border-green-700 px-8 py-2.5 text-sm font-medium text-green-700 hover:bg-green-50"
            >
              Cancel
            </button>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => submitWithStatus('Draft')}
                className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() =>
                  submitWithStatus(initialData ? initialData.status : 'Active')
                }
                className="rounded-full bg-[#3b07bb] px-8 py-2.5 text-sm font-medium text-white hover:bg-[#2f0596]"
              >
                {initialData ? 'Update Job' : 'Post Job'}
              </button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
