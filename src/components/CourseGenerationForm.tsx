import { Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import FormStepSidebar, { FormStep } from './course-form/FormStepSidebar';
import StepCourseStructure from './course-form/steps/StepCourseStructure';
import StepDefinePurpose from './course-form/steps/StepDefinePurpose';
import StepGenerateContent from './course-form/steps/StepGenerateContent';
import StepSetContext from './course-form/steps/StepSetContext';
import {
  FormValues,
  fullSchema,
  stepFourSchema,
  stepOneSchema,
  stepThreeSchema,
  stepTwoSchema,
} from '../lib/formSchema';
import { fetchCourseStructures } from '../lib/ai/fetchCourseStructures';
import { SuggestedStructure } from '../lib/ai/courseStructure';

const steps: FormStep[] = [
  { title: 'Define the purpose', subtitle: 'Describe your course' },
  { title: 'Set the context', subtitle: 'Explain the background' },
  { title: 'Course structure', subtitle: 'Define modules and lessons' },
  { title: 'Generate content', subtitle: 'Finalize preferences' },
];

export default function CourseGenerationForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedStructureId, setSelectedStructureId] = useState<string | null>(null);
  const [structureRefreshCount, setStructureRefreshCount] = useState(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(fullSchema),
    mode: 'onTouched',
    defaultValues: {
      courseTopic: '',
      language: '',
      audience: '',
      learnerProficiency: undefined,
      courseDuration: undefined,
      learningGoal: '',
      courseTitle: '',
      courseDescription: '',
      modules: [],
      includeImages: true,
      imageStyle: '',
    },
  });

  const context = form.watch([
    'courseTopic',
    'language',
    'audience',
    'learnerProficiency',
    'courseDuration',
    'learningGoal',
    'courseTitle',
  ]);
  const [courseTopic, language, audience, learnerProficiency, courseDuration, learningGoal, courseTitle] = context;
  const canGenerateStructure = Boolean(
    courseTopic && language && audience && learnerProficiency && courseDuration && learningGoal && courseTitle
  );

  const {
    data: suggestedStructures = [],
    isFetching: isLoading,
    isError: isStructureError,
    error: structureError,
    refetch: refetchStructures,
  } = useQuery({
    queryKey: ['ai-course-structures', structureRefreshCount],
    queryFn: () =>
      fetchCourseStructures({
        provider: 'openai',
        model: 'gpt-4.1-nano',
        courseTopic,
        language,
        audience,
        learnerProficiency,
        courseDuration,
        learningGoal,
        courseTitle,
      }),
    enabled: false,
  });

  useEffect(() => {
    if (activeStep === 2 && canGenerateStructure && structureRefreshCount === 0 && suggestedStructures.length === 0) {
      setStructureRefreshCount(1);
    }
  }, [activeStep, canGenerateStructure, structureRefreshCount, suggestedStructures.length]);

  useEffect(() => {
    if (structureRefreshCount > 0) {
      void refetchStructures();
    }
  }, [refetchStructures, structureRefreshCount]);

  const stepFields = useMemo<Record<number, Array<keyof FormValues>>>(
    () => ({
      0: ['courseTopic', 'language', 'audience', 'learnerProficiency', 'courseDuration'],
      1: ['learningGoal', 'courseTitle', 'courseDescription'],
      2: ['modules'],
      3: ['includeImages', 'imageStyle'],
    }),
    []
  );

  const validateStep = () => {
    const values = form.getValues();
    const schemaByStep = [stepOneSchema, stepTwoSchema, stepThreeSchema, stepFourSchema][activeStep];
    const result = schemaByStep.safeParse(values);

    if (result.success) {
      return true;
    }

    result.error.issues.forEach((issue) => {
      const path = issue.path.join('.') as keyof FormValues;
      form.setError(path, { message: issue.message });
    });

    return false;
  };

  const nextStep = async () => {
    const validRHF = await form.trigger(stepFields[activeStep]);
    const validZod = validateStep();
    if (validRHF && validZod) {
      setActiveStep((step) => Math.min(step + 1, steps.length - 1));
    }
  };

  const previousStep = () => {
    setActiveStep((step) => Math.max(step - 1, 0));
  };

  const onSelectStructure = (structure: SuggestedStructure) => {
    setSelectedStructureId(structure.id);
    form.setValue('modules', structure.modules.map(({ title, lessons }) => ({ title, lessons })), {
      shouldValidate: true,
    });
  };

  const onSubmit = (values: FormValues) => {
    alert(`Course generated!\n\n${JSON.stringify(values, null, 2)}`);
  };

  return (
    <Card sx={{ background: '#232945', color: '#fff', borderRadius: 2 }}>
      <CardContent>
        <Grid container>
          <FormStepSidebar steps={steps} activeStep={activeStep} />

          <Grid item xs={12} md={9} sx={{ pl: { md: 4 }, pt: { xs: 3, md: 0 } }}>
            <Typography variant="h4" mb={3}>
              {steps[activeStep].title}
            </Typography>

            <Stack spacing={2} component="form" onSubmit={form.handleSubmit(onSubmit)}>
              {activeStep === 0 && <StepDefinePurpose control={form.control} form={form} />}

              {activeStep === 1 && <StepSetContext control={form.control} form={form} />}

              {activeStep === 2 && (
                <>
                  {isStructureError && (
                    <Typography color="error.light">{(structureError as Error).message}</Typography>
                  )}
                  <StepCourseStructure
                    control={form.control}
                    form={form}
                    isLoading={isLoading}
                    suggestedStructures={suggestedStructures}
                    selectedStructureId={selectedStructureId}
                    onSelectStructure={onSelectStructure}
                    onRegenerate={() => setStructureRefreshCount((count) => count + 1)}
                  />
                </>
              )}

              {activeStep === 3 && <StepGenerateContent control={form.control} form={form} />}

              <Box display="flex" justifyContent="space-between" pt={2}>
                <Button disabled={activeStep === 0} onClick={previousStep} variant="outlined">
                  Previous step
                </Button>

                {activeStep < steps.length - 1 ? (
                  <Button onClick={nextStep} variant="contained">
                    Next
                  </Button>
                ) : (
                  <Button type="submit" variant="contained">
                    Generate course
                  </Button>
                )}
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
