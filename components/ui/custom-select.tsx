'use client';

import { useState, useRef, useEffect } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  variant?: 'light' | 'dark';
  className?: string;
  disabled?: boolean;
}

export function CustomSelect({
  options,
  value: _value,
  onChange,
  placeholder,
  variant = 'light',
  className = '',
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === _value) || null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          onChange(options[highlightedIndex].value);
          setIsOpen(false);
          setHighlightedIndex(-1);
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const baseStyles =
    variant === 'light'
      ? disabled
        ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
        : 'bg-gradient-to-r from-gray-50 to-white text-gray-900 border border-gray-200 backdrop-blur-sm hover:border-gray-300'
      : disabled
        ? 'bg-white/5 border border-white/10 text-white/40 cursor-not-allowed'
        : 'bg-white/10 border border-white/20 text-white backdrop-blur-sm hover:bg-white/15 shadow-lg';

  const dropdownStyles =
    variant === 'light'
      ? 'bg-white border border-gray-200 shadow-lg'
      : 'bg-black/90 border border-white/20 shadow-2xl backdrop-blur-xl';

  const optionStyles =
    variant === 'light' ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/10';

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      {/* Select Button */}
      <div
        onClick={disabled ? undefined : () => setIsOpen(!isOpen)}
        onKeyDown={disabled ? undefined : handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        className={`
          w-full px-4 py-3 pr-12 rounded-2xl transition-all duration-300
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          ${!disabled ? 'focus:ring-2 focus:outline-none' : ''}
          ${!disabled && variant === 'dark' ? 'hover:scale-[1.02]' : ''}
          ${baseStyles}
          ${!disabled && variant === 'light' ? 'focus:ring-black/20' : ''}
          ${!disabled && variant === 'dark' ? 'focus:ring-white/30' : ''}
          ${!disabled && isOpen ? 'ring-2' : ''}
          ${!disabled && isOpen && variant === 'light' ? 'ring-black/20' : ''}
          ${!disabled && isOpen && variant === 'dark' ? 'ring-white/30' : ''}
        `}
      >
        <span
          className={`truncate ${selectedOption ? '' : 'opacity-60'} ${disabled ? 'opacity-50' : ''}`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        {/* Arrow Icon */}
        <div className='absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none'>
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${
              !disabled && isOpen ? 'rotate-180' : 'rotate-0'
            } ${variant === 'light' ? (disabled ? 'text-gray-400' : 'text-gray-600') : disabled ? 'text-white/30' : 'text-white/70'}`}
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
          </svg>
        </div>
      </div>

      {/* Dropdown */}
      {!disabled && isOpen && (
        <div
          className={`
          absolute left-0 right-0 rounded-2xl overflow-hidden z-50
          ${variant === 'dark' ? 'bottom-full mb-2' : 'top-full mt-2'}
          ${dropdownStyles}
          shadow-xl
        `}
        >
          {options.map((option, index) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
                setHighlightedIndex(-1);
              }}
              className={`
                px-4 py-3 cursor-pointer transition-all duration-200 flex items-center justify-between
                ${optionStyles}
                ${index === highlightedIndex ? (variant === 'light' ? 'bg-gray-100' : 'bg-white/10') : ''}
                ${option.value === _value ? (variant === 'light' ? 'bg-gray-50 font-medium' : 'bg-white/5 font-medium') : ''}
              `}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              {option.label}
              {option.value === _value && (
                <span className='float-right'>
                  <svg
                    className={`w-4 h-4 ${variant === 'light' ? 'text-gray-600' : 'text-white/70'}`}
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
