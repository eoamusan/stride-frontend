import strideLogo from '@/assets/icons/stride.svg';
import { Input } from '../ui/input';
import {
  BellIcon,
  ChevronLeftIcon,
  LandmarkIcon,
  SchoolIcon,
  SearchIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      {/* Logo */}
      <div className="">
        <img src={strideLogo} alt="Stride Logo" />
      </div>

      <div className="flex items-center justify-evenly gap-8">
        {/* Search Input */}
        <div className="relative">
          <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search..." className="min-w-sm pl-10" />
        </div>

        {/* Location Breadcrumb: Use Breadcrumb from Shadcn */}
        <div className="flex w-fit items-center justify-between gap-1 text-xs text-[#434343]">
          <p className="flex items-center justify-center gap-0.5">
            <span>Grace b osun branch</span>
            <span>
              <SchoolIcon size={12} color="#434343" />
            </span>
          </p>
          <span>
            <ChevronLeftIcon size={16} />
          </span>
          <p className="flex items-center justify-center gap-0.5">
            <span>Grace bank</span>
            <span>
              <LandmarkIcon size={12} color="#434343" />
            </span>
          </p>
        </div>

        {/* User Profile */}
        <div className="flex w-fit items-center justify-center gap-2">
          <Avatar className={'h-9 w-9'}>
            <AvatarImage src={'https://github.co/shadcn.png'} />
            <AvatarFallback>OA</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">Oluwatosin Ayanwole</p>
            <p className="text-xs text-gray-700">oluwatosin13@gmail.com</p>
          </div>
        </div>

        {/* Notification Button */}
        <div className="relative ml-4">
          <Button variant="outline" size="icon" className="size-8 border-none">
            <BellIcon />
          </Button>
          <Badge
            variant="destructive"
            className="absolute top-1.5 right-2.5 flex h-1.5 w-1.5 items-center justify-center rounded-full p-0"
          ></Badge>
        </div>
      </div>
    </header>
  );
}
