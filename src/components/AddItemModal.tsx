import { useState, useRef, useEffect, FormEvent } from 'react';
import type { ItemType, Item } from '../types';
import { validateItemName, clampQty, clampPct } from '../utils/inventory';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, type: ItemType, value: number, notes?: string) => void;
  existingItems: Item[];
}

export function AddItemModal({ isOpen, onClose, onAdd, existingItems }: AddItemModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<ItemType>('qty');
  const [value, setValue] = useState('0');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const nameInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      nameInputRef.current?.focus();
      // Reset form
      setName('');
      setType('qty');
      setValue('0');
      setNotes('');
      setError(null);
    }
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Validate name
    const nameError = validateItemName(name, existingItems);
    if (nameError) {
      setError(nameError);
      return;
    }

    // Parse and validate value
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) {
      setError('Please enter a valid number');
      return;
    }

    const clampedValue = type === 'qty' ? clampQty(numValue) : clampPct(numValue);
    
    if (type === 'qty' && (numValue < 0 || numValue > 9999)) {
      setError('Quantity must be between 0 and 9999');
      return;
    }
    
    if (type === 'pct' && (numValue < 0 || numValue > 100)) {
      setError('Percentage must be between 0 and 100');
      return;
    }

    // Submit
    onAdd(name.trim(), type, clampedValue, notes.trim() || undefined);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in p-3 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full animate-slide-up max-h-[90vh] overflow-y-auto"
      >
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl sm:rounded-t-3xl sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 id="modal-title" className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Add New Item
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-white p-1.5 sm:p-2"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5">
          {error && (
            <div className="p-3 sm:p-4 bg-rose-50 border-2 border-rose-200 rounded-lg sm:rounded-xl text-rose-800 text-xs sm:text-sm font-medium flex items-center gap-2 sm:gap-3" role="alert">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="item-name" className="block text-sm font-bold text-gray-700 mb-2">
              Item Name *
            </label>
            <input
              ref={nameInputRef}
              id="item-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              placeholder="Enter item name"
              required
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Item Type *
            </label>
            <div className="flex gap-3">
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="qty"
                  checked={type === 'qty'}
                  onChange={() => setType('qty')}
                  className="sr-only peer"
                />
                <div className="p-4 rounded-xl border-2 border-gray-300 peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:border-blue-400 transition-all duration-200 text-center">
                  <div className="text-2xl mb-1">📦</div>
                  <div className="font-semibold text-sm">Quantity</div>
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="pct"
                  checked={type === 'pct'}
                  onChange={() => setType('pct')}
                  className="sr-only peer"
                />
                <div className="p-4 rounded-xl border-2 border-gray-300 peer-checked:border-purple-500 peer-checked:bg-purple-50 hover:border-purple-400 transition-all duration-200 text-center">
                  <div className="text-2xl mb-1">📊</div>
                  <div className="font-semibold text-sm">Percentage</div>
                </div>
              </label>
            </div>
          </div>

          {/* Initial Value */}
          <div>
            <label htmlFor="item-value" className="block text-sm font-bold text-gray-700 mb-2">
              Initial Value *
            </label>
            <div className="flex items-center gap-3">
              <input
                id="item-value"
                type="number"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError(null);
                }}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                min="0"
                max={type === 'qty' ? 9999 : 100}
                placeholder="0"
                required
              />
              {type === 'pct' && <span className="text-gray-600 font-bold text-lg">%</span>}
            </div>
            <p className="mt-2 text-xs text-gray-500 font-medium">
              {type === 'qty' ? 'Range: 0 - 9,999 units' : 'Range: 0 - 100%'}
            </p>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="item-notes" className="block text-sm font-bold text-gray-700 mb-2">
              Notes <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="item-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-base"
              placeholder="Add any additional information..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 border-2 border-gray-200 active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg sm:rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
