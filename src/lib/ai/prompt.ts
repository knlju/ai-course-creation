import { FormValues } from '../formSchema';

export type SuggestionField = 'learningGoal' | 'courseTitle' | 'courseDescription';

type PromptInput = Pick<
  FormValues,
  'courseTopic' | 'language' | 'audience' | 'learnerProficiency' | 'courseDuration' | 'learningGoal' | 'courseTitle'
>;

const fieldInstructions: Record<SuggestionField, string> = {
  learningGoal:
    'Return learner outcome statements. Start each with an action verb and keep each suggestion to one sentence.',
  courseTitle: 'Return concise, marketable course titles. Keep each suggestion under 12 words.',
  courseDescription:
    'Return short descriptions (1-2 sentences) focused on learner value and practical outcomes.',
};

export function buildSuggestionPrompt(field: SuggestionField, input: PromptInput) {
  return [
    'You generate high-quality course-authoring suggestions for educators.',
    fieldInstructions[field],
    'Output requirements:',
    '- Return strict JSON only.',
    '- Use this exact shape: {"suggestions":["...","...","..."]}.',
    '- Return exactly 3 unique suggestions.',
    '- Keep language consistent with the requested language.',
    '',
    `Course topic: ${input.courseTopic || 'N/A'}`,
    `Language: ${input.language || 'English'}`,
    `Audience: ${input.audience || 'N/A'}`,
    `Learner proficiency: ${input.learnerProficiency || 'N/A'}`,
    `Course duration: ${input.courseDuration || 'N/A'}`,
    `Current learning goal: ${input.learningGoal || 'N/A'}`,
    `Current course title: ${input.courseTitle || 'N/A'}`,
    `Target field: ${field}`,
  ].join('\n');
}
