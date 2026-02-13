import { z } from 'zod';

export const stepOneSchema = z.object({
  courseTopic: z.string().min(20, 'Please provide at least 20 characters.'),
  language: z.string().min(1, 'Select a language.'),
  audience: z.string().min(10, 'Please describe your audience (min 10 chars).'),
  learnerProficiency: z.enum(['entry', 'intermediate', 'advanced'], {
    required_error: 'Select learner proficiency.',
  }),
  courseDuration: z.enum(['quick', 'regular', 'extensive'], {
    required_error: 'Select a course duration.',
  }),
});

export const stepTwoSchema = z.object({
  learningGoal: z.string().min(15, 'Learning goal is required (min 15 chars).'),
  courseTitle: z.string().min(5, 'Course title is required.'),
  courseDescription: z
    .string()
    .min(30, 'Course description is required (min 30 chars).'),
});

export const lessonSchema = z.object({
  title: z.string().min(3, 'Lesson title is required.'),
});

export const moduleSchema = z.object({
  title: z.string().min(3, 'Module title is required.'),
  lessons: z.array(lessonSchema).min(1, 'At least one lesson is required.'),
  quizTitle: z.string().optional(),
});

export const stepThreeSchema = z.object({
  structureLabel: z.string().min(1, 'Please choose a structure.'),
  modules: z.array(moduleSchema).min(1, 'Pick a structure with at least one module.'),
});

export const stepFourSchema = z.object({
  structureLabel: z.string().min(1, 'Structure label is required.'),
  modules: z.array(moduleSchema).min(1, 'At least one module is required.'),
});

export const stepFiveSchema = z.object({
  generateAllContent: z.boolean(),
  generateModuleSummaries: z.boolean(),
  generateLessonText: z.boolean(),
  generateKnowledgeChecks: z.boolean(),
  generateFinalAssessment: z.boolean(),
});

export const fullSchema = stepOneSchema
  .merge(stepTwoSchema)
  .merge(stepThreeSchema)
  .merge(stepFiveSchema);

export type FormValues = z.infer<typeof fullSchema>;
export type StepOneValues = z.infer<typeof stepOneSchema>;
export type StepTwoValues = z.infer<typeof stepTwoSchema>;
export type StepThreeValues = z.infer<typeof stepThreeSchema>;
export type StepFourValues = z.infer<typeof stepFourSchema>;
export type StepFiveValues = z.infer<typeof stepFiveSchema>;
