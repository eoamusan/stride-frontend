import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, name: 'Personal Details' },
  { id: 2, name: 'Business Information' },
  { id: 3, name: 'Contact' },
  { id: 4, name: 'Attachments' },
  { id: 5, name: 'Bank Details' },
];

export default function StepIndicator({ currentStep, completedSteps }) {
  return (
    <div className="relative flex w-full items-center justify-center px-4 py-6">
      {STEPS.map((step) => (
        <div key={step.id} className="flex w-full justify-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'z-40 flex size-5 items-center justify-center rounded-full border-2 text-sm font-semibold',
                completedSteps.includes(step.id)
                  ? 'border-[#254C00] bg-[#254C00] text-white'
                  : currentStep === step.id
                    ? 'border-[#254C00] bg-[#254C00] text-white'
                    : 'border-gray-300 bg-white text-gray-400'
              )}
            >
              {currentStep === step.id && <Check className="size-3" />}
            </div>
            <span
              className={cn(
                'mt-2 text-xs font-medium',
                completedSteps.includes(step.id) || currentStep === step.id
                  ? 'text-gray-900'
                  : 'text-gray-400'
              )}
            >
              {step.name}
            </span>
          </div>
        </div>
      ))}

      <div
        className={
          'absolute top-[33px] mx-2 h-0.5 w-3/4 items-start bg-gray-300'
        }
      >
        <span
          style={{
            width: 100 * (currentStep / 5) + '%',
          }}
          className={`block h-0.5 bg-[#254C00]`}
        ></span>
      </div>
    </div>
  );
}
