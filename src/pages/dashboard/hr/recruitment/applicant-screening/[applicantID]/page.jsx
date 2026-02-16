import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import ScheduleInterviewForm from '../../form/schedule-interview-form';
import { dummyJobRequests } from '../../job-requests';
import {
  ArrowLeftIcon,
  Briefcase,
  Calendar,
  CheckCircle2,
  Circle,
  LinkIcon,
  Mail,
  MapPin,
  Phone,
  User,
} from 'lucide-react';
import Fields from '@/components/dashboard/hr/overview/fields';
import ActivityLog from '@/components/dashboard/hr/activity-log';

export default function ApplicantDetails() {
  const navigate = useNavigate();
  const { applicantID } = useParams();
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

  // Find applicant and associated job
  let applicant = null;
  let jobData = null;

  for (const job of dummyJobRequests) {
    const foundApplicant = job.applicants?.find(
      (a) => String(a.id) === String(applicantID)
    );
    if (foundApplicant) {
      applicant = foundApplicant;
      jobData = job;
      break;
    }
  }

  if (!applicant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Applicant not found
          </h2>
          <Button
            variant="link"
            onClick={() =>
              navigate('/dashboard/hr/recruitment/applicant-screening')
            }
          >
            Go back to list
          </Button>
        </div>
      </div>
    );
  }

  const activityLog = [
    {
      title: 'Under Review',
      date: '2024-01-01',
      time: '10:00 AM',
      checked: true,
    },
    {
      title: 'Shortlisted',
      date: '2024-01-01',
      time: '10:00 AM',
      checked: true,
    },
    {
      title: 'Interviewing',
      date: '2024-01-01',
      time: '10:00 AM',
      checked: false,
    },
    {
      title: 'Approved',
      date: '2024-01-01',
      time: '10:00 AM',
      checked: false,
    },
    {
      title: 'Offer Sent',
      date: '2024-01-01',
      time: '10:00 AM',
      checked: false,
    },
    {
      title: 'Offer Accepted',
      date: '2024-01-01',
      time: '10:00 AM',
      checked: false,
    },
  ];

  return (
    <div className="mx-auto min-h-screen space-y-8 p-6 font-sans text-gray-900">
      {/* Navigation */}
      <nav className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900">
        <Button
          variant="ghost"
          size="icon"
          className="-ml-2 h-8 w-8 rounded-full"
          onClick={() =>
            navigate('/dashboard/hr/recruitment/applicant-screening')
          }
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <span className="text-xl font-bold text-gray-900">
          Applicant Details
        </span>
      </nav>

      {/* Header Section */}
      <header className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
        <div className="flex w-full max-w-4xl flex-col items-start gap-2 md:flex-row md:gap-6">
          {/* Large Avatar */}
          <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-purple-100 shadow-sm">
            <span className="text-3xl font-bold text-purple-600">
              {applicant.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </span>
          </div>

          {/* Header Info */}
          <hgroup className="space-y-1 pt-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {applicant.name}
            </h1>
            <p className="text-lg font-semibold text-gray-600">
              {jobData?.title || 'Marketing Specialist'}
            </p>
            <p className="max-w-3xl pt-2 text-base leading-relaxed text-gray-500">
              Detail-oriented {jobData?.title || 'Specialist'} experienced in
              digital marketing, content strategy, and analytics-driven
              decision-making. Adept at managing campaigns across social media
              and online platforms while aligning marketing efforts with overall
              business objectives.
            </p>
          </hgroup>
        </div>

        {/* Action Buttons */}
        <div className="flex min-w-max flex-col items-end gap-3 pt-2">
          {/* Review Pill */}
          <Badge className="rounded-full border-none bg-[#FFF7ED] px-4 py-1.5 text-xs font-medium text-[#EA580C] hover:bg-[#FFF7ED]">
            Review
          </Badge>
          {/* Schedule Button */}
          <Dialog
            open={isInterviewModalOpen}
            onOpenChange={setIsInterviewModalOpen}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 rounded-lg bg-[#3300C9] px-6 py-6 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#2a00a8]">
                <Calendar className="h-4 w-4" />
                Schedule Interview
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white">
              <ScheduleInterviewForm
                onClose={() => setIsInterviewModalOpen(false)}
                initialData={{
                  candidateId: applicant.id,
                  jobTitle: jobData?.title || '',
                  interviewer: 'Current User', // Placeholder
                  status: 'Scheduled',
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Main Content */}
      <main className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* LEFT COLUMN */}
        <section className="space-y-6 lg:col-span-2">
          {/* Personal Information */}
          <article className="overflow-hidden rounded-3xl border border-gray-100 bg-white px-6 py-8 shadow-sm">
            <hgroup>
              <h2 className="mb-6 text-lg font-semibold text-gray-900">
                Personal Information
              </h2>
            </hgroup>
            <div className="mb-8 grid gap-6 sm:grid-cols-2">
              <Fields
                title={applicant.name}
                header="Name"
                icon={<User className="h-6 w-6 text-gray-400" />}
              />
              <Fields
                title={applicant.personalInfo.phone}
                header="Phone"
                icon={<Phone className="h-6 w-6 text-gray-400" />}
              />
              <Fields
                title={applicant.personalInfo.email}
                header="Email Address"
                icon={<Mail className="h-6 w-6 text-gray-400" />}
              />
              <Fields
                title={applicant.personalInfo.location}
                header="Location"
                icon={<MapPin className="h-6 w-6 text-gray-400" />}
              />
            </div>
          </article>

          {/* Job Experience and Qualifications */}
          <article className="overflow-hidden rounded-3xl border border-gray-100 bg-white px-6 py-8 shadow-sm">
            <hgroup>
              <h2 className="mb-6 text-lg font-semibold text-gray-900">
                Job Experience and Qualifications
              </h2>
            </hgroup>
            <div className="mb-8 grid gap-6">
              <div className="flex gap-5">
                <div className="shrink-0 pt-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 shadow-sm">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        Marketing Lead
                      </h3>
                      <p className="text-gray-500">Bubbl HQ</p>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600">
                      <CheckCircle2 className="h-3.5 w-3.5 text-gray-900" />
                      <span>January 2020 - March 2024</span>
                    </div>
                  </div>
                  <p className="max-w-2xl text-sm leading-relaxed text-gray-500">
                    Led marketing strategy and execution at Bubbl HQ, overseeing
                    brand positioning, campaign planning, and audience growth.
                    Drove engagement through content strategy, digital
                    campaigns, and data-informed decision-making while aligning
                    marketing efforts with business goals.
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* Links */}
          <article className="overflow-hidden rounded-3xl border border-gray-100 bg-white px-6 py-8 shadow-sm">
            <hgroup>
              <h2 className="mb-6 text-lg font-semibold text-gray-900">
                Links
              </h2>
            </hgroup>
            <div className="mb-8 grid gap-6 sm:grid-cols-2">
              <div>
                <label className="text-base font-medium text-gray-600">
                  LinkedIn Profile
                </label>
                <div className="mt-4 flex items-center gap-2 text-gray-900">
                  <LinkIcon className="h-6 w-6 text-gray-400" />
                  <span className="text-sm font-medium">{applicant.name}</span>
                </div>
              </div>
              <div>
                <label className="text-base font-medium text-gray-600">
                  Portfolio/Website
                </label>
                <div className="mt-4 flex items-center gap-2 text-gray-900">
                  <LinkIcon className="h-6 w-6 text-gray-400" />
                  <span className="text-sm font-medium">{applicant.name}</span>
                </div>
              </div>
            </div>
          </article>

          <article className="overflow-hidden rounded-3xl border border-gray-100 bg-white px-6 py-8 shadow-sm">
            <hgroup>
              <h2 className="mb-6 text-lg font-semibold text-gray-900">
                Attachment
              </h2>
            </hgroup>
            <div className="mb-8 grid gap-6 sm:grid-cols-2">
              <div>
                <label className="text-base font-medium text-gray-600">
                  Resume
                </label>
                <div className="mt-4 flex items-center gap-2 text-gray-900">
                  <LinkIcon className="h-6 w-6 text-gray-400" />
                  <span className="text-sm font-medium">{applicant.name}</span>
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* Activity Timeline */}
        <ActivityLog activity={activityLog} />
      </main>
    </div>
  );
}
