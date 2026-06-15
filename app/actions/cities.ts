"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function createCity(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  if (!name) throw new Error("Bynavn er påkrævet");

  const supabase = createAdminClient();

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
  const supabase = createAdminClient();
  const { error } = await supabase.from("cities").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
}

export async function updateCitiesOrder(ids: string[]) {
  const supabase = createAdminClient();
  await Promise.all(
    ids.map((id, index) =>
      supabase.from("cities").update({ sort_order: index }).eq("id", id)
    )
  );
  revalidatePath("/");
}
