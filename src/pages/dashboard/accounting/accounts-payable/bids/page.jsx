import BidCard from '@/components/dashboard/accounting/accounts-payable/bids/bid-card';
import BidList from '@/components/dashboard/accounting/accounts-payable/bids/bid-list';
import CreateBidForm from '@/components/dashboard/accounting/accounts-payable/bids/create-bid-form';
import DownloadDropdown from '@/components/dashboard/accounting/download-dropdown';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import SettingsDropdown from '@/components/dashboard/accounting/settings-dropdown';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import BidsService from '@/api/bids';

const bidsMetricsData = [
  { title: 'Total Bids', value: '120' },
  { title: 'Active This Month', value: '15' },
  { title: 'Pending Bids', value: '100' },
  { title: 'Average Bid Value', value: '$8,500.00' },
];

export default function Bids() {
  const navigate = useNavigate();
  const [openBidForm, setOpenBidForm] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [bidsData, setBidsData] = useState([]);
  const [bidsMetrics, setBidsMetrics] = useState(bidsMetricsData);
  const [isLoadingBids, setIsLoadingBids] = useState(false);
  const [paginationData, setPaginationData] = useState({
    page: 1,
    totalPages: 1,
    totalDocs: 0,
  });

  const [columns, setColumns] = useState({
    number: true,
    type: true,
    detailType: true,
    currency: true,
    bankBalance: true,
  });
  const [includeInactive, setIncludeInactive] = useState(false);
  const [showAccountTypeBadges, setShowAccountTypeBadges] = useState(true);
  const [pageSize, setPageSize] = useState('50');
  const [tableDensity, setTableDensity] = useState('Cozy');

  const fetchBids = async (page = 1) => {
    setIsLoadingBids(true);
    try {
      const response = await BidsService.fetch({ page, perPage: 10 });
      const bids = response.data.data.bids || [];
      const pagination = response.data.data;

      // Helper function to strip HTML tags from description
      const stripHtml = (html) => {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
      };

      // Helper function to format vendor type
      const formatVendorType = (type) => {
        if (!type) return 'General';
        return type.charAt(0).toUpperCase() + type.slice(1);
      };

      // Transform bids data to match BidList format
      const transformedBids = bids.map((bid) => ({
        id: bid._id,
        title: bid.title,
        description: stripHtml(
          bid.bidBusinessDocument?.bidDescription || 'No description'
        ),
        category: formatVendorType(bid.vendorType),
        responses: 0, // This would need to come from another API endpoint
        startDate: bid.startDate,
        deadline: bid.expirationDate,
        status: new Date(bid.expirationDate) < new Date() ? 'Closed' : 'Active',
        bidType: bid.bidSettings?.type === 'private' ? 'Private' : 'Public',
        isDeadlinePassed: new Date(bid.expirationDate) < new Date(),
        image: bid.image,
        vendorIds: bid.bidSettings?.vendorIds || [],
        requireTaxClearance:
          bid.bidBusinessDocument?.biddersToUploadTaxClearanceCert,
        requireCacCertificate: bid.bidBusinessDocument?.biddersToUploadCAC,
        documentUrl: bid.bidBusinessDocument?.documentUrl,
      }));

      setBidsData(transformedBids);

      // Update pagination
      setPaginationData({
        page: pagination.page,
        totalPages: pagination.totalPages,
        totalDocs: pagination.totalDocs,
      });

      // Calculate metrics
      const totalBids = pagination.totalDocs;
      const activeBids = transformedBids.filter(
        (bid) => bid.status === 'Active'
      ).length;
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const activeThisMonth = transformedBids.filter((bid) => {
        const bidDate = new Date(bid.startDate);
        return (
          bidDate.getMonth() === currentMonth &&
          bidDate.getFullYear() === currentYear &&
          bid.status === 'Active'
        );
      }).length;

      setBidsMetrics([
        { title: 'Total Bids', value: totalBids.toString() },
        { title: 'Active Bids', value: activeBids.toString() },
        { title: 'Active This Month', value: activeThisMonth.toString() },
        { title: 'Closed Bids', value: (totalBids - activeBids).toString() },
      ]);
    } catch (error) {
      console.error('Error fetching bids:', error);
    } finally {
      setIsLoadingBids(false);
    }
  };

  useEffect(() => {
    fetchBids();
  }, []);

  const handleBidSuccess = () => {
    setOpenSuccessModal(true);
    fetchBids(paginationData.page); // Refresh bids list at current page
  };

  const handlePageChange = (newPage) => {
    fetchBids(newPage);
  };

  // Bid action handlers
  const handleBidView = (bid) => {
    navigate(`/dashboard/accounting/accounts-payable/bids/${bid.id}`);
  };

  const handleBidEdit = (bid) => {
    console.log('Edit bid:', bid);
    // TODO: Implement edit functionality
  };

  const handleBidDelete = (bid) => {
    console.log('Delete bid:', bid);
    // TODO: Implement delete functionality
  };

  const handleBidClose = (bid) => {
    console.log('Close bid:', bid);
    // TODO: Implement close functionality
  };

  // Event handlers
  const onDownloadFormats = (format, checked) => {
    console.log(`Download ${format}:`, checked);
    // Handle download logic here
  };

  const onColumnsChange = (columnKey, checked) => {
    setColumns((prev) => ({
      ...prev,
      [columnKey]: checked,
    }));
  };

  const onIncludeInactiveChange = (checked) => {
    setIncludeInactive(checked);
  };

  const onShowAccountTypeBadgesChange = (checked) => {
    setShowAccountTypeBadges(checked);
  };

  const onPageSizeChange = (value) => {
    setPageSize(value);
  };

  const onTableDensityChange = (value) => {
    setTableDensity(value);
  };

  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Bids</h1>
          <p className="text-sm text-[#7D7D7D]">
            Manage your procurement process and vendor selection.
          </p>
        </hgroup>

        <div className="flex space-x-4">
          <Button
            className={'h-10 rounded-2xl text-sm'}
            onClick={() => setOpenBidForm(true)}
          >
            <PlusCircleIcon className="size-4" />
            Create a Bid
          </Button>
          <DownloadDropdown onDownloadFormats={onDownloadFormats} />
          <SettingsDropdown
            columns={columns}
            onColumnsChange={onColumnsChange}
            includeInactive={includeInactive}
            onIncludeInactiveChange={onIncludeInactiveChange}
            showAccountTypeBadges={showAccountTypeBadges}
            onShowAccountTypeBadgesChange={onShowAccountTypeBadgesChange}
            pageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
            tableDensity={tableDensity}
            onTableDensityChange={onTableDensityChange}
          />
        </div>
      </div>
      <div className="mt-10">
        <Metrics metrics={bidsMetrics} />
      </div>

      {isLoadingBids ? (
        <div className="mt-10 flex items-center justify-center rounded-2xl bg-white p-12">
          <p className="text-gray-500">Loading bids...</p>
        </div>
      ) : (
        <BidList
          className="mt-10"
          bidsData={bidsData}
          paginationData={paginationData}
          onPageChange={handlePageChange}
          onBidView={handleBidView}
          onBidEdit={handleBidEdit}
          onBidDelete={handleBidDelete}
          onBidClose={handleBidClose}
        />
      )}

      <CreateBidForm
        open={openBidForm}
        onOpenChange={setOpenBidForm}
        onSuccess={handleBidSuccess}
      />

      <SuccessModal
        title={`Bid Added`}
        description={`You've successfully added a bid`}
        open={openSuccessModal}
        onOpenChange={setOpenSuccessModal}
        backText={'Back'}
        handleBack={() => setOpenSuccessModal(false)}
      />
    </div>
  );
}
