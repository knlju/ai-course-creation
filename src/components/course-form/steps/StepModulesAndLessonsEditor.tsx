import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import DragIndicatorRoundedIcon from '@mui/icons-material/DragIndicatorRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import QuizRoundedIcon from '@mui/icons-material/QuizRounded';
import { Box, Button, IconButton, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { StepComponentProps } from '../types';

type EditableTextProps = {
  value: string;
  placeholder: string;
  onSave: (value: string) => void;
  variant?: 'h6' | 'body1' | 'body2';
};

function EditableText({ value, placeholder, onSave, variant = 'body1' }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  if (isEditing) {
    return (
      <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
        <TextField
          autoFocus
          fullWidth
          size="small"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              onSave(draft.trim());
              setIsEditing(false);
            }
            if (event.key === 'Escape') {
              event.preventDefault();
              setDraft(value);
              setIsEditing(false);
            }
          }}
        />
        <IconButton
          size="small"
          onClick={() => {
            onSave(draft.trim());
            setIsEditing(false);
          }}
        >
          <CheckRoundedIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => {
            setDraft(value);
            setIsEditing(false);
          }}
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </Stack>
    );
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
      <Typography variant={variant} sx={{ flex: 1 }}>
        {value || placeholder}
      </Typography>
      <IconButton
        size="small"
        onClick={() => {
          setDraft(value);
          setIsEditing(true);
        }}
      >
        <EditRoundedIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
}

type ModuleEditorProps = StepComponentProps & {
  moduleIndex: number;
  onDeleteModule: () => void;
  onMoveModule: (toIndex: number) => void;
};

function ModuleEditor({ control, form, moduleIndex, onDeleteModule, onMoveModule }: ModuleEditorProps) {
  const lessonsArray = useFieldArray({ control, name: `modules.${moduleIndex}.lessons` });
  const [draggingLessonIndex, setDraggingLessonIndex] = useState<number | null>(null);

  return (
    <Box sx={{ border: '1px solid #4A4F6E', borderRadius: 2, p: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
        <DragIndicatorRoundedIcon fontSize="small" color="action" />
        <EditableText
          value={form.watch(`modules.${moduleIndex}.title`) || ''}
          placeholder="Untitled module"
          variant="h6"
          onSave={(value) => form.setValue(`modules.${moduleIndex}.title`, value, { shouldValidate: true })}
        />
        <IconButton color="error" size="small" onClick={onDeleteModule}>
          <DeleteRoundedIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Stack spacing={1}>
        {lessonsArray.fields.map((lesson, lessonIndex) => (
          <Stack
            key={lesson.id}
            direction="row"
            spacing={1}
            alignItems="center"
            draggable
            onDragStart={() => setDraggingLessonIndex(lessonIndex)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (draggingLessonIndex === null || draggingLessonIndex === lessonIndex) return;
              lessonsArray.move(draggingLessonIndex, lessonIndex);
              setDraggingLessonIndex(null);
            }}
            sx={{ p: 1, borderRadius: 1, backgroundColor: '#2B3153' }}
          >
            <DragIndicatorRoundedIcon fontSize="small" color="action" />
            <EditableText
              value={form.watch(`modules.${moduleIndex}.lessons.${lessonIndex}.title`) || ''}
              placeholder="Untitled lesson"
              onSave={(value) =>
                form.setValue(`modules.${moduleIndex}.lessons.${lessonIndex}.title`, value, {
                  shouldValidate: true,
                })
              }
            />
            <IconButton size="small" color="error" onClick={() => lessonsArray.remove(lessonIndex)}>
              <DeleteRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
      </Stack>

      <Button
        size="small"
        sx={{ mt: 1.5 }}
        variant="outlined"
        startIcon={<AddRoundedIcon />}
        onClick={() => lessonsArray.append({ title: 'New lesson' })}
      >
        Add lesson
      </Button>

      <Stack direction="row" spacing={1} alignItems="center" mt={1.5}>
        <QuizRoundedIcon fontSize="small" color="primary" />
        {(form.watch(`modules.${moduleIndex}.quizTitle`) || '').length > 0 ? (
          <>
            <EditableText
              value={form.watch(`modules.${moduleIndex}.quizTitle`) || ''}
              placeholder="Quiz title"
              onSave={(value) => form.setValue(`modules.${moduleIndex}.quizTitle`, value, { shouldValidate: true })}
            />
            <IconButton
              size="small"
              color="error"
              onClick={() => form.setValue(`modules.${moduleIndex}.quizTitle`, '', { shouldValidate: true })}
            >
              <DeleteRoundedIcon fontSize="small" />
            </IconButton>
          </>
        ) : (
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddRoundedIcon />}
            onClick={() => form.setValue(`modules.${moduleIndex}.quizTitle`, 'New quiz', { shouldValidate: true })}
          >
            Add quiz
          </Button>
        )}
      </Stack>

      <Stack direction="row" spacing={1} mt={1.5}>
        <Button size="small" variant="text" onClick={() => onMoveModule(moduleIndex - 1)} disabled={moduleIndex === 0}>
          Move up
        </Button>
        <Button
          size="small"
          variant="text"
          onClick={() => onMoveModule(moduleIndex + 1)}
          disabled={moduleIndex === form.watch('modules').length - 1}
        >
          Move down
        </Button>
      </Stack>
    </Box>
  );
}

export default function StepModulesAndLessonsEditor({ control, form }: StepComponentProps) {
  const modulesArray = useFieldArray({ control, name: 'modules' });
  const [draggingModuleIndex, setDraggingModuleIndex] = useState<number | null>(null);

  return (
    <Stack spacing={2}>
      <Typography color="#b8bdd8">
        Human-only step (no AI). Click edit to update text, drag to reorder modules and lessons, and add/remove modules,
        lessons, and quizzes.
      </Typography>

      <EditableText
        value={form.watch('structureLabel') || ''}
        placeholder="Structure label"
        variant="h6"
        onSave={(value) => form.setValue('structureLabel', value, { shouldValidate: true })}
      />

      {modulesArray.fields.map((module, moduleIndex) => (
        <Box
          key={module.id}
          draggable
          onDragStart={() => setDraggingModuleIndex(moduleIndex)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => {
            if (draggingModuleIndex === null || draggingModuleIndex === moduleIndex) return;
            modulesArray.move(draggingModuleIndex, moduleIndex);
            setDraggingModuleIndex(null);
          }}
        >
          <ModuleEditor
            control={control}
            form={form}
            moduleIndex={moduleIndex}
            onDeleteModule={() => modulesArray.remove(moduleIndex)}
            onMoveModule={(toIndex) => {
              if (toIndex < 0 || toIndex > modulesArray.fields.length - 1 || toIndex === moduleIndex) return;
              modulesArray.move(moduleIndex, toIndex);
            }}
          />
        </Box>
      ))}

      <Button
        startIcon={<AddRoundedIcon />}
        variant="outlined"
        onClick={() => modulesArray.append({ title: 'New module', lessons: [{ title: 'New lesson' }], quizTitle: 'New quiz' })}
      >
        Add module
      </Button>
    </Stack>
  );
}
