import { useState } from 'react';
import { Stack } from '@mui/material';
import { StepComponentProps } from '../types';
import AiModelSelector from '../step-set-context/AiModelSelector';
import SuggestionTextField from '../step-set-context/SuggestionTextField';
import { AiProvider, PROVIDER_MODELS } from '../../../lib/ai/models';

const defaultProvider: AiProvider = 'openai';
const defaultModel = PROVIDER_MODELS[defaultProvider][0].id;

export default function StepSetContext({ form }: StepComponentProps) {
  const [provider, setProvider] = useState<AiProvider>(defaultProvider);
  const [model, setModel] = useState(defaultModel);

  const onProviderChange = (nextProvider: AiProvider) => {
    setProvider(nextProvider);
    const firstAvailableModel = PROVIDER_MODELS[nextProvider].find((option) => option.available);
    if (firstAvailableModel) {
      setModel(firstAvailableModel.id);
    }
  };

  return (
    <Stack spacing={3}>
      <AiModelSelector
        provider={provider}
        model={model}
        onProviderChange={onProviderChange}
        onModelChange={setModel}
      />

      <SuggestionTextField
        form={form}
        name="learningGoal"
        label="What is the goal that your learners reach?"
        multiline
        minRows={3}
        provider={provider}
        model={model}
      />

      <SuggestionTextField
        form={form}
        name="courseTitle"
        label="What would you like to name your course?"
        provider={provider}
        model={model}
      />

      <SuggestionTextField
        form={form}
        name="courseDescription"
        label="How would you describe your course?"
        multiline
        minRows={4}
        provider={provider}
        model={model}
      />
    </Stack>
  );
}
