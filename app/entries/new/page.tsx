import { createClient } from "@/lib/supabase/server";
import { EntryForm } from "@/components/entries/EntryForm";

interface Props {
  searchParams: Promise<{ city?: string; citySlug?: string }>;
}

export default async function NewEntryPage({ searchParams }: Props) {
  const { city: defaultCityId, citySlug = "" } = await searchParams;
  const supabase = await createClient();
  const { data: cities } = await supabase.from("cities").select("*").order("name");

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <EntryForm
        cities={cities ?? []}
        defaultCityId={defaultCityId}
        citySlug={citySlug}
      />
    </div>
  );
}
