import { useState, useMemo } from 'react';

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

export default function Payroll() {
  const [statusFilter, setStatusFilter] = useState('all');

  const currentPage = useTableStore((s) => s.currentPage);
  const setCurrentPage = useTableStore((state) => state.setCurrentPage);

  const handleOpenModal = useModalStore((s) => s.handleOpen);
  const handleCloseModal = useModalStore((s) => s.handleClose);
  const isAddComponentOpen = useModalStore(
    (s) => s.modals?.addComponent?.open ?? false
  );

  const handleAddComponentOpenChange = (isOpen) => {
    if (isOpen) handleOpenModal('addComponent');
    else handleCloseModal('addComponent');
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const [rows, setRows] = useState(tableData);
  const [searchTerm, setSearchTerm] = useState('');

  const pageSize = 5;

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

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const currentPageRows = filteredRows.slice(startIndex, startIndex + pageSize);

  const updateRow = (rowId, key, value) => {
    setRows((prev) =>
      prev.map((r) => (r.componentName === rowId ? { ...r, [key]: value } : r))
    );
  };

  const handleDelete = (rowId) => {
    setRows((prev) => prev.filter((r) => r.componentName !== rowId));
  };

  const typeToBadgeVariant = (type) => {
    if (!type) return 'default';
    const t = type.toLowerCase();
    if (t === 'taxable') return 'warn';
    if (t === 'earning') return 'success';
    if (t === 'deduction') return 'danger';
    return 'default';
  };

  return (
    <div className="my-5 flex flex-col gap-4">
      <Header
        title="Payroll Configuration"
        description="Define salary components and structure"
        hasYoutubeButton
      >
        <Button
          onClick={() => handleOpenModal('addComponent')}
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
            <h2 className="font-bold">Salary Component</h2>

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
                    className={
                      statusFilter !== 'all' ? 'border-blue-200 bg-blue-50' : ''
                    }
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
          >
            {currentPageRows.map((row) => (
              <TableRow key={row.componentName}>
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
                      updateRow(row.componentName, 'taxable', checked)
                    }
                  />
                </TableCell>

                <TableCell className="py-4 font-medium">
                  <Switch
                    checked={!!row.recurring}
                    onCheckedChange={(checked) =>
                      updateRow(row.componentName, 'recurring', checked)
                    }
                  />
                </TableCell>

                <TableCell className="py-4 font-medium">
                  <Badge
                    variant={typeToBadgeVariant(row.type)}
                    className="px-6 py-2"
                  >
                    {row.type}
                  </Badge>
                </TableCell>

                <TableCell className="py-4 text-right md:w-5">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontalIcon />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => console.log('edit', row)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(row.componentName)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </CustomTable>
        </CardContent>
      </Card>

      <CustomModal
        title="Add Salary Component"
        open={isAddComponentOpen}
        handleClose={handleAddComponentOpenChange}
      >
        <AddComponent
          open={isAddComponentOpen}
          onOpenChange={handleAddComponentOpenChange}
          onSave={(row) => {
            // Add the new row
            setRows((prev) => [...prev, row]);
          }}
        />
      </CustomModal>
    </div>
  );
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
];

const tableData = [
  {
    componentName: 'Basic Salary',
    amountType: 'Fixed',
    taxable: true,
    recurring: false,
    type: 'Taxable',
  },
  {
    componentName: 'House Rent Allowance',
    amountType: 'Percentage',
    taxable: true,
    recurring: false,
    type: 'Earning',
  },
  {
    componentName: 'Medical Allowance',
    amountType: 'Fixed',
    taxable: false,
    recurring: true,
    type: 'Deduction',
  },
];
