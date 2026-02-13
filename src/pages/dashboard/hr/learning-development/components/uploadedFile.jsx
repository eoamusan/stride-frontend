import { X } from 'lucide-react';

import PaperIcon from '@/assets/icons/paper.svg';
import VideoIcon from '@/assets/icons/video.svg';

export default function UploadedFile({ file, onRemove, type = 'document' }) {
  const getFileIcon = () => {
    if (type === 'video') {
      return <img src={VideoIcon} alt="video" />;
    }

    return <img src={PaperIcon} alt="document" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-sm ${
            type === 'video' ? 'bg-red-100' : 'bg-[#3300C91A]'
          }`}
        >
          {getFileIcon()}
        </div>

        <div className='space-y-3'>
          <p className="text-sm font-medium text-gray-900">{file.name}</p>
          <p className="text-sm font-medium text-gray-500">
            {formatFileSize(file.size)} <span className='bg-gray-500 h-1 w-1 rounded-full inline-block mx-2 mb-1'> </span> Uploaded
          </p>
        </div>
      </div>

      <button
        onClick={onRemove}
        className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
        aria-label="Remove file"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
