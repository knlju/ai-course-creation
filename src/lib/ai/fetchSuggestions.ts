import { SuggestionField } from './prompt';
import { AiProvider } from './models';

type FetchSuggestionsInput = {
  provider: AiProvider;
  model: string;
  field: SuggestionField;
  courseTopic: string;
  language: string;
  audience: string;
  learningGoal: string;
  courseTitle: string;
};

export async function fetchSuggestions(input: FetchSuggestionsInput): Promise<string[]> {
  const response = await fetch('/api/ai/suggestions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  const data = (await response.json()) as { suggestions?: string[]; error?: string };

  if (!response.ok || !data.suggestions) {
    throw new Error(data.error ?? 'Failed to generate suggestions');
  }

  return data.suggestions;
}
