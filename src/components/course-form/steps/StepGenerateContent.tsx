import { Checkbox, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { Controller, UseFormReturn } from 'react-hook-form';
import { StepFourValues } from '../../../lib/formSchema';

type StepGenerateContentProps = {
  form: UseFormReturn<StepFourValues>;
};

const styles = ['modern educational', 'cartoon & friendly', 'realistic with people', 'minimalist'];

export default function StepGenerateContent({ form }: StepGenerateContentProps) {
  const { control, formState } = form;

  return (
    <Stack spacing={2}>
      <Controller
        name="includeImages"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={<Checkbox checked={field.value} onChange={(event) => field.onChange(event.target.checked)} />}
            label="Generate images for content"
          />
        )}
      />
      <FormControl error={!!formState.errors.imageStyle}>
        <FormLabel>Image style</FormLabel>
        <Controller
          name="imageStyle"
          control={control}
          render={({ field }) => (
            <RadioGroup {...field}>
              {styles.map((style) => (
                <FormControlLabel key={style} value={style} control={<Radio />} label={style} />
              ))}
            </RadioGroup>
          )}
        />
        <Typography variant="caption" color="error">
          {formState.errors.imageStyle?.message}
        </Typography>
      </FormControl>
    </Stack>
  );
}
