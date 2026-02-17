import React, { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { CustomButton } from '@/components/customs';
import { Progress } from '@/components/ui/progress';

import BackArrowIcon from '@/assets/icons/back-arrow.svg';
import ClockIcon from '@/assets/icons/white-clock.svg';
import UsersIcon from '@/assets/icons/white-users.svg';
import CheckCircleIcon from '@/assets/icons/green-checked.svg';
import PdfIcon from '@/assets/icons/paper.svg';
import PlayIcon from '@/assets/icons/play.svg';
import EyeIcon from '@/assets/icons/blue-eye.svg';
import WhiteEyeIcon from '@/assets/icons/white-eye.svg';
import DocumentIcon from '@/assets/icons/document-text.svg';
import { XIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const CourseDetails = ({ course, onBack }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [dialogMode, setDialogMode] = useState('pdf');

  const modules = useMemo(
    () => [
      {
        id: 1,
        title: 'Introduction to Information Security',
        duration: '12 mins',
        type: 'video',
        completed: true,
        videoUrl:
          'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      },
      {
        id: 2,
        title: 'Phishing Indicators 101',
        duration: '15 mins',
        type: 'video',
        completed: false,
        videoUrl:
          'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      },
      {
        id: 3,
        title: 'Secure Communication Basics',
        duration: '10 mins',
        type: 'video',
        completed: false,
        videoUrl:
          'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      },
      {
        id: 4,
        title: 'Company Security Policy',
        duration: '12 mins',
        type: 'pdf',
        completed: false,
        pdfUrl:
          'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      },
    ],
    []
  );

  const activeModule = useMemo(
    () => modules.find((module) => module.id === activeModuleId) ?? null,
    [activeModuleId, modules]
  );

  const handleModuleClick = (module) => {
    setActiveModuleId(module.id);
    setDialogMode(module.type);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setActiveModuleId(null);
  };

  return (
    <div className="flex flex-col gap-8 px-4 py-6 sm:px-6 lg:px-0">
      <button
        onClick={onBack}
        className="inline-flex cursor-pointer items-center gap-2 text-base font-semibold text-black hover:text-gray-900 sm:text-xl"
      >
        <img src={BackArrowIcon} alt="back" />
        View Details
      </button>

      <div className="relative overflow-hidden rounded-2xl bg-[#0a0a20] p-8 text-white md:p-12">
        {/* Background abstract overlay (simplified) */}
        <div className="absolute inset-0">
          <img
            src={course.image}
            alt={course.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/70" />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-between gap-6 lg:flex-row">
          <div className="max-w-2xl space-y-2 text-center lg:text-left">
            <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
              <span className="bg-primary min-w-24 rounded-lg px-3 py-2 text-center text-xs font-medium">
                Compliance
              </span>
              <span className="min-w-24 rounded-lg bg-red-500 px-3 py-2 text-center text-xs font-medium">
                Mandatory
              </span>
              <span className="min-w-24 rounded-lg bg-emerald-500 px-3 py-2 text-center text-xs font-medium">
                Online
              </span>
            </div>

            <h1 className="text-2xl font-semibold text-white md:text-[28px]">
              {course.title}
            </h1>

            <p className="mt-2 text-sm text-white md:text-base">
              Essential security practices for all employees. Learn how to
              identify phishing attempts, secure your devices, and protect
              company data.
            </p>
          </div>

          <div className="flex w-full flex-col items-center gap-3 text-center text-sm text-gray-300 sm:w-auto sm:items-end sm:text-right lg:min-w-[220px]">
            <div className="flex items-center gap-1">
              <img src={ClockIcon} alt="duration" />
              <span>45 mins</span>
            </div>

            <div className="flex items-center gap-1">
              <img src={UsersIcon} alt="trainees" />
              <span>24 Trainees</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:flex-row">
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900">Course Progress</h4>
          <p className="text-sm font-medium text-gray-500">
            0 of 5 Items Completed
          </p>
        </div>

        <div className="w-full space-y-2 md:w-1/3">
          <span className="text-[10px] font-bold tracking-wider text-gray-400">
            25% Completed
          </span>

          <Progress
            value={25}
            className="h-1.5"
            indicatorClassName="bg-primary"
          />
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900">Course Modules</h3>
        <div className="space-y-4 md:space-y-8">
          {modules.map((module, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 md:flex-row md:items-end md:justify-between"
            >
              <div className="flex min-w-0 flex-1 items-start gap-4">
                <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
                  {module.type === 'video' ? (
                    <img src={PlayIcon} alt="module" className="h-6 w-6" />
                  ) : (
                    <img src={PdfIcon} alt="module" className="h-6 w-6" />
                  )}
                </div>
                <div className="min-w-0 space-y-1">
                  <h5 className="line-clamp-2 text-sm leading-5 font-semibold break-words text-gray-900 md:text-base">
                    {module.title}
                  </h5>
                  <p className="mt-2 line-clamp-2 text-xs font-medium text-gray-900/60 md:text-sm">
                    Overview of key concepts and why security matters to
                    everyone.
                  </p>
                  <div className="mt-5 inline-flex items-center rounded-md bg-gray-200 px-3 py-3 text-[11px] font-medium text-gray-700">
                    {module.duration}
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end md:gap-4">
                <div className="flex items-center justify-between gap-2 text-xs font-semibold text-gray-600 md:hidden">
                  <span className="text-[11px] tracking-wide text-gray-400 uppercase">
                    {module.completed ? 'Completed' : 'In Progress'}
                  </span>
                  {module.completed ? (
                    <img
                      src={CheckCircleIcon}
                      alt="completed"
                      className="h-5 w-5"
                    />
                  ) : (
                    <div className="h-5 w-5 rounded-full border border-gray-500"></div>
                  )}
                </div>

                <button className="flex w-full items-center justify-center gap-1 text-sm font-medium text-gray-500 hover:text-black sm:w-auto">
                  <Download size={14} /> Download
                </button>

                <CustomButton
                  variant={module.completed ? 'outline' : 'default'}
                  className={`${
                    module.completed
                      ? 'text-primary border-purple-600 hover:bg-purple-50'
                      : ''
                  } w-full justify-center px-6 sm:w-auto`}
                  onClick={() => handleModuleClick(module)}
                >
                  <img
                    src={module.completed ? EyeIcon : WhiteEyeIcon}
                    alt="view"
                    className="h-4 w-4"
                  />
                  {module.type === 'video' ? 'Watch Video' : 'Read PDF'}
                </CustomButton>
              </div>

              <div className="absolute top-3 right-3 hidden md:right-6 md:block">
                {module.completed ? (
                  <img
                    src={CheckCircleIcon}
                    alt="completed"
                    className="h-5 w-5"
                  />
                ) : (
                  <div className="h-5 w-5 rounded-full border border-gray-500"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(value) => !value && handleCloseDialog?.()}
      >
        <DialogContent
          className="flex h-[90vh] max-h-[90vh] min-h-0 flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-2xl"
          showCloseButton={false}
        >
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center justify-between border-b px-6 py-8">
              <div className="flex items-start gap-2 text-lg font-semibold text-gray-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-900 text-green-600">
                  <img src={DocumentIcon} alt="document" className="h-4 w-4" />
                </span>

                <div className="space-y-1">
                  <DialogTitle className="text-[24px]">
                    {dialogMode === 'pdf' ? 'Read PDF' : 'Watch Video'}
                  </DialogTitle>
                </div>
              </div>

              <Button variant="ghost" size="icon" onClick={handleCloseDialog}>
                <XIcon className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </DialogHeader>

          <div className="flex min-h-0 flex-1 flex-col overflow-auto bg-[#F5F6FA]">
            <div className="min-h-full p-6">
              <div className="mb-4 min-h-full">
                {dialogMode === 'pdf' ? (
                  <div className="flex flex-col py-6">
                    {activeModule?.pdfUrl ? (
                      <iframe
                        src={activeModule.pdfUrl}
                        title={activeModule.title}
                        className="h-[60vh] w-full rounded-lg border"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-gray-600">
                        PDF preview unavailable.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {activeModule?.videoUrl ? (
                      <video
                        key={activeModule.videoUrl}
                        controls
                        className="aspect-video w-full overflow-hidden rounded-xl bg-black"
                      >
                        <source src={activeModule.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="flex h-[420px] items-center justify-center rounded-xl border bg-gray-50 text-sm text-gray-600">
                        Video unavailable.
                      </div>
                    )}

                    {activeModule?.description ? (
                      <p className="text-sm text-gray-700">
                        {activeModule.description}
                      </p>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-shrink-0 flex-col items-center justify-between gap-3 border-t px-6 py-10 md:flex-row">
            <CustomButton variant="outline" onClick={handleCloseDialog}>
              Back
            </CustomButton>

            <div className="flex w-full flex-col items-center gap-3 md:w-auto md:flex-row">
              <CustomButton variant="outline" onClick={handleCloseDialog}>
                Download PDF
              </CustomButton>

              <CustomButton onClick={handleCloseDialog}>
                Mark as Complete
              </CustomButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseDetails;
