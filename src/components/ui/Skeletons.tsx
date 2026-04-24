export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`shimmer rounded-lg ${className}`} />;
}

export function DestinationCardSkeleton() {
  return (
    <div className="card p-0 overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none rounded-t-2xl" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        <Skeleton className="h-8 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function FlightCardSkeleton() {
  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-16" />
      </div>
      <div className="flex items-center gap-4">
        <Skeleton className="h-5 w-14" />
        <Skeleton className="h-3 w-20 flex-1" />
        <Skeleton className="h-5 w-14" />
      </div>
      <Skeleton className="h-3 w-1/3" />
    </div>
  );
}

export function ModuleCardSkeleton() {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-9 rounded-xl" />
        <Skeleton className="h-5 w-32" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-4/6" />
    </div>
  );
}

export function SearchingSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-3 bg-brand-50 text-brand-700 px-5 py-3 rounded-full animate-pulse-soft mb-4">
          <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          <span className="text-sm font-medium">Ranking your Top 20 destinations...</span>
        </div>
        <p className="text-gray-500 text-sm">Analysing flights, safety, weather and your preferences</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => <DestinationCardSkeleton key={i} />)}
      </div>
    </div>
  );
}
