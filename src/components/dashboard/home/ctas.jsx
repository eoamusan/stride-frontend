import { Button } from '@/components/ui/button';
import { CirclePlusIcon } from 'lucide-react';

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
    <div className="flex items-center gap-2">
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
  );
}
