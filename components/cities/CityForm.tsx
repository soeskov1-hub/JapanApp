"use client";

import { useState, useTransition } from "react";
import { createCity } from "@/app/actions/cities";

export function CityForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const data = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await createCity(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Noget gik galt");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-5">
      <h2 className="text-xl font-bold text-ink">Tilføj by</h2>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-ink-light">Bynavn</label>
        <input
          type="text"
          name="name"
          required
          autoFocus
          placeholder="f.eks. Nagoya"
          className="w-full rounded-xl border border-paper-dark bg-paper px-3 py-2.5 text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-japan-red"
        />
      </div>

      {error && (
        <p className="text-japan-red text-sm bg-japan-red/10 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-3 rounded-xl bg-japan-red text-white font-bold text-base transition-all active:scale-95 disabled:opacity-60"
      >
        {isPending ? "Gemmer…" : "Tilføj by"}
      </button>
    </form>
  );
}
