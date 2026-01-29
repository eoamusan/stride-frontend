import { Skeleton } from "@/components/ui/skeleton";

export default function Metrics({ metrics, loading }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, i) => (
        <div key={i} className="rounded-2xl bg-white p-6">
          <h4 className="mb-5 text-sm font-medium text-[#434343]">
            { loading ? <Skeleton className="h-4 w-20" /> : metric.title }
          </h4>

          {loading ? <Skeleton className="h-4" /> : <p className="text-base font-bold text-[#434343]">
            {metric?.symbol}
            {typeof metric.value === 'number' ? new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            }).format(Number(metric.value) || 0) : metric.value }
          </p>}
        </div>
      ))}
    </div>
  );
}
