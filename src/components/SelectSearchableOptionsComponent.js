import React, { useState, useMemo, useRef, useEffect } from "react";

const SearchableSelectOptions = ({
  options = [],
  value = "",
  onChange,
  placeholder = "Select option...",
  labelKey = "name",
  valueKey = "value"
}) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter options based on search input
  const filteredOptions = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    if (!searchTerm) return options;

    return options.filter(option =>
      option[labelKey]
        ?.toString()
        .toLowerCase()
        .includes(searchTerm)
    );
  }, [search, options, labelKey]);


  const handleSelect = (option) => {
    onChange(option[valueKey]);
    setSearch(option[labelKey]);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        type="text"
        value={search || options.find(o => o[valueKey] === value)?.[labelKey] || ""}
        onChange={(e) => {
          setSearch(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="w-full border px-3 py-2 rounded-md"
      />

      {isOpen && (
        <div className="absolute z-50 w-full bg-white border mt-1 max-h-48 overflow-y-auto rounded-md shadow">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option[valueKey]}
                onClick={() => handleSelect(option)}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
              >
                {option[labelKey]}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500">No options found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelectOptions;
