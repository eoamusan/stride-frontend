import checkmarkIcon from '@/assets/icons/checkmark.svg';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function SuccessModal({
  title,
  description,
  nextText,
  backText,
  open,
  onOpenChange,
  handleBack,
  handleNext,
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mx-auto mb-4 flex h-30 w-30 items-center justify-center">
            <img src={checkmarkIcon} alt="Success" className="" />
          </div>
          <AlertDialogTitle className="text-center">{title}</AlertDialogTitle>
          <AlertDialogDescription className="mt-1 text-center text-base">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <hr className="my-4" />
        <AlertDialogFooter className={'w-full'}>
          {handleNext ? (
            <>
              <AlertDialogAction
                onClick={handleNext}
                className="mb-4 h-10 w-full md:max-w-[50%]"
              >
                {nextText}
              </AlertDialogAction>

              <AlertDialogCancel
                onClick={handleBack}
                className="mb-4 h-10 w-full md:max-w-[48%]"
              >
                {backText}
              </AlertDialogCancel>
            </>
          ) : (
            <AlertDialogAction
              onClick={handleBack}
              className="mb-4 h-10 w-full"
            >
              {backText}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
