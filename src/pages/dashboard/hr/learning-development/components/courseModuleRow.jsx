import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

import CheckCircleIcon from '@/assets/icons/green-checked.svg';
import PdfIcon from '@/assets/icons/paper.svg';
import PlayIcon from '@/assets/icons/play.svg';
import EyeIcon from '@/assets/icons/blue-eye.svg';

export default function CourseModuleRow({ module }) {
  const leftIcon = module.type === 'pdf' ? PdfIcon : PlayIcon;
  const actionLabel = module.type === 'pdf' ? 'Read PDF' : 'Watch Video';

  return (
    <div className="flex items-end justify-between gap-4 rounded-xl bg-white px-4 md:px-6 py-5 shadow-sm relative">
      <div className="flex min-w-0 items-start gap-3 md:gap-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
          <img src={leftIcon} alt="module" className="h-6 w-6" />
        </div>

        <div className="min-w-0">
          <p className="truncate font-semibold text-gray-900 text-sm md:text-base">{module.title}</p>

          {module.description && (
            <p className="mt-2 line-clamp-2 text-xs md:text-sm font-medium text-gray-900/60">
              {module.description}
            </p>
          )}

          {module.duration && (
            <span className="mt-5 inline-flex items-center rounded-md bg-gray-200 px-3 py-3 text-[11px] font-medium text-gray-700">
              {module.duration}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-5">
        {module.showDownload && (
          <button
            type="button"
            onClick={module.onDownload}
            className="hidden items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 md:flex"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
        )}

        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-lg border-blue-900 text-sm font-semibold text-blue-900 hover:bg-purple-50"
          onClick={module.onAction}
        >
          <img src={EyeIcon} alt="view" className="h-4 w-4" />
          {actionLabel}
        </Button>

        {module.completed && (
          <img src={CheckCircleIcon} alt="completed" className="h-6 w-6 absolute right-6 top-3" />
        )}
      </div>
    </div>
  );
}
