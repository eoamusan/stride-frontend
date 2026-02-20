import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  ArrowLeftIcon,
  Briefcase,
  CheckCircleIcon,
  XCircleIcon,
} from 'lucide-react';
import ScheduleInterviewForm from '../../form/schedule-interview-form';
import { interviewSchedulesDummyData } from '../dummyData';
import ActivityLog from '@/components/dashboard/hr/activity-log';

import EmailIcon from '@/assets/icons/mail.svg';
import LocationIcon from '@/assets/icons/location.svg';
import PhoneIcon from '@/assets/icons/phone.svg';
import SaveIcon from '@/assets/icons/save.svg';
import CalendarIcon from '@/assets/icons/calendar.svg';
import UserIcon from '@/assets/icons/user.svg';
import DepartmentIcon from '@/assets/icons/dept.svg';

import { CustomButton } from '@/components/customs';
import Fields from '@/components/dashboard/hr/overview/fields';

export default function InterviewScheduleDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const interview = interviewSchedulesDummyData.find((i) => i.id === id);
  // Timeline Steps matching the image "Activity Timeline"
  const activityLog = [
    {
      title: 'Interview Scheduled',
      date: 'May 12, 2024',
      time: '10:30 AM',
      checked: true,
    },
    {
      title: 'Interview Confirmed',
      date: 'May 12, 2024',
      time: '10:30 AM',
      checked: true,
    },
    {
      title: 'Interview Completed',
      date: 'Pending',
      checked: false,
    },
    { title: 'Offer Sent', date: 'Pending', checked: false },
    { title: 'Offer Accepted', date: 'Pending', checked: false },
  ];

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
      <main className="grid gap-6 md:gap-8 lg:grid-cols-3">
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

        {/* Job Header Card */}
        <div className="flex flex-col items-end justify-between gap-4 md:flex-row md:items-center lg:col-span-3">
          <header className="flex w-full items-end gap-4">
            <div className="flex w-full flex-col gap-4 md:w-156 md:flex-row md:items-center md:gap-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#B190B6] md:h-34 md:w-34">
                <Briefcase className="h-14 w-14 text-white md:h-24 md:w-24" />
              </div>
              <div className="flex flex-col gap-2">
                <hgroup className="space-y-1">
                  <h1 className="font-semibold">{interview.applicantName}</h1>
                  <p className="text-sm font-medium text-gray-700">
                    {interview.roleApplied}
                  </p>
                </hgroup>
                <div className="flex flex-col gap-4 text-xs text-gray-400 md:flex-row">
                  <span className="flex items-center gap-1 text-gray-700">
                    <img src={EmailIcon} alt="Calendar" className="h-6 w-6" />
                    {interview.email}
                  </span>
                  <span className="flex items-center gap-1 text-gray-700">
                    <img src={PhoneIcon} alt="Calendar" className="h-6 w-6" />
                    {interview.phone}
                  </span>
                  <span className="flex items-center gap-1 text-gray-700">
                    <img
                      src={LocationIcon}
                      alt="Calendar"
                      className="h-6 w-6"
                    />
                    {interview.location}
                  </span>
                </div>
              </div>
            </div>

            <Badge
              variant={
                interview.status === 'Upcoming'
                  ? 'warn'
                  : interview.status === 'Completed'
                    ? 'success'
                    : 'danger'
              }
              className="inline px-4 py-1 text-sm capitalize md:hidden"
            >
              {interview.status}
            </Badge>
          </header>

          <div className="flex w-full flex-col gap-2 md:w-auto md:items-end md:gap-8">
            <Badge
              variant={
                interview.status === 'Upcoming'
                  ? 'warn'
                  : interview.status === 'Completed'
                    ? 'success'
                    : 'danger'
              }
              className="hidden px-4 py-1 text-sm capitalize md:inline"
            >
              {interview.status}
            </Badge>

            <div className="flex w-full justify-end md:gap-4">
              <CustomButton className="inline-flex w-5/11 rounded-xl py-6 text-sm md:w-auto">
                <img src={SaveIcon} alt="Save Changes" className="mr-1" />
                Generate Offer
              </CustomButton>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <section className="space-y-10 rounded-2xl bg-white p-8 lg:col-span-2">
          {/* Interview Logistics */}
          <h2 className="font-semibold">Interview Logistics</h2>
          <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
            <Fields
              title={interview.applicantName}
              header="Applicant"
              icon={<img src={UserIcon} alt="Calendar" className="h-6 w-6" />}
            />
            <Fields
              title={`${interview.interviewDate}, ${interview.interviewTime}`}
              header="Date & Time"
              icon={
                <img src={CalendarIcon} alt="Calendar" className="h-6 w-6" />
              }
            />
            <Fields
              title={interview.roleApplied}
              header="Role Applied For"
              icon={
                <img src={DepartmentIcon} alt="Calendar" className="h-6 w-6" />
              }
            />
            <Fields
              title={`${interview?.interviewerName || 'N/A'}`}
              header="Interviewer(s)"
              icon={<img src={UserIcon} alt="Calendar" className="h-6 w-6" />}
            />
            <Fields
              title={interview?.interviewType || 'N/A'}
              header="Interview Type"
              icon={
                <img src={CalendarIcon} alt="Calendar" className="h-6 w-6" />
              }
            />
            <Fields
              title={interview?.location || 'N/A'}
              header="Location / Link"
              icon={
                <img src={LocationIcon} alt="Calendar" className="h-6 w-6" />
              }
            />
          </div>
        </section>
        <ActivityLog activity={activityLog} />
        {/* Action Buttons */}
        <footer className="mt-8 flex gap-3">
          <CustomButton
            onClick={() => console.log('Submit')}
            className="inline-flex w-48 rounded-xl py-6 text-sm"
          >
            <CheckCircleIcon className="mr-2 h-4 w-4" />
            Submit
          </CustomButton>

          <CustomButton
            variant="outline"
            onClick={() => console.log('Not Selected')}
            className="w-48 rounded-xl border-green-500 bg-transparent py-6 text-xs text-green-500"
          >
            <XCircleIcon className="mr-2 h-4 w-4" />
            Not Selected
          </CustomButton>
        </footer>
      </main>
    </div>
  );
}
