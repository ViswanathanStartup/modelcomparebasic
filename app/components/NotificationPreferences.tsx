'use client';

import { useState, useEffect } from 'react';
import { Bell, Mail, Webhook, X, Save, CheckCircle } from 'lucide-react';
import type { NotificationPreferences } from '../types/notifications';
import { defaultNotificationPreferences } from '../types/notifications';
import { llmModels } from '../data/llm-data';
import NotificationTestPanel from './NotificationTestPanel';

export default function NotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultNotificationPreferences);
  const [savedMessage, setSavedMessage] = useState('');
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Load preferences from localStorage
    const saved = localStorage.getItem('notification-preferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }

    // Check browser notification permission
    if ('Notification' in window) {
      setBrowserPermission(Notification.permission);
    }
  }, []);

  const savePreferences = () => {
    localStorage.setItem('notification-preferences', JSON.stringify(preferences));
    setSavedMessage('Preferences saved successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const requestBrowserPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setBrowserPermission(permission);
      if (permission === 'granted') {
        setPreferences({ ...preferences, enableBrowser: true });
      }
    }
  };

  const toggleWatchedModel = (modelId: string) => {
    const watched = preferences.watchedModels.includes(modelId);
    setPreferences({
      ...preferences,
      watchedModels: watched
        ? preferences.watchedModels.filter(id => id !== modelId)
        : [...preferences.watchedModels, modelId],
    });
  };

  const toggleWatchedProvider = (provider: string) => {
    const watched = preferences.watchedProviders.includes(provider);
    setPreferences({
      ...preferences,
      watchedProviders: watched
        ? preferences.watchedProviders.filter(p => p !== provider)
        : [...preferences.watchedProviders, provider],
    });
  };

  const uniqueProviders = Array.from(new Set(llmModels.map(m => m.provider)));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-end mb-6">
        <button
          onClick={savePreferences}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Preferences
        </button>
      </div>

      {savedMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-2 text-green-800 dark:text-green-200">
          <CheckCircle className="w-5 h-5" />
          {savedMessage}
        </div>
      )}

      {/* Notification Channels */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Notification Channels
        </h3>

        {/* Browser Notifications */}
        <div className="flex items-start gap-4">
          <Bell className="w-5 h-5 text-blue-600 mt-1" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Browser Notifications</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get real-time notifications in your browser
                </p>
              </div>
              {browserPermission === 'granted' ? (
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.enableBrowser}
                    onChange={(e) => setPreferences({ ...preferences, enableBrowser: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              ) : (
                <button
                  onClick={requestBrowserPermission}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  Enable
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Email Notifications */}
        <div className="flex items-start gap-4">
          <Mail className="w-5 h-5 text-green-600 mt-1" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive notifications via email
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.enableEmail}
                  onChange={(e) => setPreferences({ ...preferences, enableEmail: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            {preferences.enableEmail && (
              <input
                type="email"
                value={preferences.email}
                onChange={(e) => setPreferences({ ...preferences, email: e.target.value })}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            )}
          </div>
        </div>

        {/* Webhook Notifications */}
        <div className="flex items-start gap-4">
          <Webhook className="w-5 h-5 text-purple-600 mt-1" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Webhook Integration</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Send notifications to your webhook endpoint
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.enableWebhook}
                  onChange={(e) => setPreferences({ ...preferences, enableWebhook: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            {preferences.enableWebhook && (
              <input
                type="url"
                value={preferences.webhookUrl || ''}
                onChange={(e) => setPreferences({ ...preferences, webhookUrl: e.target.value })}
                placeholder="https://your-webhook-url.com/endpoint"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            )}
          </div>
        </div>
      </div>

      {/* Notification Types */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          What to Notify Me About
        </h3>

        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-gray-900 dark:text-white">Price Changes</span>
            <input
              type="checkbox"
              checked={preferences.notifyOnPriceChange}
              onChange={(e) => setPreferences({ ...preferences, notifyOnPriceChange: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded"
            />
          </label>

          {preferences.notifyOnPriceChange && (
            <div className="ml-6 flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">
                Minimum change:
              </label>
              <input
                type="number"
                value={preferences.minPriceChangePercent}
                onChange={(e) => setPreferences({ ...preferences, minPriceChangePercent: parseFloat(e.target.value) })}
                min="0"
                max="100"
                step="1"
                className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">%</span>
            </div>
          )}

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-gray-900 dark:text-white">New Model Releases</span>
            <input
              type="checkbox"
              checked={preferences.notifyOnNewModel}
              onChange={(e) => setPreferences({ ...preferences, notifyOnNewModel: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-gray-900 dark:text-white">Deprecation Warnings</span>
            <input
              type="checkbox"
              checked={preferences.notifyOnDeprecation}
              onChange={(e) => setPreferences({ ...preferences, notifyOnDeprecation: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-gray-900 dark:text-white">Model Updates</span>
            <input
              type="checkbox"
              checked={preferences.notifyOnModelUpdate}
              onChange={(e) => setPreferences({ ...preferences, notifyOnModelUpdate: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded"
            />
          </label>
        </div>
      </div>

      {/* Watch Specific Providers */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Watch Specific Providers
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Get notified about changes from specific providers
        </p>
        <div className="flex flex-wrap gap-2">
          {uniqueProviders.map((provider) => (
            <button
              key={provider}
              onClick={() => toggleWatchedProvider(provider)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                preferences.watchedProviders.includes(provider)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {provider}
            </button>
          ))}
        </div>
      </div>

      {/* Watch Specific Models */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Watch Specific Models ({preferences.watchedModels.length})
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Get notified about changes to specific models you're interested in
        </p>

        {preferences.watchedModels.length > 0 && (
          <div className="mb-4 space-y-2">
            {preferences.watchedModels.map((modelId) => {
              const model = llmModels.find(m => m.id === modelId);
              if (!model) return null;
              return (
                <div
                  key={modelId}
                  className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{model.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{model.provider}</div>
                  </div>
                  <button
                    onClick={() => toggleWatchedModel(modelId)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <details className="mt-4">
          <summary className="cursor-pointer text-blue-600 dark:text-blue-400 font-medium mb-2">
            Add models to watch list
          </summary>
          <div className="max-h-64 overflow-y-auto space-y-1 mt-2">
            {llmModels
              .filter(model => !preferences.watchedModels.includes(model.id))
              .map((model) => (
                <button
                  key={model.id}
                  onClick={() => toggleWatchedModel(model.id)}
                  className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="font-medium text-gray-900 dark:text-white text-sm">{model.name}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{model.provider}</div>
                </button>
              ))}
          </div>
        </details>
      </div>

      {/* Test Notifications */}
      <NotificationTestPanel />
    </div>
  );
}
