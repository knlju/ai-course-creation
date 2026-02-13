import { AiProvider } from '../../../lib/ai/models';
import { OpenAiSuggestionProvider } from './openaiProvider';
import { SuggestionProvider } from './types';

const providers: Record<AiProvider, SuggestionProvider | null> = {
  openai: new OpenAiSuggestionProvider(),
  gemini: null,
};

export function getSuggestionProvider(provider: AiProvider): SuggestionProvider {
  const instance = providers[provider];

  if (!instance) {
    throw new Error(`${provider} provider is not configured yet`);
  }

  return instance;
}
