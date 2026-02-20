import Header from '@/components/customs/header';
import MetricCard from '@/components/dashboard/hr/metric-card';
import { Card } from '@/components/ui/card';
import CoursesSection from './requestedCoursesSection';

const RequestedTraining = () => {
  return (
    <div className="my-5 flex flex-col gap-4">
      <Header
        title="Requested Training"
        description="Training programs you have requested for approval."
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
        <CoursesSection />
      </Card>
    </div>
  );
};

export default RequestedTraining;

const sampleChartData = [
  { month: 'Jan', month1: 600 },
  { month: 'Feb', month2: 800 },
  { month: 'Mar', month3: 1000 },
];

const metricsData = [
  {
    title: 'Total Requested Courses',
    value: 150,
    percentage: 5,
    chartData: sampleChartData,
  },
  {
    title: 'Approved',
    value: 100,
    percentage: -2,
    chartData: sampleChartData,
    isPositive: false,
  },
  {
    title: 'Pending',
    value: 40,
    percentage: 5,
    chartData: sampleChartData,
  },
  {
    title: 'Rejected',
    value: 16,
    percentage: 2,
    chartData: sampleChartData,
  },
];
