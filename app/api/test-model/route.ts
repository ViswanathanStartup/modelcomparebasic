import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { modelId, provider, prompt, apiKey, maxTokens = 1000, temperature = 0.7 } = body;

    if (!prompt || !provider || !apiKey) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt, provider, or apiKey' },
        { status: 400 }
      );
    }

    const startTime = Date.now();
    let response: any;
    let tokensUsed = { input: 0, output: 0, total: 0 };

    // Route to appropriate provider
    switch (provider.toLowerCase()) {
      case 'openai':
        response = await testOpenAI(prompt, apiKey, modelId, maxTokens, temperature);
        break;
      case 'anthropic':
        response = await testAnthropic(prompt, apiKey, modelId, maxTokens, temperature);
        break;
      case 'google':
        response = await testGoogle(prompt, apiKey, modelId, maxTokens, temperature);
        break;
      case 'meta':
        response = await testMeta(prompt, apiKey, modelId, maxTokens, temperature);
        break;
      case 'mistral':
        response = await testMistral(prompt, apiKey, modelId, maxTokens, temperature);
        break;
      case 'cohere':
        response = await testCohere(prompt, apiKey, modelId, maxTokens, temperature);
        break;
      case 'xai':
        response = await testXAI(prompt, apiKey, modelId, maxTokens, temperature);
        break;
      case 'deepseek':
        response = await testDeepSeek(prompt, apiKey, modelId, maxTokens, temperature);
        break;
      default:
        // For all other providers, return helpful guidance
        return NextResponse.json(
          {
            error: `Live API testing is not yet supported for ${provider} models. ` +
                   `Currently supported: OpenAI, Anthropic, Google, Meta, Mistral, Cohere, xAI, and DeepSeek. ` +
                   `\n\nTo test ${provider} models, please use their official API or playground. ` +
                   `Check the model's API documentation for integration details.`,
            response: '',
            responseTime: 0,
            tokensUsed: { input: 0, output: 0, total: 0 }
          },
          { status: 501 }
        );
    }

    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      response: response.text,
      responseTime,
      tokensUsed: response.tokensUsed,
    });
  } catch (error: any) {
    console.error('API test error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to test model',
        response: '',
        responseTime: 0,
        tokensUsed: { input: 0, output: 0, total: 0 }
      },
      { status: 500 }
    );
  }
}

async function testOpenAI(
  prompt: string,
  apiKey: string,
  modelId: string,
  maxTokens: number,
  temperature: number
) {
  // o1 series models use max_completion_tokens instead of max_tokens
  const isO1Model = modelId.startsWith('o1') || modelId.startsWith('o3');

  const requestBody: any = {
    model: modelId,
    messages: [{ role: 'user', content: prompt }],
  };

  // o1 models use max_completion_tokens and don't support temperature
  if (isO1Model) {
    requestBody.max_completion_tokens = maxTokens;
  } else {
    requestBody.max_tokens = maxTokens;
    requestBody.temperature = temperature;
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'OpenAI API request failed');
  }

  const data = await response.json();

  return {
    text: data.choices[0]?.message?.content || '',
    tokensUsed: {
      input: data.usage?.prompt_tokens || 0,
      output: data.usage?.completion_tokens || 0,
      total: data.usage?.total_tokens || 0,
    },
  };
}

async function testAnthropic(
  prompt: string,
  apiKey: string,
  modelId: string,
  maxTokens: number,
  temperature: number
) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: modelId,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature: temperature,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Anthropic API request failed');
  }

  const data = await response.json();

  return {
    text: data.content[0]?.text || '',
    tokensUsed: {
      input: data.usage?.input_tokens || 0,
      output: data.usage?.output_tokens || 0,
      total: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
    },
  };
}

async function testGoogle(
  prompt: string,
  apiKey: string,
  modelId: string,
  maxTokens: number,
  temperature: number
) {
  // Google Gemini API
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: temperature,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Google API request failed');
  }

  const data = await response.json();

  // Estimate token count (Google doesn't always provide this)
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const estimatedInputTokens = Math.ceil(prompt.length / 4);
  const estimatedOutputTokens = Math.ceil(text.length / 4);

  return {
    text,
    tokensUsed: {
      input: data.usageMetadata?.promptTokenCount || estimatedInputTokens,
      output: data.usageMetadata?.candidatesTokenCount || estimatedOutputTokens,
      total: data.usageMetadata?.totalTokenCount || (estimatedInputTokens + estimatedOutputTokens),
    },
  };
}

async function testMeta(
  prompt: string,
  apiKey: string,
  modelId: string,
  maxTokens: number,
  temperature: number
) {
  // Meta Llama models via Replicate API
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${apiKey}`,
    },
    body: JSON.stringify({
      version: modelId,
      input: {
        prompt: prompt,
        max_tokens: maxTokens,
        temperature: temperature,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Meta/Replicate API request failed');
  }

  const prediction = await response.json();

  // Wait for prediction to complete
  let result = prediction;
  while (result.status === 'starting' || result.status === 'processing') {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const checkResponse = await fetch(`https://api.replicate.com/v1/predictions/${result.id}`, {
      headers: { 'Authorization': `Token ${apiKey}` },
    });
    result = await checkResponse.json();
  }

  if (result.status === 'failed') {
    throw new Error(result.error || 'Meta model prediction failed');
  }

  const text = Array.isArray(result.output) ? result.output.join('') : result.output || '';
  const estimatedInputTokens = Math.ceil(prompt.length / 4);
  const estimatedOutputTokens = Math.ceil(text.length / 4);

  return {
    text,
    tokensUsed: {
      input: estimatedInputTokens,
      output: estimatedOutputTokens,
      total: estimatedInputTokens + estimatedOutputTokens,
    },
  };
}

async function testMistral(
  prompt: string,
  apiKey: string,
  modelId: string,
  maxTokens: number,
  temperature: number
) {
  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelId,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature: temperature,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Mistral API request failed');
  }

  const data = await response.json();

  return {
    text: data.choices[0]?.message?.content || '',
    tokensUsed: {
      input: data.usage?.prompt_tokens || 0,
      output: data.usage?.completion_tokens || 0,
      total: data.usage?.total_tokens || 0,
    },
  };
}

async function testCohere(
  prompt: string,
  apiKey: string,
  modelId: string,
  maxTokens: number,
  temperature: number
) {
  const response = await fetch('https://api.cohere.ai/v1/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelId,
      message: prompt,
      max_tokens: maxTokens,
      temperature: temperature,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Cohere API request failed');
  }

  const data = await response.json();
  const text = data.text || '';

  return {
    text,
    tokensUsed: {
      input: data.meta?.billed_units?.input_tokens || Math.ceil(prompt.length / 4),
      output: data.meta?.billed_units?.output_tokens || Math.ceil(text.length / 4),
      total: (data.meta?.billed_units?.input_tokens || Math.ceil(prompt.length / 4)) +
             (data.meta?.billed_units?.output_tokens || Math.ceil(text.length / 4)),
    },
  };
}

async function testXAI(
  prompt: string,
  apiKey: string,
  modelId: string,
  maxTokens: number,
  temperature: number
) {
  // xAI Grok API (OpenAI-compatible)
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelId,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature: temperature,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'xAI API request failed');
  }

  const data = await response.json();

  return {
    text: data.choices[0]?.message?.content || '',
    tokensUsed: {
      input: data.usage?.prompt_tokens || 0,
      output: data.usage?.completion_tokens || 0,
      total: data.usage?.total_tokens || 0,
    },
  };
}

async function testDeepSeek(
  prompt: string,
  apiKey: string,
  modelId: string,
  maxTokens: number,
  temperature: number
) {
  // DeepSeek API (OpenAI-compatible)
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelId,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature: temperature,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'DeepSeek API request failed');
  }

  const data = await response.json();

  return {
    text: data.choices[0]?.message?.content || '',
    tokensUsed: {
      input: data.usage?.prompt_tokens || 0,
      output: data.usage?.completion_tokens || 0,
      total: data.usage?.total_tokens || 0,
    },
  };
}
