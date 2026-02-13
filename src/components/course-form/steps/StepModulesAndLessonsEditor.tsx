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

type ModuleItem =
  | { type: 'lesson'; lessonIndex: number }
  | { type: 'quiz' };

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
  const [draggingItem, setDraggingItem] = useState<ModuleItem | null>(null);

  const normalizeQuizPosition = () => {
    const lessonsCount = lessonsArray.fields.length;
    const quizTitle = form.watch(`modules.${moduleIndex}.quizTitle`) || '';
    const hasQuiz = quizTitle.length > 0;

    if (!hasQuiz) {
      return null;
    }

    const rawPosition = form.watch(`modules.${moduleIndex}.quizPosition`);
    const normalizedPosition = Number.isInteger(rawPosition)
      ? Math.min(Math.max(rawPosition as number, 0), lessonsCount)
      : lessonsCount;

    if (rawPosition !== normalizedPosition) {
      form.setValue(`modules.${moduleIndex}.quizPosition`, normalizedPosition, { shouldValidate: true });
    }

    return normalizedPosition;
  };

  const moveQuizTo = (targetIndex: number) => {
    const lessonsCount = lessonsArray.fields.length;
    const normalizedPosition = Math.min(Math.max(targetIndex, 0), lessonsCount);
    form.setValue(`modules.${moduleIndex}.quizPosition`, normalizedPosition, { shouldValidate: true });
  };

  const moveLesson = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    const previousQuizPosition = normalizeQuizPosition();
    lessonsArray.move(fromIndex, toIndex);

    if (previousQuizPosition === null) return;

    let nextQuizPosition = previousQuizPosition;

    if (fromIndex < previousQuizPosition && toIndex >= previousQuizPosition) {
      nextQuizPosition = previousQuizPosition - 1;
    } else if (fromIndex > previousQuizPosition && toIndex <= previousQuizPosition) {
      nextQuizPosition = previousQuizPosition + 1;
    } else if (fromIndex === previousQuizPosition) {
      nextQuizPosition = toIndex;
    }

    moveQuizTo(nextQuizPosition);
  };

  const getModuleItems = (): ModuleItem[] => {
    const lessonItems: ModuleItem[] = lessonsArray.fields.map((_, lessonIndex) => ({
      type: 'lesson',
      lessonIndex,
    }));

    const quizTitle = form.watch(`modules.${moduleIndex}.quizTitle`) || '';
    if (!quizTitle) {
      return lessonItems;
    }

    const quizPosition = normalizeQuizPosition() ?? lessonItems.length;
    const items = [...lessonItems];
    items.splice(quizPosition, 0, { type: 'quiz' });

    return items;
  };

  const moduleItems = getModuleItems();

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
        {moduleItems.map((item, itemIndex) => {
          if (item.type === 'lesson') {
            const { lessonIndex } = item;
            return (
              <Stack
                key={lessonsArray.fields[lessonIndex].id}
                direction="row"
                spacing={1}
                alignItems="center"
                draggable
                onDragStart={() => setDraggingItem({ type: 'lesson', lessonIndex })}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  if (!draggingItem) return;

                  if (draggingItem.type === 'lesson') {
                    moveLesson(draggingItem.lessonIndex, lessonIndex);
                  } else {
                    moveQuizTo(itemIndex);
                  }

                  setDraggingItem(null);
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
            );
          }

          return (
            <Stack
              key="quiz-item"
              direction="row"
              spacing={1}
              alignItems="center"
              draggable
              onDragStart={() => setDraggingItem({ type: 'quiz' })}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (!draggingItem) return;

                if (draggingItem.type === 'lesson') {
                  moveLesson(draggingItem.lessonIndex, itemIndex);
                }

                setDraggingItem(null);
              }}
              sx={{ p: 1, borderRadius: 1, backgroundColor: '#2B3153' }}
            >
              <DragIndicatorRoundedIcon fontSize="small" color="action" />
              <QuizRoundedIcon fontSize="small" color="primary" />
              <EditableText
                value={form.watch(`modules.${moduleIndex}.quizTitle`) || ''}
                placeholder="Quiz title"
                onSave={(value) => form.setValue(`modules.${moduleIndex}.quizTitle`, value, { shouldValidate: true })}
              />
              <IconButton
                size="small"
                color="error"
                onClick={() => {
                  form.setValue(`modules.${moduleIndex}.quizTitle`, '', { shouldValidate: true });
                  form.setValue(`modules.${moduleIndex}.quizPosition`, undefined, { shouldValidate: true });
                }}
              >
                <DeleteRoundedIcon fontSize="small" />
              </IconButton>
            </Stack>
          );
        })}
      </Stack>

      <Button
        size="small"
        sx={{ mt: 1.5 }}
        variant="outlined"
        startIcon={<AddRoundedIcon />}
        onClick={() => {
          lessonsArray.append({ title: 'New lesson' });
          const quizTitle = form.watch(`modules.${moduleIndex}.quizTitle`) || '';
          if (!quizTitle) return;

          const currentQuizPosition = normalizeQuizPosition();
          if (currentQuizPosition === null) return;

          moveQuizTo(currentQuizPosition + 1);
        }}
      >
        Add lesson
      </Button>

      {(form.watch(`modules.${moduleIndex}.quizTitle`) || '').length === 0 ? (
        <Button
          size="small"
          sx={{ mt: 1.5, ml: 1 }}
          variant="outlined"
          startIcon={<AddRoundedIcon />}
          onClick={() => {
            form.setValue(`modules.${moduleIndex}.quizTitle`, 'New quiz', { shouldValidate: true });
            form.setValue(`modules.${moduleIndex}.quizPosition`, lessonsArray.fields.length, { shouldValidate: true });
          }}
        >
          Add quiz
        </Button>
      ) : null}

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
        onClick={() =>
          modulesArray.append({
            title: 'New module',
            lessons: [{ title: 'New lesson' }],
            quizTitle: 'New quiz',
            quizPosition: 1,
          })
        }
      >
        Add module
      </Button>
    </Stack>
  );
}
