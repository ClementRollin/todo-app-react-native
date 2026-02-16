import { Feather } from '@expo/vector-icons';
import { Pressable } from 'react-native';

type AppCheckboxProps = {
  checked: boolean;
  onPress: () => void;
  accessibilityLabel: string;
};

export function AppCheckbox({ checked, onPress, accessibilityLabel }: AppCheckboxProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      className={`h-6 w-6 items-center justify-center border-2 ${
        checked ? 'border-brand-500 bg-brand-500' : 'border-slate-700 bg-transparent'
      }`}
      hitSlop={8}
      onPress={onPress}>
      {checked ? <Feather color="#ffffff" name="check" size={14} /> : null}
    </Pressable>
  );
}
