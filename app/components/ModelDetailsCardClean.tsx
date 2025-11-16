 'use client';

import React, { useState } from 'react';
import { type LLMModel } from '../data/llm-data';
import { Book, Tag, Zap, Calendar, Link, ArrowUpRight, Award, Clock } from 'lucide-react';

interface ModelDetailsCardProps {
  model: LLMModel;
}

export function ModelDetailsCardClean({ model }: ModelDetailsCardProps) {
  const [showRaw, setShowRaw] = useState(false);

  const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);
  const formatCost = (cost: number) => (cost < 1 ? `$${cost.toFixed(3)}` : `$${cost.toFixed(2)}`);
  const calculateBooksInContext = (tokens: number) => Math.floor(tokens / 100000);

  const computeQualityScore = (m: LLMModel) => {
    if (typeof m.qualityScore === 'number') return m.qualityScore;
    const b = m.benchmarks;
    if (!b) return undefined;
    const mmlu = typeof b.mmlu === 'number' ? b.mmlu : 0;
    const human = typeof b.humanEval === 'number' ? b.humanEval : 0;
    const speedBonus = b.speed === 'fast' ? 0.1 : b.speed === 'medium' ? 0.05 : 0;
    const score = (mmlu * 0.6 + human * 0.3 + speedBonus) * 10;
    return Math.min(10, Math.round(score * 10) / 10);
  };

  const computedQuality = computeQualityScore(model);

  return (
    <article
      role="region"
      aria-labelledby={`model-${model.id}-title`}
      tabIndex={0}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-4xl mx-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <header className="mb-4">
        <h1 id={`model-${model.id}-title`} className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {model.name}
        </h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{model.provider}</div>
        {model.description && <p className="mt-3 text-gray-600 dark:text-gray-300">{model.description}</p>}
        <hr className="my-4 border-gray-200 dark:border-gray-700" />
      </header>

      <section aria-labelledby={`model-${model.id}-metrics`} className="mb-6">
        <h2 id={`model-${model.id}-metrics`} className="sr-only">Key metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded">
            <dt className="text-sm text-gray-500 dark:text-gray-400">Context Window</dt>
            <dd className="text-2xl font-semibold text-gray-900 dark:text-white">{formatNumber(model.contextWindow)}</dd>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded">
            <dt className="text-sm text-gray-500 dark:text-gray-400">Books Capacity</dt>
            <dd className="text-2xl font-semibold text-gray-900 dark:text-white">{calculateBooksInContext(model.contextWindow)}</dd>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded">
            <dt className="text-sm text-gray-500 dark:text-gray-400">Input Cost / 1M</dt>
            <dd className="text-2xl font-semibold text-gray-900 dark:text-white">{formatCost(model.inputCostPer1M)}</dd>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded">
            <dt className="text-sm text-gray-500 dark:text-gray-400">Output Cost / 1M</dt>
            <dd className="text-2xl font-semibold text-gray-900 dark:text-white">{formatCost(model.outputCostPer1M)}</dd>
          </div>
        </div>
      </section>

      {model.benchmarks && (
        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white"><Award className="w-4 h-4" /> Benchmarks</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {typeof model.benchmarks.mmlu === 'number' && (
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded">
                <div className="text-xs text-gray-500">MMLU</div>
                <div className="font-bold text-lg">{(model.benchmarks.mmlu * 100).toFixed(1)}%</div>
              </div>
            )}
            {typeof model.benchmarks.humanEval === 'number' && (
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded">
                <div className="text-xs text-gray-500">HumanEval</div>
                <div className="font-bold text-lg">{(model.benchmarks.humanEval * 100).toFixed(1)}%</div>
              </div>
            )}
            {model.benchmarks.speed && (
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded">
                <div className="text-xs text-gray-500">Speed</div>
                <div className="font-bold text-lg capitalize">{model.benchmarks.speed}</div>
              </div>
            )}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        {model.keyFeatures && (
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white"><Zap className="w-4 h-4" /> Key features</h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              {model.keyFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2"><span className="w-2 h-2 mt-2 bg-blue-500 rounded-full" />{f}</li>
              ))}
            </ul>
          </section>
        )}

        {model.bestFor && (
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900 dark:text-white"><Book className="w-4 h-4" /> Best for</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
              {model.bestFor.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </section>
        )}
      </div>

      {model.tags && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white flex items-center gap-2"><Tag className="w-4 h-4" /> Tags</h3>
          <div className="flex flex-wrap gap-2">{model.tags.map((t, i) => <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">{t}</span>)}</div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {model.released && <InfoSection icon={<Calendar className="w-5 h-5" />} title="Release Date" value={new Date(model.released).toLocaleDateString()} />}
        {model.website && <InfoSection icon={<Link className="w-5 h-5" />} title="Website" value={<a href={model.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 flex items-center gap-1">Visit Website <ArrowUpRight className="w-4 h-4" /></a>} />}
        {model.lastUpdated && <InfoSection icon={<Clock className="w-5 h-5" />} title="Last Updated" value={new Date(model.lastUpdated).toLocaleDateString()} />}
      </div>

      <div className="mt-6">
        <div className="text-sm text-gray-500">Quality</div>
        <div className="text-xl font-semibold">{computedQuality ? `${computedQuality}/10` : model.qualityScore ? `${model.qualityScore}/10` : 'N/A'}</div>
      </div>

      <div className="mt-6">
        <button onClick={() => setShowRaw(p => !p)} className="text-sm text-blue-600 hover:underline" aria-pressed={showRaw}>{showRaw ? 'Hide raw data' : 'Show raw data'}</button>
        {showRaw && <pre className="mt-3 p-3 bg-gray-50 dark:bg-gray-900 rounded overflow-x-auto text-xs">{JSON.stringify(model, null, 2)}</pre>}
      </div>
    </article>
  );
}

function InfoSection({ icon, title, value }: {icon: React.ReactNode; title: string; value: React.ReactNode;}) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-2 bg-gray-100 dark:bg-gray-900 rounded-lg">{icon}</div>
      <div><h3 className="text-sm text-gray-600 dark:text-gray-400">{title}</h3><div className="font-medium">{value}</div></div>
    </div>
  );
}
