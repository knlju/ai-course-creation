import { SuggestionProvider, SuggestionContext } from './types';

type OpenAIResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

function parseSuggestions(payload: string): string[] {
  const parsed = JSON.parse(payload) as { suggestions?: string[] };
  if (!Array.isArray(parsed.suggestions)) {
    throw new Error('Invalid suggestions payload returned by model');
  }

  return parsed.suggestions.slice(0, 3).map((item) => item.trim()).filter(Boolean);
}

export class OpenAiSuggestionProvider implements SuggestionProvider {
  readonly provider = 'openai' as const;

  async generateSuggestions({ prompt, model }: SuggestionContext): Promise<string[]> {
    const apiKey = process.env.OPENAI_KEY;

    if (!apiKey) {
      throw new Error('OPENAI_KEY is not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        messages: [
          { role: 'system', content: 'You are a precise assistant that returns valid JSON only.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`OpenAI request failed: ${response.status} ${details}`);
    }

    const data = (await response.json()) as OpenAIResponse;
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('OpenAI returned an empty response');
    }

    return parseSuggestions(content);
  }
}
