import { Text } from 'react-native';

type SectionTitleProps = {
  title: string;
  className?: string;
};

export function SectionTitle({ title, className = '' }: SectionTitleProps) {
  return <Text className={`text-2xl font-bold text-slate-900 ${className}`}>{title}</Text>;
}
