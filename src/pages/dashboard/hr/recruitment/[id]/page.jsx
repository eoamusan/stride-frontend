import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  DollarSignIcon,
  CheckCircleIcon,
  BriefcaseIcon,
  UsersIcon,
  DownloadIcon,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router';
import RecruitmentNotFound from '../NotFound';
import { dummyRequisitionRequests } from '../job-requests';

export default function RecruitmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const jobRequest = dummyRequisitionRequests.find((job) => job.id === id);
  if (!jobRequest) {
    return <RecruitmentNotFound />;
  }

  return (
    <div className="min-h-screen overflow-scroll bg-gray-100 p-6">
      <div className="mx-auto max-w-full">
        {/* Main Content */}
        <main className="grid gap-6 lg:grid-cols-3">
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
          <div className="flex items-center gap-4 lg:col-span-3">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-purple-200 md:h-30 md:w-30">
              <BriefcaseIcon className="h-12 w-12 text-purple-600" />
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
            <div className="flex items-center gap-2">
              <Badge
                className={`${jobRequest.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : jobRequest.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
              >
                {jobRequest.status === 'Pending'
                  ? 'Pending Approval'
                  : jobRequest.status}
              </Badge>
              <Button variant="outline" size="icon" className="rounded-lg">
                <DownloadIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Left Column - Job Overview */}
          <div className="lg:col-span-2">
            <div className="rounded-xl bg-white p-8">
              {/* Job Overview Section */}
              <div>
                <h2 className="mb-6 text-lg font-semibold text-gray-900">
                  Job Overview
                </h2>
                <div className="grid gap-6 sm:grid-cols-2">
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
                        <span className="font-medium">
                          {jobRequest.deadline}
                        </span>
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
              </div>
            </div>
          </div>

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
              <p className="text-sm text-gray-700">
                {jobRequest.detailedReason}
              </p>
            </div>
          </div>
        </main>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-3">
          <Button className="rounded-lg bg-blue-600 hover:bg-blue-700">
            <CheckCircleIcon className="mr-2 h-4 w-4" />
            Approve
          </Button>
          <Button variant="outline" className="rounded-lg">
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}
