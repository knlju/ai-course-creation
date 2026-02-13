import AutorenewIcon from '@mui/icons-material/Autorenew';
import {
  Alert,
  Box,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';
import { fetchSuggestions } from '../../../lib/ai/fetchSuggestions';
import { AiProvider } from '../../../lib/ai/models';
import { FormValues } from '../../../lib/formSchema';
import { SuggestionField } from '../../../lib/ai/prompt';

type Props = {
  form: UseFormReturn<FormValues>;
  name: SuggestionField;
  label: string;
  multiline?: boolean;
  minRows?: number;
  provider: AiProvider;
  model: string;
};

export default function SuggestionTextField({
  form,
  name,
  label,
  multiline = false,
  minRows,
  provider,
  model,
}: Props) {
  const [refreshCount, setRefreshCount] = useState(0);
  const context = form.watch([
    'courseTopic',
    'language',
    'audience',
    'learnerProficiency',
    'courseDuration',
    'learningGoal',
    'courseTitle',
  ]);
  const [courseTopic, language, audience, learnerProficiency, courseDuration, learningGoal, courseTitle] = context;

  const canGenerate = Boolean(courseTopic && language && audience && learnerProficiency && courseDuration);

  const suggestionsQuery = useQuery({
    queryKey: ['ai-suggestions', name, provider, model, refreshCount],
    queryFn: () =>
      fetchSuggestions({
        provider,
        model,
        field: name,
        courseTopic,
        language,
        audience,
        learnerProficiency,
        courseDuration,
        learningGoal,
        courseTitle,
      }),
    enabled: false,
    staleTime: 0,
  });

  useEffect(() => {
    if (canGenerate && refreshCount === 0 && !suggestionsQuery.data) {
      setRefreshCount(1);
    }
  }, [canGenerate, refreshCount, suggestionsQuery.data]);

  const { refetch } = suggestionsQuery;

  useEffect(() => {
    if (refreshCount > 0) {
      void refetch();
    }
  }, [refreshCount, refetch]);

  const applySuggestion = (value: string) => {
    form.setValue(name, value, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  return (
    <Stack spacing={1}>
      <Controller
        name={name}
        control={form.control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label={label}
            multiline={multiline}
            minRows={minRows}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            fullWidth
          />
        )}
      />

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2">Suggested with AI:</Typography>
        <IconButton
          size="small"
          onClick={() => setRefreshCount((count) => count + 1)}
          disabled={!canGenerate || suggestionsQuery.isFetching}
        >
          <AutorenewIcon fontSize="small" />
        </IconButton>
      </Box>

      {!canGenerate && (
        <Typography variant="caption" color="text.secondary">
          Fill topic, language, audience, proficiency, and duration in step 1 to enable suggestions.
        </Typography>
      )}

      {suggestionsQuery.isError && <Alert severity="error">{(suggestionsQuery.error as Error).message}</Alert>}

      {suggestionsQuery.data && (
        <RadioGroup value={form.watch(name)}>
          {suggestionsQuery.data.map((suggestion) => (
            <FormControlLabel
              key={suggestion}
              value={suggestion}
              control={<Radio />}
              label={suggestion}
              onChange={() => applySuggestion(suggestion)}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                px: 1,
                mx: 0,
                '&:hover': { backgroundColor: 'action.hover', cursor: 'pointer' },
              }}
              onClick={() => applySuggestion(suggestion)}
            />
          ))}
        </RadioGroup>
      )}
    </Stack>
  );
}
