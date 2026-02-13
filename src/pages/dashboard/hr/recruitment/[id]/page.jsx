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
  ClockIcon,
  DollarSignIcon,
  CheckCircleIcon,
  Clock,
  DownloadIcon,
  NotebookPen,
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
    <div className="min-h-screen overflow-scroll bg-gray-100 p-6">
      <div className="mx-auto max-w-full">
        {/* Main Content */}
        <main className="grid gap-6 md:gap-8 lg:grid-cols-3">
          {/* Header with back button and title */}
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
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row lg:col-span-3">
            <div className="flex items-center gap-4 md:w-156">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#B190B6] md:h-30 md:w-30">
                <BriefcaseIcon className="h-12 w-12 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-semibold">{jobRequest.title}</h1>
                <p className="mt-1 text-sm text-gray-600">{jobRequest.id}</p>
                <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                    Created {jobRequest.dateCreated}, {jobRequest.createdTime}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col items-end gap-2">
              <Badge
                className={`${jobRequest.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : jobRequest.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
              >
                {jobRequest.status === 'Pending'
                  ? 'Pending Approval'
                  : jobRequest.status}
              </Badge>
              <div className="flex w-full justify-between gap-4 md:justify-end">
                <Button
                  variant="outline"
                  className="rounded-xl border-green-300 bg-transparent p-6"
                >
                  <NotebookPen className="h-5 w-5" />
                  Edit
                </Button>
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
        </div>

          {/* Left Column - Job Overview */}
          <div className="rounded-2xl bg-white px-8 py-4 lg:col-span-2">
            {/* Job Overview Section */}
            <div>
              <h2 className="mb-6 text-lg font-semibold text-gray-900">
                Job Overview
              </h2>
              <div className="grid gap-8 sm:grid-cols-2">
                {/* Left Column Fields */}
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-medium text-gray-600">
                      Job Title
                    </label>
                    <div className="mt-2 flex items-center gap-2 text-gray-900">
                      <BriefcaseIcon className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{jobRequest.title}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600">
                      Employment Type
                    </label>
                    <div className="mt-2 flex items-center gap-2 text-gray-900">
                      <ClockIcon className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{jobRequest.type}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600">
                      Budget Range
                    </label>
                    <div className="mt-2 flex items-center gap-2 text-gray-900">
                      <DollarSignIcon className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{jobRequest.salary}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600">
                      Urgency
                    </label>
                    <div className="mt-2">
                      <Badge
                        variant="outline"
                        className={`${jobRequest.urgency === 'High' ? 'border-red-200 bg-red-50 text-red-700' : jobRequest.urgency === 'Medium' ? 'border-yellow-200 bg-yellow-50 text-yellow-700' : 'border-green-200 bg-green-50 text-green-700'}`}
                      >
                        {jobRequest.urgency}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600">
                      Requested By
                    </label>
                    <div className="mt-2 flex items-center gap-2 text-gray-900">
                      <span className="h-4 w-4 rounded-full bg-gray-300"></span>
                      <span className="font-medium">
                        {jobRequest.requestedBy}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column Fields */}
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-medium text-gray-600">
                      Department
                    </label>
                    <div className="mt-2 flex items-center gap-2 text-gray-900">
                      <span className="text-lg">🏢</span>
                      <span className="font-medium">
                        {jobRequest.department}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600">
                      Career Level
                    </label>
                    <div className="mt-2 flex items-center gap-2 text-gray-900">
                      <span className="text-lg">📊</span>
                      <span className="font-medium">
                        {jobRequest.careerLevel}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600">
                      Number of Openings
                    </label>
                    <div className="mt-2 flex items-center gap-2 text-gray-900">
                      <UsersIcon className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">
                        {jobRequest.openings} Positions
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600">
                      Expected Start Date
                    </label>
                    <div className="mt-2 flex items-center gap-2 text-gray-900">
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{jobRequest.deadline}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-600">
                      Reason for Hire
                    </label>
                    <div className="mt-2 flex items-center gap-2 text-gray-900">
                      <span className="text-lg">📝</span>
                      <span className="font-medium">
                        {jobRequest.reasonForHire}
                      </span>
                    </div>
                  </div>
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
