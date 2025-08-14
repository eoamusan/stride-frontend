import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input, PasswordInput, PhoneNumberInput } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PasswordValidation from '@/components/ui/password-validation';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router';

const formSchema = z
  .object({
    first_name: z
      .string()
      .min(2, {
        error: 'First name must be atleast 2 characters long',
      })
      .nonempty({
        error: 'First name is required',
      })
      .transform((val) => val.trim()),
    last_name: z
      .string()
      .min(2, {
        error: 'Last name must be atleast 2 characters long',
      })
      .nonempty({
        error: 'Last name is required',
      })
      .transform((val) => val.trim()),
    business_name: z
      .string()
      .nonempty({
        error: 'Business name is required',
      })
      .transform((val) => val.trim()),
    email: z.email(),
    phone_number: z
      .string()
      .min(9, {
        error: 'Phone number must be atleast 9 characters long',
      })
      .max(15, {
        error: 'Phone number must be atmost 15 characters long',
      })
      .nonempty({
        error: 'Phone number is required',
      })
      .transform((val) => val.trim()),
    password: z
      .string()
      .min(6, {
        error: 'Password must be atleast 6 characters long',
      })
      .refine((val) => /[A-Z]/.test(val), {
        message: 'Password must contain at least 1 uppercase letter',
      })
      .refine((val) => /[a-z]/.test(val), {
        message: 'Password must contain at least 1 lowercase letter',
      })
      .refine((val) => /\d/.test(val), {
        message: 'Password must contain at least 1 number',
      })
      .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
        message: 'Password must contain at least 1 special character',
      })
      .nonempty({
        error: 'Password is required',
      })
      .transform((val) => val.trim()),
    confirm_password: z
      .string()
      .nonempty({ error: 'Confirm password is required' })
      .transform((val) => val.trim()),
    accept_terms: z.boolean().refine((val) => val === true, {
      message: 'You need to accept the terms and conditions',
    }),
    marketing_consent: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

export default function Register() {
  const [password, setPassword] = useState('');

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      business_name: '',
      email: '',
      phone_number: '',
      password: '',
      confirm_password: '',
      accept_terms: false,
      marketing_consent: false,
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-16">
      <div className="mx-auto flex w-full max-w-[720px] flex-col items-center justify-center gap-4 rounded-xl py-10 max-md:px-[5%] md:border md:shadow-xl">
        <header>
          <img
            src="./src/assets/icons/stride.svg"
            alt="Stride"
            className="mx-auto block w-[131px]"
          />
          <hgroup className="mt-6 text-center">
            <h1 className="text-4xl font-semibold">Get Started</h1>
            <p className="mt-2 text-sm">Kindly fill your information</p>
          </hgroup>
        </header>
        <main className="w-full max-w-[420px]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-4 space-y-6"
            >
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input className={'h-10'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input className={'h-10'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="business_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input className={'h-10'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input className={'h-10'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <PhoneNumberInput className={'h-10'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        className={'h-10'}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setPassword(e.target.value);
                        }}
                      />
                    </FormControl>
                    {password && <PasswordValidation password={password} />}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput className={'h-10'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="accept_terms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={'text-xs font-normal'}>
                        <FormControl>
                          <Checkbox {...field} />
                        </FormControl>
                        <span>
                          I have read and agree to the
                          <Link
                            to={'/terms-of-services'}
                            className="text-primary pl-1 font-medium"
                          >
                            Terms and Condition
                          </Link>
                        </span>
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="marketing_consent"
                  render={({ field }) => (
                    <FormItem className={'flex'}>
                      <FormControl>
                        <Checkbox {...field} />
                      </FormControl>
                      <FormLabel className={'text-xs font-normal'}>
                        I agree to receive marketing messages from Stride
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button className={'mt-4 h-10 w-full'} size={'lg'} type="submit">
                Create Account
              </Button>
            </form>
            <p className="mt-2 text-center text-sm">
              Already have an account?{' '}
              <Link className="text-primary font-semibold">Log In</Link>
            </p>
          </Form>
        </main>
      </div>
    </div>
  );
}
