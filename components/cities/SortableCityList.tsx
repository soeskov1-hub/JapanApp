"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { updateCitiesOrder, deleteCity } from "@/app/actions/cities";
import { SortableCityRow } from "./SortableCityRow";

interface City {
  id: string;
  name: string;
  entryCount: number;
}

export function SortableCityList({ cities }: { cities: City[] }) {
  const [items, setItems] = useState(cities);

  // Sync when server re-renders with new data (e.g. after adding a city)
  useEffect(() => {
    setItems(cities);
  }, [cities]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((c) => c.id === active.id);
    const newIndex = items.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);

    setItems(reordered);
    await updateCitiesOrder(reordered.map((c) => c.id));
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Slet "${name}"? Alle steder i denne by slettes også.`)) return;

    // Optimistically remove from list immediately
    const previous = items;
    setItems((curr) => curr.filter((c) => c.id !== id));

    try {
      await deleteCity(id);
    } catch {
      setItems(previous); // restore on error
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {items.map((city) => (
            <SortableCityRow
              key={city.id}
              id={city.id}
              name={city.name}
              entryCount={city.entryCount}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
