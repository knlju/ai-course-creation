import { AiProvider } from '../../../lib/ai/models';
import { SuggestionField } from '../../../lib/ai/prompt';

export type SuggestionContext = {
  field: SuggestionField;
  prompt: string;
  model: string;
};

export interface SuggestionProvider {
  readonly provider: AiProvider;
  generateSuggestions(context: SuggestionContext): Promise<string[]>;
}
