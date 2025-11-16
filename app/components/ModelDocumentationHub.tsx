'use client';

import { useState } from 'react';
import { X, Book, FileText, Search, ExternalLink, Sparkles, Code, Zap, Image as ImageIcon, MessageSquare } from 'lucide-react';

interface ModelDocumentationHubProps {
  onClose: () => void;
}

interface DocResource {
  provider: string;
  genre: 'chat' | 'reasoning' | 'vision' | 'coding' | 'embedding';
  genreLabel: string;
  mainDocsUrl: string;
  apiDocsUrl: string;
  pricingUrl: string;
  modelsUrl?: string;
  description: string;
  models: string[];
}

export const ModelDocumentationHub = ({ onClose }: ModelDocumentationHubProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');

  // Comprehensive Official Documentation organized by genre
  const documentationResources: DocResource[] = [
    // OpenAI - Chat Models
    {
      provider: 'OpenAI',
      genre: 'chat',
      genreLabel: 'Chat Models',
      mainDocsUrl: 'https://platform.openai.com/docs/models',
      apiDocsUrl: 'https://platform.openai.com/docs/api-reference/chat',
      pricingUrl: 'https://openai.com/api/pricing/',
      description: 'GPT models for conversational AI and text generation',
      models: ['GPT-4o', 'GPT-4 Turbo', 'GPT-4', 'GPT-3.5 Turbo']
    },
    // OpenAI - Reasoning Models
    {
      provider: 'OpenAI',
      genre: 'reasoning',
      genreLabel: 'Reasoning Models',
      mainDocsUrl: 'https://platform.openai.com/docs/models#o1',
      apiDocsUrl: 'https://platform.openai.com/docs/guides/reasoning',
      pricingUrl: 'https://openai.com/api/pricing/',
      description: 'Advanced reasoning models for complex problem-solving',
      models: ['o1', 'o1-preview', 'o1-mini']
    },
    // Anthropic - Chat Models
    {
      provider: 'Anthropic',
      genre: 'chat',
      genreLabel: 'Chat Models',
      mainDocsUrl: 'https://docs.anthropic.com/en/docs/models-overview',
      apiDocsUrl: 'https://docs.anthropic.com/en/api/messages',
      pricingUrl: 'https://www.anthropic.com/pricing',
      description: 'Claude models for safe and helpful AI assistance',
      models: ['Claude 3.5 Sonnet', 'Claude 3.5 Haiku', 'Claude 3 Opus', 'Claude 3 Sonnet', 'Claude 3 Haiku']
    },
    // Anthropic - Vision Models
    {
      provider: 'Anthropic',
      genre: 'vision',
      genreLabel: 'Vision Models',
      mainDocsUrl: 'https://docs.anthropic.com/en/docs/vision',
      apiDocsUrl: 'https://docs.anthropic.com/en/api/messages',
      pricingUrl: 'https://www.anthropic.com/pricing',
      description: 'Claude models with image understanding capabilities',
      models: ['Claude 3.5 Sonnet', 'Claude 3 Opus', 'Claude 3 Sonnet', 'Claude 3 Haiku']
    },
    // Google - Chat Models
    {
      provider: 'Google',
      genre: 'chat',
      genreLabel: 'Chat Models',
      mainDocsUrl: 'https://ai.google.dev/gemini-api/docs',
      apiDocsUrl: 'https://ai.google.dev/api/generate-content',
      pricingUrl: 'https://ai.google.dev/pricing',
      modelsUrl: 'https://ai.google.dev/gemini-api/docs/models/gemini',
      description: 'Gemini models for multimodal AI applications',
      models: ['Gemini 1.5 Pro', 'Gemini 1.5 Flash', 'Gemini 2.0 Flash']
    },
    // Google - Vision Models
    {
      provider: 'Google',
      genre: 'vision',
      genreLabel: 'Vision & Multimodal',
      mainDocsUrl: 'https://ai.google.dev/gemini-api/docs/vision',
      apiDocsUrl: 'https://ai.google.dev/api/generate-content',
      pricingUrl: 'https://ai.google.dev/pricing',
      description: 'Gemini multimodal models for vision and audio',
      models: ['Gemini 1.5 Pro', 'Gemini 1.5 Flash', 'Gemini 2.0 Flash']
    },
    // Mistral - Chat Models
    {
      provider: 'Mistral',
      genre: 'chat',
      genreLabel: 'Chat Models',
      mainDocsUrl: 'https://docs.mistral.ai/',
      apiDocsUrl: 'https://docs.mistral.ai/api/',
      pricingUrl: 'https://docs.mistral.ai/platform/pricing/',
      description: 'Mistral models for efficient and powerful language understanding',
      models: ['Mistral Large 2', 'Mistral Small', 'Mixtral 8x7B', 'Mixtral 8x22B']
    },
    // Mistral - Coding Models
    {
      provider: 'Mistral',
      genre: 'coding',
      genreLabel: 'Coding Models',
      mainDocsUrl: 'https://docs.mistral.ai/capabilities/code_generation/',
      apiDocsUrl: 'https://docs.mistral.ai/api/',
      pricingUrl: 'https://docs.mistral.ai/platform/pricing/',
      description: 'Specialized models for code generation and understanding',
      models: ['Codestral', 'Mistral Large 2']
    },
    // Cohere - Chat Models
    {
      provider: 'Cohere',
      genre: 'chat',
      genreLabel: 'Chat Models',
      mainDocsUrl: 'https://docs.cohere.com/docs/models',
      apiDocsUrl: 'https://docs.cohere.com/reference/chat',
      pricingUrl: 'https://cohere.com/pricing',
      description: 'Command models optimized for conversational AI',
      models: ['Command R+', 'Command R', 'Command']
    },
    // Cohere - Embedding Models
    {
      provider: 'Cohere',
      genre: 'embedding',
      genreLabel: 'Embedding Models',
      mainDocsUrl: 'https://docs.cohere.com/docs/embeddings',
      apiDocsUrl: 'https://docs.cohere.com/reference/embed',
      pricingUrl: 'https://cohere.com/pricing',
      description: 'Embedding models for semantic search and retrieval',
      models: ['Embed v3', 'Embed English', 'Embed Multilingual']
    },
    // Meta - Chat Models
    {
      provider: 'Meta',
      genre: 'chat',
      genreLabel: 'Chat Models',
      mainDocsUrl: 'https://llama.meta.com/docs/overview',
      apiDocsUrl: 'https://llama.meta.com/docs/model-cards-and-prompt-formats/llama3_1',
      pricingUrl: 'https://llama.meta.com/',
      description: 'Open-source Llama models for various applications',
      models: ['Llama 3.3 70B', 'Llama 3.1 405B', 'Llama 3.1 70B', 'Llama 3.1 8B']
    },
    // xAI - Chat Models
    {
      provider: 'xAI',
      genre: 'chat',
      genreLabel: 'Chat Models',
      mainDocsUrl: 'https://docs.x.ai/docs',
      apiDocsUrl: 'https://docs.x.ai/api',
      pricingUrl: 'https://x.ai/api',
      description: 'Grok models with real-time knowledge and reasoning',
      models: ['Grok Beta', 'Grok 2']
    },
    // Perplexity - Chat Models
    {
      provider: 'Perplexity',
      genre: 'chat',
      genreLabel: 'Chat & Search',
      mainDocsUrl: 'https://docs.perplexity.ai/',
      apiDocsUrl: 'https://docs.perplexity.ai/reference/post_chat_completions',
      pricingUrl: 'https://docs.perplexity.ai/docs/pricing',
      description: 'Sonar models with integrated web search capabilities',
      models: ['Sonar Pro', 'Sonar', 'Sonar Turbo']
    },
  ];

  const genres = [
    { key: 'all', label: 'All Documentation', icon: <Book className="w-4 h-4" /> },
    { key: 'chat', label: 'Chat Models', icon: <MessageSquare className="w-4 h-4" /> },
    { key: 'reasoning', label: 'Reasoning Models', icon: <Sparkles className="w-4 h-4" /> },
    { key: 'vision', label: 'Vision & Multimodal', icon: <ImageIcon className="w-4 h-4" /> },
    { key: 'coding', label: 'Coding Models', icon: <Code className="w-4 h-4" /> },
    { key: 'embedding', label: 'Embeddings', icon: <Zap className="w-4 h-4" /> },
  ];

  const filteredDocs = documentationResources.filter(doc => {
    const matchesGenre = selectedGenre === 'all' || doc.genre === selectedGenre;
    const matchesSearch = searchQuery === '' ||
      doc.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.models.some(m => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-4 sm:p-6 max-w-7xl w-full max-h-[90vh] overflow-y-auto my-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Book className="w-7 h-7 text-blue-600" />
              Official Documentation
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Direct links to official provider documentation and resources
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by provider, model, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Genre Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {genres.map(genre => (
            <button
              key={genre.key}
              onClick={() => setSelectedGenre(genre.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedGenre === genre.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {genre.icon}
              {genre.label}
            </button>
          ))}
        </div>

        {/* Documentation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map((doc, index) => (
            <div
              key={index}
              className="p-5 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {doc.provider}
                  </h3>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {doc.genreLabel}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {doc.description}
              </p>

              {/* Models */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Models:</p>
                <div className="flex flex-wrap gap-2">
                  {doc.models.map((model, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded"
                    >
                      {model}
                    </span>
                  ))}
                </div>
              </div>

              {/* Documentation Links */}
              <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-3">
                <a
                  href={doc.mainDocsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Main Documentation</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                </a>

                <a
                  href={doc.apiDocsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">API Reference</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                </a>

                <a
                  href={doc.pricingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Pricing</span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                </a>

                {doc.modelsUrl && (
                  <a
                    href={doc.modelsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 bg-amber-50 dark:bg-amber-900/20 rounded hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors group"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Model Details</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-amber-600" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredDocs.length === 0 && (
          <div className="text-center py-12">
            <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No documentation found matching your search
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
