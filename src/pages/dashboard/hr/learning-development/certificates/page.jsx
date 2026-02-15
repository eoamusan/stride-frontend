import UploadIcon from '@/assets/icons/upload.svg';
import { CustomButton } from '@/components/customs';
import Header from '@/components/customs/header';
import MetricCard from '@/components/dashboard/hr/metric-card';
import { Card } from '@/components/ui/card';
import CustomModal from '@/components/customs/modal';
import UploadCertificateModalContent from './components/uploadCertificate';
import { useState } from 'react';
import CertificateTable from './components/certificateTable';

export default function Certificates() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const handleOpenModal = () => setUploadModalOpen(true);
  const handleCloseModal = () => setUploadModalOpen(false);
  const handleUploadCertificate = () => {
    // TODO: Implement upload logic
    setUploadModalOpen(false);
  };

  return (
    <div className="my-5 flex flex-col gap-4">
      <Header
        title="Certificates"
        description="Manage and verify employee certificates"
        hasYoutubeButton
      >
        <CustomButton
          className="w-full rounded-xl py-6 text-sm md:w-auto"
          onClick={handleOpenModal}
        >
          <img src={UploadIcon} alt="upload report" className="mr-1" />
          Upload Certificate
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
        <CertificateTable />
      </Card>

      <CustomModal
        open={uploadModalOpen}
        handleClose={handleCloseModal}
        title="Upload Certificate"
        className="sm:max-w-3xl"
        icon={UploadIcon}
      >
        <UploadCertificateModalContent
          onBack={handleCloseModal}
          onSubmit={handleUploadCertificate}
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
    title: 'Total Certificates',
    value: 150,
    percentage: 5,
    chartData: sampleChartData,
  },
  {
    title: 'Verified Certificates',
    value: 100,
    percentage: -2,
    chartData: sampleChartData,
    isPositive: false,
  },
  {
    title: 'Expired Certificates',
    value: 40,
    percentage: 5,
    chartData: sampleChartData,
  },
  {
    title: 'Certificates Expiring Soon',
    value: 16,
    percentage: 2,
    chartData: sampleChartData,
  },
];