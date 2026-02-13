import { Grid, Step, StepLabel, Stepper, Typography } from '@mui/material';

export type FormStep = {
  title: string;
  subtitle: string;
};

type FormStepSidebarProps = {
  steps: FormStep[];
  activeStep: number;
};

export default function FormStepSidebar({ steps, activeStep }: FormStepSidebarProps) {
  return (
    <Grid item xs={12} md={3} sx={{ borderRight: { md: 1 }, borderColor: 'divider', pr: { md: 2 } }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step) => (
          <Step key={step.title}>
            <StepLabel>
              <Typography fontWeight={600}>{step.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {step.subtitle}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Grid>
  );
}
