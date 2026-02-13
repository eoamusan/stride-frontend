import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Calendar } from '@/components/ui/calendar';
import { CustomButton } from '@/components/customs';
import CalendarIcon from '@/assets/icons/calendar.svg';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const renewSchema = z.object({
  newExpiryDate: z.date({ required_error: 'New expiry date is required' }),
});

export default function RenewCertificateModalContent({ onSubmit, onCancel }) {
  const renewForm = useForm({
    resolver: zodResolver(renewSchema),
    defaultValues: { newExpiryDate: null },
  });

  const handleSubmit = (data) => {
    onSubmit && onSubmit(data);
  };

  return (
    <FormProvider {...renewForm}>
      <div className="space-y-6">
        <div className="rounded-lg bg-purple-100 p-5">
          <p className="text-[13px] text-blue-700">
            Renewing:{' '}
            <span className="font-bold text-blue-700">
              "Certified Leadership Professional"
            </span>
          </p>
        </div>
        <form
          onSubmit={renewForm.handleSubmit(handleSubmit)}
          className="space-y-6"
        >
          <FormField
            control={renewForm.control}
            name="newExpiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Expiry Date</FormLabel>
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
          <div className="flex justify-end gap-2 pt-2">
            <CustomButton variant="outline" type="button" onClick={onCancel}>
              Cancel
            </CustomButton>
            <CustomButton type="submit">Renew Certificate</CustomButton>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
