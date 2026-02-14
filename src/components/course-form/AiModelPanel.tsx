import { Controller, UseFormReturn } from 'react-hook-form';
import { Card, CardContent, FormControl, FormLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { FormValues } from '../../lib/formSchema';
import { AiProvider, getFirstAvailableModel, getModelLabel, getProviderModels } from '../../lib/ai/models';

type Props = {
  form: UseFormReturn<FormValues>;
};

export default function AiModelPanel({ form }: Props) {
  const provider = form.watch('aiProvider');
  const modelOptions = getProviderModels(provider);

  const onProviderChange = (nextProvider: AiProvider) => {
    form.setValue('aiProvider', nextProvider, { shouldDirty: true, shouldTouch: true, shouldValidate: true });

    const firstModel = getFirstAvailableModel(nextProvider);
    if (!firstModel) {
      return;
    }

    form.setValue('aiModel', firstModel.id, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">AI model</Typography>

          <FormControl fullWidth>
            <FormLabel>Provider</FormLabel>
            <Controller
              name="aiProvider"
              control={form.control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onChange={(event) => onProviderChange(event.target.value as AiProvider)}
                  onBlur={field.onBlur}
                >
                  <MenuItem value="openai">OpenAI</MenuItem>
                  <MenuItem value="gemini">Gemini</MenuItem>
                </Select>
              )}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel>Model</FormLabel>
            <Controller
              name="aiModel"
              control={form.control}
              render={({ field }) => (
                <Select value={field.value} onChange={field.onChange} onBlur={field.onBlur}>
                  {modelOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id} disabled={!option.available}>
                      {getModelLabel(option)}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Stack>
      </CardContent>
    </Card>
  );
}
