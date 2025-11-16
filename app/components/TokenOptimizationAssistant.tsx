'use client';

import { useState, useMemo } from 'react';
import { Sparkles, X, AlertCircle, CheckCircle, TrendingDown, Lightbulb, Copy, Check } from 'lucide-react';
import { encode } from 'gpt-tokenizer';

interface TokenOptimizationAssistantProps {
  onClose: () => void;
}

interface OptimizationSuggestion {
  title: string;
  description: string;
  before: string;
  after: string;
  savings: number;
}

export const TokenOptimizationAssistant = ({ onClose }: TokenOptimizationAssistantProps) => {
  const [prompt, setPrompt] = useState('');
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const analysis = useMemo(() => {
    if (!prompt.trim()) {
      return {
        tokenCount: 0,
        score: 0,
        issues: [],
        suggestions: []
      };
    }

    const tokens = encode(prompt);
    const tokenCount = tokens.length;
    const wordCount = prompt.split(/\s+/).length;
    const charCount = prompt.length;

    // Detect issues
    const issues: string[] = [];
    const suggestions: OptimizationSuggestion[] = [];

    // Check for redundancy
    const redundantPhrases = [
      { phrase: 'please', replacement: '' },
      { phrase: 'could you', replacement: '' },
      { phrase: 'would you', replacement: '' },
      { phrase: 'I would like you to', replacement: '' },
      { phrase: 'Can you help me', replacement: '' },
      { phrase: 'in order to', replacement: 'to' },
      { phrase: 'due to the fact that', replacement: 'because' },
      { phrase: 'at this point in time', replacement: 'now' },
      { phrase: 'for the purpose of', replacement: 'for' },
    ];

    let hasRedundancy = false;
    redundantPhrases.forEach(({ phrase }) => {
      if (prompt.toLowerCase().includes(phrase)) {
        hasRedundancy = true;
      }
    });

    if (hasRedundancy) {
      issues.push('Contains redundant phrases that can be removed or simplified');
    }

    // Check for excessive punctuation
    const excessivePunctuation = (prompt.match(/[!?]{2,}/g) || []).length > 0;
    if (excessivePunctuation) {
      issues.push('Contains excessive punctuation (multiple !!! or ???)');
    }

    // Check for verbose instructions
    if (prompt.includes('step by step') && prompt.includes('detailed')) {
      issues.push('Overly verbose instructions - be more concise');
    }

    // Check for examples that are too long
    const lines = prompt.split('\n');
    const longExamples = lines.filter(line => line.length > 200).length;
    if (longExamples > 2) {
      issues.push('Contains lengthy examples - consider shortening');
    }

    // Check token-to-word ratio
    const tokenWordRatio = tokenCount / wordCount;
    if (tokenWordRatio > 1.5) {
      issues.push('High token-to-word ratio - may contain inefficient encoding');
    }

    // Generate optimized version
    let optimized = prompt;

    // Remove redundant phrases
    redundantPhrases.forEach(({ phrase, replacement }) => {
      const regex = new RegExp(`\\b${phrase}\\b`, 'gi');
      optimized = optimized.replace(regex, replacement);
    });

    // Remove excessive punctuation
    optimized = optimized.replace(/[!?]{2,}/g, '!');

    // Remove extra spaces
    optimized = optimized.replace(/\s+/g, ' ').trim();

    // Remove multiple newlines
    optimized = optimized.replace(/\n{3,}/g, '\n\n');

    const optimizedTokens = encode(optimized);
    const optimizedTokenCount = optimizedTokens.length;
    const savings = tokenCount - optimizedTokenCount;
    const savingsPercent = tokenCount > 0 ? (savings / tokenCount) * 100 : 0;

    // Generate suggestions
    if (prompt.includes('example:') || prompt.includes('for example')) {
      suggestions.push({
        title: 'Shorten Examples',
        description: 'Use more concise examples or reference common patterns',
        before: 'For example, if you have a list like [1, 2, 3, 4, 5]...',
        after: 'Example: [1, 2, 3, 4, 5]...',
        savings: 3
      });
    }

    if (prompt.split('\n').length > 10) {
      suggestions.push({
        title: 'Use Bullet Points',
        description: 'Replace verbose paragraphs with concise bullet points',
        before: 'I need you to analyze the data and then create a report...',
        after: '- Analyze data\n- Create report',
        savings: 5
      });
    }

    if (prompt.toLowerCase().includes('you should') || prompt.toLowerCase().includes('you must')) {
      suggestions.push({
        title: 'Use Imperative Form',
        description: 'Direct commands use fewer tokens than suggestions',
        before: 'You should analyze the following data...',
        after: 'Analyze the following data...',
        savings: 2
      });
    }

    // Calculate score (1-10)
    let score = 10;
    if (issues.length > 0) score -= issues.length * 1.5;
    if (savingsPercent > 20) score -= 2;
    if (savingsPercent > 40) score -= 2;
    if (tokenWordRatio > 1.5) score -= 1;
    score = Math.max(1, Math.min(10, Math.round(score)));

    setOptimizedPrompt(optimized);

    return {
      tokenCount,
      optimizedTokenCount,
      savings,
      savingsPercent,
      score,
      issues,
      suggestions,
      charCount,
      wordCount
    };
  }, [prompt]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 dark:text-green-400';
    if (score >= 5) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 8) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    if (score >= 5) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-4 sm:p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto my-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-purple-600" />
            Token Optimization Assistant
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Tip:</strong> This tool analyzes your prompts and suggests ways to reduce token usage while preserving meaning. Lower token usage means lower costs!
          </p>
        </div>

        {/* Input Area */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enter your prompt to analyze
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Paste your prompt here... For example: 'I would like you to please analyze the following data and create a detailed report with step by step explanations...'"
            rows={8}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 font-mono text-sm"
          />
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{analysis.charCount} characters • {analysis.wordCount} words</span>
            <span className="font-semibold">{analysis.tokenCount} tokens</span>
          </div>
        </div>

        {prompt.trim() && (
          <>
            {/* Score Card */}
            <div className={`mb-6 rounded-lg p-6 border-2 ${getScoreBg(analysis.score)}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Efficiency Score
                </h3>
                <div className={`text-4xl font-bold ${getScoreColor(analysis.score)}`}>
                  {analysis.score}/10
                </div>
              </div>

              {(analysis.savings ?? 0) > 0 && (
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Potential savings: {analysis.savings} tokens ({analysis.savingsPercent?.toFixed(1)}%)
                  </span>
                </div>
              )}

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
                <div
                  className={`h-2 rounded-full ${analysis.score >= 8 ? 'bg-green-600' : analysis.score >= 5 ? 'bg-yellow-600' : 'bg-red-600'}`}
                  style={{ width: `${analysis.score * 10}%` }}
                ></div>
              </div>
            </div>

            {/* Issues */}
            {analysis.issues.length > 0 && (
              <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Issues Found
                </h4>
                <ul className="space-y-2">
                  {analysis.issues.map((issue, index) => (
                    <li key={index} className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                      <span className="text-amber-600 mt-0.5">•</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Optimized Version */}
            {(analysis.savings ?? 0) > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Optimized Version
                  </label>
                  <button
                    onClick={() => handleCopy(optimizedPrompt)}
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <textarea
                    value={optimizedPrompt}
                    readOnly
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border-2 border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 text-gray-900 dark:text-white font-mono text-sm"
                  />
                  <div className="flex justify-between items-center mt-2 text-xs">
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      {analysis.optimizedTokenCount} tokens (saved {analysis.savings} tokens)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Suggestions */}
            {analysis.suggestions.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600" />
                  Optimization Tips
                </h4>
                <div className="space-y-4">
                  {analysis.suggestions.map((suggestion, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-gray-900 dark:text-white">{suggestion.title}</h5>
                        <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                          Save ~{suggestion.savings} tokens
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{suggestion.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-red-600 dark:text-red-400 font-semibold mb-1">Before:</p>
                          <p className="text-sm bg-red-50 dark:bg-red-900/20 text-gray-900 dark:text-white p-2 rounded border border-red-200 dark:border-red-800 font-mono">
                            {suggestion.before}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-green-600 dark:text-green-400 font-semibold mb-1">After:</p>
                          <p className="text-sm bg-green-50 dark:bg-green-900/20 text-gray-900 dark:text-white p-2 rounded border border-green-200 dark:border-green-800 font-mono">
                            {suggestion.after}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Best Practices */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Token Optimization Best Practices
              </h4>
              <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-200">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">✓</span>
                  <span>Use imperative form instead of polite requests (&quot;Analyze&quot; vs &quot;Can you please analyze&quot;)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">✓</span>
                  <span>Remove filler words and redundant phrases</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">✓</span>
                  <span>Use bullet points instead of long paragraphs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">✓</span>
                  <span>Keep examples concise and to the point</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">✓</span>
                  <span>Avoid unnecessary punctuation and formatting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">✓</span>
                  <span>Use abbreviations where context is clear</span>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
