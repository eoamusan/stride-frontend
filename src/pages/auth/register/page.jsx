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
import strideLogo from '@/assets/icons/stride.svg';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { useUserStore } from '@/stores/user-store';

const formSchema = z
  .object({
    firstName: z
      .string()
      .min(2, {
        error: 'First name must be atleast 2 characters long',
      })
      .nonempty({
        error: 'First name is required',
      })
      .transform((val) => val.trim()),
    lastName: z
      .string()
      .min(2, {
        error: 'Last name must be atleast 2 characters long',
      })
      .nonempty({
        error: 'Last name is required',
      })
      .transform((val) => val.trim()),
    email: z.email(),
    phoneNumber: z
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
    confirmPassword: z
      .string()
      .nonempty({ error: 'Confirm password is required' })
      .transform((val) => val.trim()),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You need to accept the terms and conditions',
    }),
    marketing: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function Register() {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { register, isLoading } = useUserStore();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
      marketing: false,
    },
  });

  const onSubmit = async (data) => {
    const { _acceptTerms, ...payload } = data;
    try {
      await register(payload);

      // Get the fresh message from the store after the operation
      const currentMessage = useUserStore.getState().message;
      toast.success(currentMessage, {
        icon: '🎉',
      });
      navigate('/dashboard/onboarding');
    } catch (err) {
      console.log(err);
      // Get the fresh error message from the store
      const currentMessage = useUserStore.getState().message;
      toast.error(currentMessage, {
        icon: '❌',
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-16">
      <div className="mx-auto flex w-full max-w-[720px] flex-col items-center justify-center gap-4 rounded-xl py-10 max-md:px-[5%] md:border md:shadow-xl">
        <header>
          <Link to="/" className="mx-auto block w-[131px]">
            <img
              src={strideLogo}
              alt="Oneda"
              className="mx-auto block w-[131px]"
            />
          </Link>
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
                name="firstName"
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
                name="lastName"
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
                name="phoneNumber"
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
                name="confirmPassword"
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
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={'text-xs font-normal'}>
                        <FormControl>
                          <Checkbox
                            onCheckedChange={field.onChange}
                            {...field}
                          />
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
                  name="marketing"
                  render={({ field }) => (
                    <FormItem className={'flex'}>
                      <FormControl>
                        <Checkbox onCheckedChange={field.onChange} {...field} />
                      </FormControl>
                      <FormLabel className={'text-xs font-normal'}>
                        I agree to receive marketing messages from Oneda.
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                className={'mt-4 h-10 w-full'}
                size={'lg'}
                disabled={isLoading}
                isLoading={isLoading}
                type="submit"
              >
                Create Account
              </Button>
            </form>
            <p className="mt-2 text-center text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold">
                Log In
              </Link>
            </p>
          </Form>
        </main>
      </div>
    </div>
  );
}
