import {
  ExternalLinkIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  XIcon,
} from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { Link } from 'react-router';

export default function TopAlert({
  title,
  onThumbsUp,
  onThumbsDown,
  onCancel,
  externalLink,
}) {
  return (
    <Alert className={'relative bg-[#EFE6FD]'}>
      <AlertDescription
        className={'flex items-center justify-center gap-4 text-[#434343]'}
      >
        <p>{title}</p>
        <button className="flex h-7 w-11 items-center justify-center rounded-full bg-white">
          <ThumbsUpIcon onClick={onThumbsUp} size={20} />
        </button>
        <button className="flex h-7 w-11 items-center justify-center rounded-full bg-white">
          <ThumbsDownIcon onClick={onThumbsDown} size={20} />
        </button>

        <Link
          to={externalLink}
          className="flex items-center gap-2.5 text-[#24A959]"
        >
          Learn more <ExternalLinkIcon size={20} />
        </Link>
      </AlertDescription>

      <XIcon
        size={24}
        className="absolute top-4 right-4 cursor-pointer"
        onClick={onCancel}
      />
    </Alert>
  );
}
