import { LLMModel } from '../data/llm-data';

/**
 * Full-text search across model fields
 */
export function searchModels(models: LLMModel[], query: string): LLMModel[] {
  if (!query) return models;

  const searchQuery = query.toLowerCase();
  return models.filter(model =>
    model.name.toLowerCase().includes(searchQuery) ||
    model.provider.toLowerCase().includes(searchQuery) ||
    model.description.toLowerCase().includes(searchQuery) ||
    model.tags?.some(tag => tag.toLowerCase().includes(searchQuery)) ||
    model.bestFor?.some(use => use.toLowerCase().includes(searchQuery)) ||
    model.keyFeatures?.some(feature => feature.toLowerCase().includes(searchQuery))
  );
}