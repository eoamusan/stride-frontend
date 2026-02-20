import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AddIcon, EditIcon, DeleteIcon } from '@/components/ui/svgs';
import MetricCard from '@/components/dashboard/hr/metric-card';
import { useUserStore } from '@/stores/user-store';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import SuccessModal from '@/components/dashboard/hr/success-modal';
import RequestDetailsView from '@/components/dashboard/hr/employee-directory/request-details-view';
import Header from '@/components/customs/header';
import { DataTable } from '@/components/ui/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontalIcon } from 'lucide-react';

// ─── Status colours ───────────────────────────────────────────────────────────
const STATUS_COLORS = {
  Open: { bg: '#FEE2E2', text: '#B91C1C' },
  'In Progress': { bg: '#FEF9C3', text: '#A16207' },
  Closed: { bg: '#DCFCE7', text: '#15803D' },
  Resolved: { bg: '#DBEAFE', text: '#1D4ED8' },
};

// ─── Dropdown filter items for DataTable ──────────────────────────────────────
const dropdownItems = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'Open' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Closed', value: 'Closed' },
  { label: 'Resolved', value: 'Resolved' },
];

// ─── Form schema ──────────────────────────────────────────────────────────────
const ticketFormSchema = z.object({
  requestType: z.string().min(1, { message: 'Request type is required' }),
  employeeName: z.string().min(1, { message: 'Employee name is required' }),
  priority: z.string().min(1, { message: 'Priority is required' }),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(200, { message: 'Description must be 200 characters or less' }),
});

// ─── Metric chart placeholder ─────────────────────────────────────────────────
const sampleChartData = [
  { month: 'Jan', month1: 600 },
  { month: 'Feb', month2: 800 },
  { month: 'Mar', month3: 1000 },
];

export default function HRServiceDesk() {
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [confirmResolutionModalOpen, setConfirmResolutionModalOpen] =
    useState(false);
  const { activeBusiness } = useUserStore();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgress: 0,
    closedTickets: 0,
  });

  const form = useForm({
    resolver: zodResolver(ticketFormSchema),
    defaultValues: {
      requestType: '',
      employeeName: '',
      priority: '',
      description: '',
    },
  });

  const descriptionValue = form.watch('description') || '';
  const charCount = descriptionValue.length;

  // ─── Mock data ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeBusiness) {
      const mockTickets = [
        {
          id: '1',
          ticketId: 'REQ-2025-042',
          requestType: 'Employment Letter',
          submittedBy: {
            name: 'Nathaniel Desire',
            initials: 'ND',
            color: 'bg-blue-600 text-white',
          },
          dateSubmitted: new Date('2025-02-12'),
          status: 'Open',
        },
        {
          id: '2',
          ticketId: 'REQ-2025-041',
          requestType: 'Verification',
          submittedBy: {
            name: 'Femi Johnson',
            initials: 'FJ',
            color: 'bg-purple-600 text-white',
          },
          dateSubmitted: new Date('2025-02-12'),
          status: 'In Progress',
        },
        {
          id: '3',
          ticketId: 'REQ-2025-038',
          requestType: 'Payroll Inquiry',
          submittedBy: {
            name: 'Sarah Adeyemi',
            initials: 'SA',
            color: 'bg-orange-600 text-white',
          },
          dateSubmitted: new Date('2025-02-12'),
          status: 'Closed',
        },
        {
          id: '4',
          ticketId: 'REQ-2025-035',
          requestType: 'Leave Adjustment',
          submittedBy: {
            name: 'Kemi Jakada',
            initials: 'KJ',
            color: 'bg-red-600 text-white',
          },
          dateSubmitted: new Date('2025-02-12'),
          status: 'Resolved',
        },
      ];

      setTickets(mockTickets);
      setAnalytics({
        totalTickets: 150,
        openTickets: 20,
        inProgress: 70,
        closedTickets: 50,
      });
    }
  }, [activeBusiness]);

  // ─── Transform ticket data ────────────────────────────────────────────────
  const transformTicketData = (ticketsData) => {
    return ticketsData.map((ticket) => ({
      id: ticket.id,
      ticketId: ticket.ticketId,
      requestType: ticket.requestType,
      submittedBy: ticket.submittedBy.name,
      avatarInitials: ticket.submittedBy.initials,
      avatarColor: ticket.submittedBy.color,
      dateSubmitted: format(new Date(ticket.dateSubmitted), 'MMM -dd-yyyy'),
      status: ticket.status,
    }));
  };

  const ticketData = transformTicketData(tickets);
  const selectedTicket = ticketData.find((t) => t.id === selectedTicketId);

  // ─── useDataTable for search, filter, pagination ──────────────────────────
  const {
    currentTableData,
    pagination,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    setCurrentPage,
  } = useDataTable({
    data: ticketData,
    pageSize: 8,
    filterKeys: ['ticketId', 'requestType', 'submittedBy', 'status'],
    statusKey: 'status',
  });

  // ─── Metric cards ─────────────────────────────────────────────────────────
  const ticketMetrics = [
    {
      title: 'Total Tickets',
      value: analytics.totalTickets,
      percentage: 5,
      isPositive: true,
      chartData: sampleChartData,
    },
    {
      title: 'Open Tickets',
      value: analytics.openTickets,
      percentage: 2,
      isPositive: false,
      chartData: sampleChartData,
    },
    {
      title: 'In Progress',
      value: analytics.inProgress,
      percentage: 5,
      isPositive: true,
      chartData: sampleChartData,
    },
    {
      title: 'Closed Tickets',
      value: analytics.closedTickets,
      percentage: 2,
      isPositive: true,
      chartData: sampleChartData,
    },
  ];

  // ─── Row action handler ───────────────────────────────────────────────────
  const handleTicketAction = (action, ticket) => {
    switch (action) {
      case 'edit':
        console.log('Edit ticket:', ticket.id);
        break;
      case 'delete':
        console.log('Delete ticket:', ticket.id);
        break;
      case 'respond':
        console.log('Respond to ticket:', ticket.id);
        break;
      case 'assign':
        console.log('Assign ticket:', ticket.id);
        break;
      case 'close':
        console.log('Close ticket:', ticket.id);
        toast.success('Ticket closed successfully');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleConfirmResolution = () => {
    if (!selectedTicketId) return;
    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicketId ? { ...t, status: 'Closed' } : t
      )
    );
    setConfirmResolutionModalOpen(true);
  };

  const onSubmitTicket = async (data) => {
    try {
      setIsLoading(true);
      console.log('Creating ticket:', data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsCreateTicketOpen(false);
      form.reset();
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Failed to create ticket. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Table columns ────────────────────────────────────────────────────────
  const columns = [
    { header: 'Ticket ID', accessorKey: 'ticketId' },
    { header: 'Request Type', accessorKey: 'requestType' },
    {
      header: 'Submitted By',
      accessorKey: 'submittedBy',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-9 shrink-0">
            <AvatarFallback
              className={`${row.avatarColor || 'bg-blue-600 text-white'} text-xs font-medium`}
            >
              {row.avatarInitials}
            </AvatarFallback>
          </Avatar>
          <span className="truncate text-sm font-medium">
            {row.submittedBy}
          </span>
        </div>
      ),
    },
    { header: 'Date Submitted', accessorKey: 'dateSubmitted' },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => {
        const style = STATUS_COLORS[row.status] ?? {
          bg: '#F3F4F6',
          text: '#6B7280',
        };
        return (
          <span
            className="flex max-w-28 items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap"
            style={{ backgroundColor: style.bg, color: style.text }}
          >
            {row.status}
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
              <DropdownMenuItem onClick={() => setSelectedTicketId(row.id)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleTicketAction('edit', row)}>
                <EditIcon className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleTicketAction('delete', row)}
                className="text-red-600"
              >
                <DeleteIcon className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div className="my-4 min-h-screen">
      <Header
        title="HR Service Desk"
        description="Manage employee requests and support tickets"
        hasYoutubeButton={true}
      >
        <Button
          onClick={() => setIsCreateTicketOpen(true)}
          className="rounded-xl md:py-6"
        >
          <AddIcon />
          Create New Ticket
        </Button>
      </Header>

      <div className="mt-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ticketMetrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              percentage={metric.percentage}
              isPositive={metric.isPositive}
              chartData={metric.chartData}
            />
          ))}
        </div>

        <div className="mt-10">
          {selectedTicket ? (
            <RequestDetailsView
              ticket={selectedTicket}
              onBack={() => setSelectedTicketId(null)}
              onConfirmResolution={handleConfirmResolution}
              onReopenTicket={() => {
                if (!selectedTicketId) return;
                setTickets((prev) =>
                  prev.map((t) =>
                    t.id === selectedTicketId ? { ...t, status: 'Open' } : t
                  )
                );
                setSelectedTicketId(null);
                toast.success('Ticket reopened');
              }}
              onSendReply={(text) => {
                console.log('Send reply:', text);
                toast.success('Reply sent');
              }}
            />
          ) : (
            <div className="rounded-lg bg-white p-6 shadow-md">
              <DataTable
                columns={columns}
                data={currentTableData}
                title="Support Tickets"
                isLoading={isLoading}
                pagination={pagination}
                onPageChange={setCurrentPage}
                placeholder="Search tickets..."
                inputValue={searchTerm}
                handleInputChange={(e) => setSearchTerm(e.target.value)}
                dropdownItems={dropdownItems}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                setSearchTerm={setSearchTerm}
              />
            </div>
          )}
        </div>
      </div>

      {/* Confirm Resolution success modal */}
      <SuccessModal
        open={confirmResolutionModalOpen}
        onOpenChange={setConfirmResolutionModalOpen}
        title="Resolution Confirmed"
        subtitle="You've successfully confirmed resolution for this ticket"
        onBack={() => {
          setConfirmResolutionModalOpen(false);
          setSelectedTicketId(null);
        }}
      />

      {/* Create Ticket Modal */}
      <Dialog open={isCreateTicketOpen} onOpenChange={setIsCreateTicketOpen}>
        <DialogContent
          className="max-h-[90vh] w-full max-w-xl overflow-y-auto p-8"
          overlayClassName="bg-[#0C0C0CE5]"
        >
          <DialogHeader className="flex flex-row items-center gap-3 space-y-0 text-left">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#254C00]">
              <AddIcon />
            </div>
            <div className="flex-1">
              <DialogTitle className="font-raleway text-2xl font-semibold">
                Create New Ticket
              </DialogTitle>
              <p className="font-raleway mt-1 text-sm font-normal text-gray-500">
                Log an issue request or inquiry for quick resolution
              </p>
            </div>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitTicket)}
              className="mt-6 space-y-5"
            >
              <FormField
                control={form.control}
                name="requestType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Request Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 w-full">
                          <SelectValue placeholder="Employment Letter" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="employment-letter">
                          Employment Letter
                        </SelectItem>
                        <SelectItem value="verification">
                          Verification
                        </SelectItem>
                        <SelectItem value="leave">Leave Request</SelectItem>
                        <SelectItem value="payroll">Payroll Inquiry</SelectItem>
                        <SelectItem value="benefits">Benefits</SelectItem>
                        <SelectItem value="attendance">Attendance</SelectItem>
                        <SelectItem value="documents">Documents</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employeeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee Name</FormLabel>
                    <FormControl>
                      <Input
                        className={'h-11'}
                        placeholder="Search employee..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 w-full">
                          <SelectValue placeholder="Low" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the request..."
                        className="min-h-[120px] resize-none"
                        maxLength={200}
                        {...field}
                      />
                    </FormControl>
                    <div className="flex justify-end">
                      <p className="text-xs text-gray-500">{charCount}/200</p>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-6 pt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateTicketOpen(false);
                    form.reset();
                  }}
                  className="font-raleway h-11 min-w-[120px] rounded-full border border-[#254C00] px-6 py-2 text-[12px] leading-[24px] font-normal text-[#254C00] hover:bg-[#254C00] hover:text-white"
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="font-raleway h-11 min-w-[160px] rounded-full border border-[#3300C9] bg-[#3300C9] px-8 py-2 text-[12px] leading-[24px] font-normal text-white hover:bg-[#3300C9]/90"
                  disabled={isLoading}
                >
                  {isLoading ? 'Adding...' : 'Add Ticket'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <SuccessModal
        open={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
        title="Ticket Created"
        subtitle="You've successfully created a ticket"
      />
    </div>
  );
}
