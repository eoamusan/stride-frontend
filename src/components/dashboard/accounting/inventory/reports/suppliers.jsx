import SuppliersList from '../suppliers/supplier-list';
import PieMetricCard from '@/components/dashboard/pie-metric-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import adsPlaceholder from '@/assets/images/ads-report.png';

// Supplier data based on the image
const suppliersData = [
  {
    id: 1,
    initials: 'AO',
    name: 'JJ Solutions',
    contactPerson: 'Adeniyi James',
    email: 'jjsolutions@gmail.com',
    phone: '+2347065724230',
    products: 42,
    rating: 4.8,
    status: 'Active',
  },
  {
    id: 2,
    initials: 'AO',
    name: 'JJ Solutions',
    contactPerson: 'Adeniyi James',
    email: 'jjsolutions@gmail.com',
    phone: '+2347065724230',
    products: 42,
    rating: 4.8,
    status: 'Active',
  },
  {
    id: 3,
    initials: 'AO',
    name: 'JJ Solutions',
    contactPerson: 'Adeniyi James',
    email: 'jjsolutions@gmail.com',
    phone: '+2347065724230',
    products: 42,
    rating: 4.8,
    status: 'Active',
  },
  {
    id: 4,
    initials: 'AO',
    name: 'JJ Solutions',
    contactPerson: 'Adeniyi James',
    email: 'jjsolutions@gmail.com',
    phone: '+2347065724230',
    products: 42,
    rating: 4.8,
    status: 'Active',
  },
  {
    id: 5,
    initials: 'AO',
    name: 'JJ Solutions',
    contactPerson: 'Adeniyi James',
    email: 'jjsolutions@gmail.com',
    phone: '+2347065724230',
    products: 42,
    rating: 4.8,
    status: 'Active',
  },
  {
    id: 6,
    initials: 'AO',
    name: 'JJ Solutions',
    contactPerson: 'Adeniyi James',
    email: 'jjsolutions@gmail.com',
    phone: '+2347065724230',
    products: 42,
    rating: 4.8,
    status: 'Active',
  },
];

// Top Suppliers by Amount pie chart data
const topSuppliersData = [
  {
    name: 'JJ Solutions',
    value: 100,
    percentage: 41.67,
    amount: '$23,000',
    color: '#6366f1', // indigo-500
  },
  {
    name: 'Office Supply Plus',
    value: 62,
    percentage: 25.83,
    amount: '$23,000',
    color: '#22c55e', // green-500
  },
  {
    name: 'Global Foods',
    value: 50,
    percentage: 20.83,
    amount: '$23,000',
    color: '#f59e0b', // amber-500
  },
  {
    name: 'Tech Solutions Inc.',
    value: 28,
    percentage: 11.67,
    amount: '$23,000',
    color: '#06b6d4', // cyan-500
  },
];

const topSuppliersConfig = {
  'JJ Solutions': {
    label: 'JJ Solutions',
    color: '#6366f1',
  },
  'Office Supply Plus': {
    label: 'Office Supply Plus',
    color: '#22c55e',
  },
  'Global Foods': {
    label: 'Global Foods',
    color: '#f59e0b',
  },
  'Tech Solutions Inc.': {
    label: 'Tech Solutions Inc.',
    color: '#06b6d4',
  },
};

// Supplier Performance Details data based on the image
const supplierPerformanceData = [
  {
    id: 1,
    name: 'JJ Solutions',
    amount: '$23,000',
    percentage: '41.67%',
    color: '#6366f1', // indigo-500
  },
  {
    id: 2,
    name: 'Office Supply Plus',
    amount: '$23,000',
    percentage: '25.83%',
    color: '#22c55e', // green-500
  },
  {
    id: 3,
    name: 'Global Foods',
    amount: '$23,000',
    percentage: '20.83%',
    color: '#f59e0b', // amber-500
  },
  {
    id: 4,
    name: 'Tech Solutions Inc.',
    amount: '$23,000',
    percentage: '11.67%',
    color: '#06b6d4', // cyan-500
  },
];

export default function SuppliersReport() {
  return (
    <div className="mb-10 flex flex-col justify-start gap-10 md:flex-row">
      <SuppliersList
        className={'h-fit max-w-fit'}
        suppliers={suppliersData}
        searchPlaceholder="Search by name, service or Supplier"
        showSearch={true}
        showStatusFilter={true}
        itemsPerPage={6}
        showPagination={true}
        disableCategoryFilter={true}
      />
      <div className="space-y-10">
        <PieMetricCard
          title="Top Suppliers by Amount"
          chartConfig={topSuppliersConfig}
          chartData={topSuppliersData}
        />

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Supplier Performance Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {supplierPerformanceData.map((supplier) => (
              <div
                key={supplier.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: supplier.color }}
                  ></div>
                  <span className="text-sm font-medium">{supplier.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">{supplier.amount}</div>
                  <div className="text-xs text-[#434343]">
                    {supplier.percentage}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="w-full">
          <img
            src={adsPlaceholder}
            alt="Advertisement Placeholder"
            className="h-[500px] w-full rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
}
