"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function setCityDates(cityId: string, startDate: string, endDate: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("city_dates")
    .upsert({ city_id: cityId, start_date: startDate, end_date: endDate }, { onConflict: "city_id" });
  if (error) throw new Error(error.message);
  revalidatePath("/plan");
}

export async function removeCityDates(cityId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("city_dates").delete().eq("city_id", cityId);
  if (error) throw new Error(error.message);
  revalidatePath("/plan");
}

export async function scheduleEntry(entryId: string, date: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("calendar_entries")
    .upsert({ entry_id: entryId, scheduled_date: date }, { onConflict: "entry_id,scheduled_date" });
  if (error) throw new Error(error.message);
  revalidatePath("/plan");
}

export async function unscheduleEntry(entryId: string, date: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("calendar_entries")
    .delete()
    .eq("entry_id", entryId)
    .eq("scheduled_date", date);
  if (error) throw new Error(error.message);
  revalidatePath("/plan");
}
