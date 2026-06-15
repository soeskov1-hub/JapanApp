"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteCity } from "@/app/actions/cities";
import { slugify } from "@/lib/utils";

interface CityRowProps {
  id: string;
  name: string;
  entryCount: number;
}

export function CityRow({ id, name, entryCount }: CityRowProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleDelete() {
    if (!confirm(`Slet "${name}"? Alle steder i denne by slettes også.`)) return;
    setError(null);
    startTransition(async () => {
      try {
        await deleteCity(id);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Sletning mislykkedes");
      }
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-3 px-4 py-3 bg-paper-dark rounded-xl border border-paper-dark hover:border-japan-red/40 transition-colors">
        <Link href={`/${slugify(name)}`} className="flex-1 min-w-0">
          <p className="font-semibold text-ink">{name}</p>
          <p className="text-ink-muted text-sm">
            {entryCount} {entryCount === 1 ? "sted" : "steder"}
          </p>
        </Link>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="p-2 text-ink-muted hover:text-japan-red rounded-lg transition-colors disabled:opacity-40 flex-shrink-0"
          aria-label={`Slet ${name}`}
        >
          {isPending ? "⏳" : "🗑️"}
        </button>
      </div>
      {error && (
        <p className="text-japan-red text-xs px-2">{error}</p>
      )}
    </div>
  );
}
