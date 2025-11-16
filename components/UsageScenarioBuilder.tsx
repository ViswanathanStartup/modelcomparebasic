'use client';

import { type LLMModel } from '../app/data/llm-data';
import { 
  Brain, 
  Code, 
  FileText, 
  MessageSquare, 
  Database,
  Search,
  Sparkles,
  Lightbulb,
  AlertCircle
} from 'lucide-react';

interface Props {
  model: LLMModel | null;  // Make it explicit that model can be null
  onClose?: () => void;
}

interface UseCaseAnalysis {
  id: string;
  name: string;
  icon: typeof MessageSquare;
  rating: 'excellent' | 'good' | 'limited' | 'not-recommended';
  reason: string;
}

const CONTEXT_TIERS = {
  small: 8192,
  medium: 32768,
  large: 100000
};

const COST_TIERS = {
  low: 2.0,
  medium: 10.0,
  high: 30.0
};

export function UsageScenarioBuilder({ model }: Props) {
  // Guard against undefined model
  if (!model) {
    return (
      <div className="p-6 text-center text-gray-600 dark:text-gray-400">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Please select a model to analyze its capabilities.</p>
      </div>
    );
  }

  const analyzeModelCapabilities = (): UseCaseAnalysis[] => {
    const avgCost = (model.inputCostPer1M + model.outputCostPer1M) / 2;
    const modelFeatures = model.keyFeatures || [];
    const modelBestFor = model.bestFor || [];
    
    const useCases: UseCaseAnalysis[] = [
      {
        id: 'chat',
        name: 'Conversational AI',
        icon: MessageSquare,
        rating: 'limited',
        reason: 'Basic conversational capabilities'
      },
      {
        id: 'coding',
        name: 'Code Generation',
        icon: Code,
        rating: 'limited',
        reason: 'Basic code generation support'
      },
      {
        id: 'writing',
        name: 'Content Creation',
        icon: FileText,
        rating: 'limited',
        reason: 'Basic content generation capabilities'
      },
      {
        id: 'analysis',
        name: 'Data Analysis',
        icon: Database,
        rating: 'limited',
        reason: 'Basic analytical capabilities'
      },
      {
        id: 'creative',
        name: 'Creative Tasks',
        icon: Sparkles,
        rating: 'limited',
        reason: 'Basic creative capabilities'
      },
      {
        id: 'reasoning',
        name: 'Complex Reasoning',
        icon: Brain,
        rating: 'limited',
        reason: 'Basic reasoning capabilities'
      },
      {
        id: 'research',
        name: 'Research & Analysis',
        icon: Search,
        rating: 'limited',
        reason: 'Basic research capabilities'
      },
      {
        id: 'specialized',
        name: 'Specialized Tasks',
        icon: Lightbulb,
        rating: 'limited',
        reason: 'Limited specialized capabilities'
      }
    ];

    return useCases.map(useCase => {
      // Analyze based on model features and best-for tags
      const relevantFeatures = modelFeatures.filter(f => 
        f.toLowerCase().includes(useCase.id) ||
        useCase.name.toLowerCase().split(' ').some(word => 
          f.toLowerCase().includes(word)
        )
      );

      const relevantBestFor = modelBestFor.filter(bf => 
        bf.toLowerCase().includes(useCase.id) ||
        useCase.name.toLowerCase().split(' ').some(word => 
          bf.toLowerCase().includes(word)
        )
      );

      // Analyze context window requirements
      const hasLargeContext = model.contextWindow >= CONTEXT_TIERS.medium;
      const hasHugeContext = model.contextWindow >= CONTEXT_TIERS.large;

      // Analyze cost efficiency
      const isCostEffective = avgCost <= COST_TIERS.medium;
      const isPremium = avgCost >= COST_TIERS.high;

      // Quality indicators
      const hasHighMMLU = model.benchmarks?.mmlu ? model.benchmarks.mmlu >= 80 : false;
      const hasHighHumanEval = model.benchmarks?.humanEval ? model.benchmarks.humanEval >= 80 : false;

      // Determine rating and reason based on use case
      switch (useCase.id) {
        case 'chat':
          if (relevantBestFor.length > 0 && isCostEffective) {
            return {
              ...useCase,
              rating: 'excellent',
              reason: 'Optimized for chat with good cost efficiency'
            };
          } else if (modelFeatures.some(f => f.toLowerCase().includes('chat'))) {
            return {
              ...useCase,
              rating: 'good',
              reason: 'Capable of chat interactions'
            };
          }
          break;

        case 'coding':
          if (hasHighHumanEval && relevantBestFor.length > 0) {
            return {
              ...useCase,
              rating: 'excellent',
              reason: 'High code generation performance with proven capabilities'
            };
          } else if (relevantFeatures.length > 0) {
            return {
              ...useCase,
              rating: 'good',
              reason: 'Suitable for code-related tasks'
            };
          }
          break;

        case 'writing':
          if (hasLargeContext && relevantBestFor.length > 0) {
            return {
              ...useCase,
              rating: 'excellent',
              reason: 'Excellent for long-form content with large context window'
            };
          } else if (hasLargeContext || relevantFeatures.length > 0) {
            return {
              ...useCase,
              rating: 'good',
              reason: 'Good for content creation tasks'
            };
          }
          break;

        case 'analysis':
          if (hasHighMMLU && hasLargeContext) {
            return {
              ...useCase,
              rating: 'excellent',
              reason: 'High analytical capabilities with large context support'
            };
          } else if (hasHighMMLU || relevantFeatures.length > 0) {
            return {
              ...useCase,
              rating: 'good',
              reason: 'Good analytical capabilities'
            };
          }
          break;

        case 'creative':
          if (relevantBestFor.length > 0 && !isPremium) {
            return {
              ...useCase,
              rating: 'excellent',
              reason: 'Optimized for creative tasks with reasonable cost'
            };
          } else if (relevantFeatures.length > 0) {
            return {
              ...useCase,
              rating: 'good',
              reason: 'Capable of creative tasks'
            };
          }
          break;

        case 'reasoning':
          if (hasHighMMLU && relevantBestFor.length > 0) {
            return {
              ...useCase,
              rating: 'excellent',
              reason: 'Excellent reasoning capabilities with high accuracy'
            };
          } else if (hasHighMMLU) {
            return {
              ...useCase,
              rating: 'good',
              reason: 'Good reasoning capabilities'
            };
          }
          break;

        case 'research':
          if (hasHugeContext && hasHighMMLU) {
            return {
              ...useCase,
              rating: 'excellent',
              reason: 'Perfect for research with huge context window'
            };
          } else if (hasLargeContext) {
            return {
              ...useCase,
              rating: 'good',
              reason: 'Suitable for research tasks'
            };
          }
          break;

        case 'specialized':
          if (relevantBestFor.length > 0 && (hasHighMMLU || hasHighHumanEval)) {
            return {
              ...useCase,
              rating: 'excellent',
              reason: 'Optimized for specialized tasks with high performance'
            };
          } else if (relevantFeatures.length > 0) {
            return {
              ...useCase,
              rating: 'good',
              reason: 'Capable of specialized tasks'
            };
          }
          break;
      }

      // If no specific conditions met, return not-recommended for high-cost models
      if (isPremium) {
        return {
          ...useCase,
          rating: 'not-recommended',
          reason: 'Cost inefficient for this use case'
        };
      }

      return useCase;
    });
  };

  const useCases = analyzeModelCapabilities();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">
          Use Case Analysis for {model.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Based on model capabilities, context window size, cost, and performance metrics
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {useCases.map(useCase => {
          const Icon = useCase.icon;
          return (
            <div
              key={useCase.id}
              className={`p-4 rounded-lg border transition-all
                ${useCase.rating === 'excellent'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : useCase.rating === 'good'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : useCase.rating === 'limited'
                  ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                  : 'border-red-300 bg-red-50 dark:bg-red-900/20'
                }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg
                  ${useCase.rating === 'excellent'
                    ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200'
                    : useCase.rating === 'good'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200'
                    : useCase.rating === 'limited'
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200'
                    : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                    {useCase.name}
                    {useCase.rating === 'excellent' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Recommended
                      </span>
                    )}
                  </h4>
                  <div className="flex items-center gap-1 mt-1 text-sm">
                    <div className={`w-2 h-2 rounded-full
                      ${useCase.rating === 'excellent'
                        ? 'bg-green-500'
                        : useCase.rating === 'good'
                        ? 'bg-blue-500'
                        : useCase.rating === 'limited'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                      }`}
                    />
                    <span className="capitalize">{useCase.rating}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {useCase.reason}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
        <AlertCircle className="w-4 h-4" />
        Analysis based on model specifications, benchmarks, and documented capabilities
      </div>
    </div>
  );
}