import VendorService from '@/api/vendor';
import AddVendorForm from '@/components/dashboard/accounting/accounts-payable/vendors/vendor-form';
import VendorsList from '@/components/dashboard/accounting/accounts-payable/vendors/vendors-list';
import VendorSkeleton from '@/components/dashboard/accounting/accounts-payable/vendors/vendor-skeleton';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import { Button } from '@/components/ui/button';
import { DownloadIcon, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';

export default function VendorsExpenses() {
  const navigate = useNavigate();
  const [openAddVendor, setOpenAddVendor] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paginationData, setPaginationData] = useState({
    page: 1,
    totalPages: 1,
    totalDocs: 0,
    limit: 20,
  });

  const fetchVendors = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await VendorService.fetch({ page, perPage: 20 });
      const vendorsData = res.data?.data?.vendors || [];
      setVendors(vendorsData);
      setPaginationData({
        page: res.data?.data?.page || 1,
        totalPages: res.data?.data?.totalPages || 1,
        totalDocs: res.data?.data?.totalDocs || 0,
        limit: res.data?.data?.limit || 20,
      });
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setVendors([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // Transform vendors data for the VendorsList component
  const transformedVendors = useMemo(() => {
    return vendors.map((vendor) => ({
      id: vendor._id || vendor.id,
      name: `${vendor.firstName} ${vendor.lastName}`,
      category: vendor.businessInformation?.businessName || 'N/A',
      contactPerson: `${vendor.firstName} ${vendor.lastName}`,
      email: vendor.contact?.email || 'N/A',
      phone: vendor.contact?.phoneNumber1 || 'N/A',
      address: vendor.contact?.address || 'N/A',
      services: vendor.businessInformation?.category || 'N/A',
      rating: 0,
      joinDate: vendor.createdAt,
      // verified: vendor.status === 'APPROVED',
      verified: true,
      avatar: null,
      paymentStatus: 'unpaid',
      totalSpent: '$0',
    }));
  }, [vendors]);

  // Calculate vendor metrics
  const vendorMetrics = useMemo(() => {
    const totalVendors = paginationData.totalDocs;
    const activeVendors = vendors.filter((v) => v.status === 'APPROVED').length;
    const pendingVendors = vendors.filter((v) => v.status === 'PENDING').length;

    return [
      {
        title: 'Total Vendors',
        value: totalVendors,
      },
      {
        title: 'Active',
        value: activeVendors,
      },
      {
        title: 'Pending',
        value: pendingVendors,
      },
      {
        title: 'Total Spent',
        value: '$0',
      },
    ];
  }, [vendors, paginationData.totalDocs]);

  const handleVendorSuccess = () => {
    setOpenSuccessModal(true);
    fetchVendors(paginationData.page);
  };

  const handlePageChange = (page) => {
    fetchVendors(page);
  };

  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Vendors</h1>
          <p className="text-sm text-[#7D7D7D]">
            Manage your vendor relationships
          </p>
        </hgroup>

        <div className="flex space-x-4">
          <Button
            onClick={() => setOpenAddVendor(true)}
            className={'h-10 rounded-2xl text-sm'}
          >
            <PlusCircleIcon className="size-4" />
            Add Vendor
          </Button>
          <Button size={'icon'} className={'size-10'} variant={'outline'}>
            <DownloadIcon size={16} />
          </Button>
          <Button size={'icon'} className={'size-10'} variant={'outline'}>
            <SettingsIcon size={16} />
          </Button>
        </div>
      </div>

      <div className="my-10 space-y-10">
        {isLoading ? (
          <VendorSkeleton />
        ) : (
          <>
            <Metrics metrics={vendorMetrics} />

            <VendorsList
              isBillingPage={false}
              vendorsData={transformedVendors}
              onVendorView={(vendor) => navigate(`${vendor.id}`)}
              paginationData={paginationData}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>

      <AddVendorForm
        open={openAddVendor}
        onOpenChange={setOpenAddVendor}
        showSuccessModal={handleVendorSuccess}
      />

      <SuccessModal
        open={openSuccessModal}
        onOpenChange={setOpenSuccessModal}
        backText={'Back'}
        title={'Vendor added successfully!'}
        description={'You have successfully added a vendor.'}
      />
    </div>
  );
}
