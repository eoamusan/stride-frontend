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

export default function AlertModal({
  title,
  description,
  nextText,
  backText,
  open,
  onOpenChange = () => {},
  handleBack,
  handleNext,
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-xl">
        <AlertDialogHeader>
          <div className="mx-auto mb-4 flex h-30 w-30 items-center justify-center">
            <img src={checkmarkIcon} alt="Success" className="" />
          </div>

          <AlertDialogTitle className="text-center text-[28px] font-bold">
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription className="mt-1 text-center text-base md:mx-6">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <hr className="my-4" />

        <AlertDialogFooter className={'w-full space-x-2'}>
          {handleNext ? (
            <>
              <AlertDialogAction
                onClick={handleNext}
                className="mb-4 h-10 w-full rounded-xl text-xs md:max-w-[50%]"
              >
                {nextText}
              </AlertDialogAction>

              <AlertDialogCancel
                onClick={handleBack}
                className="mb-4 h-10 w-full rounded-xl text-xs md:max-w-[48%]"
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
