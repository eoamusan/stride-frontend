import Metrics from '../../invoicing/plain-metrics';

const metricsData = [
  {
    title: 'Average Days to Pay',
    value: '12.5',
  },
  {
    title: 'Payment Accuracy',
    value: '98.2%',
  },
  {
    title: 'Average Invoice Value',
    value: '$264',
  },
  {
    title: 'Active Vendors',
    value: '23',
  },
];

export default function VendorPerformance() {
  return (
    <div className="mb-10 space-y-10">
      <Metrics metrics={metricsData} />
    </div>
  );
}
