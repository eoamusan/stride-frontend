import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { Edit2Icon, RotateCcwIcon } from 'lucide-react';
import strideLogo from '@/assets/icons/stride.svg';
import { Link } from 'react-router';

const formSchema = z.object({
  otp: z.string().min(6).max(6).regex(/^\d+$/, 'OTP must be a 6-digit number'),
});

export default function EnterOTP({ setBack, setNext, setFormData, formData }) {
  const [timeLeft, setTimeLeft] = useState(90); // 1 minute and 30 seconds in seconds

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: formData?.otp || '',
    },
  });

  useEffect(() => {
    if (timeLeft === 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((time) => time - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const onSubmit = (data) => {
    console.log(data);
    setFormData({ ...formData, ...data });
    setNext();
  };

  const handleResendOTP = () => {
    //logic here
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
            <h1 className="text-4xl font-semibold">Enter Your OTP</h1>
            <p className="mt-2 max-w-xs text-sm">
              A confirmation code has been sent to your email. Please enter it
              below.
            </p>
          </hgroup>
        </header>
        <main className="w-full max-w-[420px]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-4 space-y-6"
            >
              <div className="">
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem
                      className={'flex flex-col items-center justify-center'}
                    >
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={1} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={4} />
                          </InputOTPGroup>
                          <InputOTPGroup>
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex w-full justify-center">
                  {timeLeft > 0 ? (
                    <div className="flex w-full max-w-[300px] justify-end">
                      <p className="text-sm text-[#EF4444]">
                        {formatTime(timeLeft)}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-2.5 flex w-full max-w-[300px] justify-between">
                      <button
                        type="button"
                        className="flex cursor-pointer items-center gap-0.5 text-sm text-zinc-600"
                        onClick={setBack}
                      >
                        <Edit2Icon strokeWidth={3.5} className="size-3.5" />{' '}
                        Edit Email
                      </button>
                      <button
                        type="button"
                        className="flex cursor-pointer items-center gap-0.5 text-sm text-zinc-600"
                        onClick={handleResendOTP}
                      >
                        <RotateCcwIcon strokeWidth={3.5} className="size-3.5" />{' '}
                        Resend OTP
                      </button>
                    </div>
                  )}
                </div>
              </div>

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
