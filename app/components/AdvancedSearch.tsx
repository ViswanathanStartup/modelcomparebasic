'use client';

import React, { useState } from 'react';
import { LLMModel } from '../data/llm-data';
import { Search, Sparkles, DollarSign, TrendingUp, RefreshCw } from 'lucide-react';
import { findSimilarModels, findCheaperAlternatives, findBetterPerformance } from '../utils/modelRecommendations';

interface AdvancedSearchProps {
  models: LLMModel[];
  onSearchResults: (results: LLMModel[]) => void;
  onRecommendations?: (recommendations: {
    similar: LLMModel[];
    cheaper: LLMModel[];
    better: LLMModel[];
  }) => void;
  selectedModel?: LLMModel;
}

export default function AdvancedSearch({
  models,
  onSearchResults,
  onRecommendations,
  selectedModel
}: AdvancedSearchProps) {
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedContextRanges, setSelectedContextRanges] = useState<string[]>([]);
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [mmluMin, setMmluMin] = useState(0);
  const [humanEvalMin, setHumanEvalMin] = useState(0);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(100);

  // Get unique providers from models (limit to top providers for better UX)
  const allProviders = Array.from(new Set(models.map(model => model.provider))).sort();
  const topProviders = ['OpenAI', 'Anthropic', 'Google', 'Meta', 'Microsoft', 'Amazon', 'Mistral', 'Cohere'];
  const displayedProviders = allProviders.filter(p => topProviders.includes(p));
  const otherProviders = allProviders.filter(p => !topProviders.includes(p));

  // Predefined filter options
  const contextRanges = [
    { label: '< 100K', min: 0, max: 100000 },
    { label: '100K-500K', min: 100000, max: 500000 },
    { label: '500K-1M', min: 500000, max: 1000000 },
    { label: '1M+', min: 1000000, max: Number.MAX_SAFE_INTEGER }
  ];

  const capabilities = [
    'Vision',
    'Long Context',
    'Coding',
    'Multimodal',
    'Research',
    'Tool Use',
    'Function Calling',
    'Streaming'
  ];

  const years = ['2023', '2024', '2025'];

  const statuses = [
    { id: 'new', label: 'New Models', description: 'Released within last 3 months' },
    { id: 'updated', label: 'Recently Updated Pricing', description: 'Pricing updated recently' },
    { id: 'deprecated', label: 'Deprecated', description: 'Models being sunset' }
  ];

  // Handle apply filters button click
  const handleSearch = () => {
    let filtered = [...models];

    // Text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(model =>
        model.name.toLowerCase().includes(query) ||
        model.provider.toLowerCase().includes(query) ||
        model.description?.toLowerCase().includes(query) ||
        model.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        model.bestFor?.some(use => use.toLowerCase().includes(query)) ||
        model.keyFeatures?.some(feature => feature.toLowerCase().includes(query))
      );
    }

    // Provider filter
    if (selectedProviders.length > 0) {
      filtered = filtered.filter(model => selectedProviders.includes(model.provider));
    }

    // Year filter
    if (selectedYears.length > 0) {
      filtered = filtered.filter(model =>
        model.released && selectedYears.includes(model.released)
      );
    }

    // Context window filter
    if (selectedContextRanges.length > 0) {
      filtered = filtered.filter(model => {
        return selectedContextRanges.some(rangeLabel => {
          const range = contextRanges.find(r => r.label === rangeLabel);
          if (!range) return false;
          return model.contextWindow >= range.min && model.contextWindow <= range.max;
        });
      });
    }

    // Capabilities filter
    if (selectedCapabilities.length > 0) {
      filtered = filtered.filter(model =>
        selectedCapabilities.some(capability =>
          model.tags?.some(tag => tag.toLowerCase().includes(capability.toLowerCase())) ||
          model.keyFeatures?.some(feature => feature.toLowerCase().includes(capability.toLowerCase())) ||
          model.bestFor?.some(use => use.toLowerCase().includes(capability.toLowerCase()))
        )
      );
    }

    // Benchmark scores filter
    if (mmluMin > 0) {
      filtered = filtered.filter(model =>
        (model.benchmarks?.mmlu || 0) >= mmluMin
      );
    }

    if (humanEvalMin > 0) {
      filtered = filtered.filter(model =>
        (model.benchmarks?.humanEval || 0) >= humanEvalMin
      );
    }

    // Price filter
    if (priceMin > 0 || priceMax < 100) {
      filtered = filtered.filter(model =>
        model.inputCostPer1M >= priceMin && model.inputCostPer1M <= priceMax
      );
    }

    // Status filter
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(model => {
        return selectedStatuses.some(status => {
          if (status === 'new') return model.status?.isNew;
          if (status === 'updated') return model.status?.pricingUpdated;
          if (status === 'deprecated') return model.status?.isDeprecated;
          return false;
        });
      });
    }

    onSearchResults(filtered);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedProviders([]);
    setSelectedYears([]);
    setSelectedContextRanges([]);
    setSelectedCapabilities([]);
    setSelectedStatuses([]);
    setMmluMin(0);
    setHumanEvalMin(0);
    setPriceMin(0);
    setPriceMax(100);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedProviders.length > 0 ||
    selectedYears.length > 0 ||
    selectedContextRanges.length > 0 ||
    selectedCapabilities.length > 0 ||
    selectedStatuses.length > 0 ||
    mmluMin > 0 ||
    humanEvalMin > 0 ||
    priceMin > 0 ||
    priceMax < 100;

  return (
    <div className="w-full space-y-6">
      {/* Info Banner */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
        <p className="text-sm text-indigo-900 dark:text-indigo-100 font-medium">
          💡 Select multiple filters from different categories, then click &quot;Apply Filters&quot; to search
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, provider, capabilities, features..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleSearch}
          data-apply-filters
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold transition-all shadow-md hover:shadow-lg whitespace-nowrap"
        >
          Apply Filters
        </button>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reset All
          </button>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow-md">
                {selectedProviders.length + selectedYears.length + selectedContextRanges.length + selectedCapabilities.length + (mmluMin > 0 ? 1 : 0) + (humanEvalMin > 0 ? 1 : 0) + ((priceMin > 0 || priceMax < 100) ? 1 : 0)}
              </span>
              Selected Filters (Click &quot;Apply Filters&quot; below to search)
            </h4>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            {selectedProviders.map(p => (
              <span key={p} className="bg-blue-100 dark:bg-blue-800/50 text-blue-800 dark:text-blue-200 px-3 py-1.5 rounded-full font-medium shadow-sm">
                Provider: {p}
              </span>
            ))}
            {selectedContextRanges.map(r => (
              <span key={r} className="bg-green-100 dark:bg-green-800/50 text-green-800 dark:text-green-200 px-3 py-1.5 rounded-full font-medium shadow-sm">
                Context: {r}
              </span>
            ))}
            {selectedYears.map(y => (
              <span key={y} className="bg-purple-100 dark:bg-purple-800/50 text-purple-800 dark:text-purple-200 px-3 py-1.5 rounded-full font-medium shadow-sm">
                Year: {y}
              </span>
            ))}
            {selectedCapabilities.map(c => (
              <span key={c} className="bg-orange-100 dark:bg-orange-800/50 text-orange-800 dark:text-orange-200 px-3 py-1.5 rounded-full font-medium shadow-sm">
                {c}
              </span>
            ))}
            {mmluMin > 0 && (
              <span className="bg-red-100 dark:bg-red-800/50 text-red-800 dark:text-red-200 px-3 py-1.5 rounded-full font-medium shadow-sm">
                MMLU ≥ {mmluMin}
              </span>
            )}
            {humanEvalMin > 0 && (
              <span className="bg-red-100 dark:bg-red-800/50 text-red-800 dark:text-red-200 px-3 py-1.5 rounded-full font-medium shadow-sm">
                HumanEval ≥ {humanEvalMin}
              </span>
            )}
            {(priceMin > 0 || priceMax < 100) && (
              <span className="bg-yellow-100 dark:bg-yellow-800/50 text-yellow-800 dark:text-yellow-200 px-3 py-1.5 rounded-full font-medium shadow-sm">
                Price: ${priceMin}-${priceMax}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Top Providers */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Top Providers
            {selectedProviders.length > 0 && (
              <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                {selectedProviders.length}
              </span>
            )}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Click multiple providers to see models from any of them
          </p>
          <div className="flex flex-wrap gap-2">
            {displayedProviders.map(provider => (
              <button
                key={provider}
                onClick={() => setSelectedProviders(prev =>
                  prev.includes(provider)
                    ? prev.filter(p => p !== provider)
                    : [...prev, provider]
                )}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedProviders.includes(provider)
                    ? 'bg-blue-500 text-white shadow-md scale-105 ring-2 ring-blue-300'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {selectedProviders.includes(provider) && '✓ '}
                {provider}
              </button>
            ))}
          </div>
          {otherProviders.length > 0 && (
            <details className="text-sm">
              <summary className="cursor-pointer text-blue-600 dark:text-blue-400 hover:underline">
                +{otherProviders.length} more providers
              </summary>
              <div className="flex flex-wrap gap-2 mt-2">
                {otherProviders.map(provider => (
                  <button
                    key={provider}
                    onClick={() => setSelectedProviders(prev =>
                      prev.includes(provider)
                        ? prev.filter(p => p !== provider)
                        : [...prev, provider]
                    )}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedProviders.includes(provider)
                        ? 'bg-blue-500 text-white shadow-md scale-105'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {provider}
                  </button>
                ))}
              </div>
            </details>
          )}
        </div>

        {/* Context Window */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Context Window
            {selectedContextRanges.length > 0 && (
              <span className="bg-green-500 text-white text-xs rounded-full px-2 py-0.5">
                {selectedContextRanges.length}
              </span>
            )}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Select multiple ranges to include all matching sizes
          </p>
          <div className="flex flex-wrap gap-2">
            {contextRanges.map(range => (
              <button
                key={range.label}
                onClick={() => setSelectedContextRanges(prev =>
                  prev.includes(range.label)
                    ? prev.filter(r => r !== range.label)
                    : [...prev, range.label]
                )}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedContextRanges.includes(range.label)
                    ? 'bg-green-500 text-white shadow-md scale-105 ring-2 ring-green-300'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {selectedContextRanges.includes(range.label) && '✓ '}
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Release Year */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            Release Year
            {selectedYears.length > 0 && (
              <span className="bg-purple-500 text-white text-xs rounded-full px-2 py-0.5">
                {selectedYears.length}
              </span>
            )}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Select multiple years to include models from all selected years
          </p>
          <div className="flex gap-2">
            {years.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYears(prev =>
                  prev.includes(year)
                    ? prev.filter(y => y !== year)
                    : [...prev, year]
                )}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedYears.includes(year)
                    ? 'bg-purple-500 text-white shadow-md scale-105 ring-2 ring-purple-300'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {selectedYears.includes(year) && '✓ '}
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Model Status */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
            Model Status
            {selectedStatuses.length > 0 && (
              <span className="bg-amber-500 text-white text-xs rounded-full px-2 py-0.5">
                {selectedStatuses.length}
              </span>
            )}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Filter by model status (new, recently updated, or deprecated)
          </p>
          <div className="space-y-2">
            {statuses.map(status => (
              <button
                key={status.id}
                onClick={() => setSelectedStatuses(prev =>
                  prev.includes(status.id)
                    ? prev.filter(s => s !== status.id)
                    : [...prev, status.id]
                )}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  selectedStatuses.includes(status.id)
                    ? 'bg-amber-500 text-white shadow-md ring-2 ring-amber-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{selectedStatuses.includes(status.id) && '✓ '}{status.label}</div>
                    <div className={`text-xs mt-0.5 ${selectedStatuses.includes(status.id) ? 'text-amber-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      {status.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Capabilities */}
        <div className="space-y-3 col-span-full">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
            Capabilities
            {selectedCapabilities.length > 0 && (
              <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-0.5">
                {selectedCapabilities.length}
              </span>
            )}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Select multiple capabilities - models with ANY of these will be shown
          </p>
          <div className="flex flex-wrap gap-2">
            {capabilities.map(capability => (
              <button
                key={capability}
                onClick={() => setSelectedCapabilities(prev =>
                  prev.includes(capability)
                    ? prev.filter(c => c !== capability)
                    : [...prev, capability]
                )}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedCapabilities.includes(capability)
                    ? 'bg-orange-500 text-white shadow-md scale-105 ring-2 ring-orange-300'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {selectedCapabilities.includes(capability) && '✓ '}
                {capability}
              </button>
            ))}
          </div>
        </div>

        {/* Benchmark Scores */}
        <div className="space-y-4 col-span-full">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            Minimum Benchmark Scores
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  MMLU (Academic Knowledge)
                </label>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                  {mmluMin > 0 ? `${mmluMin}+` : 'Any'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={mmluMin}
                onChange={(e) => setMmluMin(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  HumanEval (Coding Ability)
                </label>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded">
                  {humanEvalMin > 0 ? `${humanEvalMin}+` : 'Any'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={humanEvalMin}
                onChange={(e) => setHumanEvalMin(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
            </div>
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-4 col-span-full">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-yellow-500" />
            Input Cost per 1M tokens
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Min: ${priceMin}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="0.5"
                value={priceMin}
                onChange={(e) => setPriceMin(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Max: ${priceMax}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="0.5"
                value={priceMax}
                onChange={(e) => setPriceMax(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Smart Recommendations */}
      {selectedModel && onRecommendations && (
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Smart Recommendations for {selectedModel.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => {
                const similar = findSimilarModels(selectedModel, models);
                onRecommendations({
                  similar,
                  cheaper: [],
                  better: []
                });
              }}
              className="px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-700 dark:text-blue-200 rounded-lg hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/40 dark:hover:to-blue-700/40 font-medium transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Find Similar Models
            </button>
            <button
              onClick={() => {
                const cheaper = findCheaperAlternatives(selectedModel, models);
                onRecommendations({
                  similar: [],
                  cheaper,
                  better: []
                });
              }}
              className="px-4 py-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 text-green-700 dark:text-green-200 rounded-lg hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/40 dark:hover:to-green-700/40 font-medium transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              <DollarSign className="w-4 h-4" />
              Cheaper Alternatives
            </button>
            <button
              onClick={() => {
                const better = findBetterPerformance(selectedModel, models);
                onRecommendations({
                  similar: [],
                  cheaper: [],
                  better
                });
              }}
              className="px-4 py-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 text-purple-700 dark:text-purple-200 rounded-lg hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/40 dark:hover:to-purple-700/40 font-medium transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Better Performance
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
