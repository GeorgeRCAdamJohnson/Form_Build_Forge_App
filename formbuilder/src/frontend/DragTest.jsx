import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div style={{ 
        padding: '10px', 
        margin: '5px 0', 
        border: '1px solid #ccc',
        backgroundColor: '#f9f9f9',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div 
          {...listeners} 
          style={{ 
            cursor: 'grab', 
            padding: '5px',
            backgroundColor: '#ddd',
            borderRadius: '3px'
          }}
        >
          ⋮⋮
        </div>
        {children}
      </div>
    </div>
  );
};

const DragTest = () => {
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3', 'Item 4']);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id && over) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Drag Test</h2>
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map(item => (
            <SortableItem key={item} id={item}>
              {item}
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default DragTest;