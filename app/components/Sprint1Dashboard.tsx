'use client';

import { useState } from 'react';
import { LLMModel } from '../data/llm-data';
import { EnhancedTokenCounter } from './EnhancedTokenCounter';
import { SessionHistoryDashboard } from './SessionHistoryDashboard';
import { ExportReporting } from './ExportReporting';
import { Calculator, History, Download, X, Check, Plus, Minus, Trash2 } from 'lucide-react';

interface Sprint1DashboardProps {
  allModels: LLMModel[];
  initialSelectedModels?: LLMModel[];
  onClose?: () => void;
}

type ActiveTab = 'counter' | 'history' | 'export';

export const Sprint1Dashboard = ({ allModels, initialSelectedModels = [], onClose }: Sprint1DashboardProps) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('counter');
  const [selectedModels, setSelectedModels] = useState<LLMModel[]>(
    initialSelectedModels.length > 0 ? initialSelectedModels : []
  );
  const [selectedModel, setSelectedModel] = useState<LLMModel | undefined>(
    initialSelectedModels.length > 0 ? initialSelectedModels[0] : undefined
  );
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div>
            <h2 className="text-2xl font-bold">LLM Usage Analytics</h2>
            <p className="text-sm text-blue-100 mt-1">
              Track tokens, analyze costs, and export insights
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close dashboard"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Model Selection Interface */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium">
              Selected Models ({selectedModels.length})
            </label>
            <div className="flex gap-2">
              {selectedModels.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('Clear all selected models?')) {
                      setSelectedModels([]);
                      setSelectedModel(undefined);
                      setShowModelSelector(false);
                    }
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                  title="Clear all selections"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </button>
              )}
              <button
                onClick={() => setShowModelSelector(!showModelSelector)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showModelSelector ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {showModelSelector ? 'Hide' : 'Add/Remove'} Models
              </button>
            </div>
          </div>

          {/* Model Selector Dropdown */}
          {showModelSelector && (
            <div className="mb-4 p-4 bg-white dark:bg-gray-700 rounded-lg border dark:border-gray-600">
              <input
                type="text"
                placeholder="Search models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg mb-3 dark:bg-gray-600 dark:border-gray-500"
              />
              <div className="max-h-60 overflow-y-auto space-y-2">
                {allModels
                  .filter((model) =>
                    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    model.provider.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((model) => {
                    const isSelected = selectedModels.some((m) => m.id === model.id);
                    return (
                      <button
                        key={model.id}
                        onClick={() => {
                          if (isSelected) {
                            const newSelected = selectedModels.filter((m) => m.id !== model.id);
                            setSelectedModels(newSelected);
                            if (selectedModel?.id === model.id) {
                              setSelectedModel(newSelected[0]);
                            }
                          } else {
                            const newSelected = [...selectedModels, model];
                            setSelectedModels(newSelected);
                            if (!selectedModel) {
                              setSelectedModel(model);
                            }
                          }
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-600 dark:border-blue-400'
                            : 'bg-white dark:bg-gray-600 border-gray-200 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">{model.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {model.provider} • ${model.inputCostPer1M.toFixed(2)}/1M in
                            </div>
                          </div>
                          {isSelected && <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Active Model for Token Counter */}
          {selectedModels.length > 0 && (
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">
                Active Model for Token Counter
              </label>
              <select
                value={selectedModel?.id || ''}
                onChange={(e) => {
                  const model = selectedModels.find((m) => m.id === e.target.value);
                  setSelectedModel(model);
                }}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              >
                {selectedModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} ({model.provider}) - ${model.inputCostPer1M.toFixed(2)}/1M in, $
                    {model.outputCostPer1M.toFixed(2)}/1M out
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedModels.length === 0 && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-center">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>No models selected.</strong> Click &quot;Add/Remove Models&quot; to select models for analysis.
              </p>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b dark:border-gray-700 bg-white dark:bg-gray-900">
          <button
            onClick={() => setActiveTab('counter')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'counter'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Calculator className="w-5 h-5" />
            Token Counter
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'history'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <History className="w-5 h-5" />
            Session History
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              activeTab === 'export'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Download className="w-5 h-5" />
            Export & Reports
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'counter' && (
            <div>
              <EnhancedTokenCounter model={selectedModel} />
              {!selectedModel && selectedModels.length === 0 && (
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Tip:</strong> Select a model from the main comparison table to see cost estimates
                    and context window usage.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && <SessionHistoryDashboard />}

          {activeTab === 'export' && <ExportReporting selectedModels={selectedModels} />}
        </div>

        {/* Footer */}
        <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-end items-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              {selectedModels.length > 0
                ? `${selectedModels.length} model${selectedModels.length > 1 ? 's' : ''} selected`
                : 'No models selected'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
