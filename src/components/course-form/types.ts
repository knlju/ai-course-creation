import { Control, UseFormReturn } from 'react-hook-form';
import { FormValues } from '../../lib/formSchema';

export type StepComponentProps = {
  form: UseFormReturn<FormValues>;
  control: Control<FormValues>;
};
