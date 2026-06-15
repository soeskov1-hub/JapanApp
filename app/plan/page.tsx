import { createClient } from "@/lib/supabase/server";
import { CityDateManager } from "@/components/plan/CityDateManager";
import { DaySchedule } from "@/components/plan/DaySchedule";
import type { City, CityDate, Entry, CalendarEntry } from "@/lib/supabase/types";

export const metadata = { title: "Planlæg" };

function eachDay(start: string, end: string): string[] {
  const days: string[] = [];
  const cur = new Date(start + "T12:00:00");
  const last = new Date(end + "T12:00:00");
  while (cur <= last) {
    days.push(cur.toISOString().slice(0, 10));
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

export default async function PlanPage() {
  const supabase = await createClient();

  const [{ data: cities }, { data: cityDates }, { data: entries }, { data: calendarEntries }] =
    await Promise.all([
      supabase.from("cities").select("*").order("sort_order", { ascending: true }).order("name"),
      supabase.from("city_dates").select("*"),
      supabase.from("entries").select("*").order("name"),
      supabase.from("calendar_entries").select("*"),
    ]);

  const allCities: City[] = cities ?? [];
  const allDates: CityDate[] = cityDates ?? [];
  const allEntries: Entry[] = entries ?? [];
  const allCalendar: CalendarEntry[] = calendarEntries ?? [];

  // Build calendar: ordered list of {date, city}
  type DayItem = { date: string; city: City };
  const days: DayItem[] = [];
  for (const cd of allDates) {
    const city = allCities.find((c) => c.id === cd.city_id);
    if (!city) continue;
    for (const date of eachDay(cd.start_date, cd.end_date)) {
      days.push({ date, city });
    }
  }
  days.sort((a, b) => a.date.localeCompare(b.date));

  // Entries grouped by city
  const entriesByCity = new Map<string, Entry[]>();
  for (const e of allEntries) {
    if (!entriesByCity.has(e.city_id)) entriesByCity.set(e.city_id, []);
    entriesByCity.get(e.city_id)!.push(e);
  }

  // Calendar entries grouped by date
  const calendarByDate = new Map<string, Set<string>>();
  for (const ce of allCalendar) {
    if (!calendarByDate.has(ce.scheduled_date)) calendarByDate.set(ce.scheduled_date, new Set());
    calendarByDate.get(ce.scheduled_date)!.add(ce.entry_id);
  }

  const entryById = new Map(allEntries.map((e) => [e.id, e]));

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-ink">Planlæg 🇯🇵</h1>
      </div>

      {/* City date manager */}
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-bold text-ink-light uppercase tracking-wide text-sm">
          Byer &amp; datoer
        </h2>
        {allCities.length === 0 ? (
          <p className="text-ink-muted text-sm">Tilføj byer på forsiden først.</p>
        ) : (
          <CityDateManager cities={allCities} cityDates={allDates} />
        )}
      </section>

      {/* Calendar */}
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-bold text-ink-light uppercase tracking-wide text-sm">
          Kalender
        </h2>
        {days.length === 0 ? (
          <div className="text-center py-10 text-ink-muted">
            <p className="text-3xl mb-2">📅</p>
            <p>Sæt datoer for dine byer ovenfor for at se kalenderen.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {days.map(({ date, city }) => {
              const scheduledIds = calendarByDate.get(date) ?? new Set<string>();
              const scheduled = [...scheduledIds]
                .map((id) => entryById.get(id))
                .filter((e): e is Entry => !!e && e.city_id === city.id)
                .map((e) => ({ ...e, scheduledId: e.id }));
              const available = entriesByCity.get(city.id) ?? [];

              return (
                <DaySchedule
                  key={date}
                  date={date}
                  cityName={city.name}
                  scheduledEntries={scheduled}
                  availableEntries={available}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
