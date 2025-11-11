interface AddItemFABProps {
  onClick: () => void;
}

export function AddItemFAB({ onClick }: AddItemFABProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-200 flex items-center justify-center z-40 group transform hover:scale-110 active:scale-95"
      aria-label="Add new item"
      title="Add new item"
    >
      <svg
        className="w-7 h-7 sm:w-8 sm:h-8 transform group-hover:rotate-90 transition-transform duration-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={3}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  );
}
