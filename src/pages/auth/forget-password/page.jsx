import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmailForm from './_email';
import EnterOTP from './_enter-otp';
import NewPassword from './_new-password';

export default function ForgotPassword() {
  const [step, setStep] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [direction, setDirection] = useState(0);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Mark as not initial load after component mounts
    setIsInitialLoad(false);
  }, []);

  const nextStep = () => {
    setDirection(1);
    setStep((s) => s + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  const slideTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.5,
  };

  return (
    <div className="relative">
      <AnimatePresence mode="sync" custom={direction}>
        {step === 0 && (
          <motion.div
            key="email-form"
            custom={direction}
            variants={slideVariants}
            initial={isInitialLoad ? 'center' : 'enter'}
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="w-full"
          >
            <EmailForm
              setNext={nextStep}
              setFormData={setFormData}
              formData={formData}
            />
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="enter-otp"
            custom={direction}
            variants={slideVariants}
            initial={isInitialLoad ? 'center' : 'enter'}
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="w-full"
          >
            <EnterOTP
              setBack={prevStep}
              setNext={nextStep}
              setFormData={setFormData}
              formData={formData}
            />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="new-password"
            custom={direction}
            variants={slideVariants}
            initial={isInitialLoad ? 'center' : 'enter'}
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="w-full"
          >
            <NewPassword
              setNext={nextStep}
              setFormData={setFormData}
              formData={formData}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
