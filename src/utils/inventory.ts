import type { Item, ItemType, StatusColor } from '../types';

/**
 * Calculate status color based on item type and value
 * Red = 0/0%; Yellow = <3 qty/<33%; Green = otherwise. Red overrides Yellow.
 */
export function getStatusColor(item: Item): StatusColor {
  if (item.type === 'qty') {
    if (item.value === 0) return 'red';
    if (item.value < 3) return 'yellow';
    return 'green';
  } else {
    if (item.value === 0) return 'red';
    if (item.value < 33) return 'yellow';
    return 'green';
  }
}

/**
 * Get status label for accessibility
 */
export function getStatusLabel(color: StatusColor): string {
  switch (color) {
    case 'red':
      return 'Out of Stock';
    case 'yellow':
      return 'Low Stock';
    case 'green':
      return 'In Stock';
  }
}

/**
 * Normalize string for case and diacritic-insensitive comparison
 */
export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Filter items by search query (debounced in component)
 */
export function filterBySearch(items: Item[], query: string): Item[] {
  if (!query.trim()) return items;
  const normalized = normalizeString(query);
  return items.filter(item => 
    normalizeString(item.name).includes(normalized)
  );
}

/**
 * Filter items by status color
 */
export function filterByStatus(items: Item[], status: StatusColor | 'all'): Item[] {
  if (status === 'all') return items;
  return items.filter(item => getStatusColor(item) === status);
}

/**
 * Clamp value within bounds
 */
export function clampQty(value: number): number {
  return Math.max(0, Math.min(9999, Math.floor(value)));
}

export function clampPct(value: number): number {
  return Math.max(0, Math.min(100, Math.floor(value)));
}

/**
 * Validate item name (unique, non-empty)
 */
export function validateItemName(name: string, existingItems: Item[], currentItemId?: string): string | null {
  const trimmed = name.trim();
  
  if (!trimmed) {
    return 'Name is required';
  }
  
  const duplicate = existingItems.find(
    item => item.id !== currentItemId && normalizeString(item.name) === normalizeString(trimmed)
  );
  
  if (duplicate) {
    return 'An item with this name already exists';
  }
  
  return null;
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

