import { Pressable, Text } from 'react-native';

type AuthPrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
};

export function AuthPrimaryButton({
  label,
  onPress,
  disabled = false,
  variant = 'primary',
}: AuthPrimaryButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      className={`h-14 items-center justify-center rounded-2xl border ${
        isPrimary
          ? disabled
            ? 'border-brand-500/50 bg-brand-500/50'
            : 'border-brand-500 bg-brand-500'
          : disabled
            ? 'border-brand-500/50 bg-transparent'
            : 'border-brand-500 bg-transparent'
      }`}
      disabled={disabled}
      onPress={onPress}>
      <Text className={`text-xl font-bold ${isPrimary ? 'text-white' : 'text-brand-500'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
