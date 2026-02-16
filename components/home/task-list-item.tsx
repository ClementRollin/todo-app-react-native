import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { AppCheckbox } from '@/components/ui/app-checkbox';
import type { TodoTask } from '@/types/task';

type TaskListItemProps = {
  task: TodoTask;
  onToggleTask: (taskId: string) => void;
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
};

function formatDueAt(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function TaskListItem({ task, onToggleTask, onEditTask, onDeleteTask }: TaskListItemProps) {
  return (
    <View className="flex-row items-center py-2">
      <AppCheckbox
        accessibilityLabel={`Marquer ${task.title} comme ${task.completed ? 'non terminee' : 'terminee'}`}
        checked={task.completed}
        onPress={() => onToggleTask(task.id)}
      />
      <View className="ml-3 flex-1 flex-row items-center justify-between">
        <Pressable className="mr-3 flex-1" onPress={() => onToggleTask(task.id)}>
          <Text
            className={`text-base font-medium ${
              task.completed ? 'text-slate-400 line-through' : 'text-slate-700'
            }`}>
            {task.title}
          </Text>
          <Text className="mt-0.5 text-xs font-semibold text-slate-500">{formatDueAt(task.dueAt)}</Text>
        </Pressable>

        <View className="flex-row items-center">
          <Pressable
            accessibilityLabel={`Modifier la tache ${task.title}`}
            className="h-8 w-8 items-center justify-center rounded-lg bg-slate-100"
            hitSlop={8}
            onPress={() => onEditTask(task.id)}>
            <Feather color="#334155" name="edit-2" size={14} />
          </Pressable>
          <Pressable
            accessibilityLabel={`Supprimer la tache ${task.title}`}
            className="ml-2 h-8 w-8 items-center justify-center rounded-lg bg-red-50"
            hitSlop={8}
            onPress={() => onDeleteTask(task.id)}>
            <Feather color="#b91c1c" name="trash-2" size={14} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
