import { Checkbox, FormControlLabel, Stack, Switch, Typography } from '@mui/material';
import { Controller } from 'react-hook-form';
import { useEffect } from 'react';
import { StepComponentProps } from '../types';

type ContentOptionField =
  | 'generateModuleSummaries'
  | 'generateLessonText'
  | 'generateKnowledgeChecks'
  | 'generateFinalAssessment';

const contentOptions: Array<{ name: ContentOptionField; label: string }> = [
  { name: 'generateModuleSummaries', label: 'Generate module summaries' },
  { name: 'generateLessonText', label: 'Generate lesson text content' },
  { name: 'generateKnowledgeChecks', label: 'Generate knowledge checks for lessons' },
  { name: 'generateFinalAssessment', label: 'Generate a final assessment' },
];

export default function StepGenerateContent({ control, form }: StepComponentProps) {
  const generateAllContent = form.watch('generateAllContent');

  useEffect(() => {
    if (!generateAllContent) {
      contentOptions.forEach((option) => {
        form.setValue(option.name, false, { shouldValidate: true });
      });
    }
  }, [form, generateAllContent]);

  const toggleGenerateAllContent = (enabled: boolean) => {
    form.setValue('generateAllContent', enabled, { shouldValidate: true });
    contentOptions.forEach((option) => {
      form.setValue(option.name, enabled, { shouldValidate: true });
    });
  };

  return (
    <Stack spacing={1}>
      <Typography variant="h5">Content preferences</Typography>
      <Controller
        name="generateAllContent"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Switch
                checked={field.value}
                onChange={(event) => {
                  field.onChange(event.target.checked);
                  toggleGenerateAllContent(event.target.checked);
                }}
              />
            }
            label="Generate content for all pages"
          />
        )}
      />

      {contentOptions.map((option) => (
        <Controller
          key={option.name}
          name={option.name}
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={field.value}
                  disabled={!generateAllContent}
                  onChange={(event) => field.onChange(event.target.checked)}
                />
              }
              label={option.label}
            />
          )}
        />
      ))}
    </Stack>
  );
}
