import { ChartPieDonutText } from '@/components/dashboard/hr/breakdown-chart';
import MetricCard from '@/components/dashboard/hr/metric-card';
import CalendarWidget from '@/components/dashboard/hr/overview/calender';
import QuickActionsCard from '@/components/dashboard/hr/overview/quickaction-card';

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
      emojis: '🙂',
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
      { label: 'Engineering', value: 12, color: 'var(--chart-1)' },
      { label: 'Design', value: 8, color: 'var(--chart-2)' },
      { label: 'Marketing', value: 5, color: 'var(--chart-3)' },
      { label: 'Sales', value: 5, color: 'var(--chart-4)' },
    ],
  };

  const EmployeeStatus = {
    title: 'Employee Status',
    newClass: true,
    chartData: [
      { label: 'Permanent', value: 22, color: 'var(--chart-1)' },
      { label: 'Intern', value: 5, color: 'var(--chart-2)' },
      { label: 'Probabtion', value: 5, color: 'var(--chart-3)' },
    ],
  };

  return (
    <div className="my-5">
      <hgroup>
        <h1 className="text-2xl font-bold">Account Overview</h1>
        <p className="text-sm text-[#7D7D7D]">
          👋 Welcome back! Here's what's happening with your business.
        </p>
      </hgroup>

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
        <section className="flex flex-col gap-8 md:col-span-2 md:flex-row">
          <article className="md:w-6/10">
            {/* Staff breakdown chart */}
            <ChartPieDonutText {...StaffBreakdown} emptyState={false} />
          </article>
          <article className="md:w-4/10">
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
