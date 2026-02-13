import { FormValues } from '../formSchema';

export type SuggestedStructureLesson = { title: string };

export type SuggestedStructureModule = {
  title: string;
  lessons: SuggestedStructureLesson[];
  quizTitle: string;
};

export type SuggestedStructure = {
  id: string;
  label: string;
  modules: SuggestedStructureModule[];
};

type PromptInput = Pick<FormValues, 'courseTopic' | 'language' | 'audience' | 'learningGoal' | 'courseTitle'>;

export function buildCourseStructurePrompt(input: PromptInput) {
  return [
    'You generate course outlines for educators.',
    'Output requirements:',
    '- Return strict JSON only.',
    '- Use this exact shape: {"structures":[{"label":"Structure 1","modules":[{"title":"...","lessons":[{"title":"..."}],"quizTitle":"..."}]}]}.',
    '- Return exactly 3 structures named Structure 1, Structure 2, and Structure 3.',
    '- Each structure must contain 3 modules.',
    '- Each module must contain 3 concise lessons.',
    '- Each module must include a quiz title in quizTitle (quiz at end of module).',
    '- Keep language consistent with requested language.',
    '',
    `Course topic: ${input.courseTopic || 'N/A'}`,
    `Language: ${input.language || 'English'}`,
    `Audience: ${input.audience || 'N/A'}`,
    `Learning goal: ${input.learningGoal || 'N/A'}`,
    `Course title: ${input.courseTitle || 'N/A'}`,
  ].join('\n');
}
