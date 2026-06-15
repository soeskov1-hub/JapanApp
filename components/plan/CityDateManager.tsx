"use client";

import { useState } from "react";
import { CityDateForm } from "./CityDateForm";
import type { City, CityDate } from "@/lib/supabase/types";

interface Props {
  cities: City[];
  cityDates: CityDate[];
}

export function CityDateManager({ cities, cityDates }: Props) {
  const [editingCityId, setEditingCityId] = useState<string | null>(null);

  const dateMap = new Map(cityDates.map((d) => [d.city_id, d]));
  const editingCity = cities.find((c) => c.id === editingCityId);
  const editing = editingCityId ? dateMap.get(editingCityId) : undefined;

  return (
    <>
      <div className="flex flex-col gap-2">
        {cities.map((city) => {
          const dates = dateMap.get(city.id);
          return (
            <div
              key={city.id}
              className="flex items-center justify-between px-4 py-3 bg-paper rounded-xl border border-paper-dark"
            >
              <div>
                <p className="font-semibold text-ink">{city.name}</p>
                {dates ? (
                  <p className="text-xs text-ink-muted">
                    {formatDate(dates.start_date)} → {formatDate(dates.end_date)}
                  </p>
                ) : (
                  <p className="text-xs text-ink-muted">Ingen datoer sat</p>
                )}
              </div>
              <button
                onClick={() => setEditingCityId(city.id)}
                className="text-xs px-3 py-1.5 rounded-full border border-japan-red text-japan-red font-semibold"
              >
                {dates ? "Rediger" : "Sæt datoer"}
              </button>
            </div>
          );
        })}
      </div>

      {editingCityId && editingCity && (
        <CityDateForm
          cityId={editingCityId}
          cityName={editingCity.name}
          currentStart={editing?.start_date}
          currentEnd={editing?.end_date}
          onClose={() => setEditingCityId(null)}
        />
      )}
    </>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("da-DK", {
    day: "numeric",
    month: "short",
  });
}
