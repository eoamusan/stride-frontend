import strideLogo from '@/assets/icons/stride.svg';
import { Input } from '../ui/input';
import {
  BellIcon,
  ChevronLeftIcon,
  LandmarkIcon,
  SchoolIcon,
  SearchIcon,
  MenuIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useState } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header className="flex items-center justify-between bg-white p-4">
      {/* Mobile Layout */}
      <div className="flex w-full items-center justify-between lg:hidden">
        {/* Left side - Hamburger + Breadcrumb */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <MenuIcon size={24} />
          </Button>

          {/* Mobile Breadcrumb */}
          <div className="flex items-center gap-1 text-[9px] text-[#434343] md:text-xs">
            <p className="flex items-center gap-0.5">
              <span className="max-w-[100px] truncate">
                Grace b osun branch
              </span>
              <SchoolIcon size={12} color="#434343" />
            </p>
            <ChevronLeftIcon size={14} className="rotate-180" />
            <p className="flex items-center gap-0.5">
              <span className="max-w-[80px] truncate">Grace bank</span>
              <LandmarkIcon size={12} color="#434343" />
            </p>
          </div>
        </div>

        {/* Right side - Search + Notification + Avatar */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            <SearchIcon className="h-4 w-4" />
          </Button>

          {/* Notification Button */}
          <div className="relative">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <BellIcon className="h-4 w-4" />
            </Button>
            <Badge
              variant="destructive"
              className="absolute top-1.5 right-1.5 flex h-1.5 w-1.5 items-center justify-center rounded-full p-0"
            ></Badge>
          </div>

          {/* User Avatar */}
          <Avatar className="h-7 w-7">
            <AvatarImage src="" />
            <AvatarFallback>OA</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden w-full items-center justify-between lg:flex">
        {/* Logo */}
        <div>
          <img src={strideLogo} alt="Stride Logo" />
        </div>

        <div className="flex items-center justify-evenly gap-8">
          {/* Search Input */}
          <div className="relative">
            <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input placeholder="Search..." className="min-w-sm pl-10" />
          </div>

          {/* Location Breadcrumb */}
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
              <AvatarImage src={'https://github.com/shadcn.png'} />
              <AvatarFallback>OA</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Oluwatosin Ayanwole</p>
              <p className="text-xs text-gray-700">oluwatosin13@gmail.com</p>
            </div>
          </div>

          {/* Notification Button */}
          <div className="relative ml-4">
            <Button
              variant="outline"
              size="icon"
              className="size-8 border-none"
            >
              <BellIcon />
            </Button>
            <Badge
              variant="destructive"
              className="absolute top-1.5 right-2.5 flex h-1.5 w-1.5 items-center justify-center rounded-full p-0"
            ></Badge>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {/* {showMobileSearch && (
        <div className="absolute top-full right-0 left-0 z-50 border-b border-gray-200 bg-black p-4 lg:hidden">
          <div className="relative">
            <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input placeholder="Search..." className="w-full pl-10" />
          </div>
        </div>
      )} */}
    </header>
  );
}
