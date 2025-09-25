import BidCard from '@/components/dashboard/accounting/accounts-payable/bids/bid-card';
import BidList from '@/components/dashboard/accounting/accounts-payable/bids/bid-list';
import CreateBidForm from '@/components/dashboard/accounting/accounts-payable/bids/create-bid-form';
import DownloadDropdown from '@/components/dashboard/accounting/download-dropdown';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import SettingsDropdown from '@/components/dashboard/accounting/settings-dropdown';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon } from 'lucide-react';
import { useState } from 'react';

const bidsMetricsData = [
  { title: 'Total Bids', value: '120' },
  { title: 'Active This Month', value: '15' },
  { title: 'Pending Bids', value: '100' },
  { title: 'Average Bid Value', value: '$8,500.00' },
];

export default function Bids() {
  const [openBidForm, setOpenBidForm] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

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
        <Metrics metrics={bidsMetricsData} />
      </div>

      <BidList className="mt-10" />

      <CreateBidForm
        open={openBidForm}
        onOpenChange={setOpenBidForm}
        onSuccess={() => setOpenSuccessModal(true)}
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
