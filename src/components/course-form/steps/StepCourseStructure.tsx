import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  FormControlLabel,
  Grid,
  Radio,
  Typography,
} from '@mui/material';
import { useFieldArray } from 'react-hook-form';
import { SuggestedStructure } from '../../../lib/ai/courseStructure';
import { StepComponentProps } from '../types';

type StepCourseStructureProps = StepComponentProps & {
  isLoading: boolean;
  suggestedStructures: SuggestedStructure[];
  selectedStructureId: string | null;
  onSelectStructure: (structure: SuggestedStructure) => void;
  onRegenerate: () => void;
};

export default function StepCourseStructure({
  form,
  control,
  isLoading,
  suggestedStructures,
  selectedStructureId,
  onSelectStructure,
  onRegenerate,
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
                  borderColor: selectedStructureId === structure.id ? 'primary.main' : 'divider',
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <FormControlLabel
                      control={<Radio checked={selectedStructureId === structure.id} />}
                      label={structure.label}
                      onChange={() => onSelectStructure(structure)}
                    />
                    <ContentCopyRoundedIcon fontSize="small" color="primary" />
                  </Box>

                  <Box maxHeight={290} overflow="auto" pr={0.5}>
                    {structure.modules.map((module) => (
                      <Box key={module.title} mb={1.25}>
                        <Typography variant="body2" sx={{ backgroundColor: 'background.default', p: 1, borderRadius: 1 }}>
                          {module.title}
                        </Typography>
                        {module.lessons.map((lesson) => (
                          <Typography key={lesson.title} variant="body2" color="text.secondary" pl={1.25} pt={0.5}>
                            • {lesson.title}
                          </Typography>
                        ))}
                        <Typography variant="body2" color="text.secondary" pl={1.25} pt={0.5}>
                          • {module.quizTitle}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box textAlign="center" pt={1}>
        <Typography component="button" type="button" onClick={onRegenerate} sx={{ background: 'none', border: 'none', color: 'primary.main', cursor: 'pointer', fontSize: '1rem' }}>
          Other suggestions...
        </Typography>
      </Box>

      {form.formState.errors.modules && (
        <Alert severity="error">{form.formState.errors.modules.message as string}</Alert>
      )}

      {modulesArray.fields.length > 0 && (
        <Box>
          <Typography fontWeight={700} mb={1}>
            Selected structure preview
          </Typography>
          {modulesArray.fields.map((module, index) => (
            <Box key={module.id} mb={1} p={1.5} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography>
                {index + 1}. {module.title}
              </Typography>
              {module.lessons.map((lesson, lessonIndex) => (
                <Typography key={`${module.id}-${lessonIndex}`} variant="body2" color="text.secondary">
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
