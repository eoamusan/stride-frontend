import Metrics from '../invoicing/plain-metrics';
import BarChartOverview from '@/components/dashboard/bar-metric-card';
import AccountingTable from '@/components/dashboard/accounting/table';
import { useState } from 'react';

export default function Reconciliation() {
  const [selectedItems, setSelectedItems] = useState([]);

  const metrics = [
    { title: 'Total Cash', value: '200,000', symbol: '$' },
    { title: 'Reconciled', value: '45/42', symbol: '' },
    { title: 'Pending Items', value: '8', symbol: '' },
    { title: 'Discrepancies', value: '0', symbol: '' },
  ];

  // Cash Flow Analysis Chart Data (Inflow and Outflow)
  const cashFlowAnalysisData = [
    { day: 'Jan', value1: 45, value2: 30 },
    { day: 'Feb', value1: 90, value2: 28 },
    { day: 'Mar', value1: 85, value2: 100 },
    { day: 'Apr', value1: 20, value2: 12 },
    { day: 'May', value1: 45, value2: 48 },
    { day: 'Jun', value1: 92, value2: 40 },
  ];

  const cashFlowAnalysisConfig = {
    value1: {
      label: 'Inflow',
      color: '#4ADE80',
    },
    value2: {
      label: 'Outflow',
      color: '#8B5CF6',
    },
  };

  // Net Cash Flow Trend Chart Data
  const netCashFlowData = [
    { day: 'Jan', value: 30 },
    { day: 'Feb', value: 28 },
    { day: 'Mar', value: 100 },
    { day: 'Apr', value: 12 },
    { day: 'May', value: 46 },
    { day: 'Jun', value: 40 },
  ];

  const netCashFlowConfig = {
    value: {
      label: 'Net Cash Flow',
      color: '#8B5CF6',
    },
  };

  // Reconciliation Summary Table Data
  const reconciliationData = [
    {
      id: 1,
      account: '153543 Payroll Kudu Bank',
      type: 'Bank',
      statementEndingDate: 'Jan 2 2025',
      reconciledOn: 'Jan 2 2025',
      status: 'Success',
    },
    {
      id: 2,
      account: '153543 Payroll Kudu Bank',
      type: 'Bank',
      statementEndingDate: 'Jan 2 2025',
      reconciledOn: 'Jan 2 2025',
      status: 'Pending',
    },
    {
      id: 3,
      account: '153543 Payroll Kudu Bank',
      type: 'Bank',
      statementEndingDate: 'Jan 2 2025',
      reconciledOn: 'Jan 2 2025',
      status: 'Success',
    },
    {
      id: 4,
      account: '153543 Payroll Kudu Bank',
      type: 'Bank',
      statementEndingDate: 'Jan 2 2025',
      reconciledOn: 'Jan 2 2025',
      status: 'Success',
    },
    {
      id: 5,
      account: '247891 Corporate Savings',
      type: 'Bank',
      statementEndingDate: 'Jan 5 2025',
      reconciledOn: 'Jan 5 2025',
      status: 'Success',
    },
    {
      id: 6,
      account: '892345 Petty Cash Account',
      type: 'Cash',
      statementEndingDate: 'Jan 8 2025',
      reconciledOn: 'Jan 8 2025',
      status: 'Pending',
    },
  ];

  const tableColumns = [
    {
      key: 'account',
      label: 'Account',
      className: 'font-medium',
    },
    {
      key: 'type',
      label: 'Type',
    },
    {
      key: 'statementEndingDate',
      label: 'Statement Ending Date',
    },
    {
      key: 'reconciledOn',
      label: 'Reconciled On',
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
      setSelectedItems(reconciliationData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const dropdownActions = [
    { key: 'view', label: 'View Details' },
    { key: 'edit', label: 'Edit' },
    { key: 'delete', label: 'Delete' },
  ];

  const handleRowAction = (action, item) => {
    console.log(`Action ${action} on reconciliation:`, item);
  };

  const paginationData = {
    page: 1,
    totalPages: 10,
    pageSize: 6,
    totalCount: 60,
  };

  return (
    <div className="my-10">
      <div>
        <Metrics metrics={metrics} />
      </div>
      <div className="mt-10 flex flex-col gap-10 md:flex-row">
        <BarChartOverview
          title="Cash Flow Analysis"
          chartConfig={cashFlowAnalysisConfig}
          chartData={cashFlowAnalysisData}
          numberOfBars={2}
          showLegend={true}
          className="w-full md:w-1/2"
        />
        <BarChartOverview
          title="Net Cash Flow Trend"
          chartConfig={netCashFlowConfig}
          chartData={netCashFlowData}
          numberOfBars={1}
          showLegend={true}
          className="w-full md:w-1/2"
        />
      </div>
      <div className="mt-10">
        <AccountingTable
          title="Reconciliation summary"
          data={reconciliationData}
          columns={tableColumns}
          searchFields={['account', 'type', 'status']}
          searchPlaceholder="Search......."
          statusStyles={{
            Success: 'bg-green-100 text-green-800 hover:bg-green-100',
            Pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
            Failed: 'bg-red-100 text-red-800 hover:bg-red-100',
          }}
          dropdownActions={dropdownActions}
          paginationData={paginationData}
          selectedItems={selectedItems}
          handleSelectItem={handleSelectItem}
          handleSelectAll={handleSelectAll}
          onRowAction={handleRowAction}
          showDataSize={false}
        />
      </div>
    </div>
  );
}
