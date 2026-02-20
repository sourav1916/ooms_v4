import React, { useState, useEffect, useCallback, useRef } from 'react';
import getHeaders from '../utils/get-headers';
import API_BASE_URL from '../utils/api-controller';
import debounce from 'lodash.debounce';
import get from 'lodash.get';

export default function SearchableSelect({
  endpoint,
  listEndpoint,
  initialParams = {},
  dataExtractor,
  labelMapping,
  valueKey,
  placeholder = 'Search...',
  onSelect,
  searchParam = 'search',
  queryParams = {},
  mockData = [],
  useMock = false,
  debounceMs = 300,
  minChars = 2,
  mockFilter,
  renderItem,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [initialList, setInitialList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialError, setInitialError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const abortControllerRef = useRef(null);

  // ---------- REFS ----------
  const endpointRef = useRef(endpoint);
  const listEndpointRef = useRef(listEndpoint);
  const searchParamRef = useRef(searchParam);
  const queryParamsRef = useRef(queryParams);
  const initialParamsRef = useRef(initialParams);
  const mockDataRef = useRef(mockData);
  const minCharsRef = useRef(minChars);
  const filterFnRef = useRef(mockFilter);
  const extractDataRef = useRef(dataExtractor);
  const useMockRef = useRef(useMock);
  const labelMappingRef = useRef(labelMapping);
  const valueKeyRef = useRef(valueKey);
  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    endpointRef.current = endpoint;
    listEndpointRef.current = listEndpoint;
    searchParamRef.current = searchParam;
    queryParamsRef.current = queryParams;
    initialParamsRef.current = initialParams;
    mockDataRef.current = mockData;
    minCharsRef.current = minChars;
    filterFnRef.current = mockFilter;
    extractDataRef.current = dataExtractor;
    useMockRef.current = useMock;
    labelMappingRef.current = labelMapping;
    valueKeyRef.current = valueKey;
    onSelectRef.current = onSelect;
  }, [
    endpoint,
    listEndpoint,
    searchParam,
    queryParams,
    initialParams,
    mockData,
    minChars,
    mockFilter,
    dataExtractor,
    useMock,
    labelMapping,
    valueKey,
    onSelect,
  ]);

  // ---------- HELPERS ----------
  const getValue = (obj, path) => (path ? get(obj, path, '') : obj);

  const buildApiUrl = (endpoint) => {
    const base = API_BASE_URL.endsWith('/')
      ? API_BASE_URL
      : `${API_BASE_URL}/`;

    const cleanEndpoint = endpoint.startsWith('/')
      ? endpoint.slice(1)
      : endpoint;

    return new URL(cleanEndpoint, base);
  };

  const defaultDataExtractor = (response) => {
    if (Array.isArray(response)) return response;
    if (response?.data && Array.isArray(response.data)) return response.data;
    if (response?.results && Array.isArray(response.results)) return response.results;
    if (response?.success && response?.data) return response.data;
    return [];
  };

  const getDisplayPrimary = (item) => {
    const map = labelMappingRef.current;
    if (map?.primary) {
      return typeof map.primary === 'function'
        ? map.primary(item)
        : getValue(item, map.primary);
    }
    if (valueKeyRef.current) return String(getValue(item, valueKeyRef.current));
    return item?.name || item?.label || item?.title || '';
  };

  const getDisplaySecondary = (item) => {
    const map = labelMappingRef.current;
    if (!map?.secondary) return null;
    return typeof map.secondary === 'function'
      ? map.secondary(item)
      : getValue(item, map.secondary);
  };

  // ---------- INITIAL LIST ----------
  useEffect(() => {
    if (!listEndpointRef.current || useMockRef.current) return;

    const fetchInitial = async () => {
      setInitialLoading(true);
      try {
        const url = buildApiUrl(listEndpointRef.current);
        Object.entries(initialParamsRef.current).forEach(([k, v]) => {
          if (v !== undefined && v !== null) url.searchParams.append(k, v);
        });

        const res = await fetch(url.toString(), { headers: getHeaders() });
        const json = await res.json();
        const items = (extractDataRef.current || defaultDataExtractor)(json);
        setInitialList(items);
      } catch (e) {
        setInitialError(e.message);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchInitial();
  }, []);

  // ---------- SEARCH ----------
  const debouncedSearch = useCallback(
    debounce(async (term) => {
      if (term.length < minCharsRef.current) {
        setSearchResults([]);
        return;
      }

      if (!endpointRef.current) return;

      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      try {
        const url = buildApiUrl(endpointRef.current);
        url.searchParams.append(searchParamRef.current, term);

        Object.entries(queryParamsRef.current).forEach(([k, v]) => {
          if (v !== undefined && v !== null) url.searchParams.append(k, v);
        });

        console.log('🔍 FINAL SEARCH URL:', url.toString());

        const res = await fetch(url.toString(), {
          headers: getHeaders(),
          signal: controller.signal,
        });

        const json = await res.json();
        const items = (extractDataRef.current || defaultDataExtractor)(json);
        setSearchResults(items);
        setIsOpen(true);
      } catch (e) {
        if (e.name !== 'AbortError') setError(e.message);
      } finally {
        setLoading(false);
      }
    }, debounceMs),
    [debounceMs]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  // ---------- UI (UPDATED WITH ARRAY CHECK) ----------
const list = searchTerm.length < minChars ? initialList : searchResults;
// Ensure list is always an array
const safeList = Array.isArray(list) ? list : [];

const isLoading = searchTerm.length < minChars ? initialLoading : loading;
const hasError = searchTerm.length < minChars ? initialError : error;

const handleSelect = (item) => {
  onSelectRef.current?.(item, getValue(item, valueKeyRef.current));
  setSearchTerm('');
  setIsOpen(false);
};

const renderSuggestion = (item) => {
  if (renderItem) return renderItem(item);

  const name = getDisplayPrimary(item);
  const phone = item?.mobile || item?.phone || '';
  const email = item?.email || '';

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="font-medium text-gray-900">{name}</span>
      {phone && (
        <>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600">{phone}</span>
        </>
      )}
      {email && (
        <>
          <span className="text-gray-400">•</span>
          <span className="text-gray-500 text-xs">{email}</span>
        </>
      )}
    </div>
  );
};

return (
  <div className="relative w-full">
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        onFocus={() => {
          if (safeList.length > 0 || isLoading) setIsOpen(true);
        }}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        autoComplete="off"
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>

    {isOpen && (
      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center px-4 py-3">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-gray-500">Loading...</span>
            </div>
          </div>
        )}
        
        {hasError && (
          <div className="px-4 py-3 text-sm text-red-500">
            Error: {hasError}
          </div>
        )}

        {!isLoading && !hasError && safeList.length === 0 && searchTerm.length >= minChars && (
          <div className="px-4 py-3 text-sm text-gray-500">
            No Results Found
          </div>
        )}

        {!isLoading && !hasError && safeList.map((item, index) => (
          <div
            key={valueKeyRef.current ? getValue(item, valueKeyRef.current) : index}
            className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
            onMouseDown={() => handleSelect(item)}
          >
            {renderSuggestion(item)}
          </div>
        ))}
      </div>
    )}
  </div>
);}