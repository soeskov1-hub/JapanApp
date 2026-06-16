export type EntryType = "destination" | "restaurant" | "bar" | "shopping" | "hotel" | "video";
export type Priority = "must-do" | "nice-to-have";
export type VideoSource = "upload" | "link";

export interface City {
  id: string;
  name: string;
  created_at: string;
}

export interface Entry {
  id: string;
  city_id: string;
  type: EntryType;
  name: string;
  address: string | null;
  google_maps_url: string | null;
  notes: string | null;
  priority: Priority;
  video_source: VideoSource | null;
  video_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface EntryWithCity extends Entry {
  cities: City;
}

export interface CityDate {
  id: string;
  city_id: string;
  start_date: string;
  end_date: string;
}

export interface CalendarEntry {
  id: string;
  entry_id: string;
  scheduled_date: string;
}

export type NewEntry = Omit<Entry, "id" | "created_at" | "updated_at">;
export type UpdateEntry = Partial<NewEntry>;
