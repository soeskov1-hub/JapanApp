"use client";

import { useState } from "react";
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
import { updateCitiesOrder } from "@/app/actions/cities";
import { SortableCityRow } from "./SortableCityRow";

interface City {
  id: string;
  name: string;
  entryCount: number;
}

export function SortableCityList({ cities }: { cities: City[] }) {
  const [items, setItems] = useState(cities);

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

    setItems(reordered); // optimistic update
    await updateCitiesOrder(reordered.map((c) => c.id));
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
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
