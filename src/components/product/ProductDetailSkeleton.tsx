import Skeleton from '../ui/Skeleton';

export default function ProductDetailSkeleton() {
  return (
    <div className="pt-32 pb-24 bg-canvas text-body-text min-h-screen">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs Skeleton */}
        <div className="flex items-center gap-2 mb-12">
          <Skeleton className="w-12 h-4" />
          <div className="w-4 h-4 bg-muted/10 rounded-none" />
          <Skeleton className="w-12 h-4" />
          <div className="w-4 h-4 bg-muted/10 rounded-none" />
          <Skeleton className="w-24 h-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Gallery Skeleton */}
          <div className="space-y-4">
            <Skeleton className="aspect-[4/5] w-full rounded-none" />
            <div className="flex gap-4 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="w-20 h-20 shrink-0" />
              ))}
            </div>
          </div>

          {/* Info Skeleton */}
          <div className="flex flex-col space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="w-32 h-6" />
              <Skeleton className="w-24 h-6" />
            </div>
            
            <Skeleton className="w-full h-12 md:h-16" />
            <Skeleton className="w-2/3 h-12 md:h-16" />

            <div className="flex gap-3">
              <Skeleton className="w-32 h-10 rounded-none" />
              <Skeleton className="w-32 h-10 rounded-none" />
            </div>

            <div className="flex gap-4 items-baseline">
              <Skeleton className="w-40 h-10" />
              <Skeleton className="w-24 h-6" />
            </div>

            <div className="space-y-3">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-3/4 h-4" />
            </div>

            <div className="space-y-4 pt-4">
              <Skeleton className="w-24 h-6" />
              <div className="flex gap-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="w-14 h-12" />
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Skeleton className="w-full sm:w-36 h-14" />
              <Skeleton className="flex-1 h-14" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
