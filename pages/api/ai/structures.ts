import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { PROVIDER_MODELS } from '../../../src/lib/ai/models';
import { buildCourseStructurePrompt, SuggestedStructure } from '../../../src/lib/ai/courseStructure';

const structureSchema = z.object({
  label: z.string().min(1),
  modules: z
    .array(
      z.object({
        title: z.string().min(1),
        lessons: z.array(z.object({ title: z.string().min(1) })).min(1),
        quizTitle: z.string().min(1),
      })
    )
    .min(1),
});

const responseSchema = z.object({
  structures: z.array(structureSchema).length(3),
});

const requestSchema = z.object({
  provider: z.enum(['openai', 'gemini']),
  model: z.string().min(1),
  courseTopic: z.string().default(''),
  language: z.string().default('English'),
  audience: z.string().default(''),
  learnerProficiency: z.enum(['entry', 'intermediate', 'advanced']).default('entry'),
  courseDuration: z.enum(['quick', 'regular', 'extensive']).default('regular'),
  learningGoal: z.string().default(''),
  courseTitle: z.string().default(''),
});

type OpenAIResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

function toSuggestedStructures(structures: z.infer<typeof structureSchema>[]): SuggestedStructure[] {
  return structures.map((structure, index) => ({
    id: `s${index + 1}`,
    label: structure.label,
    modules: structure.modules,
  }));
}

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

  if (payload.provider !== 'openai') {
    return res.status(400).json({ error: `${payload.provider} provider is not configured yet` });
  }

  const apiKey = process.env.OPENAI_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_KEY is not configured' });
  }

  try {
    const prompt = buildCourseStructurePrompt(payload);
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: payload.model,
        temperature: 0.7,
        messages: [
          { role: 'system', content: 'You are a precise assistant that returns valid JSON only.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      return res.status(500).json({ error: `OpenAI request failed: ${response.status} ${details}` });
    }

    const data = (await response.json()) as OpenAIResponse;
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(500).json({ error: 'OpenAI returned an empty response' });
    }

    const parsed = responseSchema.parse(JSON.parse(content));

    return res.status(200).json({ structures: toSuggestedStructures(parsed.structures) });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return res.status(500).json({ error: message });
  }
}
