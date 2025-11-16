'use client';

import { useState, useMemo } from 'react';
import { encode } from 'gpt-tokenizer';
import { LLMModel } from '../data/llm-data';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

interface EnhancedTokenCounterProps {
  model?: LLMModel;
  onTokensCalculated?: (tokens: number, cost: number) => void;
}

export const EnhancedTokenCounter = ({ model, onTokensCalculated }: EnhancedTokenCounterProps) => {
  const [systemMessage, setSystemMessage] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [assistantMessage, setAssistantMessage] = useState('');
  const [showBreakdown, setShowBreakdown] = useState(true);

  // Calculate tokens using proper tokenizer
  const tokenCounts = useMemo(() => {
    const systemTokens = systemMessage ? encode(systemMessage).length : 0;
    const userTokens = userMessage ? encode(userMessage).length : 0;
    const assistantTokens = assistantMessage ? encode(assistantMessage).length : 0;

    const totalInput = systemTokens + userTokens;
    const totalOutput = assistantTokens;
    const totalTokens = totalInput + totalOutput;

    return {
      systemTokens,
      userTokens,
      assistantTokens,
      totalInput,
      totalOutput,
      totalTokens,
    };
  }, [systemMessage, userMessage, assistantMessage]);

  // Calculate context window usage
  const contextUsage = useMemo(() => {
    if (!model) return null;
    const percentage = (tokenCounts.totalTokens / model.contextWindow) * 100;
    return {
      percentage: percentage.toFixed(2),
      remaining: model.contextWindow - tokenCounts.totalTokens,
      status: percentage > 90 ? 'danger' : percentage > 70 ? 'warning' : 'safe'
    };
  }, [tokenCounts.totalTokens, model]);

  // Calculate costs
  const costs = useMemo(() => {
    if (!model) return null;
    const inputCost = (tokenCounts.totalInput / 1000000) * model.inputCostPer1M;
    const outputCost = (tokenCounts.totalOutput / 1000000) * model.outputCostPer1M;
    const totalCost = inputCost + outputCost;

    return {
      inputCost: inputCost.toFixed(6),
      outputCost: outputCost.toFixed(6),
      totalCost: totalCost.toFixed(6),
      totalCostFormatted: totalCost < 0.01 ? `$${(totalCost * 1000).toFixed(3)}` : `$${totalCost.toFixed(4)}`
    };
  }, [tokenCounts, model]);

  // Notify parent component
  useMemo(() => {
    if (onTokensCalculated && costs) {
      onTokensCalculated(tokenCounts.totalTokens, parseFloat(costs.totalCost));
    }
  }, [tokenCounts.totalTokens, costs, onTokensCalculated]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'danger': return 'text-red-600 dark:text-red-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-green-600 dark:text-green-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'danger': return <AlertCircle className="w-5 h-5" />;
      case 'warning': return <Info className="w-5 h-5" />;
      default: return <CheckCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Enhanced Token Counter</h3>
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
        >
          {showBreakdown ? 'Hide' : 'Show'} Breakdown
        </button>
      </div>

      {model && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm">
            <span className="font-medium">Selected Model:</span> {model.name} ({model.provider})
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Context Window: {model.contextWindow.toLocaleString()} tokens
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="system" className="block text-sm font-medium mb-2">
            System Message (Instructions)
          </label>
          <textarea
            id="system"
            rows={3}
            value={systemMessage}
            onChange={(e) => setSystemMessage(e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
            placeholder="You are a helpful assistant..."
          />
          {systemMessage && (
            <p className="text-xs text-gray-500 mt-1">{tokenCounts.systemTokens} tokens</p>
          )}
        </div>

        <div>
          <label htmlFor="user" className="block text-sm font-medium mb-2">
            User Message (Your Input)
          </label>
          <textarea
            id="user"
            rows={4}
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your prompt or question here..."
          />
          {userMessage && (
            <p className="text-xs text-gray-500 mt-1">{tokenCounts.userTokens} tokens</p>
          )}
        </div>

        <div>
          <label htmlFor="assistant" className="block text-sm font-medium mb-2">
            Expected Assistant Response (Optional)
          </label>
          <textarea
            id="assistant"
            rows={4}
            value={assistantMessage}
            onChange={(e) => setAssistantMessage(e.target.value)}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
            placeholder="Paste expected response or estimate length..."
          />
          {assistantMessage && (
            <p className="text-xs text-gray-500 mt-1">{tokenCounts.assistantTokens} tokens</p>
          )}
        </div>
      </div>

      {/* Token Summary */}
      <div className="pt-6 border-t dark:border-gray-700 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Input Tokens</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {tokenCounts.totalInput.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Output Tokens</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {tokenCounts.totalOutput.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Tokens</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {tokenCounts.totalTokens.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Token Breakdown */}
        {showBreakdown && tokenCounts.totalTokens > 0 && (
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-2">
            <h4 className="font-medium text-sm mb-3">Token Breakdown</h4>
            {tokenCounts.systemTokens > 0 && (
              <div className="flex justify-between text-sm">
                <span>System Message:</span>
                <span className="font-medium">{tokenCounts.systemTokens} tokens</span>
              </div>
            )}
            {tokenCounts.userTokens > 0 && (
              <div className="flex justify-between text-sm">
                <span>User Message:</span>
                <span className="font-medium">{tokenCounts.userTokens} tokens</span>
              </div>
            )}
            {tokenCounts.assistantTokens > 0 && (
              <div className="flex justify-between text-sm">
                <span>Assistant Response:</span>
                <span className="font-medium">{tokenCounts.assistantTokens} tokens</span>
              </div>
            )}
          </div>
        )}

        {/* Context Window Usage */}
        {model && contextUsage && tokenCounts.totalTokens > 0 && (
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm">Context Window Usage</h4>
              <div className={`flex items-center gap-2 ${getStatusColor(contextUsage.status)}`}>
                {getStatusIcon(contextUsage.status)}
                <span className="font-medium">{contextUsage.percentage}%</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mb-2">
              <div
                className={`h-2.5 rounded-full transition-all ${
                  contextUsage.status === 'danger'
                    ? 'bg-red-600'
                    : contextUsage.status === 'warning'
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(parseFloat(contextUsage.percentage), 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {contextUsage.remaining.toLocaleString()} tokens remaining of {model.contextWindow.toLocaleString()}
            </p>
            {contextUsage.status === 'danger' && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                Warning: Approaching context limit! Consider reducing message length.
              </p>
            )}
          </div>
        )}

        {/* Cost Estimation */}
        {model && costs && tokenCounts.totalTokens > 0 && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="font-medium text-sm mb-3">Cost Estimation</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Input Cost ({tokenCounts.totalInput} tokens):</span>
                <span className="font-medium">${costs.inputCost}</span>
              </div>
              <div className="flex justify-between">
                <span>Output Cost ({tokenCounts.totalOutput} tokens):</span>
                <span className="font-medium">${costs.outputCost}</span>
              </div>
              <div className="flex justify-between pt-2 border-t dark:border-gray-600 text-base font-semibold">
                <span>Total Cost per Request:</span>
                <span className="text-green-600 dark:text-green-400">{costs.totalCostFormatted}</span>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
              Based on ${model.inputCostPer1M.toFixed(2)}/1M input • ${model.outputCostPer1M.toFixed(2)}/1M output
            </p>
          </div>
        )}

        {tokenCounts.totalTokens === 0 && (
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center text-sm text-gray-500">
            Enter some text above to see token counts and cost estimates
          </div>
        )}
      </div>

      <div className="pt-4 border-t dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Note: Using OpenAI tokenizer (GPT-3.5/4). Token counts are accurate for OpenAI models and approximate for others.
        </p>
      </div>
    </div>
  );
};
