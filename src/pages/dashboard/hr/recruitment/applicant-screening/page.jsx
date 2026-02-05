import MetricCard from '@/components/dashboard/hr/metric-card';
import { dummyJobRequests } from '../job-requests';
import { TableActions } from '@/components/dashboard/hr/table';
export default function ApplicantScreening() {
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
    { key: 'applicantName', label: 'Applicant Name', className: '' },
    { key: 'applicantDate', label: 'Applicant Date', className: '' },
    { key: 'roleApplied', label: 'Role Applied', className: '' },
    { key: 'status', label: 'Status', className: '' },
  ];

  const tableActions = [
    { title: 'Approve', action: 'approve' },
    { title: 'Reject', action: 'reject' },
    { title: 'Shortlist', action: 'shortlist' },
    { title: 'Interview', action: 'interview' },
  ];

  const tableData = dummyJobRequests.flatMap((job) =>
    (job.applicants || []).map((applicant) => ({
      id: `${job.id}`,
      applicantID: applicant.id,
      applicantName: applicant.name,
      applicantDate: applicant.date,
      roleApplied: job.title,
      status: applicant.status,
    }))
  );

  return (
    <div className="my-5">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Applicant Screening</h1>
          <p className="text-sm text-[#7D7D7D]">
            Review and manage applicants for open job posting
          </p>
        </hgroup>
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
          title="Applicants"
          path={`/dashboard/hr/recruitment/applicant-screening/applicant/`}
          pageSize={9}
          tableActions={tableActions}
          applicantID={true}
        />
      </div>
    </div>
  );
}
