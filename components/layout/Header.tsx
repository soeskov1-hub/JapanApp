import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-ink text-paper shadow-md">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/torii.png" alt="Torii" className="w-8 h-8 object-contain" />
          <span className="text-lg font-bold tracking-wide">Japan-app 🇯🇵</span>
        </Link>
      </div>
    </header>
  );
}
