import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeftIcon,
  Banknote,
  Briefcase,
  BriefcaseIcon,
  Building,
  CheckCircleIcon,
  Clock,
  DownloadIcon,
  Edit,
  FileQuestion,
  User,
  Users,
  XCircleIcon,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router';
import RecruitmentNotFound from '../NotFound';
import Fields from '@/components/dashboard/hr/overview/fields';
import { useJobRequisitionStore } from '@/stores/job-requisition-store';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ManpowerRequisitionForm from '../form/requisition-form';

import CalendarIcon from '@/assets/icons/calendar.svg';
import SaveIcon from '@/assets/icons/save.svg';

import { CustomButton } from '@/components/customs';
import ActivityLog from '@/components/dashboard/hr/activity-log';

export default function RecruitmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requisitions, fetchRequisitions, isLoading } =
    useJobRequisitionStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (requisitions.length === 0) {
      fetchRequisitions(1);
    }
  }, [fetchRequisitions, requisitions.length]);

  const jobRequest = useMemo(() => {
    return requisitions.find((job) => job._id === id || job.id === id);
  }, [requisitions, id]);

  if (isLoading && !jobRequest) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!jobRequest) {
    return <RecruitmentNotFound />;
  }

  const handleApprove = () => {
    console.log('Approved');
  };

  const handleReject = () => {
    console.log('Rejected');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'hh:mm a');
    } catch (e) {
      return '';
    }
  };

  const activityLog = [
    {
      id: 1,
      title: 'Requisition Created',
      description: `by ${jobRequest.user || 'N/A'} • ${formatDate(jobRequest.createdAt)}, ${formatTime(jobRequest.createdAt)}`,
      checked: true,
    },
    {
      id: 2,
      title: 'Submitted for Approval',
      description: `by ${jobRequest.user || 'N/A'} • ${formatDate(jobRequest.createdAt)}, ${formatTime(jobRequest.createdAt)}`,
      checked: true,
    },
    {
      id: 3,
      title: 'Approved',
      description: `by ${jobRequest.user || 'N/A'} • ${formatDate(jobRequest.createdAt)}, ${formatTime(jobRequest.createdAt)}`,
      checked: false,
    },
  ];

  return (
    <div className="mx-auto min-h-screen max-w-full overflow-scroll bg-gray-100 py-4 md:p-6">
      {/* Main Content */}
      <main className="grid gap-6 md:gap-8 lg:grid-cols-3">
        <nav className="flex items-center gap-4 lg:col-span-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => navigate('/dashboard/hr/recruitment')}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <p className="text-2xl font-bold text-gray-900">
            Requisition Details
          </p>
        </nav>

        {/* Job Header Card */}
        <div className="flex flex-col items-end justify-between gap-4 md:flex-row md:items-center lg:col-span-3">
          <header className="flex w-full items-end gap-4">
            <div className="flex w-full flex-col gap-4 md:w-156 md:flex-row md:items-center md:gap-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#B190B6] md:h-34 md:w-34">
                <Briefcase className="h-14 w-14 text-white md:h-24 md:w-24" />
              </div>
              <div className="flex flex-col gap-2">
                <hgroup className="space-y-1">
                  <h1 className="font-semibold">{jobRequest.jobTitle}</h1>
                  <p className="text-sm font-medium text-gray-700">
                    {jobRequest._id || jobRequest.id}
                  </p>
                </hgroup>
                <div className="flex gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1 text-gray-700">
                    <img
                      src={CalendarIcon}
                      alt="Calendar"
                      className="h-6 w-6"
                    />
                    Created {formatDate(jobRequest.createdAt)},{' '}
                    {formatTime(jobRequest.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            <Badge
              variant={
                jobRequest.status === 'PENDING'
                  ? 'info'
                  : jobRequest.status === 'APPROVED'
                    ? 'success'
                    : 'danger'
              }
              className="inline px-4 py-1 text-sm md:hidden"
            >
              {jobRequest.status.charAt(0).toUpperCase() +
                jobRequest.status.slice(1).toLowerCase()}
            </Badge>
          </header>

          <div className="flex w-full flex-col gap-2 md:w-auto md:items-end md:gap-8">
            <Badge
              variant={
                jobRequest.status === 'PENDING'
                  ? 'info'
                  : jobRequest.status === 'APPROVED'
                    ? 'success'
                    : 'danger'
              }
              className="hidden px-4 py-1 text-sm md:inline"
            >
              {jobRequest.status.charAt(0).toUpperCase() +
                jobRequest.status.slice(1).toLowerCase()}
            </Badge>

            <div className="flex w-full justify-between md:justify-end md:gap-4">
              <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogTrigger asChild>
                  <CustomButton className="inline-flex w-5/11 rounded-xl border border-[#254C00] bg-transparent py-6 text-sm text-[#254C00] hover:bg-transparent md:w-auto">
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13"
                        stroke="#254C00"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16.0399 3.02123L8.15988 10.9012C7.85988 11.2012 7.55988 11.7912 7.49988 12.2212L7.06988 15.2312C6.90988 16.3212 7.67988 17.0812 8.76988 16.9312L11.7799 16.5012C12.1999 16.4412 12.7899 16.1412 13.0999 15.8412L20.9799 7.96123C22.3399 6.60123 22.9799 5.02123 20.9799 3.02123C18.9799 1.02123 17.3999 1.66123 16.0399 3.02123Z"
                        stroke="#254C00"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14.9102 4.14844C15.5802 6.53844 17.4502 8.40844 19.8502 9.08844"
                        stroke="#254C00"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Edit
                  </CustomButton>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] w-full overflow-y-auto rounded-2xl bg-gray-50 md:max-w-2xl">
                  <DialogTitle className="sr-only">
                    Edit Man Power Requisition Form
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    Form to edit Man Power Requisition Form
                  </DialogDescription>
                  <ManpowerRequisitionForm
                    initialData={jobRequest}
                    onSuccess={() => {
                      setIsEditModalOpen(false);
                      fetchRequisitions(1); // Refresh data
                    }}
                  />
                </DialogContent>
              </Dialog>
              <CustomButton className="inline-flex w-5/11 rounded-xl py-6 text-sm md:w-auto">
                <img src={SaveIcon} alt="Save Changes" className="mr-1" />
                Generate PDF
              </CustomButton>
            </div>
          </div>
        </div>

        {/* Left Column - Job Overview */}
        <section className="space-y-10 rounded-2xl bg-white p-8 lg:col-span-2">
          {/* Job Overview Section */}
          <h2 className="font-semibold">Job Overview</h2>
          <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
            {/* Left Column Fields */}
            <Fields
              title={jobRequest.jobTitle}
              header="Job Title"
              icon={
                <img src={CalendarIcon} alt="Calendar" className="h-6 w-6" />
              }
            />
            <Fields
              title={jobRequest.department}
              header="Department"
              icon={
                <img src={CalendarIcon} alt="Calendar" className="h-6 w-6" />
              }
            />
            <Fields
              title={jobRequest.employmentType}
              header="Employment Type"
              icon={
                <img src={CalendarIcon} alt="Calendar" className="h-6 w-6" />
              }
            />
            <Fields
              title={jobRequest.grade}
              header="Cadre Level"
              icon={
                <img src={CalendarIcon} alt="Calendar" className="h-6 w-6" />
              }
            />
            <Fields
              title={`${jobRequest.minBudget} - ${jobRequest.maxBudget}`}
              header="Budget Range (Per Annum)"
              icon={
                <img src={CalendarIcon} alt="Calendar" className="h-6 w-6" />
              }
            />
            <Fields
              title={`${jobRequest.noOfOpenings} Positions`}
              header="Number of Openings"
              icon={
                <img src={CalendarIcon} alt="Calendar" className="h-6 w-6" />
              }
            />
            <Fields
              title={
                typeof jobRequest.urgency === 'boolean'
                  ? jobRequest.urgency
                    ? 'High'
                    : 'Low'
                  : jobRequest.urgency
              }
              header="Urgency"
              icon={
                <img src={CalendarIcon} alt="Calendar" className="h-6 w-6" />
              }
            />
            <Fields
              title={jobRequest.startDate}
              header="Expected Start Date"
              icon={
                <img src={CalendarIcon} alt="Calendar" className="h-6 w-6" />
              }
            />
            <Fields
              title={jobRequest.requestedBy || 'N/A'}
              header="Requested By"
              icon={
                <img src={CalendarIcon} alt="Calendar" className="h-6 w-6" />
              }
            />
            <Fields
              title={jobRequest.reason}
              header="Reason for Hire"
              icon={
                <img src={CalendarIcon} alt="Calendar" className="h-6 w-6" />
              }
            />
          </div>
        </section>

        {/* Right Column - Activity and Reason */}
        <div className="space-y-6">
          {/* Activity Log Card */}
          <ActivityLog activity={activityLog} />

          {/* Detailed Reason Card */}
          <div className="rounded-xl bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Detailed Reason for Hire
            </h2>
            <p className="rounded-xl border border-gray-100 p-4 text-gray-700">
              {jobRequest.detailedReason}
            </p>
          </div>
          {jobRequest.rejectionReason && (
            <div className="rounded-xl bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Reason for Rejection
              </h2>
              <p className="text-sm text-gray-700">
                {jobRequest.rejectionReason}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Action Buttons */}
      <footer className="mt-8 flex gap-3">
        <CustomButton onClick={handleApprove} className="w-48 text-xs">
          <CheckCircleIcon className="mr-2 h-4 w-4" />
          Approve
        </CustomButton>

        <CustomButton
          variant="outline"
          onClick={handleReject}
          className="w-48 border-green-500 bg-transparent text-xs text-green-500"
        >
          <XCircleIcon className="mr-2 h-4 w-4" />
          Reject
        </CustomButton>
      </footer>
    </div>
  );
}
