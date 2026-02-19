import { CustomButton } from "@/components/customs";
import Header from "@/components/customs/header";

import PlusIcon from '@/assets/icons/plus.svg';
import MetricCard from "@/components/dashboard/hr/metric-card";
import RecognitionSection from "./components/recognitionSection";
import { Card } from "@/components/ui/card";

export default function RecognitionWall() {
  return (
    <div className="my-5 flex flex-col gap-4">
      <Header
        title="Recognition Wall"
        description="Public appreciation and peer recognition"
        hasYoutubeButton
      >
        <CustomButton
          className="w-full rounded-xl py-6 text-sm md:w-auto"
          // onClick={handleOpenCreateModal}
        >
          <img src={PlusIcon} alt="create new celebration" className="mr-1" />
          Give Recognition
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
        <RecognitionSection />
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
    title: 'Total Recognitions',
    value: 150,
    percentage: 5,
    chartData: sampleChartData,
  },
  {
    title: 'Employees Recognized',
    value: 50,
    percentage: -2,
    chartData: sampleChartData,
    isPositive: false,
  },
  {
    title: 'Managers Recognizing',
    value: 70,
    percentage: 5,
    chartData: sampleChartData,
  },
  {
    title: 'Recognitions This Month',
    value: 50,
    percentage: 2,
    chartData: sampleChartData,
  },
];