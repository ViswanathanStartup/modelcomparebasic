'use client';

import { useState, useMemo, useEffect } from 'react';
import { calculateBooksInContext, type LLMModel } from './data/llm-data';
import { enrichedModels } from './data/enriched-models';
import { Search, ArrowUp, ArrowDown, Star, Calculator, GitCompare, X, Info, Keyboard, TrendingUp, Clock, Filter, Sparkles, AlertCircle, BarChart3, Lightbulb, Zap, TestTube, History, RefreshCw, Book } from 'lucide-react';
import { APIIntegrationHelper } from '../components/APIIntegrationHelper';
import { ModelDetailsCard } from './components/ModelDetailsCard';
import { MobileModelCard } from './components/MobileModelCard';
import AdvancedSearch from './components/AdvancedSearch';
import EnhancedModelComparison from './components/EnhancedModelComparison';
import { Sprint1Dashboard } from './components/Sprint1Dashboard';
import { ExportButton } from './components/ExportButton';
import { EnhancedCostCalculator } from './components/EnhancedCostCalculator';
import { TokenOptimizationAssistant } from './components/TokenOptimizationAssistant';
import { SmartModelRecommender } from './components/SmartModelRecommender';
import { ModelTestingPlayground } from './components/ModelTestingPlayground';
import { ModelDocumentationHub } from './components/ModelDocumentationHub';
import NotificationsPanel from './components/NotificationsPanel';
import ModelChangelog from './components/ModelChangelog';
import NotificationPreferences from './components/NotificationPreferences';
import { findSimilarModels, findCheaperAlternatives, findBetterPerformance } from './utils/modelRecommendations';

// Use enriched models with Phase 1 features
const llmModels = enrichedModels;

type SortField = 'name' | 'provider' | 'contextWindow' | 'books' | 'inputCost' | 'outputCost' | 'quality';
type SortDirection = 'asc' | 'desc';
type FilterTab = 'all' | 'cheapest' | 'largeContext' | 'bestValue' | 'favorites';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('contextWindow');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [recommendations, setRecommendations] = useState<{
    similar: LLMModel[];
    cheaper: LLMModel[];
    better: LLMModel[];
  }>({ similar: [], cheaper: [], better: [] });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorTokens, setCalculatorTokens] = useState('100000');
  const [showAdvancedCalc, setShowAdvancedCalc] = useState(false);
  const [monthlyConversations, setMonthlyConversations] = useState('1000');
  const [tokensPerConversation, setTokensPerConversation] = useState('500');
  const [selectedModel, setSelectedModel] = useState<LLMModel | null>(null);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [showApiIntegration, setShowApiIntegration] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [advancedSearchResults, setAdvancedSearchResults] = useState<LLMModel[]>([]);
  const [isAdvancedSearchActive, setIsAdvancedSearchActive] = useState(false);
  const [showEnhancedComparison, setShowEnhancedComparison] = useState(false);
  const [selectedForCalculator, setSelectedForCalculator] = useState<string[]>([]);
  const [showSprint1Dashboard, setShowSprint1Dashboard] = useState(false);
  const [showEnhancedCostCalculator, setShowEnhancedCostCalculator] = useState(false);
  const [showTokenOptimizer, setShowTokenOptimizer] = useState(false);
  const [showDocumentationHub, setShowDocumentationHub] = useState(false);
  const [showSmartRecommender, setShowSmartRecommender] = useState(false);
  const [showTestingPlayground, setShowTestingPlayground] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [showNotificationPreferences, setShowNotificationPreferences] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState('');

  // Load comparison from URL on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const compareParam = params.get('compare');
      if (compareParam) {
        const modelIds = compareParam.split(',').filter(id => llmModels.some(m => m.id === id));
        if (modelIds.length >= 2) {
          setSelectedForCompare(modelIds);
          setCompareMode(true);
          setShowEnhancedComparison(true);
        }
      }
    }
  }, []);

  // Function to handle advanced search results
  const handleAdvancedSearchResults = (results: LLMModel[]) => {
    setAdvancedSearchResults(results);
    setIsAdvancedSearchActive(true);
    // Clear other filters when advanced search is active
    setSearchTerm('');
    setSelectedProvider('all');
    setActiveTab('all');
  };

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('llm-favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if not typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === '/') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
      } else if (e.key === 'c' && !e.ctrlKey && !e.metaKey) {
        setShowCalculator(prev => !prev);

      } else if (e.key === 'a' && selectedModel) {
        setShowApiIntegration(prev => !prev);
      } else if (e.key === '?') {
        setShowKeyboardHelp(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleFavorite = (modelId: string) => {
    const newFavorites = favorites.includes(modelId)
      ? favorites.filter(id => id !== modelId)
      : [...favorites, modelId];
    setFavorites(newFavorites);
    localStorage.setItem('llm-favorites', JSON.stringify(newFavorites));
  };

  const handleRefreshModels = async () => {
    setIsRefreshing(true);
    setRefreshMessage('');

    try {
      const response = await fetch('/api/refresh-models', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        // Save changelog entries to localStorage if any changes detected
        if (data.changelogEntries && data.changelogEntries.length > 0) {
          const existingChangelog = localStorage.getItem('model-changelog');
          const changelog = existingChangelog ? JSON.parse(existingChangelog) : [];

          // Add new entries to the beginning
          const updatedChangelog = [...data.changelogEntries, ...changelog];
          localStorage.setItem('model-changelog', JSON.stringify(updatedChangelog));

          setRefreshMessage(`✓ ${data.message}`);

          // Also trigger notifications for watched models
          // (This would integrate with the notification system)
        } else {
          setRefreshMessage(`✓ ${data.message}`);
        }

        setTimeout(() => setRefreshMessage(''), 8000);
      } else {
        setRefreshMessage('✗ Failed to refresh model data. Please try again.');
        setTimeout(() => setRefreshMessage(''), 5000);
      }
    } catch (error) {
      console.error('Refresh error:', error);
      setRefreshMessage('✗ Network error. Please check your connection.');
      setTimeout(() => setRefreshMessage(''), 5000);
    } finally {
      setIsRefreshing(false);
    }
  };

  const toggleCompare = (modelId: string) => {
    if (selectedForCompare.includes(modelId)) {
      setSelectedForCompare(selectedForCompare.filter(id => id !== modelId));
    } else if (selectedForCompare.length < 4) {
      setSelectedForCompare([...selectedForCompare, modelId]);
    }
  };

  const providers = useMemo(() => {
    const unique = Array.from(new Set(llmModels.map(m => m.provider))).sort();
    return ['all', ...unique];
  }, []);

  const filteredModels = useMemo(() => {
    // If advanced search is active, use those results instead
    if (isAdvancedSearchActive) {
      return advancedSearchResults.sort((a, b) => {
        let aValue: number | string;
        let bValue: number | string;

        switch (sortField) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'provider':
            aValue = a.provider.toLowerCase();
            bValue = b.provider.toLowerCase();
            break;
          case 'contextWindow':
            aValue = a.contextWindow;
            bValue = b.contextWindow;
            break;
          case 'books':
            aValue = calculateBooksInContext(a.contextWindow);
            bValue = calculateBooksInContext(b.contextWindow);
            break;
          case 'inputCost':
            aValue = a.inputCostPer1M;
            bValue = b.inputCostPer1M;
            break;
          case 'outputCost':
            aValue = a.outputCostPer1M;
            bValue = b.outputCostPer1M;
            break;
          case 'quality':
            aValue = a.benchmarks?.mmlu || 0;
            bValue = b.benchmarks?.mmlu || 0;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    const filtered = [...llmModels].filter(model => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        model.name.toLowerCase().includes(searchLower) ||
        model.provider.toLowerCase().includes(searchLower) ||
        model.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
        model.bestFor?.some(use => use.toLowerCase().includes(searchLower));

      if (!matchesSearch) return false;

      if (selectedProvider !== 'all' && model.provider !== selectedProvider) {
        return false;
      }

      if (activeTab === 'favorites') {
        return favorites.includes(model.id);
      } else if (activeTab === 'cheapest') {
        return model.inputCostPer1M < 1.0 && model.outputCostPer1M < 1.0;
      } else if (activeTab === 'largeContext') {
        return model.contextWindow >= 100000;
      } else if (activeTab === 'bestValue') {
        const avgCost = (model.inputCostPer1M + model.outputCostPer1M) / 2;
        return avgCost < 2.0 && model.contextWindow >= 32000;
      }

      return true;
    });

    filtered.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'provider':
          aValue = a.provider.toLowerCase();
          bValue = b.provider.toLowerCase();
          break;
        case 'contextWindow':
          aValue = a.contextWindow;
          bValue = b.contextWindow;
          break;
        case 'books':
          aValue = calculateBooksInContext(a.contextWindow);
          bValue = calculateBooksInContext(b.contextWindow);
          break;
        case 'inputCost':
          aValue = a.inputCostPer1M;
          bValue = b.inputCostPer1M;
          break;
        case 'outputCost':
          aValue = a.outputCostPer1M;
          bValue = b.outputCostPer1M;
          break;
        case 'quality':
          aValue = a.benchmarks?.mmlu || 0;
          bValue = b.benchmarks?.mmlu || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchTerm, activeTab, selectedProvider, sortField, sortDirection, favorites, isAdvancedSearchActive, advancedSearchResults]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ArrowDown className="w-4 h-4 inline ml-1" />
    );
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatCost = (cost: number) => {
    if (cost < 1) {
      return `$${cost.toFixed(3)}`;
    }
    return `$${cost.toFixed(2)}`;
  };

  const calculateCustomCost = (tokens: number, inputCostPer1M: number, outputCostPer1M: number) => {
    const inputCost = (tokens / 1000000) * inputCostPer1M;
    const outputCost = (tokens / 1000000) * outputCostPer1M;
    return {
      input: inputCost,
      output: outputCost,
      total: inputCost + outputCost
    };
  };

  const calculateMonthlyCost = (conversations: number, tokensPerConv: number, inputCostPer1M: number, outputCostPer1M: number) => {
    const totalTokens = conversations * tokensPerConv;
    return calculateCustomCost(totalTokens, inputCostPer1M, outputCostPer1M);
  };

  const comparedModels = llmModels.filter(m => selectedForCompare.includes(m.id));
  const tokensForCalc = parseInt(calculatorTokens) || 0;
  const monthlyConvs = parseInt(monthlyConversations) || 0;
  const tokensPerConv = parseInt(tokensPerConversation) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Advanced Search Modal */}
      {showAdvancedFilters && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => setShowAdvancedFilters(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 sm:p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto my-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                <Filter className="w-7 h-7 text-indigo-600" />
                Advanced Search & Filters
              </h3>
              <button
                onClick={() => setShowAdvancedFilters(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="mb-4">
              <AdvancedSearch
                models={llmModels}
                onSearchResults={(results) => {
                  handleAdvancedSearchResults(results);
                  setShowAdvancedFilters(false);
                }}
                selectedModel={selectedModel || undefined}
                onRecommendations={(recs) => {
                  setRecommendations(recs);
                  setShowRecommendations(true);
                  setShowAdvancedFilters(false);
                }}
              />
            </div>
            <div className="flex justify-between items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Select filters above, then click Apply to see results
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAdvancedFilters(false)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Trigger the search by calling the Apply Filters functionality
                    const applyButton = document.querySelector('[data-apply-filters]') as HTMLButtonElement;
                    applyButton?.click();
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold transition-all shadow-md hover:shadow-lg"
                >
                  Apply Filters & Search
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Integration Modal */}
      {showApiIntegration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowApiIntegration(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 sm:p-6 max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">API Integration Helper</h3>
              <button onClick={() => setShowApiIntegration(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <APIIntegrationHelper model={selectedModel} />
          </div>
        </div>
      )}

      {/* Sprint 1 Dashboard - Analytics, Token Counter, Session History, Export */}
      {showSprint1Dashboard && (
        <Sprint1Dashboard
          allModels={llmModels}
          initialSelectedModels={comparedModels.length > 0 ? comparedModels : []}
          onClose={() => setShowSprint1Dashboard(false)}
        />
      )}

      {/* Keyboard Help Modal */}
      {showKeyboardHelp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowKeyboardHelp(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 sm:p-6 max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Keyboard className="w-6 h-6" />
                Keyboard Shortcuts
              </h3>
              <button onClick={() => setShowKeyboardHelp(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">/ </kbd>
                <span>Focus search</span>
              </div>
              <div className="flex justify-between">
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">c</kbd>
                <span>Toggle calculator</span>
              </div>

              <div className="flex justify-between">
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">a</kbd>
                <span>Open API guide for selected model</span>
              </div>
              <div className="flex justify-between">
                <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">?</kbd>
                <span>Show this help</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Model Details Modal */}
      {selectedModel && (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto" onClick={() => setSelectedModel(null)}>
          <div className="min-h-screen px-4 py-8 flex items-start justify-center">
            <div className="max-w-7xl w-full my-8" onClick={(e) => e.stopPropagation()}>
              <div className="relative">
                <button
                  onClick={() => setSelectedModel(null)}
                  className="sticky top-4 float-right z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mb-4"
                  aria-label="Close"
                >
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </button>
                <ModelDetailsCard model={selectedModel} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                LLM DB <span className="text-lg sm:text-xl text-blue-600 dark:text-blue-400">v1.2</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Compare {llmModels.length} AI models • Updated Nov 2025
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 w-full md:w-auto">
              {/* Analytics */}
              <button
                onClick={() => setShowSprint1Dashboard(!showSprint1Dashboard)}
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg ${
                  showSprint1Dashboard
                    ? 'bg-blue-700 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                title="Token Counter, Session History & Export"
              >
                <BarChart3 className="w-5 h-5" />
                <span className="hidden sm:inline">Analytics</span>
              </button>

              {/* Calculator */}
              <button
                onClick={() => setShowCalculator(!showCalculator)}
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg ${
                  showCalculator
                    ? 'bg-blue-700 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                title="Basic Cost Calculator"
              >
                <Calculator className="w-5 h-5" />
                <span className="hidden sm:inline">Calculator</span>
              </button>

              {/* Changelog */}
              <button
                onClick={() => setShowChangelog(true)}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg bg-blue-600 text-white hover:bg-blue-700"
                title="Model Changelog"
              >
                <History className="w-5 h-5" />
                <span className="hidden sm:inline">Changelog</span>
              </button>

              {/* Charts */}
              <button
                onClick={() => setShowEnhancedCostCalculator(true)}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg bg-blue-600 text-white hover:bg-blue-700"
                title="Enhanced Cost Calculator with Charts"
              >
                <Calculator className="w-5 h-5" />
                <span className="hidden sm:inline">Charts</span>
              </button>

              {/* Compare */}
              <button
                onClick={() => {
                  if (compareMode && selectedForCompare.length >= 2) {
                    setShowEnhancedComparison(true);
                  } else {
                    setCompareMode(!compareMode);
                    if (compareMode) setSelectedForCompare([]);
                  }
                }}
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg ${
                  compareMode
                    ? 'bg-blue-700 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                title="Compare Models"
              >
                <GitCompare className="w-5 h-5" />
                <span className="hidden sm:inline">
                  {compareMode && selectedForCompare.length >= 2
                    ? `View (${selectedForCompare.length})`
                    : compareMode
                    ? `Select ${selectedForCompare.length > 0 ? `(${selectedForCompare.length})` : ''}`
                    : 'Compare'}
                </span>
              </button>

              {/* Learn */}
              <button
                onClick={() => setShowDocumentationHub(true)}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg bg-blue-600 text-white hover:bg-blue-700"
                title="Model Documentation Hub"
              >
                <Book className="w-5 h-5" />
                <span className="hidden sm:inline">Learn</span>
              </button>

              {/* Notifications */}
              <NotificationsPanel onOpenPreferences={() => setShowNotificationPreferences(true)} />

              {/* Optimize */}
              <button
                onClick={() => setShowTokenOptimizer(true)}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg bg-blue-600 text-white hover:bg-blue-700"
                title="Token Optimization Assistant"
              >
                <Lightbulb className="w-5 h-5" />
                <span className="hidden sm:inline">Optimize</span>
              </button>

              {/* Recommend */}
              <button
                onClick={() => setShowSmartRecommender(true)}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg bg-blue-600 text-white hover:bg-blue-700"
                title="Smart Model Recommender"
              >
                <Zap className="w-5 h-5" />
                <span className="hidden sm:inline">Recommend</span>
              </button>

              {/* Refresh */}
              <button
                onClick={handleRefreshModels}
                disabled={isRefreshing}
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg ${
                  isRefreshing
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                title="Refresh model data from providers"
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>

              {/* Shortcuts */}
              <button
                onClick={() => setShowKeyboardHelp(true)}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg bg-blue-600 text-white hover:bg-blue-700"
                title="Keyboard Shortcuts"
              >
                <Keyboard className="w-5 h-5" />
                <span className="hidden sm:inline">Shortcuts</span>
              </button>

              {/* Test */}
              <button
                onClick={() => setShowTestingPlayground(true)}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg bg-blue-600 text-white hover:bg-blue-700"
                title="Model Performance Testing Playground"
              >
                <TestTube className="w-5 h-5" />
                <span className="hidden sm:inline">Test</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Refresh Message */}
        {refreshMessage && (
          <div className={`mb-4 p-4 rounded-lg border flex items-center gap-2 ${
            refreshMessage.includes('✓')
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
          }`}>
            <span className="font-medium">{refreshMessage}</span>
          </div>
        )}
        {/* Advanced Cost Calculator */}
        {showCalculator && (
          <div className="mb-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 border-2 border-blue-500">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Calculator className="w-6 h-6 text-blue-600" />
                Advanced Cost Calculator
              </h2>
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                {selectedForCalculator.length > 0 && (
                  <ExportButton
                    models={llmModels.filter(m => selectedForCalculator.includes(m.id))}
                    context="Cost Calculator"
                  />
                )}
                <button
                  onClick={() => setShowAdvancedCalc(!showAdvancedCalc)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {showAdvancedCalc ? 'Simple' : 'Advanced'} Mode
                </button>
                <button onClick={() => setShowCalculator(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Model Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Models for Cost Calculation
              </label>
              <select
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  const modelId = e.target.value;
                  if (modelId && !selectedForCalculator.includes(modelId)) {
                    setSelectedForCalculator([...selectedForCalculator, modelId]);
                  }
                }}
                value=""
              >
                <option value="">Select a model...</option>
                {filteredModels.map(model => (
                  <option key={model.id} value={model.id} disabled={selectedForCalculator.includes(model.id)}>
                    {model.name} ({model.provider})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Models Pills */}
            {selectedForCalculator.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {selectedForCalculator.map(modelId => {
                  const model = llmModels.find(m => m.id === modelId);
                  return model ? (
                    <div
                      key={modelId}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                    >
                      <span>{model.name}</span>
                      <button
                        onClick={() => setSelectedForCalculator(selectedForCalculator.filter(id => id !== modelId))}
                        className="hover:text-red-600 dark:hover:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            )}

            {/* Calculator Results */}
            {selectedForCalculator.length > 0 && (
                  <>
                    {/* Simple Calculator Mode */}
                    {!showAdvancedCalc ? (
                      <div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Enter number of tokens:
                          </label>
                          <input
                            type="number"
                            value={calculatorTokens}
                            onChange={(e) => setCalculatorTokens(e.target.value)}
                            placeholder="100000"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            That&apos;s approximately {(tokensForCalc / 100000).toFixed(2)} books
                          </p>
                        </div>
                        <div className="overflow-x-auto -mx-3 sm:mx-0">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                              <tr>
                                <th className="px-3 py-2 text-left font-semibold">Model</th>
                                <th className="px-3 py-2 text-right font-semibold">Input Cost</th>
                                <th className="px-3 py-2 text-right font-semibold">Output Cost</th>
                                <th className="px-3 py-2 text-right font-semibold">Total Cost</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              {llmModels
                                .filter(m => selectedForCalculator.includes(m.id))
                                .map(model => {
                                  const cost = calculateCustomCost(tokensForCalc, model.inputCostPer1M, model.outputCostPer1M);
                                  return (
                                    <tr key={model.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                      <td className="px-3 py-2 font-medium">{model.name}</td>
                                      <td className="px-3 py-2 text-right font-mono">${cost.input.toFixed(4)}</td>
                                      <td className="px-3 py-2 text-right font-mono">${cost.output.toFixed(4)}</td>
                                      <td className="px-3 py-2 text-right font-mono font-bold text-green-600 dark:text-green-400">
                                        ${cost.total.toFixed(4)}
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="mb-4">
                          <button
                            onClick={() => setShowAdvancedCalc(!showAdvancedCalc)}
                            className="text-sm px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                          >
                            {showAdvancedCalc ? 'Switch to Simple' : 'Switch to Monthly'}
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Monthly conversations:
                            </label>
                            <input
                              type="number"
                              value={monthlyConversations}
                              onChange={(e) => setMonthlyConversations(e.target.value)}
                              placeholder="1000"
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Tokens per conversation:
                            </label>
                            <input
                              type="number"
                              value={tokensPerConversation}
                              onChange={(e) => setTokensPerConversation(e.target.value)}
                              placeholder="500"
                              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          Monthly usage: {formatNumber(monthlyConvs * tokensPerConv)} tokens
                        </p>
                        <div className="overflow-x-auto -mx-3 sm:mx-0">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                              <tr>
                                <th className="px-3 py-2 text-left font-semibold">Model</th>
                                <th className="px-3 py-2 text-right font-semibold">Monthly Cost</th>
                                <th className="px-3 py-2 text-right font-semibold">Per Conversation</th>
                                <th className="px-3 py-2 text-right font-semibold">Annual Cost</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              {llmModels
                                .filter(m => selectedForCalculator.includes(m.id))
                                .map(model => {
                                  const monthlyCost = calculateMonthlyCost(monthlyConvs, tokensPerConv, model.inputCostPer1M, model.outputCostPer1M);
                                  const perConv = monthlyCost.total / monthlyConvs;
                                  return (
                                    <tr key={model.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                      <td className="px-3 py-2 font-medium">{model.name}</td>
                                      <td className="px-3 py-2 text-right font-mono font-bold text-green-600 dark:text-green-400">
                                        ${monthlyCost.total.toFixed(2)}
                                      </td>
                                      <td className="px-3 py-2 text-right font-mono">${perConv.toFixed(4)}</td>
                                      <td className="px-3 py-2 text-right font-mono">${(monthlyCost.total * 12).toFixed(2)}</td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </>
            )}
          </div>
        )}

        {/* Enhanced Model Comparison Modal */}
        {showEnhancedComparison && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 sm:p-6 max-w-7xl w-full max-h-[90vh] overflow-y-auto my-8">
              <EnhancedModelComparison
                models={llmModels}
                preSelectedModels={selectedForCompare}
                onClose={() => {
                  setShowEnhancedComparison(false);
                  setCompareMode(false);
                  setSelectedForCompare([]);
                }}
              />
            </div>
          </div>
        )}

        {/* Comparison Mode Banner - Only shows when selecting models */}
        {compareMode && selectedForCompare.length > 0 && !showEnhancedComparison && (
          <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg shadow-lg p-4 border-2 border-purple-300 dark:border-purple-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <GitCompare className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-purple-900 dark:text-purple-100 text-sm sm:text-base">
                    {selectedForCompare.length} Model{selectedForCompare.length > 1 ? 's' : ''} Selected
                  </h3>
                  <p className="text-xs sm:text-sm text-purple-700 dark:text-purple-300">
                    {selectedForCompare.length >= 2
                      ? 'Ready to compare! Click "View Comparison" to see detailed analysis.'
                      : 'Select at least 2 models to compare'}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {selectedForCompare.length >= 2 && (
                  <button
                    onClick={() => setShowEnhancedComparison(true)}
                    className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 font-semibold shadow-lg hover:shadow-xl transition-all text-sm sm:text-base flex-1 sm:flex-none"
                  >
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">View Comparison</span>
                    <span className="inline sm:hidden">Compare</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedForCompare([]);
                    setCompareMode(false);
                  }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Model Selection Cards for Comparison */}
        {compareMode && selectedForCompare.length > 0 && !showEnhancedComparison && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Selected Models:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {comparedModels.map(model => (
                <div key={model.id} className="bg-white dark:bg-gray-800 rounded-lg border-2 border-purple-300 dark:border-purple-700 p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900 dark:text-white">{model.name}</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{model.provider}</p>
                    </div>
                    <button
                      onClick={() => toggleCompare(model.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="text-gray-600 dark:text-gray-400">
                      Context: {model.contextWindow.toLocaleString()} tokens
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Cost: ${model.inputCostPer1M.toFixed(2)}/1M
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Old comparison table - REMOVED */}
        {false && compareMode && selectedForCompare.length > 0 && (
          <div className="mb-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 border-2 border-purple-500">
            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">Feature</th>
                    {comparedModels.map(model => (
                      <th key={model.id} className="px-3 py-2 text-left font-semibold">
                        <div className="flex items-center justify-between">
                          {model.name}
                          <button
                            onClick={() => toggleCompare(model.id)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-3 py-2 font-medium">Provider</td>
                    {comparedModels.map(model => (
                      <td key={model.id} className="px-3 py-2">{model.provider}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium">Context Window</td>
                    {comparedModels.map(model => (
                      <td key={model.id} className="px-3 py-2 font-mono">{formatNumber(model.contextWindow)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium">Books Capacity</td>
                    {comparedModels.map(model => (
                      <td key={model.id} className="px-3 py-2 font-mono">{calculateBooksInContext(model.contextWindow)}</td>
                    ))}
                  </tr>
                  {comparedModels.some(m => m.benchmarks?.mmlu) && (
                    <tr>
                      <td className="px-3 py-2 font-medium">MMLU Score</td>
                      {comparedModels.map(model => (
                        <td key={model.id} className="px-3 py-2 font-mono">
                          {model.benchmarks?.mmlu ? `${model.benchmarks.mmlu}%` : 'N/A'}
                        </td>
                      ))}
                    </tr>
                  )}
                  {comparedModels.some(m => m.benchmarks?.humanEval) && (
                    <tr>
                      <td className="px-3 py-2 font-medium">HumanEval Score</td>
                      {comparedModels.map(model => (
                        <td key={model.id} className="px-3 py-2 font-mono">
                          {model.benchmarks?.humanEval ? `${model.benchmarks.humanEval}%` : 'N/A'}
                        </td>
                      ))}
                    </tr>
                  )}
                  <tr>
                    <td className="px-3 py-2 font-medium">Input Cost/1M</td>
                    {comparedModels.map(model => (
                      <td key={model.id} className="px-3 py-2 font-mono">{formatCost(model.inputCostPer1M)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium">Output Cost/1M</td>
                    {comparedModels.map(model => (
                      <td key={model.id} className="px-3 py-2 font-mono">{formatCost(model.outputCostPer1M)}</td>
                    ))}
                  </tr>
                  <tr className="bg-green-50 dark:bg-green-900/20">
                    <td className="px-3 py-2 font-bold">Total Cost for 1 Book</td>
                    {comparedModels.map(model => {
                      const cost = calculateCustomCost(100000, model.inputCostPer1M, model.outputCostPer1M);
                      return (
                        <td key={model.id} className="px-3 py-2 font-mono font-bold text-green-600 dark:text-green-400">
                          ${cost.total.toFixed(4)}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="hidden sm:inline">All Models ({llmModels.length})</span>
            <span className="inline sm:hidden">All ({llmModels.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1 text-sm ${
              activeTab === 'favorites'
                ? 'bg-yellow-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Star className="w-4 h-4" />
            <span className="hidden sm:inline">Favorites ({favorites.length})</span>
            <span className="inline sm:hidden">Fav ({favorites.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('cheapest')}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
              activeTab === 'cheapest'
                ? 'bg-green-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="hidden sm:inline">Cheapest (&lt;$1/1M)</span>
            <span className="inline sm:hidden">Cheap</span>
          </button>
          <button
            onClick={() => setActiveTab('largeContext')}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
              activeTab === 'largeContext'
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="hidden sm:inline">Large Context (100K+)</span>
            <span className="inline sm:hidden">Large</span>
          </button>
          <button
            onClick={() => setActiveTab('bestValue')}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
              activeTab === 'bestValue'
                ? 'bg-orange-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="hidden sm:inline">Best Value</span>
            <span className="inline sm:hidden">Value</span>
          </button>
        </div>

        {/* Search and Provider Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={isAdvancedSearchActive ? "Advanced search is active..." : "Search models, tags, or use cases... (Press / to focus)"}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isAdvancedSearchActive}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            disabled={isAdvancedSearchActive}
            className="px-2 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {providers.map(provider => (
              <option key={provider} value={provider}>
                {provider === 'all' ? 'All Providers' : provider}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              if (isAdvancedSearchActive) {
                setIsAdvancedSearchActive(false);
                setAdvancedSearchResults([]);
              }
              setShowAdvancedFilters(!showAdvancedFilters);
            }}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
              isAdvancedSearchActive || showAdvancedFilters
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <Filter className="w-5 h-5" />
            {isAdvancedSearchActive ? 'Clear Advanced Search' : 'Advanced Search'}
          </button>
        </div>

        {/* Active Advanced Search Indicator */}
        {isAdvancedSearchActive && (
          <div className="mb-4 bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-500 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <p className="font-semibold text-indigo-900 dark:text-indigo-100">
                    Advanced Search Active
                  </p>
                  <p className="text-sm text-indigo-700 dark:text-indigo-300">
                    Showing {filteredModels.length} filtered results
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAdvancedSearchActive(false);
                  setAdvancedSearchResults([]);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Smart Recommendations Section */}
        {showRecommendations && (recommendations.similar.length > 0 || recommendations.cheaper.length > 0 || recommendations.better.length > 0) && (
          <div className="mb-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg shadow-lg p-6 border-2 border-purple-300 dark:border-purple-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                Smart Recommendations
              </h2>
              <button onClick={() => setShowRecommendations(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.similar.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <GitCompare className="w-4 h-4 text-blue-600" />
                    Similar Models
                  </h3>
                  <div className="space-y-2">
                    {recommendations.similar.map(model => (
                      <div key={model.id} className="text-sm">
                        <button
                          onClick={() => setSelectedModel(model)}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {model.name}
                        </button>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {model.provider} • {formatCost(model.inputCostPer1M)}/1M
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {recommendations.cheaper.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    Cheaper Alternatives
                  </h3>
                  <div className="space-y-2">
                    {recommendations.cheaper.map(model => (
                      <div key={model.id} className="text-sm">
                        <button
                          onClick={() => setSelectedModel(model)}
                          className="text-green-600 hover:text-green-700 font-medium"
                        >
                          {model.name}
                        </button>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {model.provider} • {formatCost(model.inputCostPer1M)}/1M
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {recommendations.better.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-600" />
                    Better Performance
                  </h3>
                  <div className="space-y-2">
                    {recommendations.better.map(model => (
                      <div key={model.id} className="text-sm">
                        <button
                          onClick={() => setSelectedModel(model)}
                          className="text-yellow-600 hover:text-yellow-700 font-medium"
                        >
                          {model.name}
                        </button>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {model.provider} • {formatCost(model.inputCostPer1M)}/1M
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredModels.length} of {llmModels.length} models
          {compareMode && <span className="ml-2 text-purple-600 dark:text-purple-400 font-medium">
            (Compare mode: Select up to 4 models from the table)
          </span>}
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3 mb-6">
          {filteredModels.map((model) => {
            const isFavorite = favorites.includes(model.id);
            const isSelected = selectedForCompare.includes(model.id);
            return (
              <MobileModelCard
                key={model.id}
                model={model}
                isFavorite={isFavorite}
                isSelected={isSelected}
                compareMode={compareMode}
                onToggleFavorite={() => toggleFavorite(model.id)}
                onToggleCompare={() => toggleCompare(model.id)}
                onShowDetails={() => setSelectedModel(model)}
                onFindRecommendations={() => {
                  const recs = {
                    similar: findSimilarModels(model, llmModels),
                    cheaper: findCheaperAlternatives(model, llmModels),
                    better: findBetterPerformance(model, llmModels)
                  };
                  setRecommendations(recs);
                  setShowRecommendations(true);
                  // Scroll to top to see recommendations
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 100);
                }}
                formatNumber={formatNumber}
                formatCost={formatCost}
              />
            );
          })}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  {compareMode && (
                    <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Select
                    </th>
                  )}
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Fav
                  </th>
                  <th
                    onClick={() => handleSort('name')}
                    className="px-2 sm:px-4 py-2 sm:py-3 text-left text-sm font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Model <SortIcon field="name" />
                  </th>
                  <th
                    onClick={() => handleSort('provider')}
                    className="px-2 sm:px-4 py-2 sm:py-3 text-left text-sm font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Provider <SortIcon field="provider" />
                  </th>
                  <th
                    onClick={() => handleSort('quality')}
                    className="px-2 sm:px-4 py-2 sm:py-3 text-right text-sm font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Quality <SortIcon field="quality" />
                  </th>
                  <th
                    onClick={() => handleSort('contextWindow')}
                    className="px-2 sm:px-4 py-2 sm:py-3 text-right text-sm font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Context <SortIcon field="contextWindow" />
                  </th>
                  <th
                    onClick={() => handleSort('books')}
                    className="px-2 sm:px-4 py-2 sm:py-3 text-right text-sm font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Books <SortIcon field="books" />
                  </th>
                  <th
                    onClick={() => handleSort('inputCost')}
                    className="px-2 sm:px-4 py-2 sm:py-3 text-right text-sm font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Input/1M <SortIcon field="inputCost" />
                  </th>
                  <th
                    onClick={() => handleSort('outputCost')}
                    className="px-2 sm:px-4 py-2 sm:py-3 text-right text-sm font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Output/1M <SortIcon field="outputCost" />
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredModels.map((model, index) => {
                  const books = calculateBooksInContext(model.contextWindow);
                  const isFavorite = favorites.includes(model.id);
                  const isSelected = selectedForCompare.includes(model.id);
                  const hasNewData = model.tags || model.bestFor || model.benchmarks;
                  return (
                    <tr
                      key={model.id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                        isSelected ? 'bg-purple-50 dark:bg-purple-900/20' :
                        index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50/50 dark:bg-gray-800/50'
                      }`}
                    >
                      {compareMode && (
                        <td className="px-2 sm:px-4 py-3 sm:py-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleCompare(model.id)}
                            disabled={!isSelected && selectedForCompare.length >= 3}
                            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                          />
                        </td>
                      )}
                      <td className="px-2 sm:px-4 py-3 sm:py-4">
                        <button
                          onClick={() => toggleFavorite(model.id)}
                          className="text-gray-400 hover:text-yellow-500 transition-colors"
                        >
                          <Star className={`w-5 h-5 ${isFavorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                        </button>
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {model.name}
                            </div>
                            {hasNewData && (
                              <span title="Enhanced data available">
                                <TrendingUp className="w-3 h-3 text-green-500" />
                              </span>
                            )}
                            {/* Status Badges */}
                            {model.status?.isNew && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-green-500 text-white rounded text-[10px] font-bold" title="Released within last 3 months">
                                <Sparkles className="w-2.5 h-2.5" />
                                NEW
                              </span>
                            )}
                            {model.status?.pricingUpdated && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-500 text-white rounded text-[10px] font-bold" title={`Pricing updated: ${model.status.pricingUpdateDate || 'recently'}`}>
                                <TrendingUp className="w-2.5 h-2.5" />
                                UPDATED
                              </span>
                            )}
                            {model.status?.isDeprecated && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-red-500 text-white rounded text-[10px] font-bold" title={`Deprecated${model.status.deprecationDate ? ': ' + model.status.deprecationDate : ''}`}>
                                <AlertCircle className="w-2.5 h-2.5" />
                                DEPRECATED
                              </span>
                            )}
                          </div>
                          {model.tags && (
                            <div className="flex flex-wrap gap-1">
                              {model.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-xs px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          {model.provider}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 text-right">
                        {model.benchmarks?.mmlu ? (
                          <span className="font-mono text-sm text-gray-900 dark:text-white">{model.benchmarks.mmlu}%</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 text-right font-mono text-sm text-gray-900 dark:text-white">
                        {formatNumber(model.contextWindow)}
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                          {books}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 text-right font-mono text-sm text-gray-900 dark:text-white">
                        {formatCost(model.inputCostPer1M)}
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 text-right font-mono text-sm text-gray-900 dark:text-white">
                        {formatCost(model.outputCostPer1M)}
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedModel(model)}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            title="View Details"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              const recs = {
                                similar: findSimilarModels(model, llmModels),
                                cheaper: findCheaperAlternatives(model, llmModels),
                                better: findBetterPerformance(model, llmModels)
                              };
                              setRecommendations(recs);
                              setShowRecommendations(true);
                              // Scroll to recommendations
                              setTimeout(() => {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }, 100);
                            }}
                            className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                            title="Find Recommendations"
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredModels.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No models found. Try a different search term or filter.
              </p>
            </div>
          )}
        </div>

        {/* Enhanced Info Box */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
            <div>
              <span className="font-semibold text-blue-900 dark:text-blue-200">Context:</span>
              <p className="text-blue-800 dark:text-blue-300 mt-1">Max tokens a model can process</p>
            </div>
            <div>
              <span className="font-semibold text-blue-900 dark:text-blue-200">Quality:</span>
              <p className="text-blue-800 dark:text-blue-300 mt-1">MMLU benchmark score (higher is better)</p>
            </div>
            <div>
              <span className="font-semibold text-blue-900 dark:text-blue-200">Books:</span>
              <p className="text-blue-800 dark:text-blue-300 mt-1">Number of books that fit (~100k tokens each)</p>
            </div>
          </div>
          <div className="pt-3 border-t border-blue-200 dark:border-blue-800">
            <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <p><strong>Tips:</strong> Click column headers to sort • Star models to favorite • Click <Info className="w-3 h-3 inline" /> for details • Click <Sparkles className="w-3 h-3 inline" /> for recommendations • Use Advanced Filters for precise search • Press ? for shortcuts</p>
              <p className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Last updated: November 8, 2025 • Pricing data verified with official sources
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Cost Calculator Modal */}
      {showEnhancedCostCalculator && (
        <EnhancedCostCalculator
          models={llmModels}
          onClose={() => setShowEnhancedCostCalculator(false)}
        />
      )}

      {/* Token Optimization Assistant Modal */}
      {showTokenOptimizer && (
        <TokenOptimizationAssistant
          onClose={() => setShowTokenOptimizer(false)}
        />
      )}

      {/* Model Documentation Hub Modal */}
      {showDocumentationHub && (
        <ModelDocumentationHub
          onClose={() => setShowDocumentationHub(false)}
        />
      )}

      {/* Smart Model Recommender Modal */}
      {showSmartRecommender && (
        <SmartModelRecommender
          models={llmModels}
          onSelectModel={(model) => setSelectedModel(model)}
          onClose={() => setShowSmartRecommender(false)}
        />
      )}

      {/* Model Testing Playground Modal */}
      {showTestingPlayground && (
        <ModelTestingPlayground
          models={llmModels}
          onClose={() => setShowTestingPlayground(false)}
        />
      )}

      {/* Model Changelog Modal */}
      {showChangelog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Model Changelog</h2>
              <button
                onClick={() => setShowChangelog(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ModelChangelog />
            </div>
          </div>
        </div>
      )}

      {/* Notification Preferences Modal */}
      {showNotificationPreferences && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notification Preferences</h2>
              <button
                onClick={() => setShowNotificationPreferences(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <NotificationPreferences />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Made with ❤️ by Sriram Srinivasan
          </p>
        </div>
      </footer>
    </div>
  );
}
