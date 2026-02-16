import { Feather } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  Text,
  View,
} from 'react-native';

type DashboardSidebarProps = {
  isVisible: boolean;
  fullName: string;
  email: string;
  onClose: () => void;
  onOpenAccount: () => void;
};

export function DashboardSidebar({
  isVisible,
  fullName,
  email,
  onClose,
  onOpenAccount,
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
          <View className="mb-8 border-b border-slate-200 pb-5">
            <Text className="text-xl font-bold text-slate-900">{fullName}</Text>
            <Text className="mt-1 text-sm text-slate-500">{email}</Text>
          </View>

          <Pressable
            className="mb-4 flex-row items-center rounded-xl bg-slate-100 px-3 py-3"
            onPress={onOpenAccount}>
            <Feather color="#0f172a" name="user" size={18} />
            <Text className="ml-3 text-base font-semibold text-slate-900">Mon compte</Text>
          </Pressable>

          <Pressable
            className="flex-row items-center rounded-xl px-3 py-3"
            onPress={onClose}>
            <Feather color="#334155" name="x" size={18} />
            <Text className="ml-3 text-base font-medium text-slate-700">Fermer</Text>
          </Pressable>
        </Animated.View>

        <Pressable className="flex-1 bg-black/35" onPress={onClose} />
      </View>
    </Modal>
  );
}
