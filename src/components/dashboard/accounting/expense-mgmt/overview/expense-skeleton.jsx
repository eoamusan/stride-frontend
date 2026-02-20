import { Skeleton } from '@/components/ui/skeleton';

export default function ExpenseSkeleton() {
  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex space-x-4">
          <Skeleton className="h-10 w-40 rounded-2xl" />
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
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

          {/* Recent Transactions */}
          <div className="bg-card rounded-lg border p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <Skeleton className="mb-2 h-6 w-40" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-9 w-24" />
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="mb-1 h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Pie Chart and Range Card */}
        <div className="w-full max-w-md space-y-10">
          {/* Pie Chart */}
          <div className="bg-card rounded-lg border p-6">
            <Skeleton className="mb-4 h-6 w-48" />
            <Skeleton className="mx-auto h-64 w-64 rounded-full" />
            <div className="mt-4 space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          </div>

          {/* Range Card */}
          <div className="bg-card rounded-lg border p-6">
            <Skeleton className="mb-4 h-6 w-40" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
