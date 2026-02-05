import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { dummyJobRequests } from '../../job-requests';
import {
  ArrowLeftIcon,
  CalendarIcon,
  BriefcaseIcon,
  NotebookPen,
  CheckCircleIcon,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import MetricCard from '@/components/dashboard/hr/metric-card';
import { TableActions } from '@/components/dashboard/hr/table';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = dummyJobRequests.find((job) => job.id === id);
  console.log(job);
  const sampleChartData = [
    { month: 'Jan', month1: 600 },
    { month: 'Feb', month2: 800 },
    { month: 'Mar', month3: 1000 },
    { month: 'Apr', month4: 1200 },
  ];

  const metricsData = [
    {
      title: 'Total Applicants',
      value: 150,
      percentage: 5,
      chartData: sampleChartData,
    },
    {
      title: 'Pending Review',
      value: 20,
      percentage: -2,
      chartData: sampleChartData,
      isPositive: false,
    },
    {
      title: 'Interviewing',
      value: 70,
      percentage: 5,
      chartData: sampleChartData,
    },
    {
      title: 'Offers Sent',
      value: 50,
      percentage: 2,
      chartData: sampleChartData,
    },
  ];
  const jobHeader = [
    { key: 'applicantName', label: 'Applicant Name', className: '' },
    { key: 'applicationDate', label: 'Application Date', className: '' },
    { key: 'status', label: 'Status', className: '' },
  ];

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-500">Job not found</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const tableData = (job.applicants || []).map((applicant) => ({
    id: applicant.id,
    applicantName: applicant.name,
    applicationDate: applicant.date,
    status: applicant.status,
  }));

  return (
    <div className="min-h-screen overflow-scroll bg-gray-100 p-6">
      <div className="mx-auto max-w-full">
        {/* Main Content */}
        <main className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3">
          {/* Header with back button and title */}
          <nav className="flex items-center gap-4 lg:col-span-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => navigate('/dashboard/hr/recruitment/job-postings')}
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
            <p className="text-2xl font-bold text-gray-900">Job Details</p>
          </nav>

          {/* Job Header Card */}
          <div className="flex flex-col items-center justify-between gap-4 md:col-span-3 md:flex-row">
            <div className="flex items-center gap-4 md:w-full">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#B190B6] md:h-30 md:w-30">
                <BriefcaseIcon className="h-12 w-12 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-semibold">{job?.title}</h1>
                <p className="mt-1 text-sm text-gray-600">{job?.id}</p>
                <div className="items-centergap-2 mt-2 flex flex-col gap-2 text-sm text-gray-600 md:gap-3 xl:flex-row xl:items-center">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{job?.department} Dept</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Posted {job?.postedDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{job?.location}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col items-end gap-2">
              <Badge
                className={`${job.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : job.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
              >
                {job.status === 'Pending' ? 'Pending Approval' : job.status}
              </Badge>
              <div className="flex w-full justify-between gap-4 md:justify-end">
                <Button
                  variant="outline"
                  className="rounded-xl bg-[#3300C9] p-6 text-white"
                >
                  <NotebookPen className="h-5 w-5" />
                  Edit Job Post
                </Button>
              </div>
            </div>
          </div>

          {/* Left Column - Job Overview */}
          <div className="mt-6 grid gap-6 md:col-span-3 md:grid-cols-2 xl:grid-cols-4">
            {metricsData.map((metric) => (
              <MetricCard
                key={metric.title}
                {...metric}
                emptyState={false}
                emojis={metric.emojis}
                className="w-full"
              />
            ))}
          </div>

          {/* Left Column - Job Information */}
          <div className="rounded-2xl bg-white px-8 py-4 md:col-span-3 xl:col-span-2">
            {/* Job Information Section */}
            <div>
              <h2 className="mb-6 text-lg font-semibold text-gray-900">
                Job Information
              </h2>
              <div className="mb-8 grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Employment Type
                  </label>
                  <p className="mt-2 font-medium text-gray-900">{job.type}</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Cadre Level
                  </label>
                  <p className="mt-2 font-medium text-gray-900">
                    {job.careerLevel || 'Not Specified'}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Salary Range (Per Annum)
                  </label>
                  <p className="mt-2 font-medium text-gray-900">{job.salary}</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">
                    Application Deadline
                  </label>
                  <p className="mt-2 font-medium text-gray-900">
                    {job.deadline}
                  </p>
                </div>
              </div>

              <div className="mb-8 space-y-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  Description
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {job.description}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  Requirements
                </h3>
                <ul className="list-inside list-disc space-y-1">
                  {job.requirements?.map((req, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column - Activity and Reason */}
          <div className="space-y-6 md:col-span-3 xl:col-span-1">
            {/* Activity Log Card */}
            <div className="rounded-xl bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Activity Log
              </h2>
              <div className="space-y-4">
                {job.activityLog?.map((activity, index) => (
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
                Action
              </h2>
              <div className="flex w-full flex-col justify-between gap-4">
                <Button
                  variant="outline"
                  className="rounded-xl bg-[#3300C9] p-6 text-white md:w-full"
                >
                  <NotebookPen className="h-5 w-5" />
                  Edit Job Post
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl border-green-300 bg-transparent p-6 md:w-full"
                >
                  <NotebookPen className="h-5 w-5" />
                  Edit
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md md:col-span-3 xl:col-span-2">
            <TableActions
              tableData={tableData}
              tableHeaders={jobHeader}
              title="Applicants"
              path="/dashboard/hr/recruitment/applicant-screening/detail/"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
