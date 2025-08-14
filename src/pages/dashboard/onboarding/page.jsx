import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Setup from './_setup';
import Goals from './_goals';

export default function Onboarding() {
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
            key="setup"
            custom={direction}
            variants={slideVariants}
            initial={isInitialLoad ? 'center' : 'enter'}
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="w-full"
          >
            <Setup
              setNext={nextStep}
              setFormData={setFormData}
              formData={formData}
            />
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="goals"
            custom={direction}
            variants={slideVariants}
            initial={isInitialLoad ? 'center' : 'enter'}
            animate="center"
            exit="exit"
            transition={slideTransition}
            className="w-full"
          >
            <Goals
              setBack={prevStep}
              setFormData={setFormData}
              formData={formData}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
