import { z } from 'zod';

export const lessonSchema = z.object({
  title: z.string().min(3, 'Lesson title is required.'),
});

export const moduleSchema = z.object({
  title: z.string().min(3, 'Module title is required.'),
  lessons: z.array(lessonSchema).min(1, 'At least one lesson is required.'),
});

export const fullSchema = z.object({
  courseTopic: z.string().min(20, 'Please provide at least 20 characters.'),
  language: z.string().min(1, 'Select a language.'),
  formOfAddress: z.enum(['formal', 'informal'], {
    required_error: 'Select form of address.',
  }),
  audience: z.string().min(10, 'Please describe your audience (min 10 chars).'),
  learnerProficiency: z.enum(['entry', 'intermediate', 'advanced'], {
    required_error: 'Select learner proficiency.',
  }),
  coursePace: z.enum(['quick', 'regular', 'extensive'], {
    required_error: 'Select a course pace.',
  }),

  learningGoal: z.string().min(15, 'Learning goal is required (min 15 chars).'),
  courseTitle: z.string().min(5, 'Course title is required.'),
  courseDescription: z.string().min(30, 'Course description is required (min 30 chars).'),

  modules: z.array(moduleSchema).min(1, 'Pick a structure with at least one module.'),

  includeImages: z.boolean(),
  imageStyle: z.string().min(1, 'Choose an image style.'),
});

export const stepOneSchema = fullSchema.pick({
  courseTopic: true,
  language: true,
  formOfAddress: true,
  audience: true,
  learnerProficiency: true,
  coursePace: true,
});

export const stepTwoSchema = fullSchema.pick({
  learningGoal: true,
  courseTitle: true,
  courseDescription: true,
});

export const stepThreeSchema = fullSchema.pick({
  modules: true,
});

export const stepFourSchema = fullSchema.pick({
  includeImages: true,
  imageStyle: true,
});

export type FormValues = z.infer<typeof fullSchema>;
export type StepOneValues = z.infer<typeof stepOneSchema>;
export type StepTwoValues = z.infer<typeof stepTwoSchema>;
export type StepThreeValues = z.infer<typeof stepThreeSchema>;
export type StepFourValues = z.infer<typeof stepFourSchema>;
