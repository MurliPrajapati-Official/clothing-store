import Skeleton from '../ui/Skeleton';

export default function ContactSkeleton() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-canvas">
      <div className="container-custom max-w-7xl">
        <div className="text-center mb-16 space-y-6">
          <Skeleton className="w-96 h-12 mx-auto" />
          <div className="space-y-3">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-4/5 h-4 mx-auto" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Info Skeletons */}
          <div className="lg:col-span-2 space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-surface-card p-8 rounded-none border border-hairline flex items-start gap-4">
                <Skeleton className="w-12 h-12 rounded-none shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="w-24 h-5" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-1/2 h-5" />
                </div>
              </div>
            ))}
          </div>

          {/* Form Skeleton */}
          <div className="lg:col-span-3 bg-surface-card p-8 md:p-12 rounded-none border border-hairline space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-full h-12" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-full h-12" />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Skeleton className="w-40 h-4" />
              <Skeleton className="w-full h-12" />
            </div>
            <div className="space-y-2">
              <Skeleton className="w-40 h-4" />
              <Skeleton className="w-full h-32" />
            </div>
            <Skeleton className="w-full h-14" />
          </div>
        </div>
      </div>
    </div>
  );
}
