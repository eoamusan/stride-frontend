import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router';
import EmailForm from './_email';
import EnterOTP from './_enter-otp';
import NewPassword from './_new-password';

export default function ForgotPassword() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [direction, setDirection] = useState(0);

  // Map step names to numbers for internal state management
  const stepMapping = {
    email: 0,
    'enter-otp': 1,
    'new-password': 2,
  };

  const reverseStepMapping = {
    0: 'email',
    1: 'enter-otp',
    2: 'new-password',
  };

  // Get current step from URL params, default to 'email' (0)
  const urlStepName = searchParams.get('step') || 'email';
  const currentStep = stepMapping[urlStepName] || 0;
  const [step, setStep] = useState(currentStep);

  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Mark as not initial load after component mounts
    setIsInitialLoad(false);
  }, []);

  // Update URL when step changes
  useEffect(() => {
    const stepName = reverseStepMapping[step];
    if (step === 0) {
      // Remove step param for the first step to keep URL clean
      searchParams.delete('step');
    } else {
      searchParams.set('step', stepName);
    }
    setSearchParams(searchParams);
  }, [step, searchParams, setSearchParams]);

  // Update local step state when URL changes (e.g., back/forward navigation)
  useEffect(() => {
    const urlStepName = searchParams.get('step') || 'email';
    const urlStep = stepMapping[urlStepName] || 0;
    if (urlStep !== step) {
      setStep(urlStep);
    }
  }, [searchParams]);

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
