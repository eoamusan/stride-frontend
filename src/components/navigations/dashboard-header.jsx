import { Input } from '../ui/input';
import {
  BellIcon,
  ChevronLeftIcon,
  LandmarkIcon,
  SchoolIcon,
  SearchIcon,
  MenuIcon,
  LogOutIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useState } from 'react';
import { useUserStore } from '@/stores/user-store';
import { useNavigate } from 'react-router';

export default function Header({ onMobileMenuToggle }) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const userStore = useUserStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    userStore.logout();
    navigate('/login');
  };

  // Helper function to generate initials
  const getUserInitials = () => {
    if (!userStore.data) return 'U';
    const { account } = userStore.data;
    const firstInitial = account?.firstName.charAt(0).toUpperCase();
    const lastInitial = account?.lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}` || 'E';
  };

  return (
    <header className="relative flex items-center justify-between bg-white p-4 lg:ml-72">
      {/* Mobile Layout */}
      <div className="flex w-full items-center justify-between lg:hidden">
        {/* Left side - Hamburger + Breadcrumb */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onMobileMenuToggle}
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
              <span className="max-w-20 truncate">Grace bank</span>
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
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden w-full items-center justify-between gap-8 lg:flex">
        <div className='size-2'/>

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

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex w-fit items-center justify-center gap-2 p-2 hover:bg-gray-50"
              >
                <Avatar className={'h-9 w-9'}>
                  <AvatarImage src={''} />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-medium">
                    {`${userStore.data?.account?.firstName} ${userStore.data?.account?.lastName}`.trim() ||
                      ''}
                  </p>
                  <p className="text-xs text-gray-700">
                    {userStore.data?.account?.email || ''}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer"
              >
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
      {showMobileSearch && (
        <div className="absolute top-full right-0 left-0 z-40 bg-white p-4 lg:hidden">
          <div className="relative">
            <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input placeholder="Search..." className="w-full pl-10" />
          </div>
        </div>
      )}
    </header>
  );
}
