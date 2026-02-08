import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeftIcon,
  CalendarIcon,
  BriefcaseIcon,
  NotebookPen,
  CheckCircleIcon,
  Loader2,
  Briefcase,
  Calendar,
  Edit,
  LocateIcon,
  LocateFixedIcon,
  XCircle,
  Delete,
  Building2,
  Clock,
  Banknote,
  Award,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import MetricCard from '@/components/dashboard/hr/metric-card';
import { TableActions } from '@/components/dashboard/hr/table';
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

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentJob: job, getJobPosting, deleteJobPosting, isLoading } = useJobPostStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = async () => {
      if (window.confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
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

  const jobHeader = [
    { key: 'applicantName', label: 'Applicant Name', className: '' },
    { key: 'applicationDate', label: 'Application Date', className: '' },
    { key: 'status', label: 'Status', className: '' },
  ];

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
                onClick={() => navigate('/dashboard/hr/recruitment/job-postings')}
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
           <div className="flex items-end md:items-center justify-between gap-4 flex-row lg:col-span-3">
              <header className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 md:w-156 w-full">
                <div className="flex h-24 md:h-34 w-24 md:w-34 items-center justify-center rounded-full bg-[#B190B6]">
                  <Briefcase className="h-14 w-14 md:h-24 md:w-24 text-white" />
                </div>
                <hgroup className="flex-1">
                  <h1 className="text-xl font-semibold">{job.title}</h1>
                  <p className="mt-1 text-sm text-gray-600">
                    {job._id || job.id}
                  </p>
                  <div className="mt-2 flex flex-col md:flex-row gap-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-6 w-6" />
                      <span>Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </span>

                    <span className="flex items-center gap-1">
                      <BriefcaseIcon className="h-6 w-6" />
                      <span>{job.jobRequisitionId?.department || job.department} Dept</span>
                    </span>
                    <span className='flex items-center gap-1'>
                      <LocateIcon className="h-6 w-6" />
                      <span>{job.location}</span>
                    </span>
                  </div>
                </hgroup>
              </header>

          <div className="flex flex-col md:items-end gap-2 md:gap-8">
            <Badge
              className={`px-2 py-1 ${
                (job.status === 'Active' || job.status?.toUpperCase() === 'CREATE') 
                  ? 'bg-green-100 text-green-700' 
                  : job.status === 'Closed' 
                  ? 'bg-gray-100 text-gray-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {(job.status?.toUpperCase() === 'CREATE') ? 'Active' : job.status}
            </Badge>
            <div className="flex w-full justify-between gap-4 md:justify-end">
              <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="rounded-xl bg-[#3300C9] p-6 text-white"
                  >
                    <Edit className="h-5 w-5" />
                    Edit Job Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] w-full md:max-w-2xl overflow-y-auto rounded-2xl bg-gray-50">
                  <DialogTitle className="sr-only">
                    Edit Job Posting Form
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    Form to edit Job Posting Form
                  </DialogDescription>
                  <JobPostingForm
                    initialData={job}
                    onSuccess={() => {
                        setIsEditModalOpen(false);
                        getJobPosting(id); // Refresh data
                    }}
                    onCancel={() => setIsEditModalOpen(false)}
                  />
                </DialogContent>
              </Dialog>
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
               
               
                
                <Fields
                  title={job.employmentType || job.type}
                  header="Employment Type"
                  icon={<Clock className="h-6 w-6 text-gray-400" />}
                />
                <Fields
                  title={job.cadre || job.careerLevel || 'Not Specified'}
                  header="Cadre Level"
                  icon={<Award className="h-6 w-6 text-gray-400" />}
                />
                 <Fields
                  title={job.salaryRange || 'Not Specified'}
                  header="Salary Range"
                  icon={<Banknote className="h-6 w-6 text-gray-400" />}
                />
                <Fields
                  title={job.deadline ? new Date(job.deadline).toLocaleDateString() : 'No Deadline'}
                  header="Deadline"
                  icon={<CalendarIcon className="h-6 w-6 text-gray-400" />}
                />
              </div>

              <div className="mb-8 space-y-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  Description
                </h3>
                <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>
              {job.requirements && (
                <div className="mb-8 space-y-2">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Requirements
                  </h3>
                  <ul className="list-inside list-disc space-y-1">
                    {Array.isArray(job.requirements) ? job.requirements.map((req, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        {req}
                      </li>
                    )) : <p className="text-sm text-gray-600">{job.requirements}</p>}
                  </ul>
                </div>)}
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
                 {/* Placeholder for activity log if not in API response */}
                 <p className="text-sm text-gray-500">No activity logged.</p>
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
                  <XCircle className="h-5 w-5" />
                  Close
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl border-green-300 bg-transparent p-6 md:w-full"
                  onClick={handleDelete}
                >
                  <Delete className="h-5 w-5" />
                  Delete
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-md md:col-span-3 xl:col-span-2">
            <TableActions
              tableData={tableData}
              tableHeaders={jobHeader}
              title="Applicants"
              path="/dashboard/hr/recruitment/applicant-screening/applicant"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
