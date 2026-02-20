import { useMemo, useState } from 'react';
import AccountingTable from '@/components/dashboard/accounting/table';
import Metrics from '@/components/dashboard/accounting/invoicing/plain-metrics';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DownloadIcon, HousePlus, PlusCircleIcon, SettingsIcon } from 'lucide-react';
import EmptyAsset from '@/components/dashboard/accounting/fixed-asset-management/overview/empty-state';
import UpcomingMaintenance from '@/components/dashboard/accounting/fixed-asset-management/overview/upcoming-maintenance';
import AssetCategories from '@/components/dashboard/accounting/fixed-asset-management/overview/asset-categories';
import PieMetricCard from '@/components/dashboard/pie-metric-card';
import AssetCard from '@/components/dashboard/accounting/fixed-asset-management/overview/asset-card';
import AssetForm from '@/components/dashboard/accounting/fixed-asset-management/assets/asset-form';
import { AppDialog } from '@/components/core/app-dialog';
import BarChartOverview from '@/components/dashboard/bar-metric-card';

// Mock data
const sampleData = [
  {
    id: 'Q1 2024 Revenue Budget',
    name: 'Marketing Budget',
    type: 'Profit and loss',
    date: 'Mar 2025-Feb2025',
    lastModifiedBy: 'James Doe',
    timeModified: 'Thur 12:23pm',
    budgetAmount: 150000,
    actualAmount: 150000,
    status: 'Active',
    variance: 90,
  },
  {
    id: 'Q2 2024 Revenue Budget',
    name: 'Marketing Budget',
    type: 'Profit and loss',
    date: 'Mar 2025-Feb2025',
    lastModifiedBy: 'James Doe',
    timeModified: 'Thur 12:23pm',
    budgetAmount: 150000,
    actualAmount: 150000,
    status: 'Active',
    variance: 23,
  },
  {
    id: 'Q3 2024 Revenue Budget',
    name: 'Marketing Budget',
    type: 'Profit and loss',
    date: 'Mar 2025-Feb2025',
    lastModifiedBy: 'James Doe',
    timeModified: 'Thur 12:23pm',
    budgetAmount: 150000,
    actualAmount: 150000,
    status: 'Active',
    variance: 51,
  },
  {
    id: 'Q4 2024 Revenue Budget',
    name: 'Marketing Budget',
    type: 'Profit and loss',
    date: 'Mar 2025-Feb2025',
    lastModifiedBy: 'James Doe',
    timeModified: 'Thur 12:23pm',
    budgetAmount: 150000,
    actualAmount: 150000,
    status: 'Active',
    variance: 67,
  }
]

export default function FixedAssetMgtReport() {
  // State for table selection
  const [selectedItems, setSelectedItems] = useState([]);
  const [assets] = useState([...sampleData])

  const pieData = [
    { name: 'Disposed', value: 93, color: '#6366f1' },
    { name: 'Idle', value: 85, color: '#22c55e' },
    { name: 'In Use', value: 53, color: '#f59e0b' },
    { name: 'In Repair', value: 43, color: '#06b6d4' },
  ];

  const pieConfig = {
    Disposed: {
      label: 'Disposed',
      color: '#6366f1',
    },
    'Idle': {
      label: 'Idle',
      color: '#22c55e',
    },
    'In Use': {
      label: 'In Use',
      color: '#f59e0b',
    },
    'In Repair': {
      label: 'In Repair',
      color: '#06b6d4',
    },
  };


  const categoryChartData = [
    {
      day: 'IT Equipment',
      value: 70,
    },
    {
      day: 'Furniture',
      value: 15,
    },
    {
      day: 'Vehicles',
      value: 30,
    },
    {
      day: 'Lands',
      value: 20,
    },
    {      
      day: 'Buildings',
      value: 25,
    },
  ];

  const chartConfig = {
    value: {
      label: 'Amount (thousands)',
      color: '#8B5CF6',
    },
  };

  const assetMetrics = useMemo(() => {
    return [
      {
        title: 'Total Assets',
        value: 2000,
      },
      {
        title: 'Total Investment',
        value: 3000,
      },
      {
        title: 'Current Value',
        value: 23,
      },
      {
        title: 'Depreciation Rate',
        value: 1000,
      },
    ]
  })

  // Handle table item selection
  const handleSelectItem = (itemId, checked) => {
    setSelectedItems((prevItems) => {
      if (checked) {
        return [...prevItems, itemId];
      } else {
        return prevItems.filter((id) => id !== itemId);
      }
    });
  };

  // Handle select all functionality
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(assets.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Table columns configuration
  const tableColumns = [
    {
      key: 'id',
      label: 'No',
    },
    {
      key: 'name',
      label: 'Asset',
      className: 'font-medium',
    },
    {
      key: 'type',
      label: 'Category',
    },
    {
      key: 'date',
      label: 'Department',
    },
    {
      key: 'lastModifiedBy',
      label: 'Value',
    },
    {
      key: 'timeModified',
      label: 'Last Updated',
    },
    {
      key: 'timeModified',
      label: 'Depreciation',
    },
    {
      key: 'timeModified',
      label: 'Status',
    },
  ];

  // Dropdown actions for each row
  const dropdownActions = [
    { key: 'run-budget', label: 'Run Budget vs. Actuals report' },
    { key: 'run-overview', label: 'Run Budget Overview report' },
    { key: 'archive', label: 'Archive' },
    { key: 'duplicate', label: 'Duplicate' },
    { key: 'delete', label: 'Delete' },
  ];

  // Pagination data
  const paginationData = {
    page: 1,
    totalPages: 6,
    pageSize: 12,
    totalCount: 64,
  };

  const handleRowAction = (action, item) => {
    console.log(`Action ${action} on item:`, item);

    // Implement row action logic here
    switch (action) {
      case 'view':
        break;
    }
  };

  return (
    <div className='my-4 min-h-screen'>
    <div className={cn(!assets.length && 'hidden')}>
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-sm text-[#7D7D7D]">
            Generate reports on asset performance and cost trends
          </p>
        </hgroup>

        <div className="flex space-x-4">
          <Button
            className={'h-10 rounded-2xl text-sm'}
            variant="outline"
          >
            Date Range
          </Button>
          <Button size={'icon'} className={'size-10'} variant={'outline'}>
            <DownloadIcon size={16} />
          </Button>
          <Button size={'icon'} className={'size-10'} variant={'outline'}>
            <SettingsIcon size={16} />
          </Button>
        </div>
      </div>

      <div className="mt-10">
        <Metrics metrics={assetMetrics} />
      </div>
    </div>
      <>
        <div className='grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-3 gap-4 mt-10'>
          <div className='col-span-2'>
            <BarChartOverview
              title="Assets by Category"
              description="Current asset value across categories"
              chartData={categoryChartData}
              chartConfig={chartConfig}
            />
          </div>
            <BarChartOverview
              title="Depreciation by Category"
              description="Accumulated depreciation across categories"
              chartData={categoryChartData}
              chartConfig={chartConfig}
            />
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-3 gap-4 mt-10'>
          <div className='col-span-2'>
            <BarChartOverview
              title="Value by Category"
              description="Current asset value across categories"
              chartData={categoryChartData}
              chartConfig={chartConfig}
            />
          </div>
          <PieMetricCard
              title="Assets By Status"
              chartData={pieData}
              chartConfig={pieConfig}
              className="w-full h-full"
            />
        </div>

        <div className="relative mt-10">
          <AccountingTable
            title="Recent Assets"
            data={assets}
            columns={tableColumns}
            searchFields={[]}
            searchPlaceholder="Search......"
            dropdownActions={dropdownActions}
            paginationData={paginationData}
            selectedItems={selectedItems}
            handleSelectItem={handleSelectItem}
            handleSelectAll={handleSelectAll}
            onRowAction={handleRowAction}
            isProductTable
            showDataSize
            itemComponent={AssetCard}
          />
        </div>
      </>
    </div>
  );
}
