import { Checkbox, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material';
import { Controller } from 'react-hook-form';
import { StepComponentProps } from '../types';

const styles = ['modern educational', 'cartoon & friendly', 'realistic with people', 'minimalist'];

export default function StepGenerateContent({ control, form }: StepComponentProps) {
  return (
    <>
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
      <FormControl error={!!form.formState.errors.imageStyle}>
        <FormLabel sx={{ color: '#fff' }}>Image style</FormLabel>
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
          {form.formState.errors.imageStyle?.message}
        </Typography>
      </FormControl>
    </>
  );
}
