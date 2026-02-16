import { Text, View } from 'react-native';

import { TopLeftOrbs } from '@/components/ui/top-left-orbs';
import { UserAvatar } from '@/components/ui/user-avatar';

type HomeHeaderProps = {
  userName: string;
  userInitials: string;
  avatarUri?: string;
};

export function HomeHeader({ userName, userInitials, avatarUri }: HomeHeaderProps) {
  return (
    <View className="relative overflow-hidden bg-brand-500 pb-10 pt-6">
      <TopLeftOrbs
        primaryClassName="bg-brand-200/75"
        secondaryClassName="bg-brand-100/60"
      />
      <View className="items-center px-6">
        <UserAvatar imageUri={avatarUri} name={userName || userInitials} size={112} />
        <Text className="mt-4 text-center text-4xl font-bold text-white">Welcome {userName}</Text>
      </View>
    </View>
  );
}
