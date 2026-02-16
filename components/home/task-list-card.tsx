import { Feather } from '@expo/vector-icons';
import { FlatList, Pressable, Text, View } from 'react-native';

import { TaskListItem } from '@/components/home/task-list-item';
import { AppCard } from '@/components/ui/app-card';
import type { TodoTask } from '@/types/task';

type TaskListCardProps = {
  tasks: TodoTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: () => void;
  className?: string;
};

export function TaskListCard({ tasks, onToggleTask, onAddTask, className = '' }: TaskListCardProps) {
  return (
    <AppCard className={`pb-4 ${className}`}>
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-2xl font-semibold text-slate-700">Daily Task</Text>
        <Pressable
          accessibilityLabel="Add a new task"
          className="h-11 w-11 items-center justify-center rounded-xl"
          hitSlop={8}
          onPress={onAddTask}>
          <Feather color="#55bdc4" name="plus" size={34} />
        </Pressable>
      </View>

      <FlatList
        contentContainerStyle={{ paddingBottom: 8 }}
        data={tasks}
        keyExtractor={(task) => task.id}
        renderItem={({ item }) => <TaskListItem onToggleTask={onToggleTask} task={item} />}
        showsVerticalScrollIndicator
        style={{ maxHeight: 260 }}
      />
    </AppCard>
  );
}
