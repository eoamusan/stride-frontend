import { useState } from 'react';
import { Button } from '@/components/ui/button';
import MetricCard from '@/components/dashboard/hr/metric-card';
import ClockInHistoryTable from '@/components/dashboard/hr/attendance-leave/clock-in-history-table';
import youtubeIcon from '@/assets/icons/youtube-red.png';
import { cn } from '@/lib/utils';

const sampleChartData = [
  { month: 'Jan', month1: 600 },
  { month: 'Feb', month2: 800 },
  { month: 'Mar', month3: 1000 },
  { month: 'Apr', month4: 1200 },
];

const MOCK_ATTENDANCE = [
  {
    id: '1',
    name: 'Nathaniel Desire',
    role: 'Product Manager',
    initials: 'ND',
    avatarColor: 'bg-blue-600',
    clockIn: '08:55 AM',
    clockOut: '05:05 PM',
    totalHours: '8h 10m',
    method: 'Face ID',
    location: 'Victoria Island, Lagos',
    status: 'on-time',
  },
  {
    id: '2',
    name: 'Femi Johnson',
    role: 'Product Manager',
    initials: 'FJ',
    avatarColor: 'bg-amber-700',
    clockIn: '08:55 AM',
    clockOut: '05:05 PM',
    totalHours: '8h 10m',
    method: 'Manual',
    location: 'Victoria Island, Lagos',
    status: 'Late',
  },
  {
    id: '3',
    name: 'Sarah Adeyemi',
    role: 'Product Manager',
    initials: 'SA',
    avatarColor: 'bg-pink-600',
    clockIn: '08:55 AM',
    clockOut: '05:05 PM',
    totalHours: '8h 10m',
    method: 'Face ID',
    location: 'Victoria Island, Lagos',
    status: 'Absent',
  },
  {
    id: '4',
    name: 'Kemi Jakada',
    role: 'Product Manager',
    initials: 'KJ',
    avatarColor: 'bg-red-600',
    clockIn: '08:55 AM',
    clockOut: '05:05 PM',
    totalHours: '8h 10m',
    method: 'Manual',
    location: 'Victoria Island, Lagos',
    status: 'on-time',
  },
];

const SUB_TABS = [
  { key: 'dashboard', label: 'Attendance Dashboard' },
  { key: 'shift', label: 'Edit Shift Request' },
];

export default function Attendance() {
  const [subTab, setSubTab] = useState('dashboard');
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="my-4 min-h-screen">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <hgroup>
          <h1 className="font-raleway text-2xl font-bold text-gray-900">
            Attendance Management
          </h1>
          <p className="mt-1 text-sm text-[#7D7D7D]">
            Track daily attendance, work hours and mange shift request
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

      {subTab === 'dashboard' ? (
        <>
          {/* Metric cards */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Employees"
              value={142}
              percentage={5}
              isPositive={true}
              chartData={sampleChartData}
            />
            <MetricCard
              title="Present Today"
              value={128}
              percentage={5}
              isPositive={true}
              chartData={sampleChartData}
            />
            <MetricCard
              title="Absent Today"
              value={8}
              percentage={2}
              isPositive={false}
              chartData={sampleChartData}
            />
            <MetricCard
              title="Late Clock-ins"
              value={6}
              percentage={2}
              isPositive={true}
              chartData={sampleChartData}
            />
          </div>

          {/* Clock-in History table */}
          <div className="mt-8">
            <ClockInHistoryTable
              data={MOCK_ATTENDANCE}
              isLoading={false}
              paginationData={{
                page: currentPage,
                totalPages: 10,
                pageSize: 20,
                totalCount: 198,
              }}
              onPageChange={setCurrentPage}
              onRowAction={(action, row) =>
                console.log('Attendance action:', action, row)
              }
            />
          </div>
        </>
      ) : (
        <div className="mt-12 flex flex-col items-center justify-center py-16 text-center text-gray-400">
          <p className="text-lg font-medium">Edit Shift Request</p>
          <p className="mt-1 text-sm">Coming soon</p>
        </div>
      )}
    </div>
  );
}
