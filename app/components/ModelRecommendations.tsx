import { LLMModel } from '../data/llm-data';

interface ModelRecommendationsProps {
  recommendations: {
    similar: LLMModel[];
    cheaper: LLMModel[];
    better: LLMModel[];
  };
  onModelSelect: (model: LLMModel) => void;
}

export default function ModelRecommendations({ recommendations, onModelSelect }: ModelRecommendationsProps) {
  if (!recommendations.similar.length && !recommendations.cheaper.length && !recommendations.better.length) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Smart Recommendations</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.similar.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-lg">Similar Models</h3>
            <div className="space-y-2">
              {recommendations.similar.map(model => (
                <button
                  key={model.id}
                  onClick={() => onModelSelect(model)}
                  className="w-full p-3 text-left rounded-lg border hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="font-medium">{model.name}</div>
                  <div className="text-sm text-gray-600">{model.provider}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Context: {model.contextWindow.toLocaleString()} tokens
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {recommendations.cheaper.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-lg">Cheaper Alternatives</h3>
            <div className="space-y-2">
              {recommendations.cheaper.map(model => (
                <button
                  key={model.id}
                  onClick={() => onModelSelect(model)}
                  className="w-full p-3 text-left rounded-lg border hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="font-medium">{model.name}</div>
                  <div className="text-sm text-gray-600">
                    ${model.inputCostPer1M.toFixed(2)}/1M tokens
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {model.benchmarks?.mmlu && `MMLU: ${model.benchmarks.mmlu}%`}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {recommendations.better.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-lg">Better Performance</h3>
            <div className="space-y-2">
              {recommendations.better.map(model => (
                <button
                  key={model.id}
                  onClick={() => onModelSelect(model)}
                  className="w-full p-3 text-left rounded-lg border hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="font-medium">{model.name}</div>
                  <div className="text-sm text-gray-600">
                    MMLU: {model.benchmarks?.mmlu}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    ${model.inputCostPer1M.toFixed(2)}/1M tokens
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}