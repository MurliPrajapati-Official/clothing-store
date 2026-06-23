import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
  key?: React.Key;
}

export default function Skeleton({ className, variant = 'rect', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted/20",
        variant === 'circle' && "rounded-none",
        variant === 'rect' && "rounded-none",
        variant === 'text' && "h-4 rounded-none",
        className
      )}
      {...props}
    />
  );
}
