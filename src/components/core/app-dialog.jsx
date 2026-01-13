import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function AppDialog({
  open,
  onOpenChange,
  headerIcon,
  title,
  description,
  children,
  footer,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {/* Header */}
        <div className="flex gap-3">
          { headerIcon && <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#254C00] text-white">
            { headerIcon }
          </div> }
          <div>
            <DialogHeader>
              <DialogTitle className="text-xl">
                { title }
              </DialogTitle>
              <DialogDescription className="text-sm">
                { description }
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>
        { children }
        { footer && <DialogFooter>
            { footer }
          </DialogFooter> }
      </DialogContent>
    </Dialog>
  )
}