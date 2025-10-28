import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input, PasswordInput } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import GoogleIcon from '@/assets/icons/google.svg';
import { Link } from 'react-router';
import { Checkbox } from '@/components/ui/checkbox';
import strideLogo from '@/assets/icons/stride.svg';
import { useNavigate } from 'react-router';
import { useUserStore } from '@/stores/user-store';
import toast from 'react-hot-toast';
import AuthService from '@/api/auth';

const formSchema = z.object({
  email: z.email({
    message: 'Please enter a valid email address',
  }),
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
  remember_me: z.boolean().optional(),
});

export default function Login() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      remember_me: false,
    },
  });
  const navigate = useNavigate();
  const { login, isLoading, getBusinessData } = useUserStore();

  const onSubmit = async (data) => {
    try {
      const res = await login({ email: data.email, password: data.password });

      const currentMessage = useUserStore.getState().message;
      toast.success(currentMessage, {
        icon: '🎉',
      });
      await getBusinessData();

      if (res.account?.onboardingCompleted) {
        navigate('/dashboard');
      } else {
        navigate('/dashboard/onboarding');
      }
    } catch (err) {
      console.log(err);
      const currentMessage = useUserStore.getState().message;
      toast.error(currentMessage, {
        icon: '❌',
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await AuthService.google();
    } catch (err) {
      console.log(err);
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
            <h1 className="text-4xl font-semibold">Welcome Back</h1>
            <p className="mt-2 text-sm">Sign in to your account</p>
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className={'h-10'}
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          className={'h-10'}
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-2 flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name="remember_me"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={'text-xs'}>
                          <FormControl>
                            <Checkbox
                              onCheckedChange={field.onChange}
                              {...field}
                            />
                          </FormControl>
                          <span>Remember Me</span>
                        </FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Link to="/forgot-password" className="text-xs text-red-500">
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <Button
                className={'mt-2 h-10 w-full'}
                size={'lg'}
                type="submit"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Sign In
              </Button>
            </form>
            <Button
              size={'lg'}
              variant={'outline'}
              className={'mt-4 w-full'}
              onClick={handleGoogleSignIn}
            >
              <img src={GoogleIcon} alt="google" className="h-6 w-6" />
              Sign in with Google
            </Button>
            <p className="mt-5 mb-10 text-center text-sm">
              Not registered yet?{' '}
              <Link to="/register" className="text-primary font-semibold">
                Create Account
              </Link>
            </p>
          </Form>
        </main>
      </div>
    </div>
  );
}
