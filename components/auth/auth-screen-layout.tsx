import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopLeftOrbs } from '@/components/ui/top-left-orbs';

type AuthScreenLayoutProps = {
  children: ReactNode;
};

export function AuthScreenLayout({ children }: AuthScreenLayoutProps) {
  return (
    <SafeAreaView className="flex-1 bg-surface-100" edges={['top', 'bottom']}>
      <View className="absolute left-0 top-0">
        <TopLeftOrbs primaryClassName="bg-brand-200/75" secondaryClassName="bg-brand-100/70" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 px-6 pb-8 pt-8">{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
