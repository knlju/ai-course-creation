import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';
import { StepComponentProps } from '../types';

export default function StepSetContext({ control }: StepComponentProps) {
  return (
    <>
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
    </>
  );
}
