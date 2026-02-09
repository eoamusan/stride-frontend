import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import strideLogo from '@/assets/icons/stride.svg';

export default function OTPModal({ open, onOpenChange, onSubmit }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(59);
  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (open && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [open, timer]);

  // Reset timer when modal opens
  useEffect(() => {
    if (open) {
      setTimer(59);
      setOtp(['', '', '', '', '', '']);
    }
  }, [open]);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);

    // Focus last filled input or next empty
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = () => {
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      onSubmit?.(otpValue);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-136.5 p-8">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <img src={strideLogo} alt="Oneda" className="mb-8 w-32.75" />

          {/* Header */}
          <DialogHeader className="mb-4 text-center">
            <DialogTitle className="text-3xl font-semibold">
              Please Enter OTP
            </DialogTitle>
          </DialogHeader>

          {/* Description */}
          <p className="mb-6 text-center text-sm text-gray-600">
            A confirmation code has been sent to your email.
            <br />
            Please enter it below.
          </p>

          {/* OTP Inputs */}
          <div className="mb-4 flex gap-3">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="h-13 w-13 text-center text-xl"
              />
            ))}
          </div>

          {/* Timer */}
          <div className="w-full max-w-93">
            <p className="mb-6 text-right text-sm text-red-500">
              {formatTime(timer)}
            </p>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={otp.join('').length !== 6 || timer === 0}
            className="h-12 w-full max-w-81.75"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
