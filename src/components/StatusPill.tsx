import type { StatusColor } from '../types';
import { getStatusLabel } from '../utils/inventory';

interface StatusPillProps {
  color: StatusColor;
}

export function StatusPill({ color }: StatusPillProps) {
  const label = getStatusLabel(color);
  
  const colorClasses = {
    red: 'bg-gradient-to-r from-rose-100 to-rose-50 text-rose-800 border-rose-300 shadow-sm',
    yellow: 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-900 border-amber-300 shadow-sm',
    green: 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 border-emerald-300 shadow-sm',
  };

  return (
    <span
      className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold border-2 ${colorClasses[color]} transition-all duration-150`}
      role="status"
      aria-label={`Status: ${label}`}
    >
      {label}
    </span>
  );
}
