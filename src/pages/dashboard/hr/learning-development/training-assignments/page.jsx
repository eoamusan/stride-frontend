import { useState } from 'react';

import PlusIcon from '@/assets/icons/plus.svg';
import Header from '@/components/customs/header';
import { CustomButton } from '@/components/customs';
import CustomModal from '@/components/customs/modal';
import MetricCard from '@/components/dashboard/hr/metric-card';
import { Card } from '@/components/ui/card';
import CourseTable from './components/courseTable';
import AssignTrainingForm from './components/assignTrainingForm';

export default function TrainingAssignments() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="my-5 flex flex-col gap-4">
      <Header
        title="Assignment"
        description="Manage training assignment and approvals."
        hasYoutubeButton
      >
        <CustomButton
          className="w-full rounded-xl py-6 text-sm md:w-auto"
          onClick={handleOpenModal}
        >
          <img src={PlusIcon} alt="assign training" className="mr-1" />
          Assign Training
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
        <CourseTable />
      </Card>

      <CustomModal
        title="Assign Training"
        description="Select trainings and who it can be assigned to."
        open={isModalOpen}
        handleClose={handleCloseModal}
      >
        <AssignTrainingForm
          open={isModalOpen}
          onOpenChange={handleCloseModal}
          onSave={(trainingData) => {
            console.log('New training assignment:', trainingData);
            // You can add logic here to save to backend or update table
          }}
        />
      </CustomModal>
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
    title: 'Total Courses',
    value: 150,
    percentage: 5,
    chartData: sampleChartData,
  },
  {
    title: 'Active Courses',
    value: 100,
    percentage: -2,
    chartData: sampleChartData,
    isPositive: false,
  },
  {
    title: 'Enrolled Employees',
    value: 4,
    percentage: 5,
    chartData: sampleChartData,
  },
  {
    title: 'Average Completion',
    value: '78%',
    percentage: 2,
    chartData: sampleChartData,
  },
];
