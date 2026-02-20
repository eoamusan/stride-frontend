import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import FilterIcon from '@/assets/icons/filter.svg';

export default function FilterTrigger({ statusFilter }) {
  return (
    <DropdownMenuTrigger>
      <Button
        variant="outline"
        size="icon"
        className={`h-12 w-12 ${statusFilter !== 'all' ? 'border-blue-200 bg-blue-50' : ''}`}
      >
        <img src={FilterIcon} alt="Filter Icon" />
      </Button>
    </DropdownMenuTrigger>
  );
}
