import { Stack } from '@mui/material';
import { StepComponentProps } from '../types';
import SuggestionTextField from '../step-set-context/SuggestionTextField';

export default function StepSetContext({ form }: StepComponentProps) {
  const provider = form.watch('aiProvider');
  const model = form.watch('aiModel');

  return (
    <Stack spacing={3}>
      <SuggestionTextField
        form={form}
        name="learningGoal"
        label="What is the goal that your learners reach?"
        multiline
        minRows={3}
        provider={provider}
        model={model}
      />

      <SuggestionTextField
        form={form}
        name="courseTitle"
        label="What would you like to name your course?"
        provider={provider}
        model={model}
      />

      <SuggestionTextField
        form={form}
        name="courseDescription"
        label="How would you describe your course?"
        multiline
        minRows={4}
        provider={provider}
        model={model}
      />
    </Stack>
  );
}
