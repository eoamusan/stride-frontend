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

const ProductCard = ({
  product = {
    id: 'GE-001',
    name: 'Geisha',
    code: 'GE-001',
    price: 25,
    stock: 40,
    status: 'In stock',
    image: '/api/placeholder/200/200',
  },
  onSell,
  onView,
  onSellOnShobu,
}) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      'In stock': 'bg-green-100 text-green-700 hover:bg-green-100',
      'Out of stock': 'bg-red-100 text-red-700 hover:bg-red-100',
      'Low stock': 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
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
    <Card className="w-full max-w-sm overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <CardContent className="p-6">
        {/* Header with checkbox and menu */}
        <div className="mb-4 flex items-center justify-between">
          <div className="h-6 w-6 rounded border-2 border-gray-300"></div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Product Image */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full rounded-lg object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden h-full w-full items-center justify-center rounded-lg bg-gray-200">
              <span className="text-sm text-gray-500">No Image</span>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="mb-6 space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500">{product.code}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Price:</span>
              <span className="text-lg font-semibold text-gray-900">
                ${product.price}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Stock:</span>
              <span className="text-sm font-medium text-gray-900">
                {product.stock}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              {getStatusBadge(product.status)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-4 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={() => onSell?.(product)}
          >
            Sell
          </Button>
          <Button
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => onView?.(product)}
          >
            View
          </Button>
        </div>

        {/* Sell On Shobu Link */}
        <div className="text-center">
          <button
            onClick={() => onSellOnShobu?.(product)}
            className="text-sm font-medium text-blue-600 underline decoration-1 underline-offset-2 hover:text-blue-700"
          >
            Sell On Shobu
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
