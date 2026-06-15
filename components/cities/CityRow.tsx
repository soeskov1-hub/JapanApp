"use client";

import Link from "next/link";
import { slugify } from "@/lib/utils";

interface CityRowProps {
  id: string;
  name: string;
  entryCount: number;
  onDelete: (id: string, name: string) => void;
}

export function CityRow({ id, name, entryCount, onDelete }: CityRowProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-paper-dark rounded-xl border border-paper-dark hover:border-japan-red/40 transition-colors">
      <Link href={`/${slugify(name)}`} className="flex-1 min-w-0">
        <p className="font-semibold text-ink">{name}</p>
        <p className="text-ink-muted text-sm">
          {entryCount} {entryCount === 1 ? "sted" : "steder"}
        </p>
      </Link>
      <button
        onClick={() => onDelete(id, name)}
        className="p-2 text-ink-muted hover:text-japan-red rounded-lg transition-colors flex-shrink-0"
        aria-label={`Slet ${name}`}
      >
        🗑️
      </button>
    </div>
  );
}
