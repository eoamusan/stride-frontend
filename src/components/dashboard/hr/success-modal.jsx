import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import successImage from '@/assets/images/hr/success.png';

/**
 * Reusable success modal with confetti graphic, title, subtitle, and Back button.
 * Used after adding an employee, creating a ticket, etc.
 */
export default function SuccessModal({
  open,
  onOpenChange,
  title = 'Success',
  subtitle,
  onBack,
}) {
  const handleBack = () => {
    onBack?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[90vh] w-full max-w-md flex-col items-center overflow-hidden rounded-2xl border-0 bg-white p-0 shadow-xl"
        showCloseButton={false}
        overlayClassName="bg-[#0C0C0CE5]"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-10 size-8 rounded-full border-0"
          aria-label="Close"
        >
          <X className="size-4" />
        </Button>

        <div className="flex w-full flex-col items-center px-8 pt-8 pb-10">
          <div className="relative mb-6 flex justify-center">
            <img
              src={successImage}
              alt="Success"
              className="h-[180px] w-auto object-contain"
            />
          </div>

          <h2 className="text-center text-2xl font-bold text-gray-900">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-center text-sm font-normal text-gray-600">
              {subtitle}
            </p>
          )}

          <Button
            type="button"
            onClick={handleBack}
            className="font-raleway mt-8 h-11 min-w-[140px] rounded-full border-0 bg-[#3300C9] px-8 py-2 text-[12px] leading-[24px] font-normal text-white hover:bg-[#3300C9]/90"
          >
            Back
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
