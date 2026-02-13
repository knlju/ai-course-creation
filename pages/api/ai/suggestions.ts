import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { PROVIDER_MODELS } from '../../../src/lib/ai/models';
import { buildSuggestionPrompt } from '../../../src/lib/ai/prompt';
import { getSuggestionProvider } from '../../../src/server/ai/providers';

const requestSchema = z.object({
  provider: z.enum(['openai', 'gemini']),
  model: z.string().min(1),
  field: z.enum(['learningGoal', 'courseTitle', 'courseDescription']),
  courseTopic: z.string().default(''),
  language: z.string().default('English'),
  audience: z.string().default(''),
  learningGoal: z.string().default(''),
  courseTitle: z.string().default(''),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const parsedRequest = requestSchema.safeParse(req.body);

  if (!parsedRequest.success) {
    return res.status(400).json({ error: parsedRequest.error.flatten() });
  }

  const payload = parsedRequest.data;
  const modelIsAllowed = PROVIDER_MODELS[payload.provider].some(
    (model) => model.id === payload.model && model.available
  );

  if (!modelIsAllowed) {
    return res.status(400).json({ error: `Model ${payload.model} is not available for ${payload.provider}` });
  }

  try {
    const provider = getSuggestionProvider(payload.provider);
    const prompt = buildSuggestionPrompt(payload.field, payload);
    const suggestions = await provider.generateSuggestions({
      field: payload.field,
      model: payload.model,
      prompt,
    });

    return res.status(200).json({ suggestions });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return res.status(500).json({ error: message });
  }
}
