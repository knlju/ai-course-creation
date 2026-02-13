export type SuggestedStructure = {
  id: string;
  label: string;
  modules: Array<{ title: string; lessons: Array<{ title: string }> }>;
};

const structures: SuggestedStructure[] = [
  {
    id: 's1',
    label: 'Structure 1',
    modules: [
      {
        title: 'Introduction to Addition',
        lessons: [
          { title: 'Understanding the concept of addition' },
          { title: 'Using number lines to visualize addition' },
        ],
      },
      {
        title: 'Exploring Subtraction',
        lessons: [
          { title: 'Defining subtraction and its relationship to addition' },
          { title: 'Solving subtraction problems within 10' },
        ],
      },
    ],
  },
  {
    id: 's2',
    label: 'Structure 2',
    modules: [
      {
        title: 'Number Foundations',
        lessons: [
          { title: 'Comparing and ordering numbers' },
          { title: 'Place value basics' },
        ],
      },
      {
        title: 'Operations in Practice',
        lessons: [
          { title: 'Addition strategies' },
          { title: 'Subtraction strategies' },
        ],
      },
    ],
  },
  {
    id: 's3',
    label: 'Structure 3',
    modules: [
      {
        title: 'Applied Math Challenges',
        lessons: [
          { title: 'Word problem decoding' },
          { title: 'Real-life examples and tasks' },
        ],
      },
    ],
  },
];

export async function fetchSuggestedStructures() {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return structures;
}
