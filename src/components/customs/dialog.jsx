import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { XIcon } from 'lucide-react';

import DocumentIcon from '@/assets/icons/document-text.svg';
import { Button } from '@/components/ui/button';
import CustomButton from './button';

const CustomDialog = (props) => {
  const {
    isOpen,
    onClose,
    title,
    description,
    children,
    outlineBtnText,
    defaultBtnText,
    onOutlineBtnClick,
    onDefaultBtnClick,
  } = props;

  return (
    <Dialog open={isOpen} onOpenChange={(value) => !value && onClose?.()}>
      <DialogContent
        className="flex h-[90vh] max-h-[90vh] min-h-0 flex-col gap-0 overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-2xl"
        showCloseButton={false}
      >
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between border-b px-6 py-8">
            <div className="flex items-start gap-2 text-lg font-semibold text-gray-900">
              <span className="flex h-8 w-8 mt-2 items-center justify-center rounded-full bg-green-900 text-green-600">
                <img src={DocumentIcon} alt="document" className="h-4 w-4" />
              </span>

              <div className="space-y-1">
                <DialogTitle className="text-[24px]">{title}</DialogTitle>
                <DialogDescription className="text-sm font-normal">{description}</DialogDescription>
              </div>
            </div>

            <Button variant="ghost" size="icon" onClick={onClose}>
              <XIcon className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-auto bg-[#F5F6FA]">
          <div className="min-h-full p-6">
            <div className="min-h-full rounded-xl border border-gray-200 bg-white px-6 py-6 mb-2">
              {children}
            </div>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center justify-end border-t px-6 py-10">
          <div className="flex items-center gap-3">
            <CustomButton variant="outline" onClick={onOutlineBtnClick}>
              {outlineBtnText}
            </CustomButton>

            <CustomButton onClick={onDefaultBtnClick}>
              {defaultBtnText}
            </CustomButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
