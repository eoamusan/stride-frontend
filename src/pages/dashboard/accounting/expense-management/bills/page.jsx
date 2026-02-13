import AddBillForm from '@/components/dashboard/accounting/expense-mgmt/bills/add-bill-form';
import ViewBills from '@/components/dashboard/accounting/expense-mgmt/bills/view-bills';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import SuccessModal from '@/components/dashboard/accounting/success-modal';
import AccountingTable from '@/components/dashboard/accounting/table';
import { Button } from '@/components/ui/button';
import { DownloadIcon, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import BillService from '@/api/bills';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export default function Bills() {
  const [openAddBill, setOpenAddBill] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openViewBill, setOpenViewBill] = useState(false);
  const [editData, setEditData] = useState({});
  const [viewData, setViewData] = useState(null);
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationData, setPaginationData] = useState({
    page: 1,
    totalPages: 1,
    totalDocs: 0,
    limit: 10,
  });

  // Fetch bills
  const fetchBills = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await BillService.fetch({ page: currentPage, perPage: 20 });
      const billsData = res.data?.data?.bills || [];
      setBills(billsData);
      setPaginationData({
        page: res.data?.data?.page || 1,
        totalPages: res.data?.data?.totalPages || 1,
        totalDocs: res.data?.data?.totalDocs || 0,
        limit: res.data?.data?.limit || 20,
      });
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchBills();
  }, [currentPage, fetchBills, openSuccessModal]);

  // Transform bills data for table
  const transformedBills = useMemo(() => {
    return bills.map((item) => {
      const bill = item;
      const vendor = item.vendorId;
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
      return sum + Number(item?.billAmount || 0);
    }, 0);

    const pendingBills = bills.filter(
      (bill) => bill.status === 'PENDING'
    ).length;
    const overdueBills = bills.filter(
      (bill) => bill.status === 'PAST_DUE'
    ).length;

    return [
      {
        title: 'Total Bills',
        value: totalBills,
      },
      {
        title: 'Pending',
        value: pendingBills,
      },
      {
        title: 'Overdue',
        value: overdueBills,
      },
      {
        title: 'Total Spent',
        value: totalSpent,
        symbol: '$',
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
        const fullBillData = bills.find((b) => (b._id || b.id) === item.id);
        setViewData(fullBillData);
        setOpenViewBill(true);
        break;
      }
      case 'edit': {
        // Find the full bill data from bills array for editing
        const fullBillData = bills.find((b) => (b._id || b.id) === item.id);
        if (fullBillData) {
          setEditData({
            billId: fullBillData._id || fullBillData.id,
            vendorId: fullBillData.vendorId?._id || fullBillData.vendorId?.id,
            source: fullBillData.source,
            billDate: fullBillData.billDate,
            billNo: fullBillData.billNo,
            dueDate: fullBillData.dueDate,
            category: fullBillData.category,
            billAmount: fullBillData.billAmount,
            attachment: fullBillData.attachment || '',
          });
        }
        setOpenAddBill(true);
        break;
      }
      case 'pay':
        handleMarkAsPaid(item);
        break;
    }
  };

  // Handle edit from ViewBills modal
  const handleEditFromView = () => {
    if (viewData) {
      setEditData({
        billId: viewData._id || viewData.id,
        vendorId: viewData.vendorId?._id || viewData.vendorId?.id,
        source: viewData.source,
        billDate: viewData.billDate,
        billNo: viewData.billNo,
        dueDate: viewData.dueDate,
        category: viewData.category,
        billAmount: viewData.billAmount,
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
      // Refresh bills list
      const res = await BillService.fetch({ page: currentPage, perPage: 10 });
      const billsData = res.data?.data?.bills || [];
      setBills(billsData);
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
          <h1 className="text-2xl font-bold">Bills</h1>
          <p className="text-sm text-[#7D7D7D]">
            Track and manage your bills and payments
          </p>
        </hgroup>

        <div className="flex space-x-4">
          <Button
            onClick={() => {
              setEditData({});
              setOpenAddBill(true);
            }}
            className={'h-10 rounded-2xl text-sm'}
          >
            <PlusCircleIcon className="size-4" />
            Add Bill
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
          title="Recent Bills"
          data={transformedBills}
          columns={[
            {
              key: 'vendor',
              label: 'Vendor',
              render: (value, item) => (
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium">
                    {item.vendorInitials}
                  </div>
                  <span>{value}</span>
                </div>
              ),
            },
            { key: 'billNumber', label: 'Bill#' },
            { key: 'source', label: 'Source' },
            { key: 'billNo', label: 'Bill NO' },
            { key: 'billDate', label: 'Bill Date' },
            { key: 'category', label: 'Category' },
            { key: 'dueDate', label: 'Due date' },
            { key: 'billAmount', label: 'Bill Amount' },
            { key: 'status', label: 'Status' },
          ]}
          searchFields={['vendor', 'source', 'category', 'billNumber']}
          searchPlaceholder="Search bills"
          selectedItems={selectedItems}
          handleSelectAll={handleSelectAll}
          handleSelectItem={handleSelectItem}
          onRowAction={handleRowAction}
          isLoading={isLoading}
          statusStyles={{
            Pending: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
            Paid: 'bg-green-100 text-green-800 hover:bg-green-100',
            Past_due: 'bg-red-100 text-red-800 hover:bg-red-100',
          }}
          dropdownActions={[
            { key: 'view', label: 'View Details' },
            { key: 'edit', label: 'Edit Bill' },
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
          fetchBills(); // Refresh the table
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
                id: viewData._id || viewData.id,
                billNumber: viewData.billNo,
                vendor:
                  `${viewData.vendorId?.firstName || ''} ${viewData.vendorId?.lastName || ''}`.trim(),
                amount: `$${Number(viewData.billAmount).toLocaleString('en-US')}`,
                dueDate: viewData.dueDate
                  ? format(new Date(viewData.dueDate), 'PP')
                  : 'N/A',
                status: 'Pending',
                invoiceReference: 'N/A',
                paymentMethod: 'N/A',
                attachment: viewData.attachment || '',
                billDate: viewData.billDate
                  ? format(new Date(viewData.billDate), 'PP')
                  : 'N/A',
                source: viewData.source,
                category:
                  viewData.category?.charAt(0).toUpperCase() +
                    viewData.category?.slice(1) || 'N/A',
              }
            : undefined
        }
      />
    </div>
  );
}
