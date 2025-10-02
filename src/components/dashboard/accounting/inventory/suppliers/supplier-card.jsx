import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Star,
  User,
  Mail,
  Phone,
  MapPin,
  MoreVertical,
  MessageSquare,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';

export default function SupplierCard({
  supplier = {
    id: 1,
    name: 'JJ Solutions',
    category: 'IT Services',
    contactPerson: 'Adeniyi James',
    email: 'jjsolutions@gmail.com',
    phone: '+2347065724230',
    services: 'IT Support, Cloud Services',
    numberOfProducts: 120,
    rating: 4.8,
    joinDate: '2025-01-12',
    verified: true,
    avatar: null,
  },
  onViewDetails,
  onSelected,
  onContact,
  onEdit,
  onDelete,
}) {
  // Generate avatar initials
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        );
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />);
      }
    }

    return stars;
  };

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="space-y-4 px-6">
        {/* Header Section */}
        <div className="flex flex-wrap items-start space-x-3">
          {/* Avatar */}
          <div className="mr-4">
            <Checkbox
              className={'size-5'}
              onCheckedChange={(checked) =>
                onSelected({ id: supplier.id, checked })
              }
            />
          </div>
          <div className="flex size-6 items-center justify-center rounded bg-gray-100 text-xs font-semibold text-gray-700">
            {supplier.avatar ? (
              <img
                src={supplier.avatar}
                alt={supplier.name}
                className="size-6 rounded object-cover"
              />
            ) : (
              getInitials(supplier.name)
            )}
          </div>

          {/* Company Info */}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold">
              {supplier.name}
            </h3>
          </div>

          <div>
            <Badge
              variant={'secondary'}
              className={`rounded-full px-2 py-1 text-xs font-medium ${supplier.verified ? 'bg-[#254C00]/10 text-[#254C00]' : 'bg-red-100 text-red-800'}`}
            >
              {supplier.verified ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-3 font-medium">
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <User className="h-4 w-4 flex-shrink-0" />
            <span>{supplier.contactPerson}</span>
          </div>

          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <Mail className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{supplier.email}</span>
          </div>

          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <Phone className="h-4 w-4 flex-shrink-0" />
            <span>{supplier.phone}</span>
          </div>
        </div>

        {/* Services Section */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900">
            {supplier.numberOfProducts || 42} Products
          </h4>
        </div>

        {/* Rating and Join Date */}
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {renderStars(supplier.rating)}
            </div>
            <span className="text-sm font-medium text-gray-700">
              ({supplier.rating})
            </span>
          </div>

          <span className="text-sm font-medium text-gray-500">
            Joined{' '}
            {new Date(supplier.joinDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button
            className="max-w-48 flex-1 rounded-2xl text-sm"
            onClick={() => onViewDetails?.(supplier)}
          >
            View Details
          </Button>

          <div className="ml-4 flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className=""
              onClick={() => onContact?.(supplier)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(supplier)}>
                  Edit Supplier
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewDetails?.(supplier)}>
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem>Send Request</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  Blacklist
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
