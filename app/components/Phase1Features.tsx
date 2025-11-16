'use client';

import { useState } from 'react';
import type { CodeExample, RealWorldUseCase, ModelLimitations } from '../data/llm-data';
import { Code, Copy, CheckCircle, BookOpen, AlertTriangle, Lightbulb, TrendingUp, Building2, Target, Wrench, ChevronDown, ChevronUp } from 'lucide-react';

interface CodeExamplesSectionProps {
  examples: CodeExample[];
}

export function CodeExamplesSection({ examples }: CodeExamplesSectionProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'javascript' | 'curl'>('python');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const languageExamples = examples.filter(ex => ex.language === selectedLanguage);

  const copyToClipboard = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="mt-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 rounded-lg hover:from-blue-100 hover:to-indigo-100 dark:hover:from-gray-750 dark:hover:to-gray-700 transition-all"
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
            <Code className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Working Code Examples</h2>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-4">

      {/* Language Selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setSelectedLanguage('python')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedLanguage === 'python'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Python
        </button>
        <button
          onClick={() => setSelectedLanguage('javascript')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedLanguage === 'javascript'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          JavaScript
        </button>
        <button
          onClick={() => setSelectedLanguage('curl')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selectedLanguage === 'curl'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          cURL
        </button>
      </div>

      {/* Code Examples */}
      <div className="space-y-4">
        {languageExamples.map((example, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{example.title}</h4>
                {example.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{example.description}</p>
                )}
              </div>
              <button
                onClick={() => copyToClipboard(example.code, index)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm"
                title="Copy code"
              >
                {copiedIndex === index ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm">
              <code>{example.code}</code>
            </pre>
          </div>
        ))}
      </div>
        </div>
      )}
    </div>
  );
}

interface RealWorldUseCasesSectionProps {
  useCases: RealWorldUseCase[];
}

export function RealWorldUseCasesSection({ useCases }: RealWorldUseCasesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'hard':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="mt-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 rounded-lg hover:from-blue-100 hover:to-indigo-100 dark:hover:from-gray-750 dark:hover:to-gray-700 transition-all"
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
            <BookOpen className="w-4 h-4 text-purple-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Real-World Use Cases</h2>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-4">
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <p className="text-xs text-amber-800 dark:text-amber-200">
              <strong>Note:</strong> These are illustrative examples based on common use patterns. Actual results may vary. Consult vendor documentation for verified case studies.
            </p>
          </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {useCases.map((useCase, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{useCase.title}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Building2 className="w-4 h-4" />
                  <span>{useCase.industry}</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(useCase.difficulty)}`}>
                {useCase.difficulty.toUpperCase()}
              </span>
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{useCase.description}</p>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-3">
              <div className="flex items-start gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-blue-900 dark:text-blue-200 mb-1">Implementation</p>
                  <p className="text-xs text-blue-800 dark:text-blue-300">{useCase.implementation}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 mb-3">
              <div className="flex items-start gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-green-900 dark:text-green-200 mb-1">Results</p>
                  <p className="text-xs text-green-800 dark:text-green-300">{useCase.results}</p>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(useCase.metrics).map(([key, value]) => (
                <div key={key} className="bg-gray-50 dark:bg-gray-800 rounded p-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
        </div>
      )}
    </div>
  );
}

interface LimitationsSectionProps {
  limitations: ModelLimitations;
}

export function LimitationsSection({ limitations }: LimitationsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 rounded-lg hover:from-blue-100 hover:to-indigo-100 dark:hover:from-gray-750 dark:hover:to-gray-700 transition-all"
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Limitations & Best Practices</h2>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-4">
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> These are general limitations and best practices. Always refer to official provider documentation for the most current information and specific implementation details.
            </p>
          </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Known Issues */}
        {limitations.knownIssues.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Known Issues
            </h4>
            <ul className="space-y-2">
              {limitations.knownIssues.map((issue, index) => (
                <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Common Failures */}
        {limitations.commonFailures.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              Common Failures
            </h4>
            <ul className="space-y-2">
              {limitations.commonFailures.map((failure, index) => (
                <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span>{failure}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Performance */}
        {limitations.performance.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-yellow-500" />
              Performance Considerations
            </h4>
            <ul className="space-y-2">
              {limitations.performance.map((perf, index) => (
                <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">•</span>
                  <span>{perf}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Content Policies */}
        {limitations.contentPolicies.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-purple-500" />
              Content Policies
            </h4>
            <ul className="space-y-2">
              {limitations.contentPolicies.map((policy, index) => (
                <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>{policy}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Best Practices */}
        {limitations.bestPractices.length > 0 && (
          <div className="md:col-span-2">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-green-500" />
              Best Practices
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {limitations.bestPractices.map((practice, index) => (
                <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>{practice}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Workarounds */}
        {limitations.workarounds.length > 0 && (
          <div className="md:col-span-2">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-blue-500" />
              Workarounds & Solutions
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {limitations.workarounds.map((workaround, index) => (
                <li key={index} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                  <span className="text-blue-500 mt-1">→</span>
                  <span>{workaround}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
        </div>
      )}
    </div>
  );
}
