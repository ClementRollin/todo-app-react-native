import { Feather } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  Text,
  View,
} from 'react-native';

type SidebarScreen = 'dashboard' | 'account';

type DashboardSidebarProps = {
  isVisible: boolean;
  fullName: string;
  email: string;
  currentScreen: SidebarScreen;
  onClose: () => void;
  onOpenAccount: () => void;
  onOpenDashboard: () => void;
  onLogout: () => void;
};

export function DashboardSidebar({
  isVisible,
  fullName,
  email,
  currentScreen,
  onClose,
  onOpenAccount,
  onOpenDashboard,
  onLogout,
}: DashboardSidebarProps) {
  const slide = useRef(new Animated.Value(-300)).current;

  useEffect(() => {
    Animated.timing(slide, {
      toValue: isVisible ? 0 : -300,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [isVisible, slide]);

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={isVisible}>
      <View className="flex-1 flex-row">
        <Animated.View
          className="h-full w-[280px] bg-white px-5 pb-8 pt-12"
          style={{ transform: [{ translateX: slide }] }}>
          <View className="mb-6 border-b border-slate-200 pb-4">
            <View className="flex-row items-start justify-between">
              <View className="pr-2">
                <Text className="text-xl font-bold text-slate-900">{fullName}</Text>
                <Text className="mt-1 text-sm text-slate-500">{email}</Text>
              </View>
              <Pressable className="rounded-lg p-1" onPress={onClose}>
                <Feather color="#334155" name="x" size={18} />
              </Pressable>
            </View>
          </View>

          <Pressable
            className={`mb-2 flex-row items-center rounded-xl px-3 py-3 ${
              currentScreen === 'dashboard' ? 'bg-slate-100' : 'bg-transparent'
            }`}
            onPress={onOpenDashboard}>
            <Feather color="#0f172a" name="home" size={18} />
            <Text className="ml-3 text-base font-semibold text-slate-900">Dashboard</Text>
          </Pressable>

          <Pressable
            className={`mb-2 flex-row items-center rounded-xl px-3 py-3 ${
              currentScreen === 'account' ? 'bg-slate-100' : 'bg-transparent'
            }`}
            onPress={onOpenAccount}>
            <Feather color="#0f172a" name="user" size={18} />
            <Text className="ml-3 text-base font-semibold text-slate-900">Mon compte</Text>
          </Pressable>

          <View className="flex-1" />

          <Pressable
            className="flex-row items-center rounded-xl border border-red-100 bg-red-50 px-3 py-3"
            onPress={onLogout}>
            <Feather color="#b91c1c" name="log-out" size={18} />
            <Text className="ml-3 text-base font-semibold text-red-700">Deconnexion</Text>
          </Pressable>
        </Animated.View>

        <Pressable className="flex-1 bg-black/35" onPress={onClose} />
      </View>
    </Modal>
  );
}
