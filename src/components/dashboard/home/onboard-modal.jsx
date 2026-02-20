import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CirclePlusIcon } from 'lucide-react';

export default function OnboardModal({ open, onClose }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-8 sm:max-w-lg">
        <DialogHeader className="text-center">
          <DialogTitle className="text-center text-xl font-semibold">
            Get Started
          </DialogTitle>
          <DialogDescription className="text-center text-[#7D7D7D]">
            Lorem ipsum dolor sit amet consectetur. Auctor aliquet sem vulputate
            diam.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Create invoice button */}
          <Button
            className="h-16 w-full font-medium"
            onClick={() => {
              console.log('Create invoice clicked');
              onClose();
            }}
          >
            <CirclePlusIcon size={24} className="mr-2" />
            Create invoice
          </Button>

          {/* New project button */}
          <Button
            variant="outline"
            className="h-16 w-full font-medium"
            onClick={() => {
              console.log('New project clicked');
              onClose();
            }}
          >
            <CirclePlusIcon className="mr-2" size={24} />
            New project
          </Button>

          {/* Add new task button */}
          <Button
            variant="outline"
            className="h-16 w-full"
            onClick={() => {
              console.log('Add new task clicked');
              onClose();
            }}
          >
            <CirclePlusIcon className="mr-2" size={24} />
            Add new task
          </Button>
        </div>

        {/* Bottom Get Started button */}
        <div className="pt-4">
          <Button
            disabled
            className="h-12 w-full bg-purple-200 font-medium text-white"
            onClick={() => {
              console.log('Get Started clicked');
              onClose();
            }}
          >
            Get Started
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
