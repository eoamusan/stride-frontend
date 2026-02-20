import Metrics from '../invoicing/plain-metrics';
import AreaMetricCard from '@/components/dashboard/area-metric-card';
import PieMetricCard from '@/components/dashboard/pie-metric-card';

export default function CompanyOverview({
  data,
  expenseData,
  invoiceGraphData,
  expenseGraphData,
}) {
  const metrics = [
    { title: 'Total Revenue', value: data?.totalRevenue || '0', symbol: '$' },
    { title: 'Total Expenses', value: data?.totalExpenses || '0', symbol: '$' },
    { title: 'Net Profit', value: data?.netProfit || '0', symbol: '$' },
    { title: 'Outstanding AR', value: data?.outstandingAr || '0', symbol: '$' },
    { title: 'Outstanding AP', value: data?.outstandingAp || '0', symbol: '$' },
    { title: 'Cash Balance', value: data?.cashBalance || '0', symbol: '$' },
  ];

  // Process invoice and expense graph data for revenue & expenses chart
  const processRevenueExpensesData = () => {
    if (!invoiceGraphData?.graph?.labels && !expenseGraphData?.graph?.labels) {
      return [];
    }

    // Combine labels from both datasets
    const invoiceLabels = invoiceGraphData?.graph?.labels || [];
    const expenseLabels = expenseGraphData?.graph?.labels || [];
    const allLabels = [...new Set([...invoiceLabels, ...expenseLabels])].sort();

    // Get data arrays
    const invoiceData = invoiceGraphData?.graph?.datasets?.[0]?.data || [];
    const expenseData = expenseGraphData?.graph?.datasets?.[0]?.data || [];

    // Create chart data
    return allLabels.map((label) => {
      // For invoice data, use the corresponding index from invoiceLabels
      const invoiceIndex = invoiceLabels.indexOf(label);
      const revenue = invoiceIndex !== -1 ? invoiceData[invoiceIndex] || 0 : 0;

      // For expense data, use the corresponding index from expenseLabels
      const expenseIndex = expenseLabels.indexOf(label);
      const expenses = expenseIndex !== -1 ? expenseData[expenseIndex] || 0 : 0;

      return {
        date: label,
        revenue,
        expenses,
      };
    });
  };

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

  const revenueExpensesData = processRevenueExpensesData();

  const chartConfig = {
    revenue: {
      label: 'Revenue',
      color: '#6B8AFF',
    },
    expenses: {
      label: 'Expenses',
      color: '#4ADE80',
    },
  };

  const expenseDistributionData = processExpenseDistribution();
  const expenseChartConfig = processExpenseChartConfig(expenseDistributionData);

  return (
    <div className="my-10">
      <div>
        <Metrics metrics={metrics} />
      </div>
      <div className="mt-10 flex flex-col gap-10 md:flex-row">
        <AreaMetricCard
          title="Revenue & Expenses"
          chartData={revenueExpensesData}
          chartConfig={chartConfig}
          className="w-3/5"
        />
        <PieMetricCard
          title="Expense Distribution"
          chartData={expenseDistributionData}
          chartConfig={expenseChartConfig}
          className="w-2/5"
        />
      </div>
    </div>
  );
}
