import { LLMModel } from '../data/llm-data';

/**
 * Find models similar to the selected model based on capabilities and metrics
 */
export function findSimilarModels(selectedModel: LLMModel, allModels: LLMModel[]): LLMModel[] {
  return allModels.filter(model => 
    model.id !== selectedModel.id && // Not the same model
    // Similar capabilities
    model.tags?.some(tag => selectedModel.tags?.includes(tag)) &&
    // Similar context window size (within 20%)
    Math.abs(model.contextWindow - selectedModel.contextWindow) <= selectedModel.contextWindow * 0.2
  ).slice(0, 5); // Return top 5
}

/**
 * Find models that are cheaper but have similar capabilities
 */
export function findCheaperAlternatives(selectedModel: LLMModel, allModels: LLMModel[]): LLMModel[] {
  const modelPrice = selectedModel.inputCostPer1M;
  if (!modelPrice) return [];

  return allModels.filter(model =>
    model.id !== selectedModel.id &&
    model.inputCostPer1M < modelPrice &&
    // Has at least some similar capabilities
    model.tags?.some(tag => selectedModel.tags?.includes(tag))
  ).sort((a, b) => b.inputCostPer1M - a.inputCostPer1M) // Sort by price descending
  .slice(0, 5); // Return top 5
}

/**
 * Find models with better benchmark performance
 */
export function findBetterPerformance(selectedModel: LLMModel, allModels: LLMModel[]): LLMModel[] {
  const selectedMMLU = selectedModel.benchmarks?.mmlu || 0;
  const selectedHumanEval = selectedModel.benchmarks?.humanEval || 0;

  return allModels.filter(model =>
    model.id !== selectedModel.id &&
    // Better performance on at least one benchmark
    ((model.benchmarks?.mmlu && model.benchmarks.mmlu > selectedMMLU) ||
     (model.benchmarks?.humanEval && model.benchmarks.humanEval > selectedHumanEval))
  ).sort((a, b) => {
    const aScore = (a.benchmarks?.mmlu || 0) + (a.benchmarks?.humanEval || 0);
    const bScore = (b.benchmarks?.mmlu || 0) + (b.benchmarks?.humanEval || 0);
    return bScore - aScore;
  }).slice(0, 5); // Return top 5
}