import { Input } from '../ui/input';
import {
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LandmarkIcon,
  SchoolIcon,
  SearchIcon,
  MenuIcon,
  LogOutIcon,
  UserPlusIcon,
  UserIcon,
  SettingsIcon,
  CheckIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '../ui/dropdown-menu';
import { useState } from 'react';
import { useUserStore } from '@/stores/user-store';
import { useNavigate } from 'react-router';
import AddBusinessModal from '@/components/dashboard/add-business-modal';
import BusinessService from '@/api/business';
import toast from 'react-hot-toast';

export default function Header({ onMobileMenuToggle }) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showAddBusinessModal, setShowAddBusinessModal] = useState(false);
  const [switchingBusiness, setSwitchingBusiness] = useState(false);
  const userStore = useUserStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    userStore.logout();
    navigate('/login');
  };

  const handleBusinessSwitch = async (businessId, businessName) => {
    if (switchingBusiness) return; // Prevent multiple clicks

    const toastId = toast.loading('Switching business...');

    try {
      setSwitchingBusiness(true);
      await BusinessService.switch({ id: businessId });
      // Refresh business data to update activeBusiness and allBusinesses
      await userStore.getBusinessData();
      toast.success(`Switched to ${businessName}`, { id: toastId });
    } catch (error) {
      console.error('Error switching business:', error);
      toast.error(
        error.response?.data?.message || 'Failed to switch business',
        { id: toastId }
      );
    } finally {
      setSwitchingBusiness(false);
    }
  };

  // Helper function to generate initials
  const getUserInitials = () => {
    if (!userStore.data) return 'U';
    const { account } = userStore.data;
    const firstInitial = account?.firstName.charAt(0).toUpperCase();
    const lastInitial = account?.lastName.charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}` || 'E';
  };

  // Helper function to get business initials
  const getBusinessInitials = (businessName) => {
    if (!businessName) return 'B';
    const words = businessName.trim().split(' ');
    if (words.length >= 2) {
      return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
    }
    return businessName.substring(0, 2).toUpperCase();
  };

  // Helper function to get consistent color for business
  const getBusinessColor = (index) => {
    const colors = [
      'bg-green-500',
      'bg-red-500',
      'bg-blue-500',
      'bg-purple-500',
      'bg-yellow-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500',
    ];
    return colors[index % colors.length];
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
              <span className="max-w-25 truncate">Grace b osun branch</span>
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
        <div className="size-2" />

        <div className="flex items-center justify-evenly gap-8">
          {/* Search Input */}
          <div className="relative">
            <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input placeholder="Search..." className="min-w-sm pl-10" />
          </div>

          {/* Location Breadcrumb */}
          <div className="flex w-fit items-center justify-between gap-1 text-xs text-[#434343]">
            <p className="flex items-center justify-center gap-0.5">
              <span>{userStore.activeBusiness?.businessName || ''}</span>
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
            <DropdownMenuContent align="end" className="w-56">
              {/* Business Section */}
              {userStore?.allBusinesses &&
                userStore.allBusinesses.length > 0 && (
                  <div className="px-2 py-2">
                    <DropdownMenuLabel className="mb-2 text-xs font-semibold text-gray-500">
                      Businesses
                    </DropdownMenuLabel>
                    {userStore.allBusinesses.map((business, index) => (
                      <DropdownMenuItem
                        key={business._id || business.id}
                        className="flex cursor-pointer items-center gap-2 py-1"
                        onClick={() =>
                          handleBusinessSwitch(
                            business._id || business.id,
                            business.businessName
                          )
                        }
                        disabled={switchingBusiness || business.switchActive}
                      >
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${getBusinessColor(index)}`}
                        >
                          {getBusinessInitials(business.businessName)}
                        </div>
                        <span className="flex-1 truncate text-sm">
                          {business.businessName}
                        </span>
                        {business.switchActive && (
                          <CheckIcon className="text-primary h-4 w-4" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </div>
                )}

              <DropdownMenuSeparator />

              {/* Action Items */}
              <DropdownMenuItem
                className="flex cursor-pointer items-center gap-2"
                onClick={() => setShowAddBusinessModal(true)}
              >
                <UserPlusIcon className="h-4 w-4" />
                <span className="flex-1">Add New Business</span>
                <ChevronRightIcon className="h-4 w-4" />
              </DropdownMenuItem>
              <DropdownMenuItem className="flex cursor-pointer items-center gap-2">
                <UserIcon className="h-4 w-4" />
                <span className="flex-1">My Profile</span>
                <ChevronRightIcon className="h-4 w-4" />
              </DropdownMenuItem>
              <DropdownMenuItem className="flex cursor-pointer items-center gap-2">
                <SettingsIcon className="h-4 w-4" />
                <span className="flex-1">Settings</span>
                <ChevronRightIcon className="h-4 w-4" />
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Logout */}
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex cursor-pointer items-center gap-2 text-red-600"
              >
                <LogOutIcon className="h-4 w-4" />
                <span>Log Out</span>
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

      {/* Add Business Modal */}
      <AddBusinessModal
        isOpen={showAddBusinessModal}
        onClose={() => setShowAddBusinessModal(false)}
      />
    </header>
  );
}
