/** Skeleton shimmer placeholder for loading states. */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

/** Collection tree skeleton — shows 8 rows of varying widths. */
export function CollectionTreeSkeleton() {
  return (
    <div className="space-y-2 px-3 py-2">
      <Skeleton className="h-3.5 w-3/4" />
      <Skeleton className="ml-4 h-3 w-1/2" />
      <Skeleton className="ml-4 h-3 w-2/3" />
      <Skeleton className="ml-4 h-3 w-5/12" />
      <Skeleton className="h-3.5 w-2/3" />
      <Skeleton className="ml-4 h-3 w-7/12" />
      <Skeleton className="ml-4 h-3 w-1/3" />
      <Skeleton className="h-3.5 w-1/2" />
    </div>
  );
}

/** Response panel skeleton — shows header bar + body lines. */
export function ResponseSkeleton() {
  return (
    <div className="animate-fade-in space-y-3 p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-14" />
      </div>
      <div className="space-y-2 pt-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-11/12" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  );
}

/** History panel skeleton — shows 5 rows. */
export function HistorySkeleton() {
  return (
    <div className="space-y-2 px-3 py-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-3 flex-1" />
        </div>
      ))}
    </div>
  );
}
