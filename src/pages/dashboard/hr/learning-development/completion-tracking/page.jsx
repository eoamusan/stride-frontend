import ExportIcon from '@/assets/icons/white-export.svg';

import { CustomButton } from '@/components/customs';
import Header from '@/components/customs/header';
import MetricCard from '@/components/dashboard/hr/metric-card';
import { Card } from '@/components/ui/card';
import TrainingProgressTable from './trainingProgressTable';

export default function CompletionTracking() {
  return (
    <div className="my-5 flex flex-col gap-4">
      <Header
        title="Completion Tracking"
        description="Track employee learning progress and completion"
        hasYoutubeButton
      >
        <CustomButton
          className="w-full rounded-xl py-6 text-sm md:w-auto"
          // onClick={handleOpenModal}
        >
          <img src={ExportIcon} alt="export report" className="mr-1" />
          Export Report
        </CustomButton>
      </Header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricsData.map((metric) => (
          <MetricCard
            key={metric.title}
            {...metric}
            emptyState={false}
            emojis={metric.emojis}
          />
        ))}
      </div>

      <Card>
        <TrainingProgressTable />
      </Card>
    </div>
  );
}

const sampleChartData = [
  { month: 'Jan', month1: 600 },
  { month: 'Feb', month2: 800 },
  { month: 'Mar', month3: 1000 },
];

const metricsData = [
  {
    title: 'Assigned',
    value: 150,
    percentage: 5,
    chartData: sampleChartData,
  },
  {
    title: 'In Progress',
    value: 100,
    percentage: -2,
    chartData: sampleChartData,
    isPositive: false,
  },
  {
    title: 'Completed',
    value: 40,
    percentage: 5,
    chartData: sampleChartData,
  },
  {
    title: 'Overdue',
    value: 16,
    percentage: 2,
    chartData: sampleChartData,
  },
];