'use client';

import { useState, useEffect } from 'react';
import { Play, Plus, X, Clock, DollarSign, Star, History, Download, Upload, Trash2, Save, AlertCircle, CheckCircle, Zap, TrendingUp, BarChart3 } from 'lucide-react';
import { LLMModel } from '../data/llm-data';
import { ModelTestResult, TestComparison, TestHistory } from '../types/playground';

interface ModelTestingPlaygroundProps {
  models: LLMModel[];
  onClose: () => void;
}

export function ModelTestingPlayground({ models, onClose }: ModelTestingPlaygroundProps) {
  const [selectedModels, setSelectedModels] = useState<LLMModel[]>([]);
  const [prompt, setPrompt] = useState('');
  const [apiKeys, setApiKeys] = useState<{ [provider: string]: string }>({});
  const [testResults, setTestResults] = useState<ModelTestResult[]>([]);
  const [isLoading, setIsLoading] = useState<{ [modelId: string]: boolean }>({});
  const [testHistory, setTestHistory] = useState<TestHistory>({ tests: [], favorites: [] });
  const [showHistory, setShowHistory] = useState(false);
  const [maxTokens, setMaxTokens] = useState(1000);
  const [temperature, setTemperature] = useState(0.7);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [currentTest, setCurrentTest] = useState<TestComparison | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Load test history from localStorage (NO API keys stored)
  useEffect(() => {
    const savedHistory = localStorage.getItem('model-test-history');
    if (savedHistory) {
      setTestHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save test history to localStorage
  const saveTestHistory = (history: TestHistory) => {
    setTestHistory(history);
    localStorage.setItem('model-test-history', JSON.stringify(history));
  };

  // Add a model to test
  const addModel = (model: LLMModel) => {
    if (!selectedModels.find(m => m.id === model.id)) {
      setSelectedModels([...selectedModels, model]);
    }
  };

  // Remove a model from test
  const removeModel = (modelId: string) => {
    setSelectedModels(selectedModels.filter(m => m.id !== modelId));
    setTestResults(testResults.filter(r => r.modelId !== modelId));
  };

  // Test a single model
  const testModel = async (model: LLMModel) => {
    const provider = model.provider.toLowerCase();
    const apiKey = apiKeys[provider];

    if (!apiKey) {
      setErrorMessage(`Please provide an API key for ${model.provider}`);
      setShowApiKeyModal(true);
      return;
    }

    if (!prompt.trim()) {
      setErrorMessage('Please enter a prompt to test');
      return;
    }

    setIsLoading({ ...isLoading, [model.id]: true });
    setErrorMessage(''); // Clear any previous errors

    try {
      const response = await fetch('/api/test-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelId: model.id,
          provider: model.provider,
          prompt,
          apiKey,
          maxTokens,
          temperature,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to test model');
      }

      const result: ModelTestResult = {
        id: `${model.id}-${Date.now()}`,
        modelId: model.id,
        modelName: model.name,
        provider: model.provider,
        prompt,
        response: data.response,
        responseTime: data.responseTime,
        tokensUsed: data.tokensUsed,
        cost: {
          input: (data.tokensUsed.input / 1000000) * model.inputCostPer1M,
          output: (data.tokensUsed.output / 1000000) * model.outputCostPer1M,
          total: ((data.tokensUsed.input / 1000000) * model.inputCostPer1M) +
                 ((data.tokensUsed.output / 1000000) * model.outputCostPer1M),
        },
        timestamp: new Date().toISOString(),
      };

      // Keep existing results and add new one
      setTestResults(prevResults => [...prevResults.filter(r => r.modelId !== model.id), result]);
    } catch (error: any) {
      // Show inline error, don't use alert
      setErrorMessage(`Error testing ${model.name}: ${error.message}`);

      // Add error result but keep other successful results
      const errorResult: ModelTestResult = {
        id: `${model.id}-${Date.now()}`,
        modelId: model.id,
        modelName: model.name,
        provider: model.provider,
        prompt,
        response: '',
        responseTime: 0,
        tokensUsed: { input: 0, output: 0, total: 0 },
        cost: { input: 0, output: 0, total: 0 },
        timestamp: new Date().toISOString(),
        error: error.message,
      };

      // Keep existing results and add error result
      setTestResults(prevResults => [...prevResults.filter(r => r.modelId !== model.id), errorResult]);
    } finally {
      setIsLoading(prev => ({ ...prev, [model.id]: false }));
    }
  };

  // Test all selected models
  const testAllModels = async () => {
    for (const model of selectedModels) {
      await testModel(model);
    }
  };

  // Save current test to history
  const saveCurrentTest = () => {
    if (testResults.length === 0) {
      setErrorMessage('No test results to save');
      return;
    }

    const test: TestComparison = {
      id: `test-${Date.now()}`,
      prompt,
      results: testResults,
      createdAt: new Date().toISOString(),
    };

    const newHistory = {
      ...testHistory,
      tests: [test, ...testHistory.tests],
    };

    saveTestHistory(newHistory);
    setCurrentTest(test);

    // Show success message
    setErrorMessage('');
    setSuccessMessage('Test saved to history successfully!');

    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Load a test from history
  const loadTest = (test: TestComparison) => {
    setPrompt(test.prompt);
    setTestResults(test.results);
    setCurrentTest(test);

    // Load the models used in this test
    const modelIds = test.results.map(r => r.modelId);
    const modelsToLoad = models.filter(m => modelIds.includes(m.id));
    setSelectedModels(modelsToLoad);

    setShowHistory(false);
  };

  // Delete a test from history
  const deleteTest = (testId: string) => {
    const newHistory = {
      ...testHistory,
      tests: testHistory.tests.filter(t => t.id !== testId),
      favorites: testHistory.favorites.filter(id => id !== testId),
    };
    saveTestHistory(newHistory);
  };

  // Update quality score for a result
  const updateQualityScore = (resultId: string, score: number, notes?: string) => {
    const updatedResults = testResults.map(r =>
      r.id === resultId ? { ...r, qualityScore: score, qualityNotes: notes } : r
    );
    setTestResults(updatedResults);

    // Update in current test if it exists
    if (currentTest) {
      const updatedTest = {
        ...currentTest,
        results: updatedResults,
      };

      const newHistory = {
        ...testHistory,
        tests: testHistory.tests.map(t => t.id === currentTest.id ? updatedTest : t),
      };
      saveTestHistory(newHistory);
      setCurrentTest(updatedTest);
    }
  };

  // Export test results
  const exportResults = () => {
    const data = {
      prompt,
      results: testResults,
      timestamp: new Date().toISOString(),
      settings: { maxTokens, temperature },
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `model-test-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get fastest model
  const fastestModel = testResults.length > 0
    ? testResults.reduce((prev, curr) =>
        !curr.error && curr.responseTime < prev.responseTime ? curr : prev
      )
    : null;

  // Get cheapest model
  const cheapestModel = testResults.length > 0
    ? testResults.reduce((prev, curr) =>
        !curr.error && curr.cost.total < prev.cost.total ? curr : prev
      )
    : null;

  // Get highest rated model
  const highestRated = testResults.length > 0
    ? testResults.reduce((prev, curr) =>
        !curr.error && (curr.qualityScore || 0) > (prev.qualityScore || 0) ? curr : prev
      )
    : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-7xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Zap className="w-7 h-7 text-purple-600" />
                Model Performance Testing Playground
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Test models live with your API keys • Compare responses side-by-side • Track performance metrics
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowApiKeyModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              API Keys
            </button>
            <button
              onClick={() => setShowHistory(true)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition-colors flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              History ({testHistory.tests.length})
            </button>
            <button
              onClick={saveCurrentTest}
              disabled={testResults.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Save Test
            </button>
            <button
              onClick={exportResults}
              disabled={testResults.length === 0}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Security Reminder Banner */}
          {Object.keys(apiKeys).length === 0 && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-1">
                    🔑 API Keys Required
                  </h4>
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    Click the <strong>"API Keys"</strong> button above to enter your provider API keys.
                    Remember: your keys are never stored and must be entered each session for your security.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Model Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Select Models to Test (up to 4)
            </label>
            <div className="mb-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-xs text-green-800 dark:text-green-200">
                <strong>✓ Live API Testing Supported:</strong> OpenAI, Anthropic, Google, Meta, Mistral, Cohere, xAI, and DeepSeek<br/>
                <span className="text-green-700 dark:text-green-300">Covers 71 out of 150 models (~47% coverage)</span>
              </p>
            </div>
            <select
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              onChange={(e) => {
                const model = models.find(m => m.id === e.target.value);
                if (model) addModel(model);
                e.target.value = '';
              }}
              value=""
              disabled={selectedModels.length >= 4}
            >
              <option value="">Add a model...</option>
              {models
                .filter(m => !selectedModels.find(sm => sm.id === m.id))
                .map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name} ({model.provider})
                  </option>
                ))}
            </select>

            {/* Selected Models Pills */}
            {selectedModels.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedModels.map(model => (
                  <div
                    key={model.id}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-lg"
                  >
                    <span className="font-medium">{model.name}</span>
                    <span className="text-xs opacity-75">({model.provider})</span>
                    <button
                      onClick={() => removeModel(model.id)}
                      className="hover:text-red-600 dark:hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Test Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Max Tokens
              </label>
              <input
                type="number"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value) || 1000)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                min="1"
                max="4000"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Temperature ({temperature})
              </label>
              <input
                type="range"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full"
                min="0"
                max="2"
                step="0.1"
              />
            </div>
          </div>

          {/* Success Message Display */}
          {successMessage && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-green-900 dark:text-green-100 mb-1">
                    Success
                  </h4>
                  <p className="text-xs text-green-800 dark:text-green-200">
                    {successMessage}
                  </p>
                </div>
                <button
                  onClick={() => setSuccessMessage('')}
                  className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Error Message Display */}
          {errorMessage && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-red-900 dark:text-red-100 mb-1">
                    Error
                  </h4>
                  <p className="text-xs text-red-800 dark:text-red-200">
                    {errorMessage}
                  </p>
                </div>
                <button
                  onClick={() => setErrorMessage('')}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Prompt Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Test Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 min-h-[120px]"
            />
          </div>

          {/* Test Button */}
          <button
            onClick={testAllModels}
            disabled={selectedModels.length === 0 || !prompt.trim() || Object.values(isLoading).some(Boolean)}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
          >
            {Object.values(isLoading).some(Boolean) ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Testing Models...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Test All Models
              </>
            )}
          </button>

          {/* Quick Stats */}
          {testResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Fastest</p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {fastestModel && !fastestModel.error ? `${fastestModel.modelName} (${fastestModel.responseTime}ms)` : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Cheapest</p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {cheapestModel && !cheapestModel.error ? `${cheapestModel.modelName} ($${cheapestModel.cost.total.toFixed(4)})` : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Highest Rated</p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {highestRated && !highestRated.error && highestRated.qualityScore ?
                      `${highestRated.modelName} (${highestRated.qualityScore}/5)` : 'Not rated yet'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Test Results - Side by Side */}
          {testResults.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-purple-600" />
                Test Results
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {testResults.map(result => (
                  <div
                    key={result.id}
                    className={`p-4 rounded-lg border-2 ${
                      result.error
                        ? 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                        : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                    }`}
                  >
                    {/* Model Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                          {result.modelName}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{result.provider}</p>
                      </div>
                      {result.error && (
                        <span className="text-xs px-2 py-1 bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200 rounded">
                          Error
                        </span>
                      )}
                    </div>

                    {/* Metrics */}
                    {!result.error && (
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/30 rounded">
                          <Clock className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                          <p className="text-xs text-gray-600 dark:text-gray-400">Time</p>
                          <p className="font-bold text-sm text-gray-900 dark:text-white">{result.responseTime}ms</p>
                        </div>
                        <div className="text-center p-2 bg-green-50 dark:bg-green-900/30 rounded">
                          <DollarSign className="w-4 h-4 mx-auto mb-1 text-green-600" />
                          <p className="text-xs text-gray-600 dark:text-gray-400">Cost</p>
                          <p className="font-bold text-sm text-gray-900 dark:text-white">${result.cost.total.toFixed(4)}</p>
                        </div>
                        <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/30 rounded">
                          <TrendingUp className="w-4 h-4 mx-auto mb-1 text-purple-600" />
                          <p className="text-xs text-gray-600 dark:text-gray-400">Tokens</p>
                          <p className="font-bold text-sm text-gray-900 dark:text-white">{result.tokensUsed.total}</p>
                        </div>
                      </div>
                    )}

                    {/* Response */}
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        {result.error ? 'Error Information:' : 'Response:'}
                      </p>
                      <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded text-sm text-gray-900 dark:text-white max-h-60 overflow-y-auto">
                        {result.error ? (
                          <div>
                            <p className="text-red-600 dark:text-red-400 mb-2 whitespace-pre-wrap">{result.error}</p>
                            {/* Show API info for unsupported providers */}
                            {result.error.includes('not yet supported') && (() => {
                              const model = models.find(m => m.id === result.modelId);
                              if (model?.apiInfo) {
                                return (
                                  <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-700">
                                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2">API Information:</p>
                                    <p className="text-xs text-gray-700 dark:text-gray-300">
                                      <strong>Endpoint:</strong> {model.apiInfo.endpoint}
                                    </p>
                                    {model.apiInfo.documentation && (
                                      <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                                        <strong>Docs:</strong>{' '}
                                        <a
                                          href={model.apiInfo.documentation}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 dark:text-blue-400 hover:underline"
                                        >
                                          {model.apiInfo.documentation}
                                        </a>
                                      </p>
                                    )}
                                  </div>
                                );
                              }
                              return null;
                            })()}
                          </div>
                        ) : (
                          result.response || 'No response'
                        )}
                      </div>
                    </div>

                    {/* Quality Rating */}
                    {!result.error && (
                      <div>
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Rate Quality:</p>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(score => (
                            <button
                              key={score}
                              onClick={() => updateQualityScore(result.id, score)}
                              className="transition-colors"
                            >
                              <Star
                                className={`w-6 h-6 ${
                                  (result.qualityScore || 0) >= score
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* API Keys Modal */}
        {showApiKeyModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Enter API Keys</h3>
                <button onClick={() => setShowApiKeyModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Privacy & Security Notice */}
              <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-300 dark:border-green-700 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-green-900 dark:text-green-100 mb-1">
                      🔒 Your Privacy & Security Matters
                    </h4>
                    <p className="text-xs text-green-800 dark:text-green-200 leading-relaxed">
                      We take your security seriously. Your API keys are <strong>NEVER stored</strong> anywhere - not in cookies, not in localStorage, not on our servers.
                      You must enter them each time you want to test. API requests go <strong>directly from your browser to the provider</strong> (OpenAI, Anthropic, Google, Meta, Mistral, Cohere, xAI, DeepSeek).
                      We never see or touch your keys.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Enter API keys for the providers of your selected models. Keys are only kept in memory during this session and cleared when you close the playground.
              </p>

              <div className="space-y-4">
                {(() => {
                  // Get unique providers from selected models
                  const uniqueProviders = Array.from(new Set(selectedModels.map(m => m.provider)));

                  if (uniqueProviders.length === 0) {
                    return (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        Please select models first to see required API keys
                      </div>
                    );
                  }

                  return uniqueProviders.map(provider => (
                    <div key={provider}>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        {provider} API Key
                        <span className="ml-2 text-xs text-gray-500">
                          (for {selectedModels.filter(m => m.provider === provider).map(m => m.name).join(', ')})
                        </span>
                      </label>
                      <input
                        type="password"
                        value={apiKeys[provider.toLowerCase()] || ''}
                        onChange={(e) => setApiKeys({ ...apiKeys, [provider.toLowerCase()]: e.target.value })}
                        placeholder={`Paste ${provider} API key here`}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  ));
                })()}
              </div>

              <button
                onClick={() => setShowApiKeyModal(false)}
                className="w-full mt-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* History Modal */}
        {showHistory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Test History</h3>
                <button onClick={() => setShowHistory(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {testHistory.tests.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">No test history yet</p>
              ) : (
                <div className="space-y-4">
                  {testHistory.tests.map(test => (
                    <div
                      key={test.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {test.prompt.substring(0, 100)}{test.prompt.length > 100 ? '...' : ''}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {new Date(test.createdAt).toLocaleString()} • {test.results.length} models tested
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => loadTest(test)}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => deleteTest(test.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
