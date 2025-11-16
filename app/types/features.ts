export interface FilterOptions {
  priceRange: {
    min: number;
    max: number;
  };
  contextWindow: {
    min: number;
    max: number;
  };
  providers: string[];
  capabilities: string[];
  releaseYear: number | null;
}

export interface UsageRequirements {
  monthlyBudget: number;
  expectedTokensPerMonth: number;
  requiredFeatures: string[];
  minContextLength: number;
  preferredProviders?: string[];
}

export interface CodeTemplate {
  language: string;
  framework?: string;
  code: string;
  description: string;
}

export interface PriceHistoryEntry {
  date: string;
  inputCost: number;
  outputCost: number;
}

export interface BenchmarkData {
  modelId: string;
  mmlu?: number;
  humanEval?: number;
  speed?: 'fast' | 'medium' | 'slow';
  costPerformanceRatio?: number;
}