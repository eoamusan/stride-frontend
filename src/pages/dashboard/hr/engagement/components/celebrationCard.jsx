import { MoreHorizontalIcon } from 'lucide-react';
import { CustomButton } from '@/components/customs';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import birthdayIcon from '@/assets/icons/birthday.svg';
import workAnniversaryIcon from '@/assets/icons/work-anniversary.svg';
import promotionIcon from '@/assets/icons/promotion.svg';
import MessageSquare from '@/assets/icons/message.svg';
import EditIcon from '@/assets/icons/gray-edit.svg';
import DeleteIcon from '@/assets/icons/gray-delete.svg';

const CelebrationCard = (props) => {
  const { name, image, celebrationType, date, onEdit, onDelete, onSendWishes } =
    props;

  const celebrationStyles = {
    birthday: 'bg-pink-50 text-pink-500',
    'work anniversary': 'bg-purple-50 text-purple-500',
    promotion: 'bg-amber-50 text-amber-500',
  };

  const getCelebrationStyles = (type) => {
    switch (type.toLowerCase()) {
      case 'birthday':
        return celebrationStyles.birthday;
      case 'work anniversary':
        return celebrationStyles['work anniversary'];
      case 'promotion':
        return celebrationStyles.promotion;
      default:
        return null;
    }
  };

  const celebrationTypeStyles = getCelebrationStyles(celebrationType);

  const getCelebrationIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'birthday':
        return birthdayIcon;
      case 'work anniversary':
        return workAnniversaryIcon;
      case 'promotion':
        return promotionIcon;
      default:
        return null;
    }
  };

  const iconSrc = getCelebrationIcon(celebrationType);

  return (
    <div className="relative space-y-4 rounded-2xl border border-gray-50 bg-white px-6 pt-10 pb-6 text-center shadow-sm">
      {/* Dropdown Menu */}
      <div className="absolute top-2 right-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontalIcon className="h-5 w-5 text-gray-400" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="text-sm">
            <DropdownMenuItem onClick={onEdit} className="text-sm">
              <img src={EditIcon} alt="edit" className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem onClick={onDelete} className="text-sm">
              <img src={DeleteIcon} alt="delete" className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="relative inline-block">
        <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-sm">
          <img src={image} alt={name} className="h-full w-full object-cover" />
        </div>

        <div className="absolute right-0 bottom-0 translate-x-1 translate-y-1 rounded-full bg-white p-1 shadow-md">
          <img src={iconSrc} alt={celebrationType} className="h-6 w-6" />
        </div>
      </div>

      <div className='w-full'>
        <h3 className="text-lg font-bold text-gray-800">{name}</h3>
        <div className="mt-1 flex items-center justify-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-[10px] font-semibold ${celebrationTypeStyles}`}
          >
            {celebrationType}
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-xs font-medium text-gray-500">{date}</span>
        </div>
      </div>

      <CustomButton className='md:w-full rounded-xl text-sm' onClick={onSendWishes}>
        <img src={MessageSquare} alt="Send Message" className="mr-1" />
        Send Wishes
      </CustomButton>
    </div>
  );
};

export default CelebrationCard;
