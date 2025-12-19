import Metrics from '../invoicing/plain-metrics';
import BarChartOverview from '@/components/dashboard/bar-metric-card';
import SimpleAreaMetricCard from '@/components/dashboard/simple-area-metric-card';
import AccountingTable from '@/components/dashboard/accounting/table';
import { useState } from 'react';

export default function SalesByCustomer({ data, invoiceData }) {
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

  // Process invoice status by month for bar chart
  const processInvoiceStatusData = () => {
    if (!invoiceData?.invoices) {
      return [];
    }

    const monthlyData = {};
    invoiceData.invoices.forEach((invoice) => {
      const date = new Date(invoice.invoiceDate);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          day: monthKey,
          value1: 0,
          value2: 0,
          value3: 0,
        };
      }

      const total = parseFloat(invoice.product?.total || 0);
      // value1: Total issued
      monthlyData[monthKey].value1 += total;
      // value2: Paid
      if (invoice.status === 'PAID') {
        monthlyData[monthKey].value2 += total;
      }
      // value3: Overdue
      if (invoice.status === 'OVERDUE') {
        monthlyData[monthKey].value3 += total;
      }
    });

    return Object.values(monthlyData);
  };

  const invoiceStatusData = processInvoiceStatusData();

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

  // Process revenue trend data
  const processRevenueTrendData = () => {
    if (!invoiceData?.invoices) {
      return [];
    }

    const monthlyRevenue = {};
    invoiceData.invoices.forEach((invoice) => {
      const date = new Date(invoice.invoiceDate);
      const monthKey = date.toISOString().substring(0, 7); // YYYY-MM format
      const firstDay = `${monthKey}-01`;

      if (!monthlyRevenue[firstDay]) {
        monthlyRevenue[firstDay] = 0;
      }

      // Only count paid invoices for revenue
      if (invoice.status === 'PAID') {
        monthlyRevenue[firstDay] += parseFloat(invoice.product?.total || 0);
      }
    });

    return Object.entries(monthlyRevenue)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, value]) => ({ date, value }));
  };

  const revenueTrendData = processRevenueTrendData();

  const revenueTrendConfig = [
    {
      dataKey: 'value',
      label: 'Revenue',
      color: '#6B8AFF',
    },
  ];

  // Process invoice data for table
  const processTableData = () => {
    if (!invoiceData?.invoices) {
      return [];
    }

    return invoiceData.invoices.map((invoice) => ({
      id: invoice._id,
      invoiceNumber: invoice.invoiceNo,
      customer:
        invoice.customerId?.displayName ||
        `${invoice.customerId?.firstName} ${invoice.customerId?.lastName}`,
      currency: invoice.currency,
      amount: parseFloat(invoice.product?.total || 0),
      createdBy: invoice.accountId || 'N/A',
      issueDate: new Date(invoice.invoiceDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      dueDate: new Date(invoice.dueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      status: invoice.status.charAt(0) + invoice.status.slice(1).toLowerCase(),
    }));
  };

  const tableData = processTableData();

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
    page: invoiceData?.page || 1,
    totalPages: invoiceData?.totalPages || 1,
    pageSize: invoiceData?.limit || 100,
    totalCount: invoiceData?.totalDocs || 0,
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
          data={tableData}
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
