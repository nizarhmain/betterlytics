export function LiveIndicator() {
  return (
    <div
      className={`absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-green-500 shadow-lg shadow-green-500/50`}
    >
      <div className={`absolute inset-0 h-3 w-3 animate-ping rounded-full bg-green-400`} />
    </div>
  );
}
