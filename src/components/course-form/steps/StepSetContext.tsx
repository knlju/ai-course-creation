import { Stack, TextField } from '@mui/material';
import { Controller, UseFormReturn } from 'react-hook-form';
import { StepTwoValues } from '../../../lib/formSchema';

type StepSetContextProps = {
  form: UseFormReturn<StepTwoValues>;
};

export default function StepSetContext({ form }: StepSetContextProps) {
  const { control } = form;

  return (
    <Stack spacing={2}>
      <Controller
        name="learningGoal"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="What is the goal that your learners reach?"
            multiline
            minRows={3}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="courseTitle"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="What would you like to name your course?"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="courseDescription"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="How would you describe your course?"
            multiline
            minRows={4}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
    </Stack>
  );
}
