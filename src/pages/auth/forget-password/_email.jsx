import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
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
import AuthService from '@/api/auth';
import toast from 'react-hot-toast';

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
  const [submitLoading, setSubmitLoading] = useState(false);

  // Update form values when formData changes (e.g., when navigating back)
  useEffect(() => {
    const sessionEmail = sessionStorage.getItem('reset-email');
    if (sessionEmail || formData?.email) {
      form.reset({
        email: sessionEmail || formData.email,
      });
    }
  }, [formData, form]);

  const onSubmit = async (data) => {
    try {
      setSubmitLoading(true);
      await AuthService.forgotPassword(data);
      setFormData({ ...formData, ...data });
      toast.success('Reset link sent to your email');
      sessionStorage.setItem('reset-email', data.email);
      setNext();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          'Failed to send reset link. Please try again.'
      );
    } finally {
      setSubmitLoading(false);
    }
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
                disabled={submitLoading}
                isLoading={submitLoading}
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
