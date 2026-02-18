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
import { AlertTriangle } from 'lucide-react';

export default function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone. This will permanently delete the item from the system.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isLoading = false,
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="size-6 text-red-600" />
            </div>
            <div className="flex-1">
              <AlertDialogTitle className="font-raleway text-lg font-semibold">
                {title}
              </AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="font-raleway mt-4 text-sm text-gray-600">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6 gap-3 sm:gap-3">
          <AlertDialogCancel
            disabled={isLoading}
            className="font-raleway h-11 rounded-full border border-gray-300 px-6 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="font-raleway h-11 rounded-full bg-red-600 px-6 text-sm font-medium text-white hover:bg-red-700"
          >
            {isLoading ? 'Deleting...' : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
