'use client';

import { useState, useEffect } from 'react';
import { SessionStorageManager, SessionEntry } from '../utils/sessionStorage';
import { Calendar, DollarSign, Hash, TrendingUp, Download, Trash2, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';

type TimeFilter = 'today' | 'week' | 'month' | 'all';

export const SessionHistoryDashboard = () => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('week');
  const [sessions, setSessions] = useState<SessionEntry[]>([]);
  const [stats, setStats] = useState<ReturnType<typeof SessionStorageManager.calculateStats> | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const loadData = () => {
    let filteredSessions: SessionEntry[];
    switch (timeFilter) {
      case 'today':
        filteredSessions = SessionStorageManager.getTodaySessions();
        break;
      case 'week':
        filteredSessions = SessionStorageManager.getWeekSessions();
        break;
      case 'month':
        filteredSessions = SessionStorageManager.getMonthSessions();
        break;
      default:
        filteredSessions = SessionStorageManager.getAllSessions();
    }

    setSessions(filteredSessions);
    setStats(SessionStorageManager.calculateStats(filteredSessions));
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeFilter]);

  const handleDeleteSession = (sessionId: string) => {
    if (confirm('Are you sure you want to delete this session?')) {
      SessionStorageManager.deleteSession(sessionId);
      loadData();
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete ALL session history? This cannot be undone.')) {
      SessionStorageManager.clearAllSessions();
      loadData();
    }
  };

  const handleExport = () => {
    const json = SessionStorageManager.exportToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `model-compare-sessions-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!stats) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <p className="text-gray-500">Loading session history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Session History & Analytics</h2>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={sessions.length === 0}
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            disabled={sessions.length === 0}
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>
      </div>

      {/* Time Filter Tabs */}
      <div className="flex gap-2 border-b dark:border-gray-700">
        {(['today', 'week', 'month', 'all'] as TimeFilter[]).map((filter) => (
          <button
            key={filter}
            onClick={() => setTimeFilter(filter)}
            className={`px-4 py-2 font-medium transition-colors ${
              timeFilter === filter
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sessions</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.totalSessions}</p>
        </div>

        <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Cost</h3>
          </div>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            ${stats.totalCost.toFixed(4)}
          </p>
        </div>

        <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <Hash className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tokens</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {stats.totalTokens.toLocaleString()}
          </p>
        </div>

        <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Cost/Session</h3>
          </div>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            ${stats.averageCostPerSession.toFixed(6)}
          </p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Usage Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Most Used Model</p>
            <p className="text-xl font-bold">{stats.mostUsedModel}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Avg Tokens/Session</p>
            <p className="text-xl font-bold">{Math.round(stats.averageTokensPerSession).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Input Tokens</p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {stats.totalInputTokens.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Output Tokens</p>
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {stats.totalOutputTokens.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Session List */}
      {sessions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
            <h3 className="text-lg font-semibold">Recent Sessions</h3>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Tokens
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Context %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {sessions.slice(0, showDetails ? sessions.length : 10).map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 text-sm">
                      {format(new Date(session.timestamp), 'MMM dd, yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{session.modelName}</div>
                      <div className="text-xs text-gray-500">{session.provider}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{session.totalTokens.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">
                        {session.inputTokens} in • {session.outputTokens} out
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">${session.totalCost.toFixed(6)}</td>
                    <td className="px-6 py-4 text-sm">{session.contextUsagePercent.toFixed(1)}%</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!showDetails && sessions.length > 10 && (
            <div className="p-4 text-center border-t dark:border-gray-700">
              <button
                onClick={() => setShowDetails(true)}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
              >
                Show all {sessions.length} sessions
              </button>
            </div>
          )}
        </div>
      )}

      {sessions.length === 0 && (
        <div className="p-12 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No sessions yet</h3>
          <p className="text-gray-500">
            Start using the Enhanced Token Counter to track your LLM usage and costs.
          </p>
        </div>
      )}
    </div>
  );
};
