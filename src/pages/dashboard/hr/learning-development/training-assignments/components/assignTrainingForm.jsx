import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { FormSelect } from '@/components/customs';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';

const assignTrainingSchema = z.object({
  course: z.string().min(1, { message: 'Course is required' }),
  assignTo: z.string().min(1, { message: 'Assign to is required' }),
  dueDate: z.date({ message: 'Due date is required' }),
  mandatory: z.boolean().default(true),
  notes: z.string().optional(),
});

export default function AssignTrainingForm({ open, onOpenChange, onSave }) {
  const form = useForm({
    resolver: zodResolver(assignTrainingSchema),
    defaultValues: {
      course: '',
      assignTo: '',
      dueDate: new Date(),
      mandatory: true,
      notes: '',
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset({
        course: '',
        assignTo: '',
        dueDate: new Date(),
        mandatory: true,
        notes: '',
      });
    }
  }, [open, form]);

  const onFormSubmit = async (formData) => {
    const trainingData = {
      courseName: courseOptions.find((c) => c.value === formData.course)?.label,
      assignedTo: {
        name: employeeOptions.find((e) => e.value === formData.assignTo)?.label,
        avatar: '',
      },
      dueDate: format(formData.dueDate, 'yyyy-MM-dd'),
      priority: formData.mandatory ? 'Mandatory' : 'Optional',
      status: 'Assigned',
      notes: formData.notes,
    };

    if (onSave) await onSave(trainingData);
    if (onOpenChange) onOpenChange(false);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Select Course */}
        <FormSelect
          control={form.control}
          name="course"
          label="Select Course"
          placeholder="Choose a course..."
          options={courseOptions}
        />

        {/* Assign to */}
        <FormSelect
          control={form.control}
          name="assignTo"
          label="Assign to"
          placeholder="Select an employee..."
          options={employeeOptions}
        />

        {/* Due Date */}
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-16 w-full justify-start rounded-xl py-6 text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                  </Button>
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

        {/* Mandatory Training Switch */}
        <FormField
          control={form.control}
          name="mandatory"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold">
                      Mandatory Training
                    </h3>
                    <p className="text-xs text-gray-500">
                      Employees must complete this training by the due date.
                    </p>
                  </div>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add optional notes about the training assignment..."
                  className="h-24 rounded-xl"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-12 rounded-xl px-6"
          >
            Cancel
          </Button>
          <Button type="submit" className="h-12 rounded-xl px-6">
            Assign Training
          </Button>
        </div>
      </form>
    </Form>
  );
}

const courseOptions = [
  { value: 'advanced-react', label: 'Advanced React Patterns' },
  { value: 'data-privacy', label: 'Data Privacy Compliance' },
  { value: 'leadership', label: 'Leadership Skills Development' },
  { value: 'cloud-computing', label: 'Cloud Computing Basics' },
  { value: 'business-comm', label: 'Business Communication' },
  { value: 'python-ds', label: 'Python for Data Science' },
];

const employeeOptions = [
  { value: 'sarah-jenkins', label: 'Sarah Jenkins' },
  { value: 'michael-chen', label: 'Michael Chen' },
  { value: 'emily-rodriguez', label: 'Emily Rodriguez' },
  { value: 'james-wilson', label: 'James Wilson' },
  { value: 'jessica-lee', label: 'Jessica Lee' },
  { value: 'david-kumar', label: 'David Kumar' },
];
