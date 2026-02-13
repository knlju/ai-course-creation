import {
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import { StepComponentProps } from '../types';

export default function StepDefinePurpose({ control, form }: StepComponentProps) {
  return (
    <>
      <Controller
        name="courseTopic"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="What is your course about?"
            multiline
            minRows={4}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            fullWidth
          />
        )}
      />
      <Controller
        name="language"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            select
            label="Course language"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          >
            {['English', 'German', 'Spanish'].map((lang) => (
              <MenuItem key={lang} value={lang}>
                {lang}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
      <Controller
        name="audience"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Who are the participants in your course?"
            multiline
            minRows={3}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
      <FormControl error={!!form.formState.errors.coursePace}>
        <FormLabel sx={{ color: '#fff' }}>Course pace</FormLabel>
        <Controller
          name="coursePace"
          control={control}
          render={({ field }) => (
            <RadioGroup row {...field}>
              <FormControlLabel value="quick" control={<Radio />} label="Quick" />
              <FormControlLabel value="regular" control={<Radio />} label="Regular" />
              <FormControlLabel value="extensive" control={<Radio />} label="Extensive" />
            </RadioGroup>
          )}
        />
        <Typography variant="caption" color="error">
          {form.formState.errors.coursePace?.message}
        </Typography>
      </FormControl>
    </>
  );
}
