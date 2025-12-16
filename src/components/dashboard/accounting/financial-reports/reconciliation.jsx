import Metrics from '../invoicing/plain-metrics';

export default function Reconciliation() {
  const metrics = [
    { title: 'Total Cash', value: '200,000', symbol: '$' },
    { title: 'Reconciled', value: '45/42', symbol: '' },
    { title: 'Pending Items', value: '8', symbol: '' },
    { title: 'Discrepancies', value: '0', symbol: '' },
  ];

  return (
    <div className="my-10">
      <div>
        <Metrics metrics={metrics} />
      </div>
      <div className="mt-10"></div>
    </div>
  );
}
