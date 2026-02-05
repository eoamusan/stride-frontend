import { useNavigate, useParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { dummyJobRequests } from '../../job-requests';
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  CalendarIcon,
  MapPinIcon,
  NotebookPen,
} from 'lucide-react';

export default function ApplicantDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  let applicant = null;
  let job = null;

  for (const j of dummyJobRequests) {
    const found = j.applicants?.find((a) => a.id === id);
    if (found) {
      applicant = found;
      console.log(applicant);
      job = j;
      break;
    }
  }

  if (!applicant) {
    return (
      <div className="flex h-svh items-center justify-center">
        <p className="text-xl text-gray-500">Applicant not found</p>
      </div>
    );
  }

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
          <div className="flex flex-col items-center justify-between gap-4 rounded-xl bg-white p-6 shadow-sm md:col-span-3 md:flex-row">
            <div className="flex items-center gap-4 md:w-full">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#B190B6] md:h-30 md:w-30">
                <span className="text-3xl font-bold text-white">
                  {applicant.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-semibold">{applicant.name}</h1>
                <p className="mt-1 text-sm text-gray-600">{applicant.id}</p>
                <div className="mt-2 flex flex-col gap-2 text-sm text-gray-600 md:gap-3 xl:flex-row xl:items-center">
                  <div className="flex items-center gap-1">
                    <BriefcaseIcon className="h-4 w-4" />
                    <span>Applied for {job?.title}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Applied {applicant.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{applicant.personalInfo?.location}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col items-end gap-2">
              <Badge
                className={`${
                  applicant.status === 'Pending' || applicant.status === 'View'
                    ? 'bg-yellow-100 text-yellow-700'
                    : applicant.status === 'Approved' ||
                        applicant.status === 'Hired'
                      ? 'bg-green-100 text-green-700'
                      : applicant.status === 'Rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                }`}
              >
                {applicant.status}
              </Badge>
              <div className="flex w-full justify-between gap-4 md:justify-end">
                <Button
                  variant="outline"
                  className="rounded-xl bg-[#3300C9] p-6 text-white hover:bg-[#2a00a5] hover:text-white"
                >
                  <NotebookPen className="mr-2 h-5 w-5" />
                  Edit Applicant
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
