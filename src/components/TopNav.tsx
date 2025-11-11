import { useRef, useEffect } from 'react';
import type { StatusColor } from '../types';
import logo from '../assets/five_star_care_logo.webp';

interface TopNavProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: StatusColor | 'all';
  onStatusFilterChange: (status: StatusColor | 'all') => void;
  onReset: () => void;
  onExportCSV: () => void;
  itemCount: number;
  focusSearchShortcut?: boolean;
}

export function TopNav({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onReset,
  onExportCSV,
  itemCount,
  focusSearchShortcut,
}: TopNavProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusSearchShortcut) {
      searchInputRef.current?.focus();
    }
  }, [focusSearchShortcut]);

  const filters: Array<{ value: StatusColor | 'all'; label: string; color: string }> = [
    { value: 'all', label: 'All', color: 'bg-gray-200 text-gray-800 hover:bg-gray-300' },
    { value: 'green', label: 'In Stock', color: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-300' },
    { value: 'yellow', label: 'Low Stock', color: 'bg-amber-100 text-amber-900 hover:bg-amber-200 border-amber-300' },
    { value: 'red', label: 'Out of Stock', color: 'bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-300' },
  ];

  const hasActiveFilters = searchQuery || statusFilter !== 'all';

  return (
    <nav className="bg-gradient-to-r from-white via-blue-50 to-white border-b border-gray-200 shadow-lg sticky top-0 z-40 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <img 
            src={logo} 
            alt="Five Star Care Logo" 
            className="h-10 sm:h-12 w-auto object-contain"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              5 Star Care
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Inventory Management System</p>
          </div>
          <button
            onClick={onExportCSV}
            className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1.5 sm:gap-2 active:scale-95"
            aria-label="Export inventory to CSV"
            title={`Export ${itemCount} items to CSV`}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">CSV</span>
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search items..."
              className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
              aria-label="Search inventory items"
            />
            <svg
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 p-1 transition-colors"
                aria-label="Clear search"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2" role="group" aria-label="Status filters">
            {filters.map(filter => (
              <button
                key={filter.value}
                onClick={() => onStatusFilterChange(filter.value)}
                className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 border-2 ${
                  statusFilter === filter.value
                    ? `${filter.color} ring-2 ring-offset-1 sm:ring-offset-2 ring-blue-400 scale-105 shadow-md`
                    : `${filter.color} border-transparent shadow-sm`
                }`}
                aria-pressed={statusFilter === filter.value}
              >
                {filter.label}
              </button>
            ))}
            
            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                onClick={onReset}
                className="px-3 sm:px-5 py-2 sm:py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-xs sm:text-sm rounded-lg sm:rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1.5 sm:gap-2"
                aria-label="Reset all filters"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
