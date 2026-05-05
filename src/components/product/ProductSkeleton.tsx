import { motion } from 'motion/react';

export default function ProductSkeleton() {
  return (
    <div className="bg-surface-card rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.5)] border border-hairline h-full flex flex-col animate-pulse">
      <div className="relative aspect-[4/5] bg-canvas overflow-hidden">
        {/* Placeholder for image */}
        <div className="h-full w-full bg-muted/20" />
      </div>

      <div className="p-5 flex-1 flex flex-col space-y-4">
        {/* Rating placeholder */}
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-muted/20 rounded-full" />
            ))}
          </div>
          <div className="w-8 h-3 bg-muted/20 rounded ml-1" />
        </div>

        {/* Title placeholder */}
        <div className="space-y-2">
          <div className="h-4 bg-muted/20 rounded w-full" />
          <div className="h-4 bg-muted/20 rounded w-3/4" />
        </div>

        {/* Price placeholder */}
        <div className="flex items-baseline gap-3 mt-auto pt-2">
          <div className="h-6 bg-muted/20 rounded w-20" />
          <div className="h-4 bg-muted/20 rounded w-12" />
        </div>
      </div>
    </div>
  );
}
