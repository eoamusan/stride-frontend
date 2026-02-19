import { useState } from 'react';

import PlusIcon from '@/assets/icons/plus.svg';
import Header from '@/components/customs/header';
import { CustomButton } from '@/components/customs';
import { Card } from '@/components/ui/card';
import CustomModal from '@/components/customs/modal';
import CelebrationSection from './components/celebrationSection';
import CreateCelebrationModalContent from './components/createCelebrationModalContent';
import MetricCard from '@/components/dashboard/hr/metric-card';

export default function Engagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCelebration, setSelectedCelebration] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = selectedCelebration !== null;

  const handleOpenCreateModal = () => {
    setSelectedCelebration(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (celebration) => {
    setSelectedCelebration(celebration);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCelebration(null);
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement API call for create/update
      console.log(isEditMode ? 'Updating:' : 'Creating:', values);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (isEditMode) {
        handleCloseModal();
      }
      // For create mode, the child component handles closing via success modal
    } catch (error) {
      console.error('Error submitting celebration:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (celebration) => {
    // TODO: Implement delete functionality
    console.log('Deleting:', celebration);
  };

  const handleSendWishes = (celebration) => {
    // TODO: Implement send wishes functionality
    console.log('Sending wishes to:', celebration);
  };

  return (
    <div className="my-5 flex flex-col gap-4">
      <Header
        title="Celebrations Hub"
        description="Celebrate milestones and achievements across the organization."
        hasYoutubeButton
      >
        <CustomButton
          className="w-full rounded-xl py-6 text-sm md:w-auto"
          onClick={handleOpenCreateModal}
        >
          <img src={PlusIcon} alt="create new celebration" className="mr-1" />
          Create New Celebration
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
        <CelebrationSection
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
          onSendWishes={handleSendWishes}
        />
      </Card>

      <CustomModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        title={isEditMode ? 'Edit Celebration' : 'Create New Celebration'}
        description="Add new events to be celebrated"
      >
        <CreateCelebrationModalContent
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSubmit={handleSubmit}
          mode={isEditMode ? 'edit' : 'create'}
          initialData={selectedCelebration}
          isSubmitting={isSubmitting}
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
    title: 'Upcoming Celebrations',
    value: 150,
    percentage: 5,
    chartData: sampleChartData,
  },
  {
    title: 'Birthdays',
    value: 50,
    percentage: -2,
    chartData: sampleChartData,
    isPositive: false,
  },
  {
    title: 'Work Anniversaries',
    value: 70,
    percentage: 5,
    chartData: sampleChartData,
  },
  {
    title: 'Promotions',
    value: 50,
    percentage: 2,
    chartData: sampleChartData,
  },
];
