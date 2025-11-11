import type { Item } from '../types';
import { getStatusColor } from '../utils/inventory';
import { StatusPill } from './StatusPill';
import { QtyControl } from './QtyControl';
import { PercentControl } from './PercentControl';

interface InventoryRowProps {
  item: Item;
  isDirty: boolean;
  onChange: (itemId: string, newValue: number) => void;
  onDelete: (itemId: string) => void;
  style?: React.CSSProperties;
}

export function InventoryRow({ item, isDirty, onChange, onDelete, style }: InventoryRowProps) {
  const statusColor = getStatusColor(item);

  const handleChange = (newValue: number) => {
    onChange(item.id, newValue);
  };

  const handleDelete = () => {
    onDelete(item.id);
  };

  return (
    <div
      style={style}
      className="relative flex flex-col gap-3 sm:gap-4 p-4 sm:p-5 bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-200 hover:border-blue-300"
    >
      {/* Dirty indicator */}
      {isDirty && (
        <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-500 shadow-lg flex items-center justify-center animate-pulse z-10">
          <span className="text-white text-xs font-bold">!</span>
        </div>
      )}

      {/* Delete button */}
      <button
        onClick={handleDelete}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm hover:shadow-md z-20"
        aria-label={`Delete ${item.name}`}
        title="Delete item"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Header: Name and Status */}
      <div className="flex items-start justify-between gap-2 sm:gap-3 pr-8 sm:pr-10">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate mb-2">
            {item.name}
          </h3>
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs font-semibold ${
              item.type === 'qty' 
                ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200' 
                : 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 border border-purple-200'
            }`}>
              {item.type === 'qty' ? '📦 Quantity' : '📊 Percentage'}
            </span>
          </div>
          
          {item.notes && (
            <p className="mt-2 text-xs sm:text-sm text-gray-600 line-clamp-2 italic">
              {item.notes}
            </p>
          )}
        </div>

        <StatusPill color={statusColor} />
      </div>

      {/* Control - Full width on mobile */}
      <div className="flex items-center justify-center w-full">
        {item.type === 'qty' ? (
          <QtyControl value={item.value} onChange={handleChange} />
        ) : (
          <div className="w-full">
            <PercentControl value={item.value} onChange={handleChange} />
          </div>
        )}
      </div>
    </div>
  );
}
