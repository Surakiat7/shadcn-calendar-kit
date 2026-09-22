"use client";

import { useDroppable } from "@dnd-kit/core";

import { cn } from "@/lib/utils";

export function Droppable({
  id,
  date,
  minutes,
  className,
  onClick,
  children,
}: {
  id: string;
  date: Date;
  minutes?: number;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id, data: { date, minutes } });

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={cn(isOver && "bg-accent", className)}
    >
      {children}
    </div>
  );
}
