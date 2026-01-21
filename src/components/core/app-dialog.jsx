import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export function AppDialog({
  open,
  onOpenChange,
  headerIcon,
  title,
  description,
  children,
  footer,
  className
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("overflow-y-scroll max-h-9/12 lg:max-h-11/12", className)}>
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