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
  DownloadIcon,
  ShapesIcon,
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
import ExpenseForm from '@/components/dashboard/accounting/expense-mgmt/overview/expense-form';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import { useState, useEffect } from 'react';
import VendorService from '@/api/vendor';
import { format } from 'date-fns';

export default function VendorExpenseDetails() {
  const [openExpenseForm, setOpenExpenseForm] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [vendor, setVendor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchVendor = async () => {
      setIsLoading(true);
      try {
        const response = await VendorService.get({ id });
        setVendor(response.data?.data || null);
      } catch (error) {
        console.error('Error fetching vendor:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchVendor();
    }
  }, [id]);

  const handleGoBack = () => {
    navigate(-1, { replace: true });
  };

  if (isLoading) {
    return (
      <div className="mx-4 my-4 min-h-screen rounded-xl bg-white p-6">
        <div className="flex h-64 items-center justify-center">
          <p className="text-gray-500">Loading vendor details...</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="mx-4 my-4 min-h-screen rounded-xl bg-white p-6">
        <div className="flex h-64 items-center justify-center">
          <p className="text-gray-500">Vendor not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 my-4 min-h-screen rounded-xl bg-white p-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button className="cursor-pointer" onClick={handleGoBack}>
          <ArrowLeftIcon />
        </button>
        <header className="flex gap-2">
          <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold">
            {vendor.firstName?.charAt(0).toUpperCase()}
            {vendor.lastName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-semibold">
              {vendor.firstName} {vendor.lastName}
            </h1>
            <p className="text-sm font-medium text-[#434343]">
              {vendor.businessInformation?.category ||
                vendor.businessInformation?.businessName ||
                'Not specified'}
            </p>
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
                    <span className="text-sm font-medium">
                      {vendor.contact?.email || 'Not provided'}
                    </span>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <h3 className="mb-2 text-sm font-semibold">Name</h3>
                  <div className="flex items-center gap-3">
                    <UserIcon size={16} color="#434343" />
                    <span className="text-sm font-medium">
                      {vendor.firstName} {vendor.lastName}
                    </span>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h3 className="mb-1.5 text-sm font-semibold">Address</h3>
                  <div className="flex items-start gap-3">
                    <MapPinIcon size={16} color="#434343" className="mt-1" />
                    <div className="text-sm font-medium">
                      {vendor.contact?.address ? (
                        <>
                          <p>{vendor.contact.address}</p>
                          {(vendor.contact?.city || vendor.contact?.state) && (
                            <p>
                              {vendor.contact?.city}
                              {vendor.contact?.city &&
                                vendor.contact?.state &&
                                ', '}
                              {vendor.contact?.state}
                            </p>
                          )}
                        </>
                      ) : (
                        <p>Not provided</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Service Category */}
                <div>
                  <h3 className="mb-2 text-sm font-semibold">
                    Service Category
                  </h3>
                  <div className="flex items-center gap-3">
                    <ShapesIcon size={16} color="#434343" />
                    <span className="text-sm font-medium">
                      {vendor.businessInformation?.category || 'N/A'}
                    </span>
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
                      {vendor.contact?.phoneNumber1 || 'Not provided'}
                    </span>
                  </div>
                </div>

                {/* Website */}
                <div>
                  <h3 className="mb-2 font-semibold">Website</h3>
                  <div className="flex items-center gap-3">
                    <GlobeIcon size={16} color="#8979FF" />
                    {vendor.contact?.websiteLink ? (
                      <a
                        href={vendor.contact.websiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[#8979FF] hover:underline"
                      >
                        {vendor.contact.websiteLink}
                      </a>
                    ) : (
                      <span className="font-medium">Not provided</span>
                    )}
                  </div>
                </div>

                {/* Date Added */}
                <div>
                  <h3 className="mb-2 font-semibold">Date Added</h3>
                  <div className="flex items-center gap-3">
                    <CalendarIcon size={16} color="#434343" />
                    <span className="font-medium">
                      {format(new Date(vendor.createdAt), 'PP')}
                    </span>
                  </div>
                </div>

                {/* Added by */}
                <div>
                  <h3 className="mb-2 font-semibold">Added by</h3>
                  <div className="flex items-center gap-3">
                    <UserIcon size={16} color="#434343" />
                    <span className="font-medium">Admin</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Financial Summary */}
          <Card className="mt-6 p-4">
            <h2 className="text-base font-semibold">Financial Summary</h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-4 text-[#434343]">
                {/* Total Invoices */}
                <div>
                  <h3 className="mb-2 text-sm font-semibold">Total Invoices</h3>
                  <p className="font-semibold">0</p>
                </div>

                {/* Last Payment */}
                <div>
                  <h3 className="mb-2 text-sm font-semibold">Last Payment</h3>
                  <p className="text-sm font-medium">N/A</p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4 text-sm text-[#434343]">
                {/* Phone Number */}
                <div>
                  <h3 className="mb-2 font-semibold">Phone Number</h3>
                  <p className="font-medium">
                    {' '}
                    {vendor.contact?.phoneNumber1 || 'Not provided'}
                  </p>
                </div>

                {/* Average Invoice */}
                <div>
                  <h3 className="mb-2 font-semibold">Average Invoice</h3>
                  <p className="font-medium">$0</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Bank Details */}
          <Card className={'mt-6 p-4'}>
            <h2 className="text-base font-semibold">Bank Details</h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-4 text-[#434343]">
                {/* Account Name */}
                <div>
                  <h3 className="mb-2 text-sm font-semibold">Account Name</h3>
                  <p className="text-sm font-medium">
                    {vendor.bankDetails?.accountName || 'Not provided'}
                  </p>
                </div>

                {/* Account Number */}
                <div>
                  <h3 className="mb-2 text-sm font-semibold">Account Number</h3>
                  <p className="text-sm font-medium">
                    {vendor.bankDetails?.accountNumber || 'Not provided'}
                  </p>
                </div>

                {/* FNB Universal Code */}
                <div>
                  <h3 className="mb-2 text-sm font-semibold">
                    FNB Universal Code
                  </h3>
                  <p className="text-sm font-medium">
                    {vendor.bankDetails?.fnbCode || 'Not provided'}
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4 text-[#434343]">
                {/* Bank Name */}
                <div>
                  <h3 className="mb-2 text-sm font-semibold">Bank Name</h3>
                  <p className="text-sm font-medium">
                    {vendor.bankDetails?.bankName || 'Not provided'}
                  </p>
                </div>

                {/* Branch/Sort Code */}
                <div>
                  <h3 className="mb-2 text-sm font-semibold">
                    Branch/Sort Code
                  </h3>
                  <p className="text-sm font-medium">
                    {vendor.bankDetails?.sortCode || 'Not provided'}
                  </p>
                </div>

                {/* Swift Code */}
                <div>
                  <h3 className="mb-2 text-sm font-semibold">Swift Code</h3>
                  <p className="text-sm font-medium">
                    {vendor.bankDetails?.swiftCode || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Invoices Table */}
          <Card className="mt-6 p-4">
            <h2 className="mb-6 text-base font-semibold">Recent Invoices</h2>

            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-purple-50">
                    <TableHead className="text-sm font-medium text-gray-600">
                      INVOICE
                    </TableHead>
                    <TableHead className="text-sm font-medium text-gray-600">
                      AMOUNT
                    </TableHead>
                    <TableHead className="text-sm font-medium text-gray-600">
                      DATE
                    </TableHead>
                    <TableHead className="text-sm font-medium text-gray-600">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  <TableRow>
                    <TableCell className="text-sm font-medium text-[#434343]">
                      INV-2025-001
                    </TableCell>
                    <TableCell className="text-sm text-[#434343]">
                      $2,334
                    </TableCell>
                    <TableCell className="text-sm text-[#434343]">
                      Feb -12-2025
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        Active
                      </Badge>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="text-sm font-medium text-[#434343]">
                      INV-2025-001
                    </TableCell>
                    <TableCell className="text-sm text-[#434343]">
                      $2,334
                    </TableCell>
                    <TableCell className="text-sm text-[#434343]">
                      Feb -12-2025
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                        Pending
                      </Badge>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="text-sm font-medium text-[#434343]">
                      INV-2025-001
                    </TableCell>
                    <TableCell className="text-sm text-[#434343]">
                      $2,334
                    </TableCell>
                    <TableCell className="text-sm text-[#434343]">
                      Feb -12-2025
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        Active
                      </Badge>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="text-sm font-medium text-[#434343]">
                      INV-2025-001
                    </TableCell>
                    <TableCell className="text-sm text-[#434343]">
                      $2,334
                    </TableCell>
                    <TableCell className="text-sm text-[#434343]">
                      Feb -12-2025
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        Active
                      </Badge>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="text-sm font-medium text-[#434343]">
                      INV-2025-001
                    </TableCell>
                    <TableCell className="text-sm text-[#434343]">
                      $2,334
                    </TableCell>
                    <TableCell className="text-sm text-[#434343]">
                      Feb -12-2025
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        Active
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Add Proper Pagination Here! */}
            <div className="mt-6 flex items-center justify-between">
              <Button variant="outline" size="sm" className="px-3">
                <ArrowLeftIcon className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1">
                <Button variant="default" size="sm" className="h-8 w-8 p-0">
                  1
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  2
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  3
                </Button>
                <span className="px-2 text-sm text-gray-500">...</span>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  8
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  9
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  10
                </Button>
              </div>

              <Button variant="outline" size="sm" className="px-3">
                <ArrowLeftIcon className="h-4 w-4 rotate-180" />
              </Button>
            </div>
          </Card>
        </div>
        <div className="w-full max-w-sm">
          {/* Actions */}
          <div>
            <h3 className="mb-3 text-sm font-semibold"> Actions </h3>
            <div className="flex flex-col gap-2">
              <Button
                className={'h-10 w-full text-sm'}
                onClick={() => setOpenExpenseForm(true)}
              >
                <CheckIcon className="mr-1" /> Create Expense
              </Button>
              <Button className={'h-10 w-full text-sm'} variant={'outline'}>
                <PencilLineIcon className="mr-1" /> Edit Vendor
              </Button>
              <Button className={'h-10 w-full text-sm'} variant={'outline'}>
                <FileInput className="mr-1" /> Make Inactive
              </Button>
            </div>
          </div>

          {/* Business Information */}
          <Card className="mt-6 p-6">
            <h3 className="text-base font-semibold">Business Information</h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Business Name */}
                <div className="text-[#434343]">
                  <label className="mb-2 block text-sm font-semibold">
                    Business Name
                  </label>
                  <p className="text-sm font-medium">
                    {vendor.businessInformation?.businessName || 'Not provided'}
                  </p>
                </div>

                {/* Registration No */}
                <div className="text-[#434343]">
                  <label className="mb-2 block text-sm font-semibold">
                    Registration No
                  </label>
                  <p className="text-sm font-medium">
                    {vendor.businessInformation?.regNo || 'Not provided'}
                  </p>
                </div>

                {/* Tax ID */}
                <div className="text-[#434343]">
                  <label className="mb-2 block text-sm font-semibold">
                    Tax ID
                  </label>
                  <p className="text-sm font-medium">
                    {vendor.businessInformation?.taxId || 'Not provided'}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#434343]">
                    Status
                  </label>
                  <Badge
                    className={
                      vendor.status === 'APPROVED'
                        ? 'bg-green-100 font-medium text-green-800 hover:bg-green-100'
                        : 'bg-yellow-100 font-medium text-yellow-800 hover:bg-yellow-100'
                    }
                  >
                    {vendor.status === 'APPROVED' ? 'Paid' : 'Pending'}
                  </Badge>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6 text-[#434343]">
                {/* Date Of Registration */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Date Of Registration
                  </label>
                  <p className="text-sm font-medium">
                    {vendor.businessInformation?.regDate
                      ? format(
                          new Date(vendor.businessInformation.regDate),
                          'PP'
                        )
                      : 'Not provided'}
                  </p>
                </div>

                {/* Type of Incorporation */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Type of Incorporation
                  </label>
                  <p className="text-sm font-medium">
                    {vendor.businessInformation?.typeOfInc || 'Not provided'}
                  </p>
                </div>

                {/* Payment Terms */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Payment Terms
                  </label>
                  <p className="text-sm font-medium">N/A</p>
                </div>

                {/* On-Time Rate */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    On-Time Rate
                  </label>
                  <p className="text-sm font-medium">N/A</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Certificates */}
          <div className="mt-6">
            <h3 className="text-base font-semibold">Attachment</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Certificate of Incorporation */}
              {vendor.attachment?.ci && (
                <a
                  href={vendor.attachment.ci}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center justify-between rounded-xl border border-gray-200 p-2.5 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <img src={pdfIcon} alt="PDF Icon" className="h-4 w-4" />
                    <span className="text-xs font-medium text-[#434343]">
                      Certificate of Incorporation
                    </span>
                  </div>
                  <button className="text-green-600 hover:text-green-700">
                    <DownloadIcon size={16} />
                  </button>
                </a>
              )}

              {/* Company Logo */}
              {vendor.attachment?.cl && (
                <a
                  href={vendor.attachment.cl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center justify-between rounded-xl border border-gray-200 p-2.5 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <img src={pdfIcon} alt="PDF Icon" className="h-4 w-4" />
                    <span className="text-xs font-medium text-[#434343]">
                      Company Logo
                    </span>
                  </div>
                  <button className="text-green-600 hover:text-green-700">
                    <DownloadIcon size={16} />
                  </button>
                </a>
              )}

              {/* Tax Clearance Certificate */}
              {vendor.attachment?.tcc && (
                <a
                  href={vendor.attachment.tcc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center justify-between rounded-xl border border-gray-200 p-2.5 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <img src={pdfIcon} alt="PDF Icon" className="h-4 w-4" />
                    <span className="text-xs font-medium text-[#434343]">
                      Tax Clearance Certificate
                    </span>
                  </div>
                  <button className="text-green-600 hover:text-green-700">
                    <DownloadIcon size={16} />
                  </button>
                </a>
              )}

              {/* Vendor Passport */}
              {vendor.attachment?.vp && (
                <a
                  href={vendor.attachment.vp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center justify-between rounded-xl border border-gray-200 p-2.5 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <img src={pdfIcon} alt="PDF Icon" className="h-4 w-4" />
                    <span className="text-xs font-medium text-[#434343]">
                      Vendor Passport
                    </span>
                  </div>
                  <button className="text-green-600 hover:text-green-700">
                    <DownloadIcon size={16} />
                  </button>
                </a>
              )}

              {/* Show message if no attachments */}
              {!vendor.attachment?.ci &&
                !vendor.attachment?.cl &&
                !vendor.attachment?.tcc &&
                !vendor.attachment?.vp && (
                  <div className="col-span-2 mt-2 rounded-xl border border-gray-200 p-4 text-center">
                    <p className="text-sm text-gray-500">
                      No attachments available
                    </p>
                  </div>
                )}
            </div>
          </div>

          {/* Notes/Reviews */}
          <div>
            <h3 className="mt-6 text-sm font-semibold">Notes/Reviews</h3>
            <Textarea
              className={'mt-2 h-20 resize-none rounded-xl'}
              placeholder="Add a note..."
            ></Textarea>
          </div>

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
          className={'h-10 w-[106px] text-sm'}
          variant={'outline'}
          onClick={handleGoBack}
        >
          Back
        </Button>
        <Button className={'h-10 w-[130px] text-sm'}>
          <PencilLineIcon /> Edit Vendor
        </Button>
      </div>

      <ExpenseForm
        open={openExpenseForm}
        onOpenChange={setOpenExpenseForm}
        onSuccess={() => setOpenSuccessModal(true)}
      />
      <SuccessModal
        open={openSuccessModal}
        onOpenChange={setOpenSuccessModal}
        backText={'Back'}
        title={'Expense Recorded'}
        description={"You've successfully added an expense"}
      />
    </div>
  );
}
