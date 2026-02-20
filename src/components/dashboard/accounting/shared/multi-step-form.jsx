import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ProgressBar from '@/components/dashboard/accounting/shared/progress-bar';

function StepIndicator({ isActive = true }) {
  return (
    <div className="flex flex-col items-center relative">
      <div
        className={cn(
          "flex items-center size-5 justify-center rounded-full text-sm font-medium z-20 border-2",
          isActive ? "border-[#254C00] bg-[#254C00] text-white" : "border-gray-300 bg-white"
        )}
      >
        {isActive && <Check className="size-3"  />}
      </div>
    </div>
  )
}

function Indicators({ totalSteps, currentStep, steps }) {
  const labelRefs = useRef([])
  const [widths, setWidths] = useState([])


  useLayoutEffect(() => {
    const measured = labelRefs.current.map(
      (el) => el?.offsetWidth ?? 0
    )
    setWidths(measured)
  }, [])
  
  const getFullConnectorWidth = () => {
    const totalWidth = widths.reduce((sum, w) => sum + w, 0)
    const firstStepInHalf = widths[0] / 2
    const lastStepInHalf = widths[widths.length - 1] / 2
    const spacing = 8 * widths.length

    return totalWidth - firstStepInHalf - lastStepInHalf + spacing
  }


  return (
    <div className="flex items-start justify-center mb-4 gap-2 relative">
      {steps.map((step, index) => (
        <div
          key={index}
          className="relative flex items-center"
        >
          <div className="flex flex-col">
            <StepIndicator
              number={index + 1}
              isActive={index <= currentStep}
              stepLabel={step.name}
            />
            <span ref={el => (labelRefs.current[index] = el)} className="mt-2 text-xs text-center font-medium">
              { step.name }
            </span>
          </div>
        </div>
      ))}
      {totalSteps > 1 && (
      <div
        style={{ width: getFullConnectorWidth() + 'px' }}
        className={cn(
          "absolute top-2.5  transform translate-x-[2%] bg-gray-400",
        )}
      >
        <ProgressBar variant="success" className="h-0.5" value={(currentStep / (totalSteps - 1)) * 100} />
      </div>
      )}
    </div>
  )
}

export default function MultiStepForm({
  steps,
  initialValues,
  onSubmit,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState({});

  const totalSteps = steps.length;
  const isLastStep = currentStep === totalSteps - 1;

  const handleNext = (values) => {
    const updatedValues = { ...formValues, ...values };
    setFormValues(updatedValues);
    if (isLastStep) {
      onSubmit(updatedValues);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const CurrentStepComponent = steps[currentStep].component;

  useEffect(() => {
    if (initialValues) {
      console.log("setting initial values in multi step form", initialValues)
      setFormValues(initialValues);
    }
  }, [initialValues]);

  return (
    <div>
      <Indicators totalSteps={totalSteps} currentStep={currentStep} steps={steps} />
      <CurrentStepComponent
        formValues={formValues}
        onNext={handleNext}
        onBack={handleBack}
        isLastStep={isLastStep}
        isFirstStep={currentStep === 0}
      />
    </div>
  );
} 