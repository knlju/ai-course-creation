import { SuggestionContext, SuggestionProvider } from './types';

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
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


function parseGeminiError(status: number, details: string): string {
  if (status === 429) {
    return [
      'Gemini quota exceeded (429).',
      'Your current Gemini plan has no remaining quota for this model.',
      'Try another Gemini model, switch to OpenAI, or retry later.',
      `Details: ${details}`,
    ].join(' ');
  }

  if (status === 404) {
    return [
      'Selected Gemini model is unavailable for generateContent (404).',
      'Please choose a different Gemini model from the dropdown.',
      `Details: ${details}`,
    ].join(' ');
  }

  return `Gemini request failed: ${status} ${details}`;
}

export class GeminiSuggestionProvider implements SuggestionProvider {
  readonly provider = 'gemini' as const;

  async generateSuggestions({ prompt, model }: SuggestionContext): Promise<string[]> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          generationConfig: {
            temperature: 0.7,
          },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: {
            role: 'system',
            parts: [{ text: 'You are a precise assistant that returns valid JSON only.' }],
          },
        }),
      }
    );

    if (!response.ok) {
      const details = await response.text();
      throw new Error(parseGeminiError(response.status, details));
    }

    const data = (await response.json()) as GeminiResponse;
    const content = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('').trim();

    if (!content) {
      throw new Error('Gemini returned an empty response');
    }

    return parseSuggestions(content);
  }
}
