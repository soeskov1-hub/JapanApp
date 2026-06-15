"use client";

import { useState, useTransition } from "react";
import { scheduleEntry, unscheduleEntry } from "@/app/actions/plan";
import { getEntryTypeInfo } from "@/lib/utils";
import type { Entry } from "@/lib/supabase/types";

interface ScheduledEntry extends Entry {
  scheduledId: string;
}

interface Props {
  date: string;
  cityName: string;
  scheduledEntries: ScheduledEntry[];
  availableEntries: Entry[];
}

export function DaySchedule({ date, cityName, scheduledEntries, availableEntries }: Props) {
  const [showPicker, setShowPicker] = useState(false);
  const [isPending, startTransition] = useTransition();

  const scheduledIds = new Set(scheduledEntries.map((e) => e.id));
  const unscheduled = availableEntries.filter((e) => !scheduledIds.has(e.id));

  const displayDate = new Date(date + "T12:00:00").toLocaleDateString("da-DK", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  function add(entryId: string) {
    startTransition(async () => {
      await scheduleEntry(entryId, date);
      setShowPicker(false);
    });
  }

  function remove(entryId: string) {
    startTransition(async () => {
      await unscheduleEntry(entryId, date);
    });
  }

  return (
    <div className="bg-paper rounded-2xl border border-paper-dark overflow-hidden">
      {/* Day header */}
      <div className="bg-japan-red/10 border-b border-paper-dark px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-japan-red font-semibold uppercase tracking-wide">{cityName}</p>
          <p className="text-sm font-bold text-ink capitalize">{displayDate}</p>
        </div>
        <button
          onClick={() => setShowPicker(!showPicker)}
          disabled={isPending || unscheduled.length === 0}
          className="text-xs px-3 py-1.5 rounded-full bg-japan-red text-white font-semibold disabled:opacity-40"
        >
          + Tilføj
        </button>
      </div>

      {/* Entry picker */}
      {showPicker && unscheduled.length > 0 && (
        <div className="border-b border-paper-dark bg-paper-dark/30 px-4 py-3 flex flex-col gap-1.5">
          <p className="text-xs font-semibold text-ink-muted mb-1">Vælg et sted at tilføje:</p>
          {unscheduled.map((entry) => {
            const info = getEntryTypeInfo(entry.type);
            return (
              <button
                key={entry.id}
                onClick={() => add(entry.id)}
                className="flex items-center gap-2 text-left px-3 py-2 rounded-xl hover:bg-paper-dark transition-colors text-sm"
              >
                <span>{info.emoji}</span>
                <span className="font-medium text-ink">{entry.name}</span>
                {entry.priority === "must-do" && (
                  <span className="ml-auto text-xs bg-japan-red/10 text-japan-red px-2 py-0.5 rounded-full">Skal ses</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Scheduled entries */}
      <div className="px-4 py-3 flex flex-col gap-2">
        {scheduledEntries.length === 0 ? (
          <p className="text-sm text-ink-muted text-center py-2">Ingen steder planlagt endnu</p>
        ) : (
          scheduledEntries.map((entry) => {
            const info = getEntryTypeInfo(entry.type);
            return (
              <div key={entry.id} className="flex items-center gap-3">
                <span className="text-lg">{info.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">{entry.name}</p>
                  {entry.address && (
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(entry.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-ink-muted underline truncate block"
                    >
                      {entry.address}
                    </a>
                  )}
                </div>
                <button
                  onClick={() => remove(entry.id)}
                  disabled={isPending}
                  className="text-ink-muted hover:text-japan-red transition-colors text-lg leading-none"
                  aria-label="Fjern"
                >
                  ×
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
