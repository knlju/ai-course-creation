import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, UseFormReturn } from 'react-hook-form';
import { StepOneValues } from '../../../lib/formSchema';

type StepDefinePurposeProps = {
  form: UseFormReturn<StepOneValues>;
};

const proficiencyOptions = [
  { value: 'entry', title: 'Entry level', subtitle: 'Learners with minimal or no work experience.' },
  {
    value: 'intermediate',
    title: 'Intermediate level',
    subtitle: 'Learners with moderate experience and skills.',
  },
  { value: 'advanced', title: 'Advanced level', subtitle: 'Highly skilled learners with deep expertise.' },
] as const;

const paceOptions = [
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
      'Extensive courses cover in-depth, content-rich topics with many detailed sections. It is up to 10 modules with up to 10 lessons each.',
  },
] as const;

export default function StepDefinePurpose({ form }: StepDefinePurposeProps) {
  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const selectedPace = watch('coursePace');

  return (
    <Stack spacing={2}>
      <Typography variant="h4">Describe your course</Typography>

      <Box sx={{ border: '1px dashed', borderColor: 'divider', p: 2, borderRadius: 1 }}>
        <Typography fontWeight={700}>Upload document (optional)</Typography>
        <Typography variant="body2" color="text.secondary">
          Drag and drop your PDF here (placeholder UI).
        </Typography>
      </Box>

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
            helperText={fieldState.error?.message ?? 'Example: Creating video content with AI and choosing the right tools.'}
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
            fullWidth
          >
            {['English', 'German (Deutsch)', 'Spanish'].map((lang) => (
              <MenuItem key={lang} value={lang}>
                {lang}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      <FormControl error={!!errors.formOfAddress}>
        <FormLabel>Form of address</FormLabel>
        <Controller
          name="formOfAddress"
          control={control}
          render={({ field }) => (
            <RadioGroup row {...field}>
              <FormControlLabel value="formal" control={<Radio />} label="Formal" />
              <FormControlLabel value="informal" control={<Radio />} label="Informal" />
            </RadioGroup>
          )}
        />
        <Typography variant="caption" color="error">
          {errors.formOfAddress?.message}
        </Typography>
      </FormControl>

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
            helperText={fieldState.error?.message ?? 'Write a short audience summary (up to 250 chars).'}
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
            {proficiencyOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Box>
                  <Typography fontWeight={600}>{option.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {option.subtitle}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      <Box>
        <Typography variant="h6" mb={1}>
          How long do you think this course should ideally run?
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          {paceOptions.map((option) => (
            <Card
              key={option.value}
              variant="outlined"
              sx={{
                flex: 1,
                borderColor: selectedPace === option.value ? 'primary.main' : 'divider',
              }}
            >
              <CardActionArea
                sx={{ height: '100%' }}
                onClick={() => setValue('coursePace', option.value, { shouldValidate: true })}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography fontWeight={700}>{option.title}</Typography>
                    <Radio checked={selectedPace === option.value} />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {option.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
        <Typography variant="caption" color="error">
          {errors.coursePace?.message}
        </Typography>
      </Box>
    </Stack>
  );
}
