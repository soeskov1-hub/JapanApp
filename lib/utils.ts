export function buildGoogleMapsUrl(address: string): string {
  if (address.startsWith("http")) return address;
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`;
}

export const ENTRY_TYPES = [
  { value: "destination", label: "Seværdighed", emoji: "🗾" },
  { value: "restaurant", label: "Restaurant", emoji: "🍜" },
  { value: "bar", label: "Barer", emoji: "🍺" },
  { value: "shopping", label: "Shopping", emoji: "🛍️" },
  { value: "hotel", label: "Hotel", emoji: "🏨" },
  { value: "video", label: "Video", emoji: "🎬" },
] as const;

export const PRIORITY_OPTIONS = [
  { value: "must-do", label: "Skal ses", color: "bg-japan-red text-white" },
  { value: "nice-to-have", label: "Hvis tid", color: "bg-gold-light text-ink" },
] as const;

export const SEED_CITIES = [
  "Tokyo",
  "Kyoto",
  "Osaka",
  "Nara",
  "Hiroshima",
  "Sapporo",
  "Fukuoka",
  "Hakone",
];

export function getEntryTypeInfo(type: string) {
  return ENTRY_TYPES.find((t) => t.value === type) ?? ENTRY_TYPES[0];
}

export function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export function deslugify(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function isYoutubeUrl(url: string): boolean {
  return /youtube\.com|youtu\.be/.test(url);
}

export function getYoutubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}
