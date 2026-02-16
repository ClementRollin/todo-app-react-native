import { Feather } from '@expo/vector-icons';
import { FlatList, Pressable, Text, View } from 'react-native';

import { TaskListItem } from '@/components/home/task-list-item';
import { AppCard } from '@/components/ui/app-card';
import type { TodoTask } from '@/types/task';

type TaskListCardProps = {
  tasks: TodoTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: () => void;
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  className?: string;
};

export function TaskListCard({
  tasks,
  onToggleTask,
  onAddTask,
  onEditTask,
  onDeleteTask,
  className = '',
}: TaskListCardProps) {
  return (
    <AppCard className={`pb-4 ${className}`}>
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-slate-700">Taches du jour</Text>
        <Pressable
          accessibilityLabel="Ajouter une nouvelle tache"
          className="h-10 w-10 items-center justify-center rounded-xl"
          hitSlop={8}
          onPress={onAddTask}>
          <Feather color="#55bdc4" name="plus" size={28} />
        </Pressable>
      </View>

      <FlatList
        contentContainerStyle={{ paddingBottom: 8 }}
        data={tasks}
        keyExtractor={(task) => task.id}
        ListEmptyComponent={
          <Text className="py-5 text-center text-sm text-slate-500">
            Aucune tache pour le moment. Ajoute-en une avec le bouton +
          </Text>
        }
        renderItem={({ item }) => (
          <TaskListItem
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
            onToggleTask={onToggleTask}
            task={item}
          />
        )}
        showsVerticalScrollIndicator
        style={{ maxHeight: 260 }}
      />
    </AppCard>
  );
}
