import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { EntryList } from "@/components/entries/EntryList";
import { deslugify, ENTRY_TYPES } from "@/lib/utils";
import type { EntryType } from "@/lib/supabase/types";

interface CityPageProps {
  params: Promise<{ city: string }>;
  searchParams: Promise<{ type?: string }>;
}

export async function generateMetadata({ params }: CityPageProps) {
  const { city } = await params;
  return { title: `${deslugify(city)} — Japan-app` };
}

export default async function CityPage({ params, searchParams }: CityPageProps) {
  const { city: citySlug } = await params;
  const { type } = await searchParams;
  const cityName = deslugify(citySlug);

  const supabase = await createClient();
  const { data: cityData } = await supabase
    .from("cities")
    .select("*")
    .ilike("name", cityName)
    .single();

  if (!cityData) notFound();

  const { data: entries } = await supabase
    .from("entries")
    .select("*")
    .eq("city_id", cityData.id)
    .order("created_at", { ascending: false });

  const activeType = (type as EntryType | undefined) ?? "all";
  const allEntries = entries ?? [];

  const tabs = [
    { value: "all", label: "Alle", emoji: "🗾" },
    ...ENTRY_TYPES,
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">
      {/* Back + title */}
      <div>
        <Link href="/" className="text-ink-muted text-sm hover:text-ink">
          ← Tilbage
        </Link>
        <h1 className="text-2xl font-bold text-ink mt-1">{cityName} 🇯🇵</h1>
        <p className="text-ink-muted text-sm">
          {allEntries.length} {allEntries.length === 1 ? "sted" : "steder"}
        </p>
      </div>

      {/* Type filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = tab.value === activeType;
          const count =
            tab.value === "all"
              ? allEntries.length
              : allEntries.filter((e) => e.type === tab.value).length;
          return (
            <Link
              key={tab.value}
              href={
                tab.value === "all"
                  ? `/${citySlug}`
                  : `/${citySlug}?type=${tab.value}`
              }
              className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-all flex-shrink-0 ${
                isActive
                  ? "bg-japan-red text-white"
                  : "bg-paper-dark text-ink-muted hover:text-ink"
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
              <span
                className={`text-xs ${isActive ? "text-white/80" : "text-ink-muted"}`}
              >
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Entry list */}
      <EntryList entries={allEntries} activeType={activeType} />

      {/* FAB — add entry */}
      <Link
        href={`/entries/new?city=${cityData.id}&citySlug=${citySlug}`}
        className="fixed bottom-20 right-4 z-30 w-14 h-14 bg-japan-red text-white rounded-full shadow-lg flex items-center justify-center text-2xl active:scale-90 transition-transform"
        aria-label="Tilføj sted"
      >
        +
      </Link>
    </div>
  );
}
