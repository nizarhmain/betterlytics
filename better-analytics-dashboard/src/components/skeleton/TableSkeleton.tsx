export default function TableSkeleton() {
  return (
    <div className="bg-card rounded-lg border p-6 animate-pulse">
      <div className="h-6 bg-muted rounded w-1/3 mb-6"></div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 bg-muted rounded w-2/3"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
          </div>
        ))}
      </div>
    </div>
  );
} 