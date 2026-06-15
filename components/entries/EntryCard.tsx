import Link from "next/link";
import type { Entry } from "@/lib/supabase/types";
import { buildGoogleMapsUrl, getEntryTypeInfo } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { VideoPlayer } from "@/components/entries/VideoPlayer";
import { DeleteEntryButton } from "@/components/entries/DeleteEntryButton";

interface EntryCardProps {
  entry: Entry;
}

export function EntryCard({ entry }: EntryCardProps) {
  const typeInfo = getEntryTypeInfo(entry.type);
  const mapsUrl = entry.address ? buildGoogleMapsUrl(entry.address) : null;

  return (
    <article className="bg-paper-dark rounded-2xl border border-paper-dark p-4 flex flex-col gap-3">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0">
          <span className="text-xl flex-shrink-0 mt-0.5">{typeInfo.emoji}</span>
          <div className="min-w-0">
            <p className="font-bold text-ink text-base leading-snug break-words">
              {entry.name}
            </p>
            {entry.address && mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-japan-red text-sm underline underline-offset-2 break-words"
              >
                📍 {entry.address}
              </a>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <Link
            href={`/entries/${entry.id}/edit`}
            className="p-1.5 text-ink-muted hover:text-ink rounded-lg transition-colors"
            aria-label="Edit"
          >
            ✏️
          </Link>
          <DeleteEntryButton entryId={entry.id} />
        </div>
      </div>

      {/* Priority + type badge */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge priority={entry.priority} />
        <span className="text-xs text-ink-muted bg-paper px-2 py-0.5 rounded-full">
          {typeInfo.label}
        </span>
      </div>

      {/* Notes */}
      {entry.notes && (
        <p className="text-sm text-ink-light leading-relaxed">{entry.notes}</p>
      )}

      {/* Video player */}
      {entry.type === "video" && entry.video_url && (
        <VideoPlayer
          source={entry.video_source}
          url={entry.video_url}
        />
      )}
    </article>
  );
}
