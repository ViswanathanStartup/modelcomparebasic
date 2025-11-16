'use client';

import { useState } from 'react';
import { LLMModel } from '../data/llm-data';
import { getSamplePrompts, SamplePrompt } from '../data/sample-prompts';

interface SamplePromptsProps {
  model: LLMModel;
}

export const SamplePrompts = ({ model }: SamplePromptsProps) => {
  const [selectedPrompt, setSelectedPrompt] = useState<SamplePrompt | null>(null);
  
  const relevantPrompts = getSamplePrompts(model.tags || []);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Sample Prompts</h3>
      
      <div className="grid gap-4 md:grid-cols-2">
        {relevantPrompts.map((prompt, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg cursor-pointer hover:border-blue-500"
            onClick={() => setSelectedPrompt(prompt)}
          >
            <h4 className="font-medium mb-2">{prompt.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {prompt.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {prompt.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Prompt Detail Modal */}
      {selectedPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
            <h4 className="text-xl font-semibold mb-4">{selectedPrompt.title}</h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-medium mb-2">Prompt:</h5>
                <p className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
                  {selectedPrompt.prompt}
                </p>
              </div>
              {selectedPrompt.sampleOutput && (
                <div>
                  <h5 className="font-medium mb-2">Sample Output:</h5>
                  <p className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
                    {selectedPrompt.sampleOutput}
                  </p>
                </div>
              )}
              <button
                onClick={() => setSelectedPrompt(null)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};