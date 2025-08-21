import { useState } from 'react';
import EmptyDashboard from '@/components/dashboard/home/empty';
import OnboardModal from '@/components/dashboard/home/onboard-modal';
import CallToAction from '@/components/dashboard/home/ctas';
import MetricsSummary from '@/components/dashboard/home/metrics-summary';
import BarChartOverview from '@/components/dashboard/bar-metric-card';
import PieMetricCard from '@/components/dashboard/pie-metric-card';

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
            <div className="mt-10 flex items-start gap-6">
              <BarChartOverview
                className={'w-full'}
                title={'Weekly Overview'}
                chartConfig={chartConfig}
                chartData={chartData}
              />
              <PieMetricCard />
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
