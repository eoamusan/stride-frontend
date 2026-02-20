import { Skeleton } from '@/components/ui/skeleton';

export default function VendorSkeleton() {
  return (
    <div className="space-y-10">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card rounded-lg border p-6">
            <Skeleton className="mb-2 h-4 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
        ))}
      </div>

      {/* Vendor Cards Section */}
      <div className="w-full rounded-2xl bg-white p-6">
        {/* Search and Filters */}
        <div className="mb-6 grid w-full gap-6 md:grid-cols-3">
          <div className="w-full space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="w-full space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="w-full space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Vendor Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-lg border p-6">
              {/* Header */}
              <div className="mb-4 flex items-start space-x-3">
                <Skeleton className="size-5 rounded" />
                <Skeleton className="size-6 rounded" />
                <div className="flex-1">
                  <Skeleton className="mb-2 h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>

              {/* Contact Info */}
              <div className="mb-4 space-y-3">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex items-center space-x-3">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>

              {/* Services */}
              <div className="mb-4 space-y-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-full" />
              </div>

              {/* Rating and Date */}
              <div className="mb-4 flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <Skeleton className="h-10 flex-1 rounded-2xl" />
                <div className="ml-4 flex items-center space-x-2">
                  <Skeleton className="size-10 rounded-md" />
                  <Skeleton className="size-10 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <Skeleton className="h-8 w-24" />
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="size-7" />
            ))}
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </div>
  );
}
