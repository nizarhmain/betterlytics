export default function SummaryCardSkeleton() {
  return (
    <div className="bg-card rounded-lg border p-6 animate-pulse">
      <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
      <div className="h-8 bg-muted rounded w-1/2 mb-4"></div>
      <div className="h-16 bg-muted rounded"></div>
    </div>
  );
} 