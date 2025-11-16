'use client';

import { useState } from 'react';
import { Download, FileText, FileJson, Table } from 'lucide-react';
import { ExportManager } from '../utils/exportUtils';
import { LLMModel } from '../data/llm-data';

interface ExportButtonProps {
  models: LLMModel[];
  context?: string; // e.g., "Model Details", "Comparison", "Calculator"
}

export const ExportButton = ({ models, context = 'Data' }: ExportButtonProps) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleExport = (format: 'csv' | 'json' | 'markdown') => {
    let content = '';
    let filename = '';
    let mimeType = 'text/plain';

    switch (format) {
      case 'csv':
        content = ExportManager.exportModelsToCSV(models);
        filename = `model-compare-${context.toLowerCase().replace(/\s+/g, '-')}`;
        mimeType = 'text/csv';
        break;
      case 'json':
        content = ExportManager.exportModelsToJSON(models);
        filename = `model-compare-${context.toLowerCase().replace(/\s+/g, '-')}`;
        mimeType = 'application/json';
        break;
      case 'markdown':
        content = ExportManager.exportModelsToMarkdown(models);
        filename = `model-compare-${context.toLowerCase().replace(/\s+/g, '-')}`;
        mimeType = 'text/markdown';
        break;
    }

    const extension = format === 'csv' ? 'csv' : format === 'json' ? 'json' : 'md';
    ExportManager.downloadWithTimestamp(content, filename, extension, mimeType);
    setShowMenu(false);
  };

  if (models.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
        title="Export data"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Export</span>
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 z-50">
            <div className="p-2 border-b dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                Export {models.length} model{models.length > 1 ? 's' : ''}
              </p>
            </div>
            <div className="p-2 space-y-1">
              <button
                onClick={() => handleExport('csv')}
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Table className="w-4 h-4 text-green-600 dark:text-green-400" />
                <div>
                  <div className="font-medium">CSV</div>
                  <div className="text-xs text-gray-500">Excel compatible</div>
                </div>
              </button>
              <button
                onClick={() => handleExport('json')}
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FileJson className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <div>
                  <div className="font-medium">JSON</div>
                  <div className="text-xs text-gray-500">For developers</div>
                </div>
              </button>
              <button
                onClick={() => handleExport('markdown')}
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <div>
                  <div className="font-medium">Markdown</div>
                  <div className="text-xs text-gray-500">For docs</div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
