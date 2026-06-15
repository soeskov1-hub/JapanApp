"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buildGoogleMapsUrl } from "@/lib/utils";
import type { EntryType, Priority, VideoSource } from "@/lib/supabase/types";

export async function createEntry(formData: FormData) {
  const supabase = await createClient();

  const address = formData.get("address") as string | null;
  const type = formData.get("type") as EntryType;
  const citySlug = formData.get("city_slug") as string;

  const { error } = await supabase.from("entries").insert({
    city_id: formData.get("city_id") as string,
    type,
    name: formData.get("name") as string,
    address: address || null,
    google_maps_url: address ? buildGoogleMapsUrl(address) : null,
    notes: (formData.get("notes") as string) || null,
    priority: formData.get("priority") as Priority,
    video_source: (formData.get("video_source") as VideoSource) || null,
    video_url: (formData.get("video_url") as string) || null,
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/${citySlug}`);
  redirect(`/${citySlug}`);
}

export async function updateEntry(id: string, formData: FormData) {
  const supabase = await createClient();

  const address = formData.get("address") as string | null;
  const citySlug = formData.get("city_slug") as string;

  const { error } = await supabase
    .from("entries")
    .update({
      name: formData.get("name") as string,
      address: address || null,
      google_maps_url: address ? buildGoogleMapsUrl(address) : null,
      notes: (formData.get("notes") as string) || null,
      priority: formData.get("priority") as Priority,
      video_source: (formData.get("video_source") as VideoSource) || null,
      video_url: (formData.get("video_url") as string) || null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath(`/${citySlug}`);
  redirect(`/${citySlug}`);
}

export async function deleteEntry(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("entries").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
}
