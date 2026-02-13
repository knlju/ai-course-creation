import { Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import FormStepSidebar, { FormStep } from './course-form/FormStepSidebar';
import StepCourseStructure from './course-form/steps/StepCourseStructure';
import StepDefinePurpose from './course-form/steps/StepDefinePurpose';
import StepGenerateContent from './course-form/steps/StepGenerateContent';
import StepSetContext from './course-form/steps/StepSetContext';
import {
  FormValues,
  StepFourValues,
  StepOneValues,
  StepThreeValues,
  StepTwoValues,
  stepFourSchema,
  stepOneSchema,
  stepThreeSchema,
  stepTwoSchema,
} from '../lib/formSchema';
import { fetchSuggestedStructures, SuggestedStructure } from '../lib/mockApi';

const steps: FormStep[] = [
  { title: 'Define the purpose', subtitle: 'Describe your course' },
  { title: 'Set the context', subtitle: 'Explain the background' },
  { title: 'Course structure', subtitle: 'Define modules and lessons' },
  { title: 'Generate content', subtitle: 'Finalize preferences' },
];

const defaultValues: FormValues = {
  courseTopic: '',
  language: '',
  formOfAddress: 'formal',
  audience: '',
  learnerProficiency: 'entry',
  coursePace: 'quick',
  learningGoal: '',
  courseTitle: '',
  courseDescription: '',
  modules: [],
  includeImages: true,
  imageStyle: '',
};

export default function CourseGenerationForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedStructureId, setSelectedStructureId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormValues>(defaultValues);

  const {
    data: suggestedStructures = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['suggested-structures'],
    queryFn: fetchSuggestedStructures,
  });

  const stepOneForm = useForm<StepOneValues>({
    resolver: zodResolver(stepOneSchema),
    mode: 'onTouched',
    defaultValues: {
      courseTopic: formData.courseTopic,
      language: formData.language,
      formOfAddress: formData.formOfAddress,
      audience: formData.audience,
      learnerProficiency: formData.learnerProficiency,
      coursePace: formData.coursePace,
    },
  });

  const stepTwoForm = useForm<StepTwoValues>({
    resolver: zodResolver(stepTwoSchema),
    mode: 'onTouched',
    defaultValues: {
      learningGoal: formData.learningGoal,
      courseTitle: formData.courseTitle,
      courseDescription: formData.courseDescription,
    },
  });

  const stepThreeForm = useForm<StepThreeValues>({
    resolver: zodResolver(stepThreeSchema),
    mode: 'onTouched',
    defaultValues: { modules: formData.modules },
  });

  const stepFourForm = useForm<StepFourValues>({
    resolver: zodResolver(stepFourSchema),
    mode: 'onTouched',
    defaultValues: {
      includeImages: formData.includeImages,
      imageStyle: formData.imageStyle,
    },
  });

  const onSelectStructure = (structure: SuggestedStructure) => {
    setSelectedStructureId(structure.id);
    stepThreeForm.setValue('modules', structure.modules, { shouldValidate: true });
  };

  const nextStep = async () => {
    if (activeStep === 0) {
      await stepOneForm.handleSubmit((values) => {
        setFormData((prev) => ({ ...prev, ...values }));
        setActiveStep(1);
      })();
      return;
    }

    if (activeStep === 1) {
      await stepTwoForm.handleSubmit((values) => {
        setFormData((prev) => ({ ...prev, ...values }));
        setActiveStep(2);
      })();
      return;
    }

    if (activeStep === 2) {
      await stepThreeForm.handleSubmit((values) => {
        setFormData((prev) => ({ ...prev, ...values }));
        setActiveStep(3);
      })();
    }
  };

  const previousStep = () => {
    if (activeStep > 0) {
      setActiveStep((step) => step - 1);
    }
  };

  const onSubmit = async () => {
    await stepFourForm.handleSubmit((values) => {
      const payload = { ...formData, ...values };
      alert(`Course generated!\n\n${JSON.stringify(payload, null, 2)}`);
    })();
  };

  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardContent>
        <Grid container>
          <FormStepSidebar steps={steps} activeStep={activeStep} />

          <Grid item xs={12} md={9} sx={{ pl: { md: 4 }, pt: { xs: 3, md: 0 } }}>
            <Typography variant="h4" mb={3}>
              {steps[activeStep].title}
            </Typography>

            <Stack spacing={2}>
              {activeStep === 0 && <StepDefinePurpose form={stepOneForm} />}

              {activeStep === 1 && <StepSetContext form={stepTwoForm} />}

              {activeStep === 2 && (
                <StepCourseStructure
                  form={stepThreeForm}
                  isLoading={isLoading}
                  isError={isError}
                  errorMessage={error instanceof Error ? error.message : undefined}
                  suggestedStructures={suggestedStructures}
                  selectedStructureId={selectedStructureId}
                  onSelectStructure={onSelectStructure}
                />
              )}

              {activeStep === 3 && <StepGenerateContent form={stepFourForm} />}

              <Box display="flex" justifyContent="space-between" pt={2}>
                <Button disabled={activeStep === 0} onClick={previousStep} variant="outlined">
                  Previous step
                </Button>

                {activeStep < steps.length - 1 ? (
                  <Button onClick={nextStep} variant="contained">
                    Next
                  </Button>
                ) : (
                  <Button onClick={onSubmit} variant="contained">
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
