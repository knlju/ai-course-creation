export type AiProvider = 'openai' | 'gemini';

export type ProviderModel = {
  id: string;
  label: string;
  available: boolean;
};

export const PROVIDER_MODELS: Record<AiProvider, ProviderModel[]> = {
  openai: [{ id: 'gpt-4.1-nano', label: 'GPT-4.1 Nano (cheapest)', available: true }],
  gemini: [{ id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash', available: true }],
};
