'use client';

import { useState } from 'react';
import { LLMModel } from '../data/llm-data';
import { CodeTemplate } from '../types/features';

const CODE_TEMPLATES: Record<string, CodeTemplate[]> = {
  'OpenAI': [
    {
      language: 'Python',
      code: `from openai import OpenAI

client = OpenAI()
response = client.chat.completions.create(
    model="MODEL_ID",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello!"}
    ]
)
print(response.choices[0].message.content)`,
      description: 'Basic chat completion with OpenAI'
    },
    {
      language: 'JavaScript',
      code: `import OpenAI from 'openai';

const openai = new OpenAI();
const response = await openai.chat.completions.create({
  model: 'MODEL_ID',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello!' }
  ]
});
console.log(response.choices[0].message.content);`,
      description: 'Basic chat completion with OpenAI'
    }
  ],
  'Anthropic': [
    {
      language: 'Python',
      code: `from anthropic import Anthropic

anthropic = Anthropic()
message = anthropic.messages.create(
    model="MODEL_ID",
    max_tokens=1000,
    messages=[
        {"role": "user", "content": "Hello!"}
    ]
)
print(message.content)`,
      description: 'Basic chat with Anthropic Claude'
    },
    {
      language: 'JavaScript',
      code: `import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();
const message = await anthropic.messages.create({
  model: 'MODEL_ID',
  max_tokens: 1000,
  messages: [{ role: 'user', content: 'Hello!' }]
});
console.log(message.content);`,
      description: 'Basic chat with Anthropic Claude'
    }
  ],
  'Google': [
    {
      language: 'Python',
      code: `import google.generativeai as genai

genai.configure(api_key='YOUR_API_KEY')
model = genai.GenerativeModel('MODEL_ID')
response = model.generate_content('Hello!')
print(response.text)`,
      description: 'Basic text generation with Google AI'
    },
    {
      language: 'JavaScript',
      code: `import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('YOUR_API_KEY');
const model = genAI.getGenerativeModel({ model: 'MODEL_ID' });
const result = await model.generateContent('Hello!');
console.log(result.response.text());`,
      description: 'Basic text generation with Google AI'
    }
  ]
};

interface APIIntegrationHelperProps {
  model: LLMModel;
}

export const APIIntegrationHelper = ({ model }: APIIntegrationHelperProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Python');
  
  const templates = CODE_TEMPLATES[model.provider] || [];
  const template = templates.find(t => t.language === selectedLanguage);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text.replace('MODEL_ID', model.id));
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">API Integration Guide</h2>

      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-2">
            Programming Language
          </label>
          <select
            className="w-full px-3 py-2 border rounded"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {Array.from(new Set(templates.map(t => t.language))).map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        {template && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">{template.description}</h3>
              <button
                onClick={() => copyToClipboard(template.code)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Copy Code
              </button>
            </div>
            <pre className="p-4 bg-gray-100 dark:bg-gray-900 rounded overflow-x-auto">
              <code>{template.code.replace('MODEL_ID', model.id)}</code>
            </pre>
          </div>
        )}

        <div className="mt-6">
          <h3 className="font-medium mb-2">Setup Instructions</h3>
          <div className="space-y-2">
            <p className="text-sm">1. Install the required SDK:</p>
            <pre className="p-2 bg-gray-100 dark:bg-gray-900 rounded">
              {selectedLanguage === 'Python' ? (
                <code>pip install {model.provider.toLowerCase()}</code>
              ) : (
                <code>npm install {model.provider.toLowerCase()}</code>
              )}
            </pre>
            
            <p className="text-sm">2. Set up your API key:</p>
            <pre className="p-2 bg-gray-100 dark:bg-gray-900 rounded">
              {selectedLanguage === 'Python' ? (
                <code>export {model.provider.toUpperCase()}_API_KEY=&apos;your_api_key&apos;</code>
              ) : (
                <code>NEXT_PUBLIC_{model.provider.toUpperCase()}_API_KEY=&apos;your_api_key&apos;</code>
              )}
            </pre>
            
            <p className="text-sm">3. Copy the code above and customize it for your needs.</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-medium mb-2">Additional Resources</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>
              <a href="#" className="text-blue-500 hover:underline">
                {model.provider} API Documentation
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-500 hover:underline">
                SDK Reference
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-500 hover:underline">
                Code Examples Repository
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};