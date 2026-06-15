import type { Entry, EntryType } from "@/lib/supabase/types";
import { EntryCard } from "@/components/entries/EntryCard";

interface EntryListProps {
  entries: Entry[];
  activeType: EntryType | "all";
}

export function EntryList({ entries, activeType }: EntryListProps) {
  const filtered =
    activeType === "all"
      ? entries
      : entries.filter((e) => e.type === activeType);

  if (filtered.length === 0) {
    return (
      <div className="text-center py-16 text-ink-muted">
        <p className="text-4xl mb-3">🗾</p>
        <p className="font-medium">Intet her endnu</p>
        <p className="text-sm mt-1">Tryk + for at tilføje dit første sted</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {filtered.map((entry) => (
        <li key={entry.id}>
          <EntryCard entry={entry} />
        </li>
      ))}
    </ul>
  );
}
