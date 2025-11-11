import { useState, useRef } from 'react';
import type { Item } from '../types';
import { InventoryRow } from './InventoryRow';

interface InventoryListProps {
  items: Item[];
  dirtyItemIds: Set<string>;
  onChange: (itemId: string, newValue: number) => void;
  onDelete: (itemId: string) => void;
  height: number;
}

const ITEM_HEIGHT = 120; // Approximate height of each row
const BUFFER = 3; // Number of items to render above/below viewport

export function InventoryList({ items, dirtyItemIds, onChange, onDelete, height }: InventoryListProps) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center px-4">
          <p className="text-lg sm:text-xl font-medium mb-2">No items found</p>
          <p className="text-xs sm:text-sm">Add your first item to get started</p>
        </div>
      </div>
    );
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  // Calculate which items should be visible
  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - BUFFER);
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + height) / ITEM_HEIGHT) + BUFFER
  );

  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * ITEM_HEIGHT;
  const totalHeight = items.length * ITEM_HEIGHT;

  // For small lists (< 50 items), render everything for better performance
  if (items.length < 50) {
    return (
      <div 
        ref={containerRef}
        className="space-y-2 sm:space-y-3 overflow-y-auto pr-1 sm:pr-2 pb-4 touch-pan-y"
        style={{ maxHeight: `${height}px` }}
        onScroll={handleScroll}
      >
        {items.map(item => (
          <InventoryRow
            key={item.id}
            item={item}
            isDirty={dirtyItemIds.has(item.id)}
            onChange={onChange}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  // Virtual scrolling for large lists
  return (
    <div 
      ref={containerRef}
      className="overflow-y-auto pr-1 sm:pr-2 pb-4 touch-pan-y"
      style={{ maxHeight: `${height}px` }}
      onScroll={handleScroll}
    >
      <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
        <div 
          style={{ 
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
          className="space-y-2 sm:space-y-3"
        >
          {visibleItems.map(item => (
            <InventoryRow
              key={item.id}
              item={item}
              isDirty={dirtyItemIds.has(item.id)}
              onChange={onChange}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
