import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CirclePlusIcon, PlusIcon } from 'lucide-react';

export default function CallToAction() {
  const ctaButtons = [
    {
      text: 'Create invoice',
      variant: 'default',
      action: 'Create invoice clicked',
    },
    {
      text: 'New project',
      variant: 'outline',
      action: 'New project clicked',
    },
    {
      text: 'Add new task',
      variant: 'outline',
      action: 'Add new task clicked',
    },
  ];

  const handleButtonClick = (action) => {
    console.log(action);
  };

  return (
    <>
      {/* Desktop Version */}
      <div className="hidden items-center gap-2 md:flex">
        {ctaButtons.map((button, index) => (
          <Button
            key={index}
            variant={button.variant}
            className="h-10 text-sm font-medium"
            onClick={() => handleButtonClick(button.action)}
          >
            <CirclePlusIcon size={24} className="mr-2" />
            {button.text}
          </Button>
        ))}
      </div>

      {/* Mobile Version */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="text-primary flex w-full items-center justify-start gap-2">
              <div className="bg-primary flex h-6 w-6 items-center justify-center rounded-full">
                <PlusIcon size={16} strokeWidth={3} color="white" />
              </div>
              <span className="text-sm font-medium">Quick Links</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mt-1 mr-4 w-fit">
            {ctaButtons.map((button, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => handleButtonClick(button.action)}
              >
                <Button
                  key={index}
                  variant={button.variant}
                  className="h-10 text-sm font-medium"
                  onClick={() => handleButtonClick(button.action)}
                >
                  <CirclePlusIcon
                    color={
                      button.variant === 'outline' ? 'currentColor' : 'white'
                    }
                    size={24}
                    className="mr-2"
                  />
                  {button.text}
                </Button>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
