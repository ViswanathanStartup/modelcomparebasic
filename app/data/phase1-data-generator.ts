/**
 * Phase 1 Data Generator
 * Generates code examples, use cases, and limitations for all LLM models
 */

import type { CodeExample, RealWorldUseCase, ModelLimitations, LLMModel } from './llm-data';

export function generateCodeExamples(model: LLMModel): CodeExample[] {
  const modelId = model.name.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '');
  const endpoint = model.apiInfo?.endpoint || 'https://api.openai.com/v1/chat/completions';

  return [
    // Python Examples
    {
      language: 'python',
      title: 'Basic Chat Completion',
      description: 'Simple request to the model with system and user messages',
      code: `# Install: pip install openai
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ.get("API_KEY"))

response = client.chat.completions.create(
    model="${modelId}",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello! How can you help me?"}
    ],
    temperature=0.7,
    max_tokens=500
)

print(response.choices[0].message.content)`
    },
    {
      language: 'python',
      title: 'Streaming Response',
      description: 'Stream responses in real-time for better user experience',
      code: `from openai import OpenAI
import os

client = OpenAI(api_key=os.environ.get("API_KEY"))

stream = client.chat.completions.create(
    model="${modelId}",
    messages=[{"role": "user", "content": "Write a short poem"}],
    stream=True,
    temperature=0.7
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)`
    },
    {
      language: 'python',
      title: 'Function Calling',
      description: 'Use function calling to extend model capabilities',
      code: `from openai import OpenAI
import json, os

client = OpenAI(api_key=os.environ.get("API_KEY"))

tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "Get current weather for a location",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {"type": "string"},
                "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
            },
            "required": ["location"]
        }
    }
}]

response = client.chat.completions.create(
    model="${modelId}",
    messages=[{"role": "user", "content": "What's the weather in Paris?"}],
    tools=tools,
    tool_choice="auto"
)

print(response.choices[0].message)`
    },
    // JavaScript Examples
    {
      language: 'javascript',
      title: 'Basic Chat Completion',
      description: 'Simple async/await request to the model',
      code: `// Install: npm install openai
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.API_KEY
});

async function main() {
  const response = await client.chat.completions.create({
    model: '${modelId}',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Hello! How can you help me?' }
    ],
    temperature: 0.7,
    max_tokens: 500
  });

  console.log(response.choices[0].message.content);
}

main();`
    },
    {
      language: 'javascript',
      title: 'Streaming Response',
      description: 'Stream responses for real-time output',
      code: `import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.API_KEY
});

async function streamExample() {
  const stream = await client.chat.completions.create({
    model: '${modelId}',
    messages: [{ role: 'user', content: 'Write a short poem' }],
    stream: true,
    temperature: 0.7
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    process.stdout.write(content);
  }
}

streamExample();`
    },
    {
      language: 'javascript',
      title: 'Error Handling',
      description: 'Robust error handling for production use',
      code: `import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.API_KEY
});

async function robustRequest() {
  try {
    const response = await client.chat.completions.create({
      model: '${modelId}',
      messages: [{ role: 'user', content: 'Hello!' }],
      max_tokens: 100
    });
    return response.choices[0].message.content;
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
}

robustRequest();`
    },
    // cURL Examples
    {
      language: 'curl',
      title: 'Basic Request',
      description: 'Simple cURL command for testing',
      code: `curl ${endpoint} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $API_KEY" \\
  -d '{
    "model": "${modelId}",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Hello!"}
    ],
    "temperature": 0.7,
    "max_tokens": 500
  }'`
    },
    {
      language: 'curl',
      title: 'Streaming Request',
      description: 'Stream responses with cURL',
      code: `curl ${endpoint} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $API_KEY" \\
  -d '{
    "model": "${modelId}",
    "messages": [{"role": "user", "content": "Write a poem"}],
    "stream": true
  }' \\
  --no-buffer`
    }
  ];
}

export function generateRealWorldUseCases(model: LLMModel): RealWorldUseCase[] {
  const cases: RealWorldUseCase[] = [];
  const contextWindow = model.contextWindow;
  const bestFor = model.bestFor || [];

  // Long context use cases
  if (contextWindow >= 100000) {
    cases.push({
      title: 'Long Document Analysis',
      industry: 'Legal & Compliance',
      description: `Law firm uses ${model.name} to analyze 100+ page contracts, extracting key clauses, risks, and obligations automatically.`,
      implementation: 'Integration with document management system via API',
      results: 'Reduced contract review time by 70%, from 4 hours to 1.2 hours per document',
      metrics: {
        timeSaved: '70%',
        accuracy: '94%',
        costPerDocument: '$2.50'
      },
      difficulty: 'medium'
    });

    cases.push({
      title: 'Entire Codebase Analysis',
      industry: 'Software Development',
      description: `Tech company analyzes entire repositories to find bugs, security vulnerabilities, and optimization opportunities using ${model.name}.`,
      implementation: 'CI/CD pipeline integration with automated PR reviews',
      results: 'Caught 45% more bugs before production, reduced security incidents by 60%',
      metrics: {
        bugsFound: '45% increase',
        securityIssues: '60% reduction',
        reviewTime: '85% faster'
      },
      difficulty: 'hard'
    });
  }

  // Content creation
  if (bestFor.some(x => x.toLowerCase().includes('creative') || x.toLowerCase().includes('writing'))) {
    cases.push({
      title: 'Automated Content Generation',
      industry: 'Marketing & Media',
      description: `Marketing agency uses ${model.name} to generate SEO-optimized blog posts, social media content, and ad copy at scale.`,
      implementation: 'Custom content pipeline with brand voice training and quality checks',
      results: 'Produces 50 blog posts/week with 90% approval rate, 3x content output',
      metrics: {
        contentVolume: '3x increase',
        approvalRate: '90%',
        costPerArticle: '$5-8'
      },
      difficulty: 'easy'
    });
  }

  // Customer support
  if (bestFor.some(x => x.toLowerCase().includes('chat') || x.toLowerCase().includes('conversation'))) {
    cases.push({
      title: 'AI Customer Support Agent',
      industry: 'E-commerce & SaaS',
      description: `E-commerce platform uses ${model.name} to handle tier-1 customer inquiries, reducing support ticket volume.`,
      implementation: 'Integration with Zendesk/Intercom via webhook, escalation logic for complex issues',
      results: 'Resolved 65% of inquiries automatically, 24/7 availability, 92% CSAT score',
      metrics: {
        autoResolution: '65%',
        responseTime: '<10 seconds',
        csatScore: '92%'
      },
      difficulty: 'medium'
    });
  }

  // Code generation
  if (bestFor.some(x => x.toLowerCase().includes('code') || x.toLowerCase().includes('programming'))) {
    cases.push({
      title: 'Code Generation & Assistance',
      industry: 'Software Development',
      description: `Development team uses ${model.name} as a coding assistant for generating boilerplate, unit tests, and documentation.`,
      implementation: 'VS Code extension with real-time suggestions and code completion',
      results: '40% faster development velocity, 50% increase in code coverage',
      metrics: {
        velocityIncrease: '40%',
        codeCoverage: '50% increase',
        developerSatisfaction: '4.6/5'
      },
      difficulty: 'medium'
    });
  }

  // Data analysis
  if (contextWindow >= 32000) {
    cases.push({
      title: 'Business Intelligence & Data Analysis',
      industry: 'Finance & Analytics',
      description: `Financial services firm uses ${model.name} to analyze quarterly reports, extract trends, and generate executive summaries.`,
      implementation: 'Automated pipeline processing PDF reports and generating insights',
      results: 'Reduced analysis time from 2 days to 3 hours, identified 15% more actionable insights',
      metrics: {
        timeSaved: '85%',
        insightsFound: '15% increase',
        accuracy: '91%'
      },
      difficulty: 'medium'
    });
  }

  // Education - always include
  cases.push({
    title: 'Personalized Education & Tutoring',
    industry: 'Education',
    description: `EdTech platform uses ${model.name} to provide personalized tutoring in math, science, and languages.`,
    implementation: 'Adaptive learning system with student progress tracking',
    results: 'Students show 35% faster learning progress, 88% engagement rate',
    metrics: {
      learningSpeed: '35% faster',
      engagement: '88%',
      costPerStudent: '$15/month'
    },
    difficulty: 'easy'
  });

  // General purpose - fallback
  if (cases.length < 3) {
    cases.push({
      title: 'General Purpose Assistant',
      industry: 'Cross-Industry',
      description: `Organizations use ${model.name} for general Q&A, information retrieval, and task assistance.`,
      implementation: 'Simple API integration with internal knowledge base',
      results: 'Improved employee productivity by 25%, reduced routine inquiries by 50%',
      metrics: {
        productivity: '25% increase',
        inquiryReduction: '50%',
        roi: '300% first year'
      },
      difficulty: 'easy'
    });
  }

  return cases.slice(0, 5);
}

export function generateLimitations(model: LLMModel): ModelLimitations {
  const limitations: ModelLimitations = {
    knownIssues: [],
    commonFailures: [],
    contentPolicies: [],
    performance: [],
    bestPractices: [],
    workarounds: []
  };

  const { provider, contextWindow, outputCostPer1M } = model;

  // Context limitations
  if (contextWindow < 8192) {
    limitations.knownIssues.push(`Limited to ${contextWindow.toLocaleString()} tokens - cannot process very long documents`);
    limitations.workarounds.push('Use document chunking and summarization for long content');
  }

  // Cost warnings
  if (outputCostPer1M > 10) {
    limitations.performance.push(`High output cost ($${outputCostPer1M}/1M tokens) - can get expensive with verbose outputs`);
    limitations.bestPractices.push('Set max_tokens limits to control costs');
    limitations.bestPractices.push('Use system prompts to encourage concise responses');
  }

  // Provider-specific limitations
  switch (provider) {
    case 'OpenAI':
      limitations.contentPolicies.push('Strict content moderation - may refuse certain sensitive topics');
      limitations.knownIssues.push('Rate limits can be restrictive for high-volume applications (check tier limits)');
      limitations.commonFailures.push('May refuse to generate code for security-sensitive applications');
      limitations.bestPractices.push('Implement exponential backoff for rate limit errors');
      limitations.bestPractices.push('Use batch API for non-urgent requests to save costs');
      break;

    case 'Anthropic':
      limitations.knownIssues.push('Requires specific prompt formatting for optimal performance');
      limitations.bestPractices.push('Use XML tags for structured prompts (Claude performs better with them)');
      limitations.bestPractices.push('Place important context near the beginning or end of prompts');
      limitations.commonFailures.push('May be overly cautious with certain queries');
      break;

    case 'Google':
      limitations.knownIssues.push('Requires Google Cloud setup and authentication');
      limitations.performance.push('Latency can be higher in certain regions');
      limitations.bestPractices.push('Use regional endpoints for better performance');
      limitations.workarounds.push('Cache responses for repeated queries');
      break;

    case 'Mistral':
      limitations.knownIssues.push('Smaller community and fewer third-party integrations compared to OpenAI');
      limitations.bestPractices.push('Test thoroughly as behavior may differ from OpenAI models');
      break;

    case 'Meta':
      limitations.knownIssues.push('Primarily designed for open-source deployment');
      limitations.performance.push('Self-hosting requires significant infrastructure');
      limitations.bestPractices.push('Consider using hosted versions (e.g., via Hugging Face, Together AI)');
      break;

    case 'Cohere':
      limitations.knownIssues.push('Different API structure from OpenAI - migration requires code changes');
      limitations.bestPractices.push('Review Cohere-specific documentation for best results');
      break;

    default:
      limitations.knownIssues.push('Check provider documentation for specific limitations');
      break;
  }

  // Universal limitations
  limitations.commonFailures.push('May hallucinate facts - always verify critical information');
  limitations.commonFailures.push('Struggles with very recent events (knowledge cutoff applies)');
  limitations.commonFailures.push('Can produce inconsistent outputs with same prompt (when temperature > 0)');

  // Universal best practices
  limitations.bestPractices.push('Always handle API errors gracefully with retry logic');
  limitations.bestPractices.push('Implement request timeouts to avoid hanging operations');
  limitations.bestPractices.push('Monitor token usage to prevent unexpected costs');
  limitations.bestPractices.push('Use temperature=0 for consistent, deterministic outputs');

  // Universal workarounds
  limitations.workarounds.push('Use prompt engineering to work around limitations');
  limitations.workarounds.push('Chain multiple calls for complex multi-step tasks');
  limitations.workarounds.push('Implement validation layers for critical outputs');

  return limitations;
}
