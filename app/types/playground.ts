// Model Performance Testing Playground Types

export interface TestPrompt {
  id: string;
  prompt: string;
  createdAt: string;
}

export interface ModelTestResult {
  id: string;
  modelId: string;
  modelName: string;
  provider: string;
  prompt: string;
  response: string;
  responseTime: number; // in milliseconds
  tokensUsed: {
    input: number;
    output: number;
    total: number;
  };
  cost: {
    input: number;
    output: number;
    total: number;
  };
  qualityScore?: number; // User-assigned score 1-5
  qualityNotes?: string;
  timestamp: string;
  error?: string;
}

export interface TestComparison {
  id: string;
  prompt: string;
  results: ModelTestResult[];
  createdAt: string;
  notes?: string;
}

export interface TestHistory {
  tests: TestComparison[];
  favorites: string[]; // Test IDs
}

export interface ApiTestRequest {
  modelId: string;
  provider: string;
  prompt: string;
  apiKey: string;
  maxTokens?: number;
  temperature?: number;
}

export interface ApiTestResponse {
  response: string;
  responseTime: number;
  tokensUsed: {
    input: number;
    output: number;
    total: number;
  };
  error?: string;
}
