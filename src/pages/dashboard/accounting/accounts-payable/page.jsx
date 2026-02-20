import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon } from 'lucide-react';
import EmptyVendor from '@/components/dashboard/accounting/accounts-payable/vendors/empty-vendor-state';
import AddVendorForm from '@/components/dashboard/accounting/accounts-payable/vendors/vendor-form';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import AccountingTable from '@/components/dashboard/accounting/table';
import VendorCard from '@/components/dashboard/accounting/accounts-payable/vendors/vendor-card';
import SettingsDropdown from '@/components/dashboard/accounting/settings-dropdown';
import DownloadDropdown from '@/components/dashboard/accounting/download-dropdown';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import CreateBidForm from '@/components/dashboard/accounting/accounts-payable/bids/create-bid-form';
import VendorService from '@/api/vendor';

// Table columns configuration
const vendorColumns = [
  {
    key: 'img',
    label: 'Image',
    render: (value, item) => (
      <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-full font-semibold text-white">
        {item.initials || 'NA'}
      </div>
    ),
  },
  { key: 'name', label: 'Vendor Name' },
  { key: 'category', label: 'Category' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'status', label: 'Status' },
];

const statusStyles = {
  active: 'bg-green-100 text-green-800 hover:bg-green-100',
  ACTIVE: 'bg-green-100 text-green-800 hover:bg-green-100',
  PENDING: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
  pending: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
  BLACKLISTED: 'bg-red-100 text-red-800 hover:bg-red-100',
  blacklisted: 'bg-red-100 text-red-800 hover:bg-red-100',
};

// Wrapper component for VendorCard to work with AccountingTable
const VendorCardWrapper = ({ data, handleSelect, handleDropdownAction }) => {
  return (
    <VendorCard
      vendor={data}
      onViewDetails={(vendor) => handleDropdownAction('view', vendor)}
      onSelected={(checked) => handleSelect(checked)}
      onContact={(vendor) => handleDropdownAction('contact', vendor)}
      onEdit={(vendor) => handleDropdownAction('edit', vendor)}
      onBlacklist={(vendor) => handleDropdownAction('blacklist', vendor)}
    />
  );
};

export default function VendorManagement() {
  const navigate = useNavigate();
  const [openVendorForm, setOpenVendorForm] = useState(false);
  const [openBidForm, setOpenBidForm] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState({
    open: false,
    for: '',
  });
  const [vendorData, setVendorData] = useState([]);
  const [vendorMetrics, setVendorMetrics] = useState([
    { title: 'Total Vendors', value: '0' },
    { title: 'Active This Month', value: '0' },
    { title: 'Pending Verification', value: '0' },
    { title: 'Top Vendor', value: '-' },
  ]);
  const [isLoadingVendors, setIsLoadingVendors] = useState(false);
  const [paginationData, setPaginationData] = useState({
    page: 1,
    totalPages: 1,
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

  // State for table selection
  const [selectedItems, setSelectedItems] = useState([]);

  const fetchVendors = async (page = 1) => {
    setIsLoadingVendors(true);
    try {
      const response = await VendorService.fetch({ page, perPage: 10 });
      const vendors = response.data.data.vendors || [];
      const pagination = response.data.data;

      // Transform vendors data to match sample.json structure
      const transformedVendors = vendors.map((vendor) => {
        const fullName =
          `${vendor.firstName || ''} ${vendor.lastName || ''}`.trim();
        const businessName =
          vendor.businessInformation?.businessName ||
          fullName ||
          'Unknown Vendor';
        const initials = businessName
          .split(' ')
          .map((word) => word.charAt(0))
          .join('')
          .substring(0, 2)
          .toUpperCase();

        return {
          id: vendor._id,
          name: businessName,
          category: vendor.businessInformation?.category || 'N/A',
          contactPerson: fullName || 'N/A',
          email: vendor.contact?.email || 'N/A',
          phone: vendor.contact?.phoneNumber1 || 'N/A',
          address: vendor.contact?.address
            ? `${vendor.contact.address}${vendor.contact.city ? ', ' + vendor.contact.city : ''}${vendor.contact.state ? ', ' + vendor.contact.state : ''}`
            : 'N/A',
          services: vendor.businessInformation?.category || 'N/A',
          rating: 4.5,
          joinDate: vendor.createdAt,
          verified: vendor.status === 'ACTIVE',
          avatar: null,
          initials: initials,
          status: vendor.status,
          paymentStatus: 'paid',
          totalSpent: '$0',
        };
      });

      setVendorData(transformedVendors);

      // Update pagination
      setPaginationData({
        page: pagination.page,
        totalPages: pagination.totalPages,
      });

      // Update metrics
      const totalVendors = pagination.totalDocs;
      const pendingVendors = vendors.filter(
        (v) => v.status === 'PENDING'
      ).length;
      setVendorMetrics([
        { title: 'Total Vendors', value: totalVendors.toString() },
        { title: 'Active This Month', value: '0' },
        { title: 'Pending Verification', value: pendingVendors.toString() },
        { title: 'Top Vendor', value: transformedVendors[0]?.name || '-' },
      ]);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setIsLoadingVendors(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handlePageChange = (newPage) => {
    fetchVendors(newPage);
  };

  const handleVendorSuccess = () => {
    setOpenSuccessModal({ open: true, for: 'vendor' });
    fetchVendors(paginationData.page);
  };

  // Handle table item selection
  const handleSelectItem = (itemId, checked) => {
    setSelectedItems((prevItems) => {
      if (checked) {
        return [...prevItems, itemId];
      } else {
        return prevItems.filter((id) => id !== itemId);
      }
    });
  };

  // Handle select all functionality
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(vendorData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Handle row actions for the table
  const handleRowAction = (action, item) => {
    console.log(`Action: ${action}`, item);
    switch (action) {
      case 'edit':
        console.log('Edit vendor:', item.id);
        // TODO: Implement edit functionality
        break;
      case 'view':
        navigate(`vendors/${item.id}`);
        break;
      case 'contact':
        console.log('Contact vendor:', item.id);
        // TODO: Implement contact functionality
        break;
      case 'blacklist':
        console.log('Blacklist vendor:', item.id);
        // TODO: Implement blacklist functionality
        break;
      default:
        console.log('Unknown action:', action);
    }
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
          <h1 className="text-2xl font-bold">Vendor Mangement</h1>
          <p className="text-sm text-[#7D7D7D]">
            Manage vendor profiles and relationships
          </p>
        </hgroup>

        <div className="flex space-x-4">
          <Button
            className={'h-10 rounded-2xl text-sm'}
            onClick={() => setOpenVendorForm(true)}
          >
            <PlusCircleIcon className="size-4" />
            Add Vendor
          </Button>
          <Button
            variant={'outline'}
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

      {!isLoadingVendors && vendorData.length === 0 ? (
        <EmptyVendor onClick={() => setOpenVendorForm(true)} />
      ) : (
        <div className="mt-10">
          <Metrics metrics={vendorMetrics} />
          <AccountingTable
            className="mt-10"
            title="Vendor Management"
            data={vendorData}
            columns={vendorColumns}
            searchFields={['name', 'category', 'email', 'status']}
            searchPlaceholder="Search vendors......."
            statusStyles={statusStyles}
            paginationData={paginationData}
            onPageChange={handlePageChange}
            dropdownActions={[
              { key: 'view', label: 'View Details' },
              { key: 'edit', label: 'Edit' },
              { key: 'contact', label: 'Contact' },
              { key: 'blacklist', label: 'Blacklist' },
            ]}
            selectedItems={selectedItems}
            handleSelectItem={handleSelectItem}
            handleSelectAll={handleSelectAll}
            onRowAction={handleRowAction}
            isLoading={isLoadingVendors}
            isProductTable={true}
            itemComponent={VendorCardWrapper}
          />
        </div>
      )}

      <AddVendorForm
        open={openVendorForm}
        showSuccessModal={handleVendorSuccess}
        onOpenChange={setOpenVendorForm}
      />

      <CreateBidForm
        open={openBidForm}
        onOpenChange={setOpenBidForm}
        onSuccess={() => setOpenSuccessModal({ open: true, for: 'bid' })}
      />

      <SuccessModal
        title={`${openSuccessModal.for === 'vendor' ? 'Vendor' : 'Bid'} Added`}
        description={`You've successfully added a ${openSuccessModal.for === 'vendor' ? 'vendor' : 'bid'}`}
        open={openSuccessModal.open}
        onOpenChange={(open) =>
          setOpenSuccessModal({ ...openSuccessModal, open })
        }
        backText={'Back'}
        handleBack={() =>
          setOpenSuccessModal({ ...openSuccessModal, open: false })
        }
      />
    </div>
  );
}
