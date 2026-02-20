import { useState } from 'react';

import { CustomButton } from '@/components/customs';
import Header from '@/components/customs/header';
import CustomModal from '@/components/customs/modal';

import PlusIcon from '@/assets/icons/plus.svg';
import MetricCard from '@/components/dashboard/hr/metric-card';
import RecognitionSection from './components/recognitionSection';
import GiveRecognitionModalContent from './components/giveRecognitionModalContent';
import { Card } from '@/components/ui/card';

export default function RecognitionWall() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecognition, setEditingRecognition] = useState(null);

  const handleOpenCreateModal = () => {
    setEditingRecognition(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (recognition) => {
    setEditingRecognition(recognition);
    setIsModalOpen(true);
  };

  const handleCloseModal = (open) => {
    if (!open) {
      setIsModalOpen(false);
      setEditingRecognition(null);
    }
  };

  const handleModalSuccess = () => {
    // Refresh data or perform any actions after successful submission
    console.log('Recognition saved successfully');
  };

  const handleDeleteRecognition = (recognition) => {
    // Handle delete logic here
    console.log('Delete recognition:', recognition);
  };

  return (
    <div className="my-5 flex flex-col gap-4">
      <Header
        title="Recognition Wall"
        description="Public appreciation and peer recognition"
        hasYoutubeButton
      >
        <CustomButton
          className="w-full rounded-xl py-6 text-sm md:w-auto"
          onClick={handleOpenCreateModal}
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
        <RecognitionSection
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteRecognition}
        />
      </Card>

      <CustomModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        title={editingRecognition ? 'Edit Recognition' : 'Give Recognition'}
        description={
          editingRecognition
            ? 'Update the recognition details below.'
            : 'Appreciate a colleague for their great work.'
        }
      >
        <GiveRecognitionModalContent
          mode={editingRecognition ? 'edit' : 'create'}
          initialData={editingRecognition}
          onOpenChange={handleCloseModal}
          onSuccess={handleModalSuccess}
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
