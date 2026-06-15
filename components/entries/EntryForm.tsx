"use client";

import { useState, useTransition, useRef } from "react";
import { createEntry, updateEntry } from "@/app/actions/entries";
import { ENTRY_TYPES, PRIORITY_OPTIONS } from "@/lib/utils";
import type { City, Entry } from "@/lib/supabase/types";

interface EntryFormProps {
  cities: City[];
  defaultCityId?: string;
  citySlug: string;
  entry?: Entry;
}

export function EntryForm({
  cities,
  defaultCityId,
  citySlug,
  entry,
}: EntryFormProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedType, setSelectedType] = useState(entry?.type ?? "destination");
  const [videoSource, setVideoSource] = useState<"upload" | "link">(
    entry?.video_source ?? "link"
  );
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const data = new FormData(e.currentTarget);
    data.set("city_slug", citySlug);

    startTransition(async () => {
      try {
        if (entry) {
          await updateEntry(entry.id, data);
        } else {
          await createEntry(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Noget gik galt");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} ref={formRef} className="flex flex-col gap-4 p-4 sm:p-5">
      <h2 className="text-xl font-bold text-ink">
        {entry ? "Rediger 🇯🇵" : "Tilføj ny 🇯🇵"}
      </h2>

      {/* By */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-ink-light">By</label>
        <select
          name="city_id"
          defaultValue={entry?.city_id ?? defaultCityId ?? ""}
          required
          className="w-full rounded-xl border border-paper-dark bg-paper px-3 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-japan-red"
        >
          <option value="" disabled>Vælg by…</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Type */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-ink-light">Type</label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {ENTRY_TYPES.map((t) => (
            <label
              key={t.value}
              className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl border cursor-pointer transition-all text-xs font-medium min-h-[72px] ${
                selectedType === t.value
                  ? "border-japan-red bg-japan-red/10 text-japan-red"
                  : "border-paper-dark bg-paper text-ink-muted"
              }`}
            >
              <input
                type="radio"
                name="type"
                value={t.value}
                checked={selectedType === t.value}
                onChange={() => setSelectedType(t.value as typeof selectedType)}
                className="sr-only"
              />
              <span className="text-2xl">{t.emoji}</span>
              <span className="leading-tight text-center">{t.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Navn */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-ink-light">Navn</label>
        <input
          type="text"
          name="name"
          defaultValue={entry?.name ?? ""}
          required
          placeholder="f.eks. Senso-ji Temple"
          className="w-full rounded-xl border border-paper-dark bg-paper px-3 py-3 text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-japan-red"
        />
      </div>

      {/* Adresse (ikke til videoer) */}
      {selectedType !== "video" && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-ink-light">
            Adresse <span className="text-ink-muted font-normal">(åbner Google Maps)</span>
          </label>
          <input
            type="text"
            name="address"
            defaultValue={entry?.address ?? ""}
            placeholder="f.eks. 2-3-1 Asakusa, Taito City, Tokyo"
            className="w-full rounded-xl border border-paper-dark bg-paper px-3 py-3 text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-japan-red"
          />
        </div>
      )}

      {/* Video fields */}
      {selectedType === "video" && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            {(["link", "upload"] as const).map((src) => (
              <label
                key={src}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border cursor-pointer text-sm font-medium transition-all ${
                  videoSource === src
                    ? "border-japan-red bg-japan-red/10 text-japan-red"
                    : "border-paper-dark text-ink-muted"
                }`}
              >
                <input
                  type="radio"
                  name="video_source"
                  value={src}
                  checked={videoSource === src}
                  onChange={() => setVideoSource(src)}
                  className="sr-only"
                />
                {src === "link" ? "🔗 Link / YouTube" : "📱 Upload fra telefon"}
              </label>
            ))}
          </div>

          {videoSource === "link" && (
            <input
              type="url"
              name="video_url"
              defaultValue={entry?.video_url ?? ""}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full rounded-xl border border-paper-dark bg-paper px-3 py-2.5 text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-japan-red"
            />
          )}

          {videoSource === "upload" && (
            <UploadVideoField defaultUrl={entry?.video_url ?? null} />
          )}
        </div>
      )}

      {/* Noter */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-ink-light">Noter</label>
        <textarea
          name="notes"
          defaultValue={entry?.notes ?? ""}
          rows={3}
          placeholder="Åbningstider, tips, anbefalinger…"
          className="w-full rounded-xl border border-paper-dark bg-paper px-3 py-3 text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-japan-red resize-none"
        />
      </div>

      {/* Prioritet */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-ink-light">Prioritet</label>
        <div className="grid grid-cols-2 gap-2">
          {PRIORITY_OPTIONS.map((p) => (
            <label
              key={p.value}
              className={`flex items-center justify-center py-2.5 rounded-xl border cursor-pointer text-sm font-semibold transition-all ${
                p.value === "must-do"
                  ? "has-[:checked]:bg-japan-red has-[:checked]:text-white has-[:checked]:border-japan-red border-paper-dark text-ink-muted"
                  : "has-[:checked]:bg-gold has-[:checked]:text-ink has-[:checked]:border-gold border-paper-dark text-ink-muted"
              }`}
            >
              <input
                type="radio"
                name="priority"
                value={p.value}
                defaultChecked={
                  entry ? entry.priority === p.value : p.value === "nice-to-have"
                }
                className="sr-only"
              />
              {p.label}
            </label>
          ))}
        </div>
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
        {isPending ? "Gemmer…" : entry ? "Gem ændringer" : "Tilføj"}
      </button>
    </form>
  );
}

function UploadVideoField({ defaultUrl }: { defaultUrl: string | null }) {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(defaultUrl);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      setUploadedUrl(url);
    } catch {
      setUploadError("Upload mislykkedes. Prøv igen.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="text-sm text-ink-muted file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-japan-red file:text-white file:font-medium"
      />
      {uploading && <p className="text-sm text-ink-muted">Uploader…</p>}
      {uploadError && <p className="text-sm text-japan-red">{uploadError}</p>}
      {uploadedUrl && (
        <>
          <input type="hidden" name="video_url" value={uploadedUrl} />
          <p className="text-sm text-ink-muted">✓ Video uploadet</p>
        </>
      )}
    </div>
  );
}
