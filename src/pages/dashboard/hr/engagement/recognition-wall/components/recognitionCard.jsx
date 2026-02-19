import { MoreHorizontalIcon, ThumbsUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ClockIcon from '@/assets/icons/clock.svg';
import EditIcon from '@/assets/icons/gray-edit.svg';
import DeleteIcon from '@/assets/icons/gray-delete.svg';
import BlueAwardIcon from '@/assets/icons/blue-award.svg';
import PurpleAwardIcon from '@/assets/icons/purple-award.svg';

const badgeStyles = {
  teamwork: 'bg-blue-100 text-blue-600',
  collaboration: 'bg-purple-100 text-purple-600',
  leadership: 'bg-blue-100 text-blue-600',
  innovation: 'bg-purple-100 text-purple-600',
};

const getBadgeStyle = (category) => {
  const key = category?.toLowerCase();
  return badgeStyles[key] || 'bg-gray-100 text-gray-600';
};

const RecognitionCard = ({
  senderName,
  senderRole,
  senderImage,
  recipientName,
  recipientImage,
  message,
  category,
  timeAgo,
  likeCount = 0,
  onEdit,
  onDelete,
}) => {
  const getAwardIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'teamwork':
      case 'leadership':
        return BlueAwardIcon;
      case 'collaboration':
      case 'innovation':
        return PurpleAwardIcon;
      default:
        return PurpleAwardIcon;
    }
  };

  return (
    <div className="relative rounded-2xl border border-gray-100 bg-white py-8 ps-8 pr-6 shadow-sm">
      {/* Dropdown Menu */}
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontalIcon className="h-5 w-5 text-gray-400" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit} className="text-xs">
              <img src={EditIcon} alt="edit" className="mr-0.5 h-3 w-3" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem onClick={onDelete} className="text-xs">
              <img src={DeleteIcon} alt="delete" className="mr-0.5 h-3 w-3" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 overflow-hidden rounded-full">
            <img
              src={senderImage}
              alt={senderName}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="my-2 h-8 w-0.5 bg-gray-200" />

          <div className="h-12 w-12 overflow-hidden rounded-full">
            <img
              src={recipientImage}
              alt={recipientName}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-6 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-black">{senderName}</span>
              <span className="h-2 w-2 rounded-full border-2 bg-black text-black"></span>
              <span className="text-sm font-medium text-black/80">
                {senderRole}
              </span>
            </div>

            <p className="text-sm text-gray-500">
              recognized{' '}
              <span className="ms-2 font-medium text-gray-900">
                {recipientName}
              </span>
            </p>

            <p className="text-sm leading-relaxed text-gray-600">{message}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span
                className={`flex items-center gap-1.5 rounded-full px-4 py-0.5 text-xs font-medium ${getBadgeStyle(category)}`}
              >
                <img src={getAwardIcon(category)} alt={category} />
                {category}
              </span>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <img src={ClockIcon} alt="time" className="h-4 w-4" />
                <span className="text-xs">{timeAgo}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 rounded-xl bg-gray-100 px-2 py-1 text-xs">
              <ThumbsUp className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">{likeCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecognitionCard;
