import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EntryForm } from "@/components/entries/EntryForm";
import { slugify } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditEntryPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: entry }, { data: cities }] = await Promise.all([
    supabase.from("entries").select("*").eq("id", id).single(),
    supabase.from("cities").select("*").order("name"),
  ]);

  if (!entry) notFound();

  const city = cities?.find((c) => c.id === entry.city_id);
  const citySlug = city ? slugify(city.name) : "";

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <EntryForm
        cities={cities ?? []}
        defaultCityId={entry.city_id}
        citySlug={citySlug}
        entry={entry}
      />
    </div>
  );
}
