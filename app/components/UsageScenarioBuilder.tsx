'use client';

import { useState } from 'react';
import { LLMModel, llmModels } from '../data/llm-data';
import { UsageRequirements } from '../types/features';

export const UsageScenarioBuilder = () => {
  const [requirements, setRequirements] = useState<UsageRequirements>({
    monthlyBudget: 100,
    expectedTokensPerMonth: 1000000,
    requiredFeatures: [],
    minContextLength: 4096,
    preferredProviders: []
  });

  const [recommendations, setRecommendations] = useState<LLMModel[]>([]);

  const allFeatures = Array.from(new Set(llmModels.flatMap(m => m.tags || [])));
  const allProviders = Array.from(new Set(llmModels.map(m => m.provider)));

  const generateRecommendations = () => {
    const filtered = llmModels.filter(model => {
      // Check if model meets context length requirement
      if (model.contextWindow < requirements.minContextLength) {
        return false;
      }

      // Check if model has required features
      if (requirements.requiredFeatures.length > 0) {
        const modelHasAllFeatures = requirements.requiredFeatures.every(
          feature => model.tags?.includes(feature)
        );
        if (!modelHasAllFeatures) return false;
      }

      // Check if model is from preferred providers
      if (requirements.preferredProviders?.length && 
          !requirements.preferredProviders.includes(model.provider)) {
        return false;
      }

      // Calculate monthly cost
      const tokensInMillions = requirements.expectedTokensPerMonth / 1000000;
      const estimatedCost = 
        (model.inputCostPer1M * tokensInMillions * 0.4) + // Assuming 40% input
        (model.outputCostPer1M * tokensInMillions * 0.6);  // Assuming 60% output

      // Check if within budget
      if (estimatedCost > requirements.monthlyBudget) {
        return false;
      }

      return true;
    });

    // Sort by best value (using benchmarks and cost)
    const sortedRecommendations = filtered.sort((a, b) => {
      const aScore = (a.benchmarks?.mmlu || 0) + (a.benchmarks?.humanEval || 0);
      const bScore = (b.benchmarks?.mmlu || 0) + (b.benchmarks?.humanEval || 0);
      
      const aCost = a.inputCostPer1M + a.outputCostPer1M;
      const bCost = b.inputCostPer1M + b.outputCostPer1M;
      
      const aValue = aScore / aCost;
      const bValue = bScore / bCost;
      
      return bValue - aValue;
    });

    setRecommendations(sortedRecommendations.slice(0, 5));
  };

  return (
    <div className="space-y-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Usage Scenario Builder</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block font-medium mb-2">
            Monthly Budget ($)
          </label>
          <input
            type="number"
            min="0"
            className="w-full px-3 py-2 border rounded"
            value={requirements.monthlyBudget}
            onChange={(e) => setRequirements({
              ...requirements,
              monthlyBudget: Number(e.target.value)
            })}
          />
        </div>

        <div>
          <label className="block font-medium mb-2">
            Expected Monthly Tokens
          </label>
          <input
            type="number"
            min="0"
            className="w-full px-3 py-2 border rounded"
            value={requirements.expectedTokensPerMonth}
            onChange={(e) => setRequirements({
              ...requirements,
              expectedTokensPerMonth: Number(e.target.value)
            })}
          />
        </div>

        <div>
          <label className="block font-medium mb-2">
            Minimum Context Length
          </label>
          <input
            type="number"
            min="0"
            className="w-full px-3 py-2 border rounded"
            value={requirements.minContextLength}
            onChange={(e) => setRequirements({
              ...requirements,
              minContextLength: Number(e.target.value)
            })}
          />
        </div>

        <div>
          <label className="block font-medium mb-2">
            Required Features
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {allFeatures.map(feature => (
              <label key={feature} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={requirements.requiredFeatures.includes(feature)}
                  onChange={(e) => {
                    const newFeatures = e.target.checked
                      ? [...requirements.requiredFeatures, feature]
                      : requirements.requiredFeatures.filter(f => f !== feature);
                    setRequirements({
                      ...requirements,
                      requiredFeatures: newFeatures
                    });
                  }}
                />
                {feature}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-medium mb-2">
            Preferred Providers
          </label>
          <div className="grid grid-cols-2 gap-2">
            {allProviders.map(provider => (
              <label key={provider} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={requirements.preferredProviders?.includes(provider)}
                  onChange={(e) => {
                    const newProviders = e.target.checked
                      ? [...(requirements.preferredProviders || []), provider]
                      : requirements.preferredProviders?.filter(p => p !== provider);
                    setRequirements({
                      ...requirements,
                      preferredProviders: newProviders
                    });
                  }}
                />
                {provider}
              </label>
            ))}
          </div>
        </div>
      </div>

      <button
        className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={generateRecommendations}
      >
        Generate Recommendations
      </button>

      {recommendations.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Recommended Models</h3>
          <div className="space-y-4">
            {recommendations.map(model => (
              <div key={model.id} className="p-4 border rounded">
                <h4 className="font-medium">{model.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {model.description}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Provider:</span> {model.provider}
                  </div>
                  <div>
                    <span className="font-medium">Context:</span> {model.contextWindow.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Input Cost:</span> ${model.inputCostPer1M}/1M tokens
                  </div>
                  <div>
                    <span className="font-medium">Output Cost:</span> ${model.outputCostPer1M}/1M tokens
                  </div>
                </div>
                {model.tags && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {model.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};