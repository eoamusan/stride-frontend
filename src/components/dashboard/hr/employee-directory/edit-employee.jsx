import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
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
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import EmployeeService from '@/api/employee';
import { useUserStore } from '@/stores/user-store';
import { EditIcon } from '@/components/ui/svgs';

const inputFieldClass =
  'h-[44px] w-[305px] rounded-[8px] border border-[1px] py-2.5 px-3 font-raleway font-normal text-[10px] leading-[24px] tracking-normal align-middle placeholder:font-raleway placeholder:font-normal placeholder:text-[10px] placeholder:leading-[24px]';

const employeeFormSchema = z.object({
  fullName: z.string().min(1, { message: 'Full name is required' }),
  email: z.email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(1, { message: 'Phone number is required' }),
  gender: z.string().min(1, { message: 'Gender is required' }),
  dateOfBirth: z.date({ required_error: 'Date of birth is required' }),
  jobTitle: z.string().min(1, { message: 'Job title is required' }),
  department: z.string().min(1, { message: 'Department is required' }),
  employmentType: z.string().min(1, { message: 'Employment type is required' }),
  status: z.string().min(1, { message: 'Status is required' }),
  homeAddress: z.string().min(1, { message: 'Home address is required' }),
  startDate: z.date({ required_error: 'Start date is required' }),
});

export default function EditEmployeeModal({
  open,
  onOpenChange,
  onSuccess,
  employee,
}) {
  const { activeBusiness } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState([]);

  const form = useForm({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      gender: '',
      dateOfBirth: undefined,
      jobTitle: '',
      department: '',
      employmentType: '',
      status: 'Active',
      homeAddress: '',
      startDate: undefined,
    },
  });

  // Populate form when employee data changes
  useEffect(() => {
    if (employee && open) {
      const fullName =
        `${employee.firstName || ''} ${employee.lastName || ''}`.trim();
      form.reset({
        fullName,
        email: employee.email || '',
        phone: employee.phoneNumber || '',
        gender: employee.gender || '',
        dateOfBirth: employee.dateOfBirth
          ? new Date(employee.dateOfBirth)
          : undefined,
        jobTitle: employee.positionTitle || employee.position || '',
        department: employee.department || employee.departmentName || '',
        employmentType: employee.employmentType || '',
        status:
          employee.status === 'ACTIVE'
            ? 'Active'
            : employee.status === 'ON_LEAVE'
              ? 'On Leave'
              : employee.status || 'Active',
        homeAddress: employee.address?.address1 || '',
        startDate: employee.hireDate ? new Date(employee.hireDate) : undefined,
      });
    }
  }, [employee, open, form]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const businessId = activeBusiness?._id;

      // Split full name into first and last name
      const nameParts = data.fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Transform data to match API format
      const apiData = {
        employee: {
          firstName,
          lastName,
          email: data.email,
          phoneNumber: data.phone,
          department: data.department,
          position: data.jobTitle,
          dateOfBirth: data.dateOfBirth,
          hireDate: data.startDate,
          employmentType: data.employmentType,
          status:
            data.status === 'Active'
              ? 'ACTIVE'
              : data.status === 'On Leave'
                ? 'ON_LEAVE'
                : data.status.toUpperCase(),
        },
        address: {
          address1: data.homeAddress,
          city: '',
          state: '',
          zipcode: '',
          country: '',
        },
        businessId: businessId,
        accountId: activeBusiness?.accountId,
      };

      // TODO: Replace with actual API call when available
      await EmployeeService.update({
        id: employee.id,
        data: apiData,
      });

      onOpenChange(false);
      form.reset();
      onSuccess?.();
      toast.success('Employee updated successfully');
    } catch (err) {
      console.log('Error updating employee data:', err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          'Failed to update employee. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    form.reset();
  };

  // Fetch departments when modal opens
  useEffect(() => {
    async function fetchData() {
      if (!open) return;
      try {
        const deptRes = await EmployeeService.getDepartments();
        setDepartments(deptRes.data?.data || []);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    }
    fetchData();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto p-8 **:data-[slot=dialog-close]:hidden sm:max-w-4xl"
        overlayClassName="bg-[#0C0C0CE5]"
        showCloseButton={false}
      >
        <DialogHeader className={'w-full'}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-[#3300C9]">
                <EditIcon className="size-5 text-white" />
              </div>
              <DialogTitle className="font-raleway align-middle text-[12px] leading-[24px] font-semibold tracking-[0%]">
                Edit Employee
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="group flex size-8 items-center justify-center rounded-full border border-zinc-200 bg-white"
            >
              <X className="size-4 -rotate-45 transition-transform duration-200 group-hover:rotate-0" />
            </Button>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 w-full max-w-4xl space-y-6"
          >
            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      className={cn(inputFieldClass, 'w-full max-w-full')}
                      placeholder="e.g. John Doe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email and Phone */}
            <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className={inputFieldClass}
                        type="email"
                        placeholder="e.g. hammedadeyanju75@gmail.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        className={inputFieldClass}
                        placeholder="e.g. +2349068114071"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Gender and Date of Birth */}
            <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className={inputFieldClass}>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Birth</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              inputFieldClass,
                              'w-full justify-start pl-3 text-left',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'dd/MM/yyyy')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto size-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Job Title and Department */}
            <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input
                        className={inputFieldClass}
                        placeholder="e.g Senior Software Engineer"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className={inputFieldClass}>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.length > 0 ? (
                          departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))
                        ) : (
                          <>
                            <SelectItem value="engineering">
                              Engineering
                            </SelectItem>
                            <SelectItem value="sales">Sales</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="hr">Human Resources</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Employment Type and Status */}
            <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2">
              <FormField
                control={form.control}
                name="employmentType"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Employment Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger
                          className={cn(inputFieldClass, 'w-full')}
                        >
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FULL_TIME">Full-time</SelectItem>
                        <SelectItem value="PART_TIME">Part-time</SelectItem>
                        <SelectItem value="CONTRACT">Contract</SelectItem>
                        <SelectItem value="INTERN">Intern</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger
                          className={cn(inputFieldClass, 'w-full')}
                        >
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Home Address and Start Date */}
            <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2">
              <FormField
                control={form.control}
                name="homeAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Home Address</FormLabel>
                    <FormControl>
                      <Input
                        className={inputFieldClass}
                        placeholder="e.g Lagos, Nigeria"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              inputFieldClass,
                              'w-full justify-start pl-3 text-left',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'dd/MM/yyyy')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto size-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-6 pt-8">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="font-raleway h-11 min-w-[120px] rounded-full border border-[#254C00] px-6 py-2 text-[12px] leading-[24px] font-normal text-[#254C00] hover:bg-[#254C00] hover:text-white"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="font-raleway h-11 min-w-[160px] rounded-full border border-[#3300C9] bg-[#3300C9] px-8 py-2 text-[12px] leading-[24px] font-normal text-white hover:bg-[#3300C9]/90"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Employee'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
