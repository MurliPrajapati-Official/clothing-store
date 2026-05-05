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
        variant === 'circle' && "rounded-full",
        variant === 'rect' && "rounded-xl",
        variant === 'text' && "h-4 rounded",
        className
      )}
      {...props}
    />
  );
}
