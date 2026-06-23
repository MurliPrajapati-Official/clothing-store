import Skeleton from '../ui/Skeleton';

export default function HomeSkeleton() {
  return (
    <div className="flex flex-col bg-canvas">
      {/* Hero Skeleton */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-white via-surface-soft to-surface-elevated">
        <div className="container-custom relative z-10 pt-28 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Skeleton className="w-48 h-8 rounded-none" />
              <div className="space-y-3">
                <Skeleton className="w-full h-16 md:h-20 rounded-none" />
                <Skeleton className="w-2/3 h-16 md:h-20 rounded-none" />
              </div>
              <div className="space-y-2">
                <Skeleton className="w-3/4 h-6 rounded-none" />
                <Skeleton className="w-1/2 h-6 rounded-none" />
              </div>
              <div className="flex gap-4 pt-4">
                <Skeleton className="w-44 h-12 rounded-none" />
                <Skeleton className="w-44 h-12 rounded-none" />
              </div>
              <div className="flex gap-8 pt-8 border-t border-hairline mt-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="w-16 h-8 rounded-none" />
                    <Skeleton className="w-24 h-4 rounded-none" />
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <Skeleton className="w-full aspect-[3/4] rounded-none" />
                <Skeleton className="w-full aspect-square rounded-none" />
              </div>
              <div className="space-y-4 pt-8">
                <Skeleton className="w-full aspect-square rounded-none" />
                <Skeleton className="w-full aspect-[3/4] rounded-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar Skeleton */}
      <section className="bg-white border-y border-hairline py-6">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-11 h-11 rounded-none shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton variant="text" className="w-24 h-4" />
                  <Skeleton variant="text" className="w-32 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Skeleton */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="mb-12 space-y-3">
            <Skeleton className="w-20 h-4 rounded-none" />
            <Skeleton className="w-64 h-12 rounded-none" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="w-full aspect-[4/5] rounded-none" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
