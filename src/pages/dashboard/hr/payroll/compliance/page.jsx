import { useCallback, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';

import { CustomButton } from '@/components/customs';
import Header from '@/components/customs/header';
import CustomModal from '@/components/customs/modal';

import PlusIcon from '@/assets/icons/plus.svg';
import MetricCard from '@/components/dashboard/hr/metric-card';
import { Card } from '@/components/ui/card';
import { useTableStore } from '@/stores/table-store';
import { resolveEntityIdentifier, normalizeStatus } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

import {
  useGetAllObligationQuery,
  PAYROLL_OBLIGATIONS_QUERY_KEY,
} from '@/hooks/api/useGetAllObligationQuery';
import { useCreateObligationMutation } from '@/hooks/api/useCreateObligationMutation';
import { useUpdateObligationMutation } from '@/hooks/api/useUpdateObligationMutation';
import { useMarkObligationAsPaidMutation } from '@/hooks/api/useMarkObligationAsPaidMutatio';
import { useDeleteObligationMutation } from '@/hooks/api/useDeleteObligationMutation';
import {
  useGetObligationStatsQuery,
  PAYROLL_OBLIGATIONS_STATS_QUERY_KEY,
} from '@/hooks/api/useGetObligationStatsQuery';

import ComplianceTable from './components/complianceTable';
import AddObligationForm from './components/addObligation';

const PAGE_SIZE = 5;

export default function Compliance() {
  const queryClient = useQueryClient();
  const currentPage = useTableStore((state) => state.currentPage);
  const setCurrentPage = useTableStore((state) => state.setCurrentPage);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingObligation, setEditingObligation] = useState(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const { obligations, pagination, isLoading, isFetching } =
    useGetAllObligationQuery({
      search: debouncedSearchTerm,
      page: currentPage,
      perPage: PAGE_SIZE,
    });

  const { stats } = useGetObligationStatsQuery();

  const { createObligationHandler, isCreateObligationLoading } =
    useCreateObligationMutation();
  const { updateObligationHandler, isUpdateObligationLoading } =
    useUpdateObligationMutation();
  const { markObligationAsPaidHandler, isMarkObligationAsPaidLoading } =
    useMarkObligationAsPaidMutation();
  const { deleteObligationHandler, isDeleteObligationLoading } =
    useDeleteObligationMutation();

  const invalidateObligationData = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: [PAYROLL_OBLIGATIONS_QUERY_KEY],
      }),
      queryClient.invalidateQueries({
        queryKey: [PAYROLL_OBLIGATIONS_STATS_QUERY_KEY],
      }),
    ]);
  }, [queryClient]);

  const handleModalToggle = (nextOpen) => {
    setIsModalOpen(nextOpen);
    if (!nextOpen) {
      setEditingObligation(null);
      setModalMode('create');
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setEditingObligation(null);
    handleModalToggle(true);
  };

  const handleEditObligation = (obligation) => {
    if (!obligation) return;
    if (normalizeStatus(obligation.status) === 'paid') return;
    setModalMode('edit');
    setEditingObligation(obligation);
    handleModalToggle(true);
  };

  const normalizeFormValues = (values) => ({
    obligationName: values.name.trim(),
    obligationType: values.type.trim(),
    period: values.period ? format(values.period, 'MMMM yyyy') : '',
    dueDate: values.dueDate ? values.dueDate.toISOString() : null,
    amount: values.amount,
  });

  const handleFormSubmit = async (values) => {
    const payload = normalizeFormValues(values);

    if (modalMode === 'edit' && editingObligation) {
      const id = resolveEntityIdentifier(editingObligation);
      if (!id) return;

      await updateObligationHandler(
        id,
        {
          ...payload,
          status: editingObligation.status,
        },
        {
          onSuccess: async () => {
            await invalidateObligationData();
            handleModalToggle(false);
          },
        }
      );
      return;
    }

    await createObligationHandler(payload, {
      onSuccess: async () => {
        await invalidateObligationData();
        handleModalToggle(false);
        setCurrentPage(1);
      },
    });
  };

  const handleMarkAsPaid = async (obligation) => {
    const id = resolveEntityIdentifier(obligation);
    if (!id) return;

    await markObligationAsPaidHandler(id, {
      onSuccess: async () => {
        await invalidateObligationData();
      },
    });
  };

  const handleDeleteObligation = async (obligation) => {
    const id = resolveEntityIdentifier(obligation);
    if (!id) return;

    await deleteObligationHandler(id, {
      onSuccess: async () => {
        await invalidateObligationData();
        if (pagination?.page > 1 && (obligations?.length ?? 0) === 1) {
          setCurrentPage(Math.max(1, pagination.page - 1));
        }
      },
    },);
  };

  const metricsData = useMemo(() => {
    const total =
      stats?.totalObligations ??
      stats?.total ??
      stats?.count ??
      stats?.items ??
      0;
    const completed = stats?.completed ?? stats?.paid ?? 0;
    const upcoming = stats?.upcoming ?? stats?.pending ?? 0;
    const overdue = stats?.overdue ?? stats?.late ?? 0;

    const shareOfTotal = (value) =>
      total > 0 ? Math.round((Number(value) / total) * 100) : 0;

    return [
      {
        key: 'total',
        title: 'Total Obligations',
        value: total,
        percentage: stats?.totalChange ?? 0,
        isPositive: (stats?.totalChange ?? 0) >= 0,
      },
      {
        key: 'completed',
        title: 'Completed',
        value: completed,
        percentage: shareOfTotal(completed),
        isPositive: true,
      },
      {
        key: 'upcoming',
        title: 'Upcoming',
        value: upcoming,
        percentage: shareOfTotal(upcoming),
        isPositive: true,
      },
      {
        key: 'overdue',
        title: 'Overdue',
        value: overdue,
        percentage: shareOfTotal(overdue),
        isPositive: overdue === 0,
      },
    ];
  }, [stats]);

  const actionLoading = {
    edit: isUpdateObligationLoading,
    markPaid: isMarkObligationAsPaidLoading,
    delete: isDeleteObligationLoading,
  };

  const isModalSubmitting =
    modalMode === 'edit'
      ? isUpdateObligationLoading
      : isCreateObligationLoading;

  return (
    <div className="my-5 flex flex-col gap-4">
      <Header
        title="Compliance"
        description="Track statutory obligations and due dates"
        hasYoutubeButton
      >
        <CustomButton
          className="w-full rounded-xl py-6 text-sm md:w-auto"
          onClick={openCreateModal}
        >
          <img src={PlusIcon} alt="add obligation" className="mr-1" />
          Add New Obligation
        </CustomButton>
      </Header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricsData.map((metric) => (
          <MetricCard key={metric.key} {...metric} emptyState={!stats} />
        ))}
      </div>

      <Card className="mt-2 w-full border-0 shadow-none">
        <ComplianceTable
          rows={obligations}
          isLoading={isLoading || isFetching}
          totalPages={pagination?.totalPages ?? 1}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onEdit={handleEditObligation}
          onMarkPaid={handleMarkAsPaid}
          onDelete={handleDeleteObligation}
          actionLoading={actionLoading}
        />
      </Card>

      <CustomModal
        title={modalMode === 'edit' ? 'Edit Obligation' : 'Add New Obligation'}
        open={isModalOpen}
        handleClose={handleModalToggle}
      >
        <AddObligationForm
          open={isModalOpen}
          onOpenChange={handleModalToggle}
          onSubmit={handleFormSubmit}
          mode={modalMode}
          initialData={editingObligation}
          isSubmitting={isModalSubmitting}
        />
      </CustomModal>
    </div>
  );
}
