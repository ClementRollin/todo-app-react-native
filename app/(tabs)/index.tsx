import { useEffect, useMemo, useState } from 'react';
import { Alert, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { AnalogClock } from '@/components/home/analog-clock';
import { DashboardSidebar } from '@/components/home/dashboard-sidebar';
import { HomeHeader } from '@/components/home/home-header';
import { TaskListCard } from '@/components/home/task-list-card';
import { TaskEditorModal } from '@/components/home/task-editor-modal';
import { SectionTitle } from '@/components/ui/section-title';
import { useUser } from '@/contexts/user-context';

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
  const {
    profile,
    fullName,
    tasks,
    isHydrated,
    isAuthenticated,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    logout,
  } = useUser();
  const [now, setNow] = useState(() => new Date());
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isTaskEditorVisible, setTaskEditorVisible] = useState(false);
  const [taskEditorMode, setTaskEditorMode] = useState<'create' | 'edit'>('create');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftDueAt, setDraftDueAt] = useState(() => new Date());
  const [taskFormError, setTaskFormError] = useState<string | null>(null);
  const greeting = useMemo(() => getGreeting(now), [now]);
  const sortedTasks = useMemo(
    () =>
      [...tasks].sort((a, b) => {
        const aTime = new Date(a.dueAt).getTime();
        const bTime = new Date(b.dueAt).getTime();
        return aTime - bTime;
      }),
    [tasks]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isHydrated, router]);

  const handleToggleTask = async (taskId: string) => {
    await toggleTask(taskId);
  };

  const resetTaskEditor = () => {
    setEditingTaskId(null);
    setDraftTitle('');
    setDraftDueAt(new Date());
    setTaskFormError(null);
  };

  const handleOpenCreateTask = () => {
    setTaskEditorMode('create');
    resetTaskEditor();
    setTaskEditorVisible(true);
  };

  const handleOpenEditTask = (taskId: string) => {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) {
      return;
    }
    setTaskEditorMode('edit');
    setEditingTaskId(task.id);
    setDraftTitle(task.title);
    setDraftDueAt(new Date(task.dueAt));
    setTaskFormError(null);
    setTaskEditorVisible(true);
  };

  const handleCloseTaskEditor = () => {
    setTaskEditorVisible(false);
    setTaskFormError(null);
  };

  const handleSubmitTaskEditor = async () => {
    const normalizedTitle = draftTitle.trim();
    const normalizedDueAt = draftDueAt.toISOString();

    if (!normalizedTitle) {
      setTaskFormError('Le titre est obligatoire.');
      return;
    }

    if (taskEditorMode === 'create') {
      await createTask({
        title: normalizedTitle,
        dueAt: normalizedDueAt,
      });
    } else if (editingTaskId) {
      await updateTask(editingTaskId, {
        title: normalizedTitle,
        dueAt: normalizedDueAt,
      });
    }

    setTaskEditorVisible(false);
    resetTaskEditor();
  };

  const handleDeleteTask = (taskId: string) => {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) {
      return;
    }

    Alert.alert('Supprimer la tache', `Confirmer la suppression de "${task.title}" ?`, [
      {
        text: 'Annuler',
        style: 'cancel',
      },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: () => {
          void deleteTask(taskId);
        },
      },
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
          onLogout={async () => {
            setSidebarVisible(false);
            await logout();
            router.replace('/login');
          }}
        />

        <View className="flex-1 px-6 pb-6 pt-5">
          <View className="items-center">
            <AnalogClock />
          </View>

          <SectionTitle className="mt-6" title="Liste des taches" />

          <TaskListCard
            className="mt-4"
            onAddTask={handleOpenCreateTask}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleOpenEditTask}
            onToggleTask={handleToggleTask}
            tasks={sortedTasks}
          />
        </View>
      </View>

      <TaskEditorModal
        dueAtValue={draftDueAt}
        errorMessage={taskFormError}
        isVisible={isTaskEditorVisible}
        mode={taskEditorMode}
        onChangeDueAt={(value) => {
          setDraftDueAt(value);
          if (taskFormError) {
            setTaskFormError(null);
          }
        }}
        onChangeTitle={(value) => {
          setDraftTitle(value);
          if (taskFormError) {
            setTaskFormError(null);
          }
        }}
        onClose={handleCloseTaskEditor}
        onSubmit={handleSubmitTaskEditor}
        titleValue={draftTitle}
      />
    </SafeAreaView>
  );
}
