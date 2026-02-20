import { useParams, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  CreditCard,
  Download,
  Eye,
  FileText,
  User,
  Briefcase,
  Landmark,
  BadgeCheck,
} from 'lucide-react';
import { hrValidationDummyData } from '../dummyData';
import { CustomButton } from '@/components/customs';
import { Badge } from '@/components/ui/badge';

import CalendarIcon from '@/assets/icons/calendar.svg';
import SaveIcon from '@/assets/icons/save.svg';
import DepartmentIcon from '@/assets/icons/dept.svg';
import UserIcon from '@/assets/icons/user.svg';
import BriefcaseTimer from '@/assets/icons/brifecase-timer.svg';
import MailIcon from '@/assets/icons/mail.svg';
import PhoneIcon from '@/assets/icons/phone.svg';
import LocationIcon from '@/assets/icons/location.svg';

import Fields from '@/components/dashboard/hr/overview/fields';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), 'MMM dd, yyyy');
  } catch (e) {
    return dateString;
  }
};
export default function HrValidationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const employee = hrValidationDummyData.find((e) => e.id === id);

  if (!employee) {
    return <div>Employee not found</div>;
  }

  const DocumentCard = ({ doc }) => (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <p
            className="max-w-[150px] truncate font-medium text-gray-900"
            title={doc.name}
          >
            {doc.name}
          </p>
          <p className="text-xs text-gray-500">{doc.type}</p>
        </div>
      </div>
      <div className="flex gap-2 text-gray-400">
        <button className="hover:text-gray-600">
          <Eye className="h-4 w-4" />
        </button>
        <button className="hover:text-gray-600">
          <Download className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="mx-auto min-h-screen space-y-6 p-6 font-sans text-gray-900">
      {/* Navigation */}
      <nav className="flex items-center gap-4 lg:col-span-3">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => navigate('/dashboard/hr/onboarding/hr-validation')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <p className="text-2xl font-bold text-gray-900">Data Validation</p>
      </nav>

      {/* Header Profile Card */}
      <div className="flex flex-col items-end justify-between gap-4 md:flex-row md:items-center lg:col-span-3">
        <header className="flex w-full items-end gap-4">
          <div className="flex w-full flex-col gap-4 md:w-156 md:flex-row md:items-center md:gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#B190B6] md:h-34 md:w-34">
              <Briefcase className="h-14 w-14 text-white md:h-24 md:w-24" />
            </div>
            <div className="flex flex-col gap-2">
              <hgroup className="space-y-1">
                <h1 className="font-semibold">{employee.employeeName}</h1>
                <p className="text-sm font-medium text-gray-700">
                  {employee.role}
                </p>
              </hgroup>
              <div className="flex gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1 text-gray-700">
                  <img
                    src={DepartmentIcon}
                    alt="Calendar"
                    className="h-6 w-6"
                  />
                  {employee.department}
                </span>
                <span className="flex items-center gap-1 text-gray-700">
                  <img src={CalendarIcon} alt="Calendar" className="h-6 w-6" />
                  {formatDate(employee.startDate)}
                </span>
              </div>
            </div>
          </div>
          <Badge
            variant={
              employee.status === 'PENDING'
                ? 'info'
                : employee.status === 'APPROVED'
                  ? 'success'
                  : 'danger'
            }
            className="inline px-4 py-1 text-sm md:hidden"
          >
            {employee.status.charAt(0).toUpperCase() +
              employee.status.slice(1).toLowerCase()}
          </Badge>
        </header>

        <div className="flex w-full flex-col gap-2 md:w-auto md:items-end md:gap-8">
          <Badge
            variant={
              employee.status === 'PENDING'
                ? 'info'
                : employee.status === 'APPROVED'
                  ? 'success'
                  : 'danger'
            }
            className="hidden px-4 py-1 text-sm md:inline"
          >
            {employee.status.charAt(0).toUpperCase() +
              employee.status.slice(1).toLowerCase()}
          </Badge>

          <div className="flex w-full justify-end md:gap-4">
            <CustomButton className="inline-flex w-5/11 rounded-xl py-6 text-sm md:w-auto">
              <img src={SaveIcon} alt="Save Changes" className="mr-1" />
              View offer Letter
            </CustomButton>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <section className="space-y-10 rounded-2xl bg-white p-8 lg:col-span-2">
        <h2 className="font-semibold">Personal information</h2>

        <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          <Fields
            icon={<img src={UserIcon} alt="UserIcon" className="h-6 w-6" />}
            header="Name"
            title={employee.personalInfo?.name}
          />
          <Fields
            icon={<img src={MailIcon} alt="MailIcon" className="h-6 w-6" />}
            header="Email Address"
            title={employee.personalInfo?.email}
          />
          <Fields
            icon={<img src={PhoneIcon} alt="PhoneIcon" className="h-6 w-6" />}
            header="Phone"
            title={employee.personalInfo?.phone}
          />
          <Fields
            icon={<img src={UserIcon} alt="UserIcon" className="h-6 w-6" />}
            header="Gender"
            title={employee.personalInfo?.gender}
          />
          <Fields
            icon={
              <img src={CalendarIcon} alt="CalendarIcon" className="h-6 w-6" />
            }
            header="Date of Birth"
            title={employee.personalInfo?.dob}
          />
          <Fields
            icon={<img src={UserIcon} alt="UserIcon" className="h-6 w-6" />}
            header="Employee ID"
            title={employee.personalInfo?.employeeId}
          />
          <Fields
            icon={
              <img
                src={BriefcaseTimer}
                alt="BriefcaseTimer"
                className="h-6 w-6"
              />
            }
            header="Job Title"
            title={employee.personalInfo?.jobTitle}
          />
          <Fields
            icon={
              <img
                src={DepartmentIcon}
                alt="BuildingIcon"
                className="h-6 w-6"
              />
            }
            header="Department"
            title={employee.personalInfo?.department}
          />
          <Fields
            icon={
              <img src={CalendarIcon} alt="ClockIcon" className="h-6 w-6" />
            }
            header="Employment Type"
            title={employee.personalInfo?.employmentType}
          />
          <Fields
            icon={<img src={LocationIcon} alt="MapIcon" className="h-6 w-6" />}
            header="Home Address"
            title={employee.personalInfo?.address}
          />
          <Fields
            icon={<img src={LocationIcon} alt="MapIcon" className="h-6 w-6" />}
            header="State/Country"
            title={employee.personalInfo?.state}
          />
          <Fields
            icon={<img src={UserIcon} alt="UserIcon" className="h-6 w-6" />}
            header="Line Manager"
            title={employee.personalInfo?.lineManager}
          />
        </div>
      </section>

      {/* Bank & Payroll */}
      <section className="space-y-10 rounded-2xl bg-white p-8 lg:col-span-2">
        <h2 className="font-semibold">Bank & Payroll</h2>
        <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          <Fields
            icon={<Landmark />}
            header="Bank Name"
            title={employee.bankInfo?.bankName}
          />
          <Fields
            icon={<User />}
            header="Account Name"
            title={employee.bankInfo?.accountName}
          />

          <Fields
            icon={<User />}
            header="Account Name"
            title={employee.bankInfo?.accountName}
          />
          <Fields
            icon={<CreditCard />}
            header="Account Number"
            title={employee.bankInfo?.accountNumber}
          />
          <Fields
            icon={<BadgeCheck />}
            header="Salary Amount"
            title={employee.bankInfo?.salaryAmount}
          />
          <Fields
            icon={<FileText />}
            header="Tax ID"
            title={employee.bankInfo?.taxId}
          />
          <Fields
            icon={<BadgeCheck />}
            header="BVN"
            title={employee.bankInfo?.bvn}
          />
        </div>
      </section>

      {/* Uploaded Documents */}
      <section className="space-y-10 rounded-2xl bg-white p-8 lg:col-span-2">
        <h2 className="font-semibold">Uploaded Documents</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {employee.documents?.map((doc, idx) => (
            <DocumentCard key={idx} doc={doc} />
          ))}
        </div>
      </section>

      {/* Actions */}
      <footer className="mt-8 flex gap-3">
        <CustomButton className="inline-flex w-48 rounded-xl py-6 text-sm">
          <BadgeCheck className="mr-2 h-5 w-5" />
          Approve
        </CustomButton>

        <CustomButton
          variant="outline"
          className="w-48 rounded-xl border-green-500 bg-transparent py-6 text-xs text-green-500"
        >
          <FileText className="mr-2 h-5 w-5" />
          Request Correction
        </CustomButton>
      </footer>
    </div>
  );
}
