import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeftIcon,
  Banknote,
  BriefcaseIcon,
  Building,
  CalendarIcon,
  CheckCircleIcon,
  Clock,
  DownloadIcon,
  FileQuestion,
  NotebookPen,
  User,
  Users,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router';
import RecruitmentNotFound from '../NotFound';
import { dummyRequisitionRequests } from '../job-requests';
import Fields from '@/components/dashboard/hr/overview/fields';

export default function RecruitmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const jobRequest = dummyRequisitionRequests.find((job) => job.id === id);
  if (!jobRequest) {
    return <RecruitmentNotFound />;
  }

  const handleApprove = () => {
    console.log('Approved');
  };

  const handleReject = () => {
    console.log('Rejected');
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
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row lg:col-span-3">
          <header className="flex items-center gap-4 md:w-156">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#B190B6] md:h-30 md:w-30">
              <BriefcaseIcon className="h-12 w-12 text-white" />
            </div>
            <hgroup className="flex-1">
              <h1 className="text-xl font-semibold">{jobRequest.title}</h1>
              <p className="mt-1 text-sm text-gray-600">{jobRequest.id}</p>
              <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  Created {jobRequest.dateCreated}, {jobRequest.createdTime}
                </span>
              </div>
            </hgroup>
          </header>

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

        {/* Left Column - Job Overview */}
        <section className="rounded-2xl bg-white p-8 lg:col-span-2">
          {/* Job Overview Section */}
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Job Overview
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {/* Left Column Fields */}
            <Fields
              title={jobRequest.title}
              header="Job Title"
              icon={<BriefcaseIcon className="h-6 w-6 text-gray-400" />}
            />
            <Fields
              title={jobRequest.department}
              header="Department"
              icon={<Building className="h-6 w-6 text-gray-400" />}
            />
            <Fields
              title={jobRequest.type}
              header="Employment Type"
              icon={<BriefcaseIcon className="h-6 w-6 text-gray-400" />}
            />
            <Fields
              title={jobRequest.careerLevel}
              header="Cadre Level"
              icon={<BriefcaseIcon className="h-6 w-6 text-gray-400" />}
            />
            <Fields
              title={jobRequest.salary}
              header="Budget Range (Per Annum)"
              icon={<Banknote className="h-6 w-6 text-gray-400" />}
            />
            <Fields
              title={`${jobRequest.openings} Positions`}
              header="Number of Openings"
              icon={<Users className="h-6 w-6 text-gray-400" />}
            />
            <Fields
              title={jobRequest.urgency}
              header="Urgency"
              icon={<Clock className="h-6 w-6 text-gray-400" />}
            />
            <Fields
              title={jobRequest.deadline}
              header="Expected Start Date"
              icon={<CalendarIcon className="h-6 w-6 text-gray-400" />}
            />
            <Fields
              title={jobRequest.requestedBy}
              header="Requested By"
              icon={<User className="h-6 w-6 text-gray-400" />}
            />
            <Fields
              title={jobRequest.reasonForHire}
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
              {jobRequest.activityLog?.map((activity, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0 pt-0.5">
                    {activity.type === 'approved' ||
                    activity.type === 'created' ||
                    activity.type === 'submitted' ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.user} • {activity.date}, {activity.time}
                    </p>
                  </div>
                </div>
              ))}
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
