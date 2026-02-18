import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AddIcon, EditIcon, DeleteIcon } from '@/components/ui/svgs';
import SupportTicketsTable from '@/components/dashboard/hr/employee-directory/support-tickets-table';
import EditTicketModal from '@/components/dashboard/hr/employee-directory/edit-ticket-modal';
import DeleteConfirmationDialog from '@/components/dashboard/hr/delete-confirmation-dialog';
import MetricCard from '@/components/dashboard/hr/metric-card';
import { useUserStore } from '@/stores/user-store';
import { format } from 'date-fns';
import youtubeIcon from '@/assets/icons/youtube-red.png';
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

const ticketFormSchema = z.object({
  requestType: z.string().min(1, { message: 'Request type is required' }),
  employeeName: z.string().min(1, { message: 'Employee name is required' }),
  priority: z.string().min(1, { message: 'Priority is required' }),
  description: z
    .string()
    .min(1, { message: 'Description is required' })
    .max(200, { message: 'Description must be 200 characters or less' }),
});

// Row actions: only Edit and Delete (no View)
const ticketDropdownActions = [
  { key: 'edit', label: 'Edit', icon: EditIcon },
  { key: 'delete', label: 'Delete', icon: DeleteIcon },
];

export default function HRServiceDesk() {
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [isEditTicketOpen, setIsEditTicketOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [confirmResolutionModalOpen, setConfirmResolutionModalOpen] =
    useState(false);
  const [successMessage, setSuccessMessage] = useState({
    title: 'Ticket Created',
    subtitle: "You've successfully created a ticket",
  });
  const { activeBusiness } = useUserStore();
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationData, setPaginationData] = useState({
    page: 1,
    totalPages: 1,
    pageSize: 20,
    totalCount: 0,
  });
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

  // Mock data for demonstration
  useEffect(() => {
    if (activeBusiness) {
      // TODO: Replace with actual API call
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
  }, [activeBusiness, currentPage]);

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

  // Sample chart data for metrics
  const sampleChartData = [
    { month: 'Jan', month1: 600 },
    { month: 'Feb', month2: 800 },
    { month: 'Mar', month3: 1000 },
  ];

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

  const handleTicketTableAction = (action, ticket) => {
    switch (action) {
      case 'edit':
        // Find the full ticket data from the tickets array
        const fullTicketData = tickets.find((t) => t.id === ticket.id);
        setSelectedTicket(fullTicketData || ticket);
        setIsEditTicketOpen(true);
        break;
      case 'delete':
        setSelectedTicket(ticket);
        setIsDeleteDialogOpen(true);
        break;
      case 'respond':
        // Open the ticket detail view for responding
        setSelectedTicketId(ticket.id);
        break;
      case 'assign':
        // TODO: Open assignment modal when needed
        console.log('Assign ticket:', ticket.id);
        toast.info('Assignment feature coming soon');
        break;
      case 'close':
        handleCloseTicket(ticket);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleCloseTicket = (ticket) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticket.id ? { ...t, status: 'Closed' } : t))
    );
    // Update analytics
    setAnalytics((prev) => ({
      ...prev,
      openTickets:
        ticket.status === 'Open'
          ? Math.max(0, prev.openTickets - 1)
          : prev.openTickets,
      inProgress:
        ticket.status === 'In Progress'
          ? Math.max(0, prev.inProgress - 1)
          : prev.inProgress,
      closedTickets: prev.closedTickets + 1,
    }));
    toast.success('Ticket closed successfully');
  };

  const handleDeleteTicket = async () => {
    if (!selectedTicket) return;

    try {
      setIsDeleting(true);

      // TODO: Replace with actual API call when available
      console.log('Deleting ticket:', selectedTicket.id);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Remove ticket from local state
      const deletedTicket = tickets.find((t) => t.id === selectedTicket.id);
      setTickets((prev) => prev.filter((t) => t.id !== selectedTicket.id));

      // Update analytics
      setAnalytics((prev) => ({
        ...prev,
        totalTickets: Math.max(0, prev.totalTickets - 1),
        openTickets:
          deletedTicket?.status === 'Open'
            ? Math.max(0, prev.openTickets - 1)
            : prev.openTickets,
        inProgress:
          deletedTicket?.status === 'In Progress'
            ? Math.max(0, prev.inProgress - 1)
            : prev.inProgress,
        closedTickets:
          deletedTicket?.status === 'Closed'
            ? Math.max(0, prev.closedTickets - 1)
            : prev.closedTickets,
      }));

      setIsDeleteDialogOpen(false);
      setSelectedTicket(null);
      toast.success('Ticket deleted successfully');
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast.error('Failed to delete ticket. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSuccess = () => {
    setSuccessMessage({
      title: 'Ticket Updated',
      subtitle: "You've successfully updated the ticket",
    });
    setIsSuccessModalOpen(true);
  };

  const handleCreateSuccess = () => {
    setSuccessMessage({
      title: 'Ticket Created',
      subtitle: "You've successfully created a ticket",
    });
    setIsSuccessModalOpen(true);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
      // TODO: Replace with actual API call
      console.log('Creating ticket:', data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsCreateTicketOpen(false);
      form.reset();
      handleCreateSuccess();
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Failed to create ticket. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-4 min-h-screen">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <hgroup>
          <h1 className="text-2xl font-bold">HR Service Desk</h1>
          <p className="text-sm text-[#7D7D7D]">
            Manage employee requests and support tickets
          </p>
        </hgroup>

        <div className="flex items-center gap-4">
          <Button variant={'outline'} className={'h-10 rounded-lg text-sm'}>
            <img src={youtubeIcon} alt="YouTube Icon" className="mr-1 h-4" />
            See video guide
          </Button>
          <Button
            onClick={() => setIsCreateTicketOpen(true)}
            className="font-raleway h-10 gap-2 rounded-[16px] bg-[#3300C9] px-5 text-[14px] font-semibold text-white hover:bg-[#5A23B8]"
          >
            <AddIcon />
            Create New Ticket
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsSuccessModalOpen(true)}
            className="h-10 text-sm"
          >
            Test success modal
          </Button>
        </div>
      </div>

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
            <SupportTicketsTable
              data={ticketData}
              isLoading={isLoading}
              paginationData={paginationData}
              onPageChange={handlePageChange}
              onRowAction={handleTicketTableAction}
              onRowClick={(ticket) => setSelectedTicketId(ticket.id)}
              dropdownActions={ticketDropdownActions}
            />
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

      <EditTicketModal
        open={isEditTicketOpen}
        onOpenChange={setIsEditTicketOpen}
        onSuccess={handleEditSuccess}
        ticket={selectedTicket}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteTicket}
        title="Delete Ticket"
        description={`Are you sure you want to delete ticket ${selectedTicket?.ticketId || 'this ticket'}? This action cannot be undone.`}
        confirmText="Delete Ticket"
        isLoading={isDeleting}
      />

      <SuccessModal
        open={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
        title={successMessage.title}
        subtitle={successMessage.subtitle}
      />
    </div>
  );
}
