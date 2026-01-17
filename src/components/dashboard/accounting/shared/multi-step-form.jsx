import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";

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

  const getConnectorWidth = (index) => {
    const current = widths[index] ?? 0
    const next = widths[index + 1] ?? 0
    return Math.max(current, next)
  }


  return (
    <div className="flex items-start justify-center mb-4 gap-2">
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

          {/* Connector */}
          {index !== totalSteps - 1 && (
            <>
            <div
              style={{ width: getConnectorWidth(index) + 'px' }}
              className={cn(
                "absolute top-2.5  h-0.5 transform -right-12.5",
                index < currentStep ? "bg-[#254C00]" : `bg-gray-400`
              )}
            /></>
          )}
        </div>
      ))}
    </div>
  )
}

export default function MultiStepForm({
  steps,
  initialValues,
  onSubmit,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState(initialValues || {});

  const totalSteps = steps.length;
  const isLastStep = currentStep === totalSteps - 1;

  const handleNext = (values) => {
    console.log('values', values);
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
      {/* <div className="flex gap-2 justify-end mt-4">
        <Button variant="secondary" onClick={handleBack} disabled={currentStep === 0}  className="h-10 px-10 text-sm rounded-3xl">
          Back
        </Button>
        <Button
          type="submit"
          className="h-10 px-10 text-sm rounded-3xl"
          onClick={() => handleNext(formValues)}
        >
          {isLastStep ? "Submit" : "Next"}
        </Button>
      </div> */}
    </div>
  );
} 