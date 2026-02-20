import { useState } from 'react';
import { useNavigate } from 'react-router';

import Stepper from '@/components/customs/stepper';
import Header from '@/components/customs/header';
import { Card, CardContent } from '@/components/ui/card';

import PeriodAndType from './steps/periodAndType';
import EmployeeSelection from './steps/employeeScope';
import PayrollPreview from './steps/preview';
import { useCreatePayrollMutation } from '@/hooks/api/useCreatePayrollMutation';

const defaultPeriodValues = () => ({
  month: String(new Date().getMonth() + 1).padStart(2, '0'),
  year: String(new Date().getFullYear()),
  payrollType: 'Regular Monthly Payroll',
  payDate: new Date(),
});

const defaultEmployeeScope = {
  allEligibleEmployees: true,
  filterByDepartment: false,
  departments: [],
  filterByCadres: false,
  cadres: [],
  specificEmployees: false,
  employees: [],
};

export default function RunPayroll() {
  const [currentStep, setCurrentStep] = useState(1);
  const [periodAndTypeData, setPeriodAndTypeData] = useState(() =>
    defaultPeriodValues()
  );
  const [employeeScopeData, setEmployeeScopeData] = useState(() => ({
    ...defaultEmployeeScope,
  }));
  const navigate = useNavigate();
  const { createPayrollHandler, isCreatePayrollLoading } =
    useCreatePayrollMutation();

  const steps = [
    { title: 'Period & Type', description: 'Select cycle details' },
    { title: 'Employee Scope', description: 'Who to include' },
    { title: 'Preview', description: 'Review summary' },
  ];

  const handlePeriodNext = (values) => {
    setPeriodAndTypeData(values);
    setCurrentStep(2);
  };

  const handleScopeNext = (scope) => {
    setEmployeeScopeData(scope);
    setCurrentStep(3);
  };

  const handleSubmitPayroll = async () => {
    const payload = {
      runPayroll: {
        month: periodAndTypeData?.month || '',
        year: periodAndTypeData?.year || '',
        payrollType: periodAndTypeData?.payrollType || '',
        payrollDate: periodAndTypeData?.payDate
          ? new Date(periodAndTypeData.payDate).toISOString()
          : null,
      },
      employeeScope: employeeScopeData || defaultEmployeeScope,
    };

    return createPayrollHandler(payload, {
      onSuccess: () => {
        navigate('/dashboard/hr/payroll/review');
      },
    });
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const getCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PeriodAndType
            defaultValues={periodAndTypeData}
            onBack={handleBack}
            onNext={handlePeriodNext}
          />
        );
      case 2:
        return (
          <EmployeeSelection
            defaultValues={employeeScopeData}
            onBack={handleBack}
            onNext={handleScopeNext}
          />
        );
      case 3:
        return (
          <PayrollPreview
            onBack={() => setCurrentStep(2)}
            runPayroll={periodAndTypeData}
            employeeScope={employeeScopeData}
            onSubmit={handleSubmitPayroll}
            isSubmitting={isCreatePayrollLoading}
          />
        );
      default:
        return (
          <PeriodAndType
            defaultValues={periodAndTypeData}
            onBack={handleBack}
            onNext={handlePeriodNext}
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
