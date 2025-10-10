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
import { useNavigate } from 'react-router';
import ExpenseForm from '@/components/dashboard/accounting/expense-mgmt/overview/expense-form';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import { useState } from 'react';

export default function VendorExpenseDetails() {
  const [openExpenseForm, setOpenExpenseForm] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1, { replace: true });
  };

  return (
    <div className="mx-4 my-4 min-h-screen rounded-xl bg-white p-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button className="cursor-pointer" onClick={handleGoBack}>
          <ArrowLeftIcon />
        </button>
        <header className="flex gap-2">
          <img
            src="https://placehold.co/32"
            alt="Vendor Logo"
            className="h-8 w-8 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-semibold">JJ Solutions</h1>
            <p className="text-sm font-medium text-[#434343]">Marketing</p>
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
                      jjsolutions@gmail.com
                    </span>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <h3 className="mb-2 text-sm font-semibold">Name</h3>
                  <div className="flex items-center gap-3">
                    <UserIcon size={16} color="#434343" />
                    <span className="text-sm font-medium">Adeniyi James</span>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h3 className="mb-1.5 text-sm font-semibold">Address</h3>
                  <div className="flex items-start gap-3">
                    <MapPinIcon size={16} color="#434343" className="mt-1" />
                    <div className="text-sm font-medium">
                      <p>2118 Thornridge Cir. Syracuse,</p>
                      <p>Connecticut 35624</p>
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
                    <span className="font-medium">+234706574230</span>
                  </div>
                </div>

                {/* Website */}
                <div>
                  <h3 className="mb-2 font-semibold">Website</h3>
                  <div className="flex items-center gap-3">
                    <GlobeIcon size={16} color="#8979FF" />
                    <a
                      href="#"
                      className="text-[#8979FF]hover:underline font-medium"
                    >
                      www.jjsolutions.com
                    </a>
                  </div>
                </div>

                {/* Date Added */}
                <div>
                  <h3 className="mb-2 font-semibold">Date Added</h3>
                  <div className="flex items-center gap-3">
                    <CalendarIcon size={16} color="#434343" />
                    <span className="font-medium">22-2-2025</span>
                  </div>
                </div>

                {/* Added by */}
                <div>
                  <h3 className="mb-2 font-semibold">Added by</h3>
                  <div className="flex items-center gap-3">
                    <UserIcon size={16} color="#434343" />
                    <span className="font-medium">John Adeniyi</span>
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
                  <p className="font-semibold">12</p>
                </div>

                {/* Last Payment */}
                <div>
                  <h3 className="mb-2 text-sm font-semibold">Last Payment</h3>
                  <p className="text-sm font-medium">Jan-2-2025</p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4 text-sm text-[#434343]">
                {/* Phone Number */}
                <div>
                  <h3 className="mb-2 font-semibold">Phone Number</h3>
                  <p className="font-medium">+234706574230</p>
                </div>

                {/* Average Invoice */}
                <div>
                  <h3 className="mb-2 font-semibold">Average Invoice</h3>
                  <p className="font-medium">$4,566</p>
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
              <Button className={'h-10 w-full text-sm'}>
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

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Tax ID */}
                <div className="text-[#434343]">
                  <label className="mb-2 block text-sm font-semibold">
                    Tax ID
                  </label>
                  <p className="text-sm font-medium">XX-XXXX</p>
                </div>

                {/* Status */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#434343]">
                    Status
                  </label>
                  <Badge className="bg-green-100 font-medium text-green-800 hover:bg-green-100">
                    Paid
                  </Badge>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6 text-[#434343]">
                {/* Payment Terms */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Payment Terms
                  </label>
                  <p className="text-sm font-medium">2 days</p>
                </div>

                {/* On-Time Rate */}
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    On-Time Rate
                  </label>
                  <p className="text-sm font-medium">2 days</p>
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
          <div className="mt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Tax Certificate */}
              <div>
                <h3 className="text-base font-semibold">Tax Certificate</h3>
                <div className="mt-2 flex items-center justify-between rounded-xl border border-gray-200 p-2.5">
                  <div className="flex items-center space-x-3">
                    <img src={pdfIcon} alt="PDF Icon" className="h-4 w-4" />
                    <span className="text-xs font-medium text-[#434343]">
                      Tax Certificate.pdf
                    </span>
                  </div>
                  <button className="text-green-600 hover:text-green-700">
                    <DownloadIcon size={16} />
                  </button>
                </div>
              </div>

              {/* CAC Certificate */}
              <div>
                <h3 className="text-base font-semibold">CAC Certificate</h3>
                <div className="mt-2 flex items-center justify-between rounded-xl border border-gray-200 p-2.5">
                  <div className="flex items-center space-x-3">
                    <img src={pdfIcon} alt="PDF Icon" className="h-4 w-4" />
                    <span className="text-xs font-medium text-[#434343]">
                      CAC Certificate.pdf
                    </span>
                  </div>
                  <button className="text-green-600 hover:text-green-700">
                    <DownloadIcon size={16} />
                  </button>
                </div>
              </div>
            </div>
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
