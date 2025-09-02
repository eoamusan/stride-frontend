import checkmarkIcon from '@/assets/icons/checkmark.svg';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function InvoiceSentModal({
  open,
  onOpenChange,
  handleView,
  handleBack,
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto mb-4 flex h-30 w-30 items-center justify-center">
            <img src={checkmarkIcon} alt="Success" className="" />
          </div>
          <AlertDialogTitle className="text-center">
            Invoice Sent
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-1 text-center text-base">
            You&apos;ve successfully sent the invoice.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <hr className="my-4" />
        <AlertDialogFooter className={'w-full'}>
          <AlertDialogAction
            onClick={handleView}
            className="mb-4 h-10 w-full md:max-w-[50%]"
          >
            View
          </AlertDialogAction>

          <AlertDialogCancel
            onClick={handleBack}
            className="mb-4 h-10 w-full md:max-w-[48%]"
          >
            Back
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
