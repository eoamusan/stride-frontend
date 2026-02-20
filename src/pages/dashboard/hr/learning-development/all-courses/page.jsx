import Header from '@/components/customs/header';
import MetricCard from '@/components/dashboard/hr/metric-card';
import CoursesSection from './allCoursesSection';
import { Card } from '@/components/ui/card';

const AllCourses = () => {
  return (
    <div className="my-5 flex flex-col gap-4">
      <Header
        title="All Courses"
        description="Access all available courses and request enrollment if interested."
        // hasYoutubeButton
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

      <Card className="mt-2 w-full border-0 shadow-none">
        <CoursesSection />
      </Card>
    </div>
  );
};

export default AllCourses;

const sampleChartData = [
  { month: 'Jan', month1: 600 },
  { month: 'Feb', month2: 800 },
  { month: 'Mar', month3: 1000 },
];

const metricsData = [
  {
    title: 'Total Available Courses',
    value: 150,
    percentage: 5,
    chartData: sampleChartData,
  },
  {
    title: 'Assigned Courses',
    value: 100,
    percentage: -2,
    chartData: sampleChartData,
    isPositive: false,
  },
  {
    title: 'Requested Courses',
    value: 4,
    percentage: 5,
    chartData: sampleChartData,
  },
  {
    title: 'Completion Rate',
    value: 40,
    percentage: 2,
    chartData: sampleChartData,
  },
];