import Skeleton from '../ui/Skeleton';

export default function AccountSkeleton() {
  return (
    <div className="pt-32 pb-24 bg-canvas min-h-screen text-body-text">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="bg-surface-card rounded-none shadow-sm border border-hairline p-6">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-hairline">
                <Skeleton className="w-14 h-14 rounded-none" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="w-full h-5" />
                  <Skeleton className="w-2/3 h-4" />
                </div>
              </div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="w-full h-12" />
                ))}
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3 space-y-8">
            <div className="bg-surface-card rounded-none shadow-sm border border-hairline p-8 space-y-6">
              <Skeleton className="w-48 h-8" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="w-24 h-4" />
                    <Skeleton className="w-full h-12" />
                  </div>
                ))}
              </div>
              <Skeleton className="w-32 h-12" />
            </div>

            <div className="bg-surface-card rounded-none shadow-sm border border-hairline p-8 space-y-6">
              <Skeleton className="w-40 h-8" />
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="w-full h-24" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
