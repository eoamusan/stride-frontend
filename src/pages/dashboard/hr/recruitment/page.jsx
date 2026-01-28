import MetricCard from '@/components/dashboard/hr/metric-card';
import youtubeIcon from '@/assets/icons/youtube-red.png';
import { Button } from '@/components/ui/button';
import { TableActions } from '@/components/dashboard/hr/table';
export default function Recruitment() {
  const sampleChartData = [
    { month: 'Jan', month1: 600 },
    { month: 'Feb', month2: 800 },
    { month: 'Mar', month3: 1000 },
  ];

  const metricsData = [
    {
      title: 'Total Requisitions',
      value: 150,
      percentage: 5,
      chartData: sampleChartData,
    },
    {
      title: 'Pendings',
      value: 20,
      percentage: -2,
      chartData: sampleChartData,
      isPositive: false,
    },
    {
      title: 'Approved Requisitions',
      value: 70,
      percentage: 5,
      chartData: sampleChartData,
    },
    {
      title: 'Total Open Positions',
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

  // Dummy data for HR job requests
  const dummyJobRequests = [
    {
      id: 1,
      jobTitle: 'Senior Software Engineer',
      department: 'Engineering',
      requestedBy: 'Nathaniel Desire',
      openings: 3,
      status: 'Pending',
      dateCreated: 'Nov 14, 2025',
    },
    {
      id: 2,
      jobTitle: 'Product Manager',
      department: 'Product',
      requestedBy: 'Sarah Johnson',
      openings: 1,
      status: 'Approved',
      dateCreated: 'Nov 12, 2025',
    },
    {
      id: 3,
      jobTitle: 'UX Designer',
      department: 'Design',
      requestedBy: 'Michael Chen',
      openings: 2,
      status: 'Rejected',
      dateCreated: 'Nov 10, 2025',
    },
    {
      id: 4,
      jobTitle: 'Data Analyst',
      department: 'Analytics',
      requestedBy: 'Emily Rodriguez',
      openings: 1,
      status: 'Pending',
      dateCreated: 'Nov 8, 2025',
    },
    {
      id: 5,
      jobTitle: 'DevOps Engineer',
      department: 'Engineering',
      requestedBy: 'David Kim',
      openings: 2,
      status: 'Approved',
      dateCreated: 'Nov 6, 2025',
    },
    {
      id: 6,
      jobTitle: 'Frontend Engineer',
      department: 'Engineering',
      requestedBy: 'Stephen Adewale',
      openings: 1,
      status: 'Approved',
      dateCreated: 'Feb 1, 2026',
    },

    {
      id: 7,
      jobTitle: 'Marketing Specialist',
      department: 'Marketing',
      requestedBy: 'Olivia Martinez',
      openings: 1,
      status: 'Pending',
      dateCreated: 'Feb 3, 2026',
    },
    {
      id: 8,
      jobTitle: 'HR Business Partner',
      department: 'Human Resources',
      requestedBy: 'Robert Wilson',
      openings: 1,
      status: 'Approved',
      dateCreated: 'Jan 28, 2026',
    },
    {
      id: 9,
      jobTitle: 'Account Executive',
      department: 'Sales',
      requestedBy: 'Priya Patel',
      openings: 5,
      status: 'Pending',
      dateCreated: 'Jan 25, 2026',
    },
    {
      id: 10,
      jobTitle: 'QA Engineer',
      department: 'Engineering',
      requestedBy: 'James O’Connor',
      openings: 2,
      status: 'Rejected',
      dateCreated: 'Jan 20, 2026',
    },
    {
      id: 11,
      jobTitle: 'Financial Analyst',
      department: 'Finance',
      requestedBy: 'William Lee',
      openings: 1,
      status: 'Approved',
      dateCreated: 'Jan 15, 2026',
    },
    {
      id: 12,
      jobTitle: 'Customer Success Manager',
      department: 'Customer Support',
      requestedBy: 'Aisha Bello',
      openings: 3,
      status: 'Pending',
      dateCreated: 'Jan 12, 2026',
    },
    {
      id: 13,
      jobTitle: 'Security Compliance Officer',
      department: 'Legal',
      requestedBy: 'Sofia Garcia',
      openings: 1,
      status: 'Approved',
      dateCreated: 'Jan 05, 2026',
    },
    {
      id: 14,
      jobTitle: 'Backend Developer',
      department: 'Engineering',
      requestedBy: 'Thomas Müller',
      openings: 2,
      status: 'Pending',
      dateCreated: 'Dec 28, 2025',
    },
    {
      id: 15,
      jobTitle: 'Content Strategist',
      department: 'Marketing',
      requestedBy: 'Grace Nkosi',
      openings: 1,
      status: 'Rejected',
      dateCreated: 'Dec 15, 2025',
    },
    {
      id: 16,
      jobTitle: 'IT Support Specialist',
      department: 'IT',
      requestedBy: 'Benjamin Cohen',
      openings: 1,
      status: 'Approved',
      dateCreated: 'Dec 10, 2025',
    },
    {
      id: 17,
      jobTitle: 'Technical Recruiter',
      department: 'Human Resources',
      requestedBy: 'Elena Rossi',
      openings: 2,
      status: 'Pending',
      dateCreated: 'Nov 30, 2025',
    },
    {
      id: 18,
      jobTitle: 'Machine Learning Engineer',
      department: 'Data Science',
      requestedBy: 'Arjun Gupta',
      openings: 1,
      status: 'Approved',
      dateCreated: 'Nov 25, 2025',
    },
    {
      id: 19,
      jobTitle: 'Executive Assistant',
      department: 'Operations',
      requestedBy: 'Claire Dubois',
      openings: 1,
      status: 'Pending',
      dateCreated: 'Nov 20, 2025',
    },
    {
      id: 20,
      jobTitle: 'Full Stack Engineer',
      department: 'Engineering',
      requestedBy: 'Lucas Silva',
      openings: 4,
      status: 'Approved',
      dateCreated: 'Nov 18, 2025',
    },
  ];

  return (
    <div className="my-5">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Job Requisitions</h1>
          <p className="text-sm text-[#7D7D7D]">Manage Job Requisitions</p>
        </hgroup>

        <div className="flex space-x-4">
          <Button className={'h-10 rounded-2xl px-6 text-sm'}>
            Create New Requisition
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
