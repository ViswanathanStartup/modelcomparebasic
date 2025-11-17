'use client';

import { useState, useMemo, useEffect } from 'react';
import { enrichedModels } from './data/enriched-models';
import { Search, GitCompare, X, Share2, Clock, Sparkles } from 'lucide-react';
import EnhancedModelComparison from './components/EnhancedModelComparison';
import type { LLMModel } from './data/llm-data';

type SortField = 'name' | 'provider' | 'contextWindow' | 'inputCost' | 'releaseDate';
type SortDirection = 'asc' | 'desc';
type ComparisonHistory = { models: string[]; timestamp: number };

export default function Home() {
  // Format numbers consistently for SSR
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [selectedModality, setSelectedModality] = useState<string>('all');
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [comparisonHistory, setComparisonHistory] = useState<ComparisonHistory[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  // Load from URL params and history on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load from URL params
      const params = new URLSearchParams(window.location.search);
      const compareParam = params.get('compare');
      if (compareParam) {
        const modelIds = compareParam.split(',').slice(0, 3);
        setSelectedForCompare(modelIds);
        if (modelIds.length >= 2) {
          setShowComparison(true);
        }
      }

      // Load history
      const savedHistory = localStorage.getItem('comparison_history');
      if (savedHistory) {
        setComparisonHistory(JSON.parse(savedHistory));
      }
    }
  }, []);

  // Quick filter presets
  const applyPreset = (preset: string) => {
    setSearchTerm('');
    setSelectedProvider('all');
    setSelectedFamily('all');
    setSelectedModality('all');
    
    switch (preset) {
      case 'coding':
        setSortField('name');
        setSearchTerm('');
        // Will filter by models good for coding in the UI
        break;
      case 'cheapest':
        setSortField('inputCost');
        setSortDirection('asc');
        break;
      case 'newest':
        setSortField('releaseDate');
        setSortDirection('desc');
        break;
      case 'vision':
        setSelectedModality('vision');
        setSortField('name');
        break;
      case 'reasoning':
        setSearchTerm('');
        setSortField('name');
        break;
      case 'largest-context':
        setSortField('contextWindow');
        setSortDirection('desc');
        break;
      case 'openai':
        setSelectedProvider('OpenAI');
        setSortField('name');
        break;
      case 'anthropic':
        setSelectedProvider('Anthropic');
        setSortField('name');
        break;
    }
  };

  // Get preset filtered models
  const getPresetModels = (preset: string) => {
    const codingModels = ['gpt-4o', 'claude-3-5-sonnet-20241022', 'codestral-2508', 'o1', 'deepseek-v3'];
    const reasoningModels = ['o1', 'o1-preview', 'o1-mini', 'deepseek-v3', 'claude-3-5-sonnet-20241022'];
    
    switch (preset) {
      case 'coding':
        return enrichedModels.filter(m => codingModels.includes(m.id)).slice(0, 20);
      case 'cheapest':
        return [...enrichedModels].sort((a, b) => a.inputCostPer1M - b.inputCostPer1M).slice(0, 20);
      case 'newest':
        return [...enrichedModels]
          .filter(m => m.released || (m as any).releaseDate)
          .sort((a, b) => {
            const dateA = new Date(a.released || (a as any).releaseDate || '2020-01-01');
            const dateB = new Date(b.released || (b as any).releaseDate || '2020-01-01');
            return dateB.getTime() - dateA.getTime();
          })
          .slice(0, 20);
      case 'vision':
        return enrichedModels.filter(m => m.modality === 'vision').slice(0, 20);
      case 'reasoning':
        return enrichedModels.filter(m => reasoningModels.includes(m.id)).slice(0, 20);
      case 'largest-context':
        return [...enrichedModels].sort((a, b) => b.contextWindow - a.contextWindow).slice(0, 20);
      case 'openai':
        return enrichedModels.filter(m => m.provider === 'OpenAI').slice(0, 20);
      case 'anthropic':
        return enrichedModels.filter(m => m.provider === 'Anthropic').slice(0, 20);
      default:
        return enrichedModels;
    }
  };

  const providers = useMemo(() => {
    const unique = Array.from(new Set(enrichedModels.map(m => m.provider))).sort();
    return ['all', ...unique];
  }, []);

  const families = useMemo(() => {
    const unique = Array.from(new Set(enrichedModels.map(m => {
      // Extract family from model name (e.g., "GPT-4" -> "GPT", "Claude 3" -> "Claude")
      const match = m.name.match(/^([A-Za-z]+)/);
      return match ? match[1] : 'Unknown';
    }))).sort();
    return ['all', ...unique];
  }, []);

  const modalities = ['all', 'Multimodal', 'Vision', 'Text'];

  const filteredModels = useMemo(() => {
    let filtered = enrichedModels.filter(model => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        model.name.toLowerCase().includes(searchLower) ||
        model.provider.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      if (selectedProvider !== 'all' && model.provider !== selectedProvider) {
        return false;
      }

      if (selectedFamily !== 'all') {
        const modelFamily = model.name.match(/^([A-Za-z]+)/)?.[1] || 'Unknown';
        if (modelFamily !== selectedFamily) return false;
      }

      if (selectedModality !== 'all') {
        const hasModality = model.tags?.some(tag => 
          tag.toLowerCase() === selectedModality.toLowerCase()
        );
        if (!hasModality) return false;
      }

      return true;
    });

    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

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
        case 'inputCost':
          aValue = a.inputCostPer1M;
          bValue = b.inputCostPer1M;
          break;
        case 'releaseDate':
          aValue = a.released || '';
          bValue = b.released || '';
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [searchTerm, selectedProvider, selectedFamily, selectedModality, sortField, sortDirection]);

  const toggleCompare = (modelId: string) => {
    if (selectedForCompare.includes(modelId)) {
      setSelectedForCompare(selectedForCompare.filter(id => id !== modelId));
    } else if (selectedForCompare.length < 3) {
      setSelectedForCompare([...selectedForCompare, modelId]);
    }
  };

  const handleCompare = () => {
    if (selectedForCompare.length >= 2) {
      // Save to history
      const newHistory: ComparisonHistory = {
        models: selectedForCompare,
        timestamp: Date.now()
      };
      const updatedHistory = [newHistory, ...comparisonHistory].slice(0, 10); // Keep last 10
      setComparisonHistory(updatedHistory);
      if (typeof window !== 'undefined') {
        localStorage.setItem('comparison_history', JSON.stringify(updatedHistory));
      }
      
      setShowComparison(true);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}${window.location.pathname}?compare=${selectedForCompare.join(',')}`;
      setShareUrl(url);
      setShowShareModal(true);
    }
  };

  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  const loadFromHistory = (history: ComparisonHistory) => {
    setSelectedForCompare(history.models);
    setShowHistory(false);
    if (history.models.length >= 2) {
      setShowComparison(true);
    }
  };

  const isNew = (released?: string) => {
    if (!released) return false;
    const releaseDate = new Date(released);
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    return releaseDate >= twoMonthsAgo;
  };

  const isUpdated = (model: any) => {
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    
    // Check if pricing was updated recently
    if (model.status?.pricingUpdateDate) {
      const pricingDate = new Date(model.status.pricingUpdateDate);
      if (pricingDate >= twoMonthsAgo) return true;
    }
    
    // Check if model was updated recently
    if (model.lastUpdated) {
      const lastUpdatedDate = new Date(model.lastUpdated);
      if (lastUpdatedDate >= twoMonthsAgo) return true;
    }
    
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900">
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl max-w-md w-full p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Share Comparison</h3>
              </div>
              <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Share this comparison with others. They'll see the same models you selected.
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm font-mono"
              />
              <button
                onClick={copyShareUrl}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl max-w-2xl w-full p-8 max-h-[80vh] overflow-auto shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Comparison History</h3>
              </div>
              <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            {comparisonHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-gray-500 dark:text-gray-400">No comparison history yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Your comparisons will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {comparisonHistory.map((history, index) => (
                  <div
                    key={index}
                    onClick={() => loadFromHistory(history)}
                    className="group p-5 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-all duration-200 hover:shadow-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-semibold text-sm mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {history.models.map(id => enrichedModels.find(m => m.id === id)?.name || id).join(' vs ')}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(history.timestamp).toLocaleDateString()} at{' '}
                          {new Date(history.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      <GitCompare className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {showComparison && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl w-full max-w-7xl max-h-[90vh] overflow-auto shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-6 border-b-2 border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Model Comparison</h2>
              <button onClick={() => setShowComparison(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-all">
                <X className="w-7 h-7" />
              </button>
            </div>
            <EnhancedModelComparison
              models={enrichedModels}
              preSelectedModels={selectedForCompare}
              onClose={() => setShowComparison(false)}
            />
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Free Tool
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-4">
            Model Compare Basic
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Compare up to 3 AI models side-by-side for free
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex justify-center gap-3 mb-8">
          <button
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all duration-200"
          >
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">History</span>
          </button>
          {selectedForCompare.length >= 2 && (
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 hover:shadow-lg transition-all duration-200"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium">Share Comparison</span>
            </button>
          )}
        </div>

        {/* Quick Presets */}
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">Quick Filters</span>
            <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">Click to auto-compare</span>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => {
                applyPreset('coding');
                const models = getPresetModels('coding');
                setSelectedForCompare(models.slice(0, 3).map(m => m.id));
              }}
              className="group px-5 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm font-semibold flex items-center gap-2"
            >
              <span className="text-lg">🔥</span>
              Best for Coding
            </button>
            <button
              onClick={() => {
                applyPreset('cheapest');
                const models = getPresetModels('cheapest');
                setSelectedForCompare(models.slice(0, 3).map(m => m.id));
              }}
              className="group px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm font-semibold flex items-center gap-2"
            >
              <span className="text-lg">💰</span>
              Cheapest Options
            </button>
            <button
              onClick={() => {
                applyPreset('newest');
                const models = getPresetModels('newest');
                setSelectedForCompare(models.slice(0, 3).map(m => m.id));
              }}
              className="group px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm font-semibold flex items-center gap-2"
            >
              <span className="text-lg">✨</span>
              Newest Models
            </button>
            <button
              onClick={() => {
                applyPreset('vision');
                const models = getPresetModels('vision');
                setSelectedForCompare(models.slice(0, 3).map(m => m.id));
              }}
              className="group px-5 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm font-semibold flex items-center gap-2"
            >
              <span className="text-lg">👁️</span>
              Vision Models
            </button>
            <button
              onClick={() => {
                applyPreset('reasoning');
                const models = getPresetModels('reasoning');
                setSelectedForCompare(models.slice(0, 3).map(m => m.id));
              }}
              className="group px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm font-semibold flex items-center gap-2"
            >
              <span className="text-lg">🧠</span>
              Reasoning Models
            </button>
            <button
              onClick={() => {
                applyPreset('largest-context');
                const models = getPresetModels('largest-context');
                setSelectedForCompare(models.slice(0, 3).map(m => m.id));
              }}
              className="group px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm font-semibold flex items-center gap-2"
            >
              <span className="text-lg">📚</span>
              Largest Context
            </button>
            <button
              onClick={() => {
                applyPreset('openai');
                const models = getPresetModels('openai');
                setSelectedForCompare(models.slice(0, 3).map(m => m.id));
              }}
              className="group px-5 py-3 bg-gradient-to-r from-teal-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm font-semibold flex items-center gap-2"
            >
              <span className="text-lg">🤖</span>
              OpenAI Only
            </button>
            <button
              onClick={() => {
                applyPreset('anthropic');
                const models = getPresetModels('anthropic');
                setSelectedForCompare(models.slice(0, 3).map(m => m.id));
              }}
              className="group px-5 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm font-semibold flex items-center gap-2"
            >
              <span className="text-lg">🎭</span>
              Anthropic Only
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all"
              />
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            </div>

            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all cursor-pointer"
            >
              {providers.map(provider => (
                <option key={provider} value={provider}>
                  {provider === 'all' ? 'All Providers' : provider}
                </option>
              ))}
            </select>

            <select
              value={selectedFamily}
              onChange={(e) => setSelectedFamily(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {families.map(family => (
                <option key={family} value={family}>
                  {family === 'all' ? 'All Families' : family}
                </option>
              ))}
            </select>

            <select
              value={selectedModality}
              onChange={(e) => setSelectedModality(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {modalities.map(modality => (
                <option key={modality} value={modality}>
                  {modality === 'all' ? 'All Modalities' : modality.charAt(0).toUpperCase() + modality.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div className="flex gap-2 flex-wrap">
            <span className="text-sm text-gray-600 dark:text-gray-400 self-center">Sort by:</span>
            {(['name', 'provider', 'contextWindow', 'inputCost', 'releaseDate'] as SortField[]).map(field => (
              <button
                key={field}
                onClick={() => {
                  if (sortField === field) {
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortField(field);
                    setSortDirection('asc');
                  }
                }}
                className={`px-3 py-1 rounded-full text-sm ${
                  sortField === field
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {field === 'contextWindow' ? 'Context' : field === 'inputCost' ? 'Price' : field === 'releaseDate' ? 'Release' : field.charAt(0).toUpperCase() + field.slice(1)}
                {sortField === field && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
              </button>
            ))}
          </div>
        </div>

        {/* Comparison Tray */}
        {selectedForCompare.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border-t-2 border-gray-200 dark:border-gray-700 p-4 md:p-6 z-40">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {selectedForCompare.map(id => {
                  const model = enrichedModels.find(m => m.id === id);
                  return model ? (
                    <div key={id} className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full shadow-lg">
                      <span className="text-sm font-semibold">{model.name}</span>
                      <button onClick={() => toggleCompare(id)} className="hover:bg-white/20 rounded-full p-0.5 transition-all">
                        <X size={16} />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
              <button
                onClick={handleCompare}
                disabled={selectedForCompare.length < 2}
                className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-xl ${
                  selectedForCompare.length >= 2
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white hover:scale-105'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                }`}
              >
                <GitCompare size={24} />
                Compare Now ({selectedForCompare.length}/3)
              </button>
            </div>
          </div>
        )}

        {/* Model Grid */}
        {filteredModels.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No models found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
            {filteredModels.map(model => (
              <div key={model.id} className="group bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 relative transition-all duration-300 hover:-translate-y-1">
              {/* Status Badges */}
              <div className="absolute top-3 right-3 flex gap-1.5">
                {isNew(model.released) && (
                  <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">New</span>
                )}
                {!isNew(model.released) && isUpdated(model) && (
                  <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">Updated</span>
                )}
                {model.status?.isDeprecated && (
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg">Deprecated</span>
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 pr-24 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {model.name}
              </h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-5">
                {model.provider}
              </p>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between items-center p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Context Window</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{formatNumber(model.contextWindow)} tokens</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Input</div>
                    <div className="text-sm font-bold text-blue-600 dark:text-blue-400">${model.inputCostPer1M}/1M</div>
                  </div>
                  <div className="p-2.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Output</div>
                    <div className="text-sm font-bold text-purple-600 dark:text-purple-400">${model.outputCostPer1M}/1M</div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {model.tags && model.tags.length > 0 && (
                <div className="flex gap-1.5 flex-wrap mb-5">
                  {model.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 px-3 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <button
                onClick={() => toggleCompare(model.id)}
                disabled={!selectedForCompare.includes(model.id) && selectedForCompare.length >= 3}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                  selectedForCompare.includes(model.id)
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 shadow-lg'
                    : selectedForCompare.length >= 3
                    ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400'
                }`}
              >
                {selectedForCompare.includes(model.id) ? '✓ Selected' : 'Add to Compare'}
              </button>
            </div>
          ))}
        </div>
        )}

        {/* Footer */}
        <div className="text-center py-12 mt-8">
          <div className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Built with ❤️ by</span>
            <a href="https://techviswa.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 hover:from-blue-700 hover:to-indigo-700 transition-all">
              TechViswa.com
            </a>
            <span>for the AI Community</span>
          </div>
        </div>
      </div>
    </div>
  );
}
