'use client';

import React, { useState } from 'react';
import { type LLMModel } from '../data/llm-data';
import { CodeExamplesSection, RealWorldUseCasesSection, LimitationsSection } from './Phase1Features';
import {
  Book, Tag, Zap, Calendar, Link, ArrowUpRight, Award, Clock,
  DollarSign, FileText, TrendingUp, Code, Copy, Check, ChevronDown, ChevronUp,
  Sparkles, AlertCircle, Globe
} from 'lucide-react';
import { ExportButton } from './ExportButton';

interface ModelDetailsCardProps {
  model: LLMModel;
}

export function ModelDetailsCard({ model }: ModelDetailsCardProps) {
  const [showRaw, setShowRaw] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);
  const formatCost = (cost: number) => (cost < 1 ? `$${cost.toFixed(3)}` : `$${cost.toFixed(2)}`);
  const calculateBooksInContext = (tokens: number) => Math.floor(tokens / 100000);

  const computeQualityScore = (m: LLMModel) => {
    if (typeof m.qualityScore === 'number') return m.qualityScore;
    const b = m.benchmarks;
    if (!b) return undefined;
    const mmlu = typeof b.mmlu === 'number' ? b.mmlu : 0;
    const human = typeof b.humanEval === 'number' ? b.humanEval : 0;

    // Normalize scores to 0-10 scale
    const normalizedMmlu = (mmlu / 100) * 10;
    const normalizedHuman = (human / 100) * 10;

    // Weighted average: MMLU 60%, HumanEval 40%
    const score = (normalizedMmlu * 0.6) + (normalizedHuman * 0.4);

    return Math.min(10, Math.max(0, Math.round(score * 10) / 10));
  };

  const computedQuality = computeQualityScore(model);

  const getQualityColor = (score: number | undefined) => {
    if (!score) return 'bg-gray-500';
    if (score >= 9) return 'bg-gradient-to-br from-emerald-500 to-green-600';
    if (score >= 8) return 'bg-gradient-to-br from-green-500 to-emerald-500';
    if (score >= 7) return 'bg-gradient-to-br from-blue-500 to-cyan-500';
    if (score >= 6) return 'bg-gradient-to-br from-yellow-500 to-amber-500';
    return 'bg-gradient-to-br from-orange-500 to-red-500';
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const getPythonCodeSample = () => {
    const provider = model.provider;

    if (provider === 'OpenAI' || provider === 'Azure OpenAI') {
      return `from openai import OpenAI

client = OpenAI(api_key="your-api-key-here")

response = client.chat.completions.create(
    model="${model.id}",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello! Tell me about yourself."}
    ],
    max_tokens=1000,
    temperature=0.7
)

print(response.choices[0].message.content)`;
    } else if (provider === 'Anthropic') {
      return `from anthropic import Anthropic

client = Anthropic(api_key="your-api-key-here")

response = client.messages.create(
    model="${model.id}",
    max_tokens=1000,
    messages=[
        {"role": "user", "content": "Hello! Tell me about yourself."}
    ],
    temperature=0.7
)

print(response.content[0].text)`;
    } else if (provider === 'Google') {
      return `import google.generativeai as genai

genai.configure(api_key="your-api-key-here")

model = genai.GenerativeModel('${model.id}')
response = model.generate_content("Hello! Tell me about yourself.")

print(response.text)`;
    } else if (provider === 'Cohere') {
      return `import cohere

co = cohere.Client(api_key="your-api-key-here")

response = co.chat(
    model="${model.id}",
    message="Hello! Tell me about yourself.",
    temperature=0.7
)

print(response.text)`;
    } else if (provider === 'AWS') {
      return `import boto3
import json

bedrock = boto3.client(
    service_name='bedrock-runtime',
    region_name='us-east-1'
)

body = json.dumps({
    "prompt": "Hello! Tell me about yourself.",
    "max_tokens": 1000,
    "temperature": 0.7
})

response = bedrock.invoke_model(
    modelId="${model.id}",
    body=body
)

response_body = json.loads(response['body'].read())
print(response_body)`;
    } else if (provider === 'Meta') {
      return `# Meta models are typically accessed through platforms like Hugging Face or Replicate
from transformers import AutoTokenizer, AutoModelForCausalLM

tokenizer = AutoTokenizer.from_pretrained("${model.id}")
model = AutoModelForCausalLM.from_pretrained("${model.id}")

inputs = tokenizer("Hello! Tell me about yourself.", return_tensors="pt")
outputs = model.generate(**inputs, max_length=1000)

print(tokenizer.decode(outputs[0], skip_special_tokens=True))`;
    } else if (provider === 'Mistral') {
      return `from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage

client = MistralClient(api_key="your-api-key-here")

response = client.chat(
    model="${model.id}",
    messages=[
        ChatMessage(role="user", content="Hello! Tell me about yourself.")
    ],
    temperature=0.7
)

print(response.choices[0].message.content)`;
    } else if (provider === 'xAI') {
      return `from openai import OpenAI

# xAI uses OpenAI-compatible API
client = OpenAI(
    api_key="your-xai-api-key-here",
    base_url="https://api.x.ai/v1"
)

response = client.chat.completions.create(
    model="${model.id}",
    messages=[
        {"role": "system", "content": "You are Grok, a helpful assistant."},
        {"role": "user", "content": "Hello! Tell me about yourself."}
    ],
    max_tokens=1000,
    temperature=0.7
)

print(response.choices[0].message.content)`;
    } else if (provider === 'DeepSeek') {
      return `from openai import OpenAI

# DeepSeek uses OpenAI-compatible API
client = OpenAI(
    api_key="your-deepseek-api-key-here",
    base_url="https://api.deepseek.com"
)

response = client.chat.completions.create(
    model="${model.id}",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello! Tell me about yourself."}
    ],
    max_tokens=1000,
    temperature=0.7
)

print(response.choices[0].message.content)`;
    } else if (provider === 'Perplexity') {
      return `from openai import OpenAI

# Perplexity uses OpenAI-compatible API
client = OpenAI(
    api_key="your-perplexity-api-key-here",
    base_url="https://api.perplexity.ai"
)

response = client.chat.completions.create(
    model="${model.id}",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello! Tell me about yourself."}
    ],
    max_tokens=1000,
    temperature=0.7
)

print(response.choices[0].message.content)`;
    } else if (provider === 'Together AI' || provider === 'Together') {
      return `from openai import OpenAI

# Together AI uses OpenAI-compatible API
client = OpenAI(
    api_key="your-together-api-key-here",
    base_url="https://api.together.xyz/v1"
)

response = client.chat.completions.create(
    model="${model.id}",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello! Tell me about yourself."}
    ],
    max_tokens=1000,
    temperature=0.7
)

print(response.choices[0].message.content)`;
    } else if (provider === 'AI21') {
      return `import requests

url = "https://api.ai21.com/studio/v1/chat/completions"

headers = {
    "Authorization": "Bearer your-api-key-here",
    "Content-Type": "application/json"
}

data = {
    "model": "${model.id}",
    "messages": [
        {"role": "user", "content": "Hello! Tell me about yourself."}
    ],
    "max_tokens": 1000,
    "temperature": 0.7
}

response = requests.post(url, json=data, headers=headers)
print(response.json()["choices"][0]["message"]["content"])`;
    } else if (provider === 'Alibaba') {
      return `from dashscope import Generation

# Alibaba Cloud DashScope API
response = Generation.call(
    api_key="your-api-key-here",
    model="${model.id}",
    messages=[
        {"role": "user", "content": "Hello! Tell me about yourself."}
    ],
    result_format="message"
)

print(response.output.choices[0].message.content)`;
    } else if (provider === 'Databricks') {
      return `from openai import OpenAI

# Databricks uses OpenAI-compatible API
client = OpenAI(
    api_key="your-databricks-token-here",
    base_url="https://<workspace-url>/serving-endpoints"
)

response = client.chat.completions.create(
    model="${model.id}",
    messages=[
        {"role": "user", "content": "Hello! Tell me about yourself."}
    ],
    max_tokens=1000
)

print(response.choices[0].message.content)`;
    } else if (provider === 'Nvidia') {
      return `from openai import OpenAI

# Nvidia NIM uses OpenAI-compatible API
client = OpenAI(
    api_key="your-nvidia-api-key-here",
    base_url="https://integrate.api.nvidia.com/v1"
)

response = client.chat.completions.create(
    model="${model.id}",
    messages=[
        {"role": "user", "content": "Hello! Tell me about yourself."}
    ],
    max_tokens=1000,
    temperature=0.7
)

print(response.choices[0].message.content)`;
    } else if (provider === 'Reka') {
      return `import requests

url = "https://api.reka.ai/v1/chat"

headers = {
    "X-Api-Key": "your-reka-api-key-here",
    "Content-Type": "application/json"
}

data = {
    "model": "${model.id}",
    "messages": [
        {"role": "user", "content": "Hello! Tell me about yourself."}
    ],
    "temperature": 0.7
}

response = requests.post(url, json=data, headers=headers)
print(response.json()["responses"][0]["message"]["content"])`;
    } else if (provider === '01.AI') {
      return `from openai import OpenAI

# 01.AI uses OpenAI-compatible API
client = OpenAI(
    api_key="your-01ai-api-key-here",
    base_url="https://api.01.ai/v1"
)

response = client.chat.completions.create(
    model="${model.id}",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello! Tell me about yourself."}
    ],
    max_tokens=1000,
    temperature=0.7
)

print(response.choices[0].message.content)`;
    } else if (provider === 'Writer') {
      return `from openai import OpenAI

# Writer uses OpenAI-compatible API
client = OpenAI(
    api_key="your-writer-api-key-here",
    base_url="https://api.writer.com/v1"
)

response = client.chat.completions.create(
    model="${model.id}",
    messages=[
        {"role": "user", "content": "Hello! Tell me about yourself."}
    ],
    max_tokens=1000,
    temperature=0.7
)

print(response.choices[0].message.content)`;
    } else if (provider === 'Inflection') {
      return `import requests

url = "https://api.inflection.ai/v1/chat/completions"

headers = {
    "Authorization": "Bearer your-api-key-here",
    "Content-Type": "application/json"
}

data = {
    "model": "${model.id}",
    "messages": [
        {"role": "user", "content": "Hello! Tell me about yourself."}
    ],
    "max_tokens": 1000,
    "temperature": 0.7
}

response = requests.post(url, json=data, headers=headers)
print(response.json()["choices"][0]["message"]["content"])`;
    } else if (provider === 'Hugging Face') {
      return `from huggingface_hub import InferenceClient

client = InferenceClient(token="your-hf-token-here")

response = client.chat_completion(
    model="${model.id}",
    messages=[
        {"role": "user", "content": "Hello! Tell me about yourself."}
    ],
    max_tokens=1000,
    temperature=0.7
)

print(response.choices[0].message.content)`;
    } else if (provider === 'Stability AI') {
      return `import requests

url = "https://api.stability.ai/v2beta/chat/completions"

headers = {
    "Authorization": "Bearer your-stability-api-key-here",
    "Content-Type": "application/json"
}

data = {
    "model": "${model.id}",
    "messages": [
        {"role": "user", "content": "Hello! Tell me about yourself."}
    ],
    "max_tokens": 1000
}

response = requests.post(url, json=data, headers=headers)
print(response.json()["choices"][0]["message"]["content"])`;
    } else if (provider === 'Moonshot') {
      return `from openai import OpenAI

# Moonshot uses OpenAI-compatible API
client = OpenAI(
    api_key="your-moonshot-api-key-here",
    base_url="https://api.moonshot.cn/v1"
)

response = client.chat.completions.create(
    model="${model.id}",
    messages=[
        {"role": "system", "content": "You are Kimi, a helpful assistant."},
        {"role": "user", "content": "Hello! Tell me about yourself."}
    ],
    max_tokens=1000,
    temperature=0.7
)

print(response.choices[0].message.content)`;
    } else if (provider === 'Azure OpenAI') {
      return `from openai import AzureOpenAI

client = AzureOpenAI(
    api_key="your-azure-api-key-here",
    api_version="2024-02-01",
    azure_endpoint="https://your-resource.openai.azure.com"
)

response = client.chat.completions.create(
    model="${model.id}",  # Your deployment name
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello! Tell me about yourself."}
    ],
    max_tokens=1000,
    temperature=0.7
)

print(response.choices[0].message.content)`;
    } else if (provider === 'Zhipu') {
      return `from zhipuai import ZhipuAI

client = ZhipuAI(api_key="your-zhipu-api-key-here")

response = client.chat.completions.create(
    model="${model.id}",
    messages=[
        {"role": "user", "content": "Hello! Tell me about yourself."}
    ],
    temperature=0.7,
    max_tokens=1000
)

print(response.choices[0].message.content)`;
    } else if (provider === 'Baidu') {
      return `import requests

url = "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/${model.id}"

headers = {"Content-Type": "application/json"}

params = {"access_token": "your-baidu-access-token"}

data = {
    "messages": [
        {"role": "user", "content": "Hello! Tell me about yourself."}
    ],
    "temperature": 0.7,
    "max_output_tokens": 1000
}

response = requests.post(url, headers=headers, params=params, json=data)
print(response.json()["result"])`;
    } else if (provider === 'MiniMax') {
      return `import requests

url = "https://api.minimax.chat/v1/text/chatcompletion_v2"

headers = {
    "Authorization": "Bearer your-minimax-api-key-here",
    "Content-Type": "application/json"
}

data = {
    "model": "${model.id}",
    "messages": [
        {"sender_type": "USER", "text": "Hello! Tell me about yourself."}
    ],
    "temperature": 0.7
}

response = requests.post(url, headers=headers, json=data)
print(response.json()["choices"][0]["text"])`;
    } else if (provider === 'SenseTime') {
      return `import requests

url = "https://api.sensenova.cn/v1/llm/chat-completions"

headers = {
    "Authorization": "Bearer your-sensetime-api-key-here",
    "Content-Type": "application/json"
}

data = {
    "model": "${model.id}",
    "messages": [
        {"role": "user", "content": "Hello! Tell me about yourself."}
    ],
    "temperature": 0.7,
    "max_new_tokens": 1000
}

response = requests.post(url, headers=headers, json=data)
print(response.json()["data"]["choices"][0]["message"])`;
    } else if (provider === 'Tencent') {
      return `from openai import OpenAI

# Tencent Hunyuan uses OpenAI-compatible API
client = OpenAI(
    api_key="your-tencent-api-key-here",
    base_url="https://api.hunyuan.cloud.tencent.com/v1"
)

response = client.chat.completions.create(
    model="${model.id}",
    messages=[
        {"role": "user", "content": "Hello! Tell me about yourself."}
    ],
    max_tokens=1000,
    temperature=0.7
)

print(response.choices[0].message.content)`;
    } else if (provider === 'Groq') {
      return `from openai import OpenAI

# Groq uses OpenAI-compatible API
client = OpenAI(
    api_key="your-groq-api-key-here",
    base_url="https://api.groq.com/openai/v1"
)

response = client.chat.completions.create(
    model="${model.id}",
    messages=[
        {"role": "user", "content": "Hello! Tell me about yourself."}
    ],
    max_tokens=1000,
    temperature=0.7
)

print(response.choices[0].message.content)`;
    } else if (provider === 'Fireworks') {
      return `from openai import OpenAI

# Fireworks uses OpenAI-compatible API
client = OpenAI(
    api_key="your-fireworks-api-key-here",
    base_url="https://api.fireworks.ai/inference/v1"
)

response = client.chat.completions.create(
    model="${model.id}",
    messages=[
        {"role": "user", "content": "Hello! Tell me about yourself."}
    ],
    max_tokens=1000,
    temperature=0.7
)

print(response.choices[0].message.content)`;
    } else if (provider === 'Anyscale') {
      return `from openai import OpenAI

# Anyscale uses OpenAI-compatible API
client = OpenAI(
    api_key="your-anyscale-api-key-here",
    base_url="https://api.endpoints.anyscale.com/v1"
)

response = client.chat.completions.create(
    model="${model.id}",
    messages=[
        {"role": "user", "content": "Hello! Tell me about yourself."}
    ],
    max_tokens=1000,
    temperature=0.7
)

print(response.choices[0].message.content)`;
    } else if (provider === 'OpenRouter') {
      return `from openai import OpenAI

# OpenRouter uses OpenAI-compatible API
client = OpenAI(
    api_key="your-openrouter-api-key-here",
    base_url="https://openrouter.ai/api/v1"
)

response = client.chat.completions.create(
    model="${model.id}",
    messages=[
        {"role": "user", "content": "Hello! Tell me about yourself."}
    ],
    max_tokens=1000,
    temperature=0.7
)

print(response.choices[0].message.content)`;
    } else if (provider === 'Replicate') {
      return `import replicate

# Run model on Replicate
output = replicate.run(
    "${model.id}",
    input={
        "prompt": "Hello! Tell me about yourself.",
        "max_length": 1000,
        "temperature": 0.7
    }
)

print("".join(output))`;
    } else if (provider === 'Microsoft') {
      return `from openai import AzureOpenAI

# Microsoft AI uses Azure OpenAI
client = AzureOpenAI(
    api_key="your-microsoft-api-key-here",
    api_version="2024-02-01",
    azure_endpoint="https://your-endpoint.openai.azure.com"
)

response = client.chat.completions.create(
    model="${model.id}",
    messages=[
        {"role": "user", "content": "Hello! Tell me about yourself."}
    ],
    max_tokens=1000,
    temperature=0.7
)

print(response.choices[0].message.content)`;
    } else if (provider === 'Amazon') {
      return `import boto3
import json

# Amazon Bedrock
bedrock = boto3.client(
    service_name='bedrock-runtime',
    region_name='us-east-1'
)

body = json.dumps({
    "prompt": "Hello! Tell me about yourself.",
    "max_tokens": 1000,
    "temperature": 0.7
})

response = bedrock.invoke_model(
    modelId="${model.id}",
    body=body
)

response_body = json.loads(response['body'].read())
print(response_body)`;
    } else if (provider === 'Intel' || provider === 'IBM') {
      return `from openai import OpenAI

# ${provider} uses OpenAI-compatible API
client = OpenAI(
    api_key="your-${provider.toLowerCase()}-api-key-here",
    base_url="https://api.${provider.toLowerCase()}.com/v1"
)

response = client.chat.completions.create(
    model="${model.id}",
    messages=[
        {"role": "user", "content": "Hello! Tell me about yourself."}
    ],
    max_tokens=1000,
    temperature=0.7
)

print(response.choices[0].message.content)`;
    } else if (provider === 'LMSYS' || provider === 'WizardLM') {
      return `from openai import OpenAI

# ${provider} model access via OpenAI-compatible endpoint
client = OpenAI(
    api_key="your-api-key-here",
    base_url="https://api.together.xyz/v1"  # Or your preferred hosting provider
)

response = client.chat.completions.create(
    model="${model.id}",
    messages=[
        {"role": "user", "content": "Hello! Tell me about yourself."}
    ],
    max_tokens=1000,
    temperature=0.7
)

print(response.choices[0].message.content)`;
    } else {
      // Generic code for domain-specific AI providers
      return `from openai import OpenAI

# ${provider} - OpenAI-compatible API endpoint
client = OpenAI(
    api_key="your-api-key-here",
    base_url="https://api.${provider.toLowerCase().replace(/ai$/i, '').replace(/\s+/g, '')}.com/v1"
)

response = client.chat.completions.create(
    model="${model.id}",
    messages=[
        {"role": "user", "content": "Hello! Tell me about yourself."}
    ],
    max_tokens=1000,
    temperature=0.7
)

print(response.choices[0].message.content)

# Note: Please verify the actual API endpoint and authentication method
# with ${provider} official documentation as this is a generic template.`;
    }
  };

  const getInstallCommand = () => {
    const provider = model.provider;
    if (provider === 'OpenAI' || provider === 'Azure OpenAI') {
      return 'pip install openai';
    } else if (provider === 'Anthropic') {
      return 'pip install anthropic';
    } else if (provider === 'Google') {
      return 'pip install google-generativeai';
    } else if (provider === 'Cohere') {
      return 'pip install cohere';
    } else if (provider === 'AWS' || provider === 'Amazon') {
      return 'pip install boto3';
    } else if (provider === 'Meta') {
      return 'pip install transformers torch';
    } else if (provider === 'Mistral') {
      return 'pip install mistralai';
    } else if (provider === 'Zhipu') {
      return 'pip install zhipuai';
    } else if (provider === 'Baidu' || provider === 'MiniMax' || provider === 'SenseTime') {
      return 'pip install requests';
    } else if (provider === 'xAI' || provider === 'DeepSeek' || provider === 'Perplexity' ||
               provider === 'Together AI' || provider === 'Together' || provider === '01.AI' ||
               provider === 'Writer' || provider === 'Databricks' || provider === 'Nvidia' ||
               provider === 'Moonshot' || provider === 'Tencent' || provider === 'Groq' ||
               provider === 'Fireworks' || provider === 'Anyscale' || provider === 'OpenRouter' ||
               provider === 'Microsoft' || provider === 'Intel' || provider === 'IBM' ||
               provider === 'LMSYS' || provider === 'WizardLM') {
      return 'pip install openai';
    } else if (provider === 'AI21' || provider === 'Reka' || provider === 'Inflection' ||
               provider === 'Stability AI') {
      return 'pip install requests';
    } else if (provider === 'Alibaba') {
      return 'pip install dashscope';
    } else if (provider === 'Hugging Face') {
      return 'pip install huggingface-hub';
    } else if (provider === 'Replicate') {
      return 'pip install replicate';
    } else {
      return 'pip install openai requests';
    }
  };

  const SectionHeader = ({ title, icon, sectionKey }: { title: string; icon: React.ReactNode; sectionKey: string }) => {
    const isExpanded = expandedSections.has(sectionKey);
    return (
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 rounded-lg hover:from-blue-100 hover:to-indigo-100 dark:hover:from-gray-750 dark:hover:to-gray-700 transition-all"
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
            {icon}
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        )}
      </button>
    );
  };

  return (
    <article
      role="region"
      aria-labelledby={`model-${model.id}-title`}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-6xl mx-auto"
    >
      {/* Header Section */}
      <header className="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 rounded-t-2xl p-4 text-white">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div className="flex-1">
            <h1 id={`model-${model.id}-title`} className="text-2xl font-bold mb-1">
              {model.name}
            </h1>
            <div className="flex items-center gap-2 text-blue-100 text-sm flex-wrap">
              <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                {model.provider}
              </span>
              {model.released && (
                <span className="flex items-center gap-1 text-xs">
                  <Calendar className="w-3 h-3" />
                  {model.released}
                </span>
              )}
              {/* Status Badges */}
              {model.status?.isNew && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/90 backdrop-blur-sm rounded-full text-xs font-semibold text-white shadow-md">
                  <Sparkles className="w-3 h-3" />
                  New
                </span>
              )}
              {model.status?.pricingUpdated && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/90 backdrop-blur-sm rounded-full text-xs font-semibold text-white shadow-md">
                  <TrendingUp className="w-3 h-3" />
                  Price Updated
                </span>
              )}
              {model.status?.isDeprecated && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500/90 backdrop-blur-sm rounded-full text-xs font-semibold text-white shadow-md">
                  <AlertCircle className="w-3 h-3" />
                  Deprecated
                </span>
              )}
            </div>
            {model.description && (
              <p className="mt-2 text-sm text-blue-50 leading-relaxed">
                {model.description}
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            {computedQuality && (
              <div className={`${getQualityColor(computedQuality)} rounded-xl p-4 text-center min-w-[80px] shadow-lg`}>
                <div className="text-4xl font-bold text-white drop-shadow-lg">{computedQuality}</div>
              </div>
            )}
            <ExportButton models={[model]} context="Model Details" />
          </div>
        </div>
      </header>

      <div className="p-4 space-y-3">
        {/* Overview Section */}
        <div className="space-y-2">
          <SectionHeader title="Overview" icon={<FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />} sectionKey="overview" />
          {expandedSections.has('overview') && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              {model.purpose && (
                <div className="col-span-full bg-white dark:bg-gray-800 p-3 rounded-lg border-l-4 border-blue-500">
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">PRIMARY PURPOSE</div>
                  <div className="text-sm text-gray-900 dark:text-white">{model.purpose}</div>
                </div>
              )}

              {model.bestFor && model.bestFor.length > 0 && (
                <div className="col-span-full bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">BEST FOR</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                    {model.bestFor.map((use, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{use}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {model.keyFeatures && model.keyFeatures.length > 0 && (
                <div className="col-span-full bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-yellow-500" />
                    KEY FEATURES
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                    {model.keyFeatures.map((feature, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                        <div className="w-1.5 h-1.5 mt-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pricing Section */}
        <div className="space-y-2">
          <SectionHeader title="Pricing & Economics" icon={<DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />} sectionKey="pricing" />
          {expandedSections.has('pricing') && (
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">INPUT COST</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{formatCost(model.inputCostPer1M)}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">per 1M tokens</div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">OUTPUT COST</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{formatCost(model.outputCostPer1M)}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">per 1M tokens</div>
                </div>
              </div>

              <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">COST EXAMPLES</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">1,000 tokens (~750 words)</span>
                    <span className="font-mono font-semibold text-gray-900 dark:text-white">
                      ${((model.inputCostPer1M + model.outputCostPer1M) / 2000).toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">10,000 tokens (~7,500 words)</span>
                    <span className="font-mono font-semibold text-gray-900 dark:text-white">
                      ${((model.inputCostPer1M + model.outputCostPer1M) / 200).toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700 dark:text-gray-300">100,000 tokens (~1 book)</span>
                    <span className="font-mono font-semibold text-gray-900 dark:text-white">
                      ${((model.inputCostPer1M + model.outputCostPer1M) / 20).toFixed(3)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Technical Specifications */}
        <div className="space-y-2">
          <SectionHeader title="Technical Specifications" icon={<TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />} sectionKey="specs" />
          {expandedSections.has('specs') && (
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Book className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">CONTEXT WINDOW</div>
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{formatNumber(model.contextWindow)}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">tokens</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Book className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">CAPACITY</div>
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{calculateBooksInContext(model.contextWindow)}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">books (~100k each)</div>
                </div>
                {model.lastUpdated && (
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">LAST UPDATED</div>
                    </div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white">{new Date(model.lastUpdated).toLocaleDateString()}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Benchmarks Section */}
        {model.benchmarks && (
          <div className="space-y-2">
            <SectionHeader title="Performance Benchmarks" icon={<Award className="w-4 h-4 text-orange-600 dark:text-orange-400" />} sectionKey="benchmarks" />
            {expandedSections.has('benchmarks') && (
              <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {typeof model.benchmarks.mmlu === 'number' && (
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">MMLU Score</div>
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{model.benchmarks.mmlu}%</div>
                      <div className="text-xs text-gray-500 mt-1">Multitask Language Understanding</div>
                    </div>
                  )}
                  {typeof model.benchmarks.humanEval === 'number' && (
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">HumanEval</div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{model.benchmarks.humanEval}%</div>
                      <div className="text-xs text-gray-500 mt-1">Coding capability</div>
                    </div>
                  )}
                  {model.benchmarks.speed && (
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Inference Speed</div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400 capitalize">{model.benchmarks.speed}</div>
                      <div className="text-xs text-gray-500 mt-1">Response generation</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* API Availability Section */}
        {model.apiInfo && (
          <div className="space-y-2">
            <SectionHeader title="API Availability" icon={<Globe className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />} sectionKey="api" />
            {expandedSections.has('api') && (
              <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {model.apiInfo.endpoint && (
                    <div className="col-span-full bg-white dark:bg-gray-800 p-3 rounded-lg border-l-4 border-cyan-500">
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">API ENDPOINT</div>
                      <code className="text-sm text-cyan-700 dark:text-cyan-300 break-all font-mono">
                        {model.apiInfo.endpoint}
                      </code>
                    </div>
                  )}

                  {model.apiInfo.authentication && (
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">AUTHENTICATION</div>
                      <div className="text-sm text-gray-900 dark:text-white font-medium">{model.apiInfo.authentication}</div>
                    </div>
                  )}

                  {model.apiInfo.rateLimits && (
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">RATE LIMITS</div>
                      <div className="text-sm text-gray-900 dark:text-white">{model.apiInfo.rateLimits}</div>
                    </div>
                  )}

                  {model.apiInfo.regionalAvailability && (
                    <div className="col-span-full bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">REGIONAL AVAILABILITY</div>
                      <div className="text-sm text-gray-900 dark:text-white">{model.apiInfo.regionalAvailability}</div>
                    </div>
                  )}

                  {model.apiInfo.documentation && (
                    <div className="col-span-full bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 p-3 rounded-lg border border-cyan-200 dark:border-cyan-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">API DOCUMENTATION</div>
                          <div className="text-sm text-gray-900 dark:text-white">{model.apiInfo.documentation}</div>
                        </div>
                        <a
                          href={model.apiInfo.documentation}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
                        >
                          View Docs
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Python Code Sample Section */}
        <div className="space-y-2">
          <SectionHeader title="Python Integration" icon={<Code className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />} sectionKey="code" />
          {expandedSections.has('code') && (
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg space-y-2">
              {/* Installation */}
              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <div className="bg-gray-100 dark:bg-gray-900 px-3 py-2 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    <span className="ml-1 text-xs font-semibold text-gray-700 dark:text-gray-300">Installation</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(getInstallCommand(), 'install')}
                    className="flex items-center gap-1 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {copiedSection === 'install' ? (
                      <>
                        <Check className="w-3 h-3" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-2 overflow-x-auto">
                  <code className="text-xs font-mono text-gray-800 dark:text-gray-200">{getInstallCommand()}</code>
                </pre>
              </div>

              {/* Code Sample */}
              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                <div className="bg-gray-100 dark:bg-gray-900 px-3 py-2 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    <span className="ml-1 text-xs font-semibold text-gray-700 dark:text-gray-300">example.py</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(getPythonCodeSample(), 'python')}
                    className="flex items-center gap-1 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {copiedSection === 'python' ? (
                      <>
                        <Check className="w-3 h-3" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-2 overflow-x-auto">
                  <code className="text-xs font-mono text-gray-800 dark:text-gray-200 whitespace-pre">{getPythonCodeSample()}</code>
                </pre>
              </div>

              {model.website && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                  <div className="flex items-center gap-1.5 text-xs text-blue-900 dark:text-blue-300">
                    <Link className="w-3 h-3" />
                    <span className="font-semibold">Docs:</span>
                    <a
                      href={model.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                    >
                      {model.provider}
                      <ArrowUpRight className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Phase 1 Features */}
        {model.codeExamples && model.codeExamples.length > 0 && (
          <CodeExamplesSection examples={model.codeExamples} />
        )}

        {model.realWorldUseCases && model.realWorldUseCases.length > 0 && (
          <RealWorldUseCasesSection useCases={model.realWorldUseCases} />
        )}

        {model.limitations && (
          <LimitationsSection limitations={model.limitations} />
        )}

        {/* Tags */}
        {model.tags && (
          <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-1.5 mb-2">
              <Tag className="w-3 h-3 text-gray-600 dark:text-gray-400" />
              <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400">TAGS</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {model.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium border border-blue-200 dark:border-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Raw Data Toggle */}
        <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowRaw(p => !p)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
            aria-pressed={showRaw}
          >
            {showRaw ? 'Hide raw JSON' : 'Show raw JSON'}
          </button>
          {showRaw && (
            <div className="mt-2 bg-gray-900 dark:bg-black p-2 rounded-lg overflow-x-auto">
              <pre className="text-xs text-green-400 font-mono">{JSON.stringify(model, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
