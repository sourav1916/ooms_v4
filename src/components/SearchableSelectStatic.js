import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

/**
 * Select2-style searchable select for static option lists.
 * Dropdown is portaled to document.body so it is not clipped by card overflow.
 */
export default function SearchableSelectStatic({
  options = [],
  value = '',
  onChange,
  placeholder = 'Select...',
  labelKey = 'name',
  valueKey = 'value',
  className = '',
  triggerClassName = 'w-full flex items-center gap-2 px-3 py-3 text-sm text-left bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow hover:border-gray-400',
  leftIcon = null,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [positionUpdateTrigger, setPositionUpdateTrigger] = useState(0);
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const listRef = useRef(null);

  const selectedOption = useMemo(
    () => options.find((o) => String(o[valueKey]) === String(value)),
    [options, value, valueKey]
  );
  const displayLabel = selectedOption ? selectedOption[labelKey] : '';

  const filteredOptions = useMemo(() => {
    const term = (search || '').trim().toLowerCase();
    if (!term) return options;
    return options.filter((opt) =>
      String(opt[labelKey] || '')
        .toLowerCase()
        .includes(term)
    );
  }, [search, options, labelKey]);

  const getDropdownPosition = useCallback(() => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const gap = 4;
    const dropdownHeight = 280;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openAbove = spaceBelow < dropdownHeight && rect.top > dropdownHeight;
    // When opening above, use bottom positioning so the dropdown sits just above the trigger
    // and only takes the height it needs (no fixed empty space for few items).
    if (openAbove) {
      return {
        width: Math.max(rect.width, 192),
        bottom: window.innerHeight - rect.top + gap,
        left: rect.left,
        maxHeight: rect.top - gap,
        openAbove: true,
      };
    }
    return {
      width: Math.max(rect.width, 192),
      top: rect.bottom + gap,
      left: rect.left,
      openAbove: false,
    };
  }, []);

  const dropdownPosition = isOpen && containerRef.current && positionUpdateTrigger >= 0
    ? getDropdownPosition()
    : null;

  useEffect(() => {
    if (!isOpen) return;
    const onScrollOrResize = () => setPositionUpdateTrigger((t) => t + 1);
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const inTrigger = containerRef.current?.contains(e.target);
      const inDropdown = dropdownRef.current?.contains(e.target);
      if (!inTrigger && !inDropdown) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setHighlightIndex(-1);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || highlightIndex < 0) return;
    const el = listRef.current?.children[highlightIndex];
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [highlightIndex, isOpen]);

  const handleSelect = (option) => {
    onChange(option[valueKey]);
    setIsOpen(false);
    setSearch('');
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((i) => (i < filteredOptions.length - 1 ? i + 1 : 0));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((i) => (i > 0 ? i - 1 : filteredOptions.length - 1));
      return;
    }
    if (e.key === 'Enter' && highlightIndex >= 0 && filteredOptions[highlightIndex]) {
      e.preventDefault();
      handleSelect(filteredOptions[highlightIndex]);
    }
  };

  const hasIcon = Boolean(leftIcon);
  const triggerClass = hasIcon
    ? `${triggerClassName} pl-10`
    : triggerClassName;

  const dropdownContent =
    dropdownPosition && typeof document !== 'undefined' ? (
      <div
        ref={dropdownRef}
        className="fixed z-[9999] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
        style={{
          ...(dropdownPosition.openAbove
            ? { bottom: dropdownPosition.bottom, left: dropdownPosition.left, width: dropdownPosition.width, minWidth: '12rem', maxHeight: dropdownPosition.maxHeight }
            : { top: dropdownPosition.top, left: dropdownPosition.left, width: dropdownPosition.width, minWidth: '12rem' }),
        }}
      >
        <div className="p-2 border-b border-gray-100 bg-gray-50/80">
          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setHighlightIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search..."
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
          />
        </div>
        <ul
          ref={listRef}
          className="max-h-56 overflow-y-auto py-1"
          role="listbox"
        >
          {filteredOptions.length === 0 ? (
            <li className="px-3 py-3 text-sm text-gray-500 text-center">
              No options found
            </li>
          ) : (
            filteredOptions.map((option, index) => {
              const optValue = option[valueKey];
              const isSelected = String(optValue) === String(value);
              const isHighlighted = index === highlightIndex;
              return (
                <li
                  key={optValue ?? index}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlightIndex(index)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(option);
                  }}
                  className={`px-3 py-2.5 text-sm cursor-pointer transition-colors ${isSelected
                      ? 'bg-indigo-50 text-indigo-800 font-medium'
                      : isHighlighted
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  {option[labelKey]}
                </li>
              );
            })
          )}
        </ul>
      </div>
    ) : null;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
            {leftIcon}
          </div>
        )}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen((o) => !o)}
          onKeyDown={handleKeyDown}
          className={`${triggerClass} ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
          disabled={disabled}
        >
          <span className={displayLabel ? 'text-gray-900' : 'text-gray-500'}>
            {displayLabel || placeholder}
          </span>
          <span className="ml-auto flex-shrink-0 text-gray-400">
            <svg
              className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>
      </div>

      {isOpen && createPortal(dropdownContent, document.body)}
    </div>
  );
}
