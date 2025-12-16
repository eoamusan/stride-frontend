import Metrics from '../invoicing/plain-metrics';

export default function FixedAsset() {
  const metrics = [
    { title: 'Total Assets', value: '200', symbol: '$' },
    { title: 'Net Book Value', value: '170', symbol: '$' },
    { title: 'Depreciation', value: '160,434', symbol: '$' },
    { title: 'Avg Asset Age', value: '4/5 years', symbol: '' },
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
