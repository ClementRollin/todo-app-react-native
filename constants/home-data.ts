import type { TodoTask } from '@/types/task';

export const HOME_PROFILE = {
  name: 'Jeegar Goyani',
  initials: 'JG',
};

export const INITIAL_TASKS: TodoTask[] = [
  {
    id: 'task-1',
    title: 'Apprendre la programmation',
    dueLabel: '12PM',
    completed: true,
  },
  {
    id: 'task-2',
    title: 'Apprendre a cuisiner',
    dueLabel: '1PM',
    completed: false,
  },
  {
    id: 'task-3',
    title: 'Session sport',
    dueLabel: '2PM',
    completed: false,
  },
  {
    id: 'task-4',
    title: 'Pause dejeuner',
    dueLabel: '4PM',
    completed: false,
  },
  {
    id: 'task-5',
    title: 'Preparer le voyage',
    dueLabel: '6PM',
    completed: false,
  },
];
