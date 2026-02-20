import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft,
  Calendar,
  MessageSquare,
  Sparkles,
  XCircle,
  Trash2,
  Building2,
  EditIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BidsService from '@/api/bids';
import AccountingTable from '@/components/dashboard/accounting/table';
import toast from 'react-hot-toast';
import bidImage from '@/assets/images/bid-image.png';
import adsContainer from '@/assets/images/ads-report.png';

export default function BidDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bidData, setBidData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [vendors, setVendors] = useState([]);

  const fetchBidDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await BidsService.get({ id });
      const bid = response.data.data;

      // Transform bid data
      const transformedBid = {
        id: bid._id,
        title: bid.title,
        category: bid.vendorType,
        startDate: bid.startDate,
        expirationDate: bid.expirationDate,
        status: new Date(bid.expirationDate) < new Date() ? 'Closed' : 'Active',
        bidType: bid.bidSettings?.type === 'private' ? 'Private' : 'Public',
        image: bid.image,
        description: bid.bidBusinessDocument?.bidDescription || '',
        requireTaxClearance:
          bid.bidBusinessDocument?.biddersToUploadTaxClearanceCert || false,
        requireCacCertificate:
          bid.bidBusinessDocument?.biddersToUploadCAC || false,
        documentUrl: bid.bidBusinessDocument?.documentUrl || '',
        responses: 0, // This would come from actual responses
        vendorIds: bid.bidSettings?.vendorIds || [],
      };
      setVendors([]);
      setBidData(transformedBid);
    } catch (error) {
      console.error('Error fetching bid details:', error);
      toast.error('Failed to load bid details');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBidDetails();
  }, [fetchBidDetails]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA');
  };

  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const handleBack = () => {
    navigate('/dashboard/accounting/accounts-payable/bids');
  };

  const handleEdit = () => {
    toast.info('Edit functionality coming soon');
  };

  const handleClose = () => {
    toast.info('Close functionality coming soon');
  };

  const handleDelete = () => {
    toast.info('Delete functionality coming soon');
  };

  const handleBoostNow = () => {
    toast.info('Boost functionality coming soon');
  };

  // Vendor table columns
  const vendorColumns = [
    {
      key: 'name',
      label: 'Vendors',
      className: 'font-semibold',
    },
    {
      key: 'bidDate',
      label: 'Bid date',
    },
    {
      key: 'status',
      label: 'Status',
    },
  ];

  // Status styles for vendor table
  const vendorStatusStyles = {
    Review: 'bg-orange-100 text-orange-600 hover:bg-orange-100',
    Approved: 'bg-green-100 text-green-600 hover:bg-green-100',
    Rejected: 'bg-red-100 text-red-600 hover:bg-red-100',
  };

  const vendorDropdownActions = [
    { key: 'view', label: 'View Details' },
    { key: 'approve', label: 'Approve' },
    { key: 'reject', label: 'Reject' },
  ];

  const handleVendorAction = (action, vendor) => {
    console.log('Vendor action:', action, vendor);
    toast.info(`${action} for ${vendor.name}`);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading bid details...</p>
      </div>
    );
  }

  if (!bidData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Bid not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6">
      {/* Header */}
      <div className="mb-6">
        <Button onClick={handleBack} variant={'ghost'} className="mb-4">
          <ArrowLeft size={20} />
          <span className="font-medium">Bids Details</span>
        </Button>
      </div>

      {/* Bid Header Card */}
      <div className="mb-6 rounded-2xl bg-white p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="bg-primary flex size-23.75 items-center justify-center rounded-full text-2xl font-bold text-white">
            {bidData.title.charAt(0)}
          </div>

          {/* Title and Info */}
          <div className="flex-1">
            <h1 className="mb-2 text-base font-semibold">{bidData.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Building2 size={16} />
                <span>{bidData.category}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>Posted: {formatDate(bidData.startDate)}</span>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Badge className="bg-[#254C00]/10 text-[#254C00] hover:bg-[#254C00]/10">
                {bidData.status}
              </Badge>
              <Badge variant="bg-primary/10 text-primary">
                {bidData.bidType}
              </Badge>
            </div>
          </div>

          {/* Edit Button */}
          <Button onClick={handleEdit} className="h-12 w-29.25 rounded-xl">
            <EditIcon className="size-4" />
            Edit Bid
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Bid Information */}
          <div className="mb-6 rounded-2xl bg-white p-6">
            <h2 className="mb-6 text-sm font-semibold">Bid Information</h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Category
                </label>
                <div className="flex items-center gap-2 text-gray-900">
                  <Building2 size={16} className="text-gray-400" />
                  <span>{bidData.category}</span>
                </div>
              </div>

              {/* Start Date */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Start Date
                </label>
                <div className="flex items-center gap-2 text-gray-900">
                  <Calendar size={16} className="text-gray-400" />
                  <span>{formatDate(bidData.startDate)}</span>
                </div>
              </div>

              {/* Total Response */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Total Response
                </label>
                <div className="flex items-center gap-2 text-gray-900">
                  <MessageSquare size={16} className="text-gray-400" />
                  <span>{bidData.responses} responses</span>
                </div>
              </div>

              {/* Deadline */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600">
                  Deadline
                </label>
                <div className="flex items-center gap-2 text-gray-900">
                  <Calendar size={16} className="text-gray-400" />
                  <span>{formatDate(bidData.expirationDate)}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Description
              </label>
              <p className="text-gray-700">{stripHtml(bidData.description)}</p>
            </div>

            {/* Requirement */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-600">
                Requirement
              </label>
              {!bidData.requireTaxClearance &&
              !bidData.requireCacCertificate ? (
                <p className="text-gray-700">N/A</p>
              ) : (
                <ul className="list-inside list-disc space-y-1 text-gray-700">
                  {bidData.requireTaxClearance && <li>Tax Certificate</li>}
                  {bidData.requireCacCertificate && <li>CAC Certificate</li>}
                </ul>
              )}
            </div>
          </div>

          {/* Vendors Table */}
          <div className="rounded-2xl bg-white">
            <AccountingTable
              title="Vendors"
              data={vendors}
              columns={vendorColumns}
              searchFields={['name']}
              searchPlaceholder="Search bidders..."
              statusStyles={vendorStatusStyles}
              dropdownActions={vendorDropdownActions}
              paginationData={{
                page: 1,
                totalPages: 10,
                pageSize: 10,
                totalCount: 100,
              }}
              onRowAction={handleVendorAction}
              selectedItems={[]}
              handleSelectAll={() => {}}
              handleSelectItem={() => {}}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Boost Visibility Card */}
          <div className="mb-6 rounded-2xl bg-linear-to-br from-blue-50 to-purple-50 p-6">
            <div className="mb-4 flex gap-2">
              <div className="flex w-full items-center justify-center">
                <img src={bidImage} alt="Bid" className="" />
              </div>
              <div>
                <h3 className="mb-1 text-sm font-semibold">
                  Boost your Bid visibility
                </h3>
                <p className="text-[10px] text-gray-600">
                  Invite Bids to reach more qualified vendors and stand out
                  among others looking for the same service
                </p>
              </div>
            </div>
            <Button onClick={handleBoostNow} className="h-11 w-full rounded-xl">
              <Sparkles size={16} className="mr-2" />
              Boost Now
            </Button>
          </div>

          {/* Action Card */}
          <div className="rounded-2xl bg-white p-6">
            <h3 className="mb-4 text-base font-semibold">Action</h3>
            <div className="space-y-3">
              <Button onClick={handleClose} className="h-11 w-full rounded-xl">
                <XCircle size={16} className="mr-2" />
                Close
              </Button>
              <Button
                onClick={handleDelete}
                variant="outline"
                className="h-11 w-full rounded-xl"
              >
                <Trash2 size={16} className="mr-2" />
                Delete
              </Button>
            </div>
          </div>

          <div className="mt-10">
            <img
              src={adsContainer}
              alt="Advertisement"
              className="w-full rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
