import { useState } from 'react';

import Stepper from '@/components/customs/stepper';
import Header from '@/components/customs/header';
import { Card, CardContent } from '@/components/ui/card';

import PeriodAndType from './steps/periodAndType';
import EmployeeSelection from './steps/employeeScope';
import PayrollPreview from './steps/preview';

export default function RunPayroll() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { title: 'Period & Type', description: 'Select cycle details' },
    { title: 'Employee Scope', description: 'Who to include' },
    { title: 'Preview', description: 'Review summary' },
  ];

  const getCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PeriodAndType
            onBack={() => setCurrentStep((prev) => prev - 1)}
            onNext={() => setCurrentStep((prev) => prev + 1)}
          />
        );
      case 2:
        return (
          <EmployeeSelection
            onBack={() => setCurrentStep((prev) => prev - 1)}
            onNext={() => setCurrentStep((prev) => prev + 1)}
          />
        );
      case 3:
        return (
          <PayrollPreview
            onBack={() => setCurrentStep((prev) => prev - 1)}
            onNext={() => setCurrentStep((prev) => prev + 1)}
          />
        );
      default:
        return (
          <PeriodAndType
            onBack={() => setCurrentStep((prev) => prev - 1)}
            onNext={() => setCurrentStep((prev) => prev + 1)}
          />
        );
    }
  };

  return (
    <div className="my-5 flex flex-col gap-4">
      <Header
        title="Run Payroll"
        description="Setup and process payroll for your organization."
      ></Header>

      <Stepper currentStep={currentStep} steps={steps} />

      <Card className="mt-2 w-full border-0 shadow-none md:px-[98px] md:py-16">
        <CardContent>{getCurrentStep()}</CardContent>
      </Card>
    </div>
  );
}
