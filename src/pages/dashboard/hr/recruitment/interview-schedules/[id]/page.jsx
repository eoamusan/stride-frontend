import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  ArrowLeftIcon,
  Calendar,
  CheckCircle2,
  Circle,
  LocateIcon,
  Mail,
  MapPin,
  Phone,
  User,
  Clock,
  Briefcase,
} from 'lucide-react';
import ScheduleInterviewForm from '../../form/schedule-interview-form';
import { interviewSchedulesDummyData } from '../dummyData';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function InterviewScheduleDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

  // Mock Reschedule Request for ID 1
  const hasRescheduleRequest = id === '1';

  const interview = interviewSchedulesDummyData.find((i) => i.id === id);
  // Timeline Steps matching the image "Activity Timeline"
  const timelineSteps = [
    {
      label: 'Interview Scheduled',
      status: 'done',
      date: 'May 12, 2024',
      time: '10:30 AM',
    },
    {
      label: 'Interview Confirmed',
      status: 'done',
      date: 'May 12, 2024',
      time: '10:30 AM',
    },
    {
      label: 'Interview Completed',
      status: 'pending',
      date: 'Pending',
    },
    { label: 'Offer Sent', status: 'pending', date: 'Pending' },
    { label: 'Offer Accepted', status: 'pending', date: 'Pending' },
  ];

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

  if (!interview) {
    return (
      <div className="mx-auto flex min-h-screen flex-col items-center justify-center space-y-4 p-6 font-sans text-gray-900">
        <h1 className="text-2xl font-bold">Interview Not Found</h1>
        <Button
          onClick={() =>
            navigate('/dashboard/hr/recruitment/interview-schedules')
          }
        >
          Back to List
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen space-y-8 p-6 font-sans text-gray-900">
      {/* Navigation */}
      <nav className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900">
        <Button
          variant="ghost"
          size="icon"
          className="-ml-2 h-8 w-8 rounded-full"
          onClick={() =>
            navigate('/dashboard/hr/recruitment/interview-schedules')
          }
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <span className="text-xl font-bold text-gray-900">
          Interview Details
        </span>
      </nav>

      {/* Header Section */}
      <header className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
        <div className="flex w-full max-w-4xl flex-col items-start gap-2 md:flex-row md:gap-6">
          {/* Large Avatar */}
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-purple-100 shadow-sm">
            <span className="text-3xl font-bold text-purple-600">
              {interview.applicantName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </span>
          </div>
          <div>
            {/* Header Info */}
            <hgroup className="space-y-1 pt-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {interview.applicantName}
              </h1>
              <p className="text-lg font-semibold text-gray-600">
                {interview.roleApplied}
              </p>
            </hgroup>

            <div className="mt-2 flex flex-col gap-4 text-sm text-gray-500 md:flex-row md:items-center">
              <span className="flex items-center gap-1.5">
                <Mail className="h-4 w-4" />
                <span>{interview.email}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="h-4 w-4" />
                <span>{interview.phone}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>{interview.location}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex min-w-max flex-col items-end gap-3 pt-2">
          {/* Status Pill */}
          <Badge className="rounded-full border-none bg-blue-50 px-4 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50">
            {interview.status}
          </Badge>
          {/* Generate Offer Button */}
          <Button className="flex items-center gap-2 rounded-lg bg-gray-200 px-6 py-6 text-sm font-semibold text-gray-600 shadow-none transition-all hover:bg-gray-300">
            <div className="rounded-md bg-white p-1">
              <Briefcase className="h-4 w-4 text-gray-500" />
            </div>
            Generate Offer
          </Button>
        </div>
      </header>

      {/* Reschedule Request Banner */}
      {hasRescheduleRequest && (
        <div className="w-full rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h3 className="mb-2 text-base font-bold text-[#F59E0B]">
            Applicant has requested to reschedule this interview
          </h3>
          <p className="mb-4 text-sm text-gray-500">
            Requested on May 10, 2024 at 2:45 PM
          </p>

          <div className="mb-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
            "Hi, I have a family emergency that requires me to travel urgently.
            Would it be possible to reschedule the interview to next week? I'm
            available any day after May 20th. Sorry for the short notice and
            inconvenience."
          </div>

          <Dialog
            open={isInterviewModalOpen}
            onOpenChange={setIsInterviewModalOpen}
          >
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 rounded-lg bg-[#3300C9] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#2a00a8]">
                <Calendar className="h-4 w-4" />
                Reschedule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white">
              <ScheduleInterviewForm
                onClose={() => setIsInterviewModalOpen(false)}
                initialData={{
                  candidateId: interview.id,
                  applicantName: interview.applicantName,
                  jobTitle: interview.roleApplied,
                  date: interview.interviewDate,
                  time: (() => {
                    const [time, modifier] = interview.interviewTime.split(' ');
                    let [hours, minutes] = time.split(':');
                    if (hours === '12') {
                      hours = '00';
                    }
                    if (modifier === 'PM') {
                      hours = parseInt(hours, 10) + 12;
                    }
                    return `${hours}:${minutes}`;
                  })(),
                  status: interview.status,
                  interviewType: interview.interviewType,
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Main Content */}
      <main className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* LEFT COLUMN */}
        <section className="space-y-6 lg:col-span-2">
          {/* Interview Logistics */}
          <article className="overflow-hidden rounded-3xl border border-gray-100 bg-white px-8 py-8 shadow-sm">
            <hgroup>
              <h2 className="mb-8 text-lg font-bold text-gray-900">
                Interview Logistics
              </h2>
            </hgroup>
            <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
              {/* Custom Fields Implementation */}
              <div className="flex items-start gap-4">
                <div className="mt-1 text-gray-400">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="mb-1 text-sm text-gray-500">Applicant</p>
                  <p className="font-medium text-gray-900">
                    {interview.applicantName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 text-gray-400">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="mb-1 text-sm text-gray-500">Date & Time</p>
                  <p className="font-medium text-gray-900">
                    {interview.interviewDate}, {interview.interviewTime}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 text-gray-400">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <p className="mb-1 text-sm text-gray-500">Role Applied For</p>
                  <p className="font-medium text-gray-900">
                    {interview.roleApplied}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 text-gray-400">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="mb-1 text-sm text-gray-500">Interviewer(s)</p>
                  <p className="font-medium text-gray-900">Current User</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 text-gray-400">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="mb-1 text-sm text-gray-500">Interview Type</p>
                  <p className="font-medium text-gray-900">
                    {interview.interviewType}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 text-gray-400">
                  <LocateIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="mb-1 text-sm text-gray-500">Location / Link</p>
                  <p className="font-medium text-blue-600 underline">
                    https://meet.google.com/abc-defg-hij
                  </p>
                </div>
              </div>
            </div>
          </article>
        </section>

        {/* Activity Timeline & Offer */}
        <aside className="space-y-6 lg:col-span-1">
          <article className="overflow-hidden rounded-3xl border border-gray-100 bg-white px-6 py-8 shadow-sm">
            <hgroup>
              <h2 className="mb-6 text-base font-bold text-gray-900">
                Activity Timeline
              </h2>
            </hgroup>
            <div>
              <div className="relative my-2 ml-4 space-y-6 border-l border-dashed border-gray-200 pb-2 pl-8">
                {timelineSteps.map((step, idx) => (
                  <div key={idx} className="relative">
                    {/* Icon */}
                    <div className="absolute top-0 -left-[43px] bg-white py-1">
                      <StepIcon status={step.status} />
                    </div>

                    {/* Text */}
                    <div className="flex flex-col gap-1">
                      <span
                        className={`text-sm font-medium ${step.status === 'done' ? 'text-gray-900' : 'text-gray-500'}`}
                      >
                        {step.label}
                      </span>
                      <div className="flex flex-col text-xs text-gray-500">
                        {step.date !== 'Pending' ? (
                          <>
                            <span>{step.date}</span>
                            <span>{step.time}</span>
                          </>
                        ) : (
                          <span>Pending</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* Offer Letter */}
          <Card className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
            <CardHeader className="border-b border-gray-50 px-6 py-4">
              <CardTitle className="text-base font-bold text-gray-900">
                Offer Letter
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center p-6 py-8">
              <div className="w-full rounded-lg border border-gray-100 bg-gray-50 py-4 text-center text-sm text-gray-500">
                No offer yet
              </div>
            </CardContent>
          </Card>
        </aside>
      </main>

      {/* Footer / Select Wrapper if needed, or just end of page */}
    </div>
  );
}
