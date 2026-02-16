import { Pressable, Text, View } from 'react-native';

type AuthFooterLinkProps = {
  prefixText: string;
  actionText: string;
  onPress: () => void;
};

export function AuthFooterLink({ prefixText, actionText, onPress }: AuthFooterLinkProps) {
  return (
    <View className="flex-row items-center justify-center">
      <Text className="text-lg text-slate-900">{prefixText}</Text>
      <Pressable className="ml-2" onPress={onPress}>
        <Text className="text-lg font-semibold text-brand-500">{actionText}</Text>
      </Pressable>
    </View>
  );
}
