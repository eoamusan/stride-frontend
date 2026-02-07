import React, { useEffect, useState, useMemo } from 'react'; // 1. Import useState
import MetricCard from '@/components/dashboard/hr/metric-card';
import youtubeIcon from '@/assets/icons/youtube-red.png';
import { Button } from '@/components/ui/button';
import { TableActions } from '@/components/dashboard/hr/table';
import { Plus } from 'lucide-react';
import ManpowerRequisitionForm from './form/requisition-form';
import { useJobRequisitionStore } from '@/stores/job-requisition-store';

// 2. Import Dialog components (Adjust path if necessary)
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const tableHeaders = [
  { key: 'title', label: 'Title', className: '' },
  { key: 'department', label: 'Department', className: '' },
  { key: 'requestedBy', label: 'Requested By', className: '' },
  { key: 'openings', label: 'Openings', className: '' },
  { key: 'status', label: 'Status', className: '' },
  { key: 'dateCreated', label: 'Date Created', className: '' },
  { key: 'actions', label: 'Actions', className: 'text-right' },
];

const tableActions = [
  { title: 'Approve', action: 'approve' },
  { title: 'Reject', action: 'reject' },
];

export default function Recruitment() {
  // 3. State is optional if using DialogTrigger, but good for control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { requisitions, isLoading, pagination, fetchRequisitions } =
    useJobRequisitionStore();

  useEffect(() => {
    // Initial fetch
    fetchRequisitions(1);
  }, [fetchRequisitions]);

  const handleRequisitionCreated = () => {
    setIsModalOpen(false);
    fetchRequisitions(1);
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

  const tableData = useMemo(() => {
    return (requisitions || []).map((item) => ({
      id: item._id || item.id,
      title: item.title || item.jobTitle,
      department: item.department,
      requestedBy: item.requestedBy,
      openings: item.noOfOpenings,
      status: toTitleCase(item.status),
      dateCreated: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString()
        : item.dateCreated,
    }));
  }, [requisitions]);

  function toTitleCase(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  return (
    <div className="my-5">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">Job Requisitions</h1>
          <p className="text-sm text-[#7D7D7D]">Manage Job Requisitions</p>
        </hgroup>

        <div className="flex space-x-4">
          {/* 4. Wrap the Button in the Dialog Component */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className={'h-10 rounded-2xl px-6 text-sm'}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Requisition
              </Button>
            </DialogTrigger>

            {/* 5. The Content of the Modal */}
            <DialogContent className="max-h-[90vh] w-9/10 max-w-6xl overflow-y-auto rounded-2xl">
              <DialogTitle className="sr-only">
                Create New Requisition
              </DialogTitle>
              <DialogDescription className="sr-only">
                Form to create a new manpower requisition
              </DialogDescription>
              <ManpowerRequisitionForm onSuccess={handleRequisitionCreated} />
            </DialogContent>
          </Dialog>

          <Button variant={'outline'} className={'h-10 rounded-lg text-sm'}>
            <img src={youtubeIcon} alt="YouTube Icon" className="mr-1 h-4" />
            See video guide
          </Button>
        </div>
      </div>

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
        <TableActions
          tableData={tableData}
          tableHeaders={tableHeaders}
          title="Job Requisitions"
          path="/dashboard/hr/recruitment/detail"
          tableActions={tableActions}
          isLoading={isLoading}
          paginationData={{
            page: pagination.page,
            totalPages: pagination.totalPages,
            pageSize: pagination.limit,
            totalCount: pagination.totalDocs,
          }}
          onPageChange={(page) => fetchRequisitions(page)}
          pageSize={10}
        />
      </div>
    </div>
  );
}
