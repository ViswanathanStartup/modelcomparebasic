'use client';

import { useState } from 'react';
import { type LLMModel } from '../app/data/llm-data';
import { ClipboardCopy, Laptop, Check } from 'lucide-react';

interface Props {
  model: LLMModel | null;
}

type Language = 'python' | 'node' | 'curl';

export function APIIntegrationHelper({ model }: Props) {
  const [language, setLanguage] = useState<Language>('python');
  const [copied, setCopied] = useState(false);

  if (!model) {
    return (
      <div className="text-center py-8 text-gray-600 dark:text-gray-400">
        <Laptop className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Select a model to view integration guide.</p>
      </div>
    );
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCode = () => {
    switch (language) {
      case 'python':
        return `from openai import OpenAI

client = OpenAI(api_key="your_api_key")

response = client.chat.completions.create(
    model="${model.id}",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Your prompt here"}
    ],
    max_tokens=150,
    temperature=0.7
)

print(response.choices[0].message.content)`;

      case 'node':
        return `import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'your_api_key'
});

async function main() {
  const completion = await client.chat.completions.create({
    model: "${model.id}",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "Your prompt here" }
    ],
    max_tokens: 150,
    temperature: 0.7
  });

  console.log(completion.choices[0].message.content);
}

main();`;

      case 'curl':
        return `curl https://api.openai.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer your_api_key" \\
  -d '{
    "model": "${model.id}",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Your prompt here"}
    ],
    "max_tokens": 150,
    "temperature": 0.7
  }'`;
    }
  };

  const code = getCode();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Integration Steps</h3>
        <ol className="space-y-3 list-decimal list-inside text-gray-700 dark:text-gray-300">
          <li>
            {model.provider === 'OpenAI' ? (
              <>Get your API key from <a href="https://platform.openai.com/api-keys" className="text-blue-600 hover:underline">OpenAI Platform</a></>
            ) : (
              <>Obtain your API key from {model.provider}&apos;s developer portal</>
            )}
          </li>
          <li>Install the official SDK for your preferred language</li>
          <li>Use the code sample below as a starting point</li>
          <li>Adjust parameters like temperature and max_tokens based on your needs</li>
        </ol>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">Code Sample</h3>
          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
            >
              <option value="python">Python</option>
              <option value="node">Node.js</option>
              <option value="curl">cURL</option>
            </select>
            <button
              onClick={() => copyCode(code)}
              className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <ClipboardCopy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
        <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-sm">
          <code>{code}</code>
        </pre>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Model Details</h4>
        <ul className="space-y-1">
          <li>Context Window: {model.contextWindow.toLocaleString()} tokens</li>
          <li>Input Cost: ${model.inputCostPer1M}/1M tokens</li>
          <li>Output Cost: ${model.outputCostPer1M}/1M tokens</li>
          {model.released && <li>Release Date: {model.released}</li>}
        </ul>
      </div>
    </div>
  );
}