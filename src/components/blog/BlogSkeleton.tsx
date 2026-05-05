import Skeleton from '../ui/Skeleton';

export default function BlogSkeleton() {
  return (
    <div className="bg-surface-card rounded-3xl overflow-hidden border border-hairline shadow-[0_4px_20px_rgba(0,0,0,0.02)] h-full">
      <Skeleton className="aspect-[16/10] w-full" />
      <div className="p-8 space-y-4">
        <Skeleton className="w-20 h-4" />
        <div className="space-y-2">
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-4/5 h-6" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-full h-4" />
        </div>
        <div className="flex justify-between items-center pt-4">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}
