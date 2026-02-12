import { useParams, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Building2,
  Calendar,
  CreditCard,
  Download,
  Eye,
  FileText,
  Mail,
  MapPin,
  Phone,
  User,
  Briefcase,
  Clock,
  Landmark,
  BadgeCheck,
  Ban,
  CircleUser,
} from 'lucide-react';
import { hrValidationDummyData } from '../dummyData';

export default function HrValidationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const employee = hrValidationDummyData.find((e) => e.id === id);

  if (!employee) {
    return <div>Employee not found</div>;
  }

  // Helper for status badge style
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-[#FFF7E6] text-[#FF9500]';
      case 'Needs Correction':
        return 'bg-[#FFEBEE] text-[#FF3B30]';
      case 'Validated':
        return 'bg-[#E8F5E9] text-[#34C759]';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  const InfoField = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-gray-400">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="font-medium text-gray-900">{value || '-'}</p>
      </div>
    </div>
  );

  const DocumentCard = ({ doc }) => (
    <div className="flex items-center justify-between rounded-lg border border-gray-100 p-4 shadow-sm">
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
      <nav className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard/hr/onboarding/hr-validation')}
          className="-ml-2 h-8 w-8 text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-900">Data Validation</h1>
      </nav>

      {/* Header Profile Card */}
      <header className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gray-50 p-6 sm:flex-row sm:items-start">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow-sm">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.employeeName}`} // Placeholder avatar
                alt={employee.employeeName}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="space-y-1 pt-1">
            <h2 className="text-xl font-bold text-gray-900">
              {employee.employeeName}
            </h2>
            <p className="text-sm text-gray-500">{employee.role}</p>
            <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                {employee.department}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {employee.startDate}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-end gap-3 sm:mt-0">
          <span
            className={`rounded-full px-4 py-1.5 text-xs font-medium ${getStatusStyle(employee.status)}`}
          >
            {employee.status}
          </span>
          <Button className="flex items-center gap-2 rounded-lg bg-[#3300C9] text-white hover:bg-[#2a00a8]">
            <Eye className="h-4 w-4" />
            View Offer Letter
          </Button>
        </div>
      </header>

      {/* Personal Information */}
      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-6 text-lg font-bold text-gray-900">
          Personal Information
        </h3>
        <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          <InfoField
            icon={User}
            label="Name"
            value={employee.personalInfo?.name}
          />
          <InfoField
            icon={Mail}
            label="Email Address"
            value={employee.personalInfo?.email}
          />
          <InfoField
            icon={Phone}
            label="Phone"
            value={employee.personalInfo?.phone}
          />
          <InfoField
            icon={User}
            label="Gender"
            value={employee.personalInfo?.gender}
          />
          <InfoField
            icon={Calendar}
            label="Date of Birth"
            value={employee.personalInfo?.dob}
          />
          <InfoField
            icon={BadgeCheck}
            label="Employee ID"
            value={employee.personalInfo?.employeeId}
          />
          <InfoField
            icon={Briefcase}
            label="Job Title"
            value={employee.personalInfo?.jobTitle}
          />
          <InfoField
            icon={Building2}
            label="Department"
            value={employee.personalInfo?.department}
          />
          <InfoField
            icon={Clock}
            label="Employment Type"
            value={employee.personalInfo?.employmentType}
          />
          <InfoField
            icon={MapPin}
            label="Home Address"
            value={employee.personalInfo?.address}
          />
          <InfoField
            icon={MapPin}
            label="State/Country"
            value={employee.personalInfo?.state}
          />
          <InfoField
            icon={User}
            label="Line Manager"
            value={employee.personalInfo?.lineManager}
          />
        </div>
      </section>

      {/* Bank & Payroll */}
      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-6 text-lg font-bold text-gray-900">Bank & Payroll</h3>
        <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          <InfoField
            icon={Landmark}
            label="Bank Name"
            value={employee.bankInfo?.bankName}
          />
          <InfoField
            icon={User}
            label="Account Name"
            value={employee.bankInfo?.accountName}
          />
          <InfoField
            icon={CreditCard}
            label="Account Number"
            value={employee.bankInfo?.accountNumber}
          />
          <InfoField
            icon={BadgeCheck}
            label="Salary Amount"
            value={employee.bankInfo?.salaryAmount}
          />
          <InfoField
            icon={FileText}
            label="Tax ID"
            value={employee.bankInfo?.taxId}
          />
          <InfoField
            icon={BadgeCheck}
            label="BVN"
            value={employee.bankInfo?.bvn}
          />
        </div>
      </section>

      {/* Uploaded Documents */}
      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-gray-900">
          Uploaded Documents
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {employee.documents?.map((doc, idx) => (
            <DocumentCard key={idx} doc={doc} />
          ))}
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button className="h-12 w-full rounded-xl bg-[#3300C9] px-8 font-semibold text-white hover:bg-[#2a00a8] sm:w-auto">
          <BadgeCheck className="mr-2 h-5 w-5" />
          Approve
        </Button>
        <Button
          variant="outline"
          className="h-12 w-full rounded-xl border-gray-300 px-8 font-semibold text-gray-700 hover:bg-gray-50 sm:w-auto"
        >
          <FileText className="mr-2 h-5 w-5" />
          Request Correction
        </Button>
      </div>
    </div>
  );
}
