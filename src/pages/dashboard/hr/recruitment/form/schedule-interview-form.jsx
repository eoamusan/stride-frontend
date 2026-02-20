import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

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
const scheduleSchema = z.object({
  interviewType: z.string().min(1, { message: 'Interview Type is required' }),
  date: z.date({ required_error: 'Date is required' }),
  time: z.string().min(1, { message: 'Start Time is required' }),
  duration: z.string().min(1, { message: 'Duration is required' }),
  interviewer: z.string().min(1, { message: 'Interviewer(s) is required' }),
  location: z.string().optional(),
  notes: z
    .string()
    .max(300, { message: 'Must be 300 characters or less' })
    .optional(),
});

// ─── Options ─────────────────────────────────────────────────────────────────
const interviewTypes = [
  { label: 'Online', value: 'Online' },
  { label: 'In-person', value: 'In-person' },
  { label: 'Phone', value: 'Phone' },
];

const durationOptions = [
  { label: '30 mins', value: '30 mins' },
  { label: '1 hour', value: '1 hour' },
  { label: '1.5 hours', value: '1.5 hours' },
  { label: '2 hours', value: '2 hours' },
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function ScheduleInterviewForm({ onClose, initialData }) {
  const form = useForm({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      interviewType: 'Online',
      date: undefined,
      time: '',
      duration: '1 hour',
      interviewer: '',
      location: '',
      notes: '',
    },
  });

  // Pre-fill any initialData that matches field names
  useEffect(() => {
    if (initialData) {
      form.reset({
        interviewType: initialData.interviewType || 'Online',
        date: initialData.date ? new Date(initialData.date) : undefined,
        time: initialData.time || '',
        duration: initialData.duration || '1 hour',
        interviewer: initialData.interviewer || '',
        location: initialData.location || '',
        notes: initialData.notes || '',
      });
    }
  }, [initialData, form]);

  const onSubmit = (data) => {
    console.log('Schedule Interview submitted:', data);
    if (onClose) onClose();
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
          <CalendarIcon className="h-5 w-5 text-green-700" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Schedule Interview</h2>
      </div>

      {/* Info Banner */}
      <div className="mb-8 rounded-lg bg-[#F3E8FF] p-4 text-sm text-[#3300C9]">
        Setting up interview for{' '}
        <span className="font-bold">
          "{initialData?.applicantName || 'Candidate'}"
        </span>
        . An email invitation will be sent automatically.
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          {/* Interview Type — Radio */}
          <FormSelect
            control={form.control}
            name="interviewType"
            label={
              <>
                Interview Type <span className="text-red-500">*</span>
              </>
            }
            placeholder="Select interview type"
            options={interviewTypes}
          />

          {/* Date, Time, Duration — 3-column grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Date — Calendar Popover */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Date <span className="text-red-500">*</span>
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="h-12 w-full justify-between rounded-xl border-gray-200 text-sm font-normal"
                        >
                          {field.value
                            ? format(field.value, 'PPP')
                            : 'Pick a date'}
                          <CalendarIcon className="ml-2 h-4 w-4 text-gray-400" />
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

            {/* Start Time */}
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Start Time <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <input
                      type="time"
                      {...field}
                      className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-700 outline-none focus:border-[#3300C9] focus:ring-1 focus:ring-[#3300C9]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Duration */}
            <FormSelect
              control={form.control}
              name="duration"
              label={
                <>
                  Duration <span className="text-red-500">*</span>
                </>
              }
              placeholder="Select duration"
              options={durationOptions}
            />
          </div>

          {/* Interviewers */}
          <FormInput
            control={form.control}
            name="interviewer"
            label={
              <>
                Interviewers <span className="text-red-500">*</span>
              </>
            }
            placeholder="Search team members (separate with commas)"
          />

          {/* Meeting Link / Location */}
          <FormInput
            control={form.control}
            name="location"
            label="Meeting Link / Location"
            placeholder="Link is generated automatically if left blank"
          />

          {/* Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Textarea
                      placeholder="Add any notes or preparation instructions for the interview..."
                      className="min-h-28 resize-none"
                      maxLength={300}
                      {...field}
                    />
                    <div className="text-muted-foreground mt-1 text-right text-xs">
                      {field.value?.length || 0}/300
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-full border-gray-300 px-8 py-6 text-gray-700 hover:bg-gray-50"
            >
              Back
            </Button>
            <Button
              type="submit"
              className="rounded-full bg-[#3300C9] px-8 py-6 text-white hover:bg-[#2a00a8]"
            >
              Schedule Interview
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
