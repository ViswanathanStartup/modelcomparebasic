'use client';

import { useState, useEffect } from 'react';
import { LLMModel } from '../data/llm-data';
import {
  X, Download, Share2, TrendingUp, DollarSign,
  BarChart3, CheckCircle, AlertCircle, FileText, Save, Trash2
} from 'lucide-react';
import { ExportButton } from './ExportButton';

interface EnhancedModelComparisonProps {
  models: LLMModel[];
  preSelectedModels?: string[];
  onClose?: () => void;
}

interface UsageScenario {
  name: string;
  description: string;
  inputTokens: number;
  outputTokens: number;
  requestsPerMonth: number;
}

const DEFAULT_SCENARIOS: UsageScenario[] = [
  {
    name: 'Chatbot',
    description: 'Customer support chatbot with moderate usage',
    inputTokens: 500,
    outputTokens: 200,
    requestsPerMonth: 10000
  },
  {
    name: 'Document Analysis',
    description: 'Analyze 10K word documents',
    inputTokens: 13000,
    outputTokens: 1000,
    requestsPerMonth: 1000
  },
  {
    name: 'Code Assistant',
    description: 'Code generation and review',
    inputTokens: 1000,
    outputTokens: 500,
    requestsPerMonth: 5000
  },
  {
    name: 'Long Context Analysis',
    description: 'Process 100K token documents',
    inputTokens: 100000,
    outputTokens: 2000,
    requestsPerMonth: 100
  }
];

export default function EnhancedModelComparison({
  models,
  preSelectedModels = [],
  onClose
}: EnhancedModelComparisonProps) {
  const [selectedModels, setSelectedModels] = useState<string[]>(preSelectedModels.slice(0, 4));
  const [selectedScenario, setSelectedScenario] = useState<UsageScenario>(DEFAULT_SCENARIOS[0]);
  const [customScenario, setCustomScenario] = useState<UsageScenario>({
    name: 'Custom',
    description: 'Custom usage scenario',
    inputTokens: 1000,
    outputTokens: 500,
    requestsPerMonth: 1000
  });
  const [useCustomScenario, setUseCustomScenario] = useState(false);
  const [savedScenarios, setSavedScenarios] = useState<UsageScenario[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [scenarioName, setScenarioName] = useState('');
  const [scenarioDescription, setScenarioDescription] = useState('');

  // Load saved scenarios from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('llm-saved-scenarios');
      if (saved) {
        try {
          setSavedScenarios(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to load saved scenarios', e);
        }
      }
    }
  }, []);

  // Save scenario to localStorage
  const saveCurrentScenario = () => {
    if (!scenarioName.trim()) {
      alert('Please enter a scenario name');
      return;
    }

    const newScenario: UsageScenario = {
      name: scenarioName,
      description: scenarioDescription || customScenario.description,
      inputTokens: customScenario.inputTokens,
      outputTokens: customScenario.outputTokens,
      requestsPerMonth: customScenario.requestsPerMonth
    };

    const updated = [...savedScenarios, newScenario];
    setSavedScenarios(updated);
    localStorage.setItem('llm-saved-scenarios', JSON.stringify(updated));
    setShowSaveDialog(false);
    setScenarioName('');
    setScenarioDescription('');
    alert(`Scenario "${scenarioName}" saved successfully!`);
  };

  // Delete saved scenario
  const deleteSavedScenario = (index: number) => {
    const updated = savedScenarios.filter((_, i) => i !== index);
    setSavedScenarios(updated);
    localStorage.setItem('llm-saved-scenarios', JSON.stringify(updated));
  };

  // Load saved scenario
  const loadSavedScenario = (scenario: UsageScenario) => {
    setCustomScenario(scenario);
    setUseCustomScenario(true);
  };

  const compareModels = models.filter(m => selectedModels.includes(m.id));

  // Calculate costs for scenario
  const calculateScenarioCost = (model: LLMModel, scenario: UsageScenario) => {
    const inputCost = (scenario.inputTokens / 1000000) * model.inputCostPer1M * scenario.requestsPerMonth;
    const outputCost = (scenario.outputTokens / 1000000) * model.outputCostPer1M * scenario.requestsPerMonth;
    return {
      monthly: inputCost + outputCost,
      perRequest: (inputCost + outputCost) / scenario.requestsPerMonth,
      annual: (inputCost + outputCost) * 12
    };
  };

  const addModel = (modelId: string) => {
    if (selectedModels.length < 4 && !selectedModels.includes(modelId)) {
      setSelectedModels([...selectedModels, modelId]);
    }
  };

  const removeModel = (modelId: string) => {
    setSelectedModels(selectedModels.filter(id => id !== modelId));
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Feature', ...compareModels.map(m => m.name)];
    const rows = [
      ['Provider', ...compareModels.map(m => m.provider)],
      ['Context Window', ...compareModels.map(m => m.contextWindow.toLocaleString())],
      ['Input Cost/1M', ...compareModels.map(m => `$${m.inputCostPer1M.toFixed(2)}`)],
      ['Output Cost/1M', ...compareModels.map(m => `$${m.outputCostPer1M.toFixed(2)}`)],
      ['MMLU Score', ...compareModels.map(m => m.benchmarks?.mmlu?.toFixed(1) || 'N/A')],
      ['HumanEval Score', ...compareModels.map(m => m.benchmarks?.humanEval?.toFixed(1) || 'N/A')],
      ['Released', ...compareModels.map(m => m.released || 'N/A')]
    ];

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `model-comparison-${Date.now()}.csv`;
    a.click();
  };

  // Share via URL
  const shareComparison = () => {
    const modelIds = selectedModels.join(',');
    const url = `${window.location.origin}?compare=${modelIds}`;
    navigator.clipboard.writeText(url);
    alert('Comparison link copied to clipboard!');
  };

  // Generate simple PDF (text-based)
  const exportToPDF = () => {
    const scenario = useCustomScenario ? customScenario : selectedScenario;
    const content = `MODEL COMPARISON REPORT
Generated: ${new Date().toLocaleDateString()}

Models Compared:
${compareModels.map((m, i) => `${i + 1}. ${m.name} (${m.provider})`).join('\n')}

SPECIFICATIONS:
${'='.repeat(80)}

${compareModels.map(m => `
${m.name}:
  - Context Window: ${m.contextWindow.toLocaleString()} tokens
  - Input Cost: $${m.inputCostPer1M.toFixed(2)}/1M tokens
  - Output Cost: $${m.outputCostPer1M.toFixed(2)}/1M tokens
  - MMLU: ${m.benchmarks?.mmlu?.toFixed(1) || 'N/A'}
  - HumanEval: ${m.benchmarks?.humanEval?.toFixed(1) || 'N/A'}
  - Released: ${m.released || 'N/A'}
`).join('\n')}

COST ANALYSIS (${scenario.name}):
${'='.repeat(80)}
Scenario: ${scenario.description}
- Input: ${scenario.inputTokens.toLocaleString()} tokens
- Output: ${scenario.outputTokens.toLocaleString()} tokens
- Requests/Month: ${scenario.requestsPerMonth.toLocaleString()}

${compareModels.map(m => {
  const cost = calculateScenarioCost(m, scenario);
  return `
${m.name}:
  - Monthly Cost: $${cost.monthly.toFixed(2)}
  - Per Request: $${cost.perRequest.toFixed(4)}
  - Annual Cost: $${cost.annual.toFixed(2)}`;
}).join('\n')}

Generated by TechViswa Model Compare Basic - https://techviswa.com
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `model-comparison-${Date.now()}.txt`;
    a.click();
  };

  // Get best/worst values for highlighting
  const getBest = (values: (number | undefined)[]) => {
    const validValues = values.filter((v): v is number => v !== undefined);
    return validValues.length > 0 ? Math.max(...validValues) : undefined;
  };

  const getCheapest = (values: number[]) => Math.min(...values);

  const currentScenario = useCustomScenario ? customScenario : selectedScenario;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-blue-600" />
            Model Comparison
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Comparing {compareModels.length} models side-by-side
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {compareModels.length >= 2 ? (
        <>
          {/* Benchmark Comparison Charts */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Benchmark Comparison
            </h3>

            {/* MMLU Comparison */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">MMLU Score (Academic Knowledge)</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Higher is better</span>
              </div>
              {compareModels.map(model => {
                const score = model.benchmarks?.mmlu || 0;
                const maxScore = getBest(compareModels.map(m => m.benchmarks?.mmlu));
                const isBest = score === maxScore && score > 0;
                return (
                  <div key={model.id} className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{model.name}</span>
                      <span className={`text-sm font-bold ${isBest ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'}`}>
                        {score > 0 ? score.toFixed(1) : 'N/A'}
                        {isBest && ' ⭐'}
                      </span>
                    </div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${isBest ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-blue-500 to-blue-600'} transition-all duration-500`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* HumanEval Comparison */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">HumanEval Score (Coding Ability)</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Higher is better</span>
              </div>
              {compareModels.map(model => {
                const score = model.benchmarks?.humanEval || 0;
                const maxScore = getBest(compareModels.map(m => m.benchmarks?.humanEval));
                const isBest = score === maxScore && score > 0;
                return (
                  <div key={model.id} className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{model.name}</span>
                      <span className={`text-sm font-bold ${isBest ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'}`}>
                        {score > 0 ? score.toFixed(1) : 'N/A'}
                        {isBest && ' ⭐'}
                      </span>
                    </div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${isBest ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-indigo-500 to-indigo-600'} transition-all duration-500`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cost Calculator with Scenarios */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-yellow-600" />
              Cost Analysis by Usage Scenario
            </h3>

            {/* Scenario Selection */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Select Usage Scenario
                </label>
                {savedScenarios.length > 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {savedScenarios.length} saved scenario{savedScenarios.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Default Scenarios */}
              <div className="mb-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Pre-built Scenarios:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {DEFAULT_SCENARIOS.map(scenario => (
                    <button
                      key={scenario.name}
                      onClick={() => {
                        setSelectedScenario(scenario);
                        setUseCustomScenario(false);
                      }}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        !useCustomScenario && selectedScenario.name === scenario.name
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                      }`}
                    >
                      <div className="font-semibold text-sm text-gray-900 dark:text-white">{scenario.name}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{scenario.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Saved Scenarios */}
              {savedScenarios.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Your Saved Scenarios:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {savedScenarios.map((scenario, index) => (
                      <div key={index} className="relative">
                        <button
                          onClick={() => loadSavedScenario(scenario)}
                          className={`w-full p-3 rounded-lg border-2 transition-all ${
                            useCustomScenario && customScenario.name === scenario.name &&
                            customScenario.inputTokens === scenario.inputTokens &&
                            customScenario.outputTokens === scenario.outputTokens &&
                            customScenario.requestsPerMonth === scenario.requestsPerMonth
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/30'
                              : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                          }`}
                        >
                          <div className="font-semibold text-sm text-gray-900 dark:text-white">{scenario.name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{scenario.description}</div>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Delete scenario "${scenario.name}"?`)) {
                              deleteSavedScenario(index);
                            }
                          }}
                          className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md"
                          title="Delete scenario"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Save Scenario Dialog */}
              {showSaveDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                    <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Save Scenario</h3>
                    <div className="space-y-3 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Scenario Name *
                        </label>
                        <input
                          type="text"
                          value={scenarioName}
                          onChange={(e) => setScenarioName(e.target.value)}
                          placeholder="e.g., My API Usage"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Description (optional)
                        </label>
                        <input
                          type="text"
                          value={scenarioDescription}
                          onChange={(e) => setScenarioDescription(e.target.value)}
                          placeholder="e.g., Production API usage pattern"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded p-3 text-sm">
                        <p className="text-gray-600 dark:text-gray-400">
                          <strong>Current Settings:</strong>
                        </p>
                        <ul className="mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                          <li>• Input: {customScenario.inputTokens.toLocaleString()} tokens</li>
                          <li>• Output: {customScenario.outputTokens.toLocaleString()} tokens</li>
                          <li>• Requests: {customScenario.requestsPerMonth.toLocaleString()}/month</li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={saveCurrentScenario}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                      >
                        Save Scenario
                      </button>
                      <button
                        onClick={() => {
                          setShowSaveDialog(false);
                          setScenarioName('');
                          setScenarioDescription('');
                        }}
                        className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cost Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">Model</th>
                    <th className="px-3 py-2 text-right font-semibold">Per Request</th>
                    <th className="px-3 py-2 text-right font-semibold">Monthly</th>
                    <th className="px-3 py-2 text-right font-semibold">Annual</th>
                    <th className="px-3 py-2 text-center font-semibold">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {compareModels.map(model => {
                    const cost = calculateScenarioCost(model, currentScenario);
                    const monthlyCosts = compareModels.map(m => calculateScenarioCost(m, currentScenario).monthly);
                    const cheapest = getCheapest(monthlyCosts);
                    const isCheapest = cost.monthly === cheapest;

                    return (
                      <tr key={model.id} className={`${isCheapest ? 'bg-green-50 dark:bg-green-900/20' : ''}`}>
                        <td className="px-3 py-2 font-medium">{model.name}</td>
                        <td className="px-3 py-2 text-right font-mono">${cost.perRequest.toFixed(4)}</td>
                        <td className={`px-3 py-2 text-right font-mono font-bold ${isCheapest ? 'text-green-600' : ''}`}>
                          ${cost.monthly.toFixed(2)}
                          {isCheapest && ' ⭐'}
                        </td>
                        <td className="px-3 py-2 text-right font-mono">${cost.annual.toFixed(2)}</td>
                        <td className="px-3 py-2 text-center">
                          {isCheapest ? (
                            <span className="inline-flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-4 h-4" /> Best Value
                            </span>
                          ) : cost.monthly / cheapest > 2 ? (
                            <span className="inline-flex items-center gap-1 text-red-600">
                              <AlertCircle className="w-4 h-4" /> Expensive
                            </span>
                          ) : (
                            <span className="text-gray-600">Moderate</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Comparison Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold sticky left-0 bg-gray-50 dark:bg-gray-900">Feature</th>
                    {compareModels.map(model => (
                      <th key={model.id} className="px-4 py-3 text-left font-semibold">{model.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-4 py-2 font-medium sticky left-0 bg-white dark:bg-gray-800">Provider</td>
                    {compareModels.map(model => (
                      <td key={model.id} className="px-4 py-2">{model.provider}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium sticky left-0 bg-white dark:bg-gray-800">Context Window</td>
                    {compareModels.map(model => {
                      const contexts = compareModels.map(m => m.contextWindow);
                      const largest = getBest(contexts);
                      const isLargest = model.contextWindow === largest;
                      return (
                        <td key={model.id} className={`px-4 py-2 ${isLargest ? 'font-bold text-green-600' : ''}`}>
                          {model.contextWindow.toLocaleString()} tokens
                          {isLargest && ' ⭐'}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium sticky left-0 bg-white dark:bg-gray-800">Input Cost (per 1M)</td>
                    {compareModels.map(model => {
                      const costs = compareModels.map(m => m.inputCostPer1M);
                      const cheapest = getCheapest(costs);
                      const isCheapest = model.inputCostPer1M === cheapest;
                      return (
                        <td key={model.id} className={`px-4 py-2 ${isCheapest ? 'font-bold text-green-600' : ''}`}>
                          ${model.inputCostPer1M.toFixed(2)}
                          {isCheapest && ' ⭐'}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium sticky left-0 bg-white dark:bg-gray-800">Output Cost (per 1M)</td>
                    {compareModels.map(model => {
                      const costs = compareModels.map(m => m.outputCostPer1M);
                      const cheapest = getCheapest(costs);
                      const isCheapest = model.outputCostPer1M === cheapest;
                      return (
                        <td key={model.id} className={`px-4 py-2 ${isCheapest ? 'font-bold text-green-600' : ''}`}>
                          ${model.outputCostPer1M.toFixed(2)}
                          {isCheapest && ' ⭐'}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium sticky left-0 bg-white dark:bg-gray-800">Released</td>
                    {compareModels.map(model => (
                      <td key={model.id} className="px-4 py-2">{model.released || 'N/A'}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium sticky left-0 bg-white dark:bg-gray-800">Tags</td>
                    {compareModels.map(model => (
                      <td key={model.id} className="px-4 py-2">
                        <div className="flex flex-wrap gap-1">
                          {model.tags?.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Select at least 2 models to start comparing
          </p>
        </div>
      )}
    </div>
  );
}
