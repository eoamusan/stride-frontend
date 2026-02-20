import React from 'react';

const Stepper = ({ currentStep, steps }) => {
  return (
    <div className="w-full py-6">
      <div className="relative flex justify-between items-start">
        {/* Dotted background line */}
        <div
          className="absolute top-[1.25rem] left-10 right-10 border-t-2 border-dotted border-gray-300 -z-0"
        />

        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div
              key={index}
              className="relative z-10 flex flex-col items-center gap-3 flex-1 min-w-0"
            >
              {/* Circle */}
              <div
                className={`
                  flex items-center justify-center 
                  w-10 h-10 rounded-full border-2 
                  transition-all duration-300
                  ${
                    isActive
                      ? 'text-black bg-white font-semibold shadow-md'
                      : isCompleted
                      ? 'border-green-600 bg-green-600 text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                  }
                `}
              >
                {isCompleted ? (
                  // Checkmark - white when completed
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  // Step number
                  <span className="text-base">{stepNumber}</span>
                )}
              </div>

              {/* Label */}
              <div className="mt-2 text-center">
                <h3
                  className={`
                    text-sm font-medium
                    ${isActive ? 'text-gray-900' : 'text-gray-500'}
                  `}
                >
                  {step.title}
                </h3>
                {step.description && (
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2 max-w-[140px]">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;