import MetricCard from '@/components/dashboard/hr/metric-card';
import { Button } from '@/components/ui/button';
import youtubeIcon from '@/assets/icons/youtube-red.png';
import { dummyJobRequests } from '../job-requests';
import { TableActions } from '@/components/dashboard/hr/table';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import JobPostingForm from '../form/job-posting-form';
import { useState } from 'react';
import { Plus } from 'lucide-react';
export default function JobPosting() {
  const sampleChartData = [
    { month: 'Jan', month1: 600 },
    { month: 'Feb', month2: 800 },
    { month: 'Mar', month3: 1000 },
    { month: 'Apr', month4: 1200 },
  ];

  const metricsData = [
    {
      title: 'Total Postings',
      value: 150,
      percentage: 5,
      chartData: sampleChartData,
    },
    {
      title: 'Active Jobs',
      value: 20,
      percentage: -2,
      chartData: sampleChartData,
      isPositive: false,
    },
    {
      title: 'Closed Jobs',
      value: 70,
      percentage: 5,
      chartData: sampleChartData,
    },
    {
      title: 'Draft Jobs',
      value: 50,
      percentage: 2,
      chartData: sampleChartData,
    },
  ];

  const tableHeaders = [
    { key: 'jobTitle', label: 'Job Title', className: '' },
    { key: 'department', label: 'Department', className: '' },
    { key: 'application', label: 'Applications', className: '' },
    { key: 'datePosted', label: 'Date Posted', className: '' },
    { key: 'status', label: 'Status', className: '' },
  ];

  const tableData = dummyJobRequests.map((item) => ({
    id: item.id,
    title: item.title,
    department: item.department,
    application: item.application,
    postedDate: item.postedDate,
    status: item.status,
  }));

  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="my-5">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Job Posting</h1>
          <p className="text-sm text-[#7D7D7D]">Manage Job Posting</p>
        </hgroup>

        <div className="flex space-x-4">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className={'h-10 rounded-2xl px-6 text-sm'}>
                <Plus className="mr-2 h-4 w-4" />
                Post New Jobs
              </Button>
            </DialogTrigger>

            {/* 5. The Content of the Modal */}
            <DialogContent className="max-h-[60vh] w-full max-w-7xl overflow-y-auto rounded-2xl">
              <JobPostingForm />
            </DialogContent>
          </Dialog>

          <Button variant={'outline'} className={'h-10 rounded-lg text-sm'}>
            <img src={youtubeIcon} alt="YouTube Icon" className="mr-1 h-4" />
            See video guide
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metricsData.map((metric) => (
          <MetricCard
            key={metric.title}
            {...metric}
            emptyState={false}
            emojis={metric.emojis}
          />
        ))}
      </div>

      <div className="mt-6 rounded-lg bg-white p-6 shadow-md">
        <TableActions
          tableData={tableData}
          tableHeaders={tableHeaders}
          title="Job Posting"
          path="/dashboard/hr/recruitment/job-postings/detail"
        />
      </div>
    </div>
  );
}
