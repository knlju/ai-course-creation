export type AiProvider = 'openai' | 'gemini';

export type ProviderModel = {
  id: string;
  label: string;
  available: boolean;
  isFree?: boolean;
};

export const PROVIDER_MODELS: Record<AiProvider, ProviderModel[]> = {
  openai: [
    { id: 'gpt-4.1', label: 'GPT-4.1', available: true },
    { id: 'gpt-4.1-mini', label: 'GPT-4.1 Mini', available: true },
    { id: 'gpt-4.1-nano', label: 'GPT-4.1 Nano', available: true },
    { id: 'gpt-4o', label: 'GPT-4o', available: true },
    { id: 'gpt-4o-mini', label: 'GPT-4o Mini', available: true },
    { id: 'o1', label: 'o1', available: true },
    { id: 'o1-mini', label: 'o1 Mini', available: true },
    { id: 'o3-mini', label: 'o3 Mini', available: true },
  ],
  gemini: [
    { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash', available: true },
    { id: 'gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash-Lite', available: true, isFree: true },
    { id: 'gemini-1.5-pro-002', label: 'Gemini 1.5 Pro', available: true },
    { id: 'gemini-1.5-flash-002', label: 'Gemini 1.5 Flash', available: true, isFree: true },
  ],
};

export function getProviderModels(provider: AiProvider): ProviderModel[] {
  return PROVIDER_MODELS[provider];
}

export function getProviderForModel(modelId: string): AiProvider | null {
  const providerEntry = (Object.entries(PROVIDER_MODELS) as Array<[AiProvider, ProviderModel[]]>).find(([, models]) =>
    models.some((model) => model.id === modelId)
  );

  return providerEntry?.[0] ?? null;
}

export function getFirstAvailableModel(provider: AiProvider): ProviderModel | null {
  return PROVIDER_MODELS[provider].find((model) => model.available) ?? null;
}

export function getModelLabel(model: ProviderModel): string {
  return model.isFree ? `${model.label} (free)` : model.label;
}
