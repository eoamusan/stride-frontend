import { useState, useEffect } from 'react';
import {
  ArrowLeftIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
  MapPinIcon,
  GlobeIcon,
  CalendarIcon,
  CheckIcon,
  PencilLineIcon,
  FileInput,
  StarIcon,
  DownloadIcon,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import pdfIcon from '@/assets/icons/pdf-icon.svg';
import placeholderImage from '@/assets/images/vendor-details-placeholder.png';
import { useNavigate, useParams } from 'react-router';
import VendorService from '@/api/vendor';
import { format } from 'date-fns';

export default function VendorDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [vendorData, setVendorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVendorDetails = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const response = await VendorService.get({ id });
        setVendorData(response.data.data);
      } catch (error) {
        console.error('Error fetching vendor details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendorDetails();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1, { replace: true });
  };

  if (isLoading) {
    return (
      <div className="mx-4 my-4 min-h-screen rounded-xl bg-white p-6">
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">Loading vendor details...</p>
        </div>
      </div>
    );
  }

  if (!vendorData) {
    return (
      <div className="mx-4 my-4 min-h-screen rounded-xl bg-white p-6">
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">Vendor not found</p>
        </div>
      </div>
    );
  }

  const fullName =
    `${vendorData.firstName || ''} ${vendorData.lastName || ''}`.trim();
  const businessName =
    vendorData.businessInformation?.businessName ||
    fullName ||
    'Unknown Vendor';
  const category = vendorData.businessInformation?.category || 'N/A';
  const initials = businessName
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="mx-4 my-4 min-h-screen rounded-xl bg-white p-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button className="cursor-pointer" onClick={handleGoBack}>
          <ArrowLeftIcon />
        </button>
        <header className="flex gap-2">
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full font-semibold text-white">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{businessName}</h1>
            <p className="text-sm font-medium text-[#434343]">{category}</p>
          </div>
        </header>
      </div>

      <div className="mt-10 flex justify-between gap-10">
        {/* Vendor Info Cards */}
        <div className="w-full max-w-xl">
          <Card className="p-4">
            <h2 className="text-base font-semibold">Contact Information</h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-4 text-[#434343]">
                {/* Email Address */}
                <div>
                  <h3 className="mb-2 text-sm font-semibold">Email Address</h3>
                  <div className="flex items-center gap-3">
                    <MailIcon size={16} color="#434343" />
                    <span className="truncate text-sm font-medium">
                      {vendorData.contact?.email || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <h3 className="mb-2 text-sm font-semibold">Name</h3>
                  <div className="flex items-center gap-3">
                    <UserIcon size={16} color="#434343" />
                    <span className="text-sm font-medium">
                      {fullName || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h3 className="mb-1.5 text-sm font-semibold">Address</h3>
                  <div className="flex items-start gap-3">
                    <MapPinIcon size={16} color="#434343" className="mt-1" />
                    <div className="text-sm font-medium">
                      <p>{vendorData.contact?.address || 'N/A'}</p>
                      {vendorData.contact?.city && (
                        <p>
                          {vendorData.contact.city}
                          {vendorData.contact.state
                            ? `, ${vendorData.contact.state}`
                            : ''}
                        </p>
                      )}
                      {vendorData.contact?.zipCode && (
                        <p>{vendorData.contact.zipCode}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4 text-sm text-[#434343]">
                {/* Phone Number */}
                <div>
                  <h3 className="mb-2 font-semibold">Phone Number</h3>
                  <div className="flex items-center gap-3">
                    <PhoneIcon size={16} color="#434343" />
                    <span className="font-medium">
                      {vendorData.contact?.phoneNumber1 || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Website */}
                <div>
                  <h3 className="mb-2 font-semibold">Website</h3>
                  <div className="flex items-center gap-3">
                    <GlobeIcon size={16} color="#8979FF" />
                    {vendorData.contact?.websiteLink ? (
                      <a
                        href={vendorData.contact.websiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[#8979FF] hover:underline"
                      >
                        {vendorData.contact.websiteLink}
                      </a>
                    ) : (
                      <span className="font-medium">N/A</span>
                    )}
                  </div>
                </div>

                {/* Date Added */}
                <div>
                  <h3 className="mb-2 font-semibold">Date Added</h3>
                  <div className="flex items-center gap-3">
                    <CalendarIcon size={16} color="#434343" />
                    <span className="font-medium">
                      {vendorData.createdAt
                        ? format(new Date(vendorData.createdAt), 'MMM dd, yyyy')
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Nationality */}
                <div>
                  <h3 className="mb-2 font-semibold">Nationality</h3>
                  <div className="flex items-center gap-3">
                    <UserIcon size={16} color="#434343" />
                    <span className="font-medium">
                      {vendorData.nationality || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="w-full max-w-sm">
          {/* Actions */}
          <div>
            <h3 className="mb-3 text-sm font-semibold"> Actions </h3>
            <div className="flex flex-col gap-2">
              <Button className={'h-10 w-full text-sm'}>
                <CheckIcon className="mr-1" /> Send Email
              </Button>
              <Button className={'h-10 w-full text-sm'} variant={'outline'}>
                <PencilLineIcon className="mr-1" /> Edit Vendor
              </Button>
              <Button className={'h-10 w-full text-sm'} variant={'outline'}>
                <FileInput className="mr-1" /> Send Request
              </Button>
              <Button className={'h-10 w-full text-sm'} variant={'outline'}>
                <FileInput className="mr-1" /> Export Data
              </Button>
            </div>
          </div>

          {/* Business Information */}
          <Card className="mt-6 p-6">
            <h3 className="text-base font-semibold">Business Information</h3>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Tax ID */}
                <div className="text-[#434343]">
                  <label className="mb-2 block text-sm font-semibold">
                    Tax ID
                  </label>
                  <p className="text-sm font-medium">
                    {vendorData.businessInformation?.taxId || 'N/A'}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#434343]">
                    Status
                  </label>
                  <Badge
                    className={`font-medium ${
                      vendorData.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800 hover:bg-green-100'
                        : vendorData.status === 'PENDING'
                          ? 'bg-orange-100 text-orange-800 hover:bg-orange-100'
                          : 'bg-red-100 text-red-800 hover:bg-red-100'
                    }`}
                  >
                    {vendorData.status || 'N/A'}
                  </Badge>
                </div>

                {/* Registration Number */}
                <div className="text-[#434343]">
                  <label className="mb-2 block text-sm font-semibold">
                    Registration Number
                  </label>
                  <p className="text-sm font-medium">
                    {vendorData.businessInformation?.regNo || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6 text-[#434343]">
                {/* Type of Incorporation */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Type of Incorporation
                  </label>
                  <p className="text-sm font-medium">
                    {vendorData.businessInformation?.typeOfInc || 'N/A'}
                  </p>
                </div>

                {/* Registration Date */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Registration Date
                  </label>
                  <p className="text-sm font-medium">
                    {vendorData.businessInformation?.regDate
                      ? format(
                          new Date(vendorData.businessInformation.regDate),
                          'MMM dd, yyyy'
                        )
                      : 'N/A'}
                  </p>
                </div>

                {/* Bank Details */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Bank Account
                  </label>
                  <p className="text-sm font-medium">
                    {vendorData.bankDetails?.bankName || 'N/A'}
                    {vendorData.bankDetails?.accountNumber &&
                      ` - ${vendorData.bankDetails.accountNumber}`}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Notes/Reviews */}
          <div>
            <h3 className="mt-6 text-sm font-semibold">Notes/Reviews</h3>
            <Textarea
              className={'mt-2 h-20 resize-none rounded-xl'}
              placeholder="Add a note..."
            ></Textarea>
          </div>

          {/* Certificates */}
          {(vendorData.attachment?.tcc ||
            vendorData.attachment?.ci ||
            vendorData.attachment?.cl ||
            vendorData.attachment?.vp) && (
            <div className="mt-6">
              <h3 className="mb-3 text-base font-semibold">Certificates</h3>
              <div className="grid grid-cols-1 gap-4">
                {/* Tax Certificate */}
                {vendorData.attachment?.tcc && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold">
                      Tax Clearance Certificate
                    </h4>
                    <div className="flex items-center justify-between rounded-xl border border-gray-200 p-2.5">
                      <div className="flex items-center space-x-3">
                        <img src={pdfIcon} alt="PDF Icon" className="h-4 w-4" />
                        <span className="text-xs font-medium text-[#434343]">
                          Tax Certificate
                        </span>
                      </div>
                      <a
                        href={vendorData.attachment.tcc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700"
                      >
                        <DownloadIcon size={16} />
                      </a>
                    </div>
                  </div>
                )}

                {/* CAC Certificate */}
                {vendorData.attachment?.ci && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold">
                      Certificate of Incorporation
                    </h4>
                    <div className="flex items-center justify-between rounded-xl border border-gray-200 p-2.5">
                      <div className="flex items-center space-x-3">
                        <img src={pdfIcon} alt="PDF Icon" className="h-4 w-4" />
                        <span className="text-xs font-medium text-[#434343]">
                          CAC Certificate
                        </span>
                      </div>
                      <a
                        href={vendorData.attachment.ci}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700"
                      >
                        <DownloadIcon size={16} />
                      </a>
                    </div>
                  </div>
                )}

                {/* Company License */}
                {vendorData.attachment?.cl && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold">
                      Company License
                    </h4>
                    <div className="flex items-center justify-between rounded-xl border border-gray-200 p-2.5">
                      <div className="flex items-center space-x-3">
                        <img src={pdfIcon} alt="PDF Icon" className="h-4 w-4" />
                        <span className="text-xs font-medium text-[#434343]">
                          Company License
                        </span>
                      </div>
                      <a
                        href={vendorData.attachment.cl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700"
                      >
                        <DownloadIcon size={16} />
                      </a>
                    </div>
                  </div>
                )}

                {/* Vendor Profile */}
                {vendorData.attachment?.vp && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold">
                      Vendor Profile
                    </h4>
                    <div className="flex items-center justify-between rounded-xl border border-gray-200 p-2.5">
                      <div className="flex items-center space-x-3">
                        <img src={pdfIcon} alt="PDF Icon" className="h-4 w-4" />
                        <span className="text-xs font-medium text-[#434343]">
                          Vendor Profile
                        </span>
                      </div>
                      <a
                        href={vendorData.attachment.vp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700"
                      >
                        <DownloadIcon size={16} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Placeholder */}
          <div className="mt-6 h-fit w-full">
            <img
              src={placeholderImage}
              alt="Placeholder"
              className="h-64 w-full"
            />
          </div>
        </div>
      </div>

      <div className="mt-10 mb-4 flex justify-end gap-4">
        <Button
          className={'h-10 w-26.5 text-sm'}
          variant={'outline'}
          onClick={handleGoBack}
        >
          Back
        </Button>
        <Button className={'h-10 w-32.5 text-sm'}>
          <PencilLineIcon /> Edit Vendor
        </Button>
      </div>
    </div>
  );
}
