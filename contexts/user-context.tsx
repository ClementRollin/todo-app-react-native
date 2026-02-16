import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatarUri: string;
};

type UserContextValue = {
  profile: UserProfile;
  fullName: string;
  replaceProfile: (nextProfile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
};

const DEFAULT_PROFILE: UserProfile = {
  firstName: 'Jeegar',
  lastName: 'Goyani',
  email: 'jeegar@example.com',
  password: '123456',
  avatarUri: '',
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

type UserProviderProps = {
  children: ReactNode;
};

export function UserProvider({ children }: UserProviderProps) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  const value = useMemo<UserContextValue>(
    () => ({
      profile,
      fullName: `${profile.firstName} ${profile.lastName}`.trim(),
      replaceProfile: (nextProfile) => setProfile(nextProfile),
      updateProfile: (updates) => setProfile((previous) => ({ ...previous, ...updates })),
    }),
    [profile]
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
