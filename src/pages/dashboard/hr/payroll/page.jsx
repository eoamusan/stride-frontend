import { useState, useMemo, useCallback, useEffect } from 'react';

import SearchInput from '@/components/customs/searchInput';
import Header from '@/components/customs/header';
import MetricCard from '@/components/dashboard/hr/metric-card';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTableStore } from '@/stores/table-store';
import { Button } from '@/components/ui/button';
import FilterIcon from '@/assets/icons/filter.svg';
import CustomTable from '@/components/customs/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { TableRow, TableCell } from '@/components/ui/table';
import { MoreHorizontalIcon } from 'lucide-react';
import PlusIcon from '@/assets/icons/plus.svg';
import CustomModal from '@/components/customs/modal';
import AddComponent from './form/addComponent';
import { useModalStore } from '@/stores/modal-store';
import EditIcon from '@/assets/icons/gray-edit.svg';
import DeleteIcon from '@/assets/icons/gray-delete.svg';
import { useGetSalaryComponentQuery } from '@/hooks/api/useGetSalaryComponentQuery';
import useDebounce from '@/hooks/useDebounce';
import { Spinner } from '@/components/ui/spinner';

export default function Payroll() {
  const [statusFilter, setStatusFilter] = useState('all');

  const currentPage = useTableStore((s) => s.currentPage);
  const setCurrentPage = useTableStore((state) => state.setCurrentPage);

  const handleOpenModal = useModalStore((s) => s.handleOpen);
  const handleCloseModal = useModalStore((s) => s.handleClose);
  const isAddComponentOpen = useModalStore(
    (s) => s.modals?.addComponent?.open ?? false
  );

  const [editingComponent, setEditingComponent] = useState(null);

  const handleAddComponentOpenChange = useCallback(
    (isOpen) => {
      if (isOpen) {
        handleOpenModal('addComponent');
      } else {
        handleCloseModal('addComponent');
        setEditingComponent(null);
      }
    },
    [handleCloseModal, handleOpenModal]
  );

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const pageSize = 5;

  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const {
    salaryComponents,
    pagination,
    isLoading: isSalaryComponentsLoading,
    isFetching: isSalaryComponentsFetching,
    refetch: refetchSalaryComponents,
  } = useGetSalaryComponentQuery({
    search: debouncedSearchTerm,
    page: currentPage,
    perPage: pageSize,
  });

  useEffect(() => {
    if (!Array.isArray(salaryComponents)) {
      setRows([]);
      return;
    }

    setRows(salaryComponents.map(mapSalaryComponentToRow).filter(Boolean));
  }, [salaryComponents]);

  useEffect(() => {
    if (
      pagination?.totalPages &&
      currentPage > pagination.totalPages &&
      pagination.totalPages > 0
    ) {
      setCurrentPage(pagination.totalPages);
    }
  }, [pagination?.totalPages, currentPage, setCurrentPage]);

  const handleComponentSaved = useCallback(async () => {
    await refetchSalaryComponents();
  }, [refetchSalaryComponents]);

  const openAddComponentModal = useCallback(
    (row = null) => {
      setEditingComponent(row);
      handleAddComponentOpenChange(true);
    },
    [handleAddComponentOpenChange]
  );

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (statusFilter && statusFilter !== 'all') {
        if ((r.type ?? '').toLowerCase() !== statusFilter.toLowerCase())
          return false;
      }
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        r.componentName.toLowerCase().includes(term) ||
        (r.amountType ?? '').toLowerCase().includes(term) ||
        (r.type ?? '').toLowerCase().includes(term)
      );
    });
  }, [rows, searchTerm, statusFilter]);

  const totalPages =
    pagination?.totalPages ??
    Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPageRows = filteredRows;

  const isTableLoading =
    isSalaryComponentsLoading || isSalaryComponentsFetching;

  const updateRow = (rowId, key, value) => {
    setRows((prev) =>
      prev.map((r) =>
        resolveRowIdentifier(r) === rowId ? { ...r, [key]: value } : r
      )
    );
  };

  const handleDelete = (rowId) => {
    setRows((prev) => prev.filter((r) => resolveRowIdentifier(r) !== rowId));
  };

  const typeToBadgeVariant = (type) => {
    if (!type) return 'default';
    const t = type.toLowerCase();
    if (t === 'taxable') return 'warn';
    if (t === 'earning') return 'success';
    if (t === 'deduction') return 'danger';
    return 'default';
  };

  if (isTableLoading) {
    return (
      <div className="flex items-center justify-center mt-12">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="my-5 flex flex-col gap-4">
      <Header
        title="Payroll Configuration"
        description="Define salary components and structure"
        hasYoutubeButton
      >
        <Button
          onClick={() => openAddComponentModal(null)}
          className="rounded-xl md:py-6"
        >
          <img src={PlusIcon} alt="Add Component" className="mr-1 h-4" /> Add
          Component
        </Button>
      </Header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metricsData.map((metric) => (
          <MetricCard
            key={metric.title}
            {...metric}
            emptyState={false}
            emojis={metric.emojis}
          />
        ))}
      </div>

      <Card className="mt-2 w-full border-0 shadow-none">
        <CardContent>
          <div className="mb-2 flex flex-col justify-between gap-2 md:flex-row md:items-center">
            <h2 className="font-bold">Salary Components</h2>

            <div className="flex items-center gap-3">
              <SearchInput
                placeholder="Search component..."
                value={searchTerm}
                onValueChange={setSearchTerm}
                resetPageOnChange
                onResetPage={() => setCurrentPage(1)}
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={`h-12 w-12 rounded-xl ${statusFilter !== 'all' ? 'border-blue-200 bg-blue-50' : ''}`}
                  >
                    <img src={FilterIcon} alt="Filter Icon" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  {filterData.map((filter) => (
                    <DropdownMenuItem
                      key={filter.key}
                      onClick={() => handleStatusFilterChange(filter.key)}
                      className={
                        statusFilter === filter.key ? 'bg-blue-50' : ''
                      }
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${filter.color}`}
                        ></span>
                        {filter.label}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <CustomTable
            tableHeaders={tableHeaders}
            totalPages={totalPages}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            hasNoData={currentPageRows.length === 0 && !isTableLoading}
          >
            {!isTableLoading &&
              currentPageRows.length > 0 &&
              currentPageRows.map((row) => {
                const rowIdentifier = resolveRowIdentifier(row);

                return (
                  <TableRow key={rowIdentifier}>
                    <TableCell className="py-4 font-medium">
                      {row.componentName}
                    </TableCell>

                    <TableCell className="py-4 font-medium">
                      {row.amountType}
                    </TableCell>

                    <TableCell className="py-4 font-medium">
                      <Switch
                        checked={!!row.taxable}
                        onCheckedChange={(checked) =>
                          updateRow(rowIdentifier, 'taxable', checked)
                        }
                      />
                    </TableCell>

                    <TableCell className="py-4 font-medium">
                      <Switch
                        checked={!!row.recurring}
                        onCheckedChange={(checked) =>
                          updateRow(rowIdentifier, 'recurring', checked)
                        }
                      />
                    </TableCell>

                    <TableCell className="py-4 font-medium">
                      <Badge
                        variant={typeToBadgeVariant(row.type)}
                        className="min-w-[98px] px-6 py-2"
                      >
                        {row.type}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-4 text-right md:w-5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                          >
                            <MoreHorizontalIcon />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              openAddComponentModal({ id: rowIdentifier, row })
                            }
                          >
                            <img
                              src={EditIcon}
                              alt="Edit"
                              className="mr-1 h-4"
                            />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(rowIdentifier)}
                          >
                            <img
                              src={DeleteIcon}
                              alt="Delete"
                              className="mr-1 h-4"
                            />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
          </CustomTable>
        </CardContent>
      </Card>

      <CustomModal
        title={
          editingComponent ? 'Edit Salary Component' : 'Add Salary Component'
        }
        open={isAddComponentOpen}
        handleClose={handleAddComponentOpenChange}
      >
        <AddComponent
          open={isAddComponentOpen}
          onOpenChange={handleAddComponentOpenChange}
          data={
            editingComponent?.row
              ? {
                  name: editingComponent.row.componentName ?? '',
                  type: (editingComponent.row.type ?? '').toLowerCase(),
                  amountType:
                    (editingComponent.row.amountType ?? '').toLowerCase() ===
                    'percentage'
                      ? 'percentage'
                      : 'fixed',
                  taxable: !!editingComponent.row.taxable,
                  recurringMonthly: !!editingComponent.row.recurring,
                }
              : null
          }
          componentId={
            editingComponent?.id ??
            editingComponent?.row?.id ??
            editingComponent?.row?._id ??
            editingComponent?.row?.componentId ??
            null
          }
          onSave={handleComponentSaved}
        />
      </CustomModal>
    </div>
  );
}

function mapSalaryComponentToRow(component) {
  if (!component || typeof component !== 'object') return null;

  const identifier =
    component.id ||
    component._id ||
    component.componentId ||
    component.uuid ||
    component.componentName ||
    component.name ||
    null;

  const amountTypeLabel = formatAmountTypeLabel(
    component.amountType ?? component.amount_type ?? component.amount_type_label
  );

  const typeLabel = formatComponentTypeLabel(
    component.componentType ?? component.type ?? component.category
  );

  return {
    id: identifier,
    componentId:
      identifier ||
      component.componentName ||
      component.name ||
      component.uuid ||
      null,
    componentName:
      component.componentName ||
      component.name ||
      component.title ||
      'Untitled Component',
    amountType: amountTypeLabel,
    taxable: normalizeBoolean(
      component.taxableComponent ?? component.taxable ?? component.isTaxable
    ),
    recurring: normalizeBoolean(
      component.recurringMonthly ??
        component.recurring ??
        component.isRecurring ??
        component.recurring_component
    ),
    type: typeLabel,
  };
}

function resolveRowIdentifier(row) {
  if (!row) return undefined;
  return row.id || row.componentId || row.componentName || row.name;
}

function formatAmountTypeLabel(amountType) {
  if (!amountType) return 'Fixed';
  const normalized = amountType.toString().toLowerCase();
  if (normalized === 'percentage' || normalized === 'percent')
    return 'Percentage';
  if (normalized === 'fixed') return 'Fixed';
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function formatComponentTypeLabel(type) {
  if (!type) return 'Earning';
  const normalized = type.toString().toLowerCase();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function normalizeBoolean(value) {
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1';
  }
  return Boolean(value);
}

const sampleChartData = [
  { month: 'Jan', month1: 600 },
  { month: 'Feb', month2: 800 },
  { month: 'Mar', month3: 1000 },
];

const metricsData = [
  {
    title: 'Total Salary Components',
    value: 150,
    percentage: 5,
    chartData: sampleChartData,
  },
  {
    title: 'Earning Components',
    value: 20,
    percentage: -2,
    chartData: sampleChartData,
    isPositive: false,
  },
  {
    title: 'Deduction Components',
    value: 70,
    percentage: 5,
    chartData: sampleChartData,
  },
  {
    title: 'Taxable Components',
    value: 50,
    percentage: 2,
    chartData: sampleChartData,
  },
];

const filterData = [
  { key: 'all', label: 'All Components' },
  { key: 'earning', label: 'Earning Components', color: 'bg-green-500' },
  { key: 'deduction', label: 'Deduction Components', color: 'bg-red-500' },
  { key: 'taxable', label: 'Taxable Components', color: 'bg-yellow-500' },
];

const tableHeaders = [
  { key: 'componentName', label: 'Component Name', className: '' },
  { key: 'amountType', label: 'Amount Type', className: '' },
  { key: 'taxable', label: 'Taxable', className: '' },
  { key: 'recurring', label: 'Recurring', className: '' },
  { key: 'type', label: 'Type', className: '' },
  { key: 'actions', label: 'Actions', className: 'text-right' },
];
