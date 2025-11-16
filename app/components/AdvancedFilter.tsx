'use client';

import { useState, useEffect } from 'react';
import { LLMModel } from '../data/llm-data';
import { FilterOptions } from '../types/features';

interface AdvancedFilterProps {
  models: LLMModel[];
  onFilterChange: (filtered: LLMModel[]) => void;
}

export const AdvancedFilter = ({ models, onFilterChange }: AdvancedFilterProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: { min: 0, max: 100 },
    contextWindow: { min: 0, max: 2000000 },
    providers: [],
    capabilities: [],
    releaseYear: null
  });

  // Extract unique values
  const allProviders = Array.from(new Set(models.map(m => m.provider)));
  const allCapabilities = Array.from(new Set(models.flatMap(m => m.tags || [])));
  const allYears = Array.from(new Set(models.map(m => 
    m.released ? new Date(m.released).getFullYear() : null
  ).filter(Boolean) as number[]));

  const applyFilters = () => {
    let filtered = [...models];

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query) ||
        m.provider.toLowerCase().includes(query)
      );
    }

    // Price range
    filtered = filtered.filter(m => 
      m.inputCostPer1M >= filters.priceRange.min &&
      m.inputCostPer1M <= filters.priceRange.max
    );

    // Context window
    filtered = filtered.filter(m => 
      m.contextWindow >= filters.contextWindow.min &&
      m.contextWindow <= filters.contextWindow.max
    );

    // Providers
    if (filters.providers.length > 0) {
      filtered = filtered.filter(m => 
        filters.providers.includes(m.provider)
      );
    }

    // Capabilities
    if (filters.capabilities.length > 0) {
      filtered = filtered.filter(m => 
        m.tags?.some(tag => filters.capabilities.includes(tag))
      );
    }

    // Release year
    if (filters.releaseYear) {
      filtered = filtered.filter(m => 
        m.released && new Date(m.released).getFullYear() === filters.releaseYear
      );
    }

    onFilterChange(filtered);
  };

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, filters]);

  return (
    <div className="space-y-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div>
        <input
          type="text"
          placeholder="Search models..."
          className="w-full px-4 py-2 border rounded-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="font-medium mb-2">Price Range (per 1M tokens)</h3>
          <div className="flex gap-4">
            <input
              type="number"
              min="0"
              placeholder="Min"
              className="w-1/2 px-3 py-2 border rounded"
              value={filters.priceRange.min}
              onChange={(e) => setFilters({
                ...filters,
                priceRange: { ...filters.priceRange, min: Number(e.target.value) }
              })}
            />
            <input
              type="number"
              min="0"
              placeholder="Max"
              className="w-1/2 px-3 py-2 border rounded"
              value={filters.priceRange.max}
              onChange={(e) => setFilters({
                ...filters,
                priceRange: { ...filters.priceRange, max: Number(e.target.value) }
              })}
            />
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Context Window</h3>
          <div className="flex gap-4">
            <input
              type="number"
              min="0"
              placeholder="Min"
              className="w-1/2 px-3 py-2 border rounded"
              value={filters.contextWindow.min}
              onChange={(e) => setFilters({
                ...filters,
                contextWindow: { ...filters.contextWindow, min: Number(e.target.value) }
              })}
            />
            <input
              type="number"
              min="0"
              placeholder="Max"
              className="w-1/2 px-3 py-2 border rounded"
              value={filters.contextWindow.max}
              onChange={(e) => setFilters({
                ...filters,
                contextWindow: { ...filters.contextWindow, max: Number(e.target.value) }
              })}
            />
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Providers</h3>
          <div className="grid grid-cols-2 gap-2">
            {allProviders.map(provider => (
              <label key={provider} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={filters.providers.includes(provider)}
                  onChange={(e) => {
                    const newProviders = e.target.checked
                      ? [...filters.providers, provider]
                      : filters.providers.filter(p => p !== provider);
                    setFilters({ ...filters, providers: newProviders });
                  }}
                />
                {provider}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Capabilities</h3>
          <div className="grid grid-cols-2 gap-2">
            {allCapabilities.map(capability => (
              <label key={capability} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={filters.capabilities.includes(capability)}
                  onChange={(e) => {
                    const newCapabilities = e.target.checked
                      ? [...filters.capabilities, capability]
                      : filters.capabilities.filter(c => c !== capability);
                    setFilters({ ...filters, capabilities: newCapabilities });
                  }}
                />
                {capability}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Release Year</h3>
          <select
            className="w-full px-3 py-2 border rounded"
            value={filters.releaseYear || ''}
            onChange={(e) => setFilters({
              ...filters,
              releaseYear: e.target.value ? Number(e.target.value) : null
            })}
          >
            <option value="">All Years</option>
            {allYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};