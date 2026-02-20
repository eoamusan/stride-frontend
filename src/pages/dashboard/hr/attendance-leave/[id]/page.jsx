import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ArrowLeft,
  Building2,
  Calendar,
  Download,
  BriefcaseIcon,
  CalendarIcon,
} from 'lucide-react';
import MetricCard from '@/components/dashboard/hr/metric-card';
import { Input } from '@/components/ui/input';
import {
  SearchIcon,
  FilterIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from '@/components/ui/svgs';
import { cn } from '@/lib/utils';

const sampleChartData = [
  { month: 'Jan', month1: 600 },
  { month: 'Feb', month2: 800 },
  { month: 'Mar', month3: 1000 },
  { month: 'Apr', month4: 1200 },
];

const MOCK_EMPLOYEE = {
  id: '2',
  name: 'Femi Johnson',
  role: 'Marketing Specialist',
  department: 'Engineering Dept',
  dateJoined: 'May 12, 2024',
  avatar: null,
  initials: 'FJ',
  avatarColor: 'bg-purple-600',
};

const MOCK_ATTENDANCE_LOG = [
  {
    id: '1',
    date: 'Mar 10, 2025',
    clockIn: '08:55 AM',
    clockOut: '05:05 PM',
    totalHours: '8h 10m',
    method: 'Face ID',
    location: 'Victoria Island, Lagos',
    status: 'on-time',
  },
  {
    id: '2',
    date: 'Mar 9, 2025',
    clockIn: '08:55 AM',
    clockOut: '05:05 PM',
    totalHours: '8h 10m',
    method: 'Manual',
    location: 'Victoria Island, Lagos',
    status: 'Late',
  },
  {
    id: '3',
    date: 'Mar 8, 2025',
    clockIn: '08:55 AM',
    clockOut: '05:05 PM',
    totalHours: '8h 10m',
    method: 'Face ID',
    location: 'Victoria Island, Lagos',
    status: 'Absent',
  },
  {
    id: '4',
    date: 'Mar 7, 2025',
    clockIn: '08:55 AM',
    clockOut: '05:05 PM',
    totalHours: '8h 10m',
    method: 'Manual',
    location: 'Victoria Island, Lagos',
    status: 'on-time',
  },
];

const STATUS_STYLES = {
  'on-time': 'bg-[#DCFCE7] text-[#15803D]',
  Late: 'bg-[#FEF9C3] text-[#A16207]',
  Absent: 'bg-[#FEE2E2] text-[#B91C1C]',
};

const METHOD_STYLES = {
  'Face ID': 'bg-[#EFF6FF] text-[#3B82F6]',
  Manual: 'bg-[#F3F4F6] text-[#374151]',
};

function buildPages(page, totalPages) {
  if (totalPages <= 7)
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages = [1];
  if (page > 3) pages.push('…');
  for (
    let i = Math.max(2, page - 1);
    i <= Math.min(totalPages - 1, page + 1);
    i++
  ) {
    pages.push(i);
  }
  if (page < totalPages - 2) pages.push('…');
  if (totalPages > 1) pages.push(totalPages);
  return pages;
}

export default function AttendanceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [attendanceLog, setAttendanceLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchDate, setSearchDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  useEffect(() => {
    // TODO: Fetch employee and attendance data from API
    setEmployee(MOCK_EMPLOYEE);
    setAttendanceLog(MOCK_ATTENDANCE_LOG);
  }, [id]);

  const metrics = [
    {
      title: 'Days Worked',
      value: 22,
      total: 24,
      percentage: 5,
      isPositive: true,
      chartData: sampleChartData,
    },
    {
      title: 'Late Arrivals',
      value: 3,
      percentage: 2,
      isPositive: false,
      chartData: sampleChartData,
    },
    {
      title: 'Absences',
      value: 1,
      percentage: 5,
      isPositive: true,
      chartData: sampleChartData,
    },
    {
      title: 'Overtime',
      value: 8.5,
      unit: 'h',
      percentage: 2,
      isPositive: true,
      chartData: sampleChartData,
    },
  ];

  if (!employee) {
    return (
      <div className="my-4 flex min-h-[400px] items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="my-4 min-h-screen">
      {/* Back button + Header */}
      <button
        type="button"
        onClick={() => navigate('/dashboard/hr/attendance-leave')}
        className="font-raleway mb-6 flex items-center gap-2 text-xl font-bold text-gray-900"
      >
        <ArrowLeft className="size-5" />
        Attendance Details
      </button>

      {/* Employee Profile Card */}
      <div className="mb-8 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-[140px] shrink-0">
              {employee.avatar && (
                <AvatarImage src={employee.avatar} alt={employee.name} />
              )}
              <AvatarFallback
                className={`${employee.avatarColor} text-2xl font-semibold text-white`}
              >
                {employee.initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-3">
              <div>
                <h2 className="font-raleway text-base font-semibold text-[#000000]">
                  {employee.name}
                </h2>
                <p className="font-raleway mt-1 text-[14px] text-[#434343]">
                  {employee.role}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex size-5 items-center justify-center rounded bg-white/60">
                    <BriefcaseIcon className="size-3.5 text-[#434343]" />
                  </div>
                  <span className="font-raleway text-sm text-[#434343]">
                    {employee.department}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex size-5 items-center justify-center rounded bg-white/60">
                    <CalendarIcon className="size-3.5 text-[#434343]" />
                  </div>
                  <span className="font-raleway text-sm text-[#434343]">
                    {employee.dateJoined}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <span className="inline-flex h-8 items-center justify-center rounded-full bg-[#DCFCE7] px-4 text-sm font-medium text-[#15803D]">
              on-time
            </span>

            <Button className="font-raleway h-11 gap-2 rounded-lg bg-[#3300C9] px-6 text-sm font-semibold text-white hover:bg-[#5A23B8]">
              <Download className="size-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={
              metric.total ? `${metric.value}/${metric.total}` : metric.value
            }
            unit={metric.unit}
            percentage={metric.percentage}
            isPositive={metric.isPositive}
            chartData={metric.chartData}
          />
        ))}
      </div>

      {/* Attendance Log */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-raleway text-xl font-bold text-gray-900">
            Attendance Log
          </h3>

          <div className="flex items-center gap-3">
            {/* Search date */}
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2">
                <SearchIcon className="size-4 text-[#7D7D7D]" />
              </span>
              <Input
                placeholder="Search date......"
                className="h-11 w-[200px] rounded-[16px] border border-[#E5E7EB] pl-10 text-sm outline-none focus-visible:ring-0"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
            </div>

            {/* Filter button */}
            <Button
              variant="outline"
              className="h-11 gap-2 rounded-[16px] border border-[#E5E7EB] px-4 text-sm text-[#7D7D7D]"
            >
              <FilterIcon className="size-4" />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {/* Column Headers */}
          <div className="mb-3 grid grid-cols-[1.2fr_1fr_1fr_1fr_1fr_1.5fr_1fr] gap-4 px-4">
            <span className="font-raleway text-sm font-medium text-[#7D7D7D]">
              Date
            </span>
            <span className="font-raleway text-sm font-medium text-[#7D7D7D]">
              Clock-in
            </span>
            <span className="font-raleway text-sm font-medium text-[#7D7D7D]">
              Clock-Out
            </span>
            <span className="font-raleway text-sm font-medium text-[#7D7D7D]">
              Total Hours
            </span>
            <span className="font-raleway text-sm font-medium text-[#7D7D7D]">
              Method
            </span>
            <span className="font-raleway text-sm font-medium text-[#7D7D7D]">
              Location
            </span>
            <span className="font-raleway text-sm font-medium text-[#7D7D7D]">
              Status
            </span>
          </div>

          {/* Rows */}
          <div className="space-y-3">
            {attendanceLog.map((record) => (
              <div
                key={record.id}
                className="grid h-[60px] grid-cols-[1.2fr_1fr_1fr_1fr_1fr_1.5fr_1fr] items-center gap-4 rounded-[16px] border border-[#E8E8E8] bg-white px-4"
              >
                {/* Date */}
                <span className="font-raleway text-sm text-[#000000CC]">
                  {record.date}
                </span>

                {/* Clock-in */}
                <span className="font-raleway text-sm text-[#000000CC]">
                  {record.clockIn}
                </span>

                {/* Clock-Out */}
                <span className="font-raleway text-sm text-[#000000CC]">
                  {record.clockOut}
                </span>

                {/* Total Hours */}
                <span className="font-raleway text-sm font-bold text-[#000000CC]">
                  {record.totalHours}
                </span>

                {/* Method */}
                <span
                  className={cn(
                    'inline-flex h-[30px] w-fit items-center justify-center rounded-[16px] px-3 text-xs font-medium',
                    METHOD_STYLES[record.method] || 'bg-gray-100 text-gray-600'
                  )}
                >
                  {record.method}
                </span>

                {/* Location */}
                <span className="font-raleway truncate text-sm text-[#000000CC]">
                  {record.location}
                </span>

                {/* Status */}
                <span
                  className={cn(
                    'inline-flex h-[30px] w-fit items-center justify-center rounded-[16px] px-3 text-xs font-medium',
                    STATUS_STYLES[record.status] || 'bg-gray-100 text-gray-600'
                  )}
                >
                  {record.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-xs transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeftIcon className="size-4" />
            Previous
          </button>

          <div className="flex items-center gap-1">
            {buildPages(currentPage, totalPages).map((p, i) =>
              p === '…' ? (
                <span
                  key={`ellipsis-${i}`}
                  className="flex size-8 items-center justify-center text-sm text-gray-400"
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`flex size-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    p === currentPage
                      ? 'bg-[#6C2BD9] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              )
            )}
          </div>

          <button
            onClick={() =>
              currentPage < totalPages && setCurrentPage(currentPage + 1)
            }
            disabled={currentPage >= totalPages}
            className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-xs transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ArrowRightIcon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
