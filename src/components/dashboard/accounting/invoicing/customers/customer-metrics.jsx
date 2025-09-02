const customerMetrics = [
  { title: 'Total Outstanding', value: '$264' },
  {
    title: 'Overdue',
    value: '$15,600',
  },
  {
    title: 'Due This week',
    value: '$64',
  },
  {
    title: 'Active Customers',
    value: '264',
  },
];

export default function CustomerMetrics() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {customerMetrics.map((metric, i) => (
        <div key={i} className="rounded-2xl bg-white p-6">
          <h4 className="mb-5 text-sm font-medium text-[#434343]">
            {metric.title}
          </h4>
          <p className="text-base font-bold text-[#434343]">{metric.value}</p>
        </div>
      ))}
    </div>
  );
}
