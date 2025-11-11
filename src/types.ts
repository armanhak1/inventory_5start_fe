export type ItemType = 'qty' | 'pct';

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  value: number;
  notes?: string;
  updatedAt: string;
}

export type StatusColor = 'red' | 'yellow' | 'green';

export interface HistoryEntry {
  itemId: string;
  previousValue: number;
  newValue: number;
  timestamp: string;
}