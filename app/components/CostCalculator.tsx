'use client';

import { useState } from 'react';
import { LLMModel } from '../data/llm-data';

interface CostCalculatorProps {
  model: LLMModel;
}

export const CostCalculator = ({ model }: CostCalculatorProps) => {
  const [inputTokens, setInputTokens] = useState<number>(0);
  const [outputTokens, setOutputTokens] = useState<number>(0);
  const [requestsPerDay, setRequestsPerDay] = useState<number>(0);

  const calculateMonthlyCost = () => {
    const monthlyInputTokens = inputTokens * requestsPerDay * 30;
    const monthlyOutputTokens = outputTokens * requestsPerDay * 30;
    
    const inputCost = (monthlyInputTokens / 1000000) * model.inputCostPer1M;
    const outputCost = (monthlyOutputTokens / 1000000) * model.outputCostPer1M;
    
    return (inputCost + outputCost).toFixed(2);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Cost Calculator</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="inputTokens" className="block text-sm font-medium mb-1">
            Average Input Tokens per Request
          </label>
          <input
            type="number"
            id="inputTokens"
            min="0"
            value={inputTokens}
            onChange={(e) => setInputTokens(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="outputTokens" className="block text-sm font-medium mb-1">
            Average Output Tokens per Request
          </label>
          <input
            type="number"
            id="outputTokens"
            min="0"
            value={outputTokens}
            onChange={(e) => setOutputTokens(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="requestsPerDay" className="block text-sm font-medium mb-1">
            Requests per Day
          </label>
          <input
            type="number"
            id="requestsPerDay"
            min="0"
            value={requestsPerDay}
            onChange={(e) => setRequestsPerDay(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="pt-4 border-t">
          <p className="text-lg font-semibold">
            Estimated Monthly Cost: ${calculateMonthlyCost()}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Based on {model.inputCostPer1M.toFixed(2)}$/1M input tokens and {model.outputCostPer1M.toFixed(2)}$/1M output tokens
          </p>
        </div>
      </div>
    </div>
  );
};