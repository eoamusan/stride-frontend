import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import sampleImg from '@/assets/images/geisha.png';

const BudgetCard = ({
  isSelected,
  handleSelect,
  item = {
    id: 'GE-001',
    name: 'Geisha',
    code: 'GE-001',
    price: 25,
    stock: 40,
    status: 'In stock',
    image: '/api/placeholder/200/200',
  },
  onSell,
  // onView,
  onSellOnShobu,
  handleDropdownAction,
}) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      'In stock': 'bg-[#24A959]/10 text-[#24A959]',
      'Out of stock': 'bg-red-100 text-red-700',
      'Low stock': 'bg-yellow-100 text-yellow-700',
    };

    return (
      <Badge
        variant="secondary"
        className={statusConfig[status] || 'bg-gray-100 text-gray-700'}
      >
        {status}
      </Badge>
    );
  };

  return (
    <Card className="w-full max-w-xs overflow-hidden p-4">
      <CardContent className={'px-0'}>
        {/* Header with checkbox and menu */}
        <div className="mb-2 flex items-center justify-between gap-4">
          <Checkbox checked={isSelected} onCheckedChange={handleSelect} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleDropdownAction('edit', item)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDropdownAction('view', item)}
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDropdownAction('delete', item)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Product Image */}
        <div className="mb-2 flex justify-center">
          <div className="h-[88px]">
            <img
              src={sampleImg}
              alt={item.name}
              className="h-full w-full object-contain"
            />
            <div className="hidden h-full w-full items-center justify-center rounded-lg bg-[#434343]/10">
              <span className="text-sm text-[#434343]">No Image</span>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="mb-3 space-y-1">
          <div>
            <h3 className="text-sm font-semibold">{item.name}</h3>
            <p className="text-sm font-semibold text-[#434343]/50">
              {item.code}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between py-0.5">
              <span className="text-sm font-medium text-[#434343]">Price:</span>
              <span className="text-sm font-semibold">${item.price}</span>
            </div>

            <div className="flex items-center justify-between py-0.5">
              <span className="text-sm font-medium text-[#434343]">Stock:</span>
              <span className="text-sm font-medium">{item.stock}</span>
            </div>

            <div className="flex items-center justify-between py-0.5">
              <span className="text-sm font-medium text-[#434343]">
                Status:
              </span>
              {getStatusBadge(item.status)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-2 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-2xl text-sm"
            onClick={() => onSell()}
          >
            Sell
          </Button>
          <Button
            className="flex-1 rounded-2xl text-sm"
            onClick={() => handleDropdownAction('view', item)}
          >
            View
          </Button>
        </div>

        {/* Sell On Shobu Link */}
        <div className="text-center">
          <button
            onClick={() => onSellOnShobu()}
            className="text-primary hover:text-primary/90 cursor-pointer text-sm font-medium underline decoration-1 underline-offset-2"
          >
            Sell On Shobu
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetCard;
