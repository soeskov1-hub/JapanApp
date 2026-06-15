"use client";

import Link from "next/link";
import { useTransition } from "react";
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
  const router = useRouter();

  function handleDelete() {
    if (!confirm(`Slet "${name}"? Alle steder i denne by slettes også.`)) return;
    startTransition(async () => {
      await deleteCity(id);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-paper-dark rounded-xl border border-paper-dark hover:border-japan-red/40 transition-colors">
      <Link
        href={`/${slugify(name)}`}
        className="flex-1 min-w-0"
      >
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
        🗑️
      </button>
    </div>
  );
}
