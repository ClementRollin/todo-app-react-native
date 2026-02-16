import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { View } from 'react-native';

type AuthIllustrationProps = {
  variant: 'splash' | 'welcome';
};

export function AuthIllustration({ variant }: AuthIllustrationProps) {
  if (variant === 'welcome') {
    return (
      <View className="relative h-48 w-56 items-center justify-center">
        <View className="absolute left-10 top-8 h-24 w-24 rounded-full bg-brand-200/70" />
        <View className="absolute right-8 top-6 h-20 w-20 rounded-full bg-brand-100/70" />
        <View className="absolute bottom-5 left-8 h-20 w-20 items-center justify-center rounded-full bg-[#ffd0d5]">
          <MaterialCommunityIcons color="#f06578" name="face-woman" size={42} />
        </View>
        <View className="absolute bottom-4 right-8 h-20 w-20 items-center justify-center rounded-full bg-[#d5f5f7]">
          <MaterialCommunityIcons color="#2eaab1" name="face-man-profile" size={40} />
        </View>
      </View>
    );
  }

  return (
    <View className="relative h-56 w-64 items-center justify-center">
      <View className="absolute -left-1 top-28 h-[2px] w-44 bg-slate-400" />
      <View className="absolute right-3 top-6 h-16 w-16 rounded-xl border border-slate-400 bg-white" />
      <View className="absolute left-20 top-14 h-16 w-16 rounded-xl border border-slate-400 bg-white" />
      <View className="absolute right-0 top-24 h-16 w-16 rounded-xl border border-slate-400 bg-white" />

      <View className="absolute right-1 top-4 h-7 w-7 items-center justify-center rounded-full bg-slate-700">
        <Feather color="#ffffff" name="check" size={14} />
      </View>
      <View className="absolute left-[74px] top-12 h-7 w-7 items-center justify-center rounded-full bg-brand-500">
        <Feather color="#ffffff" name="check" size={14} />
      </View>
      <View className="absolute right-6 top-[84px] h-7 w-7 items-center justify-center rounded-full bg-slate-700">
        <Feather color="#ffffff" name="check" size={14} />
      </View>

      <View className="absolute bottom-0 left-10 h-28 w-20 items-center justify-end">
        <View className="h-8 w-8 rounded-full bg-[#374151]" />
        <View className="-mt-1 h-12 w-12 rounded-t-3xl bg-brand-500" />
        <View className="-mt-1 h-10 w-8 rounded-b-lg bg-slate-800" />
      </View>
    </View>
  );
}
