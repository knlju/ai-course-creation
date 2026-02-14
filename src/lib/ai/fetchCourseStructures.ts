import { AiProvider } from './models';
import { SuggestedStructure } from './courseStructure';

type FetchCourseStructuresInput = {
  provider: AiProvider;
  model: string;
  temperature: number;
  topP: number;
  presencePenalty: number;
  frequencyPenalty: number;
  logitBias: Record<string, number>;
  courseTopic: string;
  language: string;
  audience: string;
  learnerProficiency: 'entry' | 'intermediate' | 'advanced';
  courseDuration: 'quick' | 'regular' | 'extensive';
  learningGoal: string;
  courseTitle: string;
};

export async function fetchCourseStructures(input: FetchCourseStructuresInput): Promise<SuggestedStructure[]> {
  const response = await fetch('/api/ai/structures', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  const data = (await response.json()) as { structures?: SuggestedStructure[]; error?: string };

  if (!response.ok || !data.structures) {
    throw new Error(data.error ?? 'Failed to generate course structures');
  }

  return data.structures;
}
