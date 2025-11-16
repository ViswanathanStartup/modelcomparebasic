'use client';

import { useState, useEffect, useCallback } from 'react';
import { History, TrendingDown, AlertCircle, Sparkles, Calendar, Filter } from 'lucide-react';
import { ChangelogEntry, ModelChange } from '../types/notifications';

export default function ModelChangelog() {
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterProvider, setFilterProvider] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadChangelog();
  }, []);

  const getRealChangelog = (): ChangelogEntry[] => {
    return [
        {
          id: '1',
          modelId: 'gpt-3.5-turbo-16k',
          modelName: 'GPT-3.5 Turbo 16K',
          provider: 'OpenAI',
          changeDate: '2024-06-17T00:00:00.000Z',
          changeType: 'deprecation',
          changes: [
            {
              field: 'Status',
              oldValue: 'Active',
              newValue: 'Deprecated',
              changeType: 'modified'
            }
          ],
          summary: 'Model deprecated. Consolidated into standard GPT-3.5 Turbo which now supports 16K context.'
        },
        {
          id: '2',
          modelId: 'claude-3-opus-20240229',
          modelName: 'Claude 3 Opus',
          provider: 'Anthropic',
          changeDate: '2025-06-30T00:00:00.000Z',
          changeType: 'deprecation',
          changes: [
            {
              field: 'Status',
              oldValue: 'Active',
              newValue: 'Deprecated',
              changeType: 'modified'
            },
            {
              field: 'Deprecation Date',
              oldValue: null,
              newValue: 'June 30, 2025',
              changeType: 'added'
            }
          ],
          summary: 'Claude 3 Opus deprecated. Users should migrate to Claude Opus 4 for continued support.'
        },
        {
          id: '3',
          modelId: 'claude-3-sonnet-20240229',
          modelName: 'Claude 3 Sonnet',
          provider: 'Anthropic',
          changeDate: '2025-07-21T00:00:00.000Z',
          changeType: 'deprecation',
          changes: [
            {
              field: 'Status',
              oldValue: 'Active',
              newValue: 'Deprecated',
              changeType: 'modified'
            }
          ],
          summary: 'Claude 3 Sonnet deprecated. Migrate to Claude 3.5 Sonnet for enhanced performance.'
        },
        {
          id: '4',
          modelId: 'mistral-large-2411',
          modelName: 'Mistral Large 2',
          provider: 'Mistral',
          changeDate: '2025-01-08T00:00:00.000Z',
          changeType: 'update',
          changes: [
            {
              field: 'Model ID',
              oldValue: 'mistral-large-2',
              newValue: 'mistral-large-2411',
              changeType: 'modified'
            }
          ],
          summary: 'Model ID updated to date-versioned format for API compatibility.'
        },
        {
          id: '5',
          modelId: 'command-r-08-2024',
          modelName: 'Command R',
          provider: 'Cohere',
          changeDate: '2024-09-15T00:00:00.000Z',
          changeType: 'update',
          changes: [
            {
              field: 'API Endpoint',
              oldValue: '/v1/generate',
              newValue: '/v1/chat',
              changeType: 'modified'
            },
            {
              field: 'Model ID',
              oldValue: 'cohere-command-r',
              newValue: 'command-r-08-2024',
              changeType: 'modified'
            }
          ],
          summary: 'Migrated from Generate API to Chat API. Model ID updated to date-versioned format.'
        },
        {
          id: '6',
          modelId: 'gemini-1.0-pro',
          modelName: 'Gemini 1.0 Pro',
          provider: 'Google',
          changeDate: '2025-04-09T00:00:00.000Z',
          changeType: 'deprecation',
          changes: [
            {
              field: 'Status',
              oldValue: 'Active',
              newValue: 'Deprecated',
              changeType: 'modified'
            }
          ],
          summary: 'Gemini 1.0 Pro deprecated. Users should upgrade to Gemini 1.5 Pro or Gemini 2.0 Flash.'
        },
        {
          id: '7',
          modelId: 'o1-preview',
          modelName: 'o1-preview',
          provider: 'OpenAI',
          changeDate: '2025-10-27T00:00:00.000Z',
          changeType: 'deprecation',
          changes: [
            {
              field: 'Deprecation Notice',
              oldValue: null,
              newValue: 'Will be deprecated October 27, 2025',
              changeType: 'added'
            }
          ],
          summary: 'Deprecation scheduled for October 27, 2025. Migrate to newer o-series models.'
        }
      ];
  };

  const loadChangelog = () => {
    const saved = localStorage.getItem('model-changelog');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Filter out test notifications (contain "TEST NOTIFICATION" in summary)
      const filtered = parsed.filter((entry: ChangelogEntry) =>
        !entry.summary.includes('(TEST NOTIFICATION)')
      );
      setChangelog(filtered);
    } else {
      const realChangelog = getRealChangelog();
      localStorage.setItem('model-changelog', JSON.stringify(realChangelog));
      setChangelog(realChangelog);
    }
  };

  const resetToRealData = () => {
    if (confirm('This will clear all changelog entries and reset to real data only. Continue?')) {
      const realChangelog = getRealChangelog();
      localStorage.setItem('model-changelog', JSON.stringify(realChangelog));
      setChangelog(realChangelog);
    }
  };

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'price':
        return <TrendingDown className="w-5 h-5 text-green-600" />;
      case 'deprecation':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'new':
        return <Sparkles className="w-5 h-5 text-blue-600" />;
      default:
        return <History className="w-5 h-5 text-purple-600" />;
    }
  };

  const renderChangeValue = (change: ModelChange) => {
    if (change.changeType === 'added') {
      return (
        <div className="flex items-center gap-2">
          <span className="text-gray-500 dark:text-gray-400">—</span>
          <span className="text-2xl text-gray-400">→</span>
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded font-medium">
            {String(change.newValue)}
          </span>
        </div>
      );
    } else if (change.changeType === 'removed') {
      return (
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded font-medium line-through">
            {String(change.oldValue)}
          </span>
          <span className="text-2xl text-gray-400">→</span>
          <span className="text-gray-500 dark:text-gray-400">—</span>
        </div>
      );
    } else {
      // Modified
      const isPrice = change.field.toLowerCase().includes('cost') || change.field.toLowerCase().includes('price');
      const oldNum = isPrice ? parseFloat(String(change.oldValue).replace(/[^0-9.]/g, '')) : null;
      const newNum = isPrice ? parseFloat(String(change.newValue).replace(/[^0-9.]/g, '')) : null;
      const isDecrease = oldNum && newNum && newNum < oldNum;

      return (
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded font-medium">
            {String(change.oldValue)}
          </span>
          <span className="text-2xl text-gray-400">→</span>
          <span className={`px-3 py-1 rounded font-medium ${
            isDecrease
              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
          }`}>
            {String(change.newValue)}
            {isPrice && oldNum && newNum && (
              <span className="ml-2 text-xs">
                ({isDecrease ? '↓' : '↑'} {Math.abs(((newNum - oldNum) / oldNum) * 100).toFixed(1)}%)
              </span>
            )}
          </span>
        </div>
      );
    }
  };

  const filteredChangelog = changelog.filter(entry => {
    if (filterType !== 'all' && entry.changeType !== filterType) return false;
    if (filterProvider !== 'all' && entry.provider !== filterProvider) return false;
    if (searchQuery && !entry.modelName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !entry.provider.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const uniqueProviders = Array.from(new Set(changelog.map(e => e.provider)));

  return (
    <div className="p-6">
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400">
          Track all changes to LLM models including pricing updates, new releases, and deprecations
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Filter className="w-5 h-5" />
            <span className="font-semibold">Filters</span>
          </div>
          <button
            onClick={resetToRealData}
            className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
          >
            Reset to Real Data
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search models or providers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />

          {/* Change Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Changes</option>
            <option value="price">Price Changes</option>
            <option value="new">New Models</option>
            <option value="deprecation">Deprecations</option>
            <option value="update">Updates</option>
            <option value="feature">Features</option>
          </select>

          {/* Provider Filter */}
          <select
            value={filterProvider}
            onChange={(e) => setFilterProvider(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Providers</option>
            {uniqueProviders.map(provider => (
              <option key={provider} value={provider}>{provider}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {filteredChangelog.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
            <History className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">No changelog entries found</p>
          </div>
        ) : (
          filteredChangelog.map((entry, index) => (
            <div key={entry.id} className="relative">
              {/* Timeline Line */}
              {index < filteredChangelog.length - 1 && (
                <div className="absolute left-[29px] top-14 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
              )}

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 relative">
                {/* Timeline Dot */}
                <div className="absolute -left-3 top-6 w-16 h-16 bg-white dark:bg-gray-800 rounded-full border-4 border-gray-200 dark:border-gray-700 flex items-center justify-center">
                  {getChangeIcon(entry.changeType)}
                </div>

                <div className="ml-16">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {entry.modelName}
                        </h3>
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">
                          {entry.provider}
                        </span>
                        <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                          entry.changeType === 'price'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                            : entry.changeType === 'new'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                            : entry.changeType === 'deprecation'
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                            : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200'
                        }`}>
                          {entry.changeType.charAt(0).toUpperCase() + entry.changeType.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {new Date(entry.changeDate).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-gray-700 dark:text-gray-300 mb-4 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    {entry.summary}
                  </p>

                  {/* Changes Detail */}
                  <div className="space-y-3">
                    {entry.changes.map((change, idx) => (
                      <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
                        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          {change.field}
                        </div>
                        {renderChangeValue(change)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
