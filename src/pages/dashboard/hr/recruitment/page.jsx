import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import MetricCard from '@/components/dashboard/hr/metric-card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import {
  MoreHorizontalIcon,
  EyeIcon,
  Edit,
  CheckCircle,
  XCircle,
  
} from 'lucide-react';
import PlusIcon from '@/assets/icons/plus.svg';
import ManpowerRequisitionForm from './form/requisition-form';
import { useJobRequisitionStore } from '@/stores/job-requisition-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { useDataTable } from '@/hooks/use-data-table';

export default function Recruitment() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { requisitions, isLoading, pagination, fetchRequisitions } =
    useJobRequisitionStore();

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

  const {
    currentTableData,
    pagination: tablePagination,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    setCurrentPage,
  } = useDataTable({
    data: rawTableData,
    pageSize: 3,
    filterKeys: ['title', 'department', 'status', 'requestedBy'],
  });

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
                  navigate(`/dashboard/hr/recruitment/detail/${row.id}`)
                }
              >
                <EyeIcon className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const requisitionToEdit = requisitions.find(
                    (j) => (j._id || j.id) === row.id
                  );
                  setEditingRequisition(requisitionToEdit);
                  setIsModalOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Approve', row.id)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Reject', row.id)}>
                <XCircle className="mr-2 h-4 w-4" />
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
    { label: 'Pending Approval', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
  ];

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
          isLoading={isLoading}
          pagination={tablePagination}
          onPageChange={setCurrentPage}
          placeholder="Search requests..."
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
