import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeftIcon, Calendar } from 'lucide-react';
import ScheduleInterviewForm from '../../form/schedule-interview-form';
import { interviewSchedulesDummyData } from '../dummyData';

export default function InterviewScheduleDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

  const interview = interviewSchedulesDummyData.find((i) => i.id === id);

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
          Interview Schedule
        </span>
      </nav>

      {/* Header Section */}
      <header className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
        <div className="flex w-full max-w-4xl flex-col items-start gap-2 md:flex-row md:gap-6">
          {/* Large Avatar */}
          <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-purple-100 shadow-sm">
            <span className="text-3xl font-bold text-purple-600">
              {interview.applicantName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </span>
          </div>

          {/* Header Info */}
          <hgroup className="space-y-1 pt-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {interview.applicantName}
            </h1>
            <p className="text-lg font-semibold text-gray-600">
              {interview.roleApplied}
            </p>
            <p className="max-w-3xl pt-2 text-base leading-relaxed text-gray-500">
              Detail-oriented {interview.roleApplied} experienced in digital
              marketing, content strategy, and analytics-driven decision-making.
              Adept at managing campaigns across social media and online
              platforms while aligning marketing efforts with overall business
              objectives.
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
      </header>
    </div>
  );
}
