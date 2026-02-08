import { useNavigate, useParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dummyJobRequests } from '../../job-requests';
import {
  ArrowLeftIcon,
  Briefcase,
  Calendar,
  CheckCircle2,
  Circle,
  LinkIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  User,
} from 'lucide-react';

export default function ApplicantDetails() {
  const navigate = useNavigate();
  const { applicantID } = useParams();

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

  // Normalize personal info
  const personalInfo = Array.isArray(applicant.personalInfo)
    ? applicant.personalInfo[0]
    : applicant.personalInfo || {};

  // Timeline Steps matching the image "Activity Timeline"
  const timelineSteps = [
    {
      label: 'Under Review',
      status: 'done',
      date: 'May 12, 2024',
      time: '10:30 AM',
    },
    {
      label: 'Shortlisted',
      status: 'done',
      date: 'May 12, 2024',
      time: '10:30 AM',
    },
    {
      label: 'Interviewing',
      status: 'current',
      date: 'May 12, 2024',
      time: '10:30 AM',
    },
    { label: 'Approved', status: 'pending', date: 'Pending' },
    { label: 'Offer Sent', status: 'pending', date: 'Pending' },
    { label: 'Offer Accepted', status: 'pending', date: 'Pending' },
  ];

  // Helper function to render step icon based on status
  const StepIcon = ({ status }) => {
    if (status === 'done')
      return (
        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-green-500 bg-green-500 text-white shadow-sm">
          <CheckCircle2 className="h-3.5 w-3.5 text-white" />
        </div>
      );
    if (status === 'current')
      return (
        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-green-500 bg-white">
          <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
        </div>
      );
    return (
      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white">
        <Circle className="h-3.5 w-3.5 fill-gray-100 text-gray-300" />
      </div>
    );
  };

  return (
    <div className="mx-auto min-h-screen max-w-full  p-6 font-sans text-gray-900">
      {/* Main Content */}
      <div className="space-y-8">
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
          <div className="flex w-full max-w-4xl items-start gap-6">
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
            <div className="space-y-1 pt-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {applicant.name}
              </h1>
              <p className="text-sm font-semibold text-gray-600">
                {jobData?.title || 'Marketing Specialist'}
              </p>
              <p className="max-w-3xl pt-2 text-xs leading-relaxed text-gray-500">
                Detail-oriented {jobData?.title || 'Specialist'} experienced in
                digital marketing, content strategy, and analytics-driven
                decision-making. Adept at managing campaigns across social media
                and online platforms while aligning marketing efforts with
                overall business objectives.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex min-w-max flex-col items-end gap-3 pt-2">
            {/* Review Pill */}
            <Badge className="rounded-full border-none bg-[#FFF7ED] px-4 py-1.5 text-xs font-medium text-[#EA580C] hover:bg-[#FFF7ED]">
              Review
            </Badge>
            {/* Schedule Button */}
            <Button className="flex items-center gap-2 rounded-lg bg-[#3300C9] px-6 py-6 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#2a00a8]">
              <Calendar className="h-4 w-4" />
              Schedule Interview
            </Button>
          </div>
        </header>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* LEFT COLUMN */}
          <div className="space-y-6 lg:col-span-2">
            {/* Personal Information */}
            <Card className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <CardHeader className="border-b border-gray-50 px-8 py-6">
                <CardTitle className="text-base font-bold text-gray-900">
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-x-12 gap-y-8 p-8 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                    Name
                  </label>
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {applicant.name}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                    Phone
                  </label>
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {personalInfo.phone || '+234 90 5067 8069'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                    Email Address
                  </label>
                  <div className="flex items-center gap-3">
                    <MailIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {personalInfo.email || 'olafemijohnson23@gmail.com'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                    Location
                  </label>
                  <div className="flex items-center gap-3">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {personalInfo.location || 'Lagos, Nigeria'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Experience */}
            <Card className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <CardHeader className="border-b border-gray-50 px-8 py-6">
                <CardTitle className="text-base font-bold text-gray-900">
                  Job Experience and Qualifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-10 p-8">
                {/* Static Content replicating image perfectly */}

                {/* Item 1 - Blue Icon */}
                <div className="flex gap-5">
                  <div className="shrink-0 pt-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 shadow-sm">
                      <Briefcase className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">
                          Marketing Lead
                        </h3>
                        <p className="text-xs text-gray-500">Bubbl HQ</p>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600">
                        <CheckCircle2 className="h-3.5 w-3.5 text-gray-900" />
                        <span>January 2020 - March 2024</span>
                      </div>
                    </div>
                    <p className="max-w-2xl text-xs leading-relaxed text-gray-500">
                      Led marketing strategy and execution at Bubbl HQ,
                      overseeing brand positioning, campaign planning, and
                      audience growth. Drove engagement through content
                      strategy, digital campaigns, and data-informed
                      decision-making while aligning marketing efforts with
                      business goals.
                    </p>
                  </div>
                </div>

                {/* Item 2 - Teal Icon */}
                <div className="flex gap-5">
                  <div className="shrink-0 pt-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0D9488] shadow-sm">
                      <Briefcase className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">
                          Marketing Lead
                        </h3>
                        <p className="text-xs text-gray-500">Bubbl HQ</p>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600">
                        <CheckCircle2 className="h-3.5 w-3.5 text-gray-900" />
                        <span>January 2020 - March 2024</span>
                      </div>
                    </div>
                    <p className="max-w-2xl text-xs leading-relaxed text-gray-500">
                      Led marketing strategy and execution at Bubbl HQ,
                      overseeing brand positioning, campaign planning, and
                      audience growth. Drove engagement through content
                      strategy, digital campaigns, and data-informed
                      decision-making while aligning marketing efforts with
                      business goals.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Links */}
            <Card className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <CardHeader className="border-b border-gray-50 px-8 py-6">
                <CardTitle className="text-base font-bold text-gray-900">
                  Links
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-x-12 gap-y-8 p-8 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                    LinkedIn Profile
                  </label>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
                  >
                    <LinkIcon className="h-4 w-4 text-gray-400" />
                    {applicant.name || 'Femilare Oladimeji Johnson'}
                  </a>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                    Portfolio/Website
                  </label>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
                  >
                    <LinkIcon className="h-4 w-4 text-gray-400" />
                    {applicant.name || 'Femilare Oladimeji Johnson'}
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6 lg:col-span-1">
            {/* Activity Timeline */}
            <Card className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <CardHeader className="border-b border-gray-50 px-8 py-6">
                <CardTitle className="text-base font-bold text-gray-900">
                  Activity Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="relative my-2 ml-4 space-y-12 border-l-2 border-dashed border-gray-200 pb-2 pl-10">
                  {timelineSteps.map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* Icon */}
                      <div className="absolute top-0 -left-[54px] bg-white py-1">
                        <StepIcon status={step.status} />
                      </div>

                      {/* Text */}
                      <div className="flex items-start justify-between gap-4">
                        <span
                          className={`text-sm font-medium ${step.status === 'done' ? 'text-gray-900' : 'text-gray-500'}`}
                        >
                          {step.label}
                        </span>
                        <div className="shrink-0 text-right">
                          <div className="text-[10px] font-medium text-gray-500">
                            {step.date}
                          </div>
                          {step.time && (
                            <div className="text-[10px] text-gray-400">
                              {step.time}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Offer Letter */}
            <Card className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <CardHeader className="border-b border-gray-50 px-8 py-6">
                <CardTitle className="text-base font-bold text-gray-900">
                  Offer Letter
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center p-8 py-10">
                <div className="w-full rounded-lg border border-gray-100 bg-gray-50 py-3 text-center text-sm text-gray-500">
                  No offer yet
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
