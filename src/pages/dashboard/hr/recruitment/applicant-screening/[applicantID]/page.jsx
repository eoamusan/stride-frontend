import { useNavigate, useParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dummyJobRequests } from '../../job-requests';
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  BuildingIcon,
  CalendarIcon,
  CheckCircleIcon,
  DownloadIcon,
  ExternalLinkIcon,
  GraduationCapIcon,
  MailIcon,
  MapPinIcon,
  NotebookPen,
  PhoneIcon,
  XCircleIcon,
} from 'lucide-react';

export default function ApplicantDetails() {
  const navigate = useNavigate();
  const { applicantID } = useParams();
  console.log('Applicant ID from URL:', applicantID);

  // Find applicant and associated job
  let applicant = null;
  let jobData = null;

  for (const job of dummyJobRequests) {
    // Compare as strings to avoid type mismatches (e.g. "1" vs 1)
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'hired':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'interviewing':
        return 'bg-purple-100 text-purple-700';
      case 'shortlisted':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-full">
        {/* Main Content */}
        <main className="grid gap-6 md:gap-8 lg:grid-cols-3">
          {/* Header with back button and title */}
          <nav className="flex items-center gap-4 lg:col-span-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() =>
                navigate('/dashboard/hr/recruitment/applicant-screening')
              }
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Button>
            <p className="text-2xl font-bold text-gray-900">
              Applicant Details
            </p>
          </nav>

          {/* Applicant Header Card */}
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm md:flex-row lg:col-span-3">
            <div className="flex w-full items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600 md:h-24 md:w-24">
                {applicant.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900">
                  {applicant.name}
                </h1>
                <p className="text-sm text-gray-500">{applicant.id}</p>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <BriefcaseIcon className="h-4 w-4" />
                    <span>
                      Applied for{' '}
                      <span className="font-medium text-gray-900">
                        {jobData?.title}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Applied {applicant.date}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col items-end gap-3 md:w-auto">
              <Badge className={getStatusColor(applicant.status)}>
                {applicant.status}
              </Badge>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <NotebookPen className="h-4 w-4" />
                  Notes
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-[#3300C9] text-white hover:bg-[#3300C9]/90"
                >
                  Schedule Interview
                </Button>
              </div>
            </div>
          </div>

          {/* Left Column - Main Info */}
          <div className="space-y-6 lg:col-span-2">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                    <MailIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email Address</p>
                    <p className="text-sm font-medium text-gray-900">
                      {personalInfo.email || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                    <PhoneIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone Number</p>
                    <p className="text-sm font-medium text-gray-900">
                      {personalInfo.phone || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border p-3 sm:col-span-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                    <MapPinIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-medium text-gray-900">
                      {personalInfo.location || 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {applicant.jobExperience?.length > 0 ? (
                  applicant.jobExperience.map((exp, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-50">
                        <BuildingIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {exp.title}
                        </h3>
                        <p className="text-sm font-medium text-gray-700">
                          {exp.role}
                        </p>
                        <p className="text-xs text-gray-500">{exp.date}</p>
                        <p className="mt-2 text-sm text-gray-600">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No experience listed.</p>
                )}
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Education</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {applicant.qualifications?.length > 0 ? (
                  applicant.qualifications.map((edu, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-purple-50">
                        <GraduationCapIcon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {edu.title}
                        </h3>
                        <p className="text-sm font-medium text-gray-700">
                          {edu.role}
                        </p>
                        <p className="text-xs text-gray-500">{edu.date}</p>
                        <p className="mt-2 text-sm text-gray-600">
                          {edu.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No education listed.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Documents</CardTitle>
              </CardHeader>
              <CardContent>
                {applicant.attachment ? (
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
                        <span className="text-xs font-bold">PDF</span>
                      </div>
                      <div className="overflow-hidden">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {applicant.attachment.name}
                        </p>
                        <p className="text-xs text-gray-500">Resume</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <DownloadIcon className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No documents attached.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {applicant.links?.length > 0 ? (
                  applicant.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50"
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {link.title}
                      </span>
                      <ExternalLinkIcon className="h-4 w-4 text-gray-400" />
                    </a>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No links provided.</p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                >
                  <CheckCircleIcon className="h-4 w-4" />
                  Approve Application
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                >
                  <XCircleIcon className="h-4 w-4" />
                  Reject Application
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
