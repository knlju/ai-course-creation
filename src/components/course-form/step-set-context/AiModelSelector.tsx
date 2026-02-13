import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import { AiProvider, PROVIDER_MODELS } from '../../../lib/ai/models';

type Props = {
  provider: AiProvider;
  model: string;
  onProviderChange: (provider: AiProvider) => void;
  onModelChange: (model: string) => void;
};

export default function AiModelSelector({ provider, model, onProviderChange, onModelChange }: Props) {
  const modelOptions = PROVIDER_MODELS[provider];

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle1">Suggestion model</Typography>
      <FormControl>
        <FormLabel sx={{ color: '#fff' }}>Provider</FormLabel>
        <RadioGroup
          row
          value={provider}
          onChange={(event) => onProviderChange(event.target.value as AiProvider)}
        >
          <FormControlLabel value="openai" control={<Radio />} label="OpenAI" />
          <FormControlLabel value="gemini" control={<Radio />} label="Gemini (soon)" disabled />
        </RadioGroup>
      </FormControl>

      <FormControl>
        <FormLabel sx={{ color: '#fff' }}>Model</FormLabel>
        <RadioGroup row value={model} onChange={(event) => onModelChange(event.target.value)}>
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
      </FormControl>
    </Stack>
  );
}
