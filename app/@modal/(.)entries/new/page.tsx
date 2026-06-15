import { createClient } from "@/lib/supabase/server";
import { Modal } from "@/components/ui/Modal";
import { EntryForm } from "@/components/entries/EntryForm";

interface Props {
  searchParams: Promise<{ city?: string; citySlug?: string }>;
}

export default async function NewEntryModal({ searchParams }: Props) {
  const { city: defaultCityId, citySlug = "" } = await searchParams;
  const supabase = await createClient();
  const { data: cities } = await supabase.from("cities").select("*").order("name");

  return (
    <Modal>
      <EntryForm
        cities={cities ?? []}
        defaultCityId={defaultCityId}
        citySlug={citySlug}
      />
    </Modal>
  );
}
