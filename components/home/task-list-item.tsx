import { Pressable, Text, View } from 'react-native';

import { AppCheckbox } from '@/components/ui/app-checkbox';
import type { TodoTask } from '@/types/task';

type TaskListItemProps = {
  task: TodoTask;
  onToggleTask: (taskId: string) => void;
};

export function TaskListItem({ task, onToggleTask }: TaskListItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className="flex-row items-center py-2"
      onPress={() => onToggleTask(task.id)}>
      <AppCheckbox
        accessibilityLabel={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
        checked={task.completed}
        onPress={() => onToggleTask(task.id)}
      />
      <View className="ml-3 flex-1 flex-row items-center justify-between">
        <Text
          className={`text-xl font-medium ${
            task.completed ? 'text-slate-400 line-through' : 'text-slate-700'
          }`}>
          {task.title}
        </Text>
        <Text className="ml-3 text-lg font-semibold text-slate-500">{task.dueLabel}</Text>
      </View>
    </Pressable>
  );
}
