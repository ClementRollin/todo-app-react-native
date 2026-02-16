import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnalogClock } from '@/components/home/analog-clock';
import { HomeHeader } from '@/components/home/home-header';
import { TaskListCard } from '@/components/home/task-list-card';
import { SectionTitle } from '@/components/ui/section-title';
import { HOME_PROFILE, INITIAL_TASKS } from '@/constants/home-data';
import type { TodoTask } from '@/types/task';

function getGreeting(date: Date) {
  const hour = date.getHours();
  if (hour < 12) {
    return 'Good Morning';
  }
  if (hour < 18) {
    return 'Good Afternoon';
  }
  return 'Good Evening';
}

export default function HomeScreen() {
  const [tasks, setTasks] = useState<TodoTask[]>(INITIAL_TASKS);
  const greeting = useMemo(() => getGreeting(new Date()), []);

  const handleToggleTask = (taskId: string) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleAddTask = () => {
    setTasks((previousTasks) => [
      {
        id: `task-${Date.now()}`,
        title: `New task ${previousTasks.length + 1}`,
        dueLabel: 'Today',
        completed: false,
      },
      ...previousTasks,
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-100" edges={['top']}>
      <View className="flex-1">
        <HomeHeader
          userInitials={HOME_PROFILE.initials}
          userName={HOME_PROFILE.name}
        />

        <View className="flex-1 px-6 pb-8 pt-6">
          <Text className="text-right text-3xl font-semibold text-slate-900">{greeting}</Text>

          <View className="mt-4 items-center">
            <AnalogClock />
          </View>

          <SectionTitle className="mt-8" title="Task list" />

          <TaskListCard className="mt-4" onAddTask={handleAddTask} onToggleTask={handleToggleTask} tasks={tasks} />
        </View>
      </View>
    </SafeAreaView>
  );
}
