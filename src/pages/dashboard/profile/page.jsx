import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeftIcon, Edit3Icon, Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserStore } from '@/stores/user-store';
import { cn } from '@/lib/utils';
import ProfileService from '@/api/profile';
import { uploadToCloudinary } from '@/lib/cloudinary';

export default function ProfilePage() {
  const navigate = useNavigate();
  const userStore = useUserStore();
  const fileInputRef = useRef(null);
  const [avatarImage, setAvatarImage] = useState('');
  const [countries, setCountries] = useState([]);
  const [countryOpen, setCountryOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: userStore.data?.account?.firstName || '',
    lastName: userStore.data?.account?.lastName || '',
    email: userStore.data?.account?.email || '',
    address: userStore.data?.account?.address || '',
    businessCity: userStore.activeBusiness?.city || '',
    state: userStore.activeBusiness?.state || 'Lagos',
    country: userStore.activeBusiness?.country,
    phoneNumber: userStore.data?.account?.phoneNumber || '',
    currency: userStore.activeBusiness?.currency || 'NGN',
    profilePhotoUrl: userStore.data?.account?.profilePhotoUrl || '',
  });

  // Fetch countries on component mount
  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await fetch(
          'https://restcountries.com/v3.1/all?fields=name,flags,cca2'
        );
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    }
    fetchCountries();
  }, []);

  // Fetch profile data on mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await ProfileService.fetch();
        console.log('Profile data:', response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }
    fetchProfile();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const accountId = userStore.data?.account?._id;
      if (!accountId) {
        console.error('No account ID found');
        return;
      }

      const response = await ProfileService.update({
        // id: accountId,
        data: formData,
      });
      console.log('Profile updated:', response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      try {
        const result = await uploadToCloudinary(file, {
          folder: 'profiles/avatars',
          tags: ['avatar', userStore.data?.account?._id],
        });
        console.log('Avatar uploaded to Cloudinary:', result.url);
        // Update formData with the Cloudinary URL
        setFormData((prev) => ({
          ...prev,
          profilePhotoUrl: result.url,
        }));
      } catch (error) {
        console.error('Error uploading avatar:', error);
      }
    }
  };

  const getUserInitials = () => {
    if (!userStore.data) return 'U';
    const { account } = userStore.data;
    const firstInitial = account?.firstName?.charAt(0).toUpperCase() || '';
    const lastInitial = account?.lastName?.charAt(0).toUpperCase() || '';
    return `${firstInitial}${lastInitial}` || 'U';
  };

  return (
    <div className="mt-6 mb-24 rounded-xl bg-white p-6">
      <div className="mx-auto">
        <div className="mb-8 flex w-full max-w-2xl flex-wrap items-center justify-between gap-6">
          <div className="max-w-61.5">
            {/* Back Button */}
            <Button
              onClick={() => navigate(-1)}
              variant={'ghost'}
              className="mb-6"
            >
              <ArrowLeftIcon className="size-4" />
              <span>Back</span>
            </Button>

            {/* Profile Header */}
            <div>
              <h1 className="text-2xl font-semibold text-[#434343]">
                My Profile
              </h1>
              <p className="mt-1 text-sm text-[#7d7d7d]">
                Edit Profile Info (This info may be connected to the business
                network or used for billing purposes)
              </p>
            </div>
          </div>

          <div className="relative">
            <Avatar className="size-40 rounded-xl">
              <AvatarImage src={avatarImage} />
              <AvatarFallback className="rounded-xl text-3xl">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <Button
              type="button"
              onClick={handleAvatarClick}
              className="absolute -right-1 -bottom-1 size-8 rounded-full"
            >
              <Edit3Icon className="size-4" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Form */}
        <div className="py-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* First Name */}
            <div>
              <Label
                htmlFor="firstName"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                First Name
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="h-10 w-full"
              />
            </div>

            {/* Last Name */}
            <div>
              <Label
                htmlFor="lastName"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Last Name
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="h-10 w-full"
              />
            </div>

            {/* Email */}
            <div>
              <Label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="h-10 w-full"
                readOnly
              />
            </div>

            {/* Address */}
            <div>
              <Label
                htmlFor="address"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Address
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="h-10 w-full"
              />
            </div>

            {/* Business City */}
            <div>
              <Label
                htmlFor="businessCity"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Business City
              </Label>
              <Input
                id="businessCity"
                value={formData.businessCity}
                onChange={(e) =>
                  handleInputChange('businessCity', e.target.value)
                }
                className="h-10 w-full"
                placeholder="Enter city"
              />
            </div>

            {/* State */}
            <div>
              <Label
                htmlFor="state"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                State
              </Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="h-10 w-full"
                placeholder="Enter state"
              />
            </div>

            {/* Country */}
            <div>
              <Label
                htmlFor="country"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Country
              </Label>
              <Popover
                open={countryOpen}
                onOpenChange={setCountryOpen}
                modal={true}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={countryOpen}
                    className={cn(
                      'h-10 w-full justify-between text-sm font-normal',
                      !formData.country && 'text-muted-foreground'
                    )}
                  >
                    {formData.country ? (
                      <span className="flex items-center gap-2">
                        <img
                          src={
                            countries.find(
                              (country) => country.cca2 === formData.country
                            )?.flags.svg
                          }
                          alt={formData.country}
                          className="h-4 w-6 object-cover"
                        />
                        <span>
                          {
                            countries.find(
                              (country) => country.cca2 === formData.country
                            )?.name.common
                          }
                        </span>
                      </span>
                    ) : (
                      'Select country'
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-(--radix-popover-trigger-width) p-0"
                >
                  <Command>
                    <CommandInput
                      placeholder="Search countries..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>Country not found.</CommandEmpty>
                      <CommandGroup>
                        {countries.length > 0 &&
                          countries
                            .sort((a, b) =>
                              a.name.common.localeCompare(b.name.common)
                            )
                            .map((country, i) => (
                              <CommandItem
                                value={country.name.common}
                                key={i}
                                onSelect={() => {
                                  handleInputChange('country', country.cca2);
                                  setCountryOpen(false);
                                }}
                              >
                                <img
                                  src={country.flags.svg}
                                  alt={country.flags.alt}
                                  className="mr-2 h-4 w-6 object-cover"
                                />
                                {country.name.common}
                                <Check
                                  className={cn(
                                    'ml-auto h-4 w-4',
                                    country.cca2 === formData.country
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Phone Number */}
            <div>
              <Label
                htmlFor="phoneNumber"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Phone number
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) =>
                  handleInputChange('phoneNumber', e.target.value)
                }
                className="h-10 w-full"
                placeholder="+234 123-123-123"
              />
            </div>

            {/* Currency */}
            <div>
              <Label
                htmlFor="currency"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Currency
              </Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => handleInputChange('currency', value)}
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NGN">NGN</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleSaveChanges}
              className="h-10 w-full max-w-74.5 rounded-xl"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
