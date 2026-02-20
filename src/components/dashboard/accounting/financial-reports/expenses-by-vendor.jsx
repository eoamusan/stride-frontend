import Metrics from '../invoicing/plain-metrics';
import BarChartOverview from '@/components/dashboard/bar-metric-card';
import PieMetricCard from '@/components/dashboard/pie-metric-card';
import AccountingTable from '@/components/dashboard/accounting/table';
import { useState } from 'react';

export default function ExpensesByVendor({ data, expenseData }) {
  const [selectedItems, setSelectedItems] = useState([]);

  const metrics = [
    { title: 'Total Expenses', value: data?.totalExpenses || '0', symbol: '$' },
    { title: 'Avg Monthly', value: data?.avgMonthly || '0', symbol: '$' },
    { title: 'Pending Claims', value: data?.pendingClaims || '0', symbol: '$' },
    { title: 'Employees', value: data?.employees || '0', symbol: '' },
  ];

  // Process expense data for pie chart
  const processExpenseDistribution = () => {
    if (!expenseData?.expenses || expenseData.expenses.length === 0) {
      return [];
    }

    // Group expenses by account name and sum totals
    const expensesByAccount = {};
    expenseData.expenses.forEach((expense) => {
      const accountName = expense.accountingAccountId?.accountName || 'Other';
      if (!expensesByAccount[accountName]) {
        expensesByAccount[accountName] = 0;
      }
      expensesByAccount[accountName] += expense.total || 0;
    });

    // Convert to array format for pie chart
    const colors = [
      '#6B8AFF',
      '#4ADE80',
      '#FB923C',
      '#22D3EE',
      '#A78BFA',
      '#F472B6',
    ];
    return Object.entries(expensesByAccount).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));
  };

  const processExpenseChartConfig = (distributionData) => {
    const config = {};
    distributionData.forEach((item) => {
      config[item.name] = {
        label: item.name,
        color: item.color,
      };
    });
    return config;
  };

  // Process expense vs budget data for bar chart
  const processExpensesBudgetData = () => {
    if (!expenseData?.expenses || expenseData.expenses.length === 0) {
      return [];
    }

    const monthlyData = {};
    expenseData.expenses.forEach((expense) => {
      const date = new Date(expense.paymentDate);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { day: monthKey, value1: 0, value2: 0 };
      }

      const total = parseFloat(expense.total || 0);
      monthlyData[monthKey].value1 += total; // Expenses
      // value2 is budget, set to 0 for now
    });

    return Object.values(monthlyData);
  };

  const expensesBudgetData = processExpensesBudgetData();

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

  const expenseDistributionData = processExpenseDistribution();
  const expenseDistributionConfig = processExpenseChartConfig(
    expenseDistributionData
  );

  // Process expense data for table
  const processTableData = () => {
    if (!expenseData?.expenses) {
      return [];
    }

    return expenseData.expenses.map((expense, index) => ({
      id: expense._id,
      no: expense.refNo || `${index + 1}`.padStart(4, '0'),
      date: new Date(expense.paymentDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }),
      type: 'Expenses',
      payer: expense.vendorId
        ? `${expense.vendorId.firstName} ${expense.vendorId.lastName}`
        : 'N/A',
      category: expense.accountingAccountId?.accountName || 'N/A',
      total: parseFloat(expense.total || 0),
    }));
  };

  const expenseTransactionData = processTableData();

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
      const tableData = processTableData();
      setSelectedItems(tableData.map((item) => item.id));
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
    page: expenseData?.page || 1,
    totalPages: expenseData?.totalPages || 1,
    pageSize: expenseData?.limit || 20,
    totalCount: expenseData?.totalDocs || 0,
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
