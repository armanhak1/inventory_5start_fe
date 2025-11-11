import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { clampQty } from '../utils/inventory';

interface QtyControlProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function QtyControl({ value, onChange, disabled }: QtyControlProps) {
  const [inputValue, setInputValue] = useState(value.toString());
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const holdIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isEditing) {
      setInputValue(value.toString());
    }
  }, [value, isEditing]);

  const handleDecrement = () => {
    const newValue = clampQty(value - 1);
    onChange(newValue);
  };

  const handleIncrement = () => {
    const newValue = clampQty(value + 1);
    onChange(newValue);
  };

  const startHold = (action: () => void) => {
    action(); // Call once immediately
    holdIntervalRef.current = window.setInterval(action, 150);
  };

  const handleClick = (action: () => void) => {
    action(); // Single click
  };

  const stopHold = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue, 10);
    if (!isNaN(numValue)) {
      onChange(clampQty(numValue));
    } else {
      setInputValue(value.toString());
    }
    setIsEditing(false);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setInputValue(value.toString());
      setIsEditing(false);
      inputRef.current?.blur();
    }
  };

  const handleInputFocus = () => {
    setIsEditing(true);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => handleClick(handleDecrement)}
        disabled={disabled || value <= 0}
        className="tap-target flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-gray-700 font-bold text-xl shadow-md hover:shadow-lg active:scale-95"
        aria-label="Decrease quantity"
      >
        −
      </button>
      
      <input
        ref={inputRef}
        type="number"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onFocus={handleInputFocus}
        onKeyDown={handleInputKeyDown}
        disabled={disabled}
        className="w-24 h-12 px-4 text-center text-lg font-bold border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
        aria-label="Quantity value"
        min="0"
        max="9999"
      />
      
      <button
        type="button"
        onClick={() => handleClick(handleIncrement)}
        disabled={disabled || value >= 9999}
        className="tap-target flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-white font-bold text-xl shadow-md hover:shadow-lg active:scale-95"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
