import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { clampPct } from '../utils/inventory';

interface PercentControlProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function PercentControl({ value, onChange, disabled }: PercentControlProps) {
  const [inputValue, setInputValue] = useState(value.toString());
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setInputValue(value.toString());
    }
  }, [value, isEditing]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = clampPct(parseInt(e.target.value, 10));
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue, 10);
    if (!isNaN(numValue)) {
      onChange(clampPct(numValue));
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

  const handleSliderKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    let newValue = value;
    
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      newValue = clampPct(value - (e.shiftKey ? 5 : 1));
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      newValue = clampPct(value + (e.shiftKey ? 5 : 1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      newValue = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      newValue = 100;
    }
    
    if (newValue !== value) {
      onChange(newValue);
    }
  };

  const handleInputFocus = () => {
    setIsEditing(true);
  };

  // Calculate gradient color based on value
  const getGradientColor = () => {
    if (value === 0) return 'bg-gradient-to-r from-rose-500 to-rose-600';
    if (value < 33) return 'bg-gradient-to-r from-amber-500 to-amber-600';
    return 'bg-gradient-to-r from-emerald-500 to-emerald-600';
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center gap-4">
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={handleSliderChange}
          onKeyDown={handleSliderKeyDown}
          disabled={disabled}
          className="flex-1 h-3 bg-gray-200 rounded-full appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed slider"
          aria-label="Percentage slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
          aria-valuetext={`${value} percent`}
          style={{
            background: `linear-gradient(to right, 
              ${value === 0 ? '#ef4444' : value < 33 ? '#f59e0b' : '#10b981'} 0%, 
              ${value === 0 ? '#dc2626' : value < 33 ? '#d97706' : '#059669'} ${value}%, 
              #e5e7eb ${value}%, 
              #e5e7eb 100%)`
          }}
        />
        
        <div className="flex items-center gap-2 bg-white rounded-xl border-2 border-gray-200 shadow-sm px-3 py-2">
          <input
            ref={inputRef}
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            onKeyDown={handleInputKeyDown}
            disabled={disabled}
            className="w-14 text-center text-lg font-bold focus:outline-none disabled:bg-white disabled:cursor-not-allowed"
            aria-label="Percentage value"
            min="0"
            max="100"
          />
          <span className="text-gray-600 font-bold text-lg">%</span>
        </div>
      </div>
      
      {/* Progress bar visualization */}
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div 
          className={`absolute top-0 left-0 h-full ${getGradientColor()} transition-all duration-300 rounded-full`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
