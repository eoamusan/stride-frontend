import { ChartPieDonutText } from '@/components/dashboard/hr/breakdown-chart';
import MetricCard from '@/components/dashboard/hr/metric-card';
import CalendarWidget from '@/components/dashboard/hr/overview/calender';
import QuickActionsCard from '@/components/dashboard/hr/overview/quickaction-card';
import Header from '@/components/customs/header';
export default function Overview() {
  const metricsData = [
    {
      title: 'Number of Staffs',
      value: 30,
      percentage: 3,
    },
    {
      title: 'Turnover Rate',
      value: 50,
      unit: '%',
      percentage: -2,
      isPositive: false,
      chartData: [
        { month: 'Jan', month1: 1000 },
        { month: 'Feb', month2: 800 },
        { month: 'Mar', month3: 600 },
        { month: 'April', month4: 300 },
      ],
    },
    {
      title: 'Employee Sentiment',
      value: 70,
      unit: '%',
      percentage: 5,
      emojis: <span className="text-4xl">&#128522;</span>,
    },
    {
      title: 'Attendance Rate',
      value: 50,
      unit: '%',
      percentage: 2,
      chartData: [
        { month: 'Jan', month1: 600 },
        { month: 'Feb', month2: 800 },
        { month: 'Mar', month3: 1000 },
        { month: 'April', month4: 1200 },
      ],
    },
  ];

  const StaffBreakdown = {
    title: 'Staff Breakdown',
    label: 'Total Employees',
    text: 'By Department',
    chartData: [
      { label: 'Executives', value: 12, color: '#FFBF36' },
      { label: 'Managers', value: 8, color: '#76A6FF' },
      { label: 'Department Heads', value: 5, color: '#C227FF' },
      { label: 'Media', value: 5, color: '#1B91FF' },
      { label: 'Marketing', value: 5, color: '#2AFFD4' },
    ],
  };

  const EmployeeStatus = {
    title: 'Employee Status',
    newClass: true,
    chartData: [
      { label: 'Permanent', value: 22, color: '#62B3FF' },
      { label: 'Intern', value: 5, color: '#007AEB' },
      { label: 'Probabtion', value: 5, color: '#178FFF' },
    ],
  };

  return (
    <div className="my-5">
      <Header
        title="Account Overview"
        description="👋 Welcome back! Here's what's happening with your business."
      />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metricsData.map((metric) => (
          <MetricCard
            key={metric.title}
            {...metric}
            emptyState={false}
            emojis={metric.emojis}
          />
        ))}
      </div>

      <main className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <section className="flex flex-col gap-6 md:col-span-2 md:flex-row">
          <article className="md:w-6/11">
            {/* Staff breakdown chart */}
            <ChartPieDonutText {...StaffBreakdown} emptyState={false} />
          </article>
          <article className="md:w-5/11">
            {/* Employee Status chart */}
            <ChartPieDonutText {...EmployeeStatus} emptyState={false} />
          </article>
        </section>
        {/* Quick Action */}
        <section className="md:col-span-2 md:row-2">
          <QuickActionsCard />
        </section>
        {/* Calendar and Upcoming event*/}
        <section className="shadow-2 rounded-2xl border-2 bg-white md:col-span-1 md:row-span-2">
          <CalendarWidget />
        </section>
      </main>
    </div>
  );
}
