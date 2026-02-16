import type { TodoTask } from '@/types/task';

export const HOME_PROFILE = {
  name: 'Jeegar Goyani',
  initials: 'JG',
};

export const INITIAL_TASKS: TodoTask[] = [
  {
    id: 'task-1',
    title: 'Learning Programming',
    dueLabel: '12PM',
    completed: true,
  },
  {
    id: 'task-2',
    title: 'Learn how to cook',
    dueLabel: '1PM',
    completed: false,
  },
  {
    id: 'task-3',
    title: 'Learn how to play',
    dueLabel: '2PM',
    completed: false,
  },
  {
    id: 'task-4',
    title: 'Have lunch',
    dueLabel: '4PM',
    completed: false,
  },
  {
    id: 'task-5',
    title: 'Going to travel',
    dueLabel: '6PM',
    completed: false,
  },
];
