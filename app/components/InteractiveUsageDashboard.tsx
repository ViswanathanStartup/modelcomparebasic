'use client';

import { useState, useMemo, useEffect } from 'react';
import { X, TrendingUp, DollarSign, Clock, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SessionStorageManager, SessionEntry } from '../utils/sessionStorage';

interface InteractiveUsageDashboardProps {
  onClose: () => void;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export const InteractiveUsageDashboard = ({ onClose }: InteractiveUsageDashboardProps) => {
  const [sessions, setSessions] = useState<SessionEntry[]>([]);
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month' | 'all'>('week');
  const [selectedChart, setSelectedChart] = useState<'overview' | 'heatmap' | 'trends' | 'providers'>('overview');

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeFilter]);

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
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalSessions = sessions.length;
    const totalTokens = sessions.reduce((sum, s) => sum + s.totalTokens, 0);
    const totalCost = sessions.reduce((sum, s) => sum + s.totalCost, 0);
    const avgTokensPerSession = totalSessions > 0 ? totalTokens / totalSessions : 0;
    const avgCostPerSession = totalSessions > 0 ? totalCost / totalSessions : 0;

    return {
      totalSessions,
      totalTokens,
      totalCost,
      avgTokensPerSession,
      avgCostPerSession
    };
  }, [sessions]);

  // Model distribution
  const modelDistribution = useMemo(() => {
    const distribution = new Map<string, { count: number; tokens: number; cost: number }>();

    sessions.forEach(session => {
      const existing = distribution.get(session.modelName) || { count: 0, tokens: 0, cost: 0 };
      distribution.set(session.modelName, {
        count: existing.count + 1,
        tokens: existing.tokens + session.totalTokens,
        cost: existing.cost + session.totalCost
      });
    });

    return Array.from(distribution.entries())
      .map(([name, data]) => ({
        name: name.length > 20 ? name.substring(0, 20) + '...' : name,
        fullName: name,
        count: data.count,
        tokens: data.tokens,
        cost: data.cost
      }))
      .sort((a, b) => b.count - a.count);
  }, [sessions]);

  // Provider distribution
  const providerDistribution = useMemo(() => {
    const distribution = new Map<string, { count: number; tokens: number; cost: number }>();

    sessions.forEach(session => {
      const existing = distribution.get(session.provider) || { count: 0, tokens: 0, cost: 0 };
      distribution.set(session.provider, {
        count: existing.count + 1,
        tokens: existing.tokens + session.totalTokens,
        cost: existing.cost + session.totalCost
      });
    });

    return Array.from(distribution.entries())
      .map(([name, data]) => ({
        name,
        count: data.count,
        tokens: data.tokens,
        cost: data.cost
      }))
      .sort((a, b) => b.cost - a.cost);
  }, [sessions]);

  // Usage heatmap by hour
  const hourlyHeatmap = useMemo(() => {
    const hourCounts = new Array(24).fill(0);

    sessions.forEach(session => {
      const hour = new Date(session.timestamp).getHours();
      hourCounts[hour]++;
    });

    return hourCounts.map((count, hour) => ({
      hour: hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`,
      sessions: count
    }));
  }, [sessions]);

  // Daily usage pattern (last 7 or 30 days)
  const dailyPattern = useMemo(() => {
    const days = timeFilter === 'month' ? 30 : 7;
    const dailyData = new Array(days).fill(null).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - index));
      date.setHours(0, 0, 0, 0);
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sessions: 0,
        tokens: 0,
        cost: 0
      };
    });

    sessions.forEach(session => {
      const sessionDate = new Date(session.timestamp);
      sessionDate.setHours(0, 0, 0, 0);

      const dayIndex = dailyData.findIndex(day => {
        const dayDate = new Date(day.date + ', ' + new Date().getFullYear());
        return dayDate.getTime() === sessionDate.getTime();
      });

      if (dayIndex !== -1) {
        dailyData[dayIndex].sessions++;
        dailyData[dayIndex].tokens += session.totalTokens;
        dailyData[dayIndex].cost += session.totalCost;
      }
    });

    return dailyData;
  }, [sessions, timeFilter]);

  // Cost trend over time
  const costTrend = useMemo(() => {
    return dailyPattern.map(day => ({
      date: day.date,
      cost: parseFloat(day.cost.toFixed(2))
    }));
  }, [dailyPattern]);

  // Token usage trend
  const tokenTrend = useMemo(() => {
    return dailyPattern.map(day => ({
      date: day.date,
      tokens: day.tokens
    }));
  }, [dailyPattern]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-4 sm:p-6 max-w-7xl w-full max-h-[90vh] overflow-y-auto my-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="w-7 h-7 text-blue-600" />
            Interactive Usage Dashboard
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Time Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {(['today', 'week', 'month', 'all'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {filter === 'today' ? 'Today' : filter === 'week' ? 'Last 7 Days' : filter === 'month' ? 'Last 30 Days' : 'All Time'}
            </button>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">Total Sessions</h4>
            </div>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.totalSessions}</p>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-green-900 dark:text-green-100">Total Tokens</h4>
            </div>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.totalTokens.toLocaleString()}
            </p>
            <p className="text-xs text-green-700 dark:text-green-300 mt-1">
              Avg: {Math.round(stats.avgTokensPerSession).toLocaleString()} per session
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-purple-900 dark:text-purple-100">Total Cost</h4>
            </div>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              ${stats.totalCost.toFixed(4)}
            </p>
            <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
              Avg: ${stats.avgCostPerSession.toFixed(4)} per session
            </p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <h4 className="font-semibold text-amber-900 dark:text-amber-100">Period</h4>
            </div>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {timeFilter === 'today' ? 'Today' : timeFilter === 'week' ? '7 Days' : timeFilter === 'month' ? '30 Days' : 'All Time'}
            </p>
          </div>
        </div>

        {/* Chart Selection */}
        <div className="mb-6 flex flex-wrap gap-2">
          {(['overview', 'heatmap', 'trends', 'providers'] as const).map(chart => (
            <button
              key={chart}
              onClick={() => setSelectedChart(chart)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedChart === chart
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {chart === 'overview' ? 'Overview' : chart === 'heatmap' ? 'Usage Heatmap' : chart === 'trends' ? 'Cost Trends' : 'Provider Analysis'}
            </button>
          ))}
        </div>

        {/* Charts */}
        {sessions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Usage Data Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
              No usage data available for the selected period. The dashboard will automatically track your model usage when you:
            </p>
            <div className="text-left max-w-md mx-auto mb-6">
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  Use the <strong>Cost Calculator</strong> to calculate token costs
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  Compare models using the <strong>Enhanced Comparison</strong> tool
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  Run calculations in the <strong>Analytics Dashboard</strong>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                  Test models in the <strong>Testing Playground</strong>
                </li>
              </ul>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Your usage history will appear here once you start using these features.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overview Charts */}
            {selectedChart === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Model Distribution Pie Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-blue-600" />
                    Model Usage Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={modelDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        label={({ name, count }: any) => `${name}: ${count}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {modelDistribution.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Daily Sessions Bar Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    Daily Session Activity
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dailyPattern}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sessions" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Usage Heatmap */}
            {selectedChart === 'heatmap' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  Usage by Hour of Day
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={hourlyHeatmap}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sessions" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
                  Peak usage hour: {hourlyHeatmap.reduce((max, curr) => curr.sessions > max.sessions ? curr : max, hourlyHeatmap[0]).hour}
                </p>
              </div>
            )}

            {/* Cost & Token Trends */}
            {selectedChart === 'trends' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cost Trend */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Cost Over Time
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={costTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${Number(value).toFixed(4)}`} />
                      <Line type="monotone" dataKey="cost" stroke="#10B981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Token Trend */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Token Usage Over Time
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={tokenTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => Number(value).toLocaleString()} />
                      <Line type="monotone" dataKey="tokens" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Provider Analysis */}
            {selectedChart === 'providers' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Provider Cost Distribution */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Cost by Provider
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={providerDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${Number(value).toFixed(4)}`} />
                      <Bar dataKey="cost" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Provider Usage Count */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Sessions by Provider
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={providerDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        label={({ name, count }: any) => `${name}: ${count}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {providerDistribution.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Top Models Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Top Models by Usage
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Model</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">Sessions</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">Total Tokens</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">Total Cost</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">Avg Cost/Session</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {modelDistribution.slice(0, 10).map((model, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{model.fullName}</td>
                        <td className="px-4 py-3 text-right text-gray-900 dark:text-white">{model.count}</td>
                        <td className="px-4 py-3 text-right font-mono text-gray-900 dark:text-white">
                          {model.tokens.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-green-600 dark:text-green-400">
                          ${model.cost.toFixed(4)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-gray-900 dark:text-white">
                          ${(model.cost / model.count).toFixed(4)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
