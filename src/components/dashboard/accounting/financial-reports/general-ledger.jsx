import Metrics from '../invoicing/plain-metrics';
import BarChartOverview from '@/components/dashboard/bar-metric-card';
import AccountingTable from '@/components/dashboard/accounting/table';
import { useState } from 'react';

export default function GeneralLedger() {
  const [selectedItems, setSelectedItems] = useState([]);

  const metrics = [
    { title: 'Total Assets', value: '264', symbol: '$' },
    { title: 'Total Liabilities', value: '164', symbol: '$' },
    { title: 'Total Equity', value: '30', symbol: '$' },
    { title: 'Net Income', value: '30', symbol: '$' },
  ];

  const accountBalancesData = [
    { day: 'Assets', value: 68000 },
    { day: 'Liabilities', value: 18000 },
    { day: 'Income', value: 33000 },
    { day: 'Revenue', value: 33000 },
    { day: 'Expenses', value: 33000 },
  ];

  const accountBalancesConfig = {
    value: {
      label: 'Balance',
      color: '#6B8AFF',
    },
  };

  const accountSummaryData = [
    {
      id: 1,
      account: 'Assets',
      debit: 100000.0,
      credit: '-',
      balance: 100000.0,
    },
    {
      id: 2,
      account: 'Liabilities',
      debit: 203000.0,
      credit: '-',
      balance: 120000.0,
    },
    {
      id: 3,
      account: 'Income',
      debit: '-',
      credit: 100000.0,
      balance: 100000.0,
    },
    {
      id: 4,
      account: 'Revenue',
      debit: 100000.0,
      credit: '-',
      balance: 100000.0,
    },
    {
      id: 5,
      account: 'Expenses',
      debit: 100000.0,
      credit: '-',
      balance: 100000.0,
    },
  ];

  const tableColumns = [
    {
      key: 'account',
      label: 'Account',
      className: 'font-medium',
    },
    {
      key: 'debit',
      label: 'Debit',
      render: (value) => (value === '-' ? '-' : `$${value.toLocaleString()}`),
    },
    {
      key: 'credit',
      label: 'Credit',
      render: (value) => (value === '-' ? '-' : `$${value.toLocaleString()}`),
    },
    {
      key: 'balance',
      label: 'Balance',
      render: (value) => `$${value.toLocaleString()}`,
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
      setSelectedItems(accountSummaryData.map((item) => item.id));
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
    totalPages: 1,
    pageSize: 5,
    totalCount: 5,
  };

  return (
    <div className="my-10">
      <div>
        <Metrics metrics={metrics} />
      </div>
      <div className="mt-10">
        <BarChartOverview
          title="Account Category Balances"
          chartConfig={accountBalancesConfig}
          chartData={accountBalancesData}
          numberOfBars={1}
          showLegend={false}
          className="w-full lg:max-w-2/3"
        />
      </div>
      <div className="mt-10">
        <AccountingTable
          title="Account Category Summary"
          data={accountSummaryData}
          columns={tableColumns}
          searchFields={['account']}
          searchPlaceholder="Search......."
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
