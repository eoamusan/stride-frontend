import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon, DownloadIcon, SettingsIcon } from 'lucide-react';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import AccountingTable from '@/components/dashboard/accounting/table';
import AddBillForm from '@/components/dashboard/accounting/expense-mgmt/bills/add-bill-form';
import ViewBills from '@/components/dashboard/accounting/expense-mgmt/bills/view-bills';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import BillService from '@/api/bills';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function VendorInvoices() {
  const [openAddBill, setOpenAddBill] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openViewBill, setOpenViewBill] = useState(false);
  const [editData, setEditData] = useState({});
  const [viewData, setViewData] = useState(null);
  const [bills, setBills] = useState([]);
  const [paginationData, setPaginationData] = useState({
    page: 1,
    totalPages: 1,
    totalDocs: 0,
    limit: 20,
  });

  // Fetch bills
  const fetchBills = useCallback(async () => {
    try {
      const res = await BillService.fetch({ page: currentPage, perPage: 20 });
      const billsData = res.data?.data?.bill || [];
      setBills(billsData);
      setPaginationData({
        page: res.data?.data?.page || 1,
        totalPages: res.data?.data?.totalPages || 1,
        totalDocs: res.data?.data?.totalDocs || 0,
        limit: res.data?.data?.limit || 20,
      });
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchBills();
  }, [currentPage, fetchBills, openSuccessModal]);

  // Transform bills data for table
  const transformedBills = useMemo(() => {
    return bills.map((item) => {
      const bill = item.bill;
      const vendor = item.vendor;
      const vendorName =
        `${vendor?.firstName || ''} ${vendor?.lastName || ''}`.trim();
      const vendorInitials =
        `${vendor?.firstName?.[0] || ''}${vendor?.lastName?.[0] || ''}`.toUpperCase();

      return {
        id: bill._id || bill.id,
        vendor: vendorName || 'N/A',
        vendorInitials: vendorInitials || 'NA',
        billNumber: bill.billNo,
        attachment: bill.attachment || '',
        source: bill.source,
        billNo: bill.billNo,
        billDate: bill.billDate ? format(new Date(bill.billDate), 'PP') : 'N/A',
        category:
          bill.category?.charAt(0).toUpperCase() + bill.category?.slice(1) ||
          'N/A',
        dueDate: bill.dueDate ? format(new Date(bill.dueDate), 'PP') : 'N/A',
        billAmount: `$${Number(bill.billAmount).toLocaleString('en-US')}`,
        status: bill.status
          ? bill.status.charAt(0).toUpperCase() +
            bill.status.slice(1).toLowerCase()
          : 'Pending',
      };
    });
  }, [bills]);

  // Calculate metrics from bills
  const billMetrics = useMemo(() => {
    const totalBills = paginationData.totalDocs;
    const totalSpent = bills.reduce((sum, item) => {
      return sum + Number(item.bill?.billAmount || 0);
    }, 0);
    const pendingBills = bills.filter(
      (item) => item.bill?.status?.toLowerCase() === 'pending'
    ).length;

    return [
      {
        title: 'Total Outstanding',
        value: `$${totalSpent.toLocaleString('en-US')}`,
      },
      {
        title: 'Pending Approval',
        value: pendingBills,
      },
      {
        title: 'This Month Paid',
        value: '$0', // TODO: Calculate from API
      },
      {
        title: 'Active Vendors',
        value: totalBills,
      },
    ];
  }, [bills, paginationData.totalDocs]);

  // Selection handlers
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(transformedBills.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId, checked) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    }
  };

  // Row action handler
  const handleRowAction = (action, item) => {
    console.log('Action:', action, 'Item:', item);

    switch (action) {
      case 'view': {
        // Find the full bill data from bills array
        const fullBillData = bills.find(
          (b) => (b.bill._id || b.bill.id) === item.id
        );
        setViewData(fullBillData);
        setOpenViewBill(true);
        break;
      }
      case 'edit': {
        // Find the full bill data from bills array for editing
        const fullBillData = bills.find(
          (b) => (b.bill._id || b.bill.id) === item.id
        );
        if (fullBillData) {
          setEditData({
            billId: fullBillData.bill._id || fullBillData.bill.id,
            vendorId: fullBillData.vendor?._id || fullBillData.vendor?.id,
            source: fullBillData.bill.source,
            billDate: fullBillData.bill.billDate,
            billNo: fullBillData.bill.billNo,
            dueDate: fullBillData.bill.dueDate,
            category: fullBillData.bill.category,
            billAmount: fullBillData.bill.billAmount,
            attachment: fullBillData.bill.attachment || '',
          });
        }
        setOpenAddBill(true);
        break;
      }
      case 'pay':
        handleMarkAsPaid(item);
        break;
      case 'delete':
        console.log('Delete bill:', item.id);
        // TODO: Implement delete functionality
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  // Handle edit from ViewBills modal
  const handleEditFromView = () => {
    if (viewData) {
      setEditData({
        billId: viewData.bill._id || viewData.bill.id,
        vendorId: viewData.vendor?._id || viewData.vendor?.id,
        source: viewData.bill.source,
        billDate: viewData.bill.billDate,
        billNo: viewData.bill.billNo,
        dueDate: viewData.bill.dueDate,
        category: viewData.bill.category,
        billAmount: viewData.bill.billAmount,
        attachment: viewData.bill.attachment || '',
      });
      setOpenViewBill(false);
      setOpenAddBill(true);
    }
  };

  // Handle mark as paid
  const handleMarkAsPaid = async (item) => {
    try {
      await BillService.update({
        id: item.id,
        data: { status: 'paid' },
      });
      fetchBills();
      toast.success('Bill marked as paid successfully!');
    } catch (error) {
      console.error('Error marking bill as paid:', error);
      toast.error('Failed to mark bill as paid. Please try again.');
    }
  };

  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Vendor Invoices</h1>
          <p className="text-sm text-[#7D7D7D]">
            Track and manage vendor bills and payments
          </p>
        </hgroup>

        <div className="flex space-x-4">
          <Button
            onClick={() => {
              // setEditData({});
              // setOpenAddBill(true);
            }}
            className={'h-10 rounded-2xl text-sm'}
          >
            <PlusCircleIcon className="size-4" />
            Record Invoice
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
        <Metrics metrics={billMetrics} />

        <AccountingTable
          title="Recent Invoices"
          data={transformedBills}
          columns={[
            {
              key: 'vendor',
              label: 'Vendor',
              render: (value, item) => (
                <div className="flex items-center gap-3">
                  <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white">
                    {item.vendorInitials}
                  </div>
                  <span>{value}</span>
                </div>
              ),
            },
            { key: 'billNumber', label: 'Bill#' },
            { key: 'source', label: 'Source' },
            { key: 'billDate', label: 'Bill Date' },
            { key: 'category', label: 'Category' },
            { key: 'dueDate', label: 'Due Date' },
            { key: 'billAmount', label: 'Amount' },
            { key: 'status', label: 'Status' },
          ]}
          searchFields={['vendor', 'source', 'category', 'billNumber']}
          searchPlaceholder="Search vendor or invoice......"
          selectedItems={selectedItems}
          handleSelectAll={handleSelectAll}
          handleSelectItem={handleSelectItem}
          onRowAction={handleRowAction}
          statusStyles={{
            Pending: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
            Paid: 'bg-green-100 text-green-800 hover:bg-green-100',
            Overdue: 'bg-red-100 text-red-800 hover:bg-red-100',
          }}
          dropdownActions={[
            { key: 'view', label: 'View Details' },
            { key: 'edit', label: 'Edit' },
            { key: 'pay', label: 'Mark as Paid' },
            { key: 'delete', label: 'Delete' },
          ]}
          paginationData={{
            page: paginationData.page,
            totalPages: paginationData.totalPages,
            pageSize: paginationData.limit,
            totalCount: paginationData.totalDocs,
          }}
          onPageChange={setCurrentPage}
        />
      </div>

      <AddBillForm
        open={openAddBill}
        onOpenChange={(open) => {
          setOpenAddBill(open);
          if (!open) setEditData({});
        }}
        onSuccess={() => {
          setOpenSuccessModal(true);
          fetchBills();
        }}
        initialData={editData}
      />

      <SuccessModal
        open={openSuccessModal}
        onOpenChange={setOpenSuccessModal}
        backText={'Back'}
        title={editData?.billNo ? 'Bill Updated' : 'Bill Added'}
        description={
          editData?.billNo
            ? "You've successfully updated the bill."
            : "You've successfully added a bill."
        }
      />

      <ViewBills
        open={openViewBill}
        onOpenChange={setOpenViewBill}
        onEdit={handleEditFromView}
        billData={
          viewData
            ? {
                id: viewData.bill._id || viewData.bill.id,
                billNumber: viewData.bill.billNo,
                vendor:
                  `${viewData.vendor?.firstName || ''} ${viewData.vendor?.lastName || ''}`.trim(),
                amount: `$${Number(viewData.bill.billAmount).toLocaleString('en-US')}`,
                dueDate: viewData.bill.dueDate
                  ? format(new Date(viewData.bill.dueDate), 'PP')
                  : 'N/A',
                status: 'Pending',
                invoiceReference: 'N/A',
                paymentMethod: 'N/A',
                attachment: viewData.bill.attachment || '',
                billDate: viewData.bill.billDate
                  ? format(new Date(viewData.bill.billDate), 'PP')
                  : 'N/A',
                source: viewData.bill.source,
                category:
                  viewData.bill.category?.charAt(0).toUpperCase() +
                    viewData.bill.category?.slice(1) || 'N/A',
              }
            : undefined
        }
      />
    </div>
  );
}
