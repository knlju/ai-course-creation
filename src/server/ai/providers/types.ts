import { AiProvider } from '../../../lib/ai/models';
import { SuggestionField } from '../../../lib/ai/prompt';

export type SuggestionContext = {
  field: SuggestionField;
  prompt: string;
  model: string;
  temperature: number;
  topP: number;
  presencePenalty: number;
  frequencyPenalty: number;
  logitBias: Record<string, number>;
};

export interface SuggestionProvider {
  readonly provider: AiProvider;
  generateSuggestions(context: SuggestionContext): Promise<string[]>;
}
