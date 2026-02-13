import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

const SearchInput = ({
  value = '',
  onChange,
  onValueChange,
  placeholder = 'Search...',
  className = 'w-full pl-10 py-6 rounded-xl',
  resetPageOnChange = false,
  onResetPage,
}) => {
  const handleChange = (e) => {
    onChange?.(e);
    onValueChange?.(e.target.value);
    if (resetPageOnChange && typeof onResetPage === 'function') onResetPage();
  };

  return (
    <div className="relative">
      <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />

      <Input
        placeholder={placeholder}
        className={className}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchInput;
