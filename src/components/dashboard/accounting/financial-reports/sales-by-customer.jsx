import Metrics from '../invoicing/plain-metrics';
import BarChartOverview from '@/components/dashboard/bar-metric-card';
import SimpleAreaMetricCard from '@/components/dashboard/simple-area-metric-card';
import AccountingTable from '@/components/dashboard/accounting/table';
import { useState } from 'react';

export default function SalesByCustomer({ data }) {
  const [selectedItems, setSelectedItems] = useState([]);

  const metrics = [
    { title: 'Total Invoice', value: data?.totalInvoice || '0', symbol: '$' },
    { title: 'Paid Invoices', value: data?.paidInvoices || '0', symbol: '$' },
    {
      title: 'Pending Payment',
      value: data?.pendingPayment || '0',
      symbol: '$',
    },
    { title: 'Overdue', value: data?.overDue || '0', symbol: '$' },
  ];

  const invoiceStatusData = [
    { day: 'Jan', value1: 36000, value2: 60000, value3: 68000 },
    { day: 'Feb', value1: 12000, value2: 10000, value3: 85000 },
    { day: 'Mar', value1: 57000, value2: 60000, value3: 58000 },
    { day: 'Apr', value1: 10000, value2: 11000, value3: 62000 },
    { day: 'May', value1: 30000, value2: 45000, value3: 36000 },
    { day: 'Jun', value1: 95000, value2: 68000, value3: 21000 },
    { day: 'Jul', value1: 13000, value2: 18000, value3: 88000 },
    { day: 'Aug', value1: 38000, value2: 95000, value3: 44000 },
    { day: 'Sept', value1: 45000, value2: 14000, value3: 90000 },
    { day: 'Oct', value1: 80000, value2: 90000, value3: 28000 },
  ];

  const invoiceStatusConfig = {
    value1: {
      label: 'Issued',
      color: '#6B8AFF',
    },
    value2: {
      label: 'Paid',
      color: '#4ADE80',
    },
    value3: {
      label: 'Overdue',
      color: '#FF4C4C',
    },
  };

  const revenueTrendData = [
    { date: '2025-01-01', value: 57000 },
    { date: '2025-02-01', value: 65000 },
    { date: '2025-03-01', value: 78000 },
    { date: '2025-04-01', value: 80000 },
    { date: '2025-05-01', value: 71000 },
    { date: '2025-06-01', value: 40000 },
  ];

  const revenueTrendConfig = [
    {
      dataKey: 'value',
      label: 'Revenue',
      color: '#6B8AFF',
    },
  ];

  const invoiceData = [
    {
      id: 1,
      invoiceNumber: 'INV-1001',
      customer: 'ABC Corporation',
      currency: 'NGN',
      amount: 15400.0,
      createdBy: 'Adeoye Yemi',
      issueDate: '$15,400.00',
      dueDate: 'Jul 20, 2024',
      status: 'Overdue',
    },
    {
      id: 2,
      invoiceNumber: 'INV-1001',
      customer: 'ABC Corporation',
      currency: 'USD',
      amount: 15400.0,
      createdBy: 'James Adeniyi',
      issueDate: '$15,400.00',
      dueDate: 'Jul 20, 2024',
      status: 'Pending',
    },
    {
      id: 3,
      invoiceNumber: 'INV-1001',
      customer: 'ABC Corporation',
      currency: 'USD',
      amount: 15400.0,
      createdBy: 'Adeoye Yemi',
      issueDate: '$15,400.00',
      dueDate: 'Jul 20, 2024',
      status: 'Paid',
    },
    {
      id: 4,
      invoiceNumber: 'INV-1001',
      customer: 'ABC Corporation',
      currency: 'EUR',
      amount: 15400.0,
      createdBy: 'Adeoye Yemi',
      issueDate: '$15,400.00',
      dueDate: 'Jul 20, 2024',
      status: 'Overdue',
    },
    {
      id: 5,
      invoiceNumber: 'INV-1001',
      customer: 'ABC Corporation',
      currency: 'EUR',
      amount: 15400.0,
      createdBy: 'Adeoye Yemi',
      issueDate: '$15,400.00',
      dueDate: 'Jul 20, 2024',
      status: 'Partial',
    },
  ];

  const tableColumns = [
    {
      key: 'invoiceNumber',
      label: 'Invoice #',
      className: 'font-medium',
    },
    {
      key: 'customer',
      label: 'Customer',
    },
    {
      key: 'currency',
      label: 'Currency',
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      key: 'createdBy',
      label: 'Created by',
    },
    {
      key: 'issueDate',
      label: 'Issue Date',
    },
    {
      key: 'dueDate',
      label: 'Due Date',
    },
    {
      key: 'status',
      label: 'Status',
    },
  ];

  const handleSelectItem = (itemId, checked) => {
    setSelectedItems((prevItems) => {
      if (checked) {
        return [...prevItems, itemId];
      } else {
        return prevItems.filter((id) => id !== itemId);
      }
    });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(invoiceData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const dropdownActions = [
    { key: 'view', label: 'View' },
    { key: 'edit', label: 'Edit' },
    { key: 'delete', label: 'Delete' },
  ];

  const handleRowAction = (action, item) => {
    console.log(`Action ${action} on item:`, item);
  };

  const paginationData = {
    page: 1,
    totalPages: 10,
    pageSize: 5,
    totalCount: 50,
  };

  return (
    <div className="my-10">
      <div>
        <Metrics metrics={metrics} />
      </div>
      <div className="mt-10 flex flex-col gap-10 md:flex-row">
        <BarChartOverview
          title="Invoice Status by Month"
          chartConfig={invoiceStatusConfig}
          chartData={invoiceStatusData}
          numberOfBars={3}
          showLegend={true}
          className="w-full md:w-3/5"
        />
        <SimpleAreaMetricCard
          title="Revenue Trend"
          chartConfig={revenueTrendConfig}
          chartData={revenueTrendData}
          className="h-full w-full md:w-2/5"
        />
      </div>
      <div className="mt-10">
        <AccountingTable
          title="Invoice Management"
          data={invoiceData}
          columns={tableColumns}
          searchFields={['invoiceNumber', 'customer', 'currency']}
          searchPlaceholder="Search invoices......."
          statusStyles={{
            Overdue: 'bg-red-100 text-red-800 hover:bg-red-100',
            Pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
            Paid: 'bg-green-100 text-green-800 hover:bg-green-100',
            Partial: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
          }}
          dropdownActions={dropdownActions}
          paginationData={paginationData}
          selectedItems={selectedItems}
          handleSelectItem={handleSelectItem}
          handleSelectAll={handleSelectAll}
          onRowAction={handleRowAction}
          showDataSize
        />
      </div>
    </div>
  );
}
