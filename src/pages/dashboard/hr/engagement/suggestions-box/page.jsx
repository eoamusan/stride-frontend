import { useState } from 'react';

import Header from '@/components/customs/header';
import CustomModal from '@/components/customs/modal';

import MetricCard from '@/components/dashboard/hr/metric-card';
import SuggestionTable from './components/suggestionTable';
import SuggestionModalContent from './components/suggestionModalContent';
import { Card } from '@/components/ui/card';

const statusBadgeStyles = {
  new: 'bg-gray-200 text-gray-600',
  'under review': 'bg-amber-50 text-amber-500',
  resolved: 'bg-green-50 text-green-500',
};

export default function SuggestionsBox() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const handleViewSuggestion = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setIsModalOpen(true);
  };

  const handleCloseModal = (open) => {
    if (!open) {
      setIsModalOpen(false);
      setSelectedSuggestion(null);
    }
  };

  const badgeKey = (selectedSuggestion?.status || '').toLowerCase();
  const badgeStyle = statusBadgeStyles[badgeKey] ?? 'bg-gray-100 text-gray-600';

  return (
    <div className="my-5 flex flex-col gap-4">
      <Header
        title="Suggestions Box"
        description="Capture employee ideas and feedback"
        hasYoutubeButton
      ></Header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
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
        <SuggestionTable onView={handleViewSuggestion} />
      </Card>

      <CustomModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        title={selectedSuggestion?.title || 'Suggestion'}
        className="sm:max-w-3xl"
        description={
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[#7D7D7D]">
              {selectedSuggestion?.category}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-4 py-1 text-sm font-medium ${badgeStyle}`}
            >
              {selectedSuggestion?.status}
            </span>
          </div>
        }
      >
        <SuggestionModalContent
          suggestion={selectedSuggestion}
          onClose={() => handleCloseModal(false)}
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
    title: 'Total Suggestions',
    value: 150,
    percentage: 5,
    chartData: sampleChartData,
  },
  {
    title: 'New Suggestions',
    value: 20,
    percentage: -2,
    chartData: sampleChartData,
    isPositive: false,
  },
  {
    title: 'Under Review',
    value: 70,
    percentage: 5,
    chartData: sampleChartData,
  },
  {
    title: 'Resolved',
    value: 50,
    percentage: 2,
    chartData: sampleChartData,
  },
];
