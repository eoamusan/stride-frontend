import { useState } from 'react';
import { Button } from '@/components/ui/button';
import MetricCard from '@/components/dashboard/hr/metric-card';
import LeaveRequestsTable from '@/components/dashboard/hr/attendance-leave/leave-requests-table';
import youtubeIcon from '@/assets/icons/youtube-red.png';
import { cn } from '@/lib/utils';

const sampleChartData = [
  { month: 'Jan', month1: 600 },
  { month: 'Feb', month2: 800 },
  { month: 'Mar', month3: 1000 },
  { month: 'Apr', month4: 1200 },
];

const SUB_TABS = [
  { key: 'requests', label: 'Leave Requests' },
  { key: 'balances', label: 'Leave Balances' },
  { key: 'rules', label: 'Leave Rules Setup' },
];

export default function Leave() {
  const [subTab, setSubTab] = useState('requests');
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="my-4 min-h-screen">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <hgroup>
          <h1 className="font-raleway text-2xl font-bold text-gray-900">
            Leave Management
          </h1>
          <p className="mt-1 text-sm text-[#7D7D7D]">
            Manage employee leave requests and balances
          </p>
        </hgroup>
        <Button
          variant="outline"
          className="h-10 rounded-lg border border-gray-200 text-sm"
        >
          <img src={youtubeIcon} alt="YouTube" className="mr-1.5 h-4" />
          See video guide
        </Button>
      </div>

      {/* Sub-tabs */}
      <div className="mt-6 flex gap-8 border-b border-gray-200">
        {SUB_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setSubTab(tab.key)}
            className={cn(
              'font-raleway pb-3 text-sm font-medium transition-colors',
              subTab === tab.key
                ? 'border-b-2 border-[#3300C9] text-[#3300C9]'
                : 'text-[#7D7D7D] hover:text-gray-700'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {subTab === 'requests' ? (
        <>
          {/* Metric cards */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Leave Requests"
              value={0}
              percentage={0}
              isPositive={true}
              chartData={sampleChartData}
            />
            <MetricCard
              title="Pending Approvals"
              value={0}
              percentage={0}
              isPositive={true}
              chartData={sampleChartData}
            />
            <MetricCard
              title="Approved Leaves"
              value={0}
              percentage={0}
              isPositive={true}
              chartData={sampleChartData}
            />
            <MetricCard
              title="Rejected Requests"
              value={0}
              percentage={2}
              isPositive={true}
              chartData={sampleChartData}
            />
          </div>

          {/* Leave Requests table */}
          <div className="mt-8">
            <LeaveRequestsTable
              data={[]}
              isLoading={false}
              paginationData={{
                page: currentPage,
                totalPages: 10,
                pageSize: 20,
                totalCount: 0,
              }}
              onPageChange={setCurrentPage}
              onRowAction={(action, row) =>
                console.log('Leave action:', action, row)
              }
            />
          </div>
        </>
      ) : (
        <div className="mt-12 flex flex-col items-center justify-center py-16 text-center text-gray-400">
          <p className="text-lg font-medium">
            {subTab === 'balances' ? 'Leave Balances' : 'Leave Rules Setup'}
          </p>
          <p className="mt-1 text-sm">Coming soon</p>
        </div>
      )}
    </div>
  );
}
