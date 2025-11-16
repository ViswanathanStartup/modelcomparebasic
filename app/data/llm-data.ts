// Phase 1 Feature Interfaces
export interface CodeExample {
  language: 'python' | 'javascript' | 'curl';
  title: string;
  code: string;
  description?: string;
}

export interface RealWorldUseCase {
  title: string;
  industry: string;
  description: string;
  implementation: string;
  results: string;
  metrics: {
    [key: string]: string;
  };
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ModelLimitations {
  knownIssues: string[];
  commonFailures: string[];
  contentPolicies: string[];
  performance: string[];
  bestPractices: string[];
  workarounds: string[];
}

export interface LLMModel {
  id: string;
  name: string;
  provider: string;
  contextWindow: number;
  inputCostPer1M: number;
  outputCostPer1M: number;
  description: string;
  released?: string;
  releaseDate?: string;
  tags?: string[];
  bestFor?: string[];
  strengths?: string[];
  purpose?: string; // Primary use case
  keyFeatures?: string[]; // Unique capabilities
  benchmarks?: {
    mmlu?: number;
    humanEval?: number;
    speed?: 'fast' | 'medium' | 'slow';
  };
  apiInfo?: {
    endpoint: string;
    authentication: string;
    rateLimits?: string;
    regionalAvailability?: string;
    documentation?: string;
  };
  status?: {
    isNew?: boolean;
    isDeprecated?: boolean;
    deprecationDate?: string;
    pricingUpdated?: boolean;
    pricingUpdateDate?: string;
  };
  lastUpdated?: string;
  website?: string;
  qualityScore?: number;

  // Phase 1 Features
  codeExamples?: CodeExample[];
  realWorldUseCases?: RealWorldUseCase[];
  limitations?: ModelLimitations;
}

export const llmModels: LLMModel[] = [
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    provider: "OpenAI",
    contextWindow: 128000,
    inputCostPer1M: 10.00,
    outputCostPer1M: 30.00,
    description: "Most advanced GPT-4 model with state-of-the-art performance",
    released: "2025",
    tags: ["Premium", "Long Context", "Latest", "Multimodal"],
    bestFor: ["Complex tasks", "Long documents", "Enterprise use", "Advanced analysis"],
    purpose: "State-of-the-art AI applications with extensive capabilities",
    keyFeatures: [
      "128K context window",
      "Enhanced reasoning capabilities",
      "Advanced multimodal processing",
      "Industry-leading performance"
    ],
    benchmarks: {
      mmlu: 92.5,
      humanEval: 94.0,
      speed: "fast",
    },
    apiInfo: {
      endpoint: "https://api.openai.com/v1/chat/completions",
      authentication: "Bearer Token (API Key)",
      rateLimits: "10,000 TPM (Tier 1), up to 2M TPM (Tier 5)",
      regionalAvailability: "Global",
      documentation: "https://platform.openai.com/docs/api-reference"
    },
    lastUpdated: "2025-11-08",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-11-08"
    },
  },
  {
    id: "gpt-4",
    name: "GPT-4",
    provider: "OpenAI",
    contextWindow: 8192,
    inputCostPer1M: 30.00,
    outputCostPer1M: 60.00,
    description: "Original GPT-4 model",
    released: "2023",
    tags: ["Premium", "Stable", "Reliable"],
    bestFor: ["Complex reasoning", "Creative tasks", "Professional work"],
    purpose: "High-quality AI interactions",
    keyFeatures: [
      "Strong reasoning capabilities",
      "High accuracy",
      "Reliable performance",
      "Professional-grade outputs"
    ],
    benchmarks: {
      mmlu: 86.4,
      humanEval: 89.8,
      speed: "medium",
    },
    apiInfo: {
    endpoint: "https://api.openai.com/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "10,000 TPM (Tier 1), up to 2M TPM (Tier 5)",
    regionalAvailability: "Global",
    documentation: "https://platform.openai.com/docs/api-reference"
  },
    lastUpdated: "2025-01-07",
    status: {
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "gpt-4-32k",
    name: "GPT-4 32K",
    provider: "OpenAI",
    contextWindow: 32768,
    inputCostPer1M: 60.00,
    outputCostPer1M: 120.00,
    description: "GPT-4 with extended 32K context",
    released: "2023",
    tags: ["Premium", "Extended Context", "Enterprise"],
    bestFor: ["Long documents", "Complex analysis", "Large dataset processing"],
    purpose: "Extended context AI processing",
    keyFeatures: [
      "32K token context window",
      "Full GPT-4 capabilities",
      "Document analysis",
      "Extended conversations"
    ],
    benchmarks: {
      mmlu: 86.4,
      humanEval: 89.8,
      speed: "medium",
    },
    apiInfo: {
    endpoint: "https://api.openai.com/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "10,000 TPM (Tier 1), up to 2M TPM (Tier 5)",
    regionalAvailability: "Global",
    documentation: "https://platform.openai.com/docs/api-reference"
  },
    lastUpdated: "2025-01-07",
    status: {
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "OpenAI",
    contextWindow: 16385,
    inputCostPer1M: 0.50,
    outputCostPer1M: 1.50,
    description: "Fast and affordable model for most tasks",
    released: "2023",
    tags: ["Cost-Effective", "Fast", "Popular"],
    bestFor: ["Chat applications", "Content generation", "General tasks"],
    purpose: "Efficient general-purpose AI",
    keyFeatures: [
      "Fast response times",
      "Cost-efficient",
      "Good general capabilities",
      "Extended context window"
    ],
    benchmarks: {
      mmlu: 70.0,
      humanEval: 72.5,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "https://api.openai.com/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "10,000 TPM (Tier 1), up to 2M TPM (Tier 5)",
    regionalAvailability: "Global",
    documentation: "https://platform.openai.com/docs/api-reference"
  },
    lastUpdated: "2025-01-07",
    status: {
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "gpt-3.5-turbo-16k",
    name: "GPT-3.5 Turbo 16K",
    provider: "OpenAI",
    contextWindow: 16385,
    inputCostPer1M: 0.50,
    outputCostPer1M: 1.50,
    description: "Extended context GPT-3.5",
    released: "2023",
    tags: ["Extended Context", "Cost-Effective", "Fast"],
    bestFor: ["Long conversations", "Document processing", "Bulk processing"],
    purpose: "Extended context processing at lower cost",
    keyFeatures: [
      "16K context window",
      "Cost-efficient processing",
      "Fast response times",
      "Balanced performance"
    ],
    benchmarks: {
      mmlu: 70.0,
      humanEval: 72.5,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "https://api.openai.com/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "10,000 TPM (Tier 1), up to 2M TPM (Tier 5)",
    regionalAvailability: "Global",
    documentation: "https://platform.openai.com/docs/api-reference"
  },
    lastUpdated: "2025-01-07",
    status: {
      isDeprecated: true,
      deprecationDate: "2024-06-17",
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    contextWindow: 128000,
    inputCostPer1M: 2.50,
    outputCostPer1M: 10.00,
    description: "Multimodal flagship model with high intelligence",
    released: "2024",
    tags: ["Multimodal", "Vision", "Flagship"],
    bestFor: ["Complex reasoning", "Image analysis", "Long documents"],
    benchmarks: { mmlu: 88.7, humanEval: 90.2, speed: "fast" },
    lastUpdated: "2025-01-07",
  apiInfo: {
    endpoint: "https://api.openai.com/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "10,000 TPM (Tier 1), up to 2M TPM (Tier 5)",
    regionalAvailability: "Global",
    documentation: "https://platform.openai.com/docs/api-reference"
  },
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "OpenAI",
    contextWindow: 128000,
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.60,
    description: "Affordable small model for fast, lightweight tasks",
    released: "2024",
    tags: ["Budget", "Fast", "Multimodal"],
    bestFor: ["High-volume tasks", "Simple queries", "Cost optimization"],
    benchmarks: { mmlu: 82.0, humanEval: 87.2, speed: "fast" },
    lastUpdated: "2025-01-07",
  apiInfo: {
    endpoint: "https://api.openai.com/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "10,000 TPM (Tier 1), up to 2M TPM (Tier 5)",
    regionalAvailability: "Global",
    documentation: "https://platform.openai.com/docs/api-reference"
  },
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "o1-preview",
    name: "o1-preview",
    provider: "OpenAI",
    contextWindow: 128000,
    inputCostPer1M: 15.00,
    outputCostPer1M: 60.00,
    description: "Reasoning model designed to solve hard problems",
    released: "2024",
    tags: ["Reasoning", "Premium", "Problem Solving"],
    bestFor: ["Math problems", "Complex logic", "Research tasks"],
    benchmarks: { mmlu: 90.8, humanEval: 92.0, speed: "slow" },
    lastUpdated: "2025-01-07",
  apiInfo: {
    endpoint: "https://api.openai.com/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "10,000 TPM (Tier 1), up to 2M TPM (Tier 5)",
    regionalAvailability: "Global",
    documentation: "https://platform.openai.com/docs/api-reference"
  },
    status: {
      isNew: true,
      isDeprecated: false,
      deprecationDate: "2025-10-27",
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "o1-mini",
    name: "o1-mini",
    provider: "OpenAI",
    contextWindow: 128000,
    inputCostPer1M: 3.00,
    outputCostPer1M: 12.00,
    description: "Faster and cheaper reasoning model for coding & STEM",
    released: "2024",
    tags: ["Coding", "STEM", "Reasoning"],
    bestFor: ["Code generation", "STEM problems", "Algorithm design"],
    benchmarks: { mmlu: 85.2, humanEval: 89.7, speed: "medium" },
    lastUpdated: "2025-01-07",
  apiInfo: {
    endpoint: "https://api.openai.com/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "10,000 TPM (Tier 1), up to 2M TPM (Tier 5)",
    regionalAvailability: "Global",
    documentation: "https://platform.openai.com/docs/api-reference"
  },
    status: {
      isNew: true,
      isDeprecated: false,
      deprecationDate: "2025-10-27",
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "claude-opus-4-20250514",
    name: "Claude Opus 4",
    provider: "Anthropic",
    contextWindow: 200000,
    inputCostPer1M: 15.00,
    outputCostPer1M: 75.00,
    description: "Most intelligent Claude model with 200K context",
    released: "2024",
    tags: ["Premium", "Flagship", "Long Context"],
    bestFor: ["Complex analysis", "Long-form writing", "Code review"],
    benchmarks: { mmlu: 86.8, humanEval: 84.9, speed: "medium" },
    lastUpdated: "2025-01-07",
  apiInfo: {
    endpoint: "https://api.anthropic.com/v1/messages",
    authentication: "API Key (x-api-key header)",
    rateLimits: "Varies by tier, 50-4000 requests/min",
    regionalAvailability: "Global",
    documentation: "https://docs.anthropic.com/claude/reference"
  },
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "claude-sonnet-4-20250514",
    name: "Claude Sonnet 4",
    provider: "Anthropic",
    contextWindow: 200000,
    inputCostPer1M: 3.00,
    outputCostPer1M: 15.00,
    description: "Balanced intelligence and speed with 200K context",
    released: "2024",
    tags: ["Balanced", "Popular", "Long Context"],
    bestFor: ["General tasks", "Content creation", "Analysis"],
    benchmarks: { mmlu: 88.3, humanEval: 92.0, speed: "fast" },
    lastUpdated: "2025-01-07",
  apiInfo: {
    endpoint: "https://api.anthropic.com/v1/messages",
    authentication: "API Key (x-api-key header)",
    rateLimits: "Varies by tier, 50-4000 requests/min",
    regionalAvailability: "Global",
    documentation: "https://docs.anthropic.com/claude/reference"
  },
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "claude-3-5-sonnet-20241022",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    contextWindow: 200000,
    inputCostPer1M: 3.00,
    outputCostPer1M: 15.00,
    description: "Best combination of performance and cost",
    released: "2024",
    tags: ["Coding", "Popular", "Balanced"],
    bestFor: ["Software development", "Technical writing", "Analysis"],
    benchmarks: { mmlu: 88.7, humanEval: 92.0, speed: "fast" },
    lastUpdated: "2025-01-07",
  apiInfo: {
    endpoint: "https://api.anthropic.com/v1/messages",
    authentication: "API Key (x-api-key header)",
    rateLimits: "Varies by tier, 50-4000 requests/min",
    regionalAvailability: "Global",
    documentation: "https://docs.anthropic.com/claude/reference"
  },
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "claude-3-5-haiku-20241022",
    name: "Claude 3.5 Haiku",
    provider: "Anthropic",
    contextWindow: 200000,
    inputCostPer1M: 0.80,
    outputCostPer1M: 4.00,
    description: "Fast and cost-effective with improved capabilities",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.anthropic.com/v1/messages",
    authentication: "API Key (x-api-key header)",
    rateLimits: "Varies by tier, 50-4000 requests/min",
    regionalAvailability: "Global",
    documentation: "https://docs.anthropic.com/claude/reference"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "claude-sonnet-4-5-20250514",
    name: "Claude Sonnet 4.5",
    provider: "Anthropic",
    contextWindow: 1000000,
    inputCostPer1M: 3.00,
    outputCostPer1M: 15.00,
    description: "Most advanced Claude model with 1M token context window",
    released: "2025",
    tags: ["Latest", "Flagship", "Coding", "Long Context"],
    bestFor: ["Advanced coding", "Complex reasoning", "Large document analysis"],
    purpose: "State-of-the-art AI for demanding tasks",
    keyFeatures: [
      "1 million token context window",
      "77.2% on SWE-bench Verified",
      "Best-in-class coding performance",
      "Advanced reasoning capabilities"
    ],
    benchmarks: {
      mmlu: 91.5,
      humanEval: 93.8,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "https://api.anthropic.com/v1/messages",
    authentication: "API Key (x-api-key header)",
    rateLimits: "Varies by tier, 50-4000 requests/min",
    regionalAvailability: "Global",
    documentation: "https://docs.anthropic.com/claude/reference"
  },
    lastUpdated: "2025-11-08",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-11-08"
    },
  },
  {
    id: "claude-opus-4-1-20250514",
    name: "Claude Opus 4.1",
    provider: "Anthropic",
    contextWindow: 1000000,
    inputCostPer1M: 15.00,
    outputCostPer1M: 75.00,
    description: "Premium Claude model with extended context",
    released: "2025",
    tags: ["Premium", "Latest", "Long Context", "Research"],
    bestFor: ["Research", "Complex analysis", "Large-scale projects"],
    purpose: "Premium AI for enterprise and research applications",
    keyFeatures: [
      "1 million token context window",
      "Superior reasoning",
      "Advanced mathematics",
      "Enterprise-grade performance"
    ],
    benchmarks: {
      mmlu: 92.0,
      humanEval: 94.0,
      speed: "medium",
    },
    apiInfo: {
    endpoint: "https://api.anthropic.com/v1/messages",
    authentication: "API Key (x-api-key header)",
    rateLimits: "Varies by tier, 50-4000 requests/min",
    regionalAvailability: "Global",
    documentation: "https://docs.anthropic.com/claude/reference"
  },
    lastUpdated: "2025-11-08",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-11-08"
    },
  },
  {
    id: "claude-3-opus-20240229",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    contextWindow: 200000,
    inputCostPer1M: 15.00,
    outputCostPer1M: 75.00,
    description: "Most capable Claude 3 model",
    released: "2024",
    tags: ["Premium", "High Intelligence", "Research"],
    bestFor: ["Academic research", "Complex analysis", "Scientific tasks"],
    purpose: "Advanced research and analysis",
    keyFeatures: [
      "Superior reasoning",
      "Advanced mathematics",
      "Scientific understanding",
      "Extensive context window"
    ],
    benchmarks: {
      mmlu: 89.5,
      humanEval: 91.8,
      speed: "medium",
    },
    apiInfo: {
    endpoint: "https://api.anthropic.com/v1/messages",
    authentication: "API Key (x-api-key header)",
    rateLimits: "Varies by tier, 50-4000 requests/min",
    regionalAvailability: "Global",
    documentation: "https://docs.anthropic.com/claude/reference"
  },
    lastUpdated: "2025-01-07",
    status: {
      isNew: false,
      isDeprecated: true,
      deprecationDate: "2025-06-30",
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "claude-3-sonnet-20240229",
    name: "Claude 3 Sonnet",
    provider: "Anthropic",
    contextWindow: 200000,
    inputCostPer1M: 3.00,
    outputCostPer1M: 15.00,
    description: "Balanced Claude 3 model",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.anthropic.com/v1/messages",
    authentication: "API Key (x-api-key header)",
    rateLimits: "Varies by tier, 50-4000 requests/min",
    regionalAvailability: "Global",
    documentation: "https://docs.anthropic.com/claude/reference"
  },
    status: {
      isNew: false,
      isDeprecated: true,
      deprecationDate: "2025-07-21"
    },
  },
  {
    id: "claude-3-haiku-20240307",
    name: "Claude 3 Haiku",
    provider: "Anthropic",
    contextWindow: 200000,
    inputCostPer1M: 0.25,
    outputCostPer1M: 1.25,
    description: "Fastest and most compact Claude 3 model",
    released: "2024",
    tags: ["Fast", "Efficient", "Cost-Effective"],
    bestFor: ["Quick responses", "Simple tasks", "High-volume processing"],
    purpose: "Fast, efficient AI processing",
    keyFeatures: [
      "Rapid response times",
      "Resource efficient",
      "High throughput",
      "Cost-effective scaling"
    ],
    benchmarks: {
      mmlu: 78.5,
      humanEval: 82.0,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "https://api.anthropic.com/v1/messages",
    authentication: "API Key (x-api-key header)",
    rateLimits: "Varies by tier, 50-4000 requests/min",
    regionalAvailability: "Global",
    documentation: "https://docs.anthropic.com/claude/reference"
  },
    lastUpdated: "2025-01-07",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    contextWindow: 2000000,
    inputCostPer1M: 1.25,
    outputCostPer1M: 5.00,
    description: "Mid-size multimodal model with 2M context window",
    released: "2024",
    tags: ["Multimodal", "Ultra-Long Context", "Professional"],
    bestFor: ["Document analysis", "Multimodal tasks", "Enterprise use"],
    purpose: "Professional multimodal AI applications",
    keyFeatures: [
      "2M token context window",
      "Advanced vision capabilities",
      "Strong performance/cost ratio",
      "Multi-turn conversations"
    ],
    benchmarks: {
      mmlu: 87.5,
      humanEval: 89.0,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "https://generativelanguage.googleapis.com/v1/models",
    authentication: "API Key or OAuth 2.0",
    rateLimits: "60 requests/min (free), higher for paid",
    regionalAvailability: "Global",
    documentation: "https://ai.google.dev/docs"
  },
    lastUpdated: "2025-01-07",
    status: {
      isNew: false,
      isDeprecated: true,
      deprecationDate: "2025-09-24",
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    provider: "Google",
    contextWindow: 1000000,
    inputCostPer1M: 0.075,
    outputCostPer1M: 0.30,
    description: "Fast and versatile performance across diverse tasks",
    released: "2024",
    tags: ["Ultra-Fast", "Cost-Efficient", "Versatile"],
    bestFor: ["High-volume processing", "Real-time applications", "API services"],
    purpose: "High-performance, cost-efficient processing",
    keyFeatures: [
      "Ultra-fast inference",
      "1M token context",
      "Low latency",
      "Resource efficient"
    ],
    benchmarks: {
      mmlu: 80.0,
      humanEval: 82.5,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "https://generativelanguage.googleapis.com/v1/models",
    authentication: "API Key or OAuth 2.0",
    rateLimits: "60 requests/min (free), higher for paid",
    regionalAvailability: "Global",
    documentation: "https://ai.google.dev/docs"
  },
    lastUpdated: "2025-01-07",
    status: {
      isNew: false,
      isDeprecated: true,
      deprecationDate: "2025-09-24",
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "gemini-1.5-flash-8b",
    name: "Gemini 1.5 Flash-8B",
    provider: "Google",
    contextWindow: 1000000,
    inputCostPer1M: 0.0375,
    outputCostPer1M: 0.15,
    description: "Smaller, faster variant of Flash",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://generativelanguage.googleapis.com/v1/models",
    authentication: "API Key or OAuth 2.0",
    rateLimits: "60 requests/min (free), higher for paid",
    regionalAvailability: "Global",
    documentation: "https://ai.google.dev/docs"
  },
    status: {
      isNew: false,
      isDeprecated: true,
      deprecationDate: "2025-09-24"
    },
  },
  {
    id: "gemini-1.0-pro",
    name: "Gemini 1.0 Pro",
    provider: "Google",
    contextWindow: 32760,
    inputCostPer1M: 0.50,
    outputCostPer1M: 1.50,
    description: "Best for scaling across wide range of tasks",
    released: "2023",
    tags: ["Versatile", "Production-Ready", "Scalable"],
    bestFor: ["Production workloads", "General tasks", "API services"],
    purpose: "General-purpose production deployment",
    keyFeatures: [
      "Production stability",
      "Broad task support",
      "Easy scaling",
      "Google Cloud integration"
    ],
    benchmarks: {
      mmlu: 78.5,
      humanEval: 80.0,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "https://generativelanguage.googleapis.com/v1/models",
    authentication: "API Key or OAuth 2.0",
    rateLimits: "60 requests/min (free), higher for paid",
    regionalAvailability: "Global",
    documentation: "https://ai.google.dev/docs"
  },
    lastUpdated: "2025-01-07",
    status: {
      isDeprecated: true,
      deprecationDate: "2025-04-09",
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    provider: "Google",
    contextWindow: 2000000,
    inputCostPer1M: 1.25,
    outputCostPer1M: 10.00,
    description: "Latest flagship model with 1-2M token context window",
    released: "2025",
    tags: ["Latest", "Flagship", "Reasoning", "Ultra-Long Context"],
    bestFor: ["Complex reasoning", "Research", "Large-scale analysis"],
    purpose: "Advanced reasoning and research applications",
    keyFeatures: [
      "1-2 million token context window",
      "63.8% on SWE-bench Verified",
      "#1 on LMArena for human preference",
      "Superior reasoning benchmarks"
    ],
    benchmarks: {
      mmlu: 90.5,
      humanEval: 91.0,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "https://generativelanguage.googleapis.com/v1/models",
    authentication: "API Key or OAuth 2.0",
    rateLimits: "60 requests/min (free), higher for paid",
    regionalAvailability: "Global",
    documentation: "https://ai.google.dev/docs"
  },
    lastUpdated: "2025-11-08",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-11-08"
    },
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google",
    contextWindow: 1000000,
    inputCostPer1M: 0.30,
    outputCostPer1M: 2.50,
    description: "Updated Flash model with improved performance",
    released: "2025",
    tags: ["Latest", "Fast", "Cost-Efficient", "Versatile"],
    bestFor: ["High-volume processing", "Production workloads", "API services"],
    purpose: "High-performance, production-ready processing",
    keyFeatures: [
      "1M token context window",
      "Improved pricing vs 2.0",
      "Enhanced performance",
      "Production-optimized"
    ],
    benchmarks: {
      mmlu: 84.5,
      humanEval: 86.0,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "https://generativelanguage.googleapis.com/v1/models",
    authentication: "API Key or OAuth 2.0",
    rateLimits: "60 requests/min (free), higher for paid",
    regionalAvailability: "Global",
    documentation: "https://ai.google.dev/docs"
  },
    lastUpdated: "2025-11-08",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-11-08"
    },
  },
  {
    id: "gemini-2.5-flash-lite",
    name: "Gemini 2.5 Flash-Lite",
    provider: "Google",
    contextWindow: 1000000,
    inputCostPer1M: 0.10,
    outputCostPer1M: 0.40,
    description: "Most economical Gemini model for high-volume tasks",
    released: "2025",
    tags: ["Latest", "Budget", "High-Volume", "Fast"],
    bestFor: ["High-volume tasks", "Cost optimization", "Low-latency applications"],
    purpose: "Cost-effective high-volume processing",
    keyFeatures: [
      "Lowest price in Gemini lineup",
      "Built for high-volume tasks",
      "Low latency",
      "1M token context window"
    ],
    benchmarks: {
      mmlu: 82.0,
      humanEval: 84.0,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "https://generativelanguage.googleapis.com/v1/models",
    authentication: "API Key or OAuth 2.0",
    rateLimits: "60 requests/min (free), higher for paid",
    regionalAvailability: "Global",
    documentation: "https://ai.google.dev/docs"
  },
    lastUpdated: "2025-11-08",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-11-08"
    },
  },
  {
    id: "gemini-pro-vision",
    name: "Gemini Pro Vision",
    provider: "Google",
    contextWindow: 16384,
    inputCostPer1M: 0.25,
    outputCostPer1M: 0.50,
    description: "Multimodal model with vision capabilities",
    released: "2023",
    tags: ["Vision", "Multimodal", "Professional"],
    bestFor: ["Image analysis", "Visual tasks", "Multimodal applications"],
    purpose: "Vision and language processing",
    keyFeatures: [
      "Advanced vision processing",
      "Image understanding",
      "Visual reasoning",
      "Multimodal outputs"
    ],
    benchmarks: {
      mmlu: 81.0,
      humanEval: 83.5,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "https://generativelanguage.googleapis.com/v1/models",
    authentication: "API Key or OAuth 2.0",
    rateLimits: "60 requests/min (free), higher for paid",
    regionalAvailability: "Global",
    documentation: "https://ai.google.dev/docs"
  },
    lastUpdated: "2025-01-07",
    status: {
      isDeprecated: true,
      deprecationDate: "2024-07-12",
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "llama-3.3-70b",
    name: "Llama 3.3 70B",
    provider: "Meta",
    contextWindow: 128000,
    inputCostPer1M: 0.60,
    outputCostPer1M: 0.60,
    description: "Latest Llama 3.3 with improved performance",
    released: "2024",
    tags: ["Open Source", "Latest", "Large Scale"],
    bestFor: ["Research", "Custom deployment", "Enterprise applications"],
    purpose: "Advanced open-source AI applications",
    keyFeatures: [
      "State-of-the-art performance",
      "Open-source flexibility",
      "Extensive fine-tuning options",
      "Competitive with proprietary models"
    ],
    benchmarks: {
      mmlu: 85.5,
      humanEval: 88.0,
      speed: "medium",
    },
    apiInfo: {
    endpoint: "Via cloud providers (AWS, Azure, Hugging Face)",
    authentication: "Varies by platform",
    rateLimits: "Depends on hosting platform",
    regionalAvailability: "Global",
    documentation: "https://llama.meta.com/docs"
  },
    lastUpdated: "2025-01-07",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "llama-3.2-90b",
    name: "Llama 3.2 90B",
    provider: "Meta",
    contextWindow: 128000,
    inputCostPer1M: 0.90,
    outputCostPer1M: 0.90,
    description: "Large multimodal Llama model",
    released: "2024",
    tags: ["Multimodal", "Large Scale", "Open Source"],
    bestFor: ["Vision tasks", "Complex reasoning", "Research applications"],
    purpose: "Large-scale multimodal processing",
    keyFeatures: [
      "Advanced vision capabilities",
      "Strong reasoning",
      "128K context support",
      "Open source flexibility"
    ],
    benchmarks: {
      mmlu: 86.5,
      humanEval: 89.0,
      speed: "medium",
    },
    apiInfo: {
    endpoint: "Via cloud providers (AWS, Azure, Hugging Face)",
    authentication: "Varies by platform",
    rateLimits: "Depends on hosting platform",
    regionalAvailability: "Global",
    documentation: "https://llama.meta.com/docs"
  },
    lastUpdated: "2025-01-07",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "llama-3.2-11b",
    name: "Llama 3.2 11B Vision",
    provider: "Meta",
    contextWindow: 128000,
    inputCostPer1M: 0.18,
    outputCostPer1M: 0.18,
    description: "Vision-enabled Llama model",
    released: "2024",
    tags: ["Vision", "Efficient", "Open Source"],
    bestFor: ["Image analysis", "Visual tasks", "Lightweight deployment"],
    purpose: "Efficient visual processing",
    keyFeatures: [
      "Visual understanding",
      "Resource efficiency",
      "Fast processing",
      "Open deployment"
    ],
    benchmarks: {
      mmlu: 74.5,
      humanEval: 77.0,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "Via cloud providers (AWS, Azure, Hugging Face)",
    authentication: "Varies by platform",
    rateLimits: "Depends on hosting platform",
    regionalAvailability: "Global",
    documentation: "https://llama.meta.com/docs"
  },
    lastUpdated: "2025-01-07",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "llama-3.2-3b",
    name: "Llama 3.2 3B",
    provider: "Meta",
    contextWindow: 128000,
    inputCostPer1M: 0.06,
    outputCostPer1M: 0.06,
    description: "Small efficient Llama model",
    released: "2024",
    tags: ["Lightweight", "Fast", "Edge-Ready"],
    bestFor: ["Edge deployment", "Mobile apps", "Resource-constrained environments"],
    purpose: "Edge and mobile AI deployment",
    keyFeatures: [
      "Minimal resource usage",
      "Edge optimization",
      "Quick inference",
      "Local deployment"
    ],
    benchmarks: {
      mmlu: 65.0,
      humanEval: 68.5,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "Via cloud providers (AWS, Azure, Hugging Face)",
    authentication: "Varies by platform",
    rateLimits: "Depends on hosting platform",
    regionalAvailability: "Global",
    documentation: "https://llama.meta.com/docs"
  },
    lastUpdated: "2025-01-07",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "llama-3.2-1b",
    name: "Llama 3.2 1B",
    provider: "Meta",
    contextWindow: 128000,
    inputCostPer1M: 0.04,
    outputCostPer1M: 0.04,
    description: "Tiny, ultra-efficient Llama model",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "Via cloud providers (AWS, Azure, Hugging Face)",
    authentication: "Varies by platform",
    rateLimits: "Depends on hosting platform",
    regionalAvailability: "Global",
    documentation: "https://llama.meta.com/docs"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "llama-3.1-405b",
    name: "Llama 3.1 405B",
    provider: "Meta",
    contextWindow: 128000,
    inputCostPer1M: 2.50,
    outputCostPer1M: 2.50,
    description: "Largest and most capable Llama model",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "Via cloud providers (AWS, Azure, Hugging Face)",
    authentication: "Varies by platform",
    rateLimits: "Depends on hosting platform",
    regionalAvailability: "Global",
    documentation: "https://llama.meta.com/docs"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "llama-3.1-70b",
    name: "Llama 3.1 70B",
    provider: "Meta",
    contextWindow: 128000,
    inputCostPer1M: 0.50,
    outputCostPer1M: 0.75,
    description: "Cost-effective model for diverse tasks",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "Via cloud providers (AWS, Azure, Hugging Face)",
    authentication: "Varies by platform",
    rateLimits: "Depends on hosting platform",
    regionalAvailability: "Global",
    documentation: "https://llama.meta.com/docs"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "llama-3.1-8b",
    name: "Llama 3.1 8B",
    provider: "Meta",
    contextWindow: 128000,
    inputCostPer1M: 0.10,
    outputCostPer1M: 0.10,
    description: "Lightweight and fast model",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "Via cloud providers (AWS, Azure, Hugging Face)",
    authentication: "Varies by platform",
    rateLimits: "Depends on hosting platform",
    regionalAvailability: "Global",
    documentation: "https://llama.meta.com/docs"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "llama-3-70b",
    name: "Llama 3 70B",
    provider: "Meta",
    contextWindow: 8192,
    inputCostPer1M: 0.60,
    outputCostPer1M: 0.60,
    description: "Powerful open-source model",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "Via cloud providers (AWS, Azure, Hugging Face)",
    authentication: "Varies by platform",
    rateLimits: "Depends on hosting platform",
    regionalAvailability: "Global",
    documentation: "https://llama.meta.com/docs"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "llama-3-8b",
    name: "Llama 3 8B",
    provider: "Meta",
    contextWindow: 8192,
    inputCostPer1M: 0.10,
    outputCostPer1M: 0.10,
    description: "Efficient open-source model",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "Via cloud providers (AWS, Azure, Hugging Face)",
    authentication: "Varies by platform",
    rateLimits: "Depends on hosting platform",
    regionalAvailability: "Global",
    documentation: "https://llama.meta.com/docs"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "codellama-70b",
    name: "CodeLlama 70B",
    provider: "Meta",
    contextWindow: 100000,
    inputCostPer1M: 0.70,
    outputCostPer1M: 0.80,
    description: "Large code-specialized model",
    released: "2023",
    tags: ["Code Generation", "Large Scale", "Open Source"],
    bestFor: ["Software development", "Code analysis", "Technical documentation"],
    purpose: "Advanced code generation and analysis",
    keyFeatures: [
      "Superior code understanding",
      "Multiple language support",
      "Advanced code completion",
      "Technical documentation"
    ],
    benchmarks: {
      mmlu: 75.0,
      humanEval: 88.5,
      speed: "medium",
    },
    apiInfo: {
    endpoint: "Via cloud providers (AWS, Azure, Hugging Face)",
    authentication: "Varies by platform",
    rateLimits: "Depends on hosting platform",
    regionalAvailability: "Global",
    documentation: "https://llama.meta.com/docs"
  },
    lastUpdated: "2025-01-07",
    status: {
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "codellama-34b",
    name: "CodeLlama 34B",
    provider: "Meta",
    contextWindow: 100000,
    inputCostPer1M: 0.35,
    outputCostPer1M: 0.35,
    description: "Medium code-specialized model",
    released: "2023",
    tags: ["Code Generation", "Mid-Size", "Cost-Effective"],
    bestFor: ["Code completion", "Code review", "Development workflows"],
    purpose: "Efficient code generation and analysis",
    keyFeatures: [
      "Balanced performance",
      "Multiple languages",
      "Fast inference",
      "IDE integration"
    ],
    benchmarks: {
      mmlu: 72.0,
      humanEval: 85.5,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "Via cloud providers (AWS, Azure, Hugging Face)",
    authentication: "Varies by platform",
    rateLimits: "Depends on hosting platform",
    regionalAvailability: "Global",
    documentation: "https://llama.meta.com/docs"
  },
    lastUpdated: "2025-01-07",
    status: {
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "codellama-13b",
    name: "CodeLlama 13B",
    provider: "Meta",
    contextWindow: 100000,
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.15,
    description: "Small code-specialized model",
    released: "2023",
    tags: ["Lightweight", "Fast", "Economic"],
    bestFor: ["Quick coding tasks", "Local development", "Learning environments"],
    purpose: "Fast, efficient code assistance",
    keyFeatures: [
      "Quick response time",
      "Resource efficient",
      "Local deployment",
      "Basic code support"
    ],
    benchmarks: {
      mmlu: 68.0,
      humanEval: 82.0,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "Via cloud providers (AWS, Azure, Hugging Face)",
    authentication: "Varies by platform",
    rateLimits: "Depends on hosting platform",
    regionalAvailability: "Global",
    documentation: "https://llama.meta.com/docs"
  },
    lastUpdated: "2025-01-07",
    status: {
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "mistral-large-2411",
    name: "Mistral Large 2.1",
    provider: "Mistral",
    contextWindow: 128000,
    inputCostPer1M: 2.00,
    outputCostPer1M: 6.00,
    description: "Flagship model with top-tier reasoning and multimodal capabilities",
    released: "2024",
    tags: ["Multimodal", "Enterprise", "High Performance"],
    bestFor: ["Enterprise solutions", "Complex reasoning", "Research"],
    purpose: "Enterprise-grade AI solutions",
    keyFeatures: [
      "Advanced reasoning capabilities",
      "Multimodal understanding",
      "High accuracy in specialized domains",
      "Real-time processing"
    ],
    benchmarks: {
      mmlu: 89.2,
      humanEval: 91.5,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "https://api.mistral.ai/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://docs.mistral.ai/api"
  },
    lastUpdated: "2025-01-07",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "mistral-medium-2508",
    name: "Mistral Medium 3.1",
    provider: "Mistral",
    contextWindow: 32000,
    inputCostPer1M: 2.70,
    outputCostPer1M: 8.10,
    description: "Balanced performance and cost with specialized capabilities",
    released: "2024",
    tags: ["Balanced", "Production Ready", "Cost Effective"],
    bestFor: ["Production deployments", "API services", "Content generation"],
    purpose: "Production-ready AI applications",
    keyFeatures: [
      "Optimized for production workloads",
      "Low latency responses",
      "High availability",
      "Consistent performance"
    ],
    benchmarks: {
      mmlu: 85.6,
      humanEval: 88.3,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "https://api.mistral.ai/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://docs.mistral.ai/api"
  },
    lastUpdated: "2025-01-07",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "mistral-small-2506",
    name: "Mistral Small 3.2",
    provider: "Mistral",
    contextWindow: 32000,
    inputCostPer1M: 0.20,
    outputCostPer1M: 0.60,
    description: "Cost-efficient reasoning for low-latency workloads",
    released: "2024",
    tags: ["Efficient", "Fast", "Cost Optimized"],
    bestFor: ["High-volume applications", "Edge computing", "Real-time processing"],
    purpose: "High-throughput applications",
    keyFeatures: [
      "Ultra-low latency",
      "Efficient resource usage",
      "Ideal for edge deployment",
      "High throughput capacity"
    ],
    benchmarks: {
      mmlu: 82.4,
      humanEval: 85.1,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "https://api.mistral.ai/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://docs.mistral.ai/api"
  },
    lastUpdated: "2025-01-07",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "magistral-medium-2509",
    name: "Magistral Medium 1.2",
    provider: "Mistral",
    contextWindow: 128000,
    inputCostPer1M: 4.00,
    outputCostPer1M: 12.00,
    description: "Advanced reasoning model with enhanced capabilities",
    released: "2025",
    tags: ["Advanced", "Reasoning", "Production Ready"],
    bestFor: ["Advanced reasoning", "Complex problem solving", "Production workloads"],
    purpose: "Advanced AI reasoning and development",
    keyFeatures: [
      "Extended context understanding",
      "Advanced reasoning capabilities",
      "Novel architecture improvements",
      "Research-oriented features"
    ],
    benchmarks: {
      mmlu: 91.5,
      humanEval: 93.2,
      speed: "medium",
    },
    apiInfo: {
    endpoint: "https://api.mistral.ai/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://docs.mistral.ai/api"
  },
    lastUpdated: "2025-01-07",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "command-r-08-2024",
    name: "Command R",
    provider: "Cohere",
    contextWindow: 128000,
    inputCostPer1M: 1.50,
    outputCostPer1M: 3.00,
    description: "Advanced model for enterprise applications with strong reasoning",
    released: "2024",
    tags: ["Enterprise", "Reasoning", "Production"],
    bestFor: ["Enterprise deployments", "Complex tasks", "Business applications"],
    purpose: "Enterprise-grade language processing",
    keyFeatures: [
      "Advanced reasoning capabilities",
      "Enterprise-grade reliability",
      "Custom domain adaptation",
      "Multi-language support"
    ],
    benchmarks: {
      mmlu: 87.8,
      humanEval: 89.4,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "https://api.cohere.ai/v1/generate",
    authentication: "Bearer Token (API Key)",
    rateLimits: "10,000 requests/min (production)",
    regionalAvailability: "Global",
    documentation: "https://docs.cohere.com/reference/about"
  },
    lastUpdated: "2025-01-07",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "command-a-03-2025",
    name: "Command A",
    provider: "Cohere",
    contextWindow: 128000,
    inputCostPer1M: 1.00,
    outputCostPer1M: 2.00,
    description: "Versatile model for general-purpose applications",
    released: "2024",
    tags: ["Versatile", "General Purpose", "Production"],
    bestFor: ["Text generation", "Classification", "Semantic search"],
    purpose: "General-purpose language tasks",
    keyFeatures: [
      "Balanced performance",
      "Wide task compatibility",
      "Production stability",
      "Cost effectiveness"
    ],
    benchmarks: {
      mmlu: 85.6,
      humanEval: 87.2,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "https://api.cohere.ai/v1/generate",
    authentication: "Bearer Token (API Key)",
    rateLimits: "10,000 requests/min (production)",
    regionalAvailability: "Global",
    documentation: "https://docs.cohere.com/reference/about"
  },
    lastUpdated: "2025-01-07",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "embed-english",
    name: "Embed English",
    provider: "Cohere",
    contextWindow: 512000,
    inputCostPer1M: 0.10,
    outputCostPer1M: 0.10,
    description: "Specialized model for English text embeddings",
    released: "2024",
    tags: ["Embeddings", "English", "Specialized"],
    bestFor: ["Semantic search", "Content classification", "Recommendation systems"],
    purpose: "Text embedding generation",
    keyFeatures: [
      "High-quality embeddings",
      "Optimized for English",
      "Fast processing",
      "Semantic understanding"
    ],
    benchmarks: {
      speed: "fast",
    },
    apiInfo: {
    endpoint: "https://api.cohere.ai/v1/generate",
    authentication: "Bearer Token (API Key)",
    rateLimits: "10,000 requests/min (production)",
    regionalAvailability: "Global",
    documentation: "https://docs.cohere.com/reference/about"
  },
    lastUpdated: "2025-01-07",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "j2-ultra",
    name: "Jurassic-2 Ultra",
    provider: "AI21",
    contextWindow: 128000,
    inputCostPer1M: 1.80,
    outputCostPer1M: 6.00,
    description: "Most powerful model in the Jurassic series",
    released: "2024",
    tags: ["Premium", "High Performance", "Enterprise"],
    bestFor: ["Complex tasks", "Academic research", "Professional writing"],
    purpose: "Advanced language understanding and generation",
    keyFeatures: [
      "Superior text understanding",
      "Advanced writing capabilities",
      "Research-grade analysis",
      "Multilingual support"
    ],
    benchmarks: {
      mmlu: 86.5,
      humanEval: 88.7,
      speed: "medium",
    },
    apiInfo: {
    endpoint: "https://api.ai21.com/studio/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://docs.ai21.com/reference"
  },
    lastUpdated: "2025-01-07",
    status: {
      isNew: false,
      isDeprecated: true,
      deprecationDate: "2024-11-14",
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "j2-mid",
    name: "Jurassic-2 Mid",
    provider: "AI21",
    contextWindow: 8192,
    inputCostPer1M: 0.90,
    outputCostPer1M: 3.00,
    description: "Balanced model for general-purpose applications",
    released: "2024",
    tags: ["Balanced", "General Purpose", "Cost Effective"],
    bestFor: ["Content creation", "Data analysis", "Business applications"],
    purpose: "General-purpose text processing",
    keyFeatures: [
      "Balanced performance",
      "Cost efficiency",
      "Reliable outputs",
      "Business-ready"
    ],
    benchmarks: {
      mmlu: 83.2,
      humanEval: 85.4,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "https://api.ai21.com/studio/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://docs.ai21.com/reference"
  },
    lastUpdated: "2025-01-07",
    status: {
      isNew: false,
      isDeprecated: true,
      deprecationDate: "2024-11-14",
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "mistral-nemo-12b",
    name: "Mistral Nemo 12B",
    provider: "Mistral",
    contextWindow: 128000,
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.15,
    description: "Built with Nvidia, focused on global multilingual",
    released: "2024",
    tags: ["Multilingual", "GPU-Optimized", "Global"],
    bestFor: ["Multilingual tasks", "GPU deployment", "Global applications"],
    purpose: "Optimized multilingual processing",
    keyFeatures: [
      "NVIDIA optimization",
      "Multi-language support",
      "Hardware acceleration",
      "Global deployment"
    ],
    benchmarks: {
      mmlu: 79.5,
      humanEval: 82.0,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "https://api.mistral.ai/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://docs.mistral.ai/api"
  },
    lastUpdated: "2025-01-07",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "open-mistral-7b",
    name: "Open Mistral 7B",
    provider: "Mistral",
    contextWindow: 32000,
    inputCostPer1M: 0.25,
    outputCostPer1M: 0.25,
    description: "Open-source small model",
    released: "2023",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.mistral.ai/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://docs.mistral.ai/api"
  },
  },
  {
    id: "open-mixtral-8x7b",
    name: "Open Mixtral 8x7B",
    provider: "Mistral",
    contextWindow: 32000,
    inputCostPer1M: 0.50,
    outputCostPer1M: 0.50,
    description: "Mixture of Experts model with 8 experts",
    released: "2023",
    tags: ["MoE", "Efficient", "Specialized"],
    bestFor: ["Domain-specific tasks", "Efficient processing", "Specialized applications"],
    purpose: "Efficient expert-based processing",
    keyFeatures: [
      "Mixture of Experts",
      "Domain specialization",
      "Efficient routing",
      "Balanced performance"
    ],
    benchmarks: {
      mmlu: 81.5,
      humanEval: 84.0,
      speed: "medium",
    },
    apiInfo: {
    endpoint: "https://api.mistral.ai/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://docs.mistral.ai/api"
  },
    lastUpdated: "2025-01-07",
    status: {
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "open-mixtral-8x22b",
    name: "Open Mixtral 8x22B",
    provider: "Mistral",
    contextWindow: 64000,
    inputCostPer1M: 1.20,
    outputCostPer1M: 1.20,
    description: "Larger MoE with improved capabilities",
    released: "2024",
    tags: ["Advanced MoE", "Large Scale", "High Performance"],
    bestFor: ["Complex tasks", "Research", "Enterprise applications"],
    purpose: "Advanced expert-based processing",
    keyFeatures: [
      "Large expert models",
      "Advanced routing",
      "Enhanced capabilities",
      "Research grade"
    ],
    benchmarks: {
      mmlu: 84.5,
      humanEval: 87.0,
      speed: "medium",
    },
    apiInfo: {
    endpoint: "https://api.mistral.ai/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://docs.mistral.ai/api"
  },
    lastUpdated: "2025-01-07",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "command-r-plus-08-2024",
    name: "Command R+",
    provider: "Cohere",
    contextWindow: 128000,
    inputCostPer1M: 2.50,
    outputCostPer1M: 10.00,
    description: "Most capable model for RAG and tool use",
    released: "2024",
    tags: ["RAG", "Tool Use", "Enterprise"],
    bestFor: ["Knowledge retrieval", "Tool integration", "Enterprise search"],
    purpose: "Advanced RAG and tool integration",
    keyFeatures: [
      "Superior RAG capabilities",
      "Advanced tool use",
      "Enterprise integration",
      "Knowledge processing"
    ],
    benchmarks: {
      mmlu: 84.0,
      humanEval: 86.5,
      speed: "medium",
    },
    apiInfo: {
    endpoint: "https://api.cohere.ai/v1/generate",
    authentication: "Bearer Token (API Key)",
    rateLimits: "10,000 requests/min (production)",
    regionalAvailability: "Global",
    documentation: "https://docs.cohere.com/reference/about"
  },
    lastUpdated: "2025-01-07",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "titan-text-premier",
    name: "Titan Text Premier",
    provider: "AWS",
    contextWindow: 32000,
    inputCostPer1M: 0.50,
    outputCostPer1M: 1.50,
    description: "Advanced model for enterprise RAG use cases",
    released: "2024",
    tags: ["Enterprise", "RAG-optimized", "AWS Native"],
    bestFor: ["Enterprise RAG", "AWS integration", "Knowledge bases"],
    purpose: "Enterprise-grade RAG applications",
    keyFeatures: [
      "RAG optimization",
      "AWS service integration",
      "Enterprise security",
      "Scalable deployment"
    ],
    benchmarks: {
      mmlu: 82.0,
      humanEval: 84.5,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "https://bedrock-runtime.{region}.amazonaws.com",
    authentication: "AWS Signature V4",
    rateLimits: "Varies by model and region",
    regionalAvailability: "Global",
    documentation: "https://docs.aws.amazon.com/bedrock"
  },
    lastUpdated: "2025-01-07",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "titan-text-express",
    name: "Titan Text Express",
    provider: "AWS",
    contextWindow: 8192,
    inputCostPer1M: 0.20,
    outputCostPer1M: 0.60,
    description: "Fast and cost-effective Titan model",
    released: "2023",
    tags: ["Fast", "Cost-Effective", "AWS Native"],
    bestFor: ["Quick responses", "AWS workloads", "High-volume processing"],
    purpose: "Efficient AWS text processing",
    keyFeatures: [
      "Fast inference",
      "AWS integration",
      "Cost optimization",
      "Efficient scaling"
    ],
    benchmarks: {
      mmlu: 75.5,
      humanEval: 78.0,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "https://bedrock-runtime.{region}.amazonaws.com",
    authentication: "AWS Signature V4",
    rateLimits: "Varies by model and region",
    regionalAvailability: "Global",
    documentation: "https://docs.aws.amazon.com/bedrock"
  },
    lastUpdated: "2025-01-07",
    status: {
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "titan-text-lite",
    name: "Titan Text Lite",
    provider: "AWS",
    contextWindow: 4096,
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.20,
    description: "Lightweight Titan for simple tasks",
    released: "2023",
    tags: ["Lightweight", "Economic", "Simple Tasks"],
    bestFor: ["Basic text processing", "Simple queries", "Cost-sensitive workloads"],
    purpose: "Basic text processing on AWS",
    keyFeatures: [
      "Minimal resource usage",
      "Quick deployment",
      "AWS compatible",
      "Budget-friendly"
    ],
    benchmarks: {
      mmlu: 70.0,
      humanEval: 72.5,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "https://bedrock-runtime.{region}.amazonaws.com",
    authentication: "AWS Signature V4",
    rateLimits: "Varies by model and region",
    regionalAvailability: "Global",
    documentation: "https://docs.aws.amazon.com/bedrock"
  },
    lastUpdated: "2025-01-07",
    status: {
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "grok-beta",
    name: "Grok Beta",
    provider: "xAI",
    contextWindow: 131072,
    inputCostPer1M: 5.00,
    outputCostPer1M: 15.00,
    description: "AI with real-time knowledge and humor",
    released: "2024",
    tags: ["Real-time", "Personality", "Interactive"],
    bestFor: ["Interactive chat", "Current events", "Creative writing"],
    purpose: "Engaging AI conversations with personality",
    keyFeatures: [
      "Real-time knowledge access",
      "Witty responses",
      "Current events awareness",
      "Conversational personality"
    ],
    benchmarks: {
      mmlu: 86.2,
      humanEval: 88.5,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "https://api.x.ai/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://docs.x.ai/api"
  },
    lastUpdated: "2025-01-07",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "grok-4",
    name: "Grok 4",
    provider: "xAI",
    contextWindow: 131072,
    inputCostPer1M: 2.00,
    outputCostPer1M: 10.00,
    description: "Latest Grok model with native tool use and real-time X search",
    released: "2025",
    tags: ["Latest", "Tool Use", "Real-time", "X Integration"],
    bestFor: ["Tool integration", "Real-time information", "Current events"],
    purpose: "Advanced AI with native tool capabilities",
    keyFeatures: [
      "Native tool use",
      "Real-time X search integration",
      "Current events awareness",
      "Advanced reasoning"
    ],
    benchmarks: {
      mmlu: 87.5,
      humanEval: 89.0,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "https://api.x.ai/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://docs.x.ai/api"
  },
    lastUpdated: "2025-11-08",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-11-08"
    },
  },
  {
    id: "grok-2",
    name: "Grok 2",
    provider: "xAI",
    contextWindow: 131072,
    inputCostPer1M: 2.00,
    outputCostPer1M: 10.00,
    description: "Advanced reasoning with multimodal capabilities",
    released: "2024",
    tags: ["Multimodal", "Interactive", "Advanced"],
    bestFor: ["Creative tasks", "Visual analysis", "Interactive sessions"],
    purpose: "Advanced multimodal interaction",
    keyFeatures: [
      "Multimodal understanding",
      "Creative responses",
      "Real-time knowledge",
      "Interactive personality"
    ],
    benchmarks: {
      mmlu: 85.5,
      humanEval: 87.0,
      speed: "medium",
    },
    apiInfo: {
    endpoint: "https://api.x.ai/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://docs.x.ai/api"
  },
    lastUpdated: "2025-01-07",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "grok-1.5",
    name: "Grok 1.5",
    provider: "xAI",
    contextWindow: 131072,
    inputCostPer1M: 3.00,
    outputCostPer1M: 9.00,
    description: "Earlier Grok version with good performance",
    released: "2024",
    tags: ["Stable", "Interactive", "General Purpose"],
    bestFor: ["General tasks", "Interactive chat", "Content creation"],
    purpose: "Reliable general-purpose AI",
    keyFeatures: [
      "Stable performance",
      "Personality traits",
      "Good context handling",
      "General capabilities"
    ],
    benchmarks: {
      mmlu: 82.5,
      humanEval: 84.0,
      speed: "medium",
    },
    apiInfo: {
    endpoint: "https://api.x.ai/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://docs.x.ai/api"
  },
    lastUpdated: "2025-01-07",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "deepseek-chat",
    name: "DeepSeek Chat",
    provider: "DeepSeek",
    contextWindow: 64000,
    inputCostPer1M: 0.14,
    outputCostPer1M: 0.28,
    description: "Chinese AI model with strong reasoning",
    released: "2024",
    tags: ["Multilingual", "Reasoning", "Cost-Effective"],
    bestFor: ["Chinese content", "Cross-lingual tasks", "General chat"],
    purpose: "Multilingual communication and reasoning",
    keyFeatures: [
      "Strong Chinese language support",
      "Cross-lingual capabilities",
      "Reasoning abilities",
      "Cost-efficient deployment"
    ],
    benchmarks: {
      mmlu: 82.5,
      humanEval: 84.0,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "https://api.deepseek.com/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://platform.deepseek.com/docs"
  },
    lastUpdated: "2025-01-07",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "deepseek-coder",
    name: "DeepSeek Coder",
    provider: "DeepSeek",
    contextWindow: 64000,
    inputCostPer1M: 0.14,
    outputCostPer1M: 0.28,
    description: "Specialized for code generation and understanding",
    released: "2024",
    tags: ["Code", "Cost-Effective", "Specialized"],
    bestFor: ["Code generation", "Code review", "Technical documentation"],
    purpose: "Efficient code-focused AI",
    keyFeatures: [
      "Code optimization",
      "Multiple languages",
      "Documentation generation",
      "Cost efficiency"
    ],
    benchmarks: {
      mmlu: 76.0,
      humanEval: 86.5,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "https://api.deepseek.com/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://platform.deepseek.com/docs"
  },
    lastUpdated: "2025-01-07",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "deepseek-v2",
    name: "DeepSeek V2",
    provider: "DeepSeek",
    contextWindow: 128000,
    inputCostPer1M: 0.27,
    outputCostPer1M: 1.10,
    description: "Enhanced DeepSeek with larger context",
    released: "2024",
    tags: ["Extended Context", "Multilingual", "Advanced"],
    bestFor: ["Document processing", "Multilingual tasks", "Research"],
    purpose: "Advanced multilingual processing",
    keyFeatures: [
      "Extended context window",
      "Enhanced multilingual",
      "Research capabilities",
      "Document analysis"
    ],
    benchmarks: {
      mmlu: 83.0,
      humanEval: 85.5,
      speed: "medium",
    },
    apiInfo: {
    endpoint: "https://api.deepseek.com/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://platform.deepseek.com/docs"
  },
    lastUpdated: "2025-01-07",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "sonar-pro",
    name: "Sonar Pro",
    provider: "Perplexity",
    contextWindow: 127072,
    inputCostPer1M: 1.00,
    outputCostPer1M: 1.00,
    description: "Online LLM with real-time search capabilities",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.perplexity.ai/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://docs.perplexity.ai"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "sonar",
    name: "Sonar",
    provider: "Perplexity",
    contextWindow: 127072,
    inputCostPer1M: 0.20,
    outputCostPer1M: 0.20,
    description: "Faster online LLM for quick searches",
    released: "2024",
    tags: ["Search", "Fast", "Lightweight"],
    bestFor: ["Quick queries", "Real-time search", "Information retrieval"],
    purpose: "Fast information search and retrieval",
    keyFeatures: [
      "Rapid search",
      "Real-time updates",
      "Efficient processing",
      "Search optimization"
    ],
    benchmarks: {
      mmlu: 75.0,
      humanEval: 77.5,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "https://api.perplexity.ai/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://docs.perplexity.ai"
  },
    lastUpdated: "2025-01-07",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "sonar-reasoning",
    name: "Sonar Reasoning",
    provider: "Perplexity",
    contextWindow: 127072,
    inputCostPer1M: 0.60,
    outputCostPer1M: 0.60,
    description: "Balanced online search model",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.perplexity.ai/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://docs.perplexity.ai"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "qwen-2.5-72b",
    name: "Qwen 2.5 72B",
    provider: "Alibaba",
    contextWindow: 131072,
    inputCostPer1M: 0.40,
    outputCostPer1M: 0.40,
    description: "Advanced Chinese and English language model",
    released: "2024",
    tags: ["Multilingual", "Large Scale", "Enterprise"],
    bestFor: ["Chinese content", "Cross-lingual tasks", "Enterprise applications"],
    purpose: "Advanced multilingual processing",
    keyFeatures: [
      "Strong Chinese support",
      "Bilingual capabilities",
      "Large context window",
      "Enterprise integration"
    ],
    benchmarks: {
      mmlu: 84.5,
      humanEval: 86.0,
      speed: "medium",
    },
    apiInfo: {
    endpoint: "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation",
    authentication: "API Key (Alibaba Cloud)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://help.aliyun.com/zh/dashscope"
  },
    lastUpdated: "2025-01-07",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "qwen-2.5-32b",
    name: "Qwen 2.5 32B",
    provider: "Alibaba",
    contextWindow: 131072,
    inputCostPer1M: 0.20,
    outputCostPer1M: 0.20,
    description: "Medium-sized multilingual model",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation",
    authentication: "API Key (Alibaba Cloud)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://help.aliyun.com/zh/dashscope"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "qwen-2.5-14b",
    name: "Qwen 2.5 14B",
    provider: "Alibaba",
    contextWindow: 131072,
    inputCostPer1M: 0.12,
    outputCostPer1M: 0.12,
    description: "Compact efficient model",
    released: "2024",
    tags: ["Efficient", "Multilingual", "Compact"],
    bestFor: ["Light applications", "Mobile deployment", "Cost-sensitive tasks"],
    purpose: "Efficient multilingual processing",
    keyFeatures: [
      "Resource efficiency",
      "Basic multilingual support",
      "Mobile optimization",
      "Fast inference"
    ],
    benchmarks: {
      mmlu: 75.5,
      humanEval: 78.0,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation",
    authentication: "API Key (Alibaba Cloud)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://help.aliyun.com/zh/dashscope"
  },
    lastUpdated: "2025-01-07",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "qwen-2.5-7b",
    name: "Qwen 2.5 7B",
    provider: "Alibaba",
    contextWindow: 131072,
    inputCostPer1M: 0.07,
    outputCostPer1M: 0.07,
    description: "Efficient multilingual model",
    released: "2024",
    tags: ["Lightweight", "Multilingual", "Cost-Effective"],
    bestFor: ["Basic tasks", "Edge deployment", "Mobile applications"],
    purpose: "Efficient multilingual processing",
    keyFeatures: [
      "Basic multilingual support",
      "Mobile optimization",
      "Low resource usage",
      "Fast inference"
    ],
    benchmarks: {
      mmlu: 70.5,
      humanEval: 73.0,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation",
    authentication: "API Key (Alibaba Cloud)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://help.aliyun.com/zh/dashscope"
  },
    lastUpdated: "2025-01-07",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "qwen-2-72b",
    name: "Qwen 2 72B",
    provider: "Alibaba",
    contextWindow: 32768,
    inputCostPer1M: 0.50,
    outputCostPer1M: 0.50,
    description: "Previous generation large model",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation",
    authentication: "API Key (Alibaba Cloud)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://help.aliyun.com/zh/dashscope"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "jamba-1.5-large",
    name: "Jamba 1.5 Large",
    provider: "AI21",
    contextWindow: 256000,
    inputCostPer1M: 2.00,
    outputCostPer1M: 8.00,
    description: "Hybrid SSM-Transformer with 256K context",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.ai21.com/studio/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://docs.ai21.com/reference"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "jamba-1.5-mini",
    name: "Jamba 1.5 Mini",
    provider: "AI21",
    contextWindow: 256000,
    inputCostPer1M: 0.20,
    outputCostPer1M: 0.40,
    description: "Compact model with large context window",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.ai21.com/studio/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://docs.ai21.com/reference"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "jurassic-2-ultra",
    name: "Jurassic-2 Ultra",
    provider: "AI21",
    contextWindow: 8192,
    inputCostPer1M: 15.00,
    outputCostPer1M: 15.00,
    description: "Most powerful Jurassic model",
    released: "2023",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.ai21.com/studio/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://docs.ai21.com/reference"
  },
    status: {
      isDeprecated: true,
      deprecationDate: "2024-11-14"
    },
  },
  {
    id: "jurassic-2-mid",
    name: "Jurassic-2 Mid",
    provider: "AI21",
    contextWindow: 8192,
    inputCostPer1M: 10.00,
    outputCostPer1M: 10.00,
    description: "Balanced Jurassic model",
    released: "2023",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.ai21.com/studio/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://docs.ai21.com/reference"
  },
    status: {
      isDeprecated: true,
      deprecationDate: "2024-11-14"
    },
  },
  {
    id: "together-llama-3.1-405b-turbo",
    name: "Llama 3.1 405B Turbo",
    provider: "Together",
    contextWindow: 130000,
    inputCostPer1M: 3.50,
    outputCostPer1M: 3.50,
    description: "Optimized Llama hosted on Together AI",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.together.xyz/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://docs.together.ai/reference"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "together-llama-3.1-70b-turbo",
    name: "Llama 3.1 70B Turbo",
    provider: "Together",
    contextWindow: 130000,
    inputCostPer1M: 0.88,
    outputCostPer1M: 0.88,
    description: "Fast 70B Llama on Together",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.together.xyz/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://docs.together.ai/reference"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "together-mixtral-8x22b",
    name: "Mixtral 8x22B",
    provider: "Together",
    contextWindow: 65536,
    inputCostPer1M: 1.20,
    outputCostPer1M: 1.20,
    description: "Large MoE on Together AI",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.together.xyz/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://docs.together.ai/reference"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "dbrx-instruct",
    name: "DBRX Instruct",
    provider: "Databricks",
    contextWindow: 32768,
    inputCostPer1M: 0.75,
    outputCostPer1M: 2.25,
    description: "Open MoE model for general purpose",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://{workspace}.cloud.databricks.com/serving-endpoints",
    authentication: "Personal Access Token",
    rateLimits: "Varies by deployment",
    regionalAvailability: "Global",
    documentation: "https://docs.databricks.com/machine-learning/model-serving"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "nemotron-4-340b",
    name: "Nemotron 4 340B",
    provider: "Nvidia",
    contextWindow: 4096,
    inputCostPer1M: 4.20,
    outputCostPer1M: 4.20,
    description: "Synthetic data generation and reasoning",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://integrate.api.nvidia.com/v1",
    authentication: "API Key",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://docs.nvidia.com/nim"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "reka-core",
    name: "Reka Core",
    provider: "Reka",
    contextWindow: 128000,
    inputCostPer1M: 3.00,
    outputCostPer1M: 15.00,
    description: "Multimodal AI with vision and language",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.reka.ai/v1/chat",
    authentication: "API Key",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://docs.reka.ai"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "reka-flash",
    name: "Reka Flash",
    provider: "Reka",
    contextWindow: 128000,
    inputCostPer1M: 0.80,
    outputCostPer1M: 2.00,
    description: "Fast multimodal inference",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.reka.ai/v1/chat",
    authentication: "API Key",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://docs.reka.ai"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "reka-edge",
    name: "Reka Edge",
    provider: "Reka",
    contextWindow: 128000,
    inputCostPer1M: 0.40,
    outputCostPer1M: 1.00,
    description: "Efficient edge-optimized model",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.reka.ai/v1/chat",
    authentication: "API Key",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://docs.reka.ai"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "yi-large",
    name: "Yi Large",
    provider: "01.AI",
    contextWindow: 32768,
    inputCostPer1M: 0.60,
    outputCostPer1M: 0.60,
    description: "Bilingual model with strong performance",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.01.ai/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://platform.01.ai/docs"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "yi-medium",
    name: "Yi Medium",
    provider: "01.AI",
    contextWindow: 16384,
    inputCostPer1M: 0.25,
    outputCostPer1M: 0.25,
    description: "Balanced model for various tasks",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.01.ai/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://platform.01.ai/docs"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "yi-34b",
    name: "Yi 34B",
    provider: "01.AI",
    contextWindow: 4096,
    inputCostPer1M: 0.30,
    outputCostPer1M: 0.30,
    description: "Open-source bilingual model",
    released: "2023",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.01.ai/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://platform.01.ai/docs"
  },
  },
  {
    id: "palmyra-x-004",
    name: "Palmyra X 004",
    provider: "Writer",
    contextWindow: 32768,
    inputCostPer1M: 0.38,
    outputCostPer1M: 0.38,
    description: "Enterprise-focused content generation",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.writer.com/v1/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://dev.writer.com/api-reference"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "inflection-2.5",
    name: "Inflection 2.5",
    provider: "Inflection",
    contextWindow: 8192,
    inputCostPer1M: 1.00,
    outputCostPer1M: 1.00,
    description: "Empathetic AI focused on personal interaction",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.inflection.ai/v1/chat/completions",
    authentication: "API Key",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://developers.inflection.ai"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "falcon-180b",
    name: "Falcon 180B",
    provider: "Hugging Face",
    contextWindow: 2048,
    inputCostPer1M: 1.80,
    outputCostPer1M: 1.80,
    description: "Large open-source model",
    released: "2023",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api-inference.huggingface.co/models/{model_id}",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://huggingface.co/docs/api-inference"
  },
  },
  {
    id: "falcon-40b",
    name: "Falcon 40B",
    provider: "Hugging Face",
    contextWindow: 2048,
    inputCostPer1M: 0.60,
    outputCostPer1M: 0.60,
    description: "Medium open-source model",
    released: "2023",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api-inference.huggingface.co/models/{model_id}",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://huggingface.co/docs/api-inference"
  },
  },
  {
    id: "stablelm-2-12b",
    name: "StableLM 2 12B",
    provider: "Stability AI",
    contextWindow: 4096,
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.15,
    description: "Stable language model for general use",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.stability.ai/v1/generation",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://platform.stability.ai/docs/api-reference"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "stablecode-3b",
    name: "StableCode 3B",
    provider: "Stability AI",
    contextWindow: 16384,
    inputCostPer1M: 0.10,
    outputCostPer1M: 0.10,
    description: "Code-focused stable model",
    released: "2023",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.stability.ai/v1/generation",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://platform.stability.ai/docs/api-reference"
  },
  },
  {
    id: "moonshot-v1-128k",
    name: "Moonshot v1 128K",
    provider: "Moonshot",
    contextWindow: 128000,
    inputCostPer1M: 0.84,
    outputCostPer1M: 0.84,
    description: "Chinese model with large context",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.moonshot.cn/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://platform.moonshot.cn/docs"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "moonshot-v1-32k",
    name: "Moonshot v1 32K",
    provider: "Moonshot",
    contextWindow: 32000,
    inputCostPer1M: 0.48,
    outputCostPer1M: 0.48,
    description: "Efficient Chinese language model",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.moonshot.cn/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://platform.moonshot.cn/docs"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "glm-4",
    name: "GLM-4",
    provider: "Zhipu",
    contextWindow: 128000,
    inputCostPer1M: 0.50,
    outputCostPer1M: 0.50,
    description: "Chinese bilingual model",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
    authentication: "API Key",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://open.bigmodel.cn/dev/api"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "glm-3-turbo",
    name: "GLM-3 Turbo",
    provider: "Zhipu",
    contextWindow: 128000,
    inputCostPer1M: 0.05,
    outputCostPer1M: 0.05,
    description: "Fast and efficient GLM model",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
    authentication: "API Key",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://open.bigmodel.cn/dev/api"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "ernie-4.0",
    name: "ERNIE 4.0",
    provider: "Baidu",
    contextWindow: 8192,
    inputCostPer1M: 0.90,
    outputCostPer1M: 0.90,
    description: "Latest ERNIE with strong Chinese capabilities",
    released: "2024",
    benchmarks: {
      mmlu: 83.0,
      humanEval: 85.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat",
    authentication: "Access Token (OAuth 2.0)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://cloud.baidu.com/doc/WENXINWORKSHOP"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "ernie-3.5",
    name: "ERNIE 3.5",
    provider: "Baidu",
    contextWindow: 8192,
    inputCostPer1M: 0.30,
    outputCostPer1M: 0.30,
    description: "Balanced ERNIE model",
    released: "2023",
    benchmarks: {
      mmlu: 78.0,
      humanEval: 80.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat",
    authentication: "Access Token (OAuth 2.0)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://cloud.baidu.com/doc/WENXINWORKSHOP"
  },
  },
  {
    id: "ernie-lite",
    name: "ERNIE Lite",
    provider: "Baidu",
    contextWindow: 4096,
    inputCostPer1M: 0.05,
    outputCostPer1M: 0.05,
    description: "Lightweight ERNIE model",
    released: "2023",
    benchmarks: {
      mmlu: 68.0,
      humanEval: 72.0,
      speed: "fast",
    },
  apiInfo: {
    endpoint: "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat",
    authentication: "Access Token (OAuth 2.0)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://cloud.baidu.com/doc/WENXINWORKSHOP"
  },
  },
  {
    id: "minimax-abab6",
    name: "MiniMax ABAB 6",
    provider: "MiniMax",
    contextWindow: 245760,
    inputCostPer1M: 1.00,
    outputCostPer1M: 1.00,
    description: "Long context Chinese model",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.minimax.chat/v1/text/chatcompletion",
    authentication: "API Key",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://api.minimax.chat/document"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "minimax-abab5.5",
    name: "MiniMax ABAB 5.5",
    provider: "MiniMax",
    contextWindow: 8192,
    inputCostPer1M: 0.50,
    outputCostPer1M: 0.50,
    description: "Efficient MiniMax model",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.minimax.chat/v1/text/chatcompletion",
    authentication: "API Key",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://api.minimax.chat/document"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "sensechat-5",
    name: "SenseChat 5",
    provider: "SenseTime",
    contextWindow: 32768,
    inputCostPer1M: 0.60,
    outputCostPer1M: 0.60,
    description: "Advanced Chinese language model",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.sensenova.cn/v1/llm/chat-completions",
    authentication: "API Key",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://platform.sensenova.cn/doc"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "vicuna-33b",
    name: "Vicuna 33B",
    provider: "LMSYS",
    contextWindow: 2048,
    inputCostPer1M: 0.30,
    outputCostPer1M: 0.30,
    description: "Open assistant model based on LLaMA",
    released: "2023",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "Via Hugging Face or research access",
    authentication: "Varies by platform",
    rateLimits: "Research/academic access",
    regionalAvailability: "Global",
    documentation: "https://lmsys.org"
  },
  },
  {
    id: "vicuna-13b",
    name: "Vicuna 13B",
    provider: "LMSYS",
    contextWindow: 2048,
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.15,
    description: "Smaller Vicuna variant",
    released: "2023",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "Via Hugging Face or research access",
    authentication: "Varies by platform",
    rateLimits: "Research/academic access",
    regionalAvailability: "Global",
    documentation: "https://lmsys.org"
  },
  },
  {
    id: "wizardlm-70b",
    name: "WizardLM 70B",
    provider: "WizardLM",
    contextWindow: 4096,
    inputCostPer1M: 0.70,
    outputCostPer1M: 0.70,
    description: "Instruction-following model",
    released: "2023",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "Via Hugging Face or third-party platforms",
    authentication: "Varies by platform",
    rateLimits: "Depends on hosting platform",
    regionalAvailability: "Global",
    documentation: "https://github.com/nlpxucan/WizardLM"
  },
  },
  {
    id: "wizardlm-13b",
    name: "WizardLM 13B",
    provider: "WizardLM",
    contextWindow: 4096,
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.15,
    description: "Smaller instruction model",
    released: "2023",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "Via Hugging Face or third-party platforms",
    authentication: "Varies by platform",
    rateLimits: "Depends on hosting platform",
    regionalAvailability: "Global",
    documentation: "https://github.com/nlpxucan/WizardLM"
  },
  },
  {
    id: "hunyuan-pro-plus",
    name: "Hunyuan Pro Plus",
    provider: "Tencent",
    contextWindow: 32000,
    inputCostPer1M: 1.20,
    outputCostPer1M: 1.20,
    description: "Advanced Chinese language model with business focus",
    released: "2024",
    tags: ["Chinese", "Business", "Enterprise"],
    bestFor: ["Chinese business", "Enterprise solutions", "Content generation"],
    purpose: "Enterprise Chinese language processing",
    keyFeatures: [
      "Advanced Chinese language understanding",
      "Business domain expertise",
      "Cultural context awareness",
      "Enterprise integration"
    ],
    benchmarks: {
      mmlu: 84.5,
      speed: "fast",
    },
    apiInfo: {
    endpoint: "https://hunyuan.tencentcloudapi.com",
    authentication: "Tencent Cloud Signature",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://cloud.tencent.com/document/product/1729"
  },
    lastUpdated: "2025-01-07",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "hunyuan-lite",
    name: "Hunyuan Lite",
    provider: "Tencent",
    contextWindow: 4096,
    inputCostPer1M: 0.10,
    outputCostPer1M: 0.10,
    description: "Lightweight Tencent model",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://hunyuan.tencentcloudapi.com",
    authentication: "Tencent Cloud Signature",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://cloud.tencent.com/document/product/1729"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "hunyuan-standard",
    name: "Hunyuan Standard",
    provider: "Tencent",
    contextWindow: 8192,
    inputCostPer1M: 0.40,
    outputCostPer1M: 0.40,
    description: "Standard Tencent AI model",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://hunyuan.tencentcloudapi.com",
    authentication: "Tencent Cloud Signature",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://cloud.tencent.com/document/product/1729"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "hunyuan-pro",
    name: "Hunyuan Pro",
    provider: "Tencent",
    contextWindow: 32768,
    inputCostPer1M: 1.00,
    outputCostPer1M: 1.00,
    description: "Advanced Tencent model",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://hunyuan.tencentcloudapi.com",
    authentication: "Tencent Cloud Signature",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://cloud.tencent.com/document/product/1729"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "amazon-nova-micro",
    name: "Amazon Nova Micro",
    provider: "AWS",
    contextWindow: 128000,
    inputCostPer1M: 0.035,
    outputCostPer1M: 0.14,
    description: "Ultra-fast text-only model",
    released: "2024",
    benchmarks: {
      mmlu: 65.0,
      humanEval: 70.0,
      speed: "fast",
    },
  apiInfo: {
    endpoint: "https://bedrock-runtime.{region}.amazonaws.com",
    authentication: "AWS Signature V4",
    rateLimits: "Varies by model and region",
    regionalAvailability: "Global",
    documentation: "https://docs.aws.amazon.com/bedrock"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "amazon-nova-lite",
    name: "Amazon Nova Lite",
    provider: "AWS",
    contextWindow: 300000,
    inputCostPer1M: 0.06,
    outputCostPer1M: 0.24,
    description: "Low-cost multimodal model",
    released: "2024",
    benchmarks: {
      mmlu: 72.0,
      humanEval: 75.0,
      speed: "fast",
    },
  apiInfo: {
    endpoint: "https://bedrock-runtime.{region}.amazonaws.com",
    authentication: "AWS Signature V4",
    rateLimits: "Varies by model and region",
    regionalAvailability: "Global",
    documentation: "https://docs.aws.amazon.com/bedrock"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "amazon-nova-pro",
    name: "Amazon Nova Pro",
    provider: "AWS",
    contextWindow: 300000,
    inputCostPer1M: 0.80,
    outputCostPer1M: 3.20,
    description: "High capability multimodal model",
    released: "2024",
    benchmarks: {
      mmlu: 85.0,
      humanEval: 87.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://bedrock-runtime.{region}.amazonaws.com",
    authentication: "AWS Signature V4",
    rateLimits: "Varies by model and region",
    regionalAvailability: "Global",
    documentation: "https://docs.aws.amazon.com/bedrock"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "groq-llama-3.3-70b",
    name: "Llama 3.3 70B (Groq)",
    provider: "Groq",
    contextWindow: 128000,
    inputCostPer1M: 0.59,
    outputCostPer1M: 0.79,
    description: "Ultra-fast inference with Groq LPU",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "High throughput, varies by tier",
    regionalAvailability: "Global",
    documentation: "https://console.groq.com/docs"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "groq-llama-3.1-8b",
    name: "Llama 3.1 8B (Groq)",
    provider: "Groq",
    contextWindow: 128000,
    inputCostPer1M: 0.05,
    outputCostPer1M: 0.08,
    description: "Lightning fast small model on Groq",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "High throughput, varies by tier",
    regionalAvailability: "Global",
    documentation: "https://console.groq.com/docs"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "groq-mixtral-8x7b",
    name: "Mixtral 8x7B (Groq)",
    provider: "Groq",
    contextWindow: 32768,
    inputCostPer1M: 0.24,
    outputCostPer1M: 0.24,
    description: "MoE model with Groq acceleration",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "High throughput, varies by tier",
    regionalAvailability: "Global",
    documentation: "https://console.groq.com/docs"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "fireworks-llama-3.1-405b",
    name: "Llama 3.1 405B (Fireworks)",
    provider: "Fireworks",
    contextWindow: 131072,
    inputCostPer1M: 3.00,
    outputCostPer1M: 3.00,
    description: "Largest Llama on Fireworks",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.fireworks.ai/inference/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://docs.fireworks.ai/api-reference"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "fireworks-llama-3.1-70b",
    name: "Llama 3.1 70B (Fireworks)",
    provider: "Fireworks",
    contextWindow: 131072,
    inputCostPer1M: 0.90,
    outputCostPer1M: 0.90,
    description: "Fast inference Llama 70B",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.fireworks.ai/inference/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://docs.fireworks.ai/api-reference"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "anyscale-llama-3.1-70b",
    name: "Llama 3.1 70B (Anyscale)",
    provider: "Anyscale",
    contextWindow: 128000,
    inputCostPer1M: 1.00,
    outputCostPer1M: 1.00,
    description: "Llama on Anyscale infrastructure",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.endpoints.anyscale.com/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://docs.endpoints.anyscale.com"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "anyscale-mistral-7b",
    name: "Mistral 7B (Anyscale)",
    provider: "Anyscale",
    contextWindow: 32768,
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.15,
    description: "Cost-effective Mistral deployment",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.endpoints.anyscale.com/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://docs.endpoints.anyscale.com"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "openrouter-auto",
    name: "Auto (Best)",
    provider: "OpenRouter",
    contextWindow: 128000,
    inputCostPer1M: 0.00,
    outputCostPer1M: 0.00,
    description: "Automatically selects best available model",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier and model",
    regionalAvailability: "Global",
    documentation: "https://openrouter.ai/docs"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "replicate-llama-3.1-405b",
    name: "Llama 3.1 405B (Replicate)",
    provider: "Replicate",
    contextWindow: 128000,
    inputCostPer1M: 9.50,
    outputCostPer1M: 9.50,
    description: "On-demand Llama inference",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://api.replicate.com/v1/predictions",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://replicate.com/docs/reference/http"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "orca-2-13b",
    name: "Orca 2 13B",
    provider: "Microsoft",
    contextWindow: 4096,
    inputCostPer1M: 0.20,
    outputCostPer1M: 0.20,
    description: "Microsoft reasoning model",
    released: "2023",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://{resource}.openai.azure.com/openai/deployments/{deployment-id}",
    authentication: "API Key or Azure AD",
    rateLimits: "Varies by deployment tier",
    regionalAvailability: "Global",
    documentation: "https://learn.microsoft.com/azure/ai-services/openai"
  },
  },
  {
    id: "phi-3-medium",
    name: "Phi-3 Medium",
    provider: "Microsoft",
    contextWindow: 128000,
    inputCostPer1M: 0.10,
    outputCostPer1M: 0.10,
    description: "Small but powerful Microsoft model",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://{resource}.openai.azure.com/openai/deployments/{deployment-id}",
    authentication: "API Key or Azure AD",
    rateLimits: "Varies by deployment tier",
    regionalAvailability: "Global",
    documentation: "https://learn.microsoft.com/azure/ai-services/openai"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "phi-3-mini",
    name: "Phi-3 Mini",
    provider: "Microsoft",
    contextWindow: 128000,
    inputCostPer1M: 0.05,
    outputCostPer1M: 0.05,
    description: "Ultra-compact efficient model",
    released: "2024",
    benchmarks: {
      mmlu: 75.0,
      humanEval: 78.0,
      speed: "medium",
    },
  apiInfo: {
    endpoint: "https://{resource}.openai.azure.com/openai/deployments/{deployment-id}",
    authentication: "API Key or Azure AD",
    rateLimits: "Varies by deployment tier",
    regionalAvailability: "Global",
    documentation: "https://learn.microsoft.com/azure/ai-services/openai"
  },
    status: {
      isNew: true
    },
  },
  {
    id: "amazon-titan-express",
    name: "Titan Express",
    provider: "Amazon",
    contextWindow: 128000,
    inputCostPer1M: 0.80,
    outputCostPer1M: 2.40,
    description: "Fast and efficient general-purpose model",
    released: "2024",
    tags: ["Fast", "Efficient", "AWS-Native"],
    bestFor: ["AWS integration", "Enterprise applications", "Rapid processing"],
    purpose: "AWS-integrated language processing",
    keyFeatures: ["AWS integration", "Low latency", "High availability"],
    benchmarks: { mmlu: 85.6, speed: "fast" },
    lastUpdated: "2025-01-07",
  apiInfo: {
    endpoint: "https://bedrock-runtime.{region}.amazonaws.com",
    authentication: "AWS Signature V4",
    rateLimits: "Varies by model and region",
    regionalAvailability: "Global",
    documentation: "https://docs.aws.amazon.com/bedrock"
  },
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "amazon-titan-large",
    name: "Titan Large",
    provider: "Amazon",
    contextWindow: 128000,
    inputCostPer1M: 2.50,
    outputCostPer1M: 7.50,
    description: "Advanced model for complex enterprise tasks",
    released: "2024",
    tags: ["Enterprise", "Advanced", "AWS-Native"],
    bestFor: ["Complex processing", "Enterprise solutions", "Large-scale deployments"],
    purpose: "Enterprise-grade language processing",
    keyFeatures: ["Advanced reasoning", "Enterprise security", "AWS ecosystem integration"],
    benchmarks: { mmlu: 87.8, speed: "medium" },
    lastUpdated: "2025-01-07",
  apiInfo: {
    endpoint: "https://bedrock-runtime.{region}.amazonaws.com",
    authentication: "AWS Signature V4",
    rateLimits: "Varies by model and region",
    regionalAvailability: "Global",
    documentation: "https://docs.aws.amazon.com/bedrock"
  },
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "stable-lm-3b",
    name: "StableLM 3B",
    provider: "Stability AI",
    contextWindow: 4096,
    inputCostPer1M: 0.05,
    outputCostPer1M: 0.05,
    description: "Efficient small language model",
    released: "2024",
    tags: ["Efficient", "Lightweight", "Open"],
    bestFor: ["Edge computing", "Mobile applications", "Quick inference"],
    purpose: "Edge and mobile deployment",
    keyFeatures: ["Low resource usage", "Fast inference", "Mobile optimization"],
    benchmarks: { mmlu: 78.5, speed: "fast" },
    lastUpdated: "2025-01-07",
  apiInfo: {
    endpoint: "https://api.stability.ai/v1/generation",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://platform.stability.ai/docs/api-reference"
  },
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "stable-lm-7b",
    name: "StableLM 7B",
    provider: "Stability AI",
    contextWindow: 8192,
    inputCostPer1M: 0.10,
    outputCostPer1M: 0.10,
    description: "Balanced performance and efficiency",
    released: "2024",
    tags: ["Balanced", "Open-Source", "Versatile"],
    bestFor: ["General tasks", "Research", "Development"],
    purpose: "General language processing",
    keyFeatures: ["Balanced performance", "Research-friendly", "Open development"],
    benchmarks: { mmlu: 82.3, speed: "fast" },
    lastUpdated: "2025-01-07",
  apiInfo: {
    endpoint: "https://api.stability.ai/v1/generation",
    authentication: "Bearer Token (API Key)",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://platform.stability.ai/docs/api-reference"
  },
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "intel-neural-1",
    name: "Neural Chat 1",
    provider: "Intel",
    contextWindow: 8192,
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.15,
    description: "Optimized for Intel hardware",
    released: "2024",
    tags: ["Hardware-Optimized", "Enterprise", "Efficient"],
    bestFor: ["Intel infrastructure", "Enterprise deployment", "Edge computing"],
    purpose: "Hardware-optimized processing",
    keyFeatures: ["Intel optimization", "Enterprise support", "Edge deployment"],
    benchmarks: { mmlu: 83.4, speed: "fast" },
    lastUpdated: "2025-01-07",
  apiInfo: {
    endpoint: "https://api.neural-chat.intel.com/v1",
    authentication: "API Key",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://www.intel.com/neural-chat/docs"
  },
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "intel-neural-2",
    name: "Neural Chat 2",
    provider: "Intel",
    contextWindow: 32000,
    inputCostPer1M: 0.30,
    outputCostPer1M: 0.30,
    description: "Advanced model with hardware optimization",
    released: "2024",
    tags: ["Advanced", "Hardware-Optimized", "Enterprise"],
    bestFor: ["Complex processing", "Enterprise applications", "High-performance computing"],
    purpose: "High-performance language processing",
    keyFeatures: ["Advanced optimization", "High performance", "Enterprise integration"],
    benchmarks: { mmlu: 86.7, speed: "fast" },
    lastUpdated: "2025-01-07",
  apiInfo: {
    endpoint: "https://api.neural-chat.intel.com/v1",
    authentication: "API Key",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://www.intel.com/neural-chat/docs"
  },
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "ibm-granite-1",
    name: "Granite 1",
    provider: "IBM",
    contextWindow: 32000,
    inputCostPer1M: 1.00,
    outputCostPer1M: 3.00,
    description: "Enterprise-grade language model",
    released: "2024",
    tags: ["Enterprise", "Secure", "Business"],
    bestFor: ["Enterprise solutions", "Business applications", "Secure processing"],
    purpose: "Enterprise language processing",
    keyFeatures: ["Enterprise security", "Business integration", "Compliance features"],
    benchmarks: { mmlu: 85.9, speed: "medium" },
    lastUpdated: "2025-01-07",
  apiInfo: {
    endpoint: "https://api.watsonx.ai/v1/text/generation",
    authentication: "IBM Cloud IAM Token",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://cloud.ibm.com/docs/watsonx"
  },
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "ibm-granite-2",
    name: "Granite 2",
    provider: "IBM",
    contextWindow: 128000,
    inputCostPer1M: 2.00,
    outputCostPer1M: 6.00,
    description: "Advanced enterprise AI solution",
    released: "2024",
    tags: ["Advanced", "Enterprise", "Secure"],
    bestFor: ["Complex enterprise tasks", "Regulated industries", "Business intelligence"],
    purpose: "Advanced enterprise processing",
    keyFeatures: ["Advanced security", "Regulatory compliance", "Business analytics"],
    benchmarks: { mmlu: 88.2, speed: "medium" },
    lastUpdated: "2025-01-07",
  apiInfo: {
    endpoint: "https://api.watsonx.ai/v1/text/generation",
    authentication: "IBM Cloud IAM Token",
    rateLimits: "Varies by tier",
    regionalAvailability: "Global",
    documentation: "https://cloud.ibm.com/docs/watsonx"
  },
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-07"
    },
  },
  {
    id: "o1",
    name: "o1",
    provider: "OpenAI",
    contextWindow: 200000,
    inputCostPer1M: 15.0,
    outputCostPer1M: 60.0,
    releaseDate: "2024-12-05",
    description: "OpenAI's most capable reasoning model with advanced problem-solving abilities.",
    strengths: ["Advanced reasoning", "Complex problem-solving", "Mathematical tasks", "Code generation"],
    benchmarks: {
      mmlu: 92.0,
      humanEval: 94.0,
      speed: "slow",
    },
    apiInfo: {
      endpoint: "https://api.openai.com/v1/chat/completions",
      authentication: "API Key (Bearer token)",
      rateLimits: "10,000 TPM on tier 1, up to 30M TPM on tier 5",
      regionalAvailability: "Global",
      documentation: "https://platform.openai.com/docs/models/o1"
    },
    lastUpdated: "2025-11-08",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2024-12-05"
    }
  },

  {
    id: "o3-mini",
    name: "o3-mini",
    provider: "OpenAI",
    contextWindow: 200000,
    inputCostPer1M: 1.1,
    outputCostPer1M: 4.4,
    releaseDate: "2025-01-31",
    description: "OpenAI's efficient reasoning model with strong performance at lower cost.",
    strengths: ["Cost-effective reasoning", "STEM tasks", "Coding", "Efficient processing"],
    benchmarks: {
      mmlu: 87.0,
      humanEval: 90.0,
      speed: "medium",
    },
    apiInfo: {
      endpoint: "https://api.openai.com/v1/chat/completions",
      authentication: "API Key (Bearer token)",
      rateLimits: "10,000 TPM on tier 1, up to 30M TPM on tier 5",
      regionalAvailability: "Global",
      documentation: "https://platform.openai.com/docs/models/o3-mini"
    },
    lastUpdated: "2025-11-08",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2025-01-31"
    }
  },

  {
    id: "codestral-2508",
    name: "Codestral",
    provider: "Mistral",
    contextWindow: 32000,
    inputCostPer1M: 1.0,
    outputCostPer1M: 3.0,
    releaseDate: "2024-05-29",
    description: "Mistral's specialized coding model optimized for code generation and completion.",
    strengths: ["Code generation", "Code completion", "Multi-language support", "Fast inference"],
    benchmarks: {
      mmlu: 78.0,
      humanEval: 88.0,
      speed: "fast",
    },
    apiInfo: {
      endpoint: "https://api.mistral.ai/v1/chat/completions",
      authentication: "API Key (Bearer token)",
      rateLimits: "Varies by subscription tier",
      regionalAvailability: "Global",
      documentation: "https://docs.mistral.ai/api"
    },
    lastUpdated: "2025-11-08",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2024-05-29"
    }
  },

  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    contextWindow: 1000000,
    inputCostPer1M: 0.1,
    outputCostPer1M: 0.4,
    releaseDate: "2024-12-11",
    description: "Google's fast and efficient multimodal model with native tool use.",
    strengths: ["Multimodal", "Native tool use", "Fast inference", "Cost-effective"],
    benchmarks: {
      mmlu: 89.0,
      humanEval: 91.0,
      speed: "fast",
    },
    apiInfo: {
      endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      authentication: "API Key",
      rateLimits: "15 RPM free tier, higher on paid tiers",
      regionalAvailability: "Global (restricted in some regions)",
      documentation: "https://ai.google.dev/gemini-api/docs"
    },
    lastUpdated: "2025-11-08",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2024-12-11"
    }
  },

  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    contextWindow: 64000,
    inputCostPer1M: 0.27,
    outputCostPer1M: 1.1,
    releaseDate: "2024-12-26",
    description: "DeepSeek's most capable model with 671B parameters and MoE architecture.",
    strengths: ["Cost-effective", "Strong reasoning", "Code generation", "Long context"],
    benchmarks: {
      mmlu: 88.0,
      humanEval: 89.0,
      speed: "medium",
    },
    apiInfo: {
      endpoint: "https://api.deepseek.com/v1/chat/completions",
      authentication: "API Key (Bearer token)",
      rateLimits: "Varies by subscription tier",
      regionalAvailability: "Global",
      documentation: "https://platform.deepseek.com/api-docs"
    },
    lastUpdated: "2025-11-08",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2024-12-26"
    }
  },

  {
    id: "gemma-2-9b",
    name: "Gemma 2 9B",
    provider: "Google",
    contextWindow: 8192,
    inputCostPer1M: 0.2,
    outputCostPer1M: 0.2,
    releaseDate: "2024-06-27",
    description: "Google's open-source lightweight model for efficient deployment.",
    strengths: ["Open-source", "Efficient", "On-device capable", "Cost-effective"],
    benchmarks: {
      mmlu: 71.0,
      humanEval: 73.0,
      speed: "fast",
    },
    apiInfo: {
      endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemma-2-9b:generateContent",
      authentication: "API Key",
      rateLimits: "15 RPM free tier, higher on paid tiers",
      regionalAvailability: "Global",
      documentation: "https://ai.google.dev/gemma/docs"
    },
    lastUpdated: "2025-11-08",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2024-06-27"
    }
  },

  {
    id: "gemma-2-27b",
    name: "Gemma 2 27B",
    provider: "Google",
    contextWindow: 8192,
    inputCostPer1M: 0.27,
    outputCostPer1M: 0.27,
    releaseDate: "2024-06-27",
    description: "Google's larger open-source model with enhanced capabilities.",
    strengths: ["Open-source", "Strong performance", "Versatile", "Self-hostable"],
    benchmarks: {
      mmlu: 81.0,
      humanEval: 84.0,
      speed: "medium",
    },
    apiInfo: {
      endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemma-2-27b:generateContent",
      authentication: "API Key",
      rateLimits: "15 RPM free tier, higher on paid tiers",
      regionalAvailability: "Global",
      documentation: "https://ai.google.dev/gemma/docs"
    },
    lastUpdated: "2025-11-08",
    status: {
      isNew: true,
      pricingUpdated: true,
      pricingUpdateDate: "2024-06-27"
    }
  },

];

export const TOKENS_PER_BOOK = 100000;
export const TOKENS_PER_PAGE = 300;

export function calculateBooksInContext(contextWindow: number): number {
  return Number((contextWindow / TOKENS_PER_BOOK).toFixed(2));
}

export function calculatePagesInContext(contextWindow: number): number {
  return Math.floor(contextWindow / TOKENS_PER_PAGE);
}

export function calculateCostForBooks(
  books: number,
  inputCostPer1M: number,
  outputCostPer1M: number
): { inputCost: number; outputCost: number; totalCost: number } {
  const tokens = books * TOKENS_PER_BOOK;
  const inputCost = (tokens / 1000000) * inputCostPer1M;
  const outputCost = (tokens / 1000000) * outputCostPer1M;

  return {
    inputCost: Number(inputCost.toFixed(4)),
    outputCost: Number(outputCost.toFixed(4)),
    totalCost: Number((inputCost + outputCost).toFixed(4)),
  };
}
