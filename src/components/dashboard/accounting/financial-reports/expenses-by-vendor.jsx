import Metrics from '../invoicing/plain-metrics';
import BarChartOverview from '@/components/dashboard/bar-metric-card';
import PieMetricCard from '@/components/dashboard/pie-metric-card';
import AccountingTable from '@/components/dashboard/accounting/table';
import { useState } from 'react';

export default function ExpensesByVendor() {
  const [selectedItems, setSelectedItems] = useState([]);

  const metrics = [
    { title: 'Total Expenses', value: '264', symbol: '$' },
    { title: 'Avg Monthly', value: '164', symbol: '$' },
    { title: 'Pending Claims', value: '30', symbol: '$' },
    { title: 'Employees', value: '26', symbol: '' },
  ];

  const expensesBudgetData = [
    { day: 'Jan', value1: 35000, value2: 60000 },
    { day: 'Feb', value1: 10000, value2: 12000 },
    { day: 'Mar', value1: 55000, value2: 60000 },
    { day: 'Apr', value1: 10000, value2: 12000 },
    { day: 'May', value1: 28000, value2: 45000 },
    { day: 'Jun', value1: 93000, value2: 68000 },
    { day: 'Jul', value1: 15000, value2: 18000 },
    { day: 'Aug', value1: 98000, value2: 38000 },
    { day: 'Sept', value1: 45000, value2: 14000 },
    { day: 'Oct', value1: 78000, value2: 88000 },
  ];

  const expensesBudgetConfig = {
    value1: {
      label: 'Expenses',
      color: '#6B8AFF',
    },
    value2: {
      label: 'Budget',
      color: '#4ADE80',
    },
  };

  const expenseDistributionData = [
    { name: 'Bills & utilities', value: 100, color: '#6B8AFF' },
    { name: 'Entertainment', value: 62, color: '#4ADE80' },
    { name: 'Food & Drinking', value: 50, color: '#FB923C' },
    { name: 'Shopping', value: 28, color: '#22D3EE' },
  ];

  const expenseDistributionConfig = {
    'Bills & utilities': {
      label: 'Bills & utilities',
      color: '#6B8AFF',
    },
    Entertainment: {
      label: 'Entertainment',
      color: '#4ADE80',
    },
    'Food & Drinking': {
      label: 'Food & Drinking',
      color: '#FB923C',
    },
    Shopping: {
      label: 'Shopping',
      color: '#22D3EE',
    },
  };

  const expenseTransactionData = [
    {
      id: 1,
      no: '0001',
      date: '1/10/2024',
      type: 'Expenses',
      payer: 'James Doe',
      category: 'Bank charges',
      total: 15400.0,
    },
    {
      id: 2,
      no: '0001',
      date: '1/10/2024',
      type: 'Expenses',
      payer: 'James Doe',
      category: 'Bank charges',
      total: 15400.0,
    },
  ];

  const tableColumns = [
    {
      key: 'no',
      label: 'No',
      className: 'font-medium',
    },
    {
      key: 'date',
      label: 'Date',
    },
    {
      key: 'type',
      label: 'Type',
    },
    {
      key: 'payer',
      label: 'Payer',
    },
    {
      key: 'category',
      label: 'Category',
    },
    {
      key: 'total',
      label: 'Total',
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
      setSelectedItems(expenseTransactionData.map((item) => item.id));
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
    pageSize: 2,
    totalCount: 20,
  };

  return (
    <div className="my-10">
      <div>
        <Metrics metrics={metrics} />
      </div>
      <div className="mt-10 flex flex-col gap-10 md:flex-row">
        <BarChartOverview
          title="Expenses vs Budget"
          chartConfig={expensesBudgetConfig}
          chartData={expensesBudgetData}
          numberOfBars={2}
          showLegend={true}
          className="w-full md:w-3/5"
        />
        <PieMetricCard
          title="Expense Distribution"
          chartData={expenseDistributionData}
          chartConfig={expenseDistributionConfig}
          className="w-full md:w-2/5"
        />
      </div>
      <div className="mt-10">
        <AccountingTable
          title="Expenses Transaction"
          data={expenseTransactionData}
          columns={tableColumns}
          searchFields={['no', 'payer', 'category']}
          searchPlaceholder="Search amount or category ......"
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
