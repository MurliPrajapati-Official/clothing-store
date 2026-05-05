import Skeleton from '../ui/Skeleton';

export default function HomeSkeleton() {
  return (
    <div className="flex flex-col bg-canvas">
      {/* Hero Skeleton */}
      <section className="relative h-[95vh] flex items-center overflow-hidden">
        <div className="container-custom relative z-10 pt-20">
          <div className="max-w-3xl space-y-6">
            <Skeleton className="w-48 h-8 rounded-full" />
            <div className="space-y-3">
              <Skeleton className="w-full h-16 md:h-24" />
              <Skeleton className="w-2/3 h-16 md:h-24" />
            </div>
            <div className="space-y-2">
              <Skeleton className="w-3/4 h-6" />
              <Skeleton className="w-1/2 h-6" />
            </div>
            <div className="flex gap-4 pt-4">
              <Skeleton className="w-48 h-14 rounded-xl" />
              <Skeleton className="w-48 h-14 rounded-xl" />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-muted/5 animate-pulse" />
      </section>

      {/* Intro Section Skeleton */}
      <section className="py-24 bg-surface-card border-b border-hairline">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center mb-16 space-y-6">
            <Skeleton className="w-64 h-12 mx-auto" />
            <div className="space-y-3">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-4/5 h-4 mx-auto" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center p-6 bg-canvas rounded-2xl border border-hairline space-y-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <Skeleton variant="text" className="w-32 h-6" />
                <div className="space-y-2 w-full">
                  <Skeleton variant="text" className="w-full h-4" />
                  <Skeleton variant="text" className="w-full h-4" />
                  <Skeleton variant="text" className="w-4/5 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
