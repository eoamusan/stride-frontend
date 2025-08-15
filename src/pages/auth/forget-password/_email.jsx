import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import strideLogo from '@/assets/icons/stride.svg';
import { Link } from 'react-router';

const formSchema = z.object({
  email: z.email({
    message: 'Please enter a valid email address',
  }),
});

export default function EmailForm({ setNext, setFormData, formData }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: formData?.email || '',
    },
  });

  // Update form values when formData changes (e.g., when navigating back)
  useEffect(() => {
    if (formData?.email) {
      form.reset({
        email: formData.email,
      });
    }
  }, [formData, form]);

  const onSubmit = (data) => {
    console.log(data);
    setFormData({ ...formData, ...data });
    setNext();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-16">
      <div className="mx-auto flex w-full max-w-[720px] flex-col items-center justify-center gap-4 rounded-xl py-10 max-md:px-[5%] md:border md:shadow-xl">
        <header>
          <Link to="/" className="mx-auto block w-[131px]">
            <img
              src={strideLogo}
              alt="Stride"
              className="mx-auto block w-[131px]"
            />
          </Link>
          <hgroup className="mt-6 text-center">
            <h1 className="text-4xl font-semibold">Forgot Password</h1>
            <p className="mt-2 text-sm">Recover your password</p>
          </hgroup>
        </header>
        <main className="w-full max-w-[420px]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-6 space-y-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        className={'h-10'}
                        type="email"
                        placeholder="Enter your email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className={'mt-2 mb-12 h-10 w-full'}
                size={'lg'}
                type="submit"
              >
                Submit
              </Button>
            </form>
          </Form>
        </main>
      </div>
    </div>
  );
}
