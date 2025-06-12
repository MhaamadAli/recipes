// components/SearchBar.tsx
// Search and filter component for finding recipes
// Provides text search and filter dropdowns

'use client';

import { useState, useEffect } from 'react';
import { SearchFilters, RecipeStatus } from '@/lib/types';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;  // Callback when search criteria changes
  initialFilters?: SearchFilters;              // Optional initial filter state
}

export default function SearchBar({ onSearch, initialFilters }: SearchBarProps) {
  // Local state for all filter inputs
  const [filters, setFilters] = useState<SearchFilters>({
    query: initialFilters?.query || '',
    cuisineType: initialFilters?.cuisineType || '',
    status: initialFilters?.status || undefined,
    maxPrepTime: initialFilters?.maxPrepTime || undefined
  });

  // Debounce search to avoid too many API calls while typing
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Common cuisine types for the dropdown
  const cuisineTypes = [
    'Italian', 'Mexican', 'Chinese', 'Japanese', 'Indian', 
    'French', 'Thai', 'Mediterranean', 'American', 'Other'
  ];

  // Status options for filtering
  const statusOptions: { value: RecipeStatus; label: string }[] = [
    { value: 'favorite', label: 'Favorites' },
    { value: 'to-try', label: 'To Try' },
    { value: 'made', label: 'Made Before' }
  ];

  // Update filters and trigger search with debouncing
  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for debounced search
    const timeout = setTimeout(() => {
      onSearch(updatedFilters);
    }, 300); // 300ms delay

    setSearchTimeout(timeout);
  };

  // Clear all filters
  const clearFilters = () => {
    const emptyFilters: SearchFilters = {
      query: '',
      cuisineType: '',
      status: undefined,
      maxPrepTime: undefined
    };
    setFilters(emptyFilters);
    onSearch(emptyFilters);
  };

  // Check if any filters are active
  const hasActiveFilters = filters.query || filters.cuisineType || filters.status || filters.maxPrepTime;

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Search Recipes</h2>
      
      {/* Main search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, ingredients, or tags..."
          value={filters.query}
          onChange={(e) => updateFilters({ query: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700"
        />
      </div>

      {/* Filter row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Cuisine type filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cuisine Type
          </label>
          <select
            value={filters.cuisineType || ''}
            onChange={(e) => updateFilters({ cuisineType: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700"
          >
            <option value="">All Cuisines</option>
            {cuisineTypes.map(cuisine => (
              <option key={cuisine} value={cuisine}>{cuisine}</option>
            ))}
          </select>
        </div>

        {/* Status filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => updateFilters({ status: e.target.value as RecipeStatus || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700"
          >
            <option value="">All Status</option>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        {/* Max prep time filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Prep Time (min)
          </label>
          <input
            type="number"
            placeholder="e.g. 30"
            min="1"
            max="300"
            value={filters.maxPrepTime || ''}
            onChange={(e) => updateFilters({ 
              maxPrepTime: e.target.value ? parseInt(e.target.value) : undefined 
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-700"
          />
        </div>

        {/* Clear filters button */}
        <div className="flex items-end">
          <button
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
              hasActiveFilters
                ? 'bg-gray-500 hover:bg-gray-600 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Active filters indicator */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          
          {filters.query && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              Query: "{filters.query}"
            </span>
          )}
          
          {filters.cuisineType && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
              Cuisine: {filters.cuisineType}
            </span>
          )}
          
          {filters.status && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
              Status: {statusOptions.find(s => s.value === filters.status)?.label}
            </span>
          )}
          
          {filters.maxPrepTime && (
            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
              Max time: {filters.maxPrepTime} min
            </span>
          )}
        </div>
      )}
    </div>
  );
}