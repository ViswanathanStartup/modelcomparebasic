/**
 * Enriched Models with Phase 1 Features
 * This module provides all models with code examples, use cases, and limitations
 */

import { llmModels, type LLMModel } from './llm-data';
import { generateCodeExamples, generateRealWorldUseCases, generateLimitations } from './phase1-data-generator';

/**
 * Enrich a single model with Phase 1 features
 */
export function enrichModel(model: LLMModel): LLMModel {
  return {
    ...model,
    codeExamples: generateCodeExamples(model),
    realWorldUseCases: generateRealWorldUseCases(model),
    limitations: generateLimitations(model)
  };
}

/**
 * Get all enriched models with Phase 1 features
 */
export function getEnrichedModels(): LLMModel[] {
  return llmModels.map(enrichModel);
}

/**
 * Get a single enriched model by ID
 */
export function getEnrichedModelById(id: string): LLMModel | undefined {
  const model = llmModels.find(m => m.id === id);
  return model ? enrichModel(model) : undefined;
}

/**
 * Export enriched models as default for easy import
 */
export const enrichedModels = getEnrichedModels();
