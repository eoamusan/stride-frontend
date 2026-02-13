import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import CalendarIcon from '@/assets/icons/calendar-search.svg';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import { CustomButton } from '@/components/customs';

const reminderSchema = z.object({
  reminderDate: z.date({ message: 'Reminder date is required' }),
  message: z.string().min(1, { message: 'Message is required' }),
});

export default function SetReminderModalContent({
  employee,
  courseName,
  onBack,
  onSubmit,
}) {
  const form = useForm({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      reminderDate: new Date(),
      message: '',
    },
  });

  const handleFormSubmit = (data) => {
    onSubmit &&
      onSubmit({
        ...data,
        reminderDate: format(data.reminderDate, 'yyyy-MM-dd'),
      });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4"
      >
        <div className="flex items-center gap-1 rounded-lg border bg-gray-100 px-3 py-4">
          <img
            src={
              employee.avatar ??
              'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
            }
            alt={employee.name}
            className="h-12 w-12 rounded-full object-cover"
          />
          <div className="space-y-2">
            <div className="text-sm font-medium">{employee.name}</div>
            <div className="text-xs text-gray-500">
              {employee.role ?? 'Product Manger'}
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Course Name</label>
          <Input
            value={courseName}
            readOnly
            className="cursor-not-allowed bg-gray-100 py-6"
          />
        </div>

        <FormField
          control={form.control}
          name="reminderDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reminder Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-16 w-full justify-between rounded-xl py-6 text-left text-sm font-normal"
                  >
                    {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                    <img
                      src={CalendarIcon}
                      alt="Calendar Icon"
                      className="ml-2"
                    />
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

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter your message"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-3">
          <CustomButton variant="outline" type="button" onClick={onBack}>
            Back
          </CustomButton>
          <CustomButton type="submit">Submit</CustomButton>
        </div>
      </form>
    </Form>
  );
}
