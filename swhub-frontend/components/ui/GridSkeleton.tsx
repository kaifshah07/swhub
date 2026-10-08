interface GridSkeletonProps {
  count?: number;
  columns?: "2" | "3" | "4" | "5";
}

export default function GridSkeleton({ count = 8, columns = "4" }: GridSkeletonProps) {
  const gridClasses = {
    "2": "grid-cols-2",
    "3": "grid-cols-2 md:grid-cols-3",
    "4": "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    "5": "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
  };

  return (
    <div className={`grid gap-4 sm:gap-6 ${gridClasses[columns]}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3 rounded-2xl border border-neutral-100 bg-white p-3 shadow-xs animate-pulse">
          <div className="aspect-square w-full rounded-xl bg-neutral-100" />
          <div className="mt-2 h-4 w-3/4 rounded bg-neutral-100" />
          <div className="h-3 w-1/2 rounded bg-neutral-100" />
          <div className="mt-2 flex items-center justify-between">
            <div className="h-5 w-1/3 rounded bg-neutral-100" />
            <div className="h-8 w-8 rounded-lg bg-neutral-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
