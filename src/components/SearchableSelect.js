import { useState, useEffect, useRef } from "react";
import { FiChevronDown, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function SearchableSelect({
  options = [],                // array of { value, label }
  value = "",                   // currently selected value
  onChange,                     // (value, option) => void
  placeholder = "Select...",
  disabled = false,
  BASE_URL = 'https://api.ooms.in/api/v1'  // Default API base
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [users, setUsers] = useState([]);  // 🔥 NEW: Local users state
  const [loading, setLoading] = useState(false);  // 🔥 NEW: Loading state
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // 🔥 NEW: Transform users to options format
  const userOptions = users.map(user => ({
    value: user.username,
    label: `${user.name} • ${user.user_type} • ${user.mobile}`
  }));

  // 🔥 NEW: Built-in fetchUsers function
  const fetchUsers = async (search = "") => {
    const searchTrimmed = search.trim();
    console.log("search=> "+searchTrimmed);
    
    // Skip if < 3 characters
    if (searchTrimmed.length < 3) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("user_token");
      const username = localStorage.getItem("user_username");
      const branch = localStorage.getItem("branch_id");

      const endpoint = `${BASE_URL}/client/search?search=${encodeURIComponent(searchTrimmed)}`;

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
          username: username,
          branch: branch,
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setUsers(result.data || []);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Find selected option
  const selectedOption = userOptions.find(opt => opt.value === value);

  // When value changes externally, update search term
  useEffect(() => {
    if (selectedOption) {
      setSearchTerm(selectedOption.label);
    } else {
      setSearchTerm("");
    }
  }, [value, selectedOption]);

  // Filter options based on search term
  const filteredOptions = userOptions.filter(opt =>
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

  // 🔥 UPDATED: handleInputChange with auto-fetch
  const handleInputChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setIsOpen(true);
    setHighlightedIndex(0);
    
    // 🔥 Auto-fetch users on typing
    fetchUsers(newSearchTerm);
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
    setUsers([]);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full">
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

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto py-1"
          >
            {loading ? (
              <li className="px-4 py-3 text-sm text-slate-500 text-center">
                Searching...
              </li>
            ) : filteredOptions.length === 0 ? (
              <li className="px-4 py-3 text-sm text-slate-500 text-center">
                {searchTerm.length < 3 ? "Type 3+ characters to search" : "No results found"}
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