import MetricCard from '@/components/dashboard/hr/metric-card';
import { Button } from '@/components/ui/button';
import youtubeIcon from '@/assets/icons/youtube-red.png';
import { dummyJobRequests } from '../job-requests';
import { TableActions } from '@/components/dashboard/hr/table';
export default function JobPosting() {
  const sampleChartData = [
    { month: 'Jan', month1: 600 },
    { month: 'Feb', month2: 800 },
    { month: 'Mar', month3: 1000 },
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
    { key: 'requestedBy', label: 'Requested By', className: '' },
    { key: 'openings', label: 'Openings', className: '' },
    { key: 'status', label: 'Status', className: '' },
    { key: 'dateCreated', label: 'Date Created', className: '' },
    { key: 'actions', label: 'Actions', className: 'text-right' },
  ];

  return (
    <div className="my-5">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Job Posting</h1>
          <p className="text-sm text-[#7D7D7D]">Manage Job Posting</p>
        </hgroup>

        <div className="flex space-x-4">
          <Button className={'h-10 rounded-2xl px-6 text-sm'}>
            Post New Jobs
          </Button>
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
          jobRequests={dummyJobRequests}
          tableHeaders={tableHeaders}
          title="Job Requisitions"
        />
      </div>
    </div>
  );
}
