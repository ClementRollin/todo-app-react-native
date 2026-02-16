import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import type { TodoTask } from '@/types/task';

const STORAGE_KEY = 'todo-mini-backend-v1';

export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatarUri: string;
};

type StoredUser = UserProfile & {
  id: string;
  createdAt: string;
  updatedAt: string;
  tasks: TodoTask[];
};

type PersistedData = {
  users: StoredUser[];
  sessionUserId: string | null;
};

type RegisterPayload = UserProfile;
type LoginPayload = {
  email: string;
  password: string;
};

type ContextResult = {
  ok: boolean;
  error?: string;
};

type UserContextValue = {
  isHydrated: boolean;
  isAuthenticated: boolean;
  profile: UserProfile;
  fullName: string;
  tasks: TodoTask[];
  register: (payload: RegisterPayload) => Promise<ContextResult>;
  login: (payload: LoginPayload) => Promise<ContextResult>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<ContextResult>;
  createTask: (payload: { title: string; dueAt: string }) => Promise<void>;
  updateTask: (
    taskId: string,
    updates: Partial<Pick<TodoTask, 'title' | 'dueAt' | 'completed'>>
  ) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
};

const EMPTY_PROFILE: UserProfile = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  avatarUri: '',
};

const EMPTY_DATA: PersistedData = {
  users: [],
  sessionUserId: null,
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

type UserProviderProps = {
  children: ReactNode;
};

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function safeParsePersistedData(value: string | null): PersistedData {
  if (!value) {
    return EMPTY_DATA;
  }
  try {
    const parsed = JSON.parse(value) as PersistedData;
    if (!parsed || !Array.isArray(parsed.users)) {
      return EMPTY_DATA;
    }
    return {
      users: parsed.users,
      sessionUserId: parsed.sessionUserId ?? null,
    };
  } catch {
    return EMPTY_DATA;
  }
}

export function UserProvider({ children }: UserProviderProps) {
  const [data, setData] = useState<PersistedData>(EMPTY_DATA);
  const [isHydrated, setHydrated] = useState(false);
  const dataRef = useRef<PersistedData>(EMPTY_DATA);

  const persist = useCallback(async (nextData: PersistedData) => {
    dataRef.current = nextData;
    setData(nextData);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
  }, []);

  useEffect(() => {
    let isMounted = true;
    const hydrate = async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed = safeParsePersistedData(raw);
      if (!isMounted) {
        return;
      }
      dataRef.current = parsed;
      setData(parsed);
      setHydrated(true);
    };

    void hydrate();

    return () => {
      isMounted = false;
    };
  }, []);

  const currentUser = useMemo(
    () => data.users.find((user) => user.id === data.sessionUserId) ?? null,
    [data]
  );

  const register = useCallback(
    async (payload: RegisterPayload): Promise<ContextResult> => {
      const email = normalizeEmail(payload.email);
      const emailAlreadyUsed = dataRef.current.users.some(
        (user) => normalizeEmail(user.email) === email
      );
      if (emailAlreadyUsed) {
        return {
          ok: false,
          error: 'Un compte avec cet email existe deja.',
        };
      }

      const nextUser: StoredUser = {
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        firstName: payload.firstName.trim(),
        lastName: payload.lastName.trim(),
        email: payload.email.trim(),
        password: payload.password,
        avatarUri: payload.avatarUri.trim(),
        tasks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const nextData: PersistedData = {
        users: [nextUser, ...dataRef.current.users],
        sessionUserId: nextUser.id,
      };
      await persist(nextData);
      return { ok: true };
    },
    [persist]
  );

  const login = useCallback(
    async ({ email, password }: LoginPayload): Promise<ContextResult> => {
      const normalizedEmail = normalizeEmail(email);
      const user = dataRef.current.users.find(
        (entry) =>
          normalizeEmail(entry.email) === normalizedEmail && entry.password === password
      );

      if (!user) {
        return {
          ok: false,
          error: 'Email ou mot de passe incorrect.',
        };
      }

      const nextData: PersistedData = {
        ...dataRef.current,
        sessionUserId: user.id,
      };
      await persist(nextData);
      return { ok: true };
    },
    [persist]
  );

  const logout = useCallback(async () => {
    const nextData: PersistedData = {
      ...dataRef.current,
      sessionUserId: null,
    };
    await persist(nextData);
  }, [persist]);

  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>): Promise<ContextResult> => {
      const userId = dataRef.current.sessionUserId;
      if (!userId) {
        return { ok: false, error: 'Aucun utilisateur connecte.' };
      }

      const current = dataRef.current.users.find((entry) => entry.id === userId);
      if (!current) {
        return { ok: false, error: 'Utilisateur introuvable.' };
      }

      const targetEmail = updates.email ? normalizeEmail(updates.email) : normalizeEmail(current.email);
      const emailConflict = dataRef.current.users.some(
        (entry) => entry.id !== userId && normalizeEmail(entry.email) === targetEmail
      );
      if (emailConflict) {
        return {
          ok: false,
          error: 'Cet email est deja utilise par un autre compte.',
        };
      }

      const nextUsers = dataRef.current.users.map((entry) =>
        entry.id === userId
          ? {
              ...entry,
              ...updates,
              firstName: updates.firstName?.trim() ?? entry.firstName,
              lastName: updates.lastName?.trim() ?? entry.lastName,
              email: updates.email?.trim() ?? entry.email,
              avatarUri: updates.avatarUri?.trim() ?? entry.avatarUri,
              updatedAt: new Date().toISOString(),
            }
          : entry
      );

      await persist({
        ...dataRef.current,
        users: nextUsers,
      });
      return { ok: true };
    },
    [persist]
  );

  const createTask = useCallback(
    async (payload: { title: string; dueAt: string }) => {
      const userId = dataRef.current.sessionUserId;
      if (!userId) {
        return;
      }
      const nextUsers = dataRef.current.users.map((entry) =>
        entry.id === userId
          ? {
              ...entry,
              updatedAt: new Date().toISOString(),
              tasks: [
                ...entry.tasks,
                {
                  id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                  title: payload.title.trim(),
                  dueAt: payload.dueAt,
                  completed: false,
                },
              ],
            }
          : entry
      );
      await persist({
        ...dataRef.current,
        users: nextUsers,
      });
    },
    [persist]
  );

  const updateTask = useCallback(
    async (
      taskId: string,
      updates: Partial<Pick<TodoTask, 'title' | 'dueAt' | 'completed'>>
    ) => {
      const userId = dataRef.current.sessionUserId;
      if (!userId) {
        return;
      }
      const nextUsers = dataRef.current.users.map((entry) =>
        entry.id === userId
          ? {
              ...entry,
              updatedAt: new Date().toISOString(),
              tasks: entry.tasks.map((task) =>
                task.id === taskId
                  ? {
                      ...task,
                      ...updates,
                      title: updates.title?.trim() ?? task.title,
                    }
                  : task
              ),
            }
          : entry
      );

      await persist({
        ...dataRef.current,
        users: nextUsers,
      });
    },
    [persist]
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      const userId = dataRef.current.sessionUserId;
      if (!userId) {
        return;
      }
      const nextUsers = dataRef.current.users.map((entry) =>
        entry.id === userId
          ? {
              ...entry,
              updatedAt: new Date().toISOString(),
              tasks: entry.tasks.filter((task) => task.id !== taskId),
            }
          : entry
      );
      await persist({
        ...dataRef.current,
        users: nextUsers,
      });
    },
    [persist]
  );

  const toggleTask = useCallback(
    async (taskId: string) => {
      const userId = dataRef.current.sessionUserId;
      if (!userId) {
        return;
      }
      const nextUsers = dataRef.current.users.map((entry) =>
        entry.id === userId
          ? {
              ...entry,
              updatedAt: new Date().toISOString(),
              tasks: entry.tasks.map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
              ),
            }
          : entry
      );
      await persist({
        ...dataRef.current,
        users: nextUsers,
      });
    },
    [persist]
  );

  const value = useMemo<UserContextValue>(
    () => ({
      isHydrated,
      isAuthenticated: Boolean(currentUser),
      profile: currentUser
        ? {
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            password: currentUser.password,
            avatarUri: currentUser.avatarUri,
          }
        : EMPTY_PROFILE,
      fullName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}`.trim() : '',
      tasks: currentUser?.tasks ?? [],
      register,
      login,
      logout,
      updateProfile,
      createTask,
      updateTask,
      deleteTask,
      toggleTask,
    }),
    [
      createTask,
      currentUser,
      deleteTask,
      isHydrated,
      login,
      logout,
      register,
      toggleTask,
      updateProfile,
      updateTask,
    ]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider.');
  }
  return context;
}
