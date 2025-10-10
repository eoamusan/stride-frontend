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
import { PasswordInput } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PasswordValidation from '@/components/ui/password-validation';
import { useNavigate } from 'react-router';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import strideLogo from '@/assets/icons/stride.svg';
import checkmarkIcon from '@/assets/icons/checkmark.svg';
import { Link } from 'react-router';
import toast from 'react-hot-toast';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import AuthService from '@/api/auth';

const formSchema = z
  .object({
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
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

export default function NewPassword({ setFormData, formData }) {
  const [password, setPassword] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: formData?.password || '',
      confirm_password: formData?.confirm_password || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setSubmitLoading(true);
      const payload = {
        email: formData?.email || sessionStorage.getItem('reset-email'),
        otp: formData?.otp || sessionStorage.getItem('reset-otp'),
        password: data.password,
        confirmPassword: data.confirm_password,
      };
      await AuthService.resetPassword(payload);
      setFormData({ ...formData, ...data });
      setShowSuccessModal(true);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false);
    sessionStorage.removeItem('reset-email');
    sessionStorage.removeItem('reset-otp');
    navigate('/login');
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
            <h1 className="text-4xl font-semibold">Reset Password</h1>
            <p className="mt-2 text-sm">
              Your new password must be different from previous used passwords
            </p>
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        className={'h-10'}
                        placeholder="Enter your new password"
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
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        className={'h-10'}
                        placeholder="Confirm your new password"
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
                isLoading={submitLoading}
                disabled={submitLoading}
              >
                Reset Password
              </Button>
            </form>
          </Form>
        </main>
      </div>

      <SuccessModal
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        title={'Password Reset Successful!'}
        description={"You've successfully updated your password"}
        backText={'Login'}
        handleBack={handleSuccessConfirm}
      />
    </div>
  );
}
