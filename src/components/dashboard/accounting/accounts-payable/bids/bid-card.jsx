import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MoreVertical, Calendar } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';

export default function BidCard({
  bid = {
    id: 1,
    title: 'Office Cleaning Services',
    description: 'Regular cleaning services for corporate office space',
    category: 'Cleaning Services',
    responses: 12,
    startDate: '2025-02-01',
    deadline: '2025-02-03',
    status: 'Active',
    bidType: 'Public',
    isDeadlinePassed: true,
  },
  onSelected,
  onViewDetails,
  onEdit,
  onDelete,
  onClose,
}) {
  // Format date to display format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA'); // Returns YYYY-MM-DD format
  };

  // Check if deadline has passed
  const isDeadlinePassed = () => {
    const today = new Date();
    const deadlineDate = new Date(bid.deadline);
    return deadlineDate < today;
  };

  // Get status badge styling
  const getStatusBadgeStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-[#254C00]/10 text-[#254C00]';
      case 'closed':
        return 'bg-[#EF4444]/10 text-[#EF4444]';
      case 'pending':
        return 'bg-[#FFAE4C]/10 text-[#FFAE4C]';
      default:
        return '';
    }
  };

  // Get bid type badge styling
  const getBidTypeBadgeStyle = (type) => {
    switch (type.toLowerCase()) {
      case 'public':
        return 'bg-[#3300C9]/20 text-[#3300C9]';
      case 'private':
        return 'bg-[#090023]/20 text-[#090023]';
      default:
        return '';
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="space-y-4">
        {/* Header Section */}
        <div className="flex items-start justify-between gap-2">
          {/* Avatar placeholder and title */}
          <div className="flex items-start space-x-2">
            <div className="mt-0.5 size-5">
              <Checkbox
                className={'size-5'}
                onCheckedChange={(checked) => {
                  onSelected({ id: bid.id, checked });
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold">{bid.title}</h3>
              <p className="text-sm leading-relaxed text-[#434343]/60">
                {bid.description}
              </p>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex items-center space-x-2">
            <Badge
              variant="secondary"
              className={getStatusBadgeStyle(bid.status)}
            >
              {bid.status}
            </Badge>
            <Badge
              variant="secondary"
              className={getBidTypeBadgeStyle(bid.bidType)}
            >
              {bid.bidType}
            </Badge>
          </div>
        </div>

        {/* Bid Information */}
        <div className="space-y-3 text-sm text-[#434343]/60">
          <div>
            <span className="">Category: </span>
            <span className="font-semibold">{bid.category}</span>
          </div>

          <div>
            <span className="">Responses: </span>
            <span className="font-semibold">{bid.responses}</span>
          </div>

          <div>
            <span className="">Start Date: </span>
            <span className="font-semibold">{formatDate(bid.startDate)}</span>
          </div>

          <div>
            <span className="">Deadline: </span>
            <span className="font-semibold">{formatDate(bid.deadline)}</span>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center justify-between pt-2">
          {/* Deadline Status */}
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-[#434343]/60" />
            <span
              className={`text-sm ${
                isDeadlinePassed()
                  ? 'font-medium text-[#EF4444]'
                  : 'text-[#434343]/60'
              }`}
            >
              {isDeadlinePassed() ? 'Deadline passed' : 'Active deadline'}
            </span>
          </div>

          {/* Responses Count */}
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-[#434343]/60" />
            <span className="text-sm text-[#434343]/60">
              {bid.responses} responses
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-4">
          <Button className="w-[90%]" onClick={() => onViewDetails?.(bid)}>
            View Details
          </Button>

          {/* Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className={'shrink-0'}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(bid)}>
                Edit Bid
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewDetails?.(bid)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onClose?.(bid)}>
                Close Bid
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(bid)}
                className="text-[#EF4444]"
              >
                Delete Bid
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
