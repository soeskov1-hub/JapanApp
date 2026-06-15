export default function CityLoading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">
      <div className="h-4 w-12 bg-paper-dark rounded animate-pulse" />
      <div className="h-8 w-36 bg-paper-dark rounded-lg animate-pulse" />
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-20 rounded-full bg-paper-dark animate-pulse flex-shrink-0" />
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-paper-dark animate-pulse" />
        ))}
      </div>
    </div>
  );
}
