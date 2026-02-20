import React, { useState, useEffect, useCallback, useRef } from 'react';
import getHeaders from '../utils/get-headers';
import API_BASE_URL from '../utils/api-controller';
import debounce from 'lodash.debounce';
import get from 'lodash.get';

export default function SearchableSelect({
  // Search endpoint (used when search term length >= minChars)
  endpoint,
  // Optional list endpoint for initial options (no search param)
  listEndpoint,
  // Query params for list endpoint (e.g., { limit: 20 })
  initialParams = {},
  // Function to extract data from API response
  dataExtractor,
  // Mapping for display fields: { primary: 'path', secondary: 'path' }
  labelMapping,
  // Key to use as the selected value
  valueKey,
  placeholder = 'Search...',
  onSelect,
  // Query parameter key for search endpoint (e.g., 'q', 'search')
  search = 'q',
  // Extra query params for search endpoint
  queryParams = {},
  // Mock data array (used when useMock=true or in development with mockData)
  mockData = [],
  // Force mock mode (bypasses API calls)
  useMock = false,
  debounceMs = 300,
  minChars = 2,
  // Custom filter function for mock data (receives item and search term)
  mockFilter,
  // Custom render function for each suggestion
  renderItem,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [initialList, setInitialList] = useState([]);
  const [loading, setLoading] = useState(false);        // for search
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState(null);             // for search
  const [initialError, setInitialError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const abortControllerRef = useRef(null);

  // Stable references for dynamic objects
  const queryParamsRef = useRef(queryParams);
  useEffect(() => {
    queryParamsRef.current = queryParams;
  }, [queryParams]);

  const initialParamsRef = useRef(initialParams);
  useEffect(() => {
    initialParamsRef.current = initialParams;
  }, [initialParams]);

  // Helper to get nested value
  const getValue = (obj, path) => get(obj, path, '');

  // ---------- Default display when labelMapping is missing ----------
  const getDisplayPrimary = (item) => {
    if (labelMapping?.primary) return getValue(item, labelMapping.primary);
    // Try common fields
    if (valueKey) {
      const val = getValue(item, valueKey);
      if (val) return String(val);
    }
    if (item.name) return item.name;
    if (item.label) return item.label;
    if (item.title) return item.title;
    // Fallback: stringify (limit length)
    return JSON.stringify(item).substring(0, 50);
  };

  const getDisplaySecondary = (item) => {
    if (labelMapping?.secondary) return getValue(item, labelMapping.secondary);
    return null; // no default secondary
  };

  // ---------- Default mock filter ----------
  const defaultMockFilter = (item, term) => {
    const primary = String(getDisplayPrimary(item)).toLowerCase();
    if (primary.includes(term)) return true;
    const secondary = getDisplaySecondary(item);
    if (secondary && String(secondary).toLowerCase().includes(term)) return true;
    // If no match, fallback to searching in the whole item (as string)
    return JSON.stringify(item).toLowerCase().includes(term);
  };
  const filterFn = mockFilter || defaultMockFilter;

  // ---------- Default data extractor ----------
  const defaultDataExtractor = (response) => {
    if (Array.isArray(response)) return response;
    if (response?.suggestions && Array.isArray(response.suggestions)) return response.suggestions;
    if (response?.data && Array.isArray(response.data)) return response.data;
    if (response?.results && Array.isArray(response.results)) return response.results;
    return [];
  };
  const extractData = dataExtractor || defaultDataExtractor;

  // ---------- Fetch initial list (if listEndpoint provided and not in mock mode) ----------
  useEffect(() => {
    if (useMock || (process.env.NODE_ENV === 'development' && mockData.length > 0)) {
      return; // skip fetch in mock mode
    }
    if (!listEndpoint) return;

    const fetchInitialList = async () => {
      setInitialLoading(true);
      setInitialError(null);
      try {
        const url = new URL(listEndpoint, API_BASE_URL);
        Object.entries(initialParamsRef.current).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });

        const headers = getHeaders();
        if (!headers) {
          setInitialError('Authentication headers missing');
          setInitialLoading(false);
          return;
        }

        const response = await fetch(url.toString(), { headers });
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const json = await response.json();
        const items = extractData(json);
        setInitialList(items);
      } catch (err) {
        setInitialError(err.message || 'Failed to load initial list');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchInitialList();
  }, [listEndpoint, initialParamsRef, extractData, useMock, mockData]);

  // ---------- Debounced search (for when searchTerm >= minChars) ----------
  const debouncedSearch = useCallback(
    debounce(async (term) => {
      // If mock mode, filter mockData
      if (useMock || (process.env.NODE_ENV === 'development' && mockData.length > 0)) {
        const filtered = mockData.filter((item) => filterFn(item, term.toLowerCase()));
        setSearchResults(filtered);
        setLoading(false);
        setError(null);
        setIsOpen(true);
        return;
      }

      // If term is too short, clear search results
      if (term.length < minChars) {
        setSearchResults([]);
        return;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const url = new URL(endpoint, API_BASE_URL);
        url.searchParams.append(search, term);
        Object.entries(queryParamsRef.current).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });

        const headers = getHeaders();
        if (!headers) {
          setError('Authentication headers missing');
          setLoading(false);
          return;
        }

        const response = await fetch(url.toString(), {
          signal: controller.signal,
          headers,
        });

        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const json = await response.json();
        const items = extractData(json);
        setSearchResults(items);
        setIsOpen(true);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to fetch');
        }
      } finally {
        setLoading(false);
      }
    }, debounceMs),
    [endpoint, search, useMock, mockData, minChars, filterFn, extractData]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [searchTerm, debouncedSearch]);

  // Determine which list to show
  const showInitial = searchTerm.length < minChars;
  const displayList = showInitial ? initialList : searchResults;
  const isLoading = showInitial ? initialLoading : loading;
  const hasError = showInitial ? initialError : error;

  const handleSelect = (item) => {
    const value = valueKey ? getValue(item, valueKey) : item;
    onSelect?.(item, value);
    setSearchTerm('');
    setIsOpen(false);
  };

  const renderSuggestion = (item) => {
    if (renderItem) return renderItem(item);

    const primary = getDisplayPrimary(item);
    const secondary = getDisplaySecondary(item);

    return (
      <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
        <div className="font-medium">{primary}</div>
        {secondary && <div className="text-sm text-gray-600">{secondary}</div>}
      </div>
    );
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        onFocus={() => {
          if (displayList.length > 0 || isLoading) setIsOpen(true);
        }}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      />
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
          {isLoading && <div className="px-4 py-2 text-gray-500">Loading...</div>}
          {hasError && <div className="px-4 py-2 text-red-500">Error: {hasError}</div>}
          {!isLoading && !hasError && displayList.length === 0 && (
            <div className="px-4 py-2 text-gray-500">
              {showInitial ? 'No options available' : 'No results found'}
            </div>
          )}
          {displayList.map((item, index) => (
            <div
              key={valueKey ? getValue(item, valueKey) : index}
              onMouseDown={() => handleSelect(item)}
            >
              {renderSuggestion(item)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}