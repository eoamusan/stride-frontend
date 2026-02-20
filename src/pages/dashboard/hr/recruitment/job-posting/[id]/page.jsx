import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeftIcon,
  Loader2,
  Briefcase,
  XCircle,
  Delete,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import MetricCard from '@/components/dashboard/hr/metric-card';

import { useJobPostStore } from '@/stores/job-post-store';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import JobPostingForm from '../../form/job-posting-form';
import Fields from '@/components/dashboard/hr/overview/fields';
import { CustomButton } from '@/components/customs';
import SaveIcon from '@/assets/icons/save.svg';
import CalendarIcon from '@/assets/icons/calendar.svg';
import DeptIcon from '@/assets/icons/dept.svg';
import DiscoverIcon from '@/assets/icons/discover.svg';
import UserIcon from '@/assets/icons/user.svg';
import MoneyIcon from '@/assets/icons/money.svg';
import LocationIcon from '@/assets/icons/location.svg';
import { format } from 'date-fns';
import ActivityLog from '@/components/dashboard/hr/activity-log';
import { DataTable } from '@/components/ui/data-table';

// Placeholder metrics - future improvement: fetch real metrics for this specific job
const sampleChartData = [
  { month: 'Jan', month1: 0 },
  { month: 'Feb', month2: 0 },
  { month: 'Mar', month3: 0 },
  { month: 'Apr', month4: 0 },
];

const metricsData = [
  {
    title: 'Total Applicants',
    value: 0,
    percentage: 0,
    chartData: sampleChartData,
  },
  {
    title: 'Pending Review',
    value: 0,
    percentage: 0,
    chartData: sampleChartData,
    isPositive: false,
  },
  {
    title: 'Interviewing',
    value: 0,
    percentage: 0,
    chartData: sampleChartData,
  },
  {
    title: 'Offers Sent',
    value: 0,
    percentage: 0,
    chartData: sampleChartData,
  },
];

const applicantColumns = [
  {
    header: 'Applicant Name',
    accessorKey: 'applicantName',
    className: '',
  },
  {
    header: 'Application Date',
    accessorKey: 'applicationDate',
    className: '',
  },
  {
    header: 'Status',
    accessorKey: 'status',
    className: '',
  },
];
export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentJob: job,
    getJobPosting,
    deleteJobPosting,
    isLoading,
  } = useJobPostStore();

  console.log(job);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const handleDelete = async () => {
    if (
      window.confirm(
        'Are you sure you want to delete this job posting? This action cannot be undone.'
      )
    ) {
      try {
        await deleteJobPosting(job._id || job.id);
        toast.success('Job posting deleted successfully');
        navigate('/dashboard/hr/recruitment/job-postings');
      } catch (error) {
        toast.error('Failed to delete job posting');
      }
    }
  };

  useEffect(() => {
    if (id) {
      getJobPosting(id);
    }
  }, [id, getJobPosting]);

  useEffect(() => {
    if (job) console.log('Current Job Details:', job);
  }, [job]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-500">Job not found</p>
              <Button
                variant="link"
                onClick={() =>
                  navigate('/dashboard/hr/recruitment/job-postings')
                }
                className="mx-auto mt-4 block"
              >
                Back to Job Postings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Map API data to table format (placeholder for now as applicants might be a separate fetch)
  const tableData = [];

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
      title: 'Job Created',
      description: `by ${job.user || 'N/A'} • ${formatDate(job.createdAt)}, ${formatTime(job.createdAt)}`,
      checked: true,
    },
    {
      title: 'Job Status Changed to Active',
      description: `by ${job.user || 'N/A'} • ${formatDate(job.createdAt)}, ${formatTime(job.createdAt)}`,
      checked: true,
    },
    {
      title: 'Job Status Changed to Close',
      description: `by ${job.user || 'N/A'} • ${formatDate(job.createdAt)}, ${formatTime(job.createdAt)}`,
      checked: false,
    },
  ];

  return (
    <div className="mx-auto min-h-screen max-w-full overflow-scroll bg-gray-100 py-4 md:p-6">
      {/* Main Content */}
      <main className="grid gap-6 md:gap-8 lg:grid-cols-3">
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
        <div className="flex flex-col items-end justify-between gap-4 md:flex-row md:items-center lg:col-span-3">
          <header className="flex w-full items-end gap-4">
            <div className="flex w-full flex-col gap-4 md:w-156 md:flex-row md:items-center md:gap-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#B190B6] md:h-34 md:w-34">
                <Briefcase className="h-14 w-14 text-white md:h-24 md:w-24" />
              </div>
              <div className="flex flex-col gap-2">
                <hgroup className="space-y-1">
                  <h1 className="font-semibold">{job.title}</h1>
                  <p className="text-sm font-medium text-gray-700">{job.id}</p>
                </hgroup>
                <div className="flex flex-col gap-4 text-xs text-gray-400 md:flex-row">
                  <span className="flex items-center gap-1 text-gray-700 capitalize">
                    <img src={DeptIcon} alt="Calendar" className="h-6 w-6" />
                    {job.jobRequisitionId?.department || job.department} Dept
                  </span>
                  <span className="flex items-center gap-1 text-gray-700">
                    <img
                      src={CalendarIcon}
                      alt="Calendar"
                      className="h-6 w-6"
                    />
                    Posted {formatDate(job.createdAt)}
                  </span>
                  <span className="flex items-center gap-1 text-gray-700">
                    <img
                      src={LocationIcon}
                      alt="Calendar"
                      className="h-6 w-6"
                    />
                    {job.location}
                  </span>
                </div>
              </div>
            </div>
            <Badge
              variant={
                job.status === 'Active'
                  ? 'success'
                  : job.status === 'Draft'
                    ? 'info'
                    : 'danger'
              }
              className="inline px-4 py-1 text-sm md:hidden"
            >
              {job.status.charAt(0).toUpperCase() +
                job.status.slice(1).toLowerCase()}
            </Badge>
          </header>

          <div className="flex w-full flex-col gap-2 md:w-auto md:items-end md:gap-8">
            <Badge
              variant={
                job.status === 'Active'
                  ? 'success'
                  : job.status === 'Draft'
                    ? 'info'
                    : 'danger'
              }
              className="hidden px-4 py-1 text-sm md:inline"
            >
              {job.status.charAt(0).toUpperCase() +
                job.status.slice(1).toLowerCase()}
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
                    Edit Job Posting Form
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    Form to edit Job Posting Form
                  </DialogDescription>
                  <JobPostingForm
                    initialData={job}
                    onCancel={() => setIsEditModalOpen(false)}
                    onSuccess={() => {
                      setIsEditModalOpen(false);
                      getJobPosting(id); // Refresh current job data
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

        {/* Job Overview */}
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

        {/* Job Information Section */}
        <div className="rounded-2xl bg-white px-8 py-4 md:col-span-3 xl:col-span-2">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Job Information
          </h2>
          <div className="mb-8 grid gap-6 sm:grid-cols-2">
            <Fields
              title={job.employmentType || job.type}
              header="Employment Type"
              icon={
                <img
                  src={DiscoverIcon}
                  alt="DiscoverIcon"
                  className="h-6 w-6"
                />
              }
            />
            <Fields
              title={job.cadre || job.careerLevel || 'Not Specified'}
              header="Cadre Level"
              icon={<img src={UserIcon} alt="UserIcon" className="h-6 w-6" />}
            />
            <Fields
              title={job.salaryRange || 'Not Specified'}
              header="Salary Range"
              icon={<img src={MoneyIcon} alt="MoneyIcon" className="h-6 w-6" />}
            />
            <Fields
              title={new Date(job.deadline).toLocaleDateString()}
              header="Deadline"
              icon={
                <img
                  src={CalendarIcon}
                  alt="Calendar"
                  className="h-6 w-6 text-gray-400"
                />
              }
            />

            <div className="sm:col-span-2">
              <h3 className="mb-4 block text-sm text-gray-800">Description</h3>
              <p className="font-medium">{job.description}</p>
            </div>

            <div className="mb-8 space-y-2 sm:col-span-2">
              <h3 className="mb-4 block text-sm text-gray-800">Requirements</h3>
              <ul className="list-inside list-disc space-y-1 font-medium">
                {Array.isArray(job.requirements) &&
                  job.requirements.map((req, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {req}
                    </li>
                  ))}
              </ul>
            </div>

            <div className="mb-8 space-y-2 sm:col-span-2">
              <h3 className="mb-4 block text-sm text-gray-800">
                Responsibilities
              </h3>
              <ul className="list-inside list-disc space-y-1 font-medium">
                {Array.isArray(job.responsibilities) &&
                  job.responsibilities.map((req, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {req}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Activity Log and Action */}
        <div className="space-y-6 md:col-span-3 xl:col-span-1">
          {/* Activity Log Card */}
          <ActivityLog activity={activityLog} />

          {/* Action Card */}
          <div className="rounded-xl bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Action</h2>
            <footer className="mt-8 flex flex-col gap-3">
              <CustomButton className="inline-flex w-full rounded-xl py-6 text-sm">
                <XCircle className="h-5 w-5" />
                Close
              </CustomButton>

              <CustomButton
                variant="outline"
                className="w-full rounded-xl border-green-500 bg-transparent py-6 text-xs text-green-500"
                onClick={handleDelete}
              >
                <Delete className="h-5 w-5" />
                Delete
              </CustomButton>
            </footer>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md md:col-span-3 xl:col-span-2">
          <DataTable
            columns={applicantColumns}
            data={tableData}
            title="Applicants"
            isLoading={isLoading}
            pagination={{ page: currentPage, totalPages: 1 }}
            onPageChange={setCurrentPage}
            placeholder="Search Applicants..."
            inputValue={searchTerm}
            handleInputChange={(e) => setSearchTerm(e.target.value)}
            dropdownItems={[
              { label: 'All', value: 'all' },
              { label: 'Pending', value: 'pending' },
              { label: 'Reviewed', value: 'reviewed' },
              { label: 'Interviewed', value: 'interviewed' },
              { label: 'Offers Sent', value: 'offers-sent' },
              { label: 'Rejected', value: 'rejected' },
              { label: 'Approved', value: 'approved' },
            ]}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            setSearchTerm={setSearchTerm}
          />
        </div>
      </main>
    </div>
  );
}
