import React from 'react';
import { ArrowLeft, History } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';

import { Badge } from '@/components/ui/badge';
import { CustomButton, ActivityTimeline } from '@/components/customs';

import SidebarCard from './sidebarCard';
import PayrollInfo from './payrollInfo';

import DeptIcon from '@/assets/icons/dept.svg';
import CalendarIcon from '@/assets/icons/calendar.svg';
import Avatar from '@/assets/icons/avatar.svg';
import SaveIcon from '@/assets/icons/save.svg';
import EditIcon from '@/assets/icons/edit.svg';
import BlueGraph from '@/assets/icons/blue-graph.svg';
import GreenGraph from '@/assets/icons/green-graph.svg';
import YellowGraph from '@/assets/icons/yellow-graph.svg';
import DeleteIcon from '@/assets/icons/delete.svg';
import ApproveIcon from '@/assets/icons/approve.svg';
import BankIcon from '@/assets/icons/bank.svg';
import CardIcon from '@/assets/icons/card.svg';
import AccountIcon from '@/assets/icons/user-square.svg';
import DocumentIcon from '@/assets/icons/document.svg';

export default function PayrollDetail({
  data,
  initialMode,
  onBack,
  isFrozen = false,
}) {
  const isInitialEdit = initialMode === 'edit';
  const [isEditing, setIsEditing] = React.useState(isInitialEdit && !isFrozen);

  const defaultValues = {
    basicSalary: '₦145,000',
    housingAllowance: '₦145,000',
    transportAllowance: '₦145,000',
    utilityAllowance: '₦145,000',
    employeePension: '₦14,500',
    payeTax: '₦10,000',
    grossPay: '₦145,000',
    netPay: '₦145,000',
  };

  const form = useForm({
    defaultValues,
  });

  const onSubmit = (values) => {
    console.log('Form submitted with values:', values);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    if (isFrozen) return;
    setIsEditing(true);
  };

  const handleSaveClick = form.handleSubmit(onSubmit);

  const info = [
    {
      title: 'Gross Pay',
      value: form.watch('grossPay') || '₦145,000',
      icon: GreenGraph,
    },
    {
      title: 'Deductions',
      value: '₦1,500',
      icon: BlueGraph,
    },
    {
      title: 'Net Pay',
      value: form.watch('netPay') || '₦145,000',
      icon: YellowGraph,
    },
  ];

  const bankDetails = [
    {
      title: 'Bank Name',
      value: data?.bankName ?? 'First Bank Plc',
      icon: BankIcon,
    },
    {
      title: 'Account Number',
      value: data?.accountNumber ?? '**** **** 4589',
      icon: CardIcon,
    },
    {
      title: 'Account Name',
      value: data?.accountName ?? data?.employeeName ?? 'Nathaniel Desire',
      icon: AccountIcon,
    },
    {
      title: 'Pay Date',
      value: data?.payDate ?? 'March 28, 2025',
      icon: CalendarIcon,
    },
  ];

  const activityLogItems = [
    {
      title: 'Payroll Calculated',
      description: 'by System • May 12, 2024, 10:30 AM',
      status: 'completed',
    },
    {
      title: 'Payroll Approved',
      description: 'Pending',
      status: 'pending',
    },
    {
      title: 'Payment Processed',
      description: 'Pending',
      status: 'pending',
    },
  ];

  React.useEffect(() => {
    if (isFrozen && isEditing) {
      setIsEditing(false);
    }
  }, [isFrozen, isEditing]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-lg font-bold"
        >
          <ArrowLeft className="h-5 w-5" /> View Payroll
        </button>
      </div>

      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div className="overflow-hidden rounded-full bg-purple-200">
            <img src={Avatar} alt="avatar" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="space-y-1">
              <h5 className="font-semibold">{data?.employeeName}</h5>
              <p className="text-sm font-medium text-gray-700">{data?.role}</p>
            </div>

            <div className="flex gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1 text-gray-700">
                <img src={DeptIcon} alt="Department" /> Engineering Dept.
              </span>

              <span className="flex items-center gap-1 text-gray-700">
                <img src={CalendarIcon} alt="Calendar" className="h-6 w-6" />{' '}
                March 2025
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-4">
          <Badge
            variant="success"
            className="border-0 bg-green-100 px-4 py-1 text-sm text-green-600"
          >
            {isFrozen ? 'Approved' : 'Calculated'}
          </Badge>

          {isFrozen ? (
            <CustomButton className="rounded-xl py-6 text-sm">
              <img src={DocumentIcon} alt="Download Payslip" className="mr-1" />
              Download Payslip
            </CustomButton>
          ) : isEditing ? (
            <CustomButton onClick={handleSaveClick}>
              <img src={SaveIcon} alt="Save Changes" className="mr-1" />
              Save Changes
            </CustomButton>
          ) : (
            <CustomButton
              className="rounded-xl py-6 text-sm"
              onClick={handleEditClick}
            >
              <img src={EditIcon} alt="Edit Payroll" className="mr-1" />
              Edit Payroll
            </CustomButton>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 space-y-6 lg:col-span-8">
          <div className="grid grid-cols-3 gap-4">
            {info.map((item, i) => (
              <div
                key={i}
                className="space-y-0 rounded-xl border border-gray-100 bg-white p-4"
              >
                <p className="text-black-100 text-sm">{item.title}</p>

                <div className="flex items-end justify-between">
                  <p className="text-base font-bold">{item.value}</p>
                  <img src={item.icon} alt="graph" className="h-16 w-16" />
                </div>
              </div>
            ))}
          </div>

          <FormProvider {...form}>
            <PayrollInfo isEditing={isEditing} />
          </FormProvider>
        </div>

        <div className="col-span-12 space-y-6 lg:col-span-4">
          <SidebarCard title="Bank Information">
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 text-xs">
              {bankDetails.map((detail) => (
                <div key={detail.title} className="space-y-4">
                  <p className="text-black-100 text-sm font-medium">
                    {detail.title}
                  </p>
                  <div className="flex items-center gap-2 py-2">
                    <img
                      src={detail.icon}
                      alt={detail.title}
                      className="h-6 w-6"
                    />
                    <p className="text-xs">{detail.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </SidebarCard>

          <SidebarCard
            title="Activity Log"
            icon={<History className="h-4 w-4" />}
          >
            <ActivityTimeline items={activityLogItems} className="pt-2" />
          </SidebarCard>
        </div>
      </div>

      {/* Bottom Actions - only shown in view mode */}
      {!isEditing && (
        <div className="flex gap-4">
          <CustomButton className="w-48 text-xs">
            <img src={ApproveIcon} alt="Approve" className="mr-1" />
            {isFrozen ? 'Mark as Paid' : 'Approve'}
          </CustomButton>

          <CustomButton
            variant="outline"
            className="w-48 border-red-200 bg-transparent text-xs text-red-500"
          >
            <img src={DeleteIcon} alt="Delete" className="mr-1" />
            Remove
          </CustomButton>
        </div>
      )}
    </div>
  );
}
