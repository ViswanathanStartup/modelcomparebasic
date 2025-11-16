'use client';

import { useState } from 'react';

export const TokenCounter = () => {
  const [text, setText] = useState('');
  
  // This is a simple estimation. For production, you'd want to use a proper tokenizer
  const estimateTokens = (text: string): number => {
    // Rough estimate: 4 characters per token
    return Math.ceil(text.length / 4);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Token Estimator</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="text" className="block text-sm font-medium mb-1">
            Enter your text
          </label>
          <textarea
            id="text"
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter your prompt or text here..."
          />
        </div>
        <div className="pt-4 border-t">
          <p className="text-lg">
            Estimated Tokens: <span className="font-semibold">{estimateTokens(text)}</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Note: This is a rough estimation. Actual token count may vary by model.
          </p>
        </div>
      </div>
    </div>
  );
};