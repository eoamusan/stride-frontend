import { useNavigate, useParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { dummyJobRequests } from '../../job-requests';
import { ArrowLeftIcon, Briefcase, CheckCircle2, LinkIcon } from 'lucide-react';
import { CustomButton } from '@/components/customs';
import Avatar from '@/assets/icons/avatar.svg';
import Fields from '@/components/dashboard/hr/overview/fields';
import ActivityLog from '@/components/dashboard/hr/activity-log';

import DocumentIcon from '@/assets/icons/document.svg';
import EditIcon from '@/assets/icons/edit.svg';
import SaveIcon from '@/assets/icons/save.svg';
import PhoneIcon from '@/assets/icons/phone.svg';
import LocationIcon from '@/assets/icons/location.svg';
import userIcon from '@/assets/icons/user-square.svg';

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

      <header className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div className="overflow-hidden rounded-full bg-purple-200">
            <img src={Avatar} alt="avatar" />
          </div>

          <div className="flex flex-col gap-2">
            <div className="space-y-1">
              <h5 className="font-semibold">{applicant?.name}</h5>
              <p className="text-sm font-medium text-gray-700">
                {jobData?.title}
              </p>
            </div>

            <div className="w-160 text-sm">
              <p>
                {applicant?.name} is a {jobData?.title} with 5 years experience
                in the field. He is currently working at Lorem ipsum dolor sit
                amet consectetur adipisicing elit. Fuga provident amet, ipsa
                quas cumque nisi laboriosam perferendis cum eius sapiente.
                Accusantium.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-4">
          <Badge
            variant={
              (applicant?.status === 'Pending' && 'pending') ||
              (applicant?.status === 'Approved' && 'approved') ||
              (applicant?.status === 'Rejected' && 'rejected') ||
              (applicant?.status === 'Review' && 'review') ||
              (applicant?.status === 'Interviewing' && 'interviewing') ||
              (applicant?.status === 'Shortlisted' && 'shortlisted')
            }
            className="border-0 px-4 py-1 text-sm"
          >
            {applicant?.status}
          </Badge>

          {applicant?.status === 'Approved' ? (
            <CustomButton className="rounded-xl py-6 text-sm">
              <img src={DocumentIcon} alt="Download Payslip" className="mr-1" />
              Download Payslip
            </CustomButton>
          ) : applicant?.status === 'Offer Sent' ? (
            <CustomButton>
              <img src={SaveIcon} alt="Save Changes" className="mr-1" />
              Save Changes
            </CustomButton>
          ) : applicant?.status === 'Offer Accepted' ? (
            <CustomButton className="rounded-xl py-6 text-sm">
              <img src={EditIcon} alt="Edit Payroll" className="mr-1" />
              Edit Payroll
            </CustomButton>
          ) : (
            <CustomButton className="rounded-xl py-6 text-sm">
              <img src={EditIcon} alt="Edit Payroll" className="mr-1" />
              Edit Payroll
            </CustomButton>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* LEFT COLUMN */}
        <section className="space-y-6 lg:col-span-2">
          {/* Personal Information */}
          <article className="rounded-2xl bg-white px-8 py-4 md:col-span-3 xl:col-span-2">
            <hgroup>
              <h2 className="mb-6 text-lg font-semibold text-gray-900">
                Personal Information
              </h2>
            </hgroup>

            <div className="mb-8 grid gap-6 sm:grid-cols-2">
              <Fields
                title={applicant?.name}
                header="Name"
                icon={<img src={userIcon} className="h-6 w-6 text-gray-400" />}
              />
              <Fields
                title={applicant?.personalInfo?.phone}
                header="Phone"
                icon={<img src={PhoneIcon} className="h-6 w-6 text-gray-400" />}
              />
              <Fields
                title={applicant?.personalInfo?.email}
                header="Email Address"
                icon={<img src={userIcon} className="h-6 w-6 text-gray-400" />}
              />
              <Fields
                title={applicant?.personalInfo?.location}
                header="Location"
                icon={
                  <img src={LocationIcon} className="h-6 w-6 text-gray-400" />
                }
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
              {[
                {
                  title: 'Marketing Lead',
                  company: 'Bubbl HQ',
                  date: 'January 2020 - March 2024',
                  description:
                    'Led marketing strategy and execution at Bubbl HQ, overseeing brand positioning, campaign planning, and audience growth. Drove engagement through content strategy, digital campaigns, and data-informed decision-making while aligning marketing efforts with business goals.',
                },
                {
                  title: 'Senior Marketing Specialist',
                  company: 'TechFlow',
                  date: 'June 2018 - December 2019',
                  description:
                    'Managed digital marketing campaigns, social media strategy, and content creation. Increased engagement by 40% and generated 20% more leads through targeted ad campaigns.',
                },
              ].map((exp, index, arr) => (
                <div key={index} className="relative flex gap-5">
                  {/* Connector Line */}
                  {index !== arr.length - 1 && (
                    <div className="absolute top-12 left-[23px] h-full w-0.5 bg-gray-100" />
                  )}

                  <div className="z-10 shrink-0 pt-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3b82f6] shadow-sm">
                      <Briefcase className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-3 pb-6">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-base font-bold text-gray-900">
                          {exp.title}
                        </h3>
                        <p className="text-sm text-gray-500">{exp.company}</p>
                      </div>
                      <div className="flex items-center gap-1.5 self-start rounded-full border border-gray-200 bg-transparent px-3 py-1.5 text-xs font-medium text-gray-600">
                        <CheckCircle2 className="h-3.5 w-3.5 text-gray-900" />
                        <span>{exp.date}</span>
                      </div>
                    </div>
                    <p className="max-w-2xl text-sm leading-relaxed text-gray-500">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
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
        <div>
          <ActivityLog activity={activityLog} />
        </div>
      </main>
    </div>
  );
}
