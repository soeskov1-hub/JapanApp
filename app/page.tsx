import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { CityCard } from "@/components/cities/CityCard";
import { SEED_CITIES } from "@/lib/utils";
import type { City } from "@/lib/supabase/types";

async function getCitiesWithCounts(): Promise<
  Array<{ city: City; count: number }>
> {
  const supabase = await createClient();
  const { data: cities } = await supabase
    .from("cities")
    .select("*, entries(count)")
    .order("name");

  return (cities ?? []).map((c) => ({
    city: { id: c.id, name: c.name, created_at: c.created_at },
    count: (c.entries as unknown as { count: number }[])[0]?.count ?? 0,
  }));
}

export default async function HomePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
      <div className="text-center py-4">
        <p className="text-5xl mb-2">🇯🇵</p>
        <h1 className="text-3xl font-bold text-ink">Japan Trip</h1>
        <p className="text-ink-muted mt-1 text-sm">Your personal trip planner</p>
      </div>

      <section>
        <h2 className="text-lg font-bold text-ink mb-3">Cities</h2>
        <Suspense fallback={<CityGridSkeleton />}>
          <CityGrid />
        </Suspense>
      </section>
    </div>
  );
}

async function CityGrid() {
  const items = await getCitiesWithCounts();

  if (items.length === 0) {
    return (
      <div className="text-center py-10 text-ink-muted">
        <p>No cities found.</p>
        <p className="text-sm mt-1">
          Run the supabase-schema.sql migration first.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {items.map(({ city, count }) => (
        <CityCard key={city.id} name={city.name} entryCount={count} />
      ))}
    </div>
  );
}

function CityGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {SEED_CITIES.map((name) => (
        <div key={name} className="h-32 rounded-2xl bg-paper-dark animate-pulse" />
      ))}
    </div>
  );
}
