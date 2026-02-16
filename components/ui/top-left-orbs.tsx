import { View } from 'react-native';

type TopLeftOrbsProps = {
  className?: string;
  primaryClassName?: string;
  secondaryClassName?: string;
};

export function TopLeftOrbs({
  className = '',
  primaryClassName = 'bg-white/45',
  secondaryClassName = 'bg-white/30',
}: TopLeftOrbsProps) {
  return (
    <View className={`absolute left-0 top-0 ${className}`} pointerEvents="none">
      <View className={`absolute -left-24 -top-20 h-64 w-64 rounded-full ${secondaryClassName}`} />
      <View className={`absolute -left-20 -top-12 h-52 w-52 rounded-full ${primaryClassName}`} />
    </View>
  );
}
