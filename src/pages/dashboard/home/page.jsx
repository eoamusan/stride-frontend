import { useState } from 'react';
import EmptyDashboard from '@/components/dashboard/home/empty';
import OnboardModal from '@/components/dashboard/home/onboard-modal';
import CallToAction from '@/components/dashboard/home/ctas';
import MetricsSummary from '@/components/dashboard/home/metrics-summary';
import BarChartOverview from '@/components/dashboard/bar-metric-card';
import PieMetricCard from '@/components/dashboard/pie-metric-card';
import ActiveProjectsTable from '@/components/dashboard/home/active-projects-table';

// sample url data
const projects = [''];

// Sample data for the metrics
const metricsData = [
  {
    title: 'Total Hours',
    value: '234.5',
    unit: 'hrs',
    percentage: '2.45',
    isPositive: true,
    chartData: [20, 25, 30, 28, 35, 40, 38, 45, 50],
  },
  {
    title: 'Active Projects',
    value: '$45.2',
    unit: 'K',
    percentage: '5.12',
    isPositive: true,
    chartData: [30, 35, 32, 40, 45, 50, 48, 55, 60],
  },
  {
    title: 'Total Revenue',
    value: '12',
    unit: '',
    percentage: '8.33',
    isPositive: false,
    chartData: [15, 14, 13, 12, 13, 12, 11, 12, 12],
  },
  {
    title: 'Invoices',
    value: '24',
    unit: '',
    percentage: '4.17',
    isPositive: true,
    chartData: [20, 21, 22, 23, 23, 23, 23, 20, 24],
  },
];
const chartData = [
  { day: 'Monday', value: 70 },
  { day: 'Tuesday', value: 17 },
  { day: 'Wednesday', value: 32 },
  { day: 'Thursday', value: 19 },
  { day: 'Friday', value: 42 },
  { day: 'Saturday', value: 11 },
  { day: 'Sunday', value: 57 },
];

const chartConfig = {
  value: {
    label: 'Hours',
    color: '#8B5CF6',
  },
};

const pieChartData = [
  { name: 'To Do', value: 82, percentage: 59.42, color: '#6366F1' },
  { name: 'Completed', value: 46, percentage: 33.33, color: '#10B981' },
  { name: 'In progress', value: 10, percentage: 7.25, color: '#F59E0B' },
];

const pieChartConfig = {
  'To Do': {
    label: 'To Do',
    color: '#6366F1',
  },
  Completed: {
    label: 'Completed',
    color: '#10B981',
  },
  'In progress': {
    label: 'In progress',
    color: '#F59E0B',
  },
};

const activeDataTable = [
  {
    id: 1,
    projectName: 'Website Redesign',
    category: 'Design',
    dueDate: '2025-08-30',
    priority: 'High',
    status: 'Completed',
  },
  {
    id: 2,
    projectName: 'Mobile App Development',
    category: 'Development',
    dueDate: '2025-09-15',
    priority: 'Medium',
    status: 'Planning',
  },
  {
    id: 3,
    projectName: 'Marketing Campaign',
    category: 'Marketing',
    dueDate: '2025-08-25',
    priority: 'High',
    status: 'Active',
  },
  {
    id: 4,
    projectName: 'Database Migration',
    category: 'Development',
    dueDate: '2025-09-01',
    priority: 'Critical',
    status: 'In Progress',
  },
];

export default function Home() {
  const [openOnboardingModal, setOpenOnboardingModal] = useState(false);
  return (
    <div className="mt-2 overflow-y-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 max-sm:justify-start">
        <h1 className="p-4 text-base italic">
          WELCOME <span className="font-bold not-italic">Oluwatosin👋</span>
        </h1>

        {projects.length > 0 && <CallToAction />}
      </div>
      <div className="mt-10">
        {projects.length === 0 ? (
          <EmptyDashboard onGetStarted={() => setOpenOnboardingModal(true)} />
        ) : (
          <div>
            <MetricsSummary metricsData={metricsData} />
            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <BarChartOverview
                className={'w-full lg:col-span-2'}
                title={'Weekly Overview'}
                chartConfig={chartConfig}
                chartData={chartData}
              />
              <PieMetricCard
                title={'Task Summary'}
                chartConfig={pieChartConfig}
                chartData={pieChartData}
                className={'w-full max-w-full self-start'}
              />
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <ActiveProjectsTable
                className={'lg:col-span-2'}
                tableData={activeDataTable}
              />
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <OnboardModal
        open={openOnboardingModal}
        onClose={() => setOpenOnboardingModal(false)}
      />
    </div>
  );
}
