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
  className,
}) => {
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={`flex max-h-[90vh] max-w-3xl flex-col rounded-xl px-12 py-8 sm:max-w-xl md:w-[75%] ${className}`}
      >
        <div className="mb-2 flex flex-shrink-0 gap-3">
          {icon && (
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full bg-[#254C00] text-white ${description ? 'mt-2' : ''}`}
            >
              <img src={icon ?? PlusIcon} className="size-4" />
            </div>
          )}

          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[24px] font-semibold">
              {title}
            </DialogTitle>

            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        </div>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
