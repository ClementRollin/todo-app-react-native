import type { TodoTask } from '@/types/task';

export const HOME_PROFILE = {
  name: 'Jeegar Goyani',
  initials: 'JG',
};

function createDueAt(hours: number, minutes = 0) {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}

export const INITIAL_TASKS: TodoTask[] = [
  {
    id: 'task-1',
    title: 'Apprendre la programmation',
    dueAt: createDueAt(12),
    completed: true,
  },
  {
    id: 'task-2',
    title: 'Apprendre a cuisiner',
    dueAt: createDueAt(13),
    completed: false,
  },
  {
    id: 'task-3',
    title: 'Session sport',
    dueAt: createDueAt(14),
    completed: false,
  },
  {
    id: 'task-4',
    title: 'Pause dejeuner',
    dueAt: createDueAt(16),
    completed: false,
  },
  {
    id: 'task-5',
    title: 'Preparer le voyage',
    dueAt: createDueAt(18),
    completed: false,
  },
];
