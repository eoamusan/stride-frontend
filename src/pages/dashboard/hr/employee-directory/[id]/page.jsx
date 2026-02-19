import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import {
  ArrowLeftIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  PencilIcon,
  DownloadIcon,
  CalendarIcon,
  BriefcaseIcon,
  UserIcon,
  ClockIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import EmployeeService from '@/api/employee';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data for testing employee detail when API is unavailable (match USE_MOCK_FOR_TESTING in directory)
const MOCK_EMPLOYEES_BY_ID = {
  1: {
    id: '1',
    firstName: 'Nathaniel',
    lastName: 'Desire',
    positionTitle: 'Senior Software Engineer',
    department: 'Engineering',
    departmentName: 'Engineering',
    employeeId: '345321231',
    status: 'ACTIVE',
    hireDate: '2023-01-15',
    employmentType: 'FULL_TIME',
    email: 'nathaniel.desire@example.com',
    phoneNumber: '+234 800 000 0001',
    address: { address1: 'Lagos, Nigeria' },
  },
  2: {
    id: '2',
    firstName: 'Femi',
    lastName: 'Johnson',
    positionTitle: 'Senior Software Engineer',
    department: 'Engineering',
    departmentName: 'Engineering',
    employeeId: '345321232',
    status: 'ON_LEAVE',
    hireDate: '2022-06-01',
    employmentType: 'FULL_TIME',
    email: 'femi.johnson@example.com',
    phoneNumber: '+234 800 000 0002',
    address: { address1: 'Lagos, Nigeria' },
  },
  3: {
    id: '3',
    firstName: 'Sarah',
    lastName: 'Adeyemi',
    positionTitle: 'Senior Software Engineer',
    department: 'Engineering',
    departmentName: 'Engineering',
    employeeId: '345321233',
    status: 'TERMINATED',
    hireDate: '2021-03-10',
    employmentType: 'FULL_TIME',
    email: 'sarah.adeyemi@example.com',
    phoneNumber: '+234 800 000 0003',
    address: { address1: 'Lagos, Nigeria' },
  },
  4: {
    id: '4',
    firstName: 'Kemi',
    lastName: 'Jakada',
    positionTitle: 'Senior Software Engineer',
    department: 'Engineering',
    departmentName: 'Engineering',
    employeeId: '345321234',
    status: 'ACTIVE',
    hireDate: '2024-02-20',
    employmentType: 'FULL_TIME',
    email: 'kemi.jakada@example.com',
    phoneNumber: '+234 800 000 0004',
    address: { address1: 'Lagos, Nigeria' },
  },
};

export default function ViewEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setIsLoading(true);
        const response = await EmployeeService.get({ id });
        const employeeData = response.data?.data;
        if (employeeData) {
          setEmployee(employeeData);
          return;
        }
        throw new Error('No data');
      } catch (error) {
        // Use mock data for testing when API fails or returns nothing
        const mock = id ? MOCK_EMPLOYEES_BY_ID[id] : null;
        if (mock) setEmployee(mock);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEmployeeData();
    }
  }, [id]);

  const getStatusBadge = (status) => {
    const statusMap = {
      ACTIVE: { label: 'Active', class: 'bg-green-100 text-green-800' },
      INACTIVE: { label: 'Inactive', class: 'bg-gray-100 text-gray-800' },
      ON_LEAVE: { label: 'On Leave', class: 'bg-yellow-100 text-yellow-800' },
      TERMINATED: { label: 'Terminated', class: 'bg-red-100 text-red-800' },
    };
    const statusInfo = statusMap[status] || statusMap.INACTIVE;
    return <Badge className={statusInfo.class}>{statusInfo.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="my-4 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="my-4 flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700">
            Employee Not Found
          </h2>
          <p className="mt-2 text-gray-500">
            The employee you're looking for doesn't exist.
          </p>
          <Button
            onClick={() => navigate('/dashboard/hr/employee-directory')}
            className="mt-4"
          >
            Back to Directory
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-4 pb-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/dashboard/hr/employee-directory')}
            className="size-10"
          >
            <ArrowLeftIcon className="size-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Employee Profile</h1>
            <p className="text-sm text-gray-600">
              View employee information and details
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="h-10 gap-2">
            <PencilIcon className="size-4" />
            Edit
          </Button>
          <Button variant="outline" className="h-10 gap-2">
            <DownloadIcon className="size-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Employee Profile Card */}
      <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Profile Image */}
          <div className="flex flex-col items-center gap-4 md:w-48">
            <div className="flex size-32 items-center justify-center rounded-full bg-gray-200 text-4xl font-semibold text-gray-600">
              {employee.firstName?.[0]}
              {employee.lastName?.[0]}
            </div>
            {getStatusBadge(employee.status)}
          </div>

          {/* Employee Details */}
          <div className="flex-1 space-y-6">
            {/* Name and Title */}
            <div>
              <h2 className="text-3xl font-bold text-[#434343]">
                {employee.title ? `${employee.title}. ` : ''}
                {employee.firstName} {employee.middleName || ''}{' '}
                {employee.lastName}
              </h2>
              <p className="mt-1 text-lg text-[#434343]">
                {employee.positionTitle || employee.position}
              </p>
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50">
                  <UserIcon className="size-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-[#7D7D7D]">Employee ID</p>
                  <p className="font-medium text-[#434343]">
                    {employee.employeeId}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-purple-50">
                  <BriefcaseIcon className="size-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-[#7D7D7D]">Department</p>
                  <p className="font-medium text-[#434343]">
                    {employee.departmentName || employee.department}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-green-50">
                  <CalendarIcon className="size-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-[#7D7D7D]">Hire Date</p>
                  <p className="font-medium text-[#434343]">
                    {employee.hireDate
                      ? format(new Date(employee.hireDate), 'MMM dd, yyyy')
                      : '-'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-orange-50">
                  <ClockIcon className="size-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-[#7D7D7D]">Employment Type</p>
                  <p className="font-medium text-[#434343]">
                    {employee.employmentType?.replace('_', '-') || '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-[#434343]">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50">
              <MailIcon className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-[#7D7D7D]">Email Address</p>
              <a
                href={`mailto:${employee.email}`}
                className="font-medium text-blue-600 hover:underline"
              >
                {employee.email}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-green-50">
              <PhoneIcon className="size-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-[#7D7D7D]">Phone Number</p>
              <a
                href={`tel:${employee.phoneNumber}`}
                className="font-medium text-[#434343] hover:underline"
              >
                {employee.phoneNumber}
              </a>
            </div>
          </div>

          {employee.address && (
            <div className="flex items-start gap-3 md:col-span-2">
              <div className="flex size-10 items-center justify-center rounded-lg bg-purple-50">
                <MapPinIcon className="size-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-[#7D7D7D]">Address</p>
                <p className="font-medium text-[#434343]">
                  {employee.address.address1}
                  {employee.address.address2 &&
                    `, ${employee.address.address2}`}
                  <br />
                  {employee.address.city}, {employee.address.state}{' '}
                  {employee.address.zipcode}
                  <br />
                  {employee.address.country}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Personal Information */}
      <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-[#434343]">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-[#7D7D7D]">Date of Birth</p>
            <p className="mt-1 font-medium text-[#434343]">
              {employee.dateOfBirth
                ? format(new Date(employee.dateOfBirth), 'MMM dd, yyyy')
                : '-'}
            </p>
          </div>

          <div>
            <p className="text-sm text-[#7D7D7D]">Gender</p>
            <p className="mt-1 font-medium text-[#434343]">
              {employee.gender || '-'}
            </p>
          </div>

          <div>
            <p className="text-sm text-[#7D7D7D]">Marital Status</p>
            <p className="mt-1 font-medium text-[#434343]">
              {employee.maritalStatus || '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Employment Information */}
      <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-[#434343]">
          Employment Information
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-[#7D7D7D]">Manager</p>
            <p className="mt-1 font-medium text-[#434343]">
              {employee.manager?.name || '-'}
            </p>
          </div>

          <div>
            <p className="text-sm text-[#7D7D7D]">Work Location</p>
            <p className="mt-1 font-medium text-[#434343]">
              {employee.workLocation || '-'}
            </p>
          </div>

          <div>
            <p className="text-sm text-[#7D7D7D]">Probation End Date</p>
            <p className="mt-1 font-medium text-[#434343]">
              {employee.probationEndDate
                ? format(new Date(employee.probationEndDate), 'MMM dd, yyyy')
                : '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={() =>
            navigate(`/dashboard/hr/attendance-leave?employeeId=${id}`)
          }
        >
          View Attendance
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate(`/dashboard/hr/performance?employeeId=${id}`)}
        >
          Performance Reviews
        </Button>
        <Button variant="outline">Assign Asset</Button>
        <Button variant="outline">View Documents</Button>
      </div>
    </div>
  );
}
