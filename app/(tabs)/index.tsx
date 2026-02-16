import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { AnalogClock } from '@/components/home/analog-clock';
import { DashboardSidebar } from '@/components/home/dashboard-sidebar';
import { HomeHeader } from '@/components/home/home-header';
import { TaskListCard } from '@/components/home/task-list-card';
import { SectionTitle } from '@/components/ui/section-title';
import { INITIAL_TASKS } from '@/constants/home-data';
import { useUser } from '@/contexts/user-context';
import type { TodoTask } from '@/types/task';

function getGreeting(date: Date) {
  const hour = date.getHours();
  if (hour < 12) {
    return 'Bonjour';
  }
  if (hour < 18) {
    return 'Bon apres-midi';
  }
  return 'Bonsoir';
}

export default function HomeScreen() {
  const router = useRouter();
  const { profile, fullName } = useUser();
  const [tasks, setTasks] = useState<TodoTask[]>(INITIAL_TASKS);
  const [now, setNow] = useState(() => new Date());
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const greeting = useMemo(() => getGreeting(now), [now]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60_000);
    return () => clearInterval(timer);
  }, []);

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
        title: `Nouvelle tache ${previousTasks.length + 1}`,
        dueLabel: "Aujourd'hui",
        completed: false,
      },
      ...previousTasks,
    ]);
  };

  const handleOpenAccount = () => {
    setSidebarVisible(false);
    router.push('/account');
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-100" edges={['top']}>
      <View className="flex-1">
        <HomeHeader
          avatarUri={profile.avatarUri}
          fullName={fullName}
          greeting={greeting}
          onPressMenu={() => setSidebarVisible(true)}
        />

        <DashboardSidebar
          currentScreen="dashboard"
          email={profile.email}
          fullName={fullName}
          isVisible={isSidebarVisible}
          onClose={() => setSidebarVisible(false)}
          onOpenAccount={handleOpenAccount}
          onOpenDashboard={() => setSidebarVisible(false)}
          onLogout={() => {
            setSidebarVisible(false);
            router.replace('/login');
          }}
        />

        <View className="flex-1 px-6 pb-6 pt-5">
          <View className="items-center">
            <AnalogClock />
          </View>

          <SectionTitle className="mt-6" title="Liste des taches" />

          <TaskListCard className="mt-4" onAddTask={handleAddTask} onToggleTask={handleToggleTask} tasks={tasks} />
        </View>
      </View>
    </SafeAreaView>
  );
}
