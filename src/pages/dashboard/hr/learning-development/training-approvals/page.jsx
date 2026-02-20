import { CustomButton } from '@/components/customs';
import Header from '@/components/customs/header';
import MetricCard from '@/components/dashboard/hr/metric-card';
import { Card } from '@/components/ui/card';
import TrainingQueueTable from './trainingQueueTable';

export default function TrainingApproval() {
  return (
    <div className="my-5 flex flex-col gap-4">
      <Header
        title="Training Approval"
        description="Review and approve training requests from your learn."
        hasYoutubeButton
      ></Header>

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
        <TrainingQueueTable />
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
    title: 'Total Course Requests',
    value: 150,
    percentage: 5,
    chartData: sampleChartData,
  },
  {
    title: 'Pending Requests',
    value: 100,
    percentage: -2,
    chartData: sampleChartData,
    isPositive: false,
  },
  {
    title: 'Approved Requests',
    value: 4,
    percentage: 5,
    chartData: sampleChartData,
  },
  {
    title: 'Rejected Requests',
    value: 78,
    percentage: 2,
    chartData: sampleChartData,
  },
];
