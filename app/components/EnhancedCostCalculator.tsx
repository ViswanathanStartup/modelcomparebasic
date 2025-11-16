'use client';

import { useState, useMemo } from 'react';
import { LLMModel } from '../data/llm-data';
import { Calculator, X, TrendingUp, DollarSign, PieChart, BarChart3, AlertCircle } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ExportButton } from './ExportButton';

interface EnhancedCostCalculatorProps {
  models: LLMModel[];
  onClose: () => void;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export const EnhancedCostCalculator = ({ models, onClose }: EnhancedCostCalculatorProps) => {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [tokens, setTokens] = useState('100000');
  const [mode, setMode] = useState<'simple' | 'monthly' | 'budget'>('simple');
  const [monthlyConversations, setMonthlyConversations] = useState('1000');
  const [tokensPerConversation, setTokensPerConversation] = useState('500');
  const [monthlyBudget, setMonthlyBudget] = useState('100');
  const [showCharts, setShowCharts] = useState(true);

  const calculateCost = (tokenCount: number, inputCostPer1M: number, outputCostPer1M: number) => {
    const inputCost = (tokenCount / 1000000) * inputCostPer1M;
    const outputCost = (tokenCount / 1000000) * outputCostPer1M;
    return {
      input: inputCost,
      output: outputCost,
      total: inputCost + outputCost
    };
  };

  const selectedModelData = useMemo(() => {
    return models.filter(m => selectedModels.includes(m.id));
  }, [models, selectedModels]);

  const costData = useMemo(() => {
    const tokenCount = parseInt(tokens) || 0;
    const monthlyConvs = parseInt(monthlyConversations) || 0;
    const tokensPerConv = parseInt(tokensPerConversation) || 0;
    const totalMonthlyTokens = monthlyConvs * tokensPerConv;

    return selectedModelData.map(model => {
      const simpleCost = calculateCost(tokenCount, model.inputCostPer1M, model.outputCostPer1M);
      const monthlyCost = calculateCost(totalMonthlyTokens, model.inputCostPer1M, model.outputCostPer1M);

      return {
        name: model.name,
        provider: model.provider,
        inputCost: mode === 'monthly' ? monthlyCost.input : simpleCost.input,
        outputCost: mode === 'monthly' ? monthlyCost.output : simpleCost.output,
        totalCost: mode === 'monthly' ? monthlyCost.total : simpleCost.total,
        annualCost: monthlyCost.total * 12,
        perConversation: monthlyConvs > 0 ? monthlyCost.total / monthlyConvs : 0,
      };
    });
  }, [selectedModelData, tokens, monthlyConversations, tokensPerConversation, mode]);

  const pieChartData = useMemo(() => {
    return costData.map(item => ({
      name: item.name,
      value: parseFloat(item.totalCost.toFixed(4))
    }));
  }, [costData]);

  const barChartData = useMemo(() => {
    return costData.map(item => ({
      name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
      'Input Cost': parseFloat(item.inputCost.toFixed(4)),
      'Output Cost': parseFloat(item.outputCost.toFixed(4)),
    }));
  }, [costData]);

  const budgetData = useMemo(() => {
    const budget = parseFloat(monthlyBudget) || 0;
    return costData.map(item => ({
      name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name,
      'Monthly Cost': parseFloat(item.totalCost.toFixed(2)),
      'Budget': budget,
      'Remaining': Math.max(0, budget - item.totalCost),
      'Over Budget': Math.max(0, item.totalCost - budget),
    }));
  }, [costData, monthlyBudget]);

  const budgetAlerts = useMemo(() => {
    const budget = parseFloat(monthlyBudget) || 0;
    return costData.filter(item => item.totalCost > budget * 0.8);
  }, [costData, monthlyBudget]);

  const cheapestModel = useMemo(() => {
    if (costData.length === 0) return null;
    return costData.reduce((min, item) => item.totalCost < min.totalCost ? item : min);
  }, [costData]);

  const mostExpensiveModel = useMemo(() => {
    if (costData.length === 0) return null;
    return costData.reduce((max, item) => item.totalCost > max.totalCost ? item : max);
  }, [costData]);

  const toggleModel = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      setSelectedModels(selectedModels.filter(id => id !== modelId));
    } else {
      setSelectedModels([...selectedModels, modelId]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-4 sm:p-6 max-w-7xl w-full max-h-[90vh] overflow-y-auto my-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calculator className="w-7 h-7 text-blue-600" />
            Advanced Cost Calculator with Visual Analytics
          </h2>
          <div className="flex gap-2">
            {selectedModels.length > 0 && (
              <ExportButton models={selectedModelData} context="Cost Calculator" />
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setMode('simple')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === 'simple'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Simple Calculator
          </button>
          <button
            onClick={() => setMode('monthly')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === 'monthly'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Monthly Projections
          </button>
          <button
            onClick={() => setMode('budget')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === 'budget'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Budget Tracker
          </button>
          <button
            onClick={() => setShowCharts(!showCharts)}
            className="ml-auto px-4 py-2 rounded-lg font-medium transition-colors bg-purple-600 text-white hover:bg-purple-700"
          >
            {showCharts ? 'Hide Charts' : 'Show Charts'}
          </button>
        </div>

        {/* Model Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Models to Compare
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
            {models.map(model => (
              <label
                key={model.id}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                  selectedModels.includes(model.id)
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedModels.includes(model.id)}
                  onChange={() => toggleModel(model.id)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium truncate">{model.name}</span>
              </label>
            ))}
          </div>
        </div>

        {selectedModels.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Select at least one model to start calculating costs
            </p>
          </div>
        ) : (
          <>
            {/* Input Fields */}
            {mode === 'simple' && (
              <div className="mb-6 grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Number of Tokens
                  </label>
                  <input
                    type="number"
                    value={tokens}
                    onChange={(e) => setTokens(e.target.value)}
                    placeholder="100000"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Approximately {((parseInt(tokens) || 0) / 100000).toFixed(2)} books worth of text
                  </p>
                </div>
              </div>
            )}

            {mode === 'monthly' && (
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Monthly Conversations
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
                    Tokens per Conversation
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
            )}

            {mode === 'budget' && (
              <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Monthly Conversations
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
                    Tokens per Conversation
                  </label>
                  <input
                    type="number"
                    value={tokensPerConversation}
                    onChange={(e) => setTokensPerConversation(e.target.value)}
                    placeholder="500"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Monthly Budget ($)
                  </label>
                  <input
                    type="number"
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(e.target.value)}
                    placeholder="100"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Budget Alerts */}
            {mode === 'budget' && budgetAlerts.length > 0 && (
              <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-500 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                      Budget Alerts
                    </h4>
                    <ul className="space-y-1 text-sm text-amber-800 dark:text-amber-200">
                      {budgetAlerts.map(item => (
                        <li key={item.name}>
                          <strong>{item.name}</strong>: ${item.totalCost.toFixed(2)}
                          {item.totalCost > parseFloat(monthlyBudget)
                            ? ` (${((item.totalCost / parseFloat(monthlyBudget) - 1) * 100).toFixed(0)}% over budget)`
                            : ` (${((item.totalCost / parseFloat(monthlyBudget)) * 100).toFixed(0)}% of budget)`
                          }
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Summary Stats */}
            {cheapestModel && mostExpensiveModel && (
              <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-green-900 dark:text-green-100">Cheapest</h4>
                  </div>
                  <p className="text-sm text-green-800 dark:text-green-200">{cheapestModel.name}</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${cheapestModel.totalCost.toFixed(4)}
                  </p>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-red-600" />
                    <h4 className="font-semibold text-red-900 dark:text-red-100">Most Expensive</h4>
                  </div>
                  <p className="text-sm text-red-800 dark:text-red-200">{mostExpensiveModel.name}</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    ${mostExpensiveModel.totalCost.toFixed(4)}
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">Potential Savings</h4>
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-200">Switch to cheapest</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ${(mostExpensiveModel.totalCost - cheapestModel.totalCost).toFixed(4)}
                  </p>
                </div>
              </div>
            )}

            {/* Charts */}
            {showCharts && costData.length > 0 && (
              <div className="mb-6 space-y-6">
                {/* Cost Distribution Pie Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-purple-600" />
                    Cost Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPie>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieChartData.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${Number(value).toFixed(4)}`} />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>

                {/* Input vs Output Cost Bar Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Input vs Output Costs
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${Number(value).toFixed(4)}`} />
                      <Legend />
                      <Bar dataKey="Input Cost" fill="#3B82F6" />
                      <Bar dataKey="Output Cost" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Budget Tracking Chart */}
                {mode === 'budget' && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      Budget vs Actual Cost
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={budgetData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
                        <Legend />
                        <Bar dataKey="Monthly Cost" fill="#3B82F6" />
                        <Bar dataKey="Budget" fill="#10B981" />
                        <Bar dataKey="Over Budget" fill="#EF4444" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Model</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">Input Cost</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">Output Cost</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                      {mode === 'monthly' ? 'Monthly Total' : 'Total Cost'}
                    </th>
                    {mode === 'monthly' && (
                      <>
                        <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">Per Conversation</th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">Annual Cost</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {costData.map((item) => (
                    <tr key={item.name} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        {item.name}
                        <span className="block text-xs text-gray-500 dark:text-gray-400">{item.provider}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-gray-900 dark:text-white">
                        ${item.inputCost.toFixed(4)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-gray-900 dark:text-white">
                        ${item.outputCost.toFixed(4)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-green-600 dark:text-green-400">
                        ${item.totalCost.toFixed(4)}
                      </td>
                      {mode === 'monthly' && (
                        <>
                          <td className="px-4 py-3 text-right font-mono text-gray-900 dark:text-white">
                            ${item.perConversation.toFixed(4)}
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-gray-900 dark:text-white">
                            ${item.annualCost.toFixed(2)}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
