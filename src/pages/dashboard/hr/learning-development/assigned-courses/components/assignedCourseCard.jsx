import React, { useState } from 'react';

import { XIcon } from 'lucide-react';

import { Progress } from '@/components/ui/progress';
import { CustomButton } from '@/components/customs';
import CustomDialog from '@/components/customs/dialog';
import CertificatePreview from '../../components/certificatePreview';

import PlayIcon from '@/assets/icons/white-play.svg';
import AwardIcon from '@/assets/icons/blue-cert.svg';
import DocumentIcon from '@/assets/icons/document-text.svg';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const CourseCard = ({
  title,
  category,
  image,
  type,
  status,
  progress,
  dueDate,
  completionDate,
  onClick,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('video');

  const typeStyles = {
    mandatory: 'bg-red-500/80',
    optional: 'bg-blue-400/80',
  };

  const statusStyles = {
    'in progress': 'bg-orange-400/80 text-white',
    'not started': 'bg-[#D9D9D9CC] text-gray-700',
    completed: 'bg-emerald-500/80 text-white',
  };

  const progressIndicatorStyles = {
    'in progress': 'bg-primary',
    'not started': 'bg-gray-200',
    completed: 'bg-primary',
  };

  const isCompleted = status?.toLowerCase() === 'completed';

  const openLearningDialog = (event) => {
    event.stopPropagation();
    setDialogMode('video');
    setDialogOpen(true);
  };

  const openCertificateDialog = (event) => {
    event.stopPropagation();
    setDialogMode('certificate');
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <div
        onClick={onClick}
        className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
      >
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute inset-x-3 top-3 flex justify-between">
            <span
              className={`rounded-full px-5 py-2 text-xs font-medium text-white ${typeStyles[type?.toLowerCase() ?? '']}`}
            >
              {type}
            </span>

            <span
              className={`rounded-lg px-3 py-2 text-xs font-medium ${statusStyles[status?.toLowerCase() ?? '']}`}
            >
              {status}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <span className="w-fit rounded-lg bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-600">
            {category}
          </span>

          <h3 className="line-clamp-2 font-bold text-gray-600">{title}</h3>

          <div className="mb-6 space-y-2">
            <div className="flex justify-between text-xs font-medium text-gray-500">
              <span>{progress}% Completed</span>
              <span>
                {isCompleted
                  ? `Completed on ${completionDate}`
                  : `Due in ${dueDate}`}
              </span>
            </div>

            <Progress
              value={progress}
              className="h-1.5 w-full bg-gray-100"
              indicatorClassName={
                progressIndicatorStyles[status?.toLowerCase() ?? ''] ??
                'bg-gray-200'
              }
            />
          </div>

          {isCompleted ? (
            <CustomButton
              variant="outline"
              className="text-primary border border-blue-800 font-semibold hover:bg-blue-50"
              onClick={openCertificateDialog}
            >
              <img src={AwardIcon} alt="Award" />
              View Certificate
            </CustomButton>
          ) : (
            <CustomButton onClick={openLearningDialog}>
              <img src={PlayIcon} alt="Play" />
              {progress > 0 ? 'Continue Learning' : 'Start Course'}
            </CustomButton>
          )}
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
                <span className="mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-900 text-green-600">
                  <img src={DocumentIcon} alt="document" className="h-4 w-4" />
                </span>

                <div className="space-y-1">
                  <DialogTitle className="text-[24px]">
                    {dialogMode === 'certificate'
                      ? 'Certificate Preview'
                      : 'Continue Learning'}
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
              <div className="mb-2 min-h-full">
                {dialogMode === 'certificate' ? (
                  <div className="rounded-xl bg-white px-6">
                    <CertificatePreview />
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {dialogMode === 'video' ? (
                      <video
                        controls
                        className="h-[420px] w-full overflow-hidden rounded-lg border"
                      >
                        <source
                          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="flex h-[520px] w-full flex-col overflow-hidden rounded-lg border">
                        <iframe
                          src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                          title={`${title} PDF`}
                          className="h-full w-full"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-shrink-0 items-center justify-between border-t px-6 py-10">
            <CustomButton variant="outline" onClick={handleCloseDialog}>
              Back
            </CustomButton>

            <div className="flex items-center gap-3">
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

      {/* <CustomDialog
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        title={
          dialogMode === 'certificate'
            ? 'Certificate Preview'
            : 'Continue Learning'
        }
        outlineBtnText="Close"
        defaultBtnText={
          dialogMode === 'certificate' ? 'Download' : 'Mark as Complete'
        }
        onOutlineBtnClick={handleCloseDialog}
        onDefaultBtnClick={handleCloseDialog}
      >
        {dialogMode === 'certificate' ? (
          <CertificatePreview />
        ) : (
          <div className="flex flex-col gap-4">
            {dialogMode === 'video' ? (
              <video
                controls
                className="h-[420px] w-full overflow-hidden rounded-lg border"
              >
                <source
                  src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="flex h-[520px] w-full flex-col overflow-hidden rounded-lg border">
                <iframe
                  src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
                  title={`${title} PDF`}
                  className="h-full w-full"
                />
              </div>
            )}
          </div>
        )}
      </CustomDialog> */}
    </>
  );
};

export default CourseCard;
