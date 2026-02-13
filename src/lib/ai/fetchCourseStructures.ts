import { AiProvider } from './models';
import { SuggestedStructure } from './courseStructure';

type FetchCourseStructuresInput = {
  provider: AiProvider;
  model: string;
  courseTopic: string;
  language: string;
  audience: string;
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
