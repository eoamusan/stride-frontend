import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import MetricCard from '@/components/dashboard/hr/metric-card';
import youtubeIcon from '@/assets/icons/youtube-red.png';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import {
  FilterIcon,
  MoreHorizontalIcon,
  SearchIcon,
  EyeIcon,
  Edit,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import PlusIcon from '@/assets/icons/plus.svg';
import ManpowerRequisitionForm from './form/requisition-form';
import { useJobRequisitionStore } from '@/stores/job-requisition-store';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import Header from '@/components/customs/header';

export default function Recruitment() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { requisitions, isLoading, pagination, fetchRequisitions } =
    useJobRequisitionStore();

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const [editingRequisition, setEditingRequisition] = useState(null);

  useEffect(() => {
    // Initial fetch - fetch all for metrics and client-side pagination
    fetchRequisitions(1, 1000);
  }, [fetchRequisitions]);

  const handleRequisitionCreated = () => {
    setIsModalOpen(false);
    setEditingRequisition(null);
    fetchRequisitions(1, 1000);
  };

  // ... (metrics logic unchanged)

  // Define actions that were previously passed to TableActions

  const metricCardsData = useMemo(() => {
    const data = requisitions || [];
    const today = new Date();

    // Helper to generate last 4 months buckets (Current + 3 prior)
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

    const processTrend = (filterFn, valueFn) => {
      const months = getLast4Months();
      data.forEach((item) => {
        if (filterFn && !filterFn(item)) return;

        const dateStr = item.createdAt || item.dateCreated;
        if (!dateStr) return;

        const date = new Date(dateStr);
        const bucket = months.find(
          (m) => m.month === date.getMonth() && m.year === date.getFullYear()
        );

        if (bucket) {
          bucket.value += valueFn ? valueFn(item) : 1;
        }
      });

      const totalValue = months.reduce((acc, m) => acc + m.value, 0);

      // Improvise: If no data, show a small placeholder chart
      if (totalValue === 0) {
        return {
          chartData: months.map((m, i) => ({
            month: m.name,
            value: [15, 25, 35, 45][i] || 20, // Deterministic small values
          })),
          percentage: 0,
        };
      }

      const currentMonthVal = months[3].value;
      const prevMonthVal = months[2].value;

      let percentage = 0;
      if (prevMonthVal > 0) {
        percentage = ((currentMonthVal - prevMonthVal) / prevMonthVal) * 100;
      } else if (currentMonthVal > 0) {
        percentage = 100;
      }

      return {
        chartData: months.map((m) => ({ month: m.name, value: m.value })),
        percentage: Math.round(percentage),
      };
    };

    // 1. Total Requisitions Trend
    const totalTrend = processTrend(() => true);

    // 2. Pendings Trend
    const pendingTrend = processTrend(
      (item) => (item.status || '').toLowerCase() === 'pending'
    );

    // 3. Approved Trend
    const approvedTrend = processTrend(
      (item) => (item.status || '').toLowerCase() === 'approved'
    );

    // 4. Open Positions Trend
    const openingsTrend = processTrend(
      () => true,
      (item) => Number(item.openings) || Number(item.noOfOpenings) || 0
    );

    const totalRequisitions = pagination?.totalDocs || data.length;
    const pendingRequisitions = data.filter(
      (item) => (item.status || '').toLowerCase() === 'pending'
    ).length;
    const approvedRequisitions = data.filter(
      (item) => (item.status || '').toLowerCase() === 'approved'
    ).length;
    const totalOpenPositions = data.reduce(
      (acc, item) =>
        acc + (Number(item.openings) || Number(item.noOfOpenings) || 0),
      0
    );

    return [
      {
        title: 'Total Requisitions',
        value: totalRequisitions,
        percentage: totalTrend.percentage,
        isPositive: totalTrend.percentage >= 0,
        chartData: totalTrend.chartData,
      },
      {
        title: 'Pendings',
        value: pendingRequisitions,
        percentage: pendingTrend.percentage,
        isPositive: pendingTrend.percentage >= 0,
        chartData: pendingTrend.chartData,
      },
      {
        title: 'Approved Requisitions',
        value: approvedRequisitions,
        percentage: approvedTrend.percentage,
        isPositive: approvedTrend.percentage >= 0,
        chartData: approvedTrend.chartData,
      },
      {
        title: 'Total Open Positions',
        value: totalOpenPositions,
        percentage: openingsTrend.percentage,
        isPositive: openingsTrend.percentage >= 0,
        chartData: openingsTrend.chartData,
      },
    ];
  }, [requisitions, pagination]);

  function toTitleCase(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  // Define actions that were previously passed to TableActions
  const handleAction = (action, request) => {
    if (action === 'edit') {
      const fullRequisition = requisitions.find(
        (r) => (r._id || r.id) === (request.id || request._id)
      );
      setEditingRequisition(fullRequisition || request);
      setIsModalOpen(true);
    }
    // Implement or mock the action logic here
    console.log(`Action: ${action}, ID: ${request.id}`);
  };

  // Filter the data locally for now as the API might support server-side filtering differently
  // or if we rely on the store's fetched data which is paginated.
  // Note: If the backend supports filtering, we should pass these filters to fetchRequisitions.
  // For now, assuming client-side filtering on the current page of data (or if data is all fetched).
  // However, since we have pagination, client-side filtering only filters the current page which is weird.
  // Ideally, search/filter should trigger a new fetch.
  // Given the previous implementation did client-side filtering on `tableData` prop,
  // I will replicate that logic but apply it to the data passed to DataTable.

  const rawTableData = (requisitions || []).map((item) => {
    const getRequesterName = (requester) => {
      if (!requester) return null;
      if (typeof requester === 'string') return requester;
      return (
        requester.name ||
        (requester.firstName && requester.lastName
          ? `${requester.firstName} ${requester.lastName}`
          : null) ||
        requester.username ||
        'Unknown'
      );
    };

    const requestedBy =
      getRequesterName(item.requestedBy) ||
      getRequesterName(item.user) ||
      'N/A';

    return {
      id: item._id || item.id,
      title: item.title || item.jobTitle,
      department: item.department,
      requestedBy: requestedBy,
      openings: item.noOfOpenings,
      status: toTitleCase(item.status),
      applicantID: item.applicantID, // Preserve if needed
      dateCreated: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString()
        : item.dateCreated,
    };
  });

  const filteredData = useMemo(() => {
    return rawTableData.filter((request) => {
      // Status filter
      if (statusFilter !== 'all') {
        const statusMatch =
          request.status.toLowerCase() === statusFilter.toLowerCase();
        if (!statusMatch) return false;
      }

      // Search filter
      if (!searchTerm) return true;

      return (
        request.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.requestedBy?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [rawTableData, statusFilter, searchTerm]);

  // Define Columns
  const columns = [
    { header: 'Title', accessorKey: 'title' },
    { header: 'Department', accessorKey: 'department' },
    { header: 'Requested By', accessorKey: 'requestedBy' },
    { header: 'Openings', accessorKey: 'openings' },
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
            className="inline-block w-24 overflow-hidden rounded-full py-2 text-center text-xs font-medium"
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
    { header: 'Date Created', accessorKey: 'dateCreated' },
    {
      header: 'Actions',
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
                    `/dashboard/hr/recruitment/detail/${row.applicantID || row.id}`
                  )
                }
              >
                <EyeIcon />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('edit', row)}>
                <Edit />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('approve', row)}>
                <CheckCircle />
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction('reject', row)}>
                <XCircle />
                Reject
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigate(`/dashboard/hr/recruitment/job-postings`)
                }
              >
                <PlusIcon />
                Create Job
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  // Action Element (Search and Filter)
  const actionElement = (
    <div className="flex w-full items-center gap-3 md:w-auto">
      <div className="relative w-full">
        <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
        <Input
          placeholder="Search requests..."
          className="w-full pl-10 md:max-w-80"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={
              statusFilter !== 'all' ? 'border-blue-200 bg-blue-50' : ''
            }
          >
            <FilterIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => setStatusFilter('all')}
            className={statusFilter === 'all' ? 'bg-blue-50' : ''}
          >
            All Statuses
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setStatusFilter('pending')}
            className={statusFilter === 'pending' ? 'bg-blue-50' : ''}
          >
            Pending Approval
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setStatusFilter('approved')}
            className={statusFilter === 'approved' ? 'bg-blue-50' : ''}
          >
            Approved
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setStatusFilter('rejected')}
            className={statusFilter === 'rejected' ? 'bg-blue-50' : ''}
          >
            Rejected
          </DropdownMenuItem>
          {(statusFilter !== 'all' || searchTerm) && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setStatusFilter('all');
                  setSearchTerm('');
                }}
                className="text-red-600 hover:text-red-700"
              >
                Clear All Filters
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  // Client-side pagination logic
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentTableData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="my-5">
      <Header
        title="Job Requisitions"
        description="Manage Job Requisitions"
        hasYoutubeButton
      >
        <Dialog
          open={isModalOpen}
          onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) setEditingRequisition(null);
          }}
        >
          <DialogTrigger asChild>
            <Button
              className="rounded-xl md:py-6"
              onClick={() => setEditingRequisition(null)}
            >
              <img
                src={PlusIcon}
                alt="Create New Requisition"
                className="mr-1 h-4"
              />{' '}
              Create New Requisition
            </Button>
          </DialogTrigger>

          <DialogContent className="max-h-[80vh] w-full overflow-y-auto rounded-2xl bg-gray-50 md:max-w-2xl">
            <DialogTitle className="sr-only">
              {editingRequisition
                ? 'Edit Man Power Requisition Form'
                : 'Man Power Requisition Form'}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Form to {editingRequisition ? 'edit' : 'create'} Man Power
              Requisition Form
            </DialogDescription>
            <ManpowerRequisitionForm
              onSuccess={handleRequisitionCreated}
              initialData={editingRequisition}
            />
          </DialogContent>
        </Dialog>
      </Header>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metricCardsData.map((metric) => (
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
          title="Job Requisitions"
          actionElement={actionElement}
          isLoading={isLoading}
          pagination={{
            page: currentPage,
            totalPages: totalPages,
          }}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
