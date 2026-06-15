"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CityRow } from "./CityRow";

interface Props {
  id: string;
  name: string;
  entryCount: number;
}

export function SortableCityRow({ id, name, entryCount }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="touch-none flex-shrink-0 p-2 text-ink-muted cursor-grab active:cursor-grabbing"
        aria-label="Træk for at sortere"
        tabIndex={-1}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="5" cy="4" r="1.5" />
          <circle cx="5" cy="8" r="1.5" />
          <circle cx="5" cy="12" r="1.5" />
          <circle cx="11" cy="4" r="1.5" />
          <circle cx="11" cy="8" r="1.5" />
          <circle cx="11" cy="12" r="1.5" />
        </svg>
      </button>
      <div className="flex-1 min-w-0">
        <CityRow id={id} name={name} entryCount={entryCount} />
      </div>
    </div>
  );
}
