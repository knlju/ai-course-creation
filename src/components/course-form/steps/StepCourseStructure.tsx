import { Alert, Box, Card, CardContent, CircularProgress, Grid, Typography } from '@mui/material';
import { useFieldArray } from 'react-hook-form';
import { SuggestedStructure } from '../../../lib/mockApi';
import { StepComponentProps } from '../types';

type StepCourseStructureProps = StepComponentProps & {
  isLoading: boolean;
  suggestedStructures: SuggestedStructure[];
  selectedStructureId: string | null;
  onSelectStructure: (structure: SuggestedStructure) => void;
};

export default function StepCourseStructure({
  form,
  control,
  isLoading,
  suggestedStructures,
  selectedStructureId,
  onSelectStructure,
}: StepCourseStructureProps) {
  const modulesArray = useFieldArray({ control, name: 'modules' });

  return (
    <>
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {suggestedStructures.map((structure) => (
            <Grid item xs={12} md={4} key={structure.id}>
              <Card
                variant="outlined"
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  borderColor: selectedStructureId === structure.id ? 'primary.main' : '#4A4F6E',
                }}
                onClick={() => onSelectStructure(structure)}
              >
                <CardContent>
                  <Typography variant="h6">{structure.label}</Typography>
                  {structure.modules.map((module) => (
                    <Typography key={module.title} variant="body2" color="text.secondary">
                      • {module.title}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {form.formState.errors.modules && (
        <Alert severity="error">{form.formState.errors.modules.message as string}</Alert>
      )}

      {modulesArray.fields.length > 0 && (
        <Box>
          <Typography fontWeight={700} mb={1}>
            Selected structure preview
          </Typography>
          {modulesArray.fields.map((module, index) => (
            <Box key={module.id} mb={1} p={1.5} sx={{ border: '1px solid #4A4F6E', borderRadius: 1 }}>
              <Typography>
                {index + 1}. {module.title}
              </Typography>
              {module.lessons.map((lesson, lessonIndex) => (
                <Typography key={`${module.id}-${lessonIndex}`} variant="body2" color="#b8bdd8">
                  - {lesson.title}
                </Typography>
              ))}
            </Box>
          ))}
        </Box>
      )}
    </>
  );
}
