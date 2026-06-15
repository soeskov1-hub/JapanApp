import type { Priority } from "@/lib/supabase/types";

const styles: Record<Priority, string> = {
  "must-do": "bg-japan-red text-white",
  "nice-to-have": "bg-gold-light text-ink",
};

const labels: Record<Priority, string> = {
  "must-do": "Skal ses",
  "nice-to-have": "Hvis tid",
};

export function Badge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles[priority]}`}
    >
      {labels[priority]}
    </span>
  );
}
