import Link from "next/link";
import { slugify } from "@/lib/utils";

const CITY_IMAGES: Record<string, string> = {
  Tokyo: "🗼",
  Kyoto: "⛩️",
  Osaka: "🏯",
  Nara: "🦌",
  Hiroshima: "☮️",
  Sapporo: "❄️",
  Fukuoka: "🌊",
  Hakone: "🗻",
};

interface CityCardProps {
  name: string;
  entryCount?: number;
}

export function CityCard({ name, entryCount }: CityCardProps) {
  const emoji = CITY_IMAGES[name] ?? "🗾";

  return (
    <Link
      href={`/${slugify(name)}`}
      className="group flex flex-col items-center gap-3 p-5 bg-paper-dark rounded-2xl border border-paper-dark hover:border-japan-red transition-all active:scale-95"
    >
      <span className="text-5xl">{emoji}</span>
      <div className="text-center">
        <p className="font-bold text-ink text-lg leading-tight">{name}</p>
        {entryCount !== undefined && (
          <p className="text-ink-muted text-sm mt-0.5">
            {entryCount} {entryCount === 1 ? "item" : "items"}
          </p>
        )}
      </div>
    </Link>
  );
}
