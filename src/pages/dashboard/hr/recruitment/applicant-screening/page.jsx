import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import MetricCard from '@/components/dashboard/hr/metric-card';
import { dummyJobRequests } from '../job-requests';
import Header from '@/components/customs/header';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { useDataTable } from '@/hooks/use-data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CheckCircle,
  EyeIcon,
  MoreHorizontalIcon,
  XCircle,
} from 'lucide-react';
import calenderIcon from '@/assets/icons/calendar.svg';

export default function ApplicantScreening() {
  const navigate = useNavigate();

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

  function toTitleCase(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  const rawTableData = useMemo(() => {
    return dummyJobRequests.flatMap((job) =>
      (job.applicants || []).map((applicant) => ({
        id: applicant.id,
        applicantID: applicant.id,
        applicantName: applicant.name,
        applicantDate: applicant.date,
        roleApplied: job.title,
        status: toTitleCase(applicant.status),
      }))
    );
  }, []);

  const {
    currentTableData,
    pagination,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    setCurrentPage,
  } = useDataTable({
    data: rawTableData,
    pageSize: 3,
    filterKeys: ['applicantName', 'roleApplied', 'status'],
  });

  // Define Columns
  const columns = [
    {
      header: 'Applicant Name',
      accessorKey: 'applicantName',
    },
    {
      header: 'Applicant Date',
      accessorKey: 'applicantDate',
    },
    {
      header: 'Role Applied',
      accessorKey: 'roleApplied',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => {
        const statusColors = {
          Pending: { bg: '#CE8D001A', text: '#CE8D00' },
          Approved: { bg: '#0596691A', text: '#059669' },
          Rejected: { bg: '#DC26261A', text: '#DC2626' },
          Review: { bg: '#F39C121A', text: '#F39C12' },
          Interviewing: { bg: '#3300C91A', text: '#3300C9' },
          Shortlisted: { bg: '#3498DB1A', text: '#3498DB' },
        };

        const style = statusColors[row.status] || {
          bg: '#000',
          text: '#fff',
        };

        return (
          <span
            className="flex max-w-26 justify-center overflow-hidden rounded-full px-3 py-2 text-xs"
            style={{
              backgroundColor: style.bg,
              color: style.text,
            }}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      header: '',
      accessorKey: 'actions',
      className: 'text-right',
      cell: (row) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontalIcon className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  navigate(
                    `/dashboard/hr/recruitment/applicant-screening/applicant/${row.applicantID}`
                  )
                }
              >
                <EyeIcon className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CheckCircle />
                Shortlist
              </DropdownMenuItem>
              <DropdownMenuItem>
                <img src={calenderIcon} alt="Interview Calender" />
                Interview
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CheckCircle />
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem>
                <XCircle />
                Reject
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const dropdownItems = [
    { label: 'All Statuses', value: 'all' },
    { label: 'Interviewing', value: 'interviewing' },
    { label: 'Shortlisted', value: 'shortlisted' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
  ];

  return (
    <div className="my-5">
      <Header
        title="Applicant Screening"
        description="Review and manage applicants for open job posting"
      />

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
        <DataTable
          columns={columns}
          data={currentTableData}
          title="Applicants"
          pagination={pagination}
          onPageChange={setCurrentPage}
          placeholder="Search applicants..."
          inputValue={searchTerm}
          handleInputChange={(e) => setSearchTerm(e.target.value)}
          dropdownItems={dropdownItems}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          setSearchTerm={setSearchTerm}
        />
      </div>
    </div>
  );
}
