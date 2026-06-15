import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-ink text-paper shadow-md">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-japan-red text-xl font-bold">⛩</span>
          <span className="text-lg font-bold tracking-wide">Japan Tur</span>
        </Link>
      </div>
    </header>
  );
}
