"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteEntry } from "@/app/actions/entries";

export function DeleteEntryButton({ entryId }: { entryId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    if (!confirm("Slet dette element?")) return;
    startTransition(async () => {
      await deleteEntry(entryId);
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-1.5 text-ink-muted hover:text-japan-red rounded-lg transition-colors disabled:opacity-40"
      aria-label="Delete"
    >
      🗑️
    </button>
  );
}
