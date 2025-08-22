import {
  ExternalLinkIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  XIcon,
} from 'lucide-react';
import { Alert } from '../ui/alert';
import { Link } from 'react-router';

export default function TopAlert({
  title,
  onThumbsUp,
  onThumbsDown,
  onCancel,
  externalLink,
}) {
  return (
    <Alert
      className={
        'relative flex items-center gap-3 bg-[#EFE6FD] text-[#434343] max-md:p-2 md:justify-center md:gap-4'
      }
    >
      <p className="text-[9px] md:text-xs">{title}</p>
      <button className="flex h-7 w-11 items-center justify-center rounded-full bg-white">
        <ThumbsUpIcon onClick={onThumbsUp} size={16} />
      </button>
      <button className="flex h-7 w-11 items-center justify-center rounded-full bg-white">
        <ThumbsDownIcon onClick={onThumbsDown} size={16} />
      </button>

      <Link
        to={externalLink}
        className="mr-5 flex items-center gap-1.5 text-[9px] text-nowrap text-[#24A959] md:gap-2.5 md:text-sm"
      >
        Learn more <ExternalLinkIcon size={16} />
      </Link>

      <XIcon
        size={24}
        className="absolute top-3 right-1.5 cursor-pointer md:top-4 md:right-4"
        onClick={onCancel}
      />
    </Alert>
  );
}
