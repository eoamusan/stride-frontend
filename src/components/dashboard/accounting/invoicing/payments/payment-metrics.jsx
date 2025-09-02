const paymentMetrics = [
  { title: 'Total Payments Received', value: '$264' },
  {
    title: 'Successful Pyaments',
    value: '$15,600',
  },
  {
    title: 'Pending Payments',
    value: '$64',
  },
  {
    title: 'Average Payment Time',
    value: '22 days',
  },
];

export default function PaymentMetrics() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {paymentMetrics.map((metric, i) => (
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
