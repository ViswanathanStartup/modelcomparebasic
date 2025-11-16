'use client';

import { useState, useMemo } from 'react';
import { LLMModel } from '../data/llm-data';
import { Sparkles, X, Award, DollarSign, Zap, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';

interface SmartModelRecommenderProps {
  models: LLMModel[];
  onSelectModel: (model: LLMModel) => void;
  onClose: () => void;
}

type TaskType = 'creative-writing' | 'code-generation' | 'data-analysis' | 'chat' | 'reasoning' | 'translation';
type Priority = 'quality' | 'cost' | 'balanced' | 'speed';

export const SmartModelRecommender = ({ models, onSelectModel, onClose }: SmartModelRecommenderProps) => {
  const [taskType, setTaskType] = useState<TaskType>('chat');
  const [priority, setPriority] = useState<Priority>('balanced');
  const [maxCostPer1M, setMaxCostPer1M] = useState('10');
  const [minQuality, setMinQuality] = useState('0');
  const [minContextWindow, setMinContextWindow] = useState('0');
  const [showResults, setShowResults] = useState(false);

  const recommendations = useMemo(() => {
    if (!showResults) return [];

    const maxCost = parseFloat(maxCostPer1M) || Infinity;
    const minQualityScore = parseFloat(minQuality) || 0;
    const minContext = parseInt(minContextWindow) || 0;

    // Filter models based on constraints
    const filtered = models.filter(model => {
      const avgCost = (model.inputCostPer1M + model.outputCostPer1M) / 2;
      const qualityScore = model.benchmarks?.mmlu || 0;

      if (avgCost > maxCost) return false;
      if (qualityScore < minQualityScore) return false;
      if (model.contextWindow < minContext) return false;

      // Filter by task type
      if (taskType === 'code-generation' && !model.bestFor?.some(use =>
        use.toLowerCase().includes('code') || use.toLowerCase().includes('programming')
      )) {
        // Allow models without bestFor tags if they have good quality
        if (model.bestFor && model.bestFor.length > 0) return false;
      }

      if (taskType === 'creative-writing' && !model.bestFor?.some(use =>
        use.toLowerCase().includes('creative') || use.toLowerCase().includes('writing') || use.toLowerCase().includes('content')
      )) {
        if (model.bestFor && model.bestFor.length > 0) return false;
      }

      return true;
    });

    // Score models based on priority
    const scoredModels = filtered.map(model => {
      const avgCost = (model.inputCostPer1M + model.outputCostPer1M) / 2;
      const qualityScore = model.benchmarks?.mmlu || 50; // Default to 50 if no benchmark
      const contextScore = Math.min(model.contextWindow / 100000, 2); // Cap at 200k tokens

      // Normalize scores (0-100)
      const costScore = Math.max(0, 100 - (avgCost / maxCost) * 100);
      const normalizedQuality = (qualityScore / 100) * 100;
      const normalizedContext = (contextScore / 2) * 100;

      let totalScore = 0;

      switch (priority) {
        case 'quality':
          totalScore = normalizedQuality * 0.6 + costScore * 0.2 + normalizedContext * 0.2;
          break;
        case 'cost':
          totalScore = costScore * 0.6 + normalizedQuality * 0.3 + normalizedContext * 0.1;
          break;
        case 'speed':
          // Prefer smaller, faster models
          const sizeScore = 100 - (normalizedQuality * 0.5); // Smaller models tend to be faster
          totalScore = sizeScore * 0.5 + costScore * 0.3 + normalizedQuality * 0.2;
          break;
        case 'balanced':
        default:
          totalScore = (normalizedQuality + costScore + normalizedContext) / 3;
      }

      // Calculate value score (quality per dollar)
      const valueScore = qualityScore / Math.max(avgCost, 0.01);

      return {
        model,
        score: totalScore,
        avgCost,
        qualityScore,
        valueScore,
        contextScore: model.contextWindow
      };
    });

    // Sort by score and return top 5
    return scoredModels
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [models, taskType, priority, maxCostPer1M, minQuality, minContextWindow, showResults]);

  const taskDescriptions: Record<TaskType, string> = {
    'creative-writing': 'Creative content, stories, articles, marketing copy',
    'code-generation': 'Programming, code review, debugging, technical documentation',
    'data-analysis': 'Data processing, analysis, summarization, insights',
    'chat': 'General conversation, Q&A, customer support',
    'reasoning': 'Complex problem solving, logic, mathematics',
    'translation': 'Language translation, localization'
  };

  const priorityDescriptions: Record<Priority, string> = {
    'quality': 'Prioritize highest quality models regardless of cost',
    'cost': 'Prioritize lowest cost while maintaining acceptable quality',
    'balanced': 'Balance between quality, cost, and context window',
    'speed': 'Prioritize faster, lighter models for quick responses'
  };

  const handleFindModels = () => {
    setShowResults(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-4 sm:p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto my-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-purple-600" />
            Smart Model Recommender
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <p className="text-sm text-purple-800 dark:text-purple-200">
            <strong>Find your perfect model!</strong> Answer a few questions and we&apos;ll recommend the best models for your needs based on task type, budget, and quality requirements.
          </p>
        </div>

        {/* Configuration */}
        <div className="space-y-6 mb-6">
          {/* Task Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              What type of task do you need?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(Object.keys(taskDescriptions) as TaskType[]).map(task => (
                <button
                  key={task}
                  onClick={() => setTaskType(task)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    taskType === task
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                  }`}
                >
                  <div className="font-semibold text-gray-900 dark:text-white mb-1 capitalize">
                    {task.replace('-', ' ')}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {taskDescriptions[task]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              What&apos;s your priority?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(Object.keys(priorityDescriptions) as Priority[]).map(p => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    priority === p
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {p === 'quality' && <Award className="w-4 h-4 text-blue-600" />}
                    {p === 'cost' && <DollarSign className="w-4 h-4 text-green-600" />}
                    {p === 'balanced' && <CheckCircle className="w-4 h-4 text-purple-600" />}
                    {p === 'speed' && <Zap className="w-4 h-4 text-yellow-600" />}
                    <span className="font-semibold text-gray-900 dark:text-white capitalize">{p}</span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {priorityDescriptions[p]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Constraints */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Cost per 1M tokens ($)
              </label>
              <input
                type="number"
                value={maxCostPer1M}
                onChange={(e) => setMaxCostPer1M(e.target.value)}
                placeholder="10"
                step="0.1"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Leave at 0 for no limit
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Min Quality Score (MMLU %)
              </label>
              <input
                type="number"
                value={minQuality}
                onChange={(e) => setMinQuality(e.target.value)}
                placeholder="0"
                min="0"
                max="100"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Min Context Window
              </label>
              <input
                type="number"
                value={minContextWindow}
                onChange={(e) => setMinContextWindow(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Find Models Button */}
        <div className="mb-6">
          <button
            onClick={handleFindModels}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg"
          >
            <Sparkles className="w-6 h-6" />
            Find Best Models
          </button>
        </div>

        {/* Results */}
        {showResults && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Top {recommendations.length} Recommended Models
            </h3>

            {recommendations.length === 0 ? (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 text-center">
                <AlertCircle className="w-12 h-12 text-amber-600 mx-auto mb-3" />
                <p className="text-amber-900 dark:text-amber-100 font-semibold mb-2">
                  No models found matching your criteria
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Try relaxing your constraints (higher max cost, lower min quality, or smaller context window)
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {recommendations.map((rec, index) => (
                  <div
                    key={rec.model.id}
                    className={`bg-white dark:bg-gray-800 rounded-lg p-6 border-2 transition-all hover:shadow-lg ${
                      index === 0
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {index === 0 && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-bold">
                              <Award className="w-4 h-4" />
                              Best Match
                            </span>
                          )}
                          {index > 0 && (
                            <span className="inline-flex items-center px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-semibold">
                              #{index + 1}
                            </span>
                          )}
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                          {rec.model.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {rec.model.provider}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                          {rec.score.toFixed(0)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Match Score</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="text-xs font-semibold text-green-900 dark:text-green-100">Avg Cost</span>
                        </div>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          ${rec.avgCost.toFixed(2)}
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-300">per 1M tokens</p>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Award className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-semibold text-blue-900 dark:text-blue-100">Quality</span>
                        </div>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {rec.qualityScore > 0 ? `${rec.qualityScore}%` : 'N/A'}
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300">MMLU score</p>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <BookOpen className="w-4 h-4 text-purple-600" />
                          <span className="text-xs font-semibold text-purple-900 dark:text-purple-100">Context</span>
                        </div>
                        <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {(rec.contextScore / 1000).toFixed(0)}K
                        </p>
                        <p className="text-xs text-purple-700 dark:text-purple-300">tokens</p>
                      </div>

                      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className="w-4 h-4 text-amber-600" />
                          <span className="text-xs font-semibold text-amber-900 dark:text-amber-100">Value</span>
                        </div>
                        <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                          {rec.valueScore.toFixed(1)}
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-300">quality/$</p>
                      </div>
                    </div>

                    {rec.model.bestFor && rec.model.bestFor.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Best for:</p>
                        <div className="flex flex-wrap gap-2">
                          {rec.model.bestFor.slice(0, 4).map((use, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                            >
                              {use}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          onSelectModel(rec.model);
                          onClose();
                        }}
                        className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold transition-colors"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          onSelectModel(rec.model);
                        }}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold transition-colors"
                      >
                        Compare
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
