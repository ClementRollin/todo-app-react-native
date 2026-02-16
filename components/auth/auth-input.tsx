import { TextInput, type TextInputProps } from 'react-native';

type AuthInputProps = TextInputProps;

export function AuthInput(props: AuthInputProps) {
  return (
    <TextInput
      className="h-14 rounded-full bg-white px-5 text-base text-slate-800"
      placeholderTextColor="#6B7280"
      {...props}
    />
  );
}
