import React from "react";
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableItem = ({ agent, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: agent.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bucket-item">
      <div>
        <strong>{agent.name}</strong>
        <p className="bucket-desc">{agent.description}</p>
      </div>

      <button onClick={() => onRemove(agent.id)}>✕</button>
    </div>
  );
};

const SelectionBucket = ({ selectedAgents, setSelectedAgents }) => {

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = selectedAgents.findIndex(
      (item) => item.id === active.id
    );
    const newIndex = selectedAgents.findIndex(
      (item) => item.id === over.id
    );

    setSelectedAgents((items) =>
      arrayMove(items, oldIndex, newIndex)
    );
  };

  const removeAgent = (id) => {
    setSelectedAgents((items) =>
      items.filter((a) => a.id !== id)
    );
  };

  return (
    <div className="bucket">
      <h2>🪣 Agent Selection Bucket</h2>

      {selectedAgents.length === 0 ? (
        <p>No agents selected.</p>
      ) : (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={selectedAgents.map((a) => a.id)}
            strategy={verticalListSortingStrategy}
          >
            {selectedAgents.map((agent) => (
              <SortableItem
                key={agent.id}
                agent={agent}
                onRemove={removeAgent}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default SelectionBucket;