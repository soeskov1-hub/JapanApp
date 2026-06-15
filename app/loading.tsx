export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
      <div className="text-center py-4">
        <div className="h-12 w-12 rounded-full bg-paper-dark animate-pulse mx-auto mb-2" />
        <div className="h-8 w-40 rounded-lg bg-paper-dark animate-pulse mx-auto" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-paper-dark animate-pulse" />
        ))}
      </div>
    </div>
  );
}
