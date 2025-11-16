import { NextResponse } from 'next/server';
import { llmModels, type LLMModel } from '../../data/llm-data';
import * as cheerio from 'cheerio';

// Provider documentation URLs for scraping pricing data
const PROVIDER_DOCS = {
  openai: 'https://openai.com/api/pricing/',
  anthropic: 'https://www.anthropic.com/pricing',
  google: 'https://ai.google.dev/pricing',
  mistral: 'https://docs.mistral.ai/platform/pricing/',
  cohere: 'https://cohere.com/pricing',
  meta: 'https://ai.meta.com/llama/',
  xai: 'https://x.ai/api',
  perplexity: 'https://docs.perplexity.ai/docs/pricing',
};

interface ParsedModel {
  name: string;
  modelId?: string;
  inputCost?: number;
  outputCost?: number;
  contextWindow?: number;
  provider: string;
}

interface ModelUpdate {
  modelId: string;
  modelName: string;
  provider: string;
  changes: Array<{
    field: string;
    oldValue: string;
    newValue: string;
    changeType: 'added' | 'removed' | 'modified';
  }>;
}

async function fetchProviderData(provider: string, url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch ${provider}: ${response.status}`);
      return null;
    }

    const html = await response.text();
    return html;
  } catch (error) {
    console.error(`Error fetching ${provider}:`, error);
    return null;
  }
}

function parseOpenAIData(html: string): ParsedModel[] {
  const $ = cheerio.load(html);
  const models: ParsedModel[] = [];

  try {
    // OpenAI pricing page structure - this is a best-effort parse
    // May need adjustment based on actual HTML structure
    $('table tr, .pricing-table tr').each((_, row) => {
      const cells = $(row).find('td');
      if (cells.length >= 3) {
        const modelName = $(cells[0]).text().trim();
        const inputText = $(cells[1]).text().trim();
        const outputText = $(cells[2]).text().trim();

        const inputCost = parseFloat(inputText.replace(/[^0-9.]/g, ''));
        const outputCost = parseFloat(outputText.replace(/[^0-9.]/g, ''));

        if (modelName && !isNaN(inputCost) && !isNaN(outputCost)) {
          models.push({
            name: modelName,
            inputCost,
            outputCost,
            provider: 'OpenAI',
          });
        }
      }
    });
  } catch (error) {
    console.error('Error parsing OpenAI data:', error);
  }

  return models;
}

function parseAnthropicData(html: string): ParsedModel[] {
  const $ = cheerio.load(html);
  const models: ParsedModel[] = [];

  try {
    // Look for pricing cards or tables
    $('.pricing-card, [class*="price"], [class*="model"]').each((_, el) => {
      const text = $(el).text();
      // Extract model names and prices using patterns
      // This is simplified - actual implementation would be more robust
      const modelMatch = text.match(/Claude.+?(?=\$|Input)/i);
      const inputMatch = text.match(/Input.+?\$([0-9.]+)/i);
      const outputMatch = text.match(/Output.+?\$([0-9.]+)/i);

      if (modelMatch && inputMatch && outputMatch) {
        models.push({
          name: modelMatch[0].trim(),
          inputCost: parseFloat(inputMatch[1]),
          outputCost: parseFloat(outputMatch[1]),
          provider: 'Anthropic',
        });
      }
    });
  } catch (error) {
    console.error('Error parsing Anthropic data:', error);
  }

  return models;
}

function parseGenericPricingPage(html: string, provider: string): ParsedModel[] {
  const $ = cheerio.load(html);
  const models: ParsedModel[] = [];

  try {
    // Generic parser that looks for common pricing patterns
    const text = $('body').text();

    // Look for model names (common patterns)
    const modelPatterns = [
      /(\w+[-\s]\w+[-\s]?\w*)\s*(?:Model|API)?/gi,
    ];

    // Look for pricing ($/million tokens pattern)
    const pricePattern = /\$\s*([0-9.]+)\s*(?:per|\/)\s*(?:1M|million|M)\s*tokens?/gi;

    // This is a simplified approach - in production, you'd need
    // more sophisticated parsing based on each provider's structure
  } catch (error) {
    console.error(`Error parsing ${provider} data:`, error);
  }

  return models;
}

function detectChanges(oldModels: LLMModel[], newData: ParsedModel[]): ModelUpdate[] {
  const changes: ModelUpdate[] = [];

  // Match new data with existing models
  for (const newModel of newData) {
    // Find matching model in old data by name similarity
    const oldModel = oldModels.find(m =>
      m.name.toLowerCase().includes(newModel.name.toLowerCase()) ||
      newModel.name.toLowerCase().includes(m.name.toLowerCase()) ||
      m.id === newModel.modelId
    );

    if (oldModel) {
      const modelChanges: Array<{
        field: string;
        oldValue: string;
        newValue: string;
        changeType: 'added' | 'removed' | 'modified';
      }> = [];

      // Check price changes
      if (newModel.inputCost && oldModel.inputCostPer1M !== newModel.inputCost) {
        modelChanges.push({
          field: 'Input Cost (per 1M tokens)',
          oldValue: `$${oldModel.inputCostPer1M.toFixed(2)}`,
          newValue: `$${newModel.inputCost.toFixed(2)}`,
          changeType: 'modified',
        });
      }

      if (newModel.outputCost && oldModel.outputCostPer1M !== newModel.outputCost) {
        modelChanges.push({
          field: 'Output Cost (per 1M tokens)',
          oldValue: `$${oldModel.outputCostPer1M.toFixed(2)}`,
          newValue: `$${newModel.outputCost.toFixed(2)}`,
          changeType: 'modified',
        });
      }

      if (newModel.contextWindow && oldModel.contextWindow !== newModel.contextWindow) {
        modelChanges.push({
          field: 'Context Window',
          oldValue: `${oldModel.contextWindow.toLocaleString()} tokens`,
          newValue: `${newModel.contextWindow.toLocaleString()} tokens`,
          changeType: 'modified',
        });
      }

      if (modelChanges.length > 0) {
        changes.push({
          modelId: oldModel.id,
          modelName: oldModel.name,
          provider: oldModel.provider,
          changes: modelChanges,
        });
      }
    }
  }

  return changes;
}

function generateChangelogEntries(changes: ModelUpdate[]) {
  return changes.map((change, index) => {
    const priceChanges = change.changes.filter(c => c.field.includes('Cost'));
    let summary = '';

    if (priceChanges.length > 0) {
      const inputChange = priceChanges.find(c => c.field.includes('Input'));
      const outputChange = priceChanges.find(c => c.field.includes('Output'));

      if (inputChange && outputChange) {
        const inputOld = parseFloat(inputChange.oldValue.replace(/[^0-9.]/g, ''));
        const inputNew = parseFloat(inputChange.newValue.replace(/[^0-9.]/g, ''));
        const outputOld = parseFloat(outputChange.oldValue.replace(/[^0-9.]/g, ''));
        const outputNew = parseFloat(outputChange.newValue.replace(/[^0-9.]/g, ''));

        const inputPercent = ((inputNew - inputOld) / inputOld * 100).toFixed(1);
        const outputPercent = ((outputNew - outputOld) / outputOld * 100).toFixed(1);

        summary = `Price ${inputNew < inputOld ? 'reduction' : 'increase'}: Input costs ${inputNew < inputOld ? 'decreased' : 'increased'} by ${Math.abs(Number(inputPercent))}%, output costs ${outputNew < outputOld ? 'decreased' : 'increased'} by ${Math.abs(Number(outputPercent))}%`;
      }
    } else {
      summary = change.changes.map(c => `${c.field} changed from ${c.oldValue} to ${c.newValue}`).join(', ');
    }

    return {
      id: `auto-${Date.now()}-${index}`,
      modelId: change.modelId,
      modelName: change.modelName,
      provider: change.provider,
      changeDate: new Date().toISOString(),
      changeType: priceChanges.length > 0 ? 'price' : 'update',
      changes: change.changes,
      summary,
    };
  });
}

export async function POST() {
  try {
    console.log('Starting model data refresh...');

    // Fetch data from all providers
    const fetchPromises = Object.entries(PROVIDER_DOCS).map(async ([provider, url]) => {
      const html = await fetchProviderData(provider, url);
      return { provider, html };
    });

    const results = await Promise.all(fetchPromises);

    // Parse the fetched data
    const allParsedModels: ParsedModel[] = [];

    for (const result of results) {
      if (!result.html) continue;

      let parsedModels: ParsedModel[] = [];

      try {
        switch (result.provider) {
          case 'openai':
            parsedModels = parseOpenAIData(result.html);
            break;
          case 'anthropic':
            parsedModels = parseAnthropicData(result.html);
            break;
          default:
            parsedModels = parseGenericPricingPage(result.html, result.provider);
            break;
        }

        allParsedModels.push(...parsedModels);
        console.log(`Parsed ${parsedModels.length} models from ${result.provider}`);
      } catch (error) {
        console.error(`Error parsing ${result.provider}:`, error);
      }
    }

    // Detect changes by comparing with existing models
    const changes = detectChanges(llmModels, allParsedModels);
    console.log(`Detected ${changes.length} model changes`);

    // Generate changelog entries
    const changelogEntries = generateChangelogEntries(changes);

    // Save changelog entries to localStorage (will be done on client side)
    const successCount = results.filter(r => r.html !== null).length;
    const failedProviders = results
      .filter(r => r.html === null)
      .map(r => r.provider);

    return NextResponse.json({
      success: true,
      message: changes.length > 0
        ? `Found ${changes.length} model update(s) from ${successCount} provider(s). Check changelog for details.`
        : `No changes detected. Fetched data from ${successCount}/${Object.keys(PROVIDER_DOCS).length} providers.`,
      timestamp: new Date().toISOString(),
      fetchedProviders: successCount,
      totalProviders: Object.keys(PROVIDER_DOCS).length,
      failedProviders,
      parsedModelsCount: allParsedModels.length,
      changesDetected: changes.length,
      changelogEntries, // Send to client to save in localStorage
      changes, // Detailed changes for debugging
    });

  } catch (error) {
    console.error('Model refresh error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to refresh model data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
