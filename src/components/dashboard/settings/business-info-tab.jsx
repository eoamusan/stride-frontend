import { useState, useEffect } from 'react';
import { UploadIcon, Check, ChevronsUpDown, X } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { uploadToCloudinary } from '@/lib/cloudinary';
import toast from 'react-hot-toast';

export default function BusinessInfoTab({
  businessInfo,
  onBusinessInfoChange,
  onSave,
  isSaving = false,
}) {
  const [countries, setCountries] = useState([]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [isUploadingStamp, setIsUploadingStamp] = useState(false);

  const businessTypes = [
    'Limited Liability',
    'Sole Proprietorship',
    'Partnership',
    'Corporation',
  ];
  const industries = [
    'Tech',
    'Finance',
    'Healthcare',
    'Education',
    'Retail',
    'Manufacturing',
    'Others',
  ];

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

  const handleStampUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploadingStamp(true);
    try {
      const result = await uploadToCloudinary(file, {
        folder: 'stride/company-stamps',
      });
      onBusinessInfoChange('companyStamp', result.url);
      toast.success('Company stamp uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload company stamp');
    } finally {
      setIsUploadingStamp(false);
    }
  };

  const handleRemoveStamp = () => {
    onBusinessInfoChange('companyStamp', '');
  };

  return (
    <div>
      <div className="w-full max-w-98">
        <h2 className="mb-2 text-2xl font-bold text-[#434343]">
          Business info
        </h2>
        <p className="mb-7 text-sm text-[#7d7d7d]">
          Edit Business info (This is the info your business uses for tax
          purposes)
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <Label
            htmlFor="businessType"
            className="mb-2 block text-sm font-medium"
          >
            Business type
          </Label>
          <Select
            value={businessInfo.businessType}
            onValueChange={(value) =>
              onBusinessInfoChange('businessType', value)
            }
          >
            <SelectTrigger className={'w-full'}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {businessTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label
            htmlFor="legalBusinessName"
            className="mb-2 block text-sm font-medium"
          >
            Legal Business Name
          </Label>
          <Input
            id="legalBusinessName"
            value={businessInfo.legalBusinessName}
            onChange={(e) =>
              onBusinessInfoChange('legalBusinessName', e.target.value)
            }
            className={'h-10'}
          />
        </div>

        <div>
          <Label
            htmlFor="legalBusinessAddress"
            className="mb-2 block text-sm font-medium"
          >
            Legal business Address
          </Label>
          <Input
            id="legalBusinessAddress"
            value={businessInfo.legalBusinessAddress}
            onChange={(e) =>
              onBusinessInfoChange('legalBusinessAddress', e.target.value)
            }
            className={'h-10'}
          />
        </div>

        <div>
          <Label htmlFor="tin" className="mb-2 block text-sm font-medium">
            TIN
          </Label>
          <Input
            id="tin"
            value={businessInfo.tin}
            onChange={(e) => onBusinessInfoChange('tin', e.target.value)}
            className={'h-10'}
          />
        </div>

        <div>
          <Label htmlFor="industry" className="mb-2 block text-sm font-medium">
            Industry
          </Label>
          <Select
            value={businessInfo.industry}
            onValueChange={(value) => onBusinessInfoChange('industry', value)}
          >
            <SelectTrigger className={'w-full'}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="country" className="mb-2 block text-sm font-medium">
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
                  !businessInfo.country && 'text-muted-foreground'
                )}
              >
                {businessInfo.country ? (
                  <span className="flex items-center gap-2">
                    <img
                      src={
                        countries.find(
                          (country) => country.cca2 === businessInfo.country
                        )?.flags.svg
                      }
                      alt={businessInfo.country}
                      className="h-4 w-6 object-cover"
                    />
                    <span>
                      {
                        countries.find(
                          (country) => country.cca2 === businessInfo.country
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
                              onBusinessInfoChange('country', country.cca2);
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
                                country.cca2 === businessInfo.country
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

        <div>
          <Label htmlFor="website" className="mb-2 block text-sm font-medium">
            Website
          </Label>
          <Input
            id="website"
            value={businessInfo.website}
            onChange={(e) => onBusinessInfoChange('website', e.target.value)}
            className={'h-10'}
          />
        </div>

        <div>
          <Label className="mb-2 block text-sm font-medium">
            Upload Company stamp
          </Label>
          {businessInfo.companyStamp ? (
            <div className="relative h-40 rounded-lg border-2 border-gray-300 bg-gray-50 p-4">
              <button
                type="button"
                onClick={handleRemoveStamp}
                className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
              <img
                src={businessInfo.companyStamp}
                alt="Company stamp"
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <label
              htmlFor="company-stamp-upload"
              className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
            >
              <input
                id="company-stamp-upload"
                type="file"
                accept="image/*"
                onChange={handleStampUpload}
                disabled={isUploadingStamp}
                className="hidden"
              />
              {isUploadingStamp ? (
                <div className="flex flex-col items-center">
                  <div className="border-t-primary mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-300"></div>
                  <p className="text-sm text-gray-600">Uploading...</p>
                </div>
              ) : (
                <>
                  <UploadIcon className="text-primary mb-3 size-8" />
                  <p className="text-sm text-gray-900">
                    Click or drag file to this area to upload
                  </p>
                  <p className="text-xs text-gray-500">
                    Support for single image upload (Max 5MB)
                  </p>
                </>
              )}
            </label>
          )}
        </div>
      </div>

      <div className="mt-12 flex justify-end">
        <Button
          onClick={onSave}
          className="h-10 w-full max-w-74.5 rounded-xl"
          disabled={isSaving || isUploadingStamp}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
