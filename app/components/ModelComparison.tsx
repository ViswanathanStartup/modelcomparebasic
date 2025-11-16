'use client';

import { useState } from 'react';
import { LLMModel } from '../data/llm-data';

interface ModelComparisonProps {
  models: LLMModel[];
}

export const ModelComparison = ({ models }: ModelComparisonProps) => {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  const compareModels = models.filter(m => selectedModels.includes(m.id));

  const addModel = (modelId: string) => {
    if (selectedModels.length < 3 && !selectedModels.includes(modelId)) {
      setSelectedModels([...selectedModels, modelId]);
    }
  };

  const removeModel = (modelId: string) => {
    setSelectedModels(selectedModels.filter(id => id !== modelId));
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Model Comparison</h3>
      
      {/* Model Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Select Models to Compare (max 3)
        </label>
        <select
          className="w-full px-3 py-2 border rounded-md"
          onChange={(e) => addModel(e.target.value)}
          value=""
        >
          <option value="">Select a model...</option>
          {models.map(model => (
            <option key={model.id} value={model.id}>
              {model.name} ({model.provider})
            </option>
          ))}
        </select>
      </div>

      {/* Comparison Table */}
      {compareModels.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2">Feature</th>
                {compareModels.map(model => (
                  <th key={model.id} className="px-4 py-2">
                    {model.name}
                    <button
                      onClick={() => removeModel(model.id)}
                      className="ml-2 text-red-500 text-sm"
                    >
                      ×
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 font-medium">Provider</td>
                {compareModels.map(model => (
                  <td key={model.id} className="px-4 py-2">{model.provider}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Context Window</td>
                {compareModels.map(model => (
                  <td key={model.id} className="px-4 py-2">{model.contextWindow.toLocaleString()}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Input Cost (per 1M)</td>
                {compareModels.map(model => (
                  <td key={model.id} className="px-4 py-2">${model.inputCostPer1M.toFixed(2)}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Output Cost (per 1M)</td>
                {compareModels.map(model => (
                  <td key={model.id} className="px-4 py-2">${model.outputCostPer1M.toFixed(2)}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">MMLU Score</td>
                {compareModels.map(model => (
                  <td key={model.id} className="px-4 py-2">{model.benchmarks?.mmlu?.toFixed(1) || 'N/A'}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">HumanEval Score</td>
                {compareModels.map(model => (
                  <td key={model.id} className="px-4 py-2">{model.benchmarks?.humanEval?.toFixed(1) || 'N/A'}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Speed</td>
                {compareModels.map(model => (
                  <td key={model.id} className="px-4 py-2">{model.benchmarks?.speed || 'N/A'}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium">Best For</td>
                {compareModels.map(model => (
                  <td key={model.id} className="px-4 py-2">
                    <ul className="list-disc list-inside">
                      {model.bestFor?.map((use, i) => (
                        <li key={i}>{use}</li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};