import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

import PlusIcon from '@/assets/icons/plus.svg';

const CustomModal = ({
  children,
  open,
  handleClose,
  title,
  description,
  icon,
}) => {
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] md:w-[75%] max-w-3xl overflow-y-auto px-12 py-8 rounded-xl sm:max-w-xl">
        <div className="flex gap-3 mb-2">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-[#254C00] text-white ${description ? 'mt-2' : ''}`}>
            <img src={icon ?? PlusIcon} className="size-4" />
          </div>

          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[24px] font-semibold">
              {title}
            </DialogTitle>

            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        </div>

        {children}
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
