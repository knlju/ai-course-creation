import { Controller, UseFormReturn } from 'react-hook-form';
import { Card, CardContent, FormControl, FormLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { FormValues } from '../../lib/formSchema';
import { ALL_MODELS, getProviderForModel } from '../../lib/ai/models';

type Props = {
  form: UseFormReturn<FormValues>;
};

export default function AiModelPanel({ form }: Props) {
  const selectedModel = form.watch('aiModel');

  const onModelChange = (nextModel: string) => {
    const provider = getProviderForModel(nextModel);

    form.setValue('aiModel', nextModel, { shouldDirty: true, shouldTouch: true, shouldValidate: true });

    if (!provider) {
      return;
    }

    form.setValue('aiProvider', provider, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">AI model</Typography>

          <FormControl fullWidth>
            <FormLabel>Provider + model</FormLabel>
            <Controller
              name="aiModel"
              control={form.control}
              render={({ field }) => (
                <Select
                  value={field.value ?? selectedModel}
                  onChange={(event) => onModelChange(event.target.value)}
                  onBlur={field.onBlur}
                >
                  {ALL_MODELS.map((option) => (
                    <MenuItem key={option.id} value={option.id} disabled={!option.available}>
                      {option.provider.toUpperCase()} · {option.label}
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
