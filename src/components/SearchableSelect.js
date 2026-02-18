import { useState, useEffect, useRef } from "react";
import { FiChevronDown, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchableSelect({
  options = [],                // array of { value, label }
  value = "",                   // currently selected value
  onChange,                     // (value, option) => void
  placeholder = "Select...",
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Find the selected option based on value
  const selectedOption = options.find(opt => opt.value === value);

  // When value changes externally, update search term to show the label
  useEffect(() => {
    if (selectedOption) {
      setSearchTerm(selectedOption.label);
    } else {
      setSearchTerm("");
    }
  }, [value, selectedOption]);

  // Filter options based on search term
  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset highlighted index when filtered options change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredOptions]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
    setHighlightedIndex(0);
  };

  const handleSelect = (option) => {
    onChange(option.value, option);
    setSearchTerm(option.label);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const clearSelection = () => {
    onChange("", null);
    setSearchTerm("");
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input wrapper with clear button */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className="w-full px-4 py-3 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-400 transition-colors pr-10"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        {selectedOption && !isOpen && (
          <button
            type="button"
            onClick={clearSelection}
            className="absolute right-8 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
          >
            <FiX className="w-4 h-4" />
          </button>
        )}
        <FiChevronDown
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto py-1"
          >
            {filteredOptions.length === 0 ? (
              <li className="px-4 py-3 text-sm text-slate-500 text-center">
                No results found
              </li>
            ) : (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                    index === highlightedIndex
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {option.label}
                </li>
              ))
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}