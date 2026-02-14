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
  temperature: z.coerce.number().min(0).max(2).default(0.7),
  topP: z.coerce.number().min(0).max(1).default(1),
  presencePenalty: z.coerce.number().min(-2).max(2).default(0),
  frequencyPenalty: z.coerce.number().min(-2).max(2).default(0),
  logitBias: z.record(z.coerce.number()).default({}),
});

type OpenAIResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
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

type GenerationSettings = {
  temperature: number;
  topP: number;
  presencePenalty: number;
  frequencyPenalty: number;
  logitBias: Record<string, number>;
};

async function fetchOpenAiStructures(model: string, prompt: string, settings: GenerationSettings): Promise<string> {
  const apiKey = process.env.OPENAI_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_KEY is not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: settings.temperature,
      top_p: settings.topP,
      presence_penalty: settings.presencePenalty,
      frequency_penalty: settings.frequencyPenalty,
      logit_bias: Object.keys(settings.logitBias).length ? settings.logitBias : undefined,
      messages: [
        { role: 'system', content: 'You are a precise assistant that returns valid JSON only.' },
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${details}`);
  }

  const data = (await response.json()) as OpenAIResponse;
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('OpenAI returned an empty response');
  }

  return content;
}

async function fetchGeminiStructures(model: string, prompt: string, settings: GenerationSettings): Promise<string> {
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
          temperature: settings.temperature,
          topP: settings.topP,
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
    throw new Error(`Gemini request failed: ${response.status} ${details}`);
  }

  const data = (await response.json()) as GeminiResponse;
  const content = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('').trim();

  if (!content) {
    throw new Error('Gemini returned an empty response');
  }

  return content;
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

  try {
    const prompt = buildCourseStructurePrompt(payload);
    const content =
      payload.provider === 'openai'
        ? await fetchOpenAiStructures(payload.model, prompt, payload)
        : await fetchGeminiStructures(payload.model, prompt, payload);

    const parsed = responseSchema.parse(JSON.parse(content));

    return res.status(200).json({ structures: toSuggestedStructures(parsed.structures) });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return res.status(500).json({ error: message });
  }
}
