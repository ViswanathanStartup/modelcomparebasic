'use client';

import { useState } from 'react';
import { LLMModel } from '../data/llm-data';
import { SessionStorageManager } from '../utils/sessionStorage';
import { ExportManager } from '../utils/exportUtils';
import { Download, FileText, FileJson, Table, CheckCircle } from 'lucide-react';

interface ExportReportingProps {
  selectedModels?: LLMModel[];
}

type ExportFormat = 'csv' | 'json' | 'markdown';
type ExportType = 'models' | 'sessions' | 'report';

export const ExportReporting = ({ selectedModels = [] }: ExportReportingProps) => {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv');
  const [exportType, setExportType] = useState<ExportType>('models');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('week');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleExport = () => {
    try {
      let content = '';
      let filename = '';
      let mimeType = 'text/plain';

      // Determine what to export
      if (exportType === 'models') {
        const modelsToExport = selectedModels.length > 0 ? selectedModels : [];

        if (modelsToExport.length === 0) {
          alert('Please select at least one model to export');
          return;
        }

        switch (exportFormat) {
          case 'csv':
            content = ExportManager.exportModelsToCSV(modelsToExport);
            filename = 'llmdb-models';
            mimeType = 'text/csv';
            break;
          case 'json':
            content = ExportManager.exportModelsToJSON(modelsToExport);
            filename = 'llmdb-models';
            mimeType = 'application/json';
            break;
          case 'markdown':
            content = ExportManager.exportModelsToMarkdown(modelsToExport);
            filename = 'llmdb-models';
            mimeType = 'text/markdown';
            break;
        }
      } else if (exportType === 'sessions') {
        let sessions;
        switch (timeFilter) {
          case 'today':
            sessions = SessionStorageManager.getTodaySessions();
            break;
          case 'week':
            sessions = SessionStorageManager.getWeekSessions();
            break;
          case 'month':
            sessions = SessionStorageManager.getMonthSessions();
            break;
          default:
            sessions = SessionStorageManager.getAllSessions();
        }

        if (sessions.length === 0) {
          alert('No sessions found for the selected time period');
          return;
        }

        switch (exportFormat) {
          case 'csv':
            content = ExportManager.exportSessionsToCSV(sessions);
            filename = `llmdb-sessions-${timeFilter}`;
            mimeType = 'text/csv';
            break;
          case 'json':
            content = ExportManager.exportSessionsToJSON(sessions);
            filename = `llmdb-sessions-${timeFilter}`;
            mimeType = 'application/json';
            break;
          case 'markdown':
            alert('Markdown export is only available for comprehensive reports');
            return;
        }
      } else if (exportType === 'report') {
        const sessions = SessionStorageManager.getWeekSessions();
        const stats = SessionStorageManager.calculateStats(sessions);
        const modelsToExport = selectedModels.length > 0 ? selectedModels : [];

        content = ExportManager.generateComprehensiveReport({
          models: modelsToExport,
          sessions,
          stats,
        });
        filename = 'model-compare-comprehensive-report';
        mimeType = 'text/markdown';
      }

      // Download the file
      const extension = exportFormat === 'csv' ? 'csv' : exportFormat === 'json' ? 'json' : 'md';
      ExportManager.downloadWithTimestamp(content, filename, extension, mimeType);

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const getExportButtonText = () => {
    const formatText = exportFormat.toUpperCase();
    const typeText = exportType === 'models' ? 'Models' : exportType === 'sessions' ? 'Sessions' : 'Report';
    return `Export ${typeText} as ${formatText}`;
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Download className="w-6 h-6" />
          Export & Reporting
        </h3>
        {showSuccess && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Export successful!</span>
          </div>
        )}
      </div>

      {/* Export Type Selection */}
      <div>
        <label className="block text-sm font-medium mb-3">What do you want to export?</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => setExportType('models')}
            className={`p-4 border-2 rounded-lg transition-all ${
              exportType === 'models'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
            }`}
          >
            <Table className="w-6 h-6 mb-2 mx-auto" />
            <div className="font-medium">Model Comparison</div>
            <div className="text-xs text-gray-500 mt-1">
              {selectedModels.length > 0 ? `${selectedModels.length} selected` : 'No models selected'}
            </div>
          </button>

          <button
            onClick={() => setExportType('sessions')}
            className={`p-4 border-2 rounded-lg transition-all ${
              exportType === 'sessions'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
            }`}
          >
            <FileText className="w-6 h-6 mb-2 mx-auto" />
            <div className="font-medium">Session History</div>
            <div className="text-xs text-gray-500 mt-1">Usage data & costs</div>
          </button>

          <button
            onClick={() => setExportType('report')}
            className={`p-4 border-2 rounded-lg transition-all ${
              exportType === 'report'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
            }`}
          >
            <FileJson className="w-6 h-6 mb-2 mx-auto" />
            <div className="font-medium">Comprehensive Report</div>
            <div className="text-xs text-gray-500 mt-1">Full analysis</div>
          </button>
        </div>
      </div>

      {/* Time Filter for Sessions */}
      {exportType === 'sessions' && (
        <div>
          <label className="block text-sm font-medium mb-3">Time Period</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(['today', 'week', 'month', 'all'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-4 py-2 border-2 rounded-lg transition-all ${
                  timeFilter === filter
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Format Selection */}
      <div>
        <label className="block text-sm font-medium mb-3">Export Format</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => setExportFormat('csv')}
            disabled={exportType === 'report'}
            className={`p-4 border-2 rounded-lg transition-all ${
              exportFormat === 'csv' && exportType !== 'report'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
            } ${exportType === 'report' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="font-medium">CSV</div>
            <div className="text-xs text-gray-500 mt-1">Excel compatible</div>
          </button>

          <button
            onClick={() => setExportFormat('json')}
            disabled={exportType === 'report'}
            className={`p-4 border-2 rounded-lg transition-all ${
              exportFormat === 'json' && exportType !== 'report'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
            } ${exportType === 'report' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="font-medium">JSON</div>
            <div className="text-xs text-gray-500 mt-1">For developers</div>
          </button>

          <button
            onClick={() => setExportFormat('markdown')}
            disabled={exportType === 'sessions'}
            className={`p-4 border-2 rounded-lg transition-all ${
              exportFormat === 'markdown' || exportType === 'report'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
            } ${exportType === 'sessions' ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="font-medium">Markdown</div>
            <div className="text-xs text-gray-500 mt-1">For documentation</div>
          </button>
        </div>
      </div>

      {/* Export Summary */}
      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <h4 className="font-medium text-sm mb-2">Export Summary</h4>
        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <p>
            <span className="font-medium">Type:</span>{' '}
            {exportType === 'models'
              ? 'Model Comparison'
              : exportType === 'sessions'
              ? 'Session History'
              : 'Comprehensive Report'}
          </p>
          {exportType === 'models' && (
            <p>
              <span className="font-medium">Models:</span> {selectedModels.length} selected
            </p>
          )}
          {exportType === 'sessions' && (
            <p>
              <span className="font-medium">Period:</span> {timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)}
            </p>
          )}
          <p>
            <span className="font-medium">Format:</span>{' '}
            {exportType === 'report' ? 'Markdown' : exportFormat.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Export Button */}
      <button
        onClick={handleExport}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={exportType === 'models' && selectedModels.length === 0}
      >
        <Download className="w-5 h-5" />
        {getExportButtonText()}
      </button>

      {exportType === 'models' && selectedModels.length === 0 && (
        <p className="text-sm text-center text-yellow-600 dark:text-yellow-400">
          Please select at least one model from the comparison table to export
        </p>
      )}

      {/* Usage Tips */}
      <div className="pt-4 border-t dark:border-gray-700">
        <h4 className="font-medium text-sm mb-2">Export Tips</h4>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
          <li>CSV files can be opened in Excel, Google Sheets, or any spreadsheet software</li>
          <li>JSON format is ideal for importing into other applications or databases</li>
          <li>Markdown reports can be pasted into documentation or README files</li>
          <li>Comprehensive reports include models, sessions, and analytics in one file</li>
        </ul>
      </div>
    </div>
  );
};
