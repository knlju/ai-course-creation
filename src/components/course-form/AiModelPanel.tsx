import { Controller, UseFormReturn } from 'react-hook-form';
import { Card, CardContent, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { FormValues } from '../../lib/formSchema';
import { AiProvider, PROVIDER_MODELS } from '../../lib/ai/models';

type Props = {
  form: UseFormReturn<FormValues>;
};

export default function AiModelPanel({ form }: Props) {
  const provider = form.watch('aiProvider');
  const modelOptions = PROVIDER_MODELS[provider];

  const onProviderChange = (nextProvider: AiProvider) => {
    form.setValue('aiProvider', nextProvider, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    const firstAvailableModel = PROVIDER_MODELS[nextProvider].find((option) => option.available);
    if (!firstAvailableModel) {
      return;
    }

    form.setValue('aiModel', firstAvailableModel.id, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">AI model</Typography>

          <FormControl>
            <FormLabel>Provider</FormLabel>
            <Controller
              name="aiProvider"
              control={form.control}
              render={({ field }) => (
                <RadioGroup row value={field.value} onChange={(event) => onProviderChange(event.target.value as AiProvider)}>
                  <FormControlLabel value="openai" control={<Radio />} label="OpenAI" />
                  <FormControlLabel value="gemini" control={<Radio />} label="Gemini" />
                </RadioGroup>
              )}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Model</FormLabel>
            <Controller
              name="aiModel"
              control={form.control}
              render={({ field }) => (
                <RadioGroup value={field.value} onChange={(event) => field.onChange(event.target.value)}>
                  {modelOptions.map((option) => (
                    <FormControlLabel
                      key={option.id}
                      value={option.id}
                      control={<Radio />}
                      label={option.label}
                      disabled={!option.available}
                    />
                  ))}
                </RadioGroup>
              )}
            />
          </FormControl>
        </Stack>
      </CardContent>
    </Card>
  );
}
