import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVerticalIcon } from 'lucide-react';

export default function AppDropdownMenu({ dropdownActions = [], handleDropdownAction, data }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVerticalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {dropdownActions.map((action, actionIndex) => (
          <DropdownMenuItem
            key={actionIndex}
            onClick={() =>
              handleDropdownAction(action.key, data)
            }
          >
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}