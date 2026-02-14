import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Button, Card, CardContent, FormControl, FormLabel, IconButton, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { Controller, UseFormReturn, useFieldArray } from 'react-hook-form';
import { AiProvider, getFirstAvailableModel, getModelLabel, getProviderModels } from '../../lib/ai/models';
import { FormValues } from '../../lib/formSchema';

type Props = {
  form: UseFormReturn<FormValues>;
};

export default function AiModelPanel({ form }: Props) {
  const provider = form.watch('aiProvider');
  const modelOptions = getProviderModels(provider);
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'logitBias',
  });

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

          <Controller
            name="temperature"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Temperature"
                type="number"
                inputProps={{ min: 0, max: 2, step: 0.1 }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message ?? '0 to 2'}
                fullWidth
              />
            )}
          />

          <Controller
            name="topP"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Top P"
                type="number"
                inputProps={{ min: 0, max: 1, step: 0.05 }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message ?? '0 to 1'}
                fullWidth
              />
            )}
          />

          <Controller
            name="presencePenalty"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Presence penalty"
                type="number"
                inputProps={{ min: -2, max: 2, step: 0.1 }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message ?? '-2 to 2'}
                fullWidth
              />
            )}
          />

          <Controller
            name="frequencyPenalty"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Frequency penalty"
                type="number"
                inputProps={{ min: -2, max: 2, step: 0.1 }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message ?? '-2 to 2'}
                fullWidth
              />
            )}
          />

          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Logit bias</Typography>
            <Typography variant="caption" color="text.secondary">
              Optional token bias pairs. Bias range is -100 to 100.
            </Typography>

            {fields.map((field, index) => (
              <Stack key={field.id} direction="row" spacing={1} alignItems="flex-start">
                <Controller
                  name={`logitBias.${index}.token`}
                  control={form.control}
                  render={({ field: tokenField, fieldState }) => (
                    <TextField
                      {...tokenField}
                      label="Token ID"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                    />
                  )}
                />

                <Controller
                  name={`logitBias.${index}.bias`}
                  control={form.control}
                  render={({ field: biasField, fieldState }) => (
                    <TextField
                      {...biasField}
                      label="Bias"
                      type="number"
                      inputProps={{ min: -100, max: 100, step: 1 }}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      sx={{ maxWidth: 140 }}
                    />
                  )}
                />

                <IconButton aria-label="Remove logit bias row" onClick={() => remove(index)} sx={{ mt: 0.5 }}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))}

            <Button variant="outlined" startIcon={<AddIcon />} onClick={() => append({ token: '', bias: 0 })}>
              Add logit bias pair
            </Button>

            {form.formState.errors.logitBias?.message && (
              <Typography variant="caption" color="error.main">
                {form.formState.errors.logitBias.message}
              </Typography>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
