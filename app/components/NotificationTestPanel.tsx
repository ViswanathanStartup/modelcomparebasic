'use client';

import { useState } from 'react';
import { NotificationService } from '../services/notificationService';
import { Bell, DollarSign, Sparkles, AlertTriangle, Info } from 'lucide-react';

export default function NotificationTestPanel() {
  const [message, setMessage] = useState('');

  const generatePriceChangeNotification = () => {
    NotificationService.notifyPriceChange(
      'mistral-large-2411',
      'Mistral Large 2',
      'Mistral',
      [
        {
          field: 'Input Cost (per 1M tokens)',
          oldValue: '$3.00',
          newValue: '$2.00',
          changeType: 'modified'
        },
        {
          field: 'Output Cost (per 1M tokens)',
          oldValue: '$9.00',
          newValue: '$6.00',
          changeType: 'modified'
        }
      ]
    );

    NotificationService.addToChangelog({
      modelId: 'mistral-large-2411',
      modelName: 'Mistral Large 2',
      provider: 'Mistral',
      changeDate: new Date().toISOString(),
      changeType: 'price',
      changes: [
        {
          field: 'Input Cost (per 1M tokens)',
          oldValue: '$3.00',
          newValue: '$2.00',
          changeType: 'modified'
        },
        {
          field: 'Output Cost (per 1M tokens)',
          oldValue: '$9.00',
          newValue: '$6.00',
          changeType: 'modified'
        }
      ],
      summary: 'Price reduction: Input costs decreased by 33%, output costs decreased by 33% (TEST NOTIFICATION)'
    });

    setMessage('Price change notification created!');
    setTimeout(() => setMessage(''), 3000);
  };

  const generateNewModelNotification = () => {
    NotificationService.notifyNewModel(
      'gemini-2.0-flash',
      'Gemini 2.0 Flash',
      'Google'
    );

    NotificationService.addToChangelog({
      modelId: 'gemini-2.0-flash',
      modelName: 'Gemini 2.0 Flash',
      provider: 'Google',
      changeDate: new Date().toISOString(),
      changeType: 'new',
      changes: [
        {
          field: 'Model',
          oldValue: null,
          newValue: 'Gemini 2.0 Flash',
          changeType: 'added'
        }
      ],
      summary: 'New model with improved performance and 1M context window (TEST NOTIFICATION)'
    });

    setMessage('New model notification created!');
    setTimeout(() => setMessage(''), 3000);
  };

  const generateDeprecationNotification = () => {
    NotificationService.notifyDeprecation(
      'gpt-3.5-turbo-16k',
      'GPT-3.5 Turbo 16K',
      'OpenAI',
      '2025-06-30'
    );

    NotificationService.addToChangelog({
      modelId: 'gpt-3.5-turbo-16k',
      modelName: 'GPT-3.5 Turbo 16K',
      provider: 'OpenAI',
      changeDate: new Date().toISOString(),
      changeType: 'deprecation',
      changes: [
        {
          field: 'Status',
          oldValue: 'Active',
          newValue: 'Deprecated',
          changeType: 'modified'
        }
      ],
      summary: 'Model will be deprecated on June 30, 2025. Migrate to GPT-4 Turbo for continued support.'
    });

    setMessage('Deprecation notification created!');
    setTimeout(() => setMessage(''), 3000);
  };

  const generateUpdateNotification = () => {
    NotificationService.notifyModelUpdate(
      'gemini-1.5-pro',
      'Gemini 1.5 Pro',
      'Google',
      [
        {
          field: 'Context Window',
          oldValue: '1M tokens',
          newValue: '2M tokens',
          changeType: 'modified'
        },
        {
          field: 'Features',
          oldValue: null,
          newValue: 'Function calling support',
          changeType: 'added'
        }
      ]
    );

    NotificationService.addToChangelog({
      modelId: 'gemini-1.5-pro',
      modelName: 'Gemini 1.5 Pro',
      provider: 'Google',
      changeDate: new Date().toISOString(),
      changeType: 'update',
      changes: [
        {
          field: 'Context Window',
          oldValue: '1M tokens',
          newValue: '2M tokens',
          changeType: 'modified'
        },
        {
          field: 'Features',
          oldValue: null,
          newValue: 'Function calling support',
          changeType: 'added'
        }
      ],
      summary: 'Context window doubled to 2M tokens, added function calling support'
    });

    setMessage('Update notification created!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Bell className="w-5 h-5" />
        Test Notifications
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Generate sample notifications to test the notification system. Make sure you've configured your notification preferences first!
      </p>

      {message && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          onClick={generatePriceChangeNotification}
          className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-left"
        >
          <DollarSign className="w-6 h-6 text-green-600" />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">Price Change</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Mistral Large 2 price reduction</div>
          </div>
        </button>

        <button
          onClick={generateNewModelNotification}
          className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-left"
        >
          <Sparkles className="w-6 h-6 text-blue-600" />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">New Model</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Gemini 2.0 Flash release</div>
          </div>
        </button>

        <button
          onClick={generateDeprecationNotification}
          className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-left"
        >
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">Deprecation</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">GPT-3.5 Turbo 16K sunset</div>
          </div>
        </button>

        <button
          onClick={generateUpdateNotification}
          className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-left"
        >
          <Info className="w-6 h-6 text-purple-600" />
          <div>
            <div className="font-medium text-gray-900 dark:text-white">Model Update</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Gemini 1.5 Pro improvements</div>
          </div>
        </button>
      </div>
    </div>
  );
}
