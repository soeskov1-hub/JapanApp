"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createCity(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  if (!name) throw new Error("Bynavn er påkrævet");

  const supabase = await createClient();

  // Place new city at the end
  const { data: last } = await supabase
    .from("cities")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();
  const sort_order = (last?.sort_order ?? -1) + 1;

  const { error } = await supabase.from("cities").insert({ name, sort_order });

  if (error) {
    if (error.code === "23505") throw new Error("Denne by findes allerede");
    throw new Error(error.message);
  }

  revalidatePath("/");
}

export async function deleteCity(id: string) {
  const supabase = await createClient();
  // Entries cascade-delete automatically (ON DELETE CASCADE on entries.city_id)
  const { error } = await supabase.from("cities").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
}

export async function updateCitiesOrder(ids: string[]) {
  const supabase = await createClient();
  await Promise.all(
    ids.map((id, index) =>
      supabase.from("cities").update({ sort_order: index }).eq("id", id)
    )
  );
  revalidatePath("/");
}
