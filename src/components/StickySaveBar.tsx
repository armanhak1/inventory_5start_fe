interface StickySaveBarProps {
  dirtyCount: number;
  onSave: () => void;
  onDiscard: () => void;
  onUndo: () => void;
  canUndo: boolean;
}

export function StickySaveBar({
  dirtyCount,
  onSave,
  onDiscard,
  onUndo,
  canUndo,
}: StickySaveBarProps) {
  if (dirtyCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
      <div className="bg-white border-t-4 border-blue-500 shadow-2xl backdrop-blur-sm bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 py-4 sm:py-4">
          <div className="flex items-center justify-between gap-3 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-3 h-3 sm:w-3 sm:h-3 rounded-full bg-blue-500 animate-pulse" aria-hidden="true" />
              <span className="text-base sm:text-base font-semibold text-gray-800">
                {dirtyCount} unsaved {dirtyCount === 1 ? 'change' : 'changes'}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={onUndo}
                disabled={!canUndo}
                className="px-4 sm:px-5 py-3 sm:py-2.5 text-sm sm:text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-gray-200 active:scale-95 min-h-[44px]"
                aria-label="Undo last change"
              >
                <span className="hidden sm:inline">Undo Last</span>
                <span className="sm:hidden">Undo</span>
              </button>
              
              <button
                onClick={onDiscard}
                className="px-4 sm:px-5 py-3 sm:py-2.5 text-sm sm:text-sm font-semibold text-rose-700 hover:bg-rose-50 rounded-lg sm:rounded-xl transition-all duration-150 border-2 border-rose-200 active:scale-95 min-h-[44px]"
                aria-label="Discard all changes"
              >
                <span className="hidden sm:inline">Discard All</span>
                <span className="sm:hidden">Discard</span>
              </button>
              
              <button
                onClick={onSave}
                className="px-5 sm:px-6 py-3 sm:py-2.5 text-sm sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-150 active:scale-95 min-h-[44px]"
                aria-label={`Save ${dirtyCount} ${dirtyCount === 1 ? 'change' : 'changes'}`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
