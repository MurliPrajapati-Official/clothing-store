import Skeleton from '../ui/Skeleton';

export default function ProductSkeleton() {
  return (
    <div className="bg-surface-card rounded-none overflow-hidden shadow-sm border border-hairline h-full flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="p-5 flex-1 flex flex-col space-y-4">
        {/* Rating placeholder */}
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} variant="circle" className="w-3 h-3" />
            ))}
          </div>
          <Skeleton variant="text" className="w-8 h-3 ml-1" />
        </div>

        {/* Title placeholder (Text variant) */}
        <div className="space-y-2">
          <Skeleton variant="text" className="w-full h-5" />
          <Skeleton variant="text" className="w-3/4 h-5" />
        </div>

        {/* Price placeholder */}
        <div className="flex items-baseline gap-3 mt-auto pt-2">
          <Skeleton variant="text" className="w-20 h-7" />
          <Skeleton variant="text" className="w-12 h-5" />
        </div>
        
        {/* CTA placeholder */}
        <Skeleton className="w-full h-10 rounded-none mt-2" />
      </div>
    </div>
  );
}
