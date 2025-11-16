'use client';

import { LLMModel, calculateBooksInContext } from '../data/llm-data';
import { Star, Info, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';

interface MobileModelCardProps {
  model: LLMModel;
  isFavorite: boolean;
  isSelected: boolean;
  compareMode: boolean;
  onToggleFavorite: () => void;
  onToggleCompare: () => void;
  onShowDetails: () => void;
  onFindRecommendations: () => void;
  formatNumber: (num: number) => string;
  formatCost: (cost: number) => string;
}

export function MobileModelCard({
  model,
  isFavorite,
  isSelected,
  compareMode,
  onToggleFavorite,
  onToggleCompare,
  onShowDetails,
  onFindRecommendations,
  formatNumber,
  formatCost
}: MobileModelCardProps) {
  const books = calculateBooksInContext(model.contextWindow);

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg shadow-md border-2 transition-all ${
      isSelected ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 dark:border-gray-700'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                {model.name}
              </h3>

              {/* Status Badges */}
              {model.status?.isNew && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-green-500 text-white rounded text-[10px] font-bold">
                  <Sparkles className="w-2.5 h-2.5" />
                  NEW
                </span>
              )}
              {model.status?.pricingUpdated && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-500 text-white rounded text-[10px] font-bold">
                  <TrendingUp className="w-2.5 h-2.5" />
                  UPDATED
                </span>
              )}
              {model.status?.isDeprecated && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-red-500 text-white rounded text-[10px] font-bold">
                  <AlertCircle className="w-2.5 h-2.5" />
                  DEPRECATED
                </span>
              )}
            </div>

            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              {model.provider}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {compareMode && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={onToggleCompare}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
            )}
            <button
              onClick={onToggleFavorite}
              className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
            >
              <Star className={`w-5 h-5 ${isFavorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Context</div>
          <div className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
            {formatNumber(model.contextWindow)}
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Books</div>
          <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
            {books}
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Input/1M</div>
          <div className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
            {formatCost(model.inputCostPer1M)}
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Output/1M</div>
          <div className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
            {formatCost(model.outputCostPer1M)}
          </div>
        </div>

        {model.benchmarks?.mmlu && (
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Quality</div>
            <div className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
              {model.benchmarks.mmlu}%
            </div>
          </div>
        )}
      </div>

      {/* Tags */}
      {model.tags && model.tags.length > 0 && (
        <div className="px-4 pb-3">
          <div className="flex flex-wrap gap-1">
            {model.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="px-4 pb-4 flex gap-2">
        <button
          onClick={onShowDetails}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium text-sm"
        >
          <Info className="w-4 h-4" />
          <span className="hidden xs:inline">View Details</span>
          <span className="inline xs:hidden">Details</span>
        </button>
        <button
          onClick={onFindRecommendations}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium text-sm"
          title="Find Recommendations"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden xs:inline">Recommendations</span>
          <span className="inline xs:hidden">Similar</span>
        </button>
      </div>
    </div>
  );
}
