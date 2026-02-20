import { Skeleton } from '@/components/ui/skeleton';

export default function ReportSkeleton() {
  return (
    <div className="space-y-10">

      {/* Variance Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg border p-6">
            <Skeleton className="mb-2 h-4 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="flex flex-col items-start gap-10 lg:flex-row">
        {/* Left Column - Area Chart and Recent Transactions */}
        <div className="w-full space-y-10">
          {/* Area Chart */}
          <div className="bg-card rounded-lg border p-6">
            <Skeleton className="mb-4 h-6 w-40" />
            <Skeleton className="h-64 w-full" />
          </div>

          {/* Chart Transactions */}
          <div className="bg-card rounded-lg border p-6">
            <div className="mb-4 flex items-center justify-between">
              {
                [...Array(4)].map((_, i) => {
                  return <div key={i}>
                    <Skeleton className="h-4 w-48 mb-2" />
                    <Skeleton className="h-10 w-40" />
                  </div>
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
