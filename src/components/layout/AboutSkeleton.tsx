import Skeleton from '../ui/Skeleton';

export default function AboutSkeleton() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-canvas">
      <div className="container mx-auto px-4">
        {/* Header Skeleton */}
        <div className="max-w-4xl mx-auto text-center mb-20 space-y-6">
          <Skeleton className="w-96 h-16 mx-auto" />
          <div className="space-y-3">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-4/5 h-4 mx-auto" />
          </div>
        </div>

        {/* Mission & Vision Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-24">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-surface-card p-10 rounded-3xl border border-hairline space-y-6">
              <Skeleton className="w-16 h-16 rounded-full" />
              <Skeleton className="w-48 h-8" />
              <div className="space-y-2">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Grid Section Skeleton */}
        <div className="max-w-4xl mx-auto mb-24 space-y-12">
          <Skeleton className="w-80 h-10 mx-auto" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="w-48 h-6" />
                <Skeleton className="w-full h-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
