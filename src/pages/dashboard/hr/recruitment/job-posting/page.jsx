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

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const pageSize = 5;

  useEffect(() => {
    // Fetch all for client-side functionality
    fetchJobPostings(1, 1000);
  }, [fetchJobPostings]);

  const handleJobPosted = () => {
    setIsModalOpen(false);
  };

  const handleCloseJob = async (id) => {
    if (window.confirm('Are you sure you want to close this job?')) {
      try {
        await updateJobPosting({ id, data: { status: 'Closed' } });
        toast.success('Job closed successfully');
      } catch (error) {
        toast.error('Failed to close job');
      }
    }
  };

  // --- Metrics Calculation ---
  const metricsData = useMemo(() => {
    const data = jobPostings || [];
    const today = new Date();

    const getLast4Months = () => {
      const months = [];
      for (let i = 3; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        months.push({
          name: d.toLocaleString('default', { month: 'short' }),
          month: d.getMonth(),
          year: d.getFullYear(),
          value: 0,
        });
      }
      return months;
    };

    const processTrend = (filterFn) => {
      const months = getLast4Months();
      data.forEach((item) => {
        if (filterFn && !filterFn(item)) return;
        const dateStr = item.createdAt;
        if (!dateStr) return;
        const date = new Date(dateStr);
        const bucket = months.find(
          (m) => m.month === date.getMonth() && m.year === date.getFullYear()
        );
        if (bucket) bucket.value++;
      });

      const totalValue = months.reduce((acc, m) => acc + m.value, 0);

      if (totalValue === 0) {
        return { chartData: months, percentage: 0 };
      }

      const currentMonthVal = months[3].value;
      const prevMonthVal = months[2].value;
      let percentage = 0;
      if (prevMonthVal > 0)
        percentage = ((currentMonthVal - prevMonthVal) / prevMonthVal) * 100;
      else if (currentMonthVal > 0) percentage = 100;

      return { chartData: months, percentage: Math.round(percentage) };
    };

    // 1. Total Postings
    const totalTrend = processTrend(() => true);

    // 2. Active Jobs
    const activeTrend = processTrend((item) => item.status === 'Active');

    // 3. Closed Jobs
    const closedTrend = processTrend((item) => item.status === 'Closed');

    // 4. Draft Jobs
    const draftTrend = processTrend((item) => item.status === 'Draft');

    return [
      {
        title: 'Total Postings',
        value: data.length,
        percentage: totalTrend.percentage,
        isPositive: totalTrend.percentage >= 0,
        chartData: totalTrend.chartData,
      },
      {
        title: 'Active Jobs',
        value: data.filter((i) => i.status === 'Active').length,
        percentage: activeTrend.percentage,
        isPositive: activeTrend.percentage >= 0,
        chartData: activeTrend.chartData,
      },
      {
        title: 'Closed Jobs',
        value: data.filter((i) => i.status === 'Closed').length,
        percentage: closedTrend.percentage,
        isPositive: closedTrend.percentage >= 0,
        chartData: closedTrend.chartData,
      },
      {
        title: 'Draft Jobs',
        value: data.filter((i) => i.status === 'Draft').length,
        percentage: draftTrend.percentage,
        isPositive: draftTrend.percentage >= 0,
        chartData: draftTrend.chartData,
      },
    ];
  }, [jobPostings]);

  // --- Table Data & Filtering ---
  const rawTableData = useMemo(() => {
    // Clone and sort to avoid mutating the store state directly if it's frozen
    const sortedPostings = [...jobPostings].sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return sortedPostings.map((item) => ({
      id: item._id || item.id,
      title: item.title, // Corrected from jobTitle based on API log
      department: item.jobRequisitionId?.department || item.department,
      application: 0, // Placeholder
      postedDate: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString()
        : 'N/A',
      status: item.status || 'Active', // Default to Active instead of Pending
    }));
  }, [jobPostings]);

  const filteredData = useMemo(() => {
    let data = rawTableData;

    if (statusFilter !== 'all') {
      data = data.filter(
        (item) => item.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      data = data.filter(
        (item) =>
          item.title?.toLowerCase().includes(lower) ||
          item.department?.toLowerCase().includes(lower) ||
          item.status?.toLowerCase().includes(lower)
      );
    }
    return data;
  }, [rawTableData, statusFilter, searchTerm]);

  // Pagination Logic
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentTableData = filteredData.slice(
    startIndex,
    startIndex + pageSize
  );

  const columns = [
    { header: 'Job Title', accessorKey: 'title' },
    { header: 'Department', accessorKey: 'department' },
    { header: 'Applications', accessorKey: 'application' },
    { header: 'Date Posted', accessorKey: 'postedDate' },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => {
        let status = row.status;
        // Map 'CREATE' or 'create' to 'Active' for display
        if (status?.toUpperCase() === 'CREATE') {
          status = 'Active';
        }

        const statusColors = {
          Active: { bg: '#0596691A', text: '#059669' },
          Draft: { bg: '#F39C121A', text: '#F39C12' },
          Closed: { bg: '#3741511A', text: '#374151' },
        };
        const style = statusColors[status] || {
          bg: '#CE8D001A',
          text: '#CE8D00',
        };

        return (
          <span
            className="inline-block w-24 overflow-hidden rounded-full py-2 text-center text-xs font-medium"
            style={{
              backgroundColor: style.bg,
              color: style.text,
            }}
          >
            {status}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      className: 'text-right',
      cell: (row) => (
        <div className="flex justify-end">
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
                    `/dashboard/hr/recruitment/job-postings/detail/${row.id}`
                  )
                }
              >
                <EyeIcon className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const jobToEdit = jobPostings.find(
                    (j) => (j._id || j.id) === row.id
                  );
                  setEditingJob(jobToEdit);
                  setIsModalOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCloseJob(row.id)}>
                <XCircle className="mr-2 h-4 w-4" />
                Close
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log('Delete', row.id)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
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

          <Button
            className={'h-10 rounded-2xl px-6 text-sm'}
            onClick={() => {
              setEditingJob(null);
              setIsModalOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Post New Jobs
          </Button>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-h-[80vh] w-full overflow-y-auto rounded-2xl bg-gray-50 md:max-w-2xl">
              <DialogTitle className="sr-only">
                {editingJob ? 'Edit Job Posting' : 'Post New Job'}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {editingJob
                  ? 'Form to edit job posting'
                  : 'Form to post a new job'}
              </DialogDescription>
              <JobPostingForm
                initialData={editingJob}
                onSuccess={() => {
                  fetchJobPostings(1, 1000);
                  handleJobPosted();
                }}
                onCancel={() => setIsModalOpen(false)}
              />
            </DialogContent>
          </Dialog>
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
