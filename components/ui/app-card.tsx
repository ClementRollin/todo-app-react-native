import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

type AppCardProps = {
  children: ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export function AppCard({ children, className = '', style }: AppCardProps) {
  return (
    <View
      className={`rounded-3xl border border-slate-200 bg-white px-5 py-5 shadow-sm ${className}`}
      style={style}>
      {children}
    </View>
  );
}
