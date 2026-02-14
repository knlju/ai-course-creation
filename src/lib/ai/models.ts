export type AiProvider = 'openai' | 'gemini';

export type ProviderModel = {
  id: string;
  label: string;
  available: boolean;
};

export const PROVIDER_MODELS: Record<AiProvider, ProviderModel[]> = {
  openai: [
    { id: 'gpt-4.1', label: 'GPT-4.1', available: true },
    { id: 'gpt-4.1-mini', label: 'GPT-4.1 Mini', available: true },
    { id: 'gpt-4.1-nano', label: 'GPT-4.1 Nano (cheapest)', available: true },
    { id: 'gpt-4o', label: 'GPT-4o', available: true },
    { id: 'gpt-4o-mini', label: 'GPT-4o Mini', available: true },
    { id: 'o1', label: 'o1', available: true },
    { id: 'o1-mini', label: 'o1 Mini', available: true },
    { id: 'o3-mini', label: 'o3 Mini', available: true },
  ],
  gemini: [
    { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash', available: true },
    { id: 'gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash-Lite', available: true },
    { id: 'gemini-1.5-pro-002', label: 'Gemini 1.5 Pro', available: true },
    { id: 'gemini-1.5-flash-002', label: 'Gemini 1.5 Flash', available: true },
  ],
};

export const ALL_MODELS = (Object.entries(PROVIDER_MODELS) as Array<[AiProvider, ProviderModel[]]>).flatMap(
  ([provider, models]) => models.map((model) => ({ ...model, provider }))
);

export function getProviderForModel(modelId: string): AiProvider | null {
  const selectedModel = ALL_MODELS.find((model) => model.id === modelId);
  return selectedModel?.provider ?? null;
}
