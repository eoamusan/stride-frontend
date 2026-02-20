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
import { format } from 'date-fns';

export default function VendorCard({
  vendor,
  isBillingPage = false,
  onViewDetails,
  onSelected,
  onContact,
  onEdit,
  onBlacklist,
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
    // const hasHalfStar = rating % 1 !== 0;

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
                onSelected({ id: vendor.id, checked })
              }
            />
          </div>
          <div className="flex size-6 items-center justify-center rounded bg-gray-100 text-xs font-semibold text-gray-700">
            {vendor.avatar ? (
              <img
                src={vendor.avatar}
                alt={vendor.name}
                className="size-6 rounded object-cover"
              />
            ) : (
              getInitials(vendor.name)
            )}
          </div>

          {/* Company Info */}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold">{vendor.name}</h3>
            <p className="text-sm text-[#3300C9]">{vendor.category}</p>
          </div>

          <div>
            <Badge
              variant={'secondary'}
              className={`rounded-full px-2 py-1 text-xs font-medium ${vendor.verified || vendor.paymentStatus === 'paid' ? 'bg-[#254C00]/10 text-[#254C00]' : 'bg-red-100 text-red-800'}`}
            >
              {isBillingPage
                ? vendor.paymentStatus === 'paid'
                  ? 'Paid'
                  : 'Unpaid'
                : vendor.verified
                  ? 'Verified'
                  : 'Unverified'}
            </Badge>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-3 font-medium">
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <User className="h-4 w-4 shrink-0" />
            <span>{vendor.contactPerson}</span>
          </div>

          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <Mail className="h-4 w-4 shrink-0" />
            <span className="truncate">{vendor.email}</span>
          </div>

          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <Phone className="h-4 w-4 shrink-0" />
            <span>{vendor.phone}</span>
          </div>

          <div className="flex items-start space-x-3 text-sm text-gray-600">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="leading-relaxed">{vendor.address}</span>
          </div>
        </div>

        {/* Services Section */}
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-gray-900">Services</h4>
          <p className="text-sm font-medium text-gray-600">{vendor.services}</p>
        </div>

        {/* Rating and Join Date */}
        <div className="flex flex-wrap items-center justify-between">
          {isBillingPage ? (
            <span className="text-sm font-medium text-[#434343]">
              Total Spent: {vendor.totalSpent}
            </span>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {renderStars(vendor.rating)}
                </div>
                <span className="text-sm font-medium">({vendor.rating})</span>
              </div>

              <span className="text-sm font-medium text-[#434343]">
                Joined {format(new Date(vendor.joinDate), 'PP')}
              </span>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button
            className="max-w-48 flex-1 rounded-2xl text-sm"
            onClick={() => onViewDetails?.(vendor)}
          >
            View Details
          </Button>

          <div className="ml-4 flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className=""
              onClick={() => onContact?.(vendor)}
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
                <DropdownMenuItem onClick={() => onEdit?.(vendor)}>
                  Edit Vendor
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onViewDetails?.(vendor)}>
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem>Send Request</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onBlacklist?.(vendor)}
                  className="text-red-600"
                >
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
