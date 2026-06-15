import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CityRow } from "@/components/cities/CityRow";
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
        <h1 className="text-3xl font-bold text-ink">Japan Tur</h1>
        <p className="text-ink-muted mt-1 text-sm">Din personlige rejseplanlægger</p>
      </div>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-ink">Byer</h2>
          <Link
            href="/cities/new"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-japan-red text-white text-sm font-semibold active:scale-95 transition-transform"
          >
            + Tilføj by
          </Link>
        </div>
        <Suspense fallback={<CityListSkeleton />}>
          <CityList />
        </Suspense>
      </section>
    </div>
  );
}

async function CityList() {
  const items = await getCitiesWithCounts();

  if (items.length === 0) {
    return (
      <div className="text-center py-10 text-ink-muted">
        <p>Ingen byer fundet.</p>
        <p className="text-sm mt-1">
          Kør supabase-schema.sql migrationen først.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map(({ city, count }) => (
        <CityRow key={city.id} id={city.id} name={city.name} entryCount={count} />
      ))}
    </div>
  );
}

function CityListSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 rounded-xl bg-paper-dark animate-pulse" />
      ))}
    </div>
  );
}
