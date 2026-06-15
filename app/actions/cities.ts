"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createCity(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  if (!name) throw new Error("Bynavn er påkrævet");

  const supabase = await createClient();
  const { error } = await supabase.from("cities").insert({ name });

  if (error) {
    if (error.code === "23505") throw new Error("Denne by findes allerede");
    throw new Error(error.message);
  }

  revalidatePath("/");
  redirect("/");
}
