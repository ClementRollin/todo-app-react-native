import { Feather } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { TopLeftOrbs } from '@/components/ui/top-left-orbs';
import { UserAvatar } from '@/components/ui/user-avatar';

type HomeHeaderProps = {
  fullName: string;
  greeting: string;
  avatarUri?: string;
  onPressMenu: () => void;
};

export function HomeHeader({ fullName, greeting, avatarUri, onPressMenu }: HomeHeaderProps) {
  return (
    <View className="relative overflow-hidden bg-brand-500 pb-8 pt-5">
      <TopLeftOrbs
        primaryClassName="bg-brand-200/75"
        secondaryClassName="bg-brand-100/60"
      />
      <Pressable
        accessibilityLabel="Ouvrir le menu"
        className="absolute right-5 top-5 z-10 h-9 w-9 items-center justify-center rounded-lg bg-white/20"
        onPress={onPressMenu}>
        <Feather color="#ffffff" name="menu" size={20} />
      </Pressable>
      <View className="items-center px-6">
        <UserAvatar imageUri={avatarUri} name={fullName} size={96} />
        <Text className="mt-4 text-center text-2xl font-bold text-white">
          {greeting} {fullName}
        </Text>
      </View>
    </View>
  );
}
