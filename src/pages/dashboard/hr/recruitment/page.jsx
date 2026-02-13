import React, { useState } from 'react'; // 1. Import useState
import MetricCard from '@/components/dashboard/hr/metric-card';
import youtubeIcon from '@/assets/icons/youtube-red.png';
import { Button } from '@/components/ui/button';
import { TableActions } from '@/components/dashboard/hr/table';
import { dummyRequisitionRequests } from './job-requests';
import { Plus } from 'lucide-react';
import ManpowerRequisitionForm from './form/requisition-form';

// 2. Import Dialog components (Adjust path if necessary)
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';

const sampleChartData = [
  { month: 'Jan', month1: 600 },
  { month: 'Feb', month2: 800 },
  { month: 'Mar', month3: 1000 },
  { month: 'April', month4: 1200 },
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
  { key: 'title', label: 'Title', className: '' },
  { key: 'department', label: 'Department', className: '' },
  { key: 'requestedBy', label: 'Requested By', className: '' },
  { key: 'openings', label: 'Openings', className: '' },
  { key: 'status', label: 'Status', className: '' },
  { key: 'dateCreated', label: 'Date Created', className: '' },
  { key: 'actions', label: 'Actions', className: 'text-right' },
];

const tableData = dummyRequisitionRequests.map((item) => ({
  id: item.id,
  title: item.title,
  department: item.department,
  requestedBy: item.requestedBy,
  openings: item.openings,
  status: item.status,
  dateCreated: item.dateCreated,
}));

export default function Recruitment() {
  // 3. State is optional if using DialogTrigger, but good for control
  const [isModalOpen, setIsModalOpen] = useState(false);

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
              <ManpowerRequisitionForm />
            </DialogContent>
          </Dialog>

          <Button variant={'outline'} className={'h-10 rounded-lg text-sm'}>
            <img src={youtubeIcon} alt="YouTube Icon" className="mr-1 h-4" />
            See video guide
          </Button>
          <Dialog
            open={isModalOpen}
            onOpenChange={(open) => {
              setIsModalOpen(open);
              if (!open) setEditingRequisition(null);
            }}
          >
            <DialogTrigger asChild>
              <Button
                className={'h-10 rounded-2xl px-6 text-sm'}
                onClick={() => setEditingRequisition(null)}
              >
                <Plus className="mr-2 h-4 w-4" />
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
        />
      </div>
    </div>
  );
}
