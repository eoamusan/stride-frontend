import { useState,useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeftIcon,
  Banknote,
  Briefcase,
  BriefcaseIcon,
  Building,
  Calendar,
  CalendarIcon,
  CheckCircleIcon,
  Clock,
  DownloadIcon,
  Edit,
  FileQuestion,
  NotebookPen,
  User,
  Users,
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

  return (
    <div className="mx-auto min-h-screen max-w-full overflow-scroll bg-gray-100 p-6">
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
        <div className="flex items-end md:items-center justify-between gap-4 flex-row lg:col-span-3">
          <header className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 md:w-156 w-full">
            <div className="flex h-24 md:h-34 w-24 md:w-34 items-center justify-center rounded-full bg-[#B190B6]">
              <Briefcase className="h-14 w-14 md:h-24 md:w-24 text-white" />
            </div>
            <hgroup className="flex-1">
              <h1 className="text-xl font-semibold">{jobRequest.jobTitle}</h1>
              <p className="mt-1 text-sm text-gray-600">
                {jobRequest._id || jobRequest.id}
              </p>
              <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
                <Calendar className="h-6 w-6" />
                <span>
                  Created {formatDate(jobRequest.createdAt)},{' '}
                  {formatTime(jobRequest.createdAt)}
                </span>
              </div>
            </hgroup>
          </header>

          <div className="flex flex-col md:items-end gap-2 md:gap-8">
            <Badge
              className={`px-2 py-1 ${jobRequest.status === 'PENDING' ? 'bg-[#CE8D001A] text-[#CE8D00]' : jobRequest.status === 'APPROVED' ? 'bg-[#00B8661A] text-[#00B866]' : 'bg-[#FF3B301A] text-[#FF3B30]'}`}
            >
              {jobRequest.status === 'PENDING'
                ? 'Pending Approval'
                : jobRequest.status === 'APPROVED'
                ? 'Approved'
                : jobRequest.status === 'REJECTED'
                ? 'Rejected'
                : jobRequest.status}
            </Badge>
            <div className="flex w-full justify-between gap-4 md:justify-end">
              <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="hidden md:inline-flex rounded-xl border-green-300 bg-transparent p-6"
                  >
                    <Edit className="h-5 w-5" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] w-full md:max-w-2xl overflow-y-auto rounded-2xl bg-gray-50">
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
              <Button
                variant="outline"
                className="rounded-xl bg-[#3300C9] p-6 text-white"
              >
                <DownloadIcon className="h-5 w-5" />
                Generate PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Left Column - Job Overview */}
        <section className="rounded-2xl bg-white p-8 lg:col-span-2">
          {/* Job Overview Section */}
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Job Overview
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {/* Left Column Fields */}
            <Fields
              title={jobRequest.jobTitle}
              header="Job Title"
              icon={<BriefcaseIcon className="h-6 w-6 text-gray-400" />}
            />
            <Fields
              title={jobRequest.department}
              header="Department"
              icon={<Building className="h-6 w-6 text-gray-400" />}
            />
            <Fields
              title={jobRequest.employmentType}
              header="Employment Type"
              icon={<BriefcaseIcon className="h-6 w-6 text-gray-400" />}
            />
            <Fields
              title={jobRequest.grade}
              header="Cadre Level"
              icon={<BriefcaseIcon className="h-6 w-6 text-gray-400" />}
            />
            <Fields
              title={`${jobRequest.minBudget} - ${jobRequest.maxBudget}`}
              header="Budget Range (Per Annum)"
              icon={<Banknote className="h-6 w-6 text-gray-400" />}
            />
            <Fields
              title={`${jobRequest.noOfOpenings} Positions`}
              header="Number of Openings"
              icon={<Users className="h-6 w-6 text-gray-400" />}
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
              icon={<Clock className="h-6 w-6 text-gray-400" />}
            />
            <Fields
              title={jobRequest.startDate}
              header="Expected Start Date"
              icon={<CalendarIcon className="h-6 w-6 text-gray-400" />}
            />
            <Fields
              title={jobRequest.requestedBy || 'N/A'}
              header="Requested By"
              icon={<User className="h-6 w-6 text-gray-400" />}
            />
            <Fields
              title={jobRequest.reason}
              header="Reason for Hire"
              icon={<FileQuestion className="h-6 w-6 text-gray-400" />}
            />
          </div>
        </section>

        {/* Right Column - Activity and Reason */}
        <div className="space-y-6">
          {/* Activity Log Card */}
          <div className="rounded-xl bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Activity Log
            </h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 pt-0.5">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Requisition Created
                  </p>
                  <p className="text-xs text-gray-500">
                    by {jobRequest.user || 'N/A'} •{' '}
                    {formatDate(jobRequest.createdAt)},
                    {formatTime(jobRequest.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 pt-0.5">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Submitted For Approval
                  </p>
                  <p className="text-xs text-gray-500">
                    by {jobRequest.user || 'N/A'} •{' '}
                    {formatDate(jobRequest.createdAt)},
                    {formatTime(jobRequest.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-shrink-0 pt-0.5">
                  <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Approved</p>
                  <p className="text-xs text-gray-500">
                    by {jobRequest.user || 'N/A'} •{' '}
                    {formatDate(jobRequest.createdAt)},
                    {formatTime(jobRequest.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Reason Card */}
          <div className="rounded-xl bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Detailed Reason for Hire
            </h2>
            <p className="text-sm text-gray-700">{jobRequest.detailedReason}</p>
          </div>
        </div>
      </main>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-3">
        <Button
          onClick={handleApprove}
          className="rounded-xl bg-[#3300C9] p-6 text-white"
        >
          <CheckCircleIcon className="mr-2 h-4 w-4" />
          Approve
        </Button>
        <Button
          onClick={handleReject}
          variant="outline"
          className="rounded-lg p-6"
        >
          Reject
        </Button>
      </div>
    </div>
  );
}
