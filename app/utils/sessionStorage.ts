// Session History Storage Utility

export interface SessionEntry {
  id: string;
  timestamp: number;
  modelId: string;
  modelName: string;
  provider: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
  contextUsagePercent: number;
  prompt?: string; // Optional: store prompt text
}

export interface SessionStats {
  totalSessions: number;
  totalTokens: number;
  totalCost: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  mostUsedModel: string;
  averageCostPerSession: number;
  averageTokensPerSession: number;
}

const STORAGE_KEY = 'model_compare_session_history';
const MAX_SESSIONS = 1000; // Limit storage size

export class SessionStorageManager {
  // Save a new session
  static saveSession(session: Omit<SessionEntry, 'id' | 'timestamp'>): SessionEntry {
    const newSession: SessionEntry = {
      ...session,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    const sessions = this.getAllSessions();
    sessions.unshift(newSession); // Add to beginning (most recent first)

    // Limit storage size
    const trimmedSessions = sessions.slice(0, MAX_SESSIONS);

    this.saveSessions(trimmedSessions);
    return newSession;
  }

  // Get all sessions
  static getAllSessions(): SessionEntry[] {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading session history:', error);
      return [];
    }
  }

  // Save sessions to storage
  private static saveSessions(sessions: SessionEntry[]): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving session history:', error);
    }
  }

  // Get sessions within date range
  static getSessionsByDateRange(startDate: Date, endDate: Date): SessionEntry[] {
    const sessions = this.getAllSessions();
    return sessions.filter(
      session => session.timestamp >= startDate.getTime() && session.timestamp <= endDate.getTime()
    );
  }

  // Get sessions for today
  static getTodaySessions(): SessionEntry[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.getSessionsByDateRange(today, tomorrow);
  }

  // Get sessions for this week
  static getWeekSessions(): SessionEntry[] {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    return this.getSessionsByDateRange(weekAgo, today);
  }

  // Get sessions for this month
  static getMonthSessions(): SessionEntry[] {
    const today = new Date();
    const monthAgo = new Date(today);
    monthAgo.setDate(monthAgo.getDate() - 30);

    return this.getSessionsByDateRange(monthAgo, today);
  }

  // Get sessions by model
  static getSessionsByModel(modelId: string): SessionEntry[] {
    const sessions = this.getAllSessions();
    return sessions.filter(session => session.modelId === modelId);
  }

  // Get sessions by provider
  static getSessionsByProvider(provider: string): SessionEntry[] {
    const sessions = this.getAllSessions();
    return sessions.filter(session => session.provider === provider);
  }

  // Calculate statistics for given sessions
  static calculateStats(sessions: SessionEntry[]): SessionStats {
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalTokens: 0,
        totalCost: 0,
        totalInputTokens: 0,
        totalOutputTokens: 0,
        mostUsedModel: 'N/A',
        averageCostPerSession: 0,
        averageTokensPerSession: 0,
      };
    }

    const totalTokens = sessions.reduce((sum, s) => sum + s.totalTokens, 0);
    const totalCost = sessions.reduce((sum, s) => sum + s.totalCost, 0);
    const totalInputTokens = sessions.reduce((sum, s) => sum + s.inputTokens, 0);
    const totalOutputTokens = sessions.reduce((sum, s) => sum + s.outputTokens, 0);

    // Find most used model
    const modelCounts: { [key: string]: number } = {};
    sessions.forEach(s => {
      modelCounts[s.modelName] = (modelCounts[s.modelName] || 0) + 1;
    });
    const mostUsedModel = Object.keys(modelCounts).reduce((a, b) =>
      modelCounts[a] > modelCounts[b] ? a : b
    );

    return {
      totalSessions: sessions.length,
      totalTokens,
      totalCost,
      totalInputTokens,
      totalOutputTokens,
      mostUsedModel,
      averageCostPerSession: totalCost / sessions.length,
      averageTokensPerSession: totalTokens / sessions.length,
    };
  }

  // Get statistics for different time periods
  static getTimeBasedStats() {
    return {
      today: this.calculateStats(this.getTodaySessions()),
      week: this.calculateStats(this.getWeekSessions()),
      month: this.calculateStats(this.getMonthSessions()),
      allTime: this.calculateStats(this.getAllSessions()),
    };
  }

  // Get model usage statistics
  static getModelUsageStats(): { modelName: string; count: number; totalCost: number; totalTokens: number }[] {
    const sessions = this.getAllSessions();
    const modelStats: { [key: string]: { count: number; totalCost: number; totalTokens: number } } = {};

    sessions.forEach(session => {
      if (!modelStats[session.modelName]) {
        modelStats[session.modelName] = { count: 0, totalCost: 0, totalTokens: 0 };
      }
      modelStats[session.modelName].count++;
      modelStats[session.modelName].totalCost += session.totalCost;
      modelStats[session.modelName].totalTokens += session.totalTokens;
    });

    return Object.entries(modelStats)
      .map(([modelName, stats]) => ({ modelName, ...stats }))
      .sort((a, b) => b.count - a.count);
  }

  // Get provider usage statistics
  static getProviderUsageStats(): { provider: string; count: number; totalCost: number; totalTokens: number }[] {
    const sessions = this.getAllSessions();
    const providerStats: { [key: string]: { count: number; totalCost: number; totalTokens: number } } = {};

    sessions.forEach(session => {
      if (!providerStats[session.provider]) {
        providerStats[session.provider] = { count: 0, totalCost: 0, totalTokens: 0 };
      }
      providerStats[session.provider].count++;
      providerStats[session.provider].totalCost += session.totalCost;
      providerStats[session.provider].totalTokens += session.totalTokens;
    });

    return Object.entries(providerStats)
      .map(([provider, stats]) => ({ provider, ...stats }))
      .sort((a, b) => b.count - a.count);
  }

  // Get daily usage data for charts (last 30 days)
  static getDailyUsageData(): { date: string; tokens: number; cost: number; sessions: number }[] {
    const sessions = this.getMonthSessions();
    const dailyData: { [key: string]: { tokens: number; cost: number; sessions: number } } = {};

    // Initialize last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      dailyData[dateKey] = { tokens: 0, cost: 0, sessions: 0 };
    }

    // Populate with actual data
    sessions.forEach(session => {
      const dateKey = new Date(session.timestamp).toISOString().split('T')[0];
      if (dailyData[dateKey]) {
        dailyData[dateKey].tokens += session.totalTokens;
        dailyData[dateKey].cost += session.totalCost;
        dailyData[dateKey].sessions++;
      }
    });

    return Object.entries(dailyData)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  // Delete a session
  static deleteSession(sessionId: string): void {
    const sessions = this.getAllSessions();
    const filtered = sessions.filter(s => s.id !== sessionId);
    this.saveSessions(filtered);
  }

  // Clear all sessions
  static clearAllSessions(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  }

  // Export sessions to JSON
  static exportToJSON(): string {
    const sessions = this.getAllSessions();
    return JSON.stringify(sessions, null, 2);
  }

  // Import sessions from JSON
  static importFromJSON(jsonString: string): void {
    try {
      const sessions = JSON.parse(jsonString);
      if (Array.isArray(sessions)) {
        this.saveSessions(sessions);
      }
    } catch (error) {
      console.error('Error importing sessions:', error);
      throw new Error('Invalid JSON format');
    }
  }
}
