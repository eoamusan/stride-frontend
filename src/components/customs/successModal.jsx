import { X } from 'lucide-react';
import successIcon from '@/assets/icons/success.svg';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import CustomButton from './button';

const SuccessModal = ({
  open,
  onOpenChange,
  title = 'Action Completed',
  description = "You've successfully completed this action.",
  buttonText = 'Back',
  onAction,
}) => {
  const handleClose = () => {
    onOpenChange?.(false);
  };

  const handleAction = () => {
    if (onAction) onAction();
    else handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-sm rounded-2xl p-8 text-center sm:max-w-xl">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={handleClose}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <DialogHeader className="space-y-4">
          <div className="mx-auto flex items-center justify-center">
            <img src={successIcon} alt="Success" />
          </div>

          <div className="space-y-3">
            <DialogTitle className="text-center text-2xl md:text-[28px] font-bold text-gray-900">
              {title}
            </DialogTitle>

            <p className="text-center text-gray-700">{description}</p>
          </div>

          <hr />
        </DialogHeader>

        <div className="mt-4 mb-4">
          <CustomButton
            variant="default"
            onClick={handleAction}
            className="md:w-full rounded-xl text-base py-6"
          >
            {buttonText}
          </CustomButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;