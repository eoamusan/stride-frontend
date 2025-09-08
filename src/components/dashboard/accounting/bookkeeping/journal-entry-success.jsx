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

export default function JournalEntrySuccess({
  open,
  onOpenChange,
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
            Entry Added
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-1 text-center text-base">
            You&apos;ve successfully added an entry.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <hr className="my-4" />
        <AlertDialogFooter className={'w-full'}>
          <AlertDialogAction onClick={handleBack} className="mb-4 h-10 w-full">
            Back
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
