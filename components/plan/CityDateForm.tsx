"use client";

import { useState, useTransition } from "react";
import { setCityDates, removeCityDates } from "@/app/actions/plan";

interface Props {
  cityId: string;
  cityName: string;
  currentStart?: string;
  currentEnd?: string;
  onClose: () => void;
}

export function CityDateForm({ cityId, cityName, currentStart, currentEnd, onClose }: Props) {
  const [start, setStart] = useState(currentStart ?? "");
  const [end, setEnd] = useState(currentEnd ?? "");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSave() {
    if (!start || !end) { setError("Vælg både start- og slutdato"); return; }
    if (end < start) { setError("Slutdato skal være efter startdato"); return; }
    setError(null);
    startTransition(async () => {
      try {
        await setCityDates(cityId, start, end);
        onClose();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Noget gik galt");
      }
    });
  }

  function handleRemove() {
    startTransition(async () => {
      await removeCityDates(cityId);
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-paper rounded-t-3xl sm:rounded-3xl p-5 flex flex-col gap-4 shadow-2xl">
        <h2 className="text-lg font-bold text-ink">Datoer for {cityName} 🗓</h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-ink-light">Ankomst</label>
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full rounded-xl border border-paper-dark bg-paper px-3 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-japan-red"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-ink-light">Afrejse</label>
          <input
            type="date"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            min={start}
            className="w-full rounded-xl border border-paper-dark bg-paper px-3 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-japan-red"
          />
        </div>

        {error && (
          <p className="text-japan-red text-sm bg-japan-red/10 rounded-xl px-3 py-2">{error}</p>
        )}

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-paper-dark text-ink-muted font-semibold"
          >
            Annuller
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex-1 py-3 rounded-xl bg-japan-red text-white font-bold disabled:opacity-60"
          >
            {isPending ? "Gemmer…" : "Gem"}
          </button>
        </div>

        {(currentStart || currentEnd) && (
          <button
            onClick={handleRemove}
            disabled={isPending}
            className="text-sm text-ink-muted underline text-center"
          >
            Fjern datoer
          </button>
        )}
      </div>
    </div>
  );
}
