import {
  Box,
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

const durationOptions = [
  {
    value: 'quick',
    title: 'Quick Course',
    description:
      "A quick course typically consists of up to 3 modules with about 3 lessons each. It's a great choice for delivering a brief and focused piece of information.",
  },
  {
    value: 'regular',
    title: 'Regular Course',
    description:
      'A regular course is the most common option. It consists of 5-6 modules with about 5-8 lessons each. It covers a specific topic in detail.',
  },
  {
    value: 'extensive',
    title: 'Extensive Course',
    description:
      'Extensive courses cover in-depth, content-rich topics with many detailed sections. It is up to 10 modules with up to 10 lessons each. Consider splitting your course.',
  },
] as const;

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

      <Controller
        name="learnerProficiency"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            select
            label="Specify learner proficiency"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            fullWidth
          >
            <MenuItem value="entry">Entry level</MenuItem>
            <MenuItem value="intermediate">Intermediate level</MenuItem>
            <MenuItem value="advanced">Advanced level</MenuItem>
          </TextField>
        )}
      />

      <FormControl error={!!form.formState.errors.courseDuration}>
        <FormLabel>How long do you think this course should ideally run?</FormLabel>
        <Controller
          name="courseDuration"
          control={control}
          render={({ field }) => (
            <RadioGroup
              row
              {...field}
              sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' } }}
            >
              {durationOptions.map((option) => {
                const selected = field.value === option.value;
                return (
                  <Box
                    key={option.value}
                    sx={{
                      border: '1px solid',
                      borderColor: selected ? 'primary.main' : 'divider',
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    <FormControlLabel
                      value={option.value}
                      control={<Radio />}
                      label={<Typography variant="subtitle1">{option.title}</Typography>}
                      sx={{ alignItems: 'flex-start', m: 0 }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.5 }}>
                      {option.description}
                    </Typography>
                  </Box>
                );
              })}
            </RadioGroup>
          )}
        />
        <Typography variant="caption" color="error">
          {form.formState.errors.courseDuration?.message}
        </Typography>
      </FormControl>
    </>
  );
}
